import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator'; // Hono-native validation hook [cite: 123]
import { z } from 'zod';

// 1. Map out your Cloudflare infrastructural environment bindings [cite: 112]
type Bindings = {
  DB: D1Database;
  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// 2. Enable safe communication routes for your Astro front-end
app.use('*', cors({
  origin: ['https://evillite.wiki', 'http://localhost:4321'], // Allow production and local Astro ports
  credentials: true,
}));

// 3. Setup your Zod Validation Contracts [cite: 123, 127]
const submitPluginSchema = z.object({
  githubUrl: z.string().url().regex(/^https:\/\/github\.com\/[\w-]+\/[\w-]+$/),
});

// 4. Custom Discord Admin Gatekeeper Middleware
const discordAdminGate = () => async (c: any, next: any) => {
  // In a full implementation, you would extract a secure JWT token from user headers or cookies here.
  // For now, checking if a simulated admin condition is met.
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: "Access Denied: Please log in via Discord to continue." }, 401);
  }

  // Proceed securely to the protected administrative endpoint handler if valid
  await next();
};

/* --- API Endpoints --- */

// Public manifest tracking endpoint for the Electron Client and public web elements [cite: 93, 117]
app.get('/manifest.json', async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT id, name, description, author, current_version as version, download_url as url FROM plugins WHERE status = 'approved'"
  ).all();
  return c.json(results);
});

// Public plugin repository submission route protected by fast edge Zod parsing [cite: 123, 133]
app.post('/api/plugins/submit', zValidator('json', submitPluginSchema), async (c) => {
  const { githubUrl } = c.req.valid('json'); // Data is guaranteed verified [cite: 123]

  // Handle insertion logic into D1 database review queues here...

  return c.json({ success: true, message: "Added to queue." }, 202);
});

// Admin Queue View Endpoint protected by Discord identity checkpoint middleware
app.get('/api/admin/queue', discordAdminGate(), async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM plugins WHERE status = 'pending'").all();
  return c.json(results);
});

// Export the type definition so your Svelte forms gain automatic compile-time RPC type-safety! [cite: 114, 116]
export type AppType = typeof app;
export default app;