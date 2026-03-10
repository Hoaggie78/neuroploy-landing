export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const PUBLICATION_ID = 'pub_39296169-46cd-45dc-ae1c-f3ee0bf3b0e4';
  const API_KEY = process.env.BEEHIIV_API_KEY;

  try {
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Beehiiv error:', data);
      return res.status(500).json({ error: 'Subscription failed' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
