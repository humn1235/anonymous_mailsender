require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware'ler
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Nodemailer transporter (Gmail App Password ile)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.MAIL_USER, // Gmail adresin
    pass: process.env.MAIL_PASS  // Gmail App Password
  }
});

// POST /send endpoint
app.post('/send', async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: 'Missing recipient or message' });
  }

  try {
    await transporter.sendMail({
      from: `"Anonymous Mailer 👻" <${process.env.MAIL_USER}>`,
      to,
      subject: '📩 Anonymous Message for You',
      text: message
    });

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Mail send error:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
