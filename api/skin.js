// GET /api/skin?n=Name&u=uuid&s=size → same-origin Minecraft head (PNG)
const chain = (n, u, s) => {
  const list = [];
  if (u) {
    list.push(`https://crafatar.com/avatars/${u}?size=${s}&overlay`);
    list.push(`https://visage.surgeplay.com/face/${s}/${u}`);
  }
  list.push(`https://mc-heads.net/avatar/${encodeURIComponent(n)}/${s}`);
  list.push(`https://minotar.net/helm/${encodeURIComponent(n)}/${s}.png`);
  list.push(`https://visage.surgeplay.com/face/${s}/${encodeURIComponent(n)}`);
  return list;
};

module.exports = async (req, res) => {
  const n = String((req.query && req.query.n) || 'MHF_Steve').slice(0, 16) || 'MHF_Steve';
  const u = String((req.query && req.query.u) || '').replace(/[^0-9a-fA-F]/g, '') || null;
  const s = Math.min(Math.max(parseInt((req.query && req.query.s) || '64', 10) || 64, 16), 360);

  for (const url of chain(n, u, s)) {
    try {
      const r = await fetch(url);
      if (r.ok) {
        const buf = Buffer.from(await r.arrayBuffer());
        if (buf.length > 100) {
          res.setHeader('Content-Type', 'image/png');
          res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
          return res.status(200).send(buf);
        }
      }
    } catch (e) { /* try next source */ }
  }
  return res.status(404).end();
};