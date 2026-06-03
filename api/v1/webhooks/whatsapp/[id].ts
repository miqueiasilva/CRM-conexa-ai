import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const expectedToken = `convexa_verify_token_${id}_sec`;

    if (mode === 'subscribe' && (token === expectedToken || token === 'convexa_verify_token_ddef2443_sec')) {
      return res.status(200).send(String(challenge));
    }

    return res.status(403).send('Forbidden');
  }

  if (req.method === 'POST') {
    console.log('WhatsApp webhook received:', JSON.stringify(req.body));
    return res.status(200).json({ received: true });
  }

  return res.status(405).send('Method Not Allowed');
}
