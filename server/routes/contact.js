const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

// Build a reusable transporter using environment variables
function createTransporter() {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = Number(process.env.EMAIL_PORT || 587);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn('Email credentials are not configured. Set EMAIL_USER and EMAIL_PASS in your environment.');
    if (process.env.NODE_ENV !== 'production') {
      // In development, use a json transport to avoid failing when creds are missing
      return nodemailer.createTransport({ jsonTransport: true });
    }
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: user && pass ? { user, pass } : undefined,
  });
}

// POST /api/contact - send contact form message
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message, preferredContact } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required.' });
    }

    const transporter = createTransporter();

    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@healthwise.clinic';
    const toEmail = process.env.EMAIL_TO || process.env.EMAIL_USER || 'phthutshedzomadula3@gmail.com';

    const mailSubject = subject && subject.trim().length > 0
      ? `[Contact] ${subject}`
      : `[Contact] New message from ${name}`;

    const detailsHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2 style="margin:0 0 10px;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        ${preferredContact ? `<p><strong>Preferred Contact:</strong> ${preferredContact}</p>` : ''}
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
        <hr style="border:none;border-top:1px solid #eee;margin:10px 0;" />
        <p style="white-space:pre-wrap;">${message}</p>
      </div>
    `;

    // Send to clinic inbox
    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      replyTo: email, // allow replying directly to the sender
      subject: mailSubject,
      html: detailsHtml,
    });

    // Optional: confirmation email to the sender
    try {
      await transporter.sendMail({
        from: fromEmail,
        to: email,
        subject: 'We received your message – Healthwise Clinic',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p>Hi ${name.split(' ')[0] || 'there'},</p>
            <p>Thanks for contacting Healthwise Clinic. We’ve received your message and will get back to you within 24–48 hours.</p>
            <p style="margin:0 0 6px;"><strong>Summary:</strong></p>
            <ul style="margin:0;padding-left:18px;">
              ${subject ? `<li><strong>Subject:</strong> ${subject}</li>` : ''}
              <li><strong>Preferred contact:</strong> ${preferredContact || 'email'}</li>
            </ul>
            <p style="margin-top:14px;">If this is urgent, please call our reception.</p>
            <p style="margin-top:16px;">— Healthwise Clinic</p>
          </div>
        `,
      });
    } catch (e) {
      // Don't fail the whole request if confirmation fails
      console.warn('Failed to send confirmation email to sender:', e.message);
    }

    res.json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Contact form send error:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
});

module.exports = router;
