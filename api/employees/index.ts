import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const dealerId = req.query.dealerId as string;
      
      if (dealerId) {
        const employees = await storage.getEmployeesWithDetailsByDealerId(dealerId);
        return res.json(employees);
      } else {
        const employees = await storage.getAllEmployeesWithDetails();
        return res.json(employees);
      }
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Employees API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}