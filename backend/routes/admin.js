const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "danieloruma13@gmail.com";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return res.status(401).json({ error: "Invalid token" });
    console.log("Admin check — user email:", user.email, "| admin email:", ADMIN_EMAIL);
    if (user.email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase().trim()) {
      return res.status(403).json({ error: "Not authorized. Your email: " + user.email });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Auth failed: " + err.message });
  }
};

router.get("/stats", adminAuth, async (req, res) => {
  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    const { data: subs } = await supabase.from("subscriptions").select("*, plans(*)").eq("status", "active");
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const totalUsers = profiles?.length || 0;
    const activeTrials = profiles?.filter(p => new Date(p.trial_ends_at) > now).length || 0;
    const expiredTrials = profiles?.filter(p => new Date(p.trial_ends_at) <= now).length || 0;
    const payingUsers = subs?.length || 0;
    const newToday = profiles?.filter(p => new Date(p.created_at) >= today).length || 0;
    const revenue = subs?.reduce((sum, s) => sum + (s.plans?.price || 0), 0) || 0;
    const users = profiles?.map(p => {
      const sub = subs?.find(s => s.user_id === p.id);
      const trialActive = new Date(p.trial_ends_at) > now;
      const daysLeft = trialActive ? Math.ceil((new Date(p.trial_ends_at) - now) / (1000 * 60 * 60 * 24)) : 0;
      return {
        id: p.id,
        email: p.email,
        full_name: p.full_name,
        business_name: p.business_name,
        created_at: p.created_at,
        trial_ends_at: p.trial_ends_at,
        trialActive,
        daysLeft,
        plan: sub ? sub.plans?.display_name : trialActive ? "Trial" : "Expired",
        status: sub ? "paying" : trialActive ? "trial" : "expired",
      };
    });
    res.json({ totalUsers, activeTrials, expiredTrials, payingUsers, newToday, revenue, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/extend-trial", adminAuth, async (req, res) => {
  try {
    const { userId, days } = req.body;
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const { data: profile } = await supabase.from("profiles").select("trial_ends_at").eq("id", userId).single();
    const currentEnd = new Date(profile.trial_ends_at);
    const now = new Date();
    const baseDate = currentEnd > now ? currentEnd : now;
    const newEnd = new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000);
    const { error } = await supabase.from("profiles").update({ trial_ends_at: newEnd.toISOString() }).eq("id", userId);
    if (error) throw error;
    res.json({ success: true, newEnd });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/user/:id", adminAuth, async (req, res) => {
  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    await supabase.from("profiles").delete().eq("id", req.params.id);
    await supabase.auth.admin.deleteUser(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
