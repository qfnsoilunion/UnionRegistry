import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const { type, query } = req.query;
      const searchQuery = query as string;
      
      if (!searchQuery) {
        return res.status(400).json({ message: 'Search query is required' });
      }

      let results: any;

      switch (type) {
        case 'persons':
          results = await storage.searchPersons({ name: searchQuery });
          break;
        case 'clients':
          results = await storage.searchClients({ name: searchQuery });
          break;
        default:
          // Global search across all entities
          const [persons, clients] = await Promise.all([
            storage.searchPersons({ name: searchQuery }),
            storage.searchClients({ name: searchQuery })
          ]);
          results = { persons, clients };
      }

      return res.json(results);
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}