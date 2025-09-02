import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const dealerId = req.query.dealerId as string;
      
      if (dealerId) {
        const clients = await storage.getClientsWithDetailsByDealerId(dealerId);
        return res.json(clients);
      } else {
        const clients = await storage.getAllClientsWithDetails();
        return res.json(clients);
      }
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Clients API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}