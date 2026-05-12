import { useState, useEffect, createContext, useContext, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || "https://bgsugomkwwzzfypsibrj.supabase.co",
  process.env.REACT_APP_SUPABASE_ANON_KEY || "your-anon-key"
);

// ─── SVG ICONS ────────────────────────────────
const Ic = ({ d, size = 20, color = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const HomeIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />;
const SearchIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M21 21l-4.35-4.35" />;
const BoxIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />;
const CardIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M1 4h22v16H1z M1 10h22" />;
const MenuIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M3 12h18 M3 6h18 M3 18h18" />;
const CloseIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M18 6L6 18 M6 6l12 12" />;
const UserIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />;
const StoreIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0" />;
const CalIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M16 2v4 M8 2v4 M3 10h18" />;
const ChartIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M12 20V10 M18 20V4 M6 20v-4" />;
const FileIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />;
const LogoutIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" />;
const BellIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0" />;
const CameraIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />;
const DollarIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />;
const ShieldIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const CheckIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M20 6L9 17l-5-5" />;
const ArrowIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M5 12h14 M12 5l7 7-7 7" />;
const TrendIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6" />;
const PlusIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M12 5v14 M5 12h14" />;
const TrashIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6" />;
const DownloadIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" />;
const EyeIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0" />;
const ShareIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13" />;
const BackIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M19 12H5 M12 19l-7-7 7-7" />;
const SettingsIc = ({ s = 20, c = "currentColor" }) => <Ic size={s} color={c} d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />;

// ─── PLANS ────────────────────────────────────
const PLANS = [
  { name: "starter", display: "Starter", price: 19, popular: false, desc: "Perfect for new dropshippers", features: ["1 Shopify store", "10 product imports/day", "Basic supplier monitoring", "Auto order fulfillment", "Email customer updates", "Profit dashboard", "3-day free trial"] },
  { name: "pro", display: "Pro", price: 49, popular: true, desc: "For growing dropshippers", features: ["3 Shopify stores", "50 product imports/day", "Advanced supplier alerts", "Auto order fulfillment", "Email + SMS updates", "Weekly profit reports", "Store scheduler", "Competitor tracking", "Priority support", "3-day free trial"] },
  { name: "business", display: "Business", price: 99, popular: false, desc: "For serious sellers scaling fast", features: ["Unlimited stores", "Unlimited imports", "Real-time supplier monitoring", "Auto order fulfillment", "Email + SMS + WhatsApp", "Custom profit reports", "Store scheduler", "Multi-store dashboard", "API access", "Dedicated support", "3-day free trial"] },
];

// ─── AUTH CONTEXT ─────────────────────────────
const AuthContext = createContext({});
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchProfile = async (uid) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
    if (data) {
      const trialEnd = new Date(data.trial_ends_at);
      const now = new Date();
      const trialActive = trialEnd > now;
      const daysLeft = trialActive ? Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24)) : 0;
      const { data: sub } = await supabase.from("subscriptions").select("*, plans(*)").eq("user_id", uid).eq("status", "active").maybeSingle();
      setProfile({ ...data, trialActive, daysLeft, subscription: sub || null, hasAccess: trialActive || !!sub });
    }
  };
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) await fetchProfile(session.user.id);
      else setProfile(null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    return { data, error };
  };
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };
  const signOut = async () => { await supabase.auth.signOut(); setProfile(null); };
  const updateProfile = async (updates) => {
    const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
    if (!error) await fetchProfile(user.id);
    return { error };
  };
  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
const useAuth = () => useContext(AuthContext);

// ─── SHARED STYLES ────────────────────────────
const S = {
  inp: { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "12px 14px", color: "#f0f4f8", fontFamily: "DM Sans,sans-serif", fontSize: "0.9rem", outline: "none", WebkitAppearance: "none", boxSizing: "border-box" },
  card: { background: "#0e1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20, marginBottom: 14 },
  btn: { background: "#00e5a0", color: "#000", border: "none", borderRadius: 10, padding: "13px 0", fontWeight: 600, fontSize: "0.92rem", cursor: "pointer", fontFamily: "DM Sans,sans-serif", width: "100%", display: "block" },
  label: { fontSize: "0.77rem", color: "#6b7a8d", fontWeight: 500, display: "block", marginBottom: 5 },
  err: { background: "rgba(255,77,77,0.08)", border: "1px solid rgba(255,77,77,0.2)", color: "#ff4d4d", padding: "10px 14px", borderRadius: 10, fontSize: "0.84rem", marginBottom: 14 },
  ok: { background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)", color: "#00e5a0", padding: "10px 14px", borderRadius: 10, fontSize: "0.84rem", marginBottom: 14 },
  heading: { fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#f0f4f8", marginBottom: 4 },
  sub: { color: "#6b7a8d", fontSize: "0.82rem", marginBottom: 20 },
};

// ─── COMING SOON BANNER ───────────────────────
const ComingSoon = ({ title, icon, desc }) => (
  <div style={{ textAlign: "center", padding: "40px 20px" }}>
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>{icon}</div>
    <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#f0f4f8", marginBottom: 8 }}>{title}</div>
    <p style={{ color: "#6b7a8d", fontSize: "0.86rem", lineHeight: 1.7, maxWidth: 280, margin: "0 auto 20px" }}>{desc}</p>
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)", color: "#00e5a0", padding: "8px 18px", borderRadius: 100, fontSize: "0.8rem", fontWeight: 600 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00e5a0", display: "inline-block", animation: "pulse 2s infinite" }} />
      Coming Soon
    </div>
    <p style={{ color: "#6b7a8d", fontSize: "0.76rem", marginTop: 12 }}>Will be activated when Shopify and supplier APIs are connected.</p>
  </div>
);

// ─── TOGGLE ───────────────────────────────────
const Toggle = ({ on, toggle }) => (
  <button onClick={toggle} style={{ width: 44, height: 24, borderRadius: 100, border: "none", cursor: "pointer", background: on ? "#00e5a0" : "rgba(255,255,255,0.1)", position: "relative", transition: "background 0.3s", flexShrink: 0 }}>
    <span style={{ position: "absolute", width: 18, height: 18, borderRadius: "50%", background: "white", top: 3, left: on ? 23 : 3, transition: "left 0.3s", display: "block" }} />
  </button>
);

// ─── NAV ──────────────────────────────────────
const Nav = ({ setPage }) => {
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const initials = profile?.full_name ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "D";
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(8,11,16,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div onClick={() => { setPage("landing"); setOpen(false); }} style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.3rem", cursor: "pointer", color: "#f0f4f8" }}>Dan<span style={{ color: "#00e5a0" }}>drop</span></div>
      {user ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setPage("dashboard")} style={{ background: "none", border: "none", color: "#6b7a8d", fontFamily: "DM Sans,sans-serif", fontSize: "0.85rem", cursor: "pointer", padding: "6px 10px" }}>Dashboard</button>
          <div onClick={() => setPage("profile")} style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#00e5a0,#00b8ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.8rem", color: "#000", cursor: "pointer", overflow: "hidden", border: "2px solid rgba(0,229,160,0.3)" }}>
            {profile?.avatar_url ? <img src={profile.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
          </div>
        </div>
      ) : (
        <>
          <button onClick={() => setOpen(!open)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f0f4f8", padding: "7px 10px", cursor: "pointer", display: "flex", alignItems: "center" }}>
            {open ? <CloseIc /> : <MenuIc />}
          </button>
          {open && (
            <div style={{ position: "fixed", top: 58, left: 0, right: 0, background: "#0e1318", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "16px 20px", zIndex: 99 }}>
              {[["features", "Features"], ["pricing", "Pricing"], ["about", "About"], ["contact", "Contact"]].map(([p, l]) => (
                <button key={p} onClick={() => { setPage(p); setOpen(false); }} style={{ background: "none", border: "none", color: "#6b7a8d", fontFamily: "DM Sans,sans-serif", fontSize: "0.9rem", cursor: "pointer", padding: "11px 0", textAlign: "left", width: "100%", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "block" }}>{l}</button>
              ))}
              <button onClick={() => { setPage("login"); setOpen(false); }} style={{ background: "none", border: "none", color: "#6b7a8d", fontFamily: "DM Sans,sans-serif", fontSize: "0.9rem", cursor: "pointer", padding: "11px 0", textAlign: "left", width: "100%", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "block" }}>Sign in</button>
              <button onClick={() => { setPage("signup"); setOpen(false); }} style={{ ...S.btn, marginTop: 10, borderRadius: 10, padding: "12px 0" }}>Start Free Trial</button>
            </div>
          )}
        </>
      )}
    </nav>
  );
};

// ─── PRICING CARDS ────────────────────────────
const PricingCards = ({ setPage }) => {
  const { user } = useAuth();
  const go = (plan) => {
    if (!user) { setPage("signup"); return; }
    alert("Redirecting to checkout for " + plan.display + " — $" + plan.price + "/mo");
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {PLANS.map(plan => (
        <div key={plan.name} style={{ background: "#0e1318", border: plan.popular ? "1px solid rgba(0,229,160,0.3)" : "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 22, position: "relative" }}>
          {plan.popular && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#00e5a0", color: "#000", padding: "3px 14px", borderRadius: 100, fontSize: "0.7rem", fontWeight: 700, whiteSpace: "nowrap" }}>Most Popular</div>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 1, color: "#6b7a8d", fontWeight: 600, marginBottom: 4 }}>{plan.display}</div>
              <div style={{ fontFamily: "Syne,sans-serif", fontSize: "2rem", fontWeight: 800, color: "#f0f4f8" }}>${plan.price}<span style={{ fontSize: "0.85rem", fontWeight: 400, color: "#6b7a8d" }}>/mo</span></div>
              <p style={{ color: "#6b7a8d", fontSize: "0.78rem", marginTop: 3 }}>{plan.desc}</p>
            </div>
            <button onClick={() => go(plan)} style={{ background: "#00e5a0", color: "#000", border: "none", borderRadius: 10, padding: "10px 16px", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", fontFamily: "DM Sans,sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}>
              {user ? "Upgrade" : "Start Free"}
            </button>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {plan.features.map(f => (
              <li key={f} style={{ fontSize: "0.82rem", color: "#6b7a8d", display: "flex", gap: 9, alignItems: "flex-start" }}>
                <span style={{ color: "#00e5a0", flexShrink: 0, marginTop: 2 }}><CheckIc s={13} c="#00e5a0" /></span>{f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

// ─── AUTH PAGES ───────────────────────────────
const SignupPage = ({ setPage }) => {
  const { signUp } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const submit = async () => {
    if (!form.name || !form.email || !form.password) { setError("Please fill in all fields"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setError(""); setLoading(true);
    const { error: err } = await signUp(form.email, form.password, form.name);
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSuccess(true);
    setTimeout(() => setPage("dashboard"), 1500);
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px 40px", background: "#080b10" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div onClick={() => setPage("landing")} style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.8rem", textAlign: "center", marginBottom: 4, cursor: "pointer", color: "#f0f4f8" }}>Dan<span style={{ color: "#00e5a0" }}>drop</span></div>
        <p style={{ textAlign: "center", color: "#6b7a8d", fontSize: "0.82rem", marginBottom: 24 }}>Automate your dropshipping store</p>
        <div style={S.card}>
          <div style={S.heading}>Create your account</div>
          <p style={S.sub}>3-day free trial. No credit card required.</p>
          <div style={{ background: "rgba(0,229,160,0.06)", border: "1px solid rgba(0,229,160,0.15)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: "0.81rem", color: "#6b7a8d", lineHeight: 1.5 }}>
            <strong style={{ color: "#00e5a0" }}>3 days full access</strong> — all features. Plans from <strong style={{ color: "#00e5a0" }}>$19/mo</strong> after.
          </div>
          {error && <div style={S.err}>{error}</div>}
          {success && <div style={S.ok}>Account created! Redirecting...</div>}
          {[["Full Name", "text", "Daniel Smith", "name"], ["Email Address", "email", "daniel@email.com", "email"], ["Password", "password", "Min 6 characters", "password"]].map(([label, type, ph, key]) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={S.label}>{label}</label>
              <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={S.inp} />
            </div>
          ))}
          <button onClick={submit} disabled={loading} style={{ ...S.btn, opacity: loading ? 0.6 : 1 }}>{loading ? "Creating account..." : "Start Free Trial"}</button>
          <div style={{ textAlign: "center", marginTop: 16, fontSize: "0.83rem", color: "#6b7a8d" }}>
            Already have an account? <button onClick={() => setPage("login")} style={{ background: "none", border: "none", color: "#00e5a0", cursor: "pointer", fontFamily: "DM Sans,sans-serif", fontSize: "0.83rem", fontWeight: 600 }}>Sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage = ({ setPage }) => {
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!form.email || !form.password) { setError("Please fill in all fields"); return; }
    setError(""); setLoading(true);
    const { error: err } = await signIn(form.email, form.password);
    setLoading(false);
    if (err) { setError(err.message); return; }
    setPage("dashboard");
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px 40px", background: "#080b10" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div onClick={() => setPage("landing")} style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.8rem", textAlign: "center", marginBottom: 4, cursor: "pointer", color: "#f0f4f8" }}>Dan<span style={{ color: "#00e5a0" }}>drop</span></div>
        <p style={{ textAlign: "center", color: "#6b7a8d", fontSize: "0.82rem", marginBottom: 24 }}>Welcome back</p>
        <div style={S.card}>
          <div style={S.heading}>Sign in</div>
          <p style={S.sub}>Enter your details to access your dashboard.</p>
          {error && <div style={S.err}>{error}</div>}
          {[["Email Address", "email", "daniel@email.com", "email"], ["Password", "password", "Your password", "password"]].map(([label, type, ph, key]) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={S.label}>{label}</label>
              <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={S.inp} />
            </div>
          ))}
          <button onClick={submit} disabled={loading} style={{ ...S.btn, opacity: loading ? 0.6 : 1 }}>{loading ? "Signing in..." : "Sign In"}</button>
          <div style={{ textAlign: "center", marginTop: 16, fontSize: "0.83rem", color: "#6b7a8d" }}>
            No account? <button onClick={() => setPage("signup")} style={{ background: "none", border: "none", color: "#00e5a0", cursor: "pointer", fontFamily: "DM Sans,sans-serif", fontSize: "0.83rem", fontWeight: 600 }}>Start free trial</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PRODUCT RESEARCH TAB ─────────────────────
const ProductResearchTab = () => {
  const [keyword, setKeyword] = useState("");
  const [cost, setCost] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const research = async () => {
    if (!keyword) return;
    setLoading(true);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/trends/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productName: keyword, supplierCost: parseFloat(cost) || 10, shippingCost: 2 }),
      });
      const data = await res.json();
      setResult(data);
      setHistory(prev => [{ ...data, keyword, timestamp: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)]);
    } catch (err) {
      // Fallback mock result if backend not running
      const score = Math.floor(Math.random() * 60) + 20;
      const mock = {
        productName: keyword,
        winningScore: score,
        isWinner: score >= 60,
        verdict: score >= 70 ? "Hot Product" : score >= 60 ? "Good Product" : score >= 40 ? "Average" : "Avoid",
        trendData: { trend: score > 60 ? "rising" : score > 40 ? "stable" : "falling", score },
        margin: ((parseFloat(cost) || 10) * 1.5 / ((parseFloat(cost) || 10) * 2.5) * 100).toFixed(1),
        recommendedPrice: ((parseFloat(cost) || 10) * 2.5).toFixed(2),
        profit: ((parseFloat(cost) || 10) * 1.5).toFixed(2),
      };
      setResult(mock);
      setHistory(prev => [{ ...mock, timestamp: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)]);
    }
    setLoading(false);
  };

  const verdictColor = { "Hot Product": "#00e5a0", "Good Product": "#00b8ff", "Average": "#ffb800", "Avoid": "#ff4d4d" };
  const trendColor = { rising: "#00e5a0", stable: "#ffb800", falling: "#ff4d4d" };

  return (
    <div>
      <div style={S.heading}>Product Research</div>
      <p style={S.sub}>Check if a product is worth selling before you invest.</p>
      <div style={S.card}>
        <div style={{ marginBottom: 14 }}>
          <label style={S.label}>Product Name</label>
          <input placeholder="e.g. Wireless Earbuds" value={keyword} onChange={e => setKeyword(e.target.value)} style={S.inp} onKeyDown={e => e.key === "Enter" && research()} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={S.label}>Supplier Cost ($) — optional</label>
          <input type="number" placeholder="e.g. 8.50" value={cost} onChange={e => setCost(e.target.value)} style={S.inp} />
        </div>
        <button onClick={research} disabled={loading || !keyword} style={{ ...S.btn, opacity: loading || !keyword ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <SearchIc s={18} c="#000" />{loading ? "Researching..." : "Research Product"}
        </button>
      </div>

      {result && (
        <div style={{ ...S.card, border: `1px solid ${verdictColor[result.verdict] || "#00e5a0"}44` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#f0f4f8", marginBottom: 4 }}>{result.productName}</div>
              <div style={{ display: "inline-block", background: (verdictColor[result.verdict] || "#00e5a0") + "22", color: verdictColor[result.verdict] || "#00e5a0", border: `1px solid ${verdictColor[result.verdict] || "#00e5a0"}44`, padding: "4px 12px", borderRadius: 100, fontSize: "0.78rem", fontWeight: 700 }}>{result.verdict}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "Syne,sans-serif", fontSize: "2rem", fontWeight: 800, color: verdictColor[result.verdict] || "#00e5a0" }}>{result.winningScore}</div>
              <div style={{ fontSize: "0.72rem", color: "#6b7a8d" }}>Score / 100</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            {[
              ["Trend", result.trendData?.trend || "unknown", trendColor[result.trendData?.trend] || "#6b7a8d"],
              ["Interest Score", result.trendData?.score || 0, "#00b8ff"],
              ["Profit Margin", result.margin + "%", "#00e5a0"],
              ["Recommended Price", "$" + result.recommendedPrice, "#f0f4f8"],
            ].map(([label, value, color]) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: "0.7rem", color: "#6b7a8d", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
                <div style={{ fontWeight: 700, color, fontSize: "0.95rem", textTransform: "capitalize" }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: "0.78rem", color: "#6b7a8d", marginBottom: 6 }}>Recommendation</div>
            <div style={{ fontSize: "0.86rem", color: "#f0f4f8", lineHeight: 1.6 }}>
              {result.winningScore >= 70 ? "This product is trending and has good profit potential. Consider adding it to your store soon." :
                result.winningScore >= 60 ? "This product shows promise. Do more research before committing." :
                  result.winningScore >= 40 ? "Average product. Competition may be high or demand is low." :
                    "This product is declining or has very low demand. Avoid investing in it."}
            </div>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div style={S.card}>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#f0f4f8", marginBottom: 14 }}>Recent Searches</div>
          {history.map((h, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < history.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div>
                <div style={{ fontSize: "0.86rem", color: "#f0f4f8", fontWeight: 500 }}>{h.keyword || h.productName}</div>
                <div style={{ fontSize: "0.74rem", color: "#6b7a8d", marginTop: 2 }}>{h.timestamp}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, color: verdictColor[h.verdict] || "#00e5a0", fontSize: "0.9rem" }}>{h.winningScore}</span>
                <span style={{ fontSize: "0.74rem", color: verdictColor[h.verdict] || "#00e5a0" }}>{h.verdict}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── PROFIT CALCULATOR TAB ────────────────────
const ProfitCalculatorTab = () => {
  const [form, setForm] = useState({ cost: "", shipping: "", selling: "", ads: "", platform: "2.9" });
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState([]);

  const calculate = () => {
    const cost = parseFloat(form.cost) || 0;
    const shipping = parseFloat(form.shipping) || 0;
    const selling = parseFloat(form.selling) || 0;
    const ads = parseFloat(form.ads) || 0;
    const platformFee = (selling * parseFloat(form.platform)) / 100;
    const totalCost = cost + shipping + ads + platformFee;
    const profit = selling - totalCost;
    const margin = selling > 0 ? ((profit / selling) * 100).toFixed(1) : 0;
    const roi = totalCost > 0 ? ((profit / totalCost) * 100).toFixed(1) : 0;
    setResult({ cost, shipping, selling, ads, platformFee: platformFee.toFixed(2), totalCost: totalCost.toFixed(2), profit: profit.toFixed(2), margin, roi });
  };

  const saveCalc = () => {
    if (!result) return;
    setSaved(prev => [{ ...result, name: form.cost + " → " + form.selling, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)]);
  };

  const profitColor = result && parseFloat(result.profit) > 0 ? "#00e5a0" : "#ff4d4d";

  return (
    <div>
      <div style={S.heading}>Profit Calculator</div>
      <p style={S.sub}>Calculate your real profit before you start selling.</p>
      <div style={S.card}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          {[["Supplier Cost ($)", "cost", "8.50"], ["Shipping Cost ($)", "shipping", "2.00"], ["Your Selling Price ($)", "selling", "24.99"], ["Ad Spend per Sale ($)", "ads", "3.00"]].map(([label, key, ph]) => (
            <div key={key}>
              <label style={S.label}>{label}</label>
              <input type="number" placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={S.inp} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={S.label}>Platform Fee (%)</label>
          <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} style={{ ...S.inp }}>
            <option value="2.9">Shopify — 2.9%</option>
            <option value="3.5">PayPal — 3.5%</option>
            <option value="5">Lemonsqueezy — 5%</option>
            <option value="0">No fee</option>
          </select>
        </div>
        <button onClick={calculate} style={{ ...S.btn, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <DollarIc s={18} c="#000" />Calculate Profit
        </button>
      </div>

      {result && (
        <div style={{ ...S.card, border: `1px solid ${profitColor}33` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div>
              <div style={{ fontSize: "0.72rem", color: "#6b7a8d", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Net Profit Per Sale</div>
              <div style={{ fontFamily: "Syne,sans-serif", fontSize: "2.2rem", fontWeight: 800, color: profitColor }}>${result.profit}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.72rem", color: "#6b7a8d", marginBottom: 4 }}>Margin</div>
              <div style={{ fontFamily: "Syne,sans-serif", fontSize: "1.4rem", fontWeight: 800, color: profitColor }}>{result.margin}%</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {[["Selling Price", "$" + result.selling, "#f0f4f8"], ["Supplier Cost", "-$" + result.cost, "#ff4d4d"], ["Shipping", "-$" + result.shipping, "#ff4d4d"], ["Ad Spend", "-$" + result.ads, "#ff4d4d"], ["Platform Fee", "-$" + result.platformFee, "#ff4d4d"], ["Total Cost", "-$" + result.totalCost, "#ffb800"]].map(([l, v, c]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "0.84rem", color: "#6b7a8d" }}>{l}</div>
                <div style={{ fontSize: "0.84rem", fontWeight: 600, color: c }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: 12, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: "0.82rem", color: "#6b7a8d" }}>ROI (Return on Investment)</div>
              <div style={{ fontWeight: 700, color: profitColor }}>{result.roi}%</div>
            </div>
          </div>
          <button onClick={saveCalc} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#f0f4f8", borderRadius: 10, padding: "10px 0", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", fontFamily: "DM Sans,sans-serif", width: "100%" }}>Save Calculation</button>
        </div>
      )}

      {saved.length > 0 && (
        <div style={S.card}>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#f0f4f8", marginBottom: 12 }}>Saved Calculations</div>
          {saved.map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < saved.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div style={{ fontSize: "0.84rem", color: "#f0f4f8" }}>${s.selling} selling price</div>
              <div style={{ color: parseFloat(s.profit) > 0 ? "#00e5a0" : "#ff4d4d", fontWeight: 600, fontSize: "0.84rem" }}>${s.profit} profit</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── SUPPLIER COMPARISON TAB ──────────────────
const SupplierComparisonTab = () => {
  const [suppliers, setSuppliers] = useState([
    { name: "Supplier A", price: "", shipping: "", days: "", moq: "1" },
    { name: "Supplier B", price: "", shipping: "", days: "", moq: "1" },
  ]);
  const [result, setResult] = useState(null);

  const addSupplier = () => {
    if (suppliers.length >= 5) return;
    setSuppliers(prev => [...prev, { name: "Supplier " + String.fromCharCode(65 + prev.length), price: "", shipping: "", days: "", moq: "1" }]);
  };

  const removeSupplier = (i) => setSuppliers(prev => prev.filter((_, idx) => idx !== i));

  const compare = () => {
    const scored = suppliers.map(s => {
      const total = (parseFloat(s.price) || 0) + (parseFloat(s.shipping) || 0);
      const days = parseFloat(s.days) || 14;
      const costScore = total > 0 ? Math.max(0, 100 - total * 5) : 0;
      const speedScore = Math.max(0, 100 - days * 5);
      const overall = ((costScore * 0.6) + (speedScore * 0.4)).toFixed(0);
      return { ...s, total: total.toFixed(2), costScore: costScore.toFixed(0), speedScore: speedScore.toFixed(0), overall };
    });
    const best = scored.reduce((a, b) => parseFloat(a.overall) > parseFloat(b.overall) ? a : b);
    setResult({ suppliers: scored, best: best.name });
  };

  return (
    <div>
      <div style={S.heading}>Supplier Comparison</div>
      <p style={S.sub}>Compare suppliers side by side to find the best one.</p>
      {suppliers.map((s, i) => (
        <div key={i} style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <input value={s.name} onChange={e => setSuppliers(prev => prev.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} style={{ ...S.inp, width: "auto", flex: 1, marginRight: 8 }} placeholder="Supplier name" />
            {suppliers.length > 2 && <button onClick={() => removeSupplier(i)} style={{ background: "none", border: "none", color: "#ff4d4d", cursor: "pointer", display: "flex" }}><TrashIc s={18} c="#ff4d4d" /></button>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[["Product Price ($)", "price", "8.50"], ["Shipping ($)", "shipping", "2.00"], ["Delivery Days", "days", "7"], ["Min. Order (MOQ)", "moq", "1"]].map(([label, key, ph]) => (
              <div key={key}>
                <label style={S.label}>{label}</label>
                <input type="number" placeholder={ph} value={s[key]} onChange={e => setSuppliers(prev => prev.map((x, idx) => idx === i ? { ...x, [key]: e.target.value } : x))} style={S.inp} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {suppliers.length < 5 && (
          <button onClick={addSupplier} style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#f0f4f8", borderRadius: 10, padding: "11px 0", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", fontFamily: "DM Sans,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <PlusIc s={16} />Add Supplier
          </button>
        )}
        <button onClick={compare} style={{ ...S.btn, flex: 2, padding: "11px 0" }}>Compare Now</button>
      </div>

      {result && (
        <div style={S.card}>
          <div style={{ background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <CheckIc s={18} c="#00e5a0" />
            <div>
              <div style={{ fontWeight: 700, color: "#00e5a0", fontSize: "0.9rem" }}>Best Choice: {result.best}</div>
              <div style={{ fontSize: "0.78rem", color: "#6b7a8d", marginTop: 2 }}>Based on price, shipping cost and delivery speed</div>
            </div>
          </div>
          {result.suppliers.map((s, i) => (
            <div key={i} style={{ background: s.name === result.best ? "rgba(0,229,160,0.04)" : "rgba(255,255,255,0.02)", border: s.name === result.best ? "1px solid rgba(0,229,160,0.2)" : "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: 14, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontWeight: 600, color: s.name === result.best ? "#00e5a0" : "#f0f4f8", fontSize: "0.9rem" }}>{s.name} {s.name === result.best && "★"}</div>
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, color: s.name === result.best ? "#00e5a0" : "#f0f4f8", fontSize: "1.1rem" }}>{s.overall}/100</div>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[["Total Cost", "$" + s.total], ["Delivery", s.days + " days"], ["MOQ", s.moq + " units"]].map(([l, v]) => (
                  <div key={l} style={{ fontSize: "0.78rem", color: "#6b7a8d" }}>{l}: <span style={{ color: "#f0f4f8", fontWeight: 600 }}>{v}</span></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── INVOICE GENERATOR TAB ────────────────────
const InvoiceGeneratorTab = ({ profile }) => {
  const [step, setStep] = useState("form"); // form, preview
  const [business, setBusiness] = useState({ name: profile?.full_name || "My Store", email: "", address: "", phone: "" });
  const [customer, setCustomer] = useState({ name: "", email: "", address: "", city: "", country: "" });
  const [items, setItems] = useState([{ description: "", qty: 1, price: "" }]);
  const [order, setOrder] = useState({ id: "INV-" + Date.now().toString().slice(-6), tracking: "", shipping: "0" });

  const addItem = () => setItems(prev => [...prev, { description: "", qty: 1, price: "" }]);
  const removeItem = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const updateItem = (i, key, val) => setItems(prev => prev.map((x, idx) => idx === i ? { ...x, [key]: val } : x));

  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (parseInt(item.qty) || 0), 0);
  const shipping = parseFloat(order.shipping) || 0;
  const total = subtotal + shipping;

  const invoiceDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const downloadPDF = () => {
    const content = document.getElementById("invoice-preview");
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${order.id}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'DM Sans', sans-serif; background: #080b10; color: #f0f4f8; padding: 40px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({ title: "Invoice " + order.id, text: "Invoice from " + business.name });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (step === "preview") {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => setStep("form")} style={{ background: "none", border: "none", color: "#6b7a8d", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "DM Sans,sans-serif", fontSize: "0.86rem" }}>
            <BackIc s={16} />Back
          </button>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#f0f4f8" }}>Invoice Preview</div>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <button onClick={downloadPDF} style={{ flex: 1, background: "#00e5a0", color: "#000", border: "none", borderRadius: 10, padding: "11px 0", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", fontFamily: "DM Sans,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <DownloadIc s={16} c="#000" />Download PDF
          </button>
          <button onClick={shareLink} style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#f0f4f8", borderRadius: 10, padding: "11px 0", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", fontFamily: "DM Sans,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <ShareIc s={16} />Share
          </button>
        </div>

        {/* Invoice Preview */}
        <div id="invoice-preview" style={{ background: "#0e1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ background: "#080b10", padding: "24px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "#00e5a0" }}>{business.name}</div>
                <div style={{ color: "#6b7a8d", fontSize: "0.8rem", marginTop: 4 }}>{business.email}</div>
                <div style={{ color: "#6b7a8d", fontSize: "0.8rem" }}>{business.phone}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#f0f4f8" }}>INVOICE</div>
                <div style={{ color: "#00e5a0", fontWeight: 600, fontSize: "0.9rem" }}>#{order.id}</div>
                <div style={{ color: "#6b7a8d", fontSize: "0.78rem", marginTop: 4 }}>{invoiceDate}</div>
              </div>
            </div>
          </div>

          {/* From / To */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div>
              <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: 1, color: "#00e5a0", fontWeight: 600, marginBottom: 8 }}>From</div>
              <div style={{ fontWeight: 600, color: "#f0f4f8", fontSize: "0.88rem" }}>{business.name}</div>
              <div style={{ color: "#6b7a8d", fontSize: "0.8rem", marginTop: 3 }}>{business.address}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: 1, color: "#00e5a0", fontWeight: 600, marginBottom: 8 }}>Bill To</div>
              <div style={{ fontWeight: 600, color: "#f0f4f8", fontSize: "0.88rem" }}>{customer.name}</div>
              <div style={{ color: "#6b7a8d", fontSize: "0.8rem", marginTop: 3 }}>{customer.email}</div>
              <div style={{ color: "#6b7a8d", fontSize: "0.8rem" }}>{customer.address}</div>
              <div style={{ color: "#6b7a8d", fontSize: "0.8rem" }}>{customer.city}{customer.city && customer.country ? ", " : ""}{customer.country}</div>
            </div>
          </div>

          {/* Items */}
          <div style={{ padding: "0 24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 8, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["Item", "Qty", "Price", "Total"].map(h => <div key={h} style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: 1, color: "#6b7a8d", fontWeight: 600 }}>{h}</div>)}
            </div>
            {items.map((item, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 8, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center" }}>
                <div style={{ fontSize: "0.86rem", color: "#f0f4f8" }}>{item.description || "Item " + (i + 1)}</div>
                <div style={{ fontSize: "0.84rem", color: "#6b7a8d", textAlign: "center" }}>{item.qty}</div>
                <div style={{ fontSize: "0.84rem", color: "#6b7a8d", textAlign: "right" }}>${parseFloat(item.price || 0).toFixed(2)}</div>
                <div style={{ fontSize: "0.84rem", color: "#f0f4f8", fontWeight: 600, textAlign: "right" }}>${((parseFloat(item.price) || 0) * (parseInt(item.qty) || 0)).toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ width: "60%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontSize: "0.84rem", color: "#6b7a8d" }}>Subtotal</div>
                  <div style={{ fontSize: "0.84rem", color: "#f0f4f8" }}>${subtotal.toFixed(2)}</div>
                </div>
                {shipping > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ fontSize: "0.84rem", color: "#6b7a8d" }}>Shipping</div>
                    <div style={{ fontSize: "0.84rem", color: "#f0f4f8" }}>${shipping.toFixed(2)}</div>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", background: "#00e5a0", borderRadius: 8, padding: "10px 12px", marginTop: 8 }}>
                  <div style={{ fontWeight: 700, color: "#000", fontSize: "0.9rem" }}>TOTAL</div>
                  <div style={{ fontWeight: 800, color: "#000", fontFamily: "Syne,sans-serif", fontSize: "1rem" }}>${total.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking */}
          {order.tracking && (
            <div style={{ padding: "14px 24px", background: "rgba(0,229,160,0.04)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize: "0.78rem", color: "#6b7a8d" }}>Tracking Number: <span style={{ color: "#00e5a0", fontWeight: 600 }}>{order.tracking}</span></div>
            </div>
          )}

          {/* Footer */}
          <div style={{ padding: "14px 24px", borderTop: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
            <div style={{ fontSize: "0.76rem", color: "#6b7a8d" }}>Thank you for your purchase! Questions? Contact {business.email || "support@" + business.name.toLowerCase().replace(/\s/g, "") + ".com"}</div>
            <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.2)", marginTop: 4 }}>Powered by Dandrop</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={S.heading}>Invoice Generator</div>
      <p style={S.sub}>Create professional branded invoices for your customers.</p>

      {/* Business Info */}
      <div style={S.card}>
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#f0f4f8", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><StoreIc s={16} c="#00e5a0" />Your Business</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          {[["Business Name", "name", "My Store"], ["Email", "email", "hello@mystore.com"]].map(([label, key, ph]) => (
            <div key={key}>
              <label style={S.label}>{label}</label>
              <input placeholder={ph} value={business[key]} onChange={e => setBusiness({ ...business, [key]: e.target.value })} style={S.inp} />
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[["Address", "address", "123 Main St"], ["Phone", "phone", "+1 234 567 8900"]].map(([label, key, ph]) => (
            <div key={key}>
              <label style={S.label}>{label}</label>
              <input placeholder={ph} value={business[key]} onChange={e => setBusiness({ ...business, [key]: e.target.value })} style={S.inp} />
            </div>
          ))}
        </div>
      </div>

      {/* Customer Info */}
      <div style={S.card}>
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#f0f4f8", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><UserIc s={16} c="#00e5a0" />Customer Details</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          {[["Full Name", "name", "John Smith"], ["Email", "email", "john@email.com"]].map(([label, key, ph]) => (
            <div key={key}>
              <label style={S.label}>{label}</label>
              <input placeholder={ph} value={customer[key]} onChange={e => setCustomer({ ...customer, [key]: e.target.value })} style={S.inp} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={S.label}>Address</label>
          <input placeholder="Street address" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} style={S.inp} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[["City", "city", "New York"], ["Country", "country", "USA"]].map(([label, key, ph]) => (
            <div key={key}>
              <label style={S.label}>{label}</label>
              <input placeholder={ph} value={customer[key]} onChange={e => setCustomer({ ...customer, [key]: e.target.value })} style={S.inp} />
            </div>
          ))}
        </div>
      </div>

      {/* Order Items */}
      <div style={S.card}>
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#f0f4f8", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><BoxIc s={16} c="#00e5a0" />Order Items</div>
        {items.map((item, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: "0.78rem", color: "#6b7a8d" }}>Item {i + 1}</div>
              {items.length > 1 && <button onClick={() => removeItem(i)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><TrashIc s={16} c="#ff4d4d" /></button>}
            </div>
            <div style={{ marginBottom: 8 }}>
              <input placeholder="Product name / description" value={item.description} onChange={e => updateItem(i, "description", e.target.value)} style={S.inp} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <label style={S.label}>Quantity</label>
                <input type="number" value={item.qty} onChange={e => updateItem(i, "qty", e.target.value)} style={S.inp} min="1" />
              </div>
              <div>
                <label style={S.label}>Price ($)</label>
                <input type="number" placeholder="0.00" value={item.price} onChange={e => updateItem(i, "price", e.target.value)} style={S.inp} />
              </div>
            </div>
          </div>
        ))}
        <button onClick={addItem} style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.15)", color: "#6b7a8d", borderRadius: 10, padding: "10px 0", fontWeight: 600, fontSize: "0.86rem", cursor: "pointer", fontFamily: "DM Sans,sans-serif", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <PlusIc s={16} />Add Item
        </button>
      </div>

      {/* Order Details */}
      <div style={S.card}>
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#f0f4f8", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><FileIc s={16} c="#00e5a0" />Order Details</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[["Invoice/Order ID", "id", "INV-001"], ["Tracking Number", "tracking", "Optional"]].map(([label, key, ph]) => (
            <div key={key}>
              <label style={S.label}>{label}</label>
              <input placeholder={ph} value={order[key]} onChange={e => setOrder({ ...order, [key]: e.target.value })} style={S.inp} />
            </div>
          ))}
          <div>
            <label style={S.label}>Shipping Cost ($)</label>
            <input type="number" placeholder="0.00" value={order.shipping} onChange={e => setOrder({ ...order, shipping: e.target.value })} style={S.inp} />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <div style={{ background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.15)", borderRadius: 10, padding: "12px 14px", width: "100%" }}>
              <div style={{ fontSize: "0.72rem", color: "#6b7a8d", marginBottom: 2 }}>Total Amount</div>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, color: "#00e5a0", fontSize: "1.2rem" }}>${total.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => setStep("preview")} style={{ ...S.btn, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <EyeIc s={18} c="#000" />Preview Invoice
      </button>
    </div>
  );
};

// ─── STORE SCHEDULER TAB ─────────────────────
const SchedulerTab = () => {
  const [events, setEvents] = useState([
    { id: 1, title: "Product Launch - Wireless Earbuds", date: "2025-06-15", type: "launch", status: "upcoming", notes: "Check stock before launching" },
    { id: 2, title: "Weekend Sale - 20% Off", date: "2025-06-20", type: "sale", status: "upcoming", notes: "Update all product prices" },
  ]);
  const [form, setForm] = useState({ title: "", date: "", type: "launch", notes: "" });
  const [adding, setAdding] = useState(false);

  const addEvent = () => {
    if (!form.title || !form.date) return;
    setEvents(prev => [...prev, { ...form, id: Date.now(), status: "upcoming" }]);
    setForm({ title: "", date: "", type: "launch", notes: "" });
    setAdding(false);
  };

  const deleteEvent = (id) => setEvents(prev => prev.filter(e => e.id !== id));
  const toggleStatus = (id) => setEvents(prev => prev.map(e => e.id === id ? { ...e, status: e.status === "done" ? "upcoming" : "done" } : e));

  const typeColor = { launch: "#00e5a0", sale: "#00b8ff", restock: "#ffb800", pause: "#ff4d4d", other: "#6b7a8d" };
  const upcoming = events.filter(e => e.status === "upcoming").sort((a, b) => new Date(a.date) - new Date(b.date));
  const done = events.filter(e => e.status === "done");

  return (
    <div>
      <div style={S.heading}>Store Scheduler</div>
      <p style={S.sub}>Plan your product launches, sales and campaigns in advance.</p>

      {adding ? (
        <div style={S.card}>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#f0f4f8", marginBottom: 14 }}>New Event</div>
          <div style={{ marginBottom: 12 }}>
            <label style={S.label}>Event Title</label>
            <input placeholder="e.g. Product Launch — Wireless Earbuds" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={S.inp} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={S.label}>Date</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={S.inp} />
            </div>
            <div>
              <label style={S.label}>Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={S.inp}>
                <option value="launch">Product Launch</option>
                <option value="sale">Sale / Promotion</option>
                <option value="restock">Restock</option>
                <option value="pause">Pause Product</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>Notes (optional)</label>
            <textarea placeholder="Any notes or reminders..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...S.inp, minHeight: 80, resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={addEvent} style={{ ...S.btn, flex: 2, padding: "11px 0" }}>Save Event</button>
            <button onClick={() => setAdding(false)} style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#f0f4f8", borderRadius: 10, padding: "11px 0", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{ ...S.btn, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
          <PlusIc s={18} c="#000" />Add New Event
        </button>
      )}

      {upcoming.length > 0 && (
        <div style={S.card}>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#f0f4f8", marginBottom: 14 }}>Upcoming ({upcoming.length})</div>
          {upcoming.map(e => (
            <div key={e.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 14, marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ flex: 1, marginRight: 8 }}>
                  <div style={{ fontWeight: 600, color: "#f0f4f8", fontSize: "0.9rem", marginBottom: 4 }}>{e.title}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ background: typeColor[e.type] + "22", color: typeColor[e.type], border: `1px solid ${typeColor[e.type]}44`, padding: "2px 8px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 600 }}>{e.type}</span>
                    <span style={{ fontSize: "0.78rem", color: "#6b7a8d" }}>{new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  {e.notes && <div style={{ fontSize: "0.78rem", color: "#6b7a8d", marginTop: 6 }}>{e.notes}</div>}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => toggleStatus(e.id)} style={{ background: "rgba(0,229,160,0.1)", border: "1px solid rgba(0,229,160,0.2)", borderRadius: 8, padding: "6px 8px", cursor: "pointer", display: "flex" }}><CheckIc s={14} c="#00e5a0" /></button>
                  <button onClick={() => deleteEvent(e.id)} style={{ background: "rgba(255,77,77,0.1)", border: "1px solid rgba(255,77,77,0.2)", borderRadius: 8, padding: "6px 8px", cursor: "pointer", display: "flex" }}><TrashIc s={14} c="#ff4d4d" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {done.length > 0 && (
        <div style={S.card}>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#6b7a8d", marginBottom: 14 }}>Completed ({done.length})</div>
          {done.map(e => (
            <div key={e.id} style={{ background: "rgba(255,255,255,0.01)", borderRadius: 10, padding: 12, marginBottom: 8, opacity: 0.6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "0.86rem", color: "#6b7a8d", textDecoration: "line-through" }}>{e.title}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => toggleStatus(e.id)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "5px 8px", cursor: "pointer", color: "#6b7a8d", fontSize: "0.72rem", fontFamily: "DM Sans,sans-serif" }}>Undo</button>
                  <button onClick={() => deleteEvent(e.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><TrashIc s={14} c="#6b7a8d" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {events.length === 0 && !adding && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><CalIc s={40} c="#6b7a8d" /></div>
          <div style={{ color: "#6b7a8d", fontSize: "0.86rem" }}>No events scheduled yet.</div>
          <div style={{ color: "#6b7a8d", fontSize: "0.78rem", marginTop: 6 }}>Add your first product launch or promotion above.</div>
        </div>
      )}
    </div>
  );
};

// ─── PROFILE PAGE ─────────────────────────────
const ProfilePage = ({ setPage }) => {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [form, setForm] = useState({ full_name: profile?.full_name || "", business_name: profile?.business_name || "", phone: profile?.phone || "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ price_alerts: true, stock_alerts: true, order_updates: true, weekly_report: false });
  const fileRef = useRef();
  const initials = profile?.full_name ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "D";
  const save = async () => {
    setSaving(true);
    await updateProfile({ full_name: form.full_name, business_name: form.business_name, phone: form.phone });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split(".").pop();
    const path = "avatars/" + user.id + "." + ext;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (!upErr) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      await updateProfile({ avatar_url: data.publicUrl });
    }
  };
  return (
    <div style={{ paddingTop: 58, background: "#080b10", minHeight: "100vh" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 16px 60px" }}>
        <div style={{ height: 90, background: "linear-gradient(135deg,rgba(0,229,160,0.12),rgba(0,184,255,0.08))", borderRadius: "14px 14px 0 0", border: "1px solid rgba(255,255,255,0.07)", borderBottom: "none", position: "relative" }}>
          <div style={{ position: "absolute", bottom: -34, left: 20 }}>
            <div onClick={() => fileRef.current.click()} style={{ width: 68, height: 68, borderRadius: "50%", background: "linear-gradient(135deg,#00e5a0,#00b8ff)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne,sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#000", border: "3px solid #080b10", cursor: "pointer", position: "relative", overflow: "hidden" }}>
              {profile?.avatar_url ? <img src={profile.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }} /> : initials}
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}><CameraIc s={20} c="#fff" /></div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatar} />
          </div>
        </div>
        <div style={{ background: "#0e1318", border: "1px solid rgba(255,255,255,0.07)", borderTop: "none", borderRadius: "0 0 14px 14px", padding: "46px 20px 20px", marginBottom: 14 }}>
          <div style={{ fontFamily: "Syne,sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "#f0f4f8" }}>{profile?.full_name || "Your Name"}</div>
          <div style={{ color: "#6b7a8d", fontSize: "0.82rem", marginTop: 3 }}>{user?.email}</div>
          <div style={{ marginTop: 10 }}>
            {profile?.trialActive ? <span style={{ background: "rgba(255,184,0,0.1)", color: "#ffb800", border: "1px solid rgba(255,184,0,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 600 }}>Trial — {profile.daysLeft} day{profile.daysLeft !== 1 ? "s" : ""} left</span>
              : profile?.subscription ? <span style={{ background: "rgba(0,229,160,0.1)", color: "#00e5a0", border: "1px solid rgba(0,229,160,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 600 }}>{profile.subscription.plans?.display_name} Plan</span>
                : <span style={{ background: "rgba(255,77,77,0.1)", color: "#ff4d4d", border: "1px solid rgba(255,77,77,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 600 }}>Trial Expired</span>}
          </div>
        </div>
        <div style={S.card}>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.97rem", color: "#f0f4f8", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}><UserIc s={16} c="#00e5a0" />Personal Information</div>
          <p style={{ color: "#6b7a8d", fontSize: "0.8rem", marginBottom: 16 }}>Tap your avatar above to change your profile picture.</p>
          {saved && <div style={S.ok}>Profile saved successfully!</div>}
          {[["Full Name", "text", "Your full name", "full_name"], ["Business Name", "text", "Your store name", "business_name"], ["Phone", "tel", "+1 234 567 8900", "phone"]].map(([label, type, ph, key]) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={S.label}>{label}</label>
              <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={S.inp} />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Email Address</label>
            <input value={user?.email || ""} disabled style={{ ...S.inp, opacity: 0.5, cursor: "not-allowed" }} />
          </div>
          <button onClick={save} disabled={saving} style={{ ...S.btn, opacity: saving ? 0.6 : 1 }}>{saving ? "Saving..." : "Save Changes"}</button>
        </div>
        <div style={S.card}>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.97rem", color: "#f0f4f8", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><BellIc s={16} c="#00e5a0" />Notifications</div>
          {[["price_alerts", "Price Change Alerts", "Notified when supplier price changes"], ["stock_alerts", "Stock Alerts", "Notified when product goes out of stock"], ["order_updates", "Order Updates", "Notified when orders are fulfilled"], ["weekly_report", "Weekly Report", "Weekly profit and performance summary"]].map(([key, label, desc]) => (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div><div style={{ fontSize: "0.86rem", fontWeight: 500, color: "#f0f4f8" }}>{label}</div><div style={{ fontSize: "0.74rem", color: "#6b7a8d", marginTop: 2 }}>{desc}</div></div>
              <Toggle on={notifs[key]} toggle={() => setNotifs({ ...notifs, [key]: !notifs[key] })} />
            </div>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.97rem", color: "#f0f4f8", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><CardIc s={16} c="#00e5a0" />Subscription</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600, color: "#f0f4f8", fontSize: "0.9rem", marginBottom: 4 }}>{profile?.subscription ? profile.subscription.plans?.display_name + " Plan" : profile?.trialActive ? "Free Trial" : "No Active Plan"}</div>
              <div style={{ color: "#6b7a8d", fontSize: "0.8rem" }}>{profile?.trialActive ? profile.daysLeft + " day" + (profile.daysLeft !== 1 ? "s" : "") + " left" : profile?.subscription ? "Active subscription" : "Trial expired"}</div>
            </div>
            <button onClick={() => setPage("pricing")} style={{ background: "#00e5a0", color: "#000", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}>{profile?.subscription ? "Manage" : "Upgrade"}</button>
          </div>
        </div>
        <div style={{ ...S.card, border: "1px solid rgba(255,77,77,0.2)" }}>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.97rem", color: "#ff4d4d", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><ShieldIc s={16} c="#ff4d4d" />Account Actions</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => { signOut(); setPage("landing"); }} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", color: "#f0f4f8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "9px 16px", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}><LogoutIc s={15} />Sign Out</button>
            <button style={{ background: "rgba(255,77,77,0.1)", color: "#ff4d4d", border: "1px solid rgba(255,77,77,0.2)", borderRadius: 10, padding: "9px 16px", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}>Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PAYWALL ──────────────────────────────────
const PaywallPage = ({ setPage }) => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px 40px", background: "#080b10" }}>
    <div style={{ textAlign: "center", maxWidth: 500, width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><ShieldIc s={56} c="#ff4d4d" /></div>
      <div style={{ fontFamily: "Syne,sans-serif", fontSize: "1.8rem", fontWeight: 800, letterSpacing: -1, marginBottom: 10, color: "#f0f4f8" }}>Your 3-day trial has ended</div>
      <p style={{ color: "#6b7a8d", marginBottom: 32, lineHeight: 1.7, fontSize: "0.92rem" }}>Choose a plan to keep your store running on autopilot. Cancel anytime.</p>
      <PricingCards setPage={setPage} />
    </div>
  </div>
);

// ─── DASHBOARD ────────────────────────────────
const DashboardPage = ({ setPage }) => {
  const { profile, signOut } = useAuth();
  const [tab, setTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  if (profile && !profile.hasAccess) return <PaywallPage setPage={setPage} />;
  const initials = profile?.full_name ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "D";

  const navItems = [
    ["overview", <HomeIc />, "Overview"],
    ["research", <SearchIc />, "Research"],
    ["calculator", <DollarIc />, "Calculator"],
    ["suppliers", <StoreIc />, "Suppliers"],
    ["scheduler", <CalIc />, "Scheduler"],
    ["invoices", <FileIc />, "Invoices"],
    ["orders", <BoxIc />, "Orders"],
    ["analytics", <ChartIc />, "Analytics"],
  ];

  const tabLabels = { overview: "Overview", research: "Product Research", calculator: "Profit Calculator", suppliers: "Supplier Comparison", scheduler: "Store Scheduler", invoices: "Invoice Generator", orders: "Orders", analytics: "Analytics", billing: "Billing", settings: "Settings" };

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
      <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "1.5px", color: "#6b7a8d", padding: "0 12px 6px", fontWeight: 600 }}>Tools</div>
      {navItems.map(([id, icon, label]) => (
        <button key={id} onClick={() => { setTab(id); setSidebarOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, fontSize: "0.85rem", fontWeight: 500, color: tab === id ? "#00e5a0" : "#6b7a8d", background: tab === id ? "rgba(0,229,160,0.08)" : "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", marginBottom: 2 }}>
          {icon}{label}
        </button>
      ))}
      <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "1.5px", color: "#6b7a8d", padding: "14px 12px 6px", fontWeight: 600 }}>Account</div>
      <button onClick={() => { setTab("billing"); setSidebarOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, fontSize: "0.85rem", fontWeight: 500, color: tab === "billing" ? "#00e5a0" : "#6b7a8d", background: tab === "billing" ? "rgba(0,229,160,0.08)" : "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", marginBottom: 2 }}><CardIc />Billing</button>
      <button onClick={() => { setPage("profile"); setSidebarOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, fontSize: "0.85rem", fontWeight: 500, color: "#6b7a8d", background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", marginBottom: 2 }}><UserIc />My Profile</button>
      {profile?.trialActive && (
        <div style={{ margin: "12px 4px", background: "rgba(255,184,0,0.06)", border: "1px solid rgba(255,184,0,0.15)", borderRadius: 10, padding: 12 }}>
          <div style={{ fontSize: "0.68rem", color: "#ffb800", fontWeight: 600, marginBottom: 4 }}>TRIAL ACTIVE</div>
          <div style={{ fontSize: "0.78rem", color: "#6b7a8d", marginBottom: 9 }}>{profile.daysLeft} day{profile.daysLeft !== 1 ? "s" : ""} remaining</div>
          <button onClick={() => setPage("pricing")} style={{ ...S.btn, padding: "8px 0", fontSize: "0.8rem" }}>Upgrade Now</button>
        </div>
      )}
      <div style={{ marginTop: "auto", paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div onClick={() => { setPage("profile"); setSidebarOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 9, cursor: "pointer" }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#00e5a0,#00b8ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.78rem", color: "#000", flexShrink: 0, overflow: "hidden" }}>
            {profile?.avatar_url ? <img src={profile.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "0.81rem", fontWeight: 600, color: "#f0f4f8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile?.full_name || "Daniel"}</div>
            <div style={{ fontSize: "0.68rem", color: "#00e5a0" }}>{profile?.trialActive ? "Trial" : profile?.subscription ? profile.subscription.plans?.display_name : "No plan"}</div>
          </div>
        </div>
        <button onClick={() => { signOut(); setPage("landing"); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 9, fontSize: "0.85rem", fontWeight: 500, color: "#6b7a8d", background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", marginTop: 2 }}><LogoutIc />Sign Out</button>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#080b10", minHeight: "100vh", paddingTop: 58 }}>
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50 }} onClick={() => setSidebarOpen(false)}>
          <div style={{ position: "absolute", left: 0, top: 58, bottom: 0, width: 240, background: "#0e1318", borderRight: "1px solid rgba(255,255,255,0.07)", padding: "18px 10px", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </div>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: -1 }} />
        </div>
      )}
      <div style={{ padding: "16px 16px 90px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: "#0e1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, color: "#f0f4f8", padding: "8px", cursor: "pointer", display: "flex", alignItems: "center" }}><MenuIc c="#f0f4f8" /></button>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "1rem", color: "#f0f4f8" }}>{tabLabels[tab] || "Dashboard"}</div>
        </div>
        {profile?.trialActive && (
          <div style={{ background: "rgba(255,184,0,0.06)", border: "1px solid rgba(255,184,0,0.2)", borderRadius: 12, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, gap: 8 }}>
            <p style={{ fontSize: "0.83rem", color: "#ffb800", fontWeight: 500 }}>Trial ends in <strong>{profile.daysLeft} day{profile.daysLeft !== 1 ? "s" : ""}</strong></p>
            <button onClick={() => setPage("pricing")} style={{ background: "#00e5a0", color: "#000", border: "none", borderRadius: 8, padding: "6px 14px", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer", fontFamily: "DM Sans,sans-serif", flexShrink: 0 }}>Upgrade</button>
          </div>
        )}

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div>
            <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#f0f4f8", marginBottom: 4 }}>Good morning, {profile?.full_name?.split(" ")[0] || "Daniel"}</h2>
            <p style={{ color: "#6b7a8d", fontSize: "0.82rem", marginBottom: 20 }}>Here is what Dandrop can do for you today.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[[<SearchIc s={22} c="#00e5a0" />, "Product Research", "Find winning products using Google Trends", "research"],
              [<DollarIc s={22} c="#00b8ff" />, "Profit Calculator", "Calculate your real profit per sale", "calculator"],
              [<StoreIc s={22} c="#ffb800" />, "Compare Suppliers", "Find the best supplier for any product", "suppliers"],
              [<FileIc s={22} c="#00e5a0" />, "Invoice Generator", "Create professional branded invoices", "invoices"],
              [<CalIc s={22} c="#00b8ff" />, "Store Scheduler", "Plan launches and promotions", "scheduler"],
              [<BoxIc s={22} c="#6b7a8d" />, "Auto Fulfillment", "Coming soon — needs supplier API", null],
              ].map(([icon, title, desc, target]) => (
                <div key={title} onClick={() => target && setTab(target)} style={{ background: "#0e1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 16, cursor: target ? "pointer" : "default", opacity: target ? 1 : 0.5, position: "relative", overflow: "hidden" }}>
                  {!target && <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,184,0,0.1)", color: "#ffb800", border: "1px solid rgba(255,184,0,0.2)", padding: "2px 7px", borderRadius: 100, fontSize: "0.64rem", fontWeight: 700 }}>Soon</div>}
                  <div style={{ marginBottom: 10 }}>{icon}</div>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.88rem", color: "#f0f4f8", marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: "0.76rem", color: "#6b7a8d", lineHeight: 1.5 }}>{desc}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#0e1318", border: "1px solid rgba(0,229,160,0.2)", borderRadius: 14, padding: 18 }}>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#f0f4f8", marginBottom: 8 }}>Get Started</div>
              <p style={{ color: "#6b7a8d", fontSize: "0.84rem", lineHeight: 1.6, marginBottom: 14 }}>Start by researching a product to see if it is worth selling, then calculate your profit before you invest.</p>
              <button onClick={() => setTab("research")} style={{ ...S.btn, padding: "11px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <SearchIc s={16} c="#000" />Research a Product Now
              </button>
            </div>
          </div>
        )}

        {tab === "research" && <ProductResearchTab />}
        {tab === "calculator" && <ProfitCalculatorTab />}
        {tab === "suppliers" && <SupplierComparisonTab />}
        {tab === "invoices" && <InvoiceGeneratorTab profile={profile} />}
        {tab === "scheduler" && <SchedulerTab />}

        {tab === "orders" && (
          <ComingSoon
            title="Auto Order Fulfillment"
            icon={<BoxIc s={48} c="#6b7a8d" />}
            desc="Automatic order fulfillment will be available once your supplier API is connected. You will be able to fulfill orders in one click."
          />
        )}
        {tab === "analytics" && (
          <ComingSoon
            title="Analytics Dashboard"
            icon={<ChartIc s={48} c="#6b7a8d" />}
            desc="Deep analytics including revenue charts, profit trends and customer insights will be available once your Shopify store is connected."
          />
        )}

        {tab === "billing" && (
          <div>
            <div style={S.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, color: "#f0f4f8", marginBottom: 4, fontSize: "0.9rem" }}>{profile?.subscription ? profile.subscription.plans?.display_name + " Plan" : "Free Trial"}</div>
                  <p style={{ color: "#6b7a8d", fontSize: "0.8rem" }}>{profile?.trialActive ? profile.daysLeft + " days left" : profile?.subscription ? "Active subscription" : "Trial expired"}</p>
                </div>
                {profile?.subscription && <button style={{ background: "transparent", color: "#f0f4f8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 14px", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}>Manage</button>}
              </div>
            </div>
            {!profile?.subscription && (<><div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, color: "#f0f4f8", marginBottom: 14, fontSize: "0.95rem" }}>Choose a plan</div><PricingCards setPage={setPage} /></>)}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0e1318", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-around", padding: "8px 0", zIndex: 40 }}>
        {[["overview", "Home"], ["research", "Research"], ["calculator", "Profit"], ["invoices", "Invoice"]].map(([id, label]) => {
          const icons = { overview: <HomeIc s={20} c={tab === id ? "#00e5a0" : "#6b7a8d"} />, research: <SearchIc s={20} c={tab === id ? "#00e5a0" : "#6b7a8d"} />, calculator: <DollarIc s={20} c={tab === id ? "#00e5a0" : "#6b7a8d"} />, invoices: <FileIc s={20} c={tab === id ? "#00e5a0" : "#6b7a8d"} /> };
          return (
            <button key={id} onClick={() => setTab(id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 10px", background: "none", border: "none", cursor: "pointer", color: tab === id ? "#00e5a0" : "#6b7a8d", fontSize: "0.65rem", fontFamily: "DM Sans,sans-serif", fontWeight: tab === id ? 600 : 400 }}>
              {icons[id]}{label}
            </button>
          );
        })}
        <button onClick={() => setSidebarOpen(true)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 10px", background: "none", border: "none", cursor: "pointer", color: "#6b7a8d", fontSize: "0.65rem", fontFamily: "DM Sans,sans-serif" }}>
          <MenuIc s={20} c="#6b7a8d" />More
        </button>
      </div>
    </div>
  );
};

// ─── PUBLIC PAGES ─────────────────────────────
const LandingPage = ({ setPage }) => (
  <div style={{ background: "#080b10" }}>
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "100px 20px 60px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 400, height: 400, background: "radial-gradient(circle,rgba(0,229,160,0.1) 0%,transparent 70%)", top: -150, left: -100, borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,229,160,0.07)", border: "1px solid rgba(0,229,160,0.18)", color: "#00e5a0", padding: "6px 14px", borderRadius: 100, fontSize: "0.76rem", fontWeight: 500, marginBottom: 22 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00e5a0", display: "inline-block" }} />3-Day Free Trial — No Credit Card
      </div>
      <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "clamp(2rem,8vw,4.5rem)", lineHeight: 1.08, letterSpacing: -2, marginBottom: 18, color: "#f0f4f8" }}>
        Your Store on<br /><span style={{ background: "linear-gradient(135deg,#00e5a0,#00b8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Full Autopilot</span>
      </h1>
      <p style={{ color: "#6b7a8d", fontSize: "0.97rem", maxWidth: 420, marginBottom: 32, fontWeight: 300, lineHeight: 1.7 }}>Dandrop automates product research, supplier monitoring, order fulfillment and profit tracking — so you scale while you sleep.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 320, marginBottom: 48 }}>
        <button onClick={() => setPage("signup")} style={{ ...S.btn, padding: "14px 0", borderRadius: 10, boxShadow: "0 0 40px rgba(0,229,160,0.2)" }}>Start Free Trial — 3 Days Free</button>
        <button onClick={() => setPage("features")} style={{ background: "transparent", color: "#f0f4f8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "13px 0", fontWeight: 500, fontSize: "0.95rem", cursor: "pointer", fontFamily: "DM Sans,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>See Features <ArrowIc s={16} /></button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%", maxWidth: 320, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        {[["18hrs", "Saved/week"], ["40%", "More profit"], ["100%", "Automated"], ["3 Days", "Free trial"]].map(([n, l]) => (
          <div key={l} style={{ textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: "14px 8px" }}>
            <span style={{ fontFamily: "Syne,sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "#00e5a0", display: "block" }}>{n}</span>
            <span style={{ fontSize: "0.72rem", color: "#6b7a8d" }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
    <div style={{ padding: "0 16px 60px" }}>
      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 2, color: "#00e5a0", fontWeight: 600, marginBottom: 10 }}>Features</div>
      <div style={{ fontFamily: "Syne,sans-serif", fontSize: "1.6rem", fontWeight: 800, letterSpacing: -0.5, marginBottom: 8, color: "#f0f4f8" }}>Everything your store needs</div>
      <p style={{ color: "#6b7a8d", marginBottom: 24, fontSize: "0.9rem" }}>Start using Dandrop today — no API required for core features.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[[<SearchIc s={22} c="#00e5a0" />, "Product Research", "Score any product using Google Trends. Know if it is worth selling before you invest.", true],
        [<DollarIc s={22} c="#00e5a0" />, "Profit Calculator", "Calculate real profit including supplier cost, shipping, ads and platform fees.", true],
        [<StoreIc s={22} c="#00e5a0" />, "Supplier Comparison", "Compare up to 5 suppliers side by side to find the best price and delivery.", true],
        [<FileIc s={22} c="#00e5a0" />, "Invoice Generator", "Create professional branded invoices with preview and PDF download.", true],
        [<CalIc s={22} c="#00e5a0" />, "Store Scheduler", "Plan product launches and promotions in advance.", true],
        [<BoxIc s={22} c="#6b7a8d" />, "Auto Order Fulfillment", "Automatic order placement and tracking. Coming soon.", false],
        ].map(([icon, title, desc, available]) => (
          <div key={title} style={{ background: "#0e1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20, display: "flex", gap: 16, alignItems: "flex-start", opacity: available ? 1 : 0.6 }}>
            <div style={{ width: 42, height: 42, background: available ? "rgba(0,229,160,0.08)" : "rgba(255,255,255,0.04)", border: available ? "1px solid rgba(0,229,160,0.13)" : "1px solid rgba(255,255,255,0.07)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.93rem", color: "#f0f4f8" }}>{title}</div>
                {!available && <span style={{ background: "rgba(255,184,0,0.1)", color: "#ffb800", border: "1px solid rgba(255,184,0,0.2)", padding: "2px 8px", borderRadius: 100, fontSize: "0.66rem", fontWeight: 700 }}>Coming Soon</span>}
              </div>
              <p style={{ color: "#6b7a8d", fontSize: "0.82rem", lineHeight: 1.6 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ padding: "0 16px 60px" }}>
      <div style={{ background: "#0e1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "28px 20px" }}>
        <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 2, color: "#00e5a0", fontWeight: 600, marginBottom: 10 }}>Pricing</div>
        <div style={{ fontFamily: "Syne,sans-serif", fontSize: "1.6rem", fontWeight: 800, letterSpacing: -0.5, marginBottom: 8, color: "#f0f4f8" }}>Simple pricing</div>
        <p style={{ color: "#6b7a8d", marginBottom: 24, fontSize: "0.88rem" }}>3-day free trial. No credit card required.</p>
        <PricingCards setPage={setPage} />
      </div>
    </div>
    <div style={{ padding: "0 16px 60px" }}>
      <div style={{ background: "#0e1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "36px 20px", textAlign: "center" }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontSize: "1.6rem", fontWeight: 800, letterSpacing: -0.5, marginBottom: 10, color: "#f0f4f8" }}>Ready to automate?</div>
        <p style={{ color: "#6b7a8d", marginBottom: 24, fontSize: "0.88rem" }}>Join hundreds of dropshippers scaling with Dandrop.</p>
        <button onClick={() => setPage("signup")} style={{ ...S.btn, maxWidth: 300, margin: "0 auto", borderRadius: 10, padding: "13px 0" }}>Start Your 3-Day Free Trial</button>
      </div>
    </div>
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "24px 20px", textAlign: "center" }}>
      <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#f0f4f8", marginBottom: 14 }}>Dan<span style={{ color: "#00e5a0" }}>drop</span></div>
      <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", marginBottom: 16 }}>
        {[["features", "Features"], ["pricing", "Pricing"], ["about", "About"], ["contact", "Contact"]].map(([p, l]) => (
          <button key={p} onClick={() => setPage(p)} style={{ background: "none", border: "none", color: "#6b7a8d", fontSize: "0.83rem", cursor: "pointer", fontFamily: "DM Sans,sans-serif" }}>{l}</button>
        ))}
      </div>
      <p style={{ color: "#6b7a8d", fontSize: "0.78rem" }}>2025 Dandrop. Built for dropshippers who want to win.</p>
    </div>
  </div>
);

const FeaturesPage = ({ setPage }) => (
  <div style={{ paddingTop: 58, background: "#080b10", minHeight: "100vh" }}>
    <div style={{ padding: "40px 16px 60px" }}>
      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 2, color: "#00e5a0", fontWeight: 600, marginBottom: 10 }}>Features</div>
      <h1 style={{ fontFamily: "Syne,sans-serif", fontSize: "1.8rem", fontWeight: 800, letterSpacing: -0.5, marginBottom: 10, color: "#f0f4f8" }}>Everything you need to win</h1>
      <p style={{ color: "#6b7a8d", fontSize: "0.88rem", marginBottom: 28 }}>Start using Dandrop today — 5 powerful tools that work right now.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[[<SearchIc s={22} c="#00e5a0" />, "Product Research", "Score any product with Google Trends data. See if demand is rising or falling before you invest.", ["Google Trends scoring", "Winning score 0-100", "Profit margin preview", "Hot/Good/Avoid verdict"], true],
        [<DollarIc s={22} c="#00e5a0" />, "Profit Calculator", "Calculate exactly how much you make per sale after all costs.", ["Supplier and shipping costs", "Ad spend calculation", "Platform fee deduction", "ROI percentage"], true],
        [<StoreIc s={22} c="#00e5a0" />, "Supplier Comparison", "Compare up to 5 suppliers and find the best one automatically.", ["Price comparison", "Delivery speed scoring", "Overall ranking", "Best choice highlighted"], true],
        [<FileIc s={22} c="#00e5a0" />, "Invoice Generator", "Create professional branded invoices with preview and PDF download.", ["Invoice preview before download", "Download as PDF", "Share link", "Your business branding"], true],
        [<CalIc s={22} c="#00e5a0" />, "Store Scheduler", "Plan your store activities weeks in advance.", ["Product launch scheduling", "Sale and promotion planning", "Completion tracking", "Notes per event"], true],
        [<BoxIc s={22} c="#6b7a8d" />, "Auto Order Fulfillment", "Automatic order placement — coming when supplier API is connected.", ["Auto order placement", "Tracking updates", "Customer notifications", "Multi-supplier routing"], false],
        ].map(([icon, title, desc, points, available]) => (
          <div key={title} style={{ background: "#0e1318", border: available ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(255,255,255,0.04)", borderRadius: 14, padding: 20, opacity: available ? 1 : 0.6 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{ width: 42, height: 42, background: available ? "rgba(0,229,160,0.08)" : "rgba(255,255,255,0.04)", border: available ? "1px solid rgba(0,229,160,0.13)" : "1px solid rgba(255,255,255,0.07)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.93rem", color: "#f0f4f8" }}>{title}</div>
                  {!available && <span style={{ background: "rgba(255,184,0,0.1)", color: "#ffb800", border: "1px solid rgba(255,184,0,0.2)", padding: "2px 8px", borderRadius: 100, fontSize: "0.66rem", fontWeight: 700 }}>Coming Soon</span>}
                </div>
                <p style={{ color: "#6b7a8d", fontSize: "0.82rem", lineHeight: 1.6 }}>{desc}</p>
              </div>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6, paddingLeft: 4 }}>
              {points.map(p => <li key={p} style={{ fontSize: "0.8rem", color: "#6b7a8d", display: "flex", gap: 8, alignItems: "center" }}><CheckIc s={13} c={available ? "#00e5a0" : "#6b7a8d"} />{p}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <button onClick={() => setPage("signup")} style={{ ...S.btn, maxWidth: 300, margin: "0 auto", borderRadius: 10, padding: "13px 0" }}>Start Free Trial</button>
      </div>
    </div>
  </div>
);

const PricingPage = ({ setPage }) => (
  <div style={{ paddingTop: 58, background: "#080b10", minHeight: "100vh" }}>
    <div style={{ padding: "40px 16px 60px" }}>
      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 2, color: "#00e5a0", fontWeight: 600, marginBottom: 10 }}>Pricing</div>
      <h1 style={{ fontFamily: "Syne,sans-serif", fontSize: "1.8rem", fontWeight: 800, letterSpacing: -0.5, marginBottom: 8, color: "#f0f4f8" }}>Simple, honest pricing</h1>
      <p style={{ color: "#6b7a8d", fontSize: "0.88rem", marginBottom: 28 }}>3-day free trial. No credit card required to start.</p>
      <PricingCards setPage={setPage} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
        {[[<CheckIc s={18} c="#00e5a0" />, "No hidden fees", "The price you see is what you pay."],
        [<ArrowIc s={18} c="#00e5a0" />, "Cancel anytime", "No long-term contracts. Cancel whenever."],
        [<ShieldIc s={18} c="#00e5a0" />, "Secure payments", "All payments processed securely."]
        ].map(([icon, title, desc]) => (
          <div key={title} style={{ background: "#0e1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ flexShrink: 0, marginTop: 2 }}>{icon}</div>
            <div>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#f0f4f8", marginBottom: 3 }}>{title}</div>
              <p style={{ color: "#6b7a8d", fontSize: "0.8rem", lineHeight: 1.5 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AboutPage = ({ setPage }) => (
  <div style={{ paddingTop: 58, background: "#080b10", minHeight: "100vh" }}>
    <div style={{ padding: "40px 16px 60px" }}>
      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 2, color: "#00e5a0", fontWeight: 600, marginBottom: 10 }}>About</div>
      <h1 style={{ fontFamily: "Syne,sans-serif", fontSize: "1.8rem", fontWeight: 800, letterSpacing: -0.5, marginBottom: 12, color: "#f0f4f8" }}>Built for dropshippers</h1>
      <p style={{ color: "#6b7a8d", lineHeight: 1.7, fontSize: "0.88rem", marginBottom: 28 }}>Dandrop was built to solve one problem — dropshippers spending more time managing stores than growing them.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
        {[["500+", "Active Stores"], ["$2M+", "Revenue Tracked"], ["98%", "Uptime"], ["4.9", "Avg Rating"]].map(([n, l]) => (
          <div key={l} style={{ background: "#0e1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 16, textAlign: "center" }}>
            <div style={{ fontFamily: "Syne,sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#00e5a0", marginBottom: 4 }}>{n}</div>
            <div style={{ color: "#6b7a8d", fontSize: "0.78rem" }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "1rem", color: "#f0f4f8", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><UserIc s={16} c="#00e5a0" />The Team</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[["D", "Daniel", "Founder & CEO", "Built Dandrop to solve the automation problem every dropshipper faces."],
        ["A", "Alex M.", "Lead Engineer", "Full-stack developer obsessed with building fast and reliable systems."],
        ["S", "Sara K.", "Head of Support", "Ex-dropshipper turned support lead. Knows exactly what sellers need."]
        ].map(([init, name, role, bio]) => (
          <div key={name} style={{ background: "#0e1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20, display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#00e5a0,#00b8ff)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne,sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#000", flexShrink: 0 }}>{init}</div>
            <div>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.93rem", color: "#f0f4f8", marginBottom: 2 }}>{name}</div>
              <div style={{ color: "#00e5a0", fontSize: "0.76rem", marginBottom: 6 }}>{role}</div>
              <p style={{ color: "#6b7a8d", fontSize: "0.8rem", lineHeight: 1.6 }}>{bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ContactPage = ({ setPage }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  return (
    <div style={{ paddingTop: 58, background: "#080b10", minHeight: "100vh" }}>
      <div style={{ padding: "40px 16px 60px" }}>
        <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 2, color: "#00e5a0", fontWeight: 600, marginBottom: 10 }}>Contact</div>
        <h1 style={{ fontFamily: "Syne,sans-serif", fontSize: "1.8rem", fontWeight: 800, letterSpacing: -0.5, marginBottom: 8, color: "#f0f4f8" }}>Get in touch</h1>
        <p style={{ color: "#6b7a8d", fontSize: "0.88rem", marginBottom: 24 }}>We typically reply within a few hours.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {[[<FileIc s={18} c="#00e5a0" />, "Email", "hello@dandrop.io"], [<BellIc s={18} c="#00e5a0" />, "Support", "support@dandrop.io"], [<CalIc s={18} c="#00e5a0" />, "Response Time", "Within 24 hours"]].map(([icon, label, value]) => (
            <div key={label} style={{ display: "flex", gap: 12, alignItems: "center", background: "#0e1318", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
              <div><div style={{ fontSize: "0.74rem", color: "#6b7a8d" }}>{label}</div><div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#f0f4f8" }}>{value}</div></div>
            </div>
          ))}
        </div>
        <div style={S.card}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><CheckIc s={48} c="#00e5a0" /></div>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#f0f4f8", marginBottom: 6 }}>Message sent!</div>
              <p style={{ color: "#6b7a8d", fontSize: "0.84rem" }}>We will get back to you within 24 hours.</p>
            </div>
          ) : (
            <>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.97rem", color: "#f0f4f8", marginBottom: 16 }}>Send a message</div>
              {[["Name", "text", "Your name", "name"], ["Email", "email", "your@email.com", "email"]].map(([label, type, ph, key]) => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <label style={S.label}>{label}</label>
                  <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={S.inp} />
                </div>
              ))}
              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>Message</label>
                <textarea placeholder="How can we help?" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ ...S.inp, resize: "vertical", minHeight: 100 }} />
              </div>
              <button onClick={() => setSent(true)} style={S.btn}>Send Message</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  return (
    <AuthProvider>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080b10; overflow-x: hidden; font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 0; background: transparent; }
        input, textarea, button, select { font-family: 'DM Sans', sans-serif; }
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>
      <AppInner page={page} setPage={setPage} />
    </AuthProvider>
  );
}

function AppInner({ page, setPage }) {
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!loading && user && (page === "login" || page === "signup")) setPage("dashboard");
  }, [user, loading, page]);
  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#080b10" }}>
      <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#00e5a0" }}>Loading...</div>
    </div>
  );
  const pages = { landing: LandingPage, features: FeaturesPage, pricing: PricingPage, about: AboutPage, contact: ContactPage, signup: SignupPage, login: LoginPage };
  const Page = pages[page];
  return (
    <>
      <Nav setPage={setPage} />
      {Page ? <Page setPage={setPage} /> : user ? (page === "profile" ? <ProfilePage setPage={setPage} /> : <DashboardPage setPage={setPage} />) : <LoginPage setPage={setPage} />}
    </>
  );
}
