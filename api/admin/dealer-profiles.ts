import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../storage';
import { hashPassword } from '../utils/hash';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'PUT') {
    // Edit dealer profile
    const { dealerId, username, email, mobile } = req.body;
    if (!dealerId || !username || !email || !mobile) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
      await storage.updateDealerProfile(dealerId, { username, email, mobile });
      return res.json({ success: true });
    } catch (error) {
      console.error('Edit dealer profile error:', error);
      return res.status(500).json({ message: 'Failed to update dealer profile' });
    }
  }
  res.status(405).json({ message: 'Method not allowed' });
}
