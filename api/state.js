// GET  /api/state → public board   |   POST /api/state → save (x-admin-password header)
const BASE = () => (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '').replace(/\/+$/, '');
const TOKEN = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
const hasDB = () => !!BASE() && !!TOKEN();

async function dbGet(key) {
  const r = await fetch(`${BASE()}/get/${encodeURIComponent(key)}`, { headers:{Authorization:`Bearer ${TOKEN()}`}, cache:'no-store' });
  if (!r.ok) return null;
  const d = await r.json();
  return d && d.result != null ? d.result : null;
}
async function dbSet(key, value) {
  let r = await fetch(`${BASE()}/set/${encodeURIComponent(key)}`, { method:'POST', headers:{Authorization:`Bearer ${TOKEN()}`}, body:value });
  if (!r.ok) r = await fetch(`${BASE()}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}`, { method:'POST', headers:{Authorization:`Bearer ${TOKEN()}`} });
  if (!r.ok) throw new Error('db write failed');
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') {
    if (!hasDB()) return res.status(200).json(null);
    try { const raw = await dbGet('board'); return res.status(200).json(raw ? JSON.parse(raw) : null); }
    catch { return res.status(200).json(null); }
  }
  if (req.method === 'POST') {
    if (!process.env.ADMIN_PASSWORD) return res.status(500).json({ ok:false, error:'ADMIN_PASSWORD env var not set — add it in Vercel and redeploy' });
    const pw = req.headers['x-admin-password'];
    if (!pw || pw !== process.env.ADMIN_PASSWORD) return res.status(401).json({ ok:false });
    if (req.body && req.body.verify) return res.status(200).json({ ok:true, db:hasDB() });
    const b = req.body;
    if (!b || !Array.isArray(b.players) || !b.bracket) return res.status(400).json({ ok:false });
    b.updated = Date.now();
    if (!hasDB()) return res.status(500).json({ ok:false, error:'no database attached — connect Redis in Vercel Storage and redeploy' });
    try { await dbSet('board', JSON.stringify(b)); } catch { return res.status(500).json({ ok:false, error:'database write failed' }); }
    return res.status(200).json({ ok:true });
  }
  res.status(405).json({ ok:false });
};