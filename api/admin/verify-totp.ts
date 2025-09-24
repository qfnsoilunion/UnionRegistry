import type { VercelRequest, VercelResponse } from '@vercel/node';


  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  // 2FA is disabled: always succeed
  res.json({ success: true });
}
}