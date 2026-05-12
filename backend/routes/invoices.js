// =============================================
// DANDROP — Invoice Routes
// File: backend/routes/invoices.js
// =============================================

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { generateInvoice } = require('../services/invoiceGenerator');
const { requireAuth, requireAccess } = require('../middleware/auth');

router.use(requireAuth, requireAccess);

// ─── GENERATE & DOWNLOAD INVOICE ──────────────
// GET /api/invoices/generate/:orderId
router.get('/generate/:orderId', async (req, res) => {
  try {
    // Get order details
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.orderId)
      .eq('user_id', req.user.id)
      .single();

    if (error || !order) return res.status(404).json({ error: 'Order not found' });

    // Get user business settings
    const { data: settings } = await supabase
      .from('business_settings')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    // Build invoice data
    const invoiceData = {
      invoiceNumber: `INV-${order.shopify_order_id || order.id}`,
      invoiceDate: new Date(order.created_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      }),
      business: {
        name: settings?.business_name || 'My Store',
        email: settings?.business_email || '',
        address: settings?.business_address || '',
        phone: settings?.business_phone || '',
        logoUrl: settings?.logo_url || null,
      },
      customer: {
        name: order.customer_name,
        email: order.customer_email,
        address: order.shipping_address,
        city: order.shipping_city,
        country: order.shipping_country,
      },
      order: {
        id: order.shopify_order_id || order.id,
        paymentMethod: 'Credit Card',
        status: 'Paid',
        shippingCost: order.shipping_cost || 0,
        trackingNumber: order.tracking_number,
        carrier: order.carrier,
      },
      items: order.line_items || [],
    };

    // Generate PDF
    const pdfBuffer = await generateInvoice(invoiceData);

    // Send as downloadable PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoiceData.invoiceNumber}.pdf"`);
    res.send(pdfBuffer);

  } catch (err) {
    res.status(500).json({ error: 'Failed to generate invoice: ' + err.message });
  }
});

// ─── SAVE BUSINESS SETTINGS ───────────────────
// POST /api/invoices/settings
router.post('/settings', async (req, res) => {
  try {
    const {
      businessName,
      businessEmail,
      businessAddress,
      businessPhone,
      logoUrl,
    } = req.body;

    const { data, error } = await supabase
      .from('business_settings')
      .upsert({
        user_id: req.user.id,
        business_name: businessName,
        business_email: businessEmail,
        business_address: businessAddress,
        business_phone: businessPhone,
        logo_url: logoUrl,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Business settings saved', settings: data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings: ' + err.message });
  }
});

// ─── GET BUSINESS SETTINGS ────────────────────
// GET /api/invoices/settings
router.get('/settings', async (req, res) => {
  try {
    const { data } = await supabase
      .from('business_settings')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    res.json({ settings: data || {} });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

module.exports = router;
