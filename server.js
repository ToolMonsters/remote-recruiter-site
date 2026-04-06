const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FLODESK_API_KEY = process.env.FLODESK_API_KEY;
const SEGMENT_ID = '692f748e026f9b69dda924ae'; // NEWSLETTER SIGN UP (WELCOME)

app.use(express.json());

app.post('/api/subscribe', async (req, res) => {
  const { first_name, last_name, email, subject } = req.body;

  if (!email || !first_name) {
    return res.status(400).json({ error: 'First name and email are required.' });
  }

  try {
    const response = await fetch('https://api.flodesk.com/v1/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(FLODESK_API_KEY + ':').toString('base64')
      },
      body: JSON.stringify({
        email,
        first_name,
        last_name: last_name || '',
        custom_fields: { subject: subject || '' },
        segment_ids: [SEGMENT_ID]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json(error);
    }

    const data = await response.json();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
  }
});

app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
