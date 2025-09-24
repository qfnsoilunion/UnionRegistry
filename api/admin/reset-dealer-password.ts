import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../storage';
import { randomBytes } from 'crypto';
import { hashPassword } from '../utils/hash';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { dealerId } = req.body;
  if (!dealerId) {
    return res.status(400).json({ message: 'Missing dealerId' });
  }

  try {
    // Generate a random temporary password
    const tempPassword = randomBytes(4).toString('hex');
    const hashedPassword = await hashPassword(tempPassword);

    // Update dealer's password and set a flag for first login
    await storage.updateDealerPassword(dealerId, hashedPassword, true);

    res.json({ success: true, newPassword: tempPassword });
  } catch (error) {
    console.error('Reset dealer password error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
}
