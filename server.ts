import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { SEEDED_DOCUMENT_TYPES } from './src/i18n/translations';
import { validateWaitlistInput } from './src/utils/vaultLogic';

interface WaitlistRecord {
  id: string;
  name: string;
  phoneOrEmail: string;
  familyType: string;
  districtOrCountry: string;
  preferredLang: 'ml' | 'en';
  createdAt: string;
}

const waitlistStore: WaitlistRecord[] = [
  {
    id: 'wl-1',
    name: 'Raghavan Nair',
    phoneOrEmail: '+919447102938',
    familyType: 'KERALA_RESIDENT',
    districtOrCountry: 'Ernakulam',
    preferredLang: 'ml',
    createdAt: '2026-10-24T10:00:00Z',
  },
  {
    id: 'wl-2',
    name: 'Anoop Nair',
    phoneOrEmail: '+971504829102',
    familyType: 'GULF_NRI',
    districtOrCountry: 'Dubai, UAE',
    preferredLang: 'en',
    createdAt: '2026-10-24T11:30:00Z',
  },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health & Readiness
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'kudumba-vault-phase-a',
      defaultLocale: process.env.VITE_DEFAULT_LOCALE || 'ml',
    });
  });

  // Data-driven Region & Document Type Catalog
  app.get('/api/catalog', (_req, res) => {
    res.json({
      regions: [
        { code: 'KL-IN', nameEn: 'Kerala, India', nameMl: 'കേരളം, ഇന്ത്യ' },
        { code: 'GCC', nameEn: 'Gulf Cooperation Council (UAE, KSA, Qatar, Oman, Kuwait, Bahrain)', nameMl: 'ഗൾഫ് രാജ്യങ്ങൾ (GCC)' },
      ],
      documentTypes: SEEDED_DOCUMENT_TYPES,
    });
  });

  // Waitlist & Founding Household Registration
  app.get('/api/waitlist', (_req, res) => {
    res.json({
      count: 146 + waitlistStore.length,
      recentLocations: ['Ernakulam', 'Dubai (UAE)', 'Kozhikode', 'Thrissur', 'Riyadh (KSA)'],
    });
  });

  app.post('/api/waitlist', (req, res) => {
    const check = validateWaitlistInput(req.body || {});
    if (!check.valid) {
      res.status(400).json({ error: check.errorEn, errorMl: check.errorMl });
      return;
    }

    const record: WaitlistRecord = {
      id: `wl-${Date.now()}`,
      name: String(req.body.name).trim(),
      phoneOrEmail: String(req.body.phoneOrEmail).trim(),
      familyType: String(req.body.familyType || 'KERALA_RESIDENT'),
      districtOrCountry: String(req.body.districtOrCountry).trim(),
      preferredLang: req.body.preferredLang === 'en' ? 'en' : 'ml',
      createdAt: new Date().toISOString(),
    };
    waitlistStore.push(record);

    res.status(201).json({
      ok: true,
      count: 146 + waitlistStore.length,
      entry: {
        id: record.id,
        familyType: record.familyType,
        districtOrCountry: record.districtOrCountry,
        preferredLang: record.preferredLang,
      },
    });
  });

  // Contact Inquiry Endpoint (Zero PII leaked in console logs)
  app.post('/api/contact', (req, res) => {
    const { name, phoneOrEmail, message } = req.body || {};
    if (!name || !phoneOrEmail || !message) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    res.status(201).json({ ok: true, receivedAt: new Date().toISOString() });
  });

  // SEO Sitemap & Robots.txt
  app.get('/sitemap.xml', (_req, res) => {
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    const pages = [
      '',
      'features',
      'how-it-works',
      'pricing',
      'security',
      'for-nris',
      'for-partners',
      'faq',
      'contact',
      'privacy',
      'terms',
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${baseUrl}/${p}</loc>
    <changefreq>weekly</changefreq>
    <priority>${p === '' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
    res.header('Content-Type', 'application/xml').send(xml);
  });

  app.get('/robots.txt', (_req, res) => {
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kudumba Vault server running on http://localhost:${PORT}`);
  });
}

startServer();
