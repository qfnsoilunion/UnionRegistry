import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAdminTotp } from '../../auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { code, enableTotp } = req.body;
    const verified = await verifyAdminTotp(code, enableTotp);
    
    if (verified) {
      res.json({ success: true });
    } else {
      res.status(401).json({ message: 'Invalid TOTP code' });
    }
  } catch (error) {
    console.error('Admin TOTP verification error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
}