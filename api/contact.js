// Vercel / Node Serverless Function: /api/contact
// Securely validates contact submissions and sends email notifications via Resend API
// Zero credentials exposed in frontend code.

export default async function handler(req, res) {
  // 1. CORS & Method Guard
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { name, email, topic, message, timestamp } = req.body || {};

    // 2. Server-side Validation
    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanTopic = String(topic || 'Feedback').trim();
    const cleanMessage = String(message || '').trim();
    const submissionTime = timestamp || new Date().toISOString();

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({ error: 'Invalid name provided (min 2 characters required).' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Invalid email address provided.' });
    }

    if (!cleanMessage || cleanMessage.length < 5) {
      return res.status(400).json({ error: 'Message must be at least 5 characters long.' });
    }

    // 3. Email Delivery Configuration
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'openingtruth3107@gmail.com';
    const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

    if (!RESEND_API_KEY) {
      console.warn("WARNING: RESEND_API_KEY environment variable is not configured on the server.");
      // In development / demo environment without keys configured yet:
      return res.status(200).json({
        success: true,
        mock: true,
        message: 'Message validated. Configure RESEND_API_KEY in environment variables to enable live SMTP delivery.'
      });
    }

    // 4. Formatted Email Payload
    const emailSubject = `[CleanAir India] New Contact Message — ${cleanTopic}`;
    const emailBody = `New message received from CleanAir India.

Name: ${cleanName}
Email: ${cleanEmail}
Topic: ${cleanTopic}
Submitted: ${submissionTime}

Message:
${cleanMessage}
`;

    // 5. Send via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `CleanAir India <${SENDER_EMAIL}>`,
        to: [NOTIFICATION_EMAIL],
        reply_to: cleanEmail, // Enables direct Reply button to user in Gmail
        subject: emailSubject,
        text: emailBody
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend API delivery error:", errorText);
      return res.status(502).json({ error: 'Failed to send email notification via provider.', details: errorText });
    }

    const result = await response.json();
    return res.status(200).json({
      success: true,
      id: result.id,
      message: 'Contact message received and notification email dispatched successfully.'
    });

  } catch (err) {
    console.error("Serverless contact handler exception:", err);
    return res.status(500).json({ error: 'Internal server error while processing contact form.' });
  }
}
