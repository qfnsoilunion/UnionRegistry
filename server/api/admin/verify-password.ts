import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAdminPassword } from '../../auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { password } = req.body;
    const result = await verifyAdminPassword(password);
    
    if (result.success) {
      res.json({
        success: true,
        totpEnabled: result.totpEnabled,
        qrCode: result.qrCode,
      });
    } else {
      res.status(401).json({ message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Admin password verification error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
}