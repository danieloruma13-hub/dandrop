const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const supabase = require('../config/supabase');
const { requireAuth } = require('../middleware/auth');

const PLAN_PRICE_MAP = {
  starter: process.env.STRIPE_STARTER_PRICE_ID,
  pro: process.env.STRIPE_PRO_PRICE_ID,
  business: process.env.STRIPE_BUSINESS_PRICE_ID,
};

// POST /api/stripe/create-checkout - Start Stripe checkout
router.post('/create-checkout', requireAuth, async (req, res) => {
  try {
    const { planName } = req.body;
    const priceId = PLAN_PRICE_MAP[planName];

    if (!priceId) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', req.user.id)
      .single();

    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', req.user.id)
      .single();

    let customerId = existingSub?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile.email,
        metadata: { supabase_user_id: req.user.id },
      });
      customerId = customer.id;
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
      metadata: {
        user_id: req.user.id,
        plan_name: planName,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// POST /api/stripe/create-portal - Customer billing portal
router.post('/create-portal', requireAuth, async (req, res) => {
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', req.user.id)
      .single();

    if (!subscription?.stripe_customer_id) {
      return res.status(404).json({ error: 'No subscription found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}/dashboard`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create billing portal' });
  }
});

// POST /api/stripe/webhook - Stripe event webhooks
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const data = event.data.object;

  switch (event.type) {
    case 'checkout.session.completed': {
      const userId = data.metadata.user_id;
      const planName = data.metadata.plan_name;

      // Get plan from DB
      const { data: plan } = await supabase
        .from('plans')
        .select('id')
        .eq('name', planName)
        .single();

      // Upsert subscription
      await supabase.from('subscriptions').upsert({
        user_id: userId,
        plan_id: plan.id,
        stripe_subscription_id: data.subscription,
        stripe_customer_id: data.customer,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      break;
    }

    case 'invoice.payment_succeeded': {
      await supabase
        .from('subscriptions')
        .update({ status: 'active', updated_at: new Date().toISOString() })
        .eq('stripe_subscription_id', data.subscription);
      break;
    }

    case 'invoice.payment_failed': {
      await supabase
        .from('subscriptions')
        .update({ status: 'past_due', updated_at: new Date().toISOString() })
        .eq('stripe_subscription_id', data.subscription);
      break;
    }

    case 'customer.subscription.deleted': {
      await supabase
        .from('subscriptions')
        .update({ status: 'canceled', updated_at: new Date().toISOString() })
        .eq('stripe_subscription_id', data.id);
      break;
    }

    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
