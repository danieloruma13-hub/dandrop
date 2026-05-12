// =============================================
// DANDROP — Branded Invoice Generator
// File: backend/services/invoiceGenerator.js
// Generates professional PDF invoices
// =============================================

// Install: npm install pdfkit
const PDFDocument = require('pdfkit');

// ─── GENERATE INVOICE PDF ─────────────────────
const generateInvoice = (invoiceData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      doc.on('data', chunk => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const {
        business,   // user's business details
        customer,   // customer details
        order,      // order details
        items,      // line items
        invoiceNumber,
        invoiceDate,
      } = invoiceData;

      const pageWidth = doc.page.width - 100; // with margins

      // ─ HEADER ─
      // Logo / Business name
      doc.rect(0, 0, doc.page.width, 120).fill('#080b10');

      if (business.logoUrl) {
        // In production: load logo from URL
        // doc.image(business.logoUrl, 50, 20, { width: 80 });
      }

      doc
        .fillColor('#00e5a0')
        .font('Helvetica-Bold')
        .fontSize(28)
        .text(business.name || 'Your Store', 50, 35);

      doc
        .fillColor('#6b7a8d')
        .font('Helvetica')
        .fontSize(10)
        .text('INVOICE', 50, 70)
        .text(`#${invoiceNumber}`, 50, 84);

      // Invoice date top right
      doc
        .fillColor('#f0f4f8')
        .fontSize(10)
        .text(`Date: ${invoiceDate}`, 400, 50, { width: 150, align: 'right' })
        .text(`Due: ${invoiceDate}`, 400, 65, { width: 150, align: 'right' });

      doc.moveDown(4);

      // ─ FROM / TO ─
      doc.fillColor('#080b10').rect(50, 140, pageWidth, 1).fill('#1a2332');

      doc.y = 160;

      // FROM column
      doc
        .fillColor('#00e5a0')
        .font('Helvetica-Bold')
        .fontSize(9)
        .text('FROM', 50, 165, { width: 250 });

      doc
        .fillColor('#f0f4f8')
        .font('Helvetica-Bold')
        .fontSize(11)
        .text(business.name || 'Your Store', 50, 180, { width: 250 });

      doc
        .fillColor('#6b7a8d')
        .font('Helvetica')
        .fontSize(9)
        .text(business.email || '', 50, 195, { width: 250 })
        .text(business.address || '', 50, 208, { width: 250 })
        .text(business.phone || '', 50, 221, { width: 250 });

      // TO column
      doc
        .fillColor('#00e5a0')
        .font('Helvetica-Bold')
        .fontSize(9)
        .text('BILL TO', 310, 165, { width: 250 });

      doc
        .fillColor('#f0f4f8')
        .font('Helvetica-Bold')
        .fontSize(11)
        .text(customer.name, 310, 180, { width: 250 });

      doc
        .fillColor('#6b7a8d')
        .font('Helvetica')
        .fontSize(9)
        .text(customer.email || '', 310, 195, { width: 250 })
        .text(customer.address || '', 310, 208, { width: 250 })
        .text(`${customer.city || ''}, ${customer.country || ''}`, 310, 221, { width: 250 });

      // ─ LINE ITEMS TABLE ─
      doc.y = 270;

      // Table header
      doc.rect(50, 270, pageWidth, 28).fill('#0e1318');

      doc
        .fillColor('#6b7a8d')
        .font('Helvetica-Bold')
        .fontSize(8)
        .text('ITEM', 60, 281)
        .text('QTY', 340, 281)
        .text('UNIT PRICE', 390, 281)
        .text('TOTAL', 480, 281);

      // Line items
      let y = 310;
      let subtotal = 0;

      for (const item of items) {
        const lineTotal = item.quantity * item.price;
        subtotal += lineTotal;

        // Alternate row background
        if (items.indexOf(item) % 2 === 0) {
          doc.rect(50, y - 8, pageWidth, 26).fill('#0a0f16');
        }

        doc
          .fillColor('#f0f4f8')
          .font('Helvetica-Bold')
          .fontSize(9)
          .text(item.name, 60, y, { width: 270 });

        doc
          .fillColor('#6b7a8d')
          .font('Helvetica')
          .fontSize(8)
          .text(item.sku || '', 60, y + 12, { width: 270 });

        doc
          .fillColor('#f0f4f8')
          .font('Helvetica')
          .fontSize(9)
          .text(item.quantity.toString(), 340, y)
          .text(`$${item.price.toFixed(2)}`, 390, y)
          .text(`$${lineTotal.toFixed(2)}`, 480, y);

        y += 36;
      }

      // ─ TOTALS ─
      y += 10;
      doc.rect(50, y, pageWidth, 1).fill('#1a2332');
      y += 14;

      const tax = subtotal * 0; // No tax by default
      const shipping = order.shippingCost || 0;
      const total = subtotal + tax + shipping;

      const totalsX = 390;

      doc
        .fillColor('#6b7a8d')
        .font('Helvetica')
        .fontSize(9)
        .text('Subtotal', totalsX, y)
        .text(`$${subtotal.toFixed(2)}`, 480, y);

      y += 18;
      if (shipping > 0) {
        doc
          .text('Shipping', totalsX, y)
          .text(`$${shipping.toFixed(2)}`, 480, y);
        y += 18;
      }

      // Total box
      doc.rect(370, y, pageWidth - 320, 32).fill('#00e5a0');

      doc
        .fillColor('#000000')
        .font('Helvetica-Bold')
        .fontSize(11)
        .text('TOTAL', totalsX, y + 10)
        .text(`$${total.toFixed(2)}`, 480, y + 10);

      // ─ ORDER INFO ─
      y += 60;

      doc
        .fillColor('#00e5a0')
        .font('Helvetica-Bold')
        .fontSize(9)
        .text('ORDER INFORMATION', 50, y);

      y += 14;
      doc
        .fillColor('#6b7a8d')
        .font('Helvetica')
        .fontSize(8)
        .text(`Order ID: ${order.id}`, 50, y)
        .text(`Payment: ${order.paymentMethod || 'Credit Card'}`, 200, y)
        .text(`Status: ${order.status || 'Paid'}`, 350, y);

      // ─ TRACKING ─
      if (order.trackingNumber) {
        y += 20;
        doc
          .fillColor('#6b7a8d')
          .text(`Tracking Number: ${order.trackingNumber}`, 50, y)
          .text(`Carrier: ${order.carrier || 'Standard Shipping'}`, 300, y);
      }

      // ─ FOOTER ─
      const footerY = doc.page.height - 80;

      doc.rect(0, footerY - 10, doc.page.width, 1).fill('#1a2332');

      doc
        .fillColor('#6b7a8d')
        .font('Helvetica')
        .fontSize(8)
        .text(
          `Thank you for your purchase! Questions? Contact ${business.email || 'support@yourstore.com'}`,
          50, footerY,
          { width: pageWidth, align: 'center' }
        )
        .text(
          `Powered by Dandrop`,
          50, footerY + 16,
          { width: pageWidth, align: 'center' }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateInvoice };
