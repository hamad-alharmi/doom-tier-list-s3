// POST /api/request → forwards a tier test request to the staff Discord channel
const WEBHOOK = () => process.env.TIER_TEST_WEBHOOK || 'https://discord.com/api/webhooks/1550870485842141264/dZun9Usn824NgJ8jy4uUD-TngUhzU7h820p9EUmY52sy6p6kLesBwGdWgiTfuYRMnI1G';
const clean = (s, n) => String(s || '').slice(0, n);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok:false });
  const b = req.body;
  if (!b || !b.ign || !b.discord) return res.status(400).json({ ok:false });
  const payload = {
    username: 'Tier Test Requests',
    embeds: [{
      title: '🎯 New Tier Test Request',
      color: 0xe11d48,
      fields: [
        { name:'IGN', value: '`'+clean(b.ign,16)+'`' + (b.accountVerified ? ' ✅' : ' ⚠️ not verified'), inline:true },
        { name:'Discord', value: '`'+clean(b.discord,32)+'`', inline:true },
        { name:'Current → Requested', value: '`'+clean(b.current,4)+'` → `'+clean(b.requested,4)+'`', inline:true },
        { name:'Notes', value: clean(b.notes,500) || '—' }
      ],
      footer:{ text:'Doom SMP · Season 3 — ip: doomevents.net' },
      timestamp: new Date().toISOString()
    }]
  };
  try {
    const r = await fetch(WEBHOOK(), { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    return res.status(r.ok ? 200 : 502).json({ ok:r.ok });
  } catch { return res.status(502).json({ ok:false }); }
};