import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../storage';
import { logAudit } from '../utils/audit';
import { createDealerSchema } from '../utils/validators';

function getActorFromHeaders(req: VercelRequest): string {
  const actor = req.headers["x-actor"];
  if (!actor) {
    throw new Error("x-actor header is required");
  }
  return actor as string;
}

function requireAdmin(req: VercelRequest): boolean {
  const adminAuth = req.headers["x-admin-auth"];
  return adminAuth === "true";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const dealers = await storage.getDealers();
      return res.json(dealers);
    }

    if (req.method === 'POST') {
      if (!requireAdmin(req)) {
        return res.status(401).json({ message: "Admin authentication required" });
      }

      const actor = getActorFromHeaders(req);
      const validatedData = createDealerSchema.parse(req.body);
      const dealer = await storage.createDealer(validatedData);
      
      await logAudit(
        actor,
        "CREATE",
        "dealer",
        dealer.id,
        { dealerName: dealer.legalName }
      );

      return res.status(201).json(dealer);
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Dealers API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}