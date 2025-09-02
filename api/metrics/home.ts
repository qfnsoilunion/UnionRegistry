import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const metrics = await storage.getHomeMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching home metrics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}