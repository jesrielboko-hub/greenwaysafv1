const express = require('express');
const compression = require('compression');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const store = require('./lib/store');
const schemas = require('./lib/schemas');
const H = require('./lib/helpers');
let sharp = null; try { sharp = require('sharp'); } catch (e) { /* optional: images saved as-is */ }

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(compression());
const PORT = process.env.PORT || 3000;
const SECRET = process.env.SESSION_SECRET || crypto.randomBytes(24).toString('hex');
const ADMIN_PW = process.env.ADMIN_PASSWORD || '';
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 12 * 1024 * 1024, files: 30 } });

app.use('/uploads', express.static(store.UPLOADS, { maxAge: '30d', immutable: true }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '7d' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ---------- redirects (data/redirects.json: {"/old-path": "/new-path"}) ----------
app.use((req, res, next) => {
  const t = store.redirects()[req.path.replace(/\/+$/, '') || '/'];
  if (t) return res.redirect(301, t);
  if (req.path.length > 1 && req.path.endsWith('/') && !req.path.startsWith('/admin')) return res.redirect(301, req.path.slice(0, -1) + (req.url.slice(req.path.length) || ''));
  next();
});

// ---------- shared template locals ----------
const CAT_LABEL = { build: 'Build', renovate: 'Renovate', fix: 'Fix', maintain: 'Maintain', specialty: 'Specialty' };
const CAT_BLURB = {
  build: ['New Athletic Field Construction', 'construction'],
  renovate: ['Field Renovation & Improvements', 'renovation'],
  fix: ['Drainage, Irrigation, Grading & Field Repairs', 'drainage'],
  maintain: ['Athletic Field Maintenance & Turf Management', 'maintenance'],
  specialty: ['Infield Work, Deep-Tine Aeration, Laser Grading & More', 'aeration'],
};
app.use((req, res, next) => {
  const S = store.settings();
  const L = res.locals;
  Object.assign(L, { S, H, icon: H.icon, esc: H.esc, paras: H.paras, isPh: H.isPh, CAT_LABEL, CAT_BLURB, path: req.path, schemas });
  L.base = (S.siteUrl || '').replace(/\/$/, '');
  L.industriesNav = store.pub('industries').sort((a, b) => (a.order || 0) - (b.order || 0));
  L.ph = (t) => (S.showPlaceholders ? `<p class="ph-note">${H.esc(t)}</p>` : '');
  L.tel = (S.phone || '').replace(/[^\d+]/g, '');
  L.pic = (src, alt, label, cls = '', eager) => {
    if (src) return `<img class="${cls}" src="${H.esc(src)}" alt="${H.esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
    return `<div class="ph-img ${cls}" role="img" aria-label="${H.esc(alt)}">${S.showPlaceholders ? `<span>ADD PHOTO<br><b>${H.esc(label || alt)}</b></span>` : ''}</div>`;
  };
  L.projLoc = (p) => [p.city, p.state].filter(Boolean).join(', ');
  L.testimonialsFor = (fn) => store.pub('testimonials').filter(fn);
  res.page = (view, meta, data = {}) => {
    ejs.renderFile(path.join(__dirname, 'views', view + '.ejs'), { ...L, ...data, meta }, (err, body) => {
      if (err) return next(err);
      const full = meta.rawTitle ? meta.title : (meta.title ? meta.title + ' | ' + S.name : S.name);
      res.status(meta.status || 200).render('layout', { ...L, ...data, body, meta: { ...meta, full, canonical: L.base + (meta.canonical || req.path) } });
    });
  };
  next();
});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const sortBy = (a, k) => a.slice().sort((x, y) => (x[k] || 0) - (y[k] || 0));
const services = () => sortBy(store.pub('services'), 'order');
const projects = () => store.pub('projects').sort((a, b) => (b.year || 0) - (a.year || 0));
const crumbs = (...c) => [['Home', '/'], ...c];

// ---------- public pages ----------
app.get('/', (req, res) => {
  const P = projects();
  const feat = P.filter((p) => p.featured).slice(0, 6);
  res.page('home', {
    title: 'Athletic Field Construction, Renovation & Maintenance', rawTitle: false,
    description: `${res.locals.S.name} constructs, renovates and maintains athletic fields for municipalities, schools, universities and sports organizations.`,
  }, { services: services(), projects: feat.length ? feat : P.slice(0, 6), resource: store.pub('resources').find((r) => r.featured) });
});

app.get('/services', (req, res) => res.page('services', {
  title: 'Athletic Field Services', description: 'Athletic field construction, renovation, drainage, irrigation, grading and maintenance services from Greenway Athletic Field Services.',
  crumbs: crumbs(['Services', '/services']),
}, { services: services() }));

app.get('/services/:slug', (req, res, next) => {
  const sv = store.find('services', req.params.slug);
  if (!sv || sv.published === false) return next();
  const all = services();
  res.page('service', {
    title: sv.seoTitle || sv.name, rawTitle: !!sv.seoTitle, description: sv.seoDescription || sv.short,
    crumbs: crumbs(['Services', '/services'], [sv.name, '/services/' + sv.slug]), ogImage: sv.heroImage,
  }, {
    sv, related: (sv.relatedServices || []).map((s) => all.find((x) => x.slug === s)).filter(Boolean),
    projs: projects().filter((p) => (p.services || []).includes(sv.slug)),
    tests: store.pub('testimonials').filter((t) => (t.services || []).includes(sv.slug)),
    faqs: H.faqs(sv.faqs),
  });
});

app.get('/projects', (req, res) => {
  const q = req.query, P = projects();
  const f = P.filter((p) => (!q.sport || (p.sports || []).includes(q.sport)) && (!q.type || p.projectType === q.type) &&
    (!q.state || p.state === q.state) && (!q.service || (p.services || []).includes(q.service)) && (!q.year || String(p.year) === q.year));
  const uniq = (fn) => [...new Set(P.map(fn).flat().filter(Boolean))].sort();
  res.page('projects', {
    title: 'Athletic Field Projects', description: 'Completed athletic field construction, renovation and maintenance projects by Greenway Athletic Field Services.',
    crumbs: crumbs(['Projects', '/projects']), canonical: '/projects',
  }, { list: f, q, opts: { sport: uniq((p) => p.sports), type: uniq((p) => p.projectType), state: uniq((p) => p.state), year: uniq((p) => p.year).reverse() }, services: services() });
});

app.get('/projects/:slug', (req, res, next) => {
  const pr = store.find('projects', req.params.slug);
  if (!pr || pr.published === false) return next();
  const all = services();
  const rel = projects().filter((x) => x.slug !== pr.slug && ((x.services || []).some((s) => (pr.services || []).includes(s)) || x.state === pr.state)).slice(0, 3);
  res.page('project', {
    title: pr.seoTitle || `${pr.name} – ${res.locals.projLoc(pr)}`, rawTitle: !!pr.seoTitle,
    description: pr.seoDescription || pr.overview || `${pr.name} in ${res.locals.projLoc(pr)}, an athletic field project by ${res.locals.S.name}.`,
    crumbs: crumbs(['Projects', '/projects'], [pr.name, '/projects/' + pr.slug]), ogImage: pr.heroImage,
  }, {
    pr, used: (pr.services || []).map((s) => all.find((x) => x.slug === s)).filter(Boolean), rel,
    client: store.find('industries', pr.clientType),
    tests: store.pub('testimonials').filter((t) => t.project === pr.slug),
  });
});

app.get('/industries', (req, res) => res.page('industries', {
  title: 'Who We Serve', description: 'Greenway Athletic Field Services works with municipalities, parks and recreation departments, schools, colleges and universities, and sports organizations.',
  crumbs: crumbs(['Who We Serve', '/industries']),
}));
app.get('/industries/:slug', (req, res, next) => {
  const ind = store.find('industries', req.params.slug);
  if (!ind || ind.published === false) return next();
  const all = services();
  res.page('industry', {
    title: ind.seoTitle || `Athletic Field Services for ${ind.name}`, rawTitle: !!ind.seoTitle,
    description: ind.seoDescription || `Athletic field construction, renovation and maintenance for ${ind.name.toLowerCase()} from ${res.locals.S.name}.`,
    crumbs: crumbs(['Who We Serve', '/industries'], [ind.name, '/industries/' + ind.slug]), ogImage: ind.heroImage,
  }, {
    ind, svcs: (ind.services || []).map((s) => all.find((x) => x.slug === s)).filter(Boolean),
    projs: projects().filter((p) => p.clientType === ind.slug),
    tests: store.pub('testimonials').filter((t) => (t.industries || []).includes(ind.slug)),
  });
});

app.get('/about', (req, res) => res.page('about', {
  title: 'About – Decades of Athletic Field Experience', description: 'Greenway Athletic Field Services brings decades of landscape and athletic field construction, renovation and maintenance experience to every project.',
  crumbs: crumbs(['About', '/about']),
}, { team: sortBy(store.pub('team'), 'order') }));

app.get('/resources', (req, res) => res.page('resources', {
  title: 'Athletic Field Resources', description: 'Guides, articles and videos on athletic field construction, renovation and maintenance from Greenway Athletic Field Services.',
  crumbs: crumbs(['Resources', '/resources']),
}, { list: store.pub('resources') }));
app.get('/resources/:slug', (req, res, next) => {
  const r = store.find('resources', req.params.slug);
  if (!r || r.published === false) return next();
  res.page('resource', {
    title: r.seoTitle || r.title, rawTitle: !!r.seoTitle, description: r.seoDescription || r.summary,
    crumbs: crumbs(['Resources', '/resources'], [r.title, '/resources/' + r.slug]), ogImage: r.image,
  }, { r });
});

// ---------- contact / lead capture ----------
const hits = {};
app.get('/contact', (req, res) => res.page('contact', {
  title: 'Request a Field Assessment', description: 'Tell Greenway Athletic Field Services about your field. Share photos and details to request a field assessment or project consultation.',
  crumbs: crumbs(['Contact', '/contact']), canonical: '/contact',
}, { services: services(), q: req.query, sent: false, err: '' }));

app.post('/contact', upload.array('photos', 6), async (req, res) => {
  const b = req.body, ip = req.ip, now = Date.now();
  hits[ip] = (hits[ip] || []).filter((t) => now - t < 3600e3); hits[ip].push(now);
  const render = (err) => res.page('contact', { title: 'Request a Field Assessment', description: '', crumbs: crumbs(['Contact', '/contact']), canonical: '/contact', noindex: true },
    { services: services(), q: b, sent: false, err });
  if (b.website) return res.redirect('/contact/thank-you'); // honeypot
  if (hits[ip].length > 8) return render('Too many submissions. Please call or try again later.');
  if (!b.firstName || !b.email || !b.description) return render('Please add your name, email and a short description of your field.');
  const photos = [];
  for (const f of req.files || []) if (/^image\//.test(f.mimetype)) photos.push(await saveUpload(f));
  const lead = {
    id: crypto.randomUUID(), date: new Date().toISOString(), status: 'new', photos,
    ...Object.fromEntries(['firstName', 'lastName', 'organization', 'email', 'phone', 'location', 'fieldType', 'service', 'timeline', 'description', 'source'].map((k) => [k, String(b[k] || '').slice(0, 4000)])),
  };
  store.addLead(lead);
  const hook = store.settings().leadWebhook;
  if (hook) fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: `New field assessment request from ${lead.firstName} ${lead.lastName} (${lead.organization}) – ${lead.email} ${lead.phone}`, lead }) }).catch(() => {});
  res.redirect('/contact/thank-you');
});
app.get('/contact/thank-you', (req, res) => res.page('contact', { title: 'Request Received', description: '', noindex: true, canonical: '/contact/thank-you' }, { services: [], q: {}, sent: true, err: '' }));

// ---------- SEO files ----------
app.get('/robots.txt', (req, res) => res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /contact/thank-you\n\nSitemap: ${res.locals.base}/sitemap.xml\n`));
app.get('/sitemap.xml', (req, res) => {
  const b = res.locals.base;
  const u = ['/', '/services', '/projects', '/industries', '/about', '/resources', '/contact',
    ...store.pub('services').map((x) => '/services/' + x.slug), ...store.pub('projects').map((x) => '/projects/' + x.slug),
    ...store.pub('industries').map((x) => '/industries/' + x.slug), ...store.pub('resources').map((x) => '/resources/' + x.slug)];
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${u.map((x) => `<url><loc>${b}${x}</loc></url>`).join('\n')}\n</urlset>`);
});

// ---------- admin ----------
const sign = (exp) => exp + '.' + crypto.createHmac('sha256', SECRET).update(String(exp)).digest('hex');
const valid = (tok) => { const [e, h] = String(tok || '').split('.'); return e && +e > Date.now() && tok === sign(e); };
const cookie = (req, n) => (req.headers.cookie || '').split(/;\s*/).map((c) => c.split('=')).find((c) => c[0] === n)?.[1];
const loginHits = {};
async function saveUpload(f) {
  const id = Date.now().toString(36) + crypto.randomBytes(3).toString('hex');
  const ext = path.extname(f.originalname).toLowerCase();
  if (sharp && /^image\/(jpe?g|png|webp|tiff|heic)$/.test(f.mimetype)) {
    const name = id + '.webp';
    await sharp(f.buffer).rotate().resize({ width: 2200, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(store.UPLOADS, name));
    return '/uploads/' + name;
  }
  const name = id + (['.pdf', '.svg', '.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4'].includes(ext) ? ext : '.bin');
  fs.writeFileSync(path.join(store.UPLOADS, name), f.buffer);
  return '/uploads/' + name;
}
const adm = express.Router();
adm.use((req, res, next) => { res.locals.admin = true; res.set('X-Robots-Tag', 'noindex'); next(); });
const A = (res, view, data = {}) => res.render('admin/' + view, { ...res.locals, ...data, view });
adm.get('/login', (req, res) => A(res, 'login', { err: '', disabled: !ADMIN_PW }));
adm.post('/login', (req, res) => {
  const ip = req.ip; loginHits[ip] = (loginHits[ip] || []).filter((t) => Date.now() - t < 900e3);
  if (!ADMIN_PW || loginHits[ip].length >= 8) return A(res, 'login', { err: 'Login unavailable.', disabled: !ADMIN_PW });
  const ok = req.body.password && crypto.timingSafeEqual(crypto.createHash('sha256').update(req.body.password).digest(), crypto.createHash('sha256').update(ADMIN_PW).digest());
  if (!ok) { loginHits[ip].push(Date.now()); return A(res, 'login', { err: 'Incorrect password.', disabled: false }); }
  res.setHeader('Set-Cookie', `gw_admin=${sign(Date.now() + 12 * 3600e3)}; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=43200${req.secure ? '; Secure' : ''}`);
  res.redirect('/admin');
});
adm.use((req, res, next) => (valid(cookie(req, 'gw_admin')) ? next() : res.redirect('/admin/login')));
adm.get('/logout', (req, res) => { res.setHeader('Set-Cookie', 'gw_admin=; Path=/admin; Max-Age=0'); res.redirect('/admin/login'); });
adm.get('/', (req, res) => A(res, 'dashboard', { counts: Object.fromEntries(Object.keys(schemas).filter((k) => schemas[k].fields).map((k) => [k, store.all(k).length])), leads: store.leads() }));

adm.get('/settings', (req, res) => A(res, 'settings', { saved: req.query.saved }));
adm.post('/settings', upload.any(), async (req, res) => {
  const cur = store.settings(), b = req.body, next = { ...cur };
  for (const k of ['name', 'shortName', 'tagline', 'phone', 'email', 'address', 'serviceArea', 'siteUrl', 'heroHeadline', 'heroSub', 'heroImage', 'heroVideo', 'ogImage', 'stats', 'linkedin', 'facebook', 'instagram', 'youtube', 'gaId', 'leadWebhook', 'legacyNote']) next[k] = (b[k] ?? '').trim();
  next.showPlaceholders = b.showPlaceholders === 'on';
  for (const f of req.files || []) next[f.fieldname] = await saveUpload(f);
  store.saveSettings(next); res.redirect('/admin/settings?saved=1');
});

adm.get('/leads', (req, res) => A(res, 'leads', { leads: store.leads() }));
adm.post('/leads/:id', (req, res) => {
  const all = store.leads();
  if (req.body.del) store.saveLeads(all.filter((l) => l.id !== req.params.id));
  else { const l = all.find((x) => x.id === req.params.id); if (l) l.status = req.body.status; store.saveLeads(all); }
  res.redirect('/admin/leads');
});

function build(sch, body, files, old = {}) {
  const rec = { ...old };
  const up = {};
  for (const f of files || []) (up[f.fieldname] = up[f.fieldname] || []).push(f);
  return Promise.all(sch.fields.map(async (f) => {
    const v = body[f.k];
    if (f.type === 'checkbox') rec[f.k] = v === 'on';
    else if (f.type === 'number') rec[f.k] = v === '' || v == null ? '' : Number(v);
    else if (f.type === 'list') rec[f.k] = String(v || '').split('\n').map((x) => x.trim()).filter(Boolean);
    else if (f.type === 'multi' || f.type === 'select-multi') rec[f.k] = [].concat(v || []);
    else if (f.type === 'image' || f.type === 'file') rec[f.k] = up[f.k] ? await saveUpload(up[f.k][0]) : String(v || '').trim();
    else if (f.type === 'images') {
      const keep = String(v || '').split('\n').map((x) => x.trim()).filter(Boolean);
      for (const u of up[f.k] || []) keep.push(await saveUpload(u));
      rec[f.k] = keep;
    } else rec[f.k] = String(v ?? '').trim();
  })).then(() => rec);
}
const refs = (sch) => Object.fromEntries(sch.fields.filter((f) => f.of).map((f) => [f.of, store.all(f.of)]));
adm.get('/:c', (req, res, next) => { const sch = schemas[req.params.c]; if (!sch) return next(); A(res, 'list', { c: req.params.c, sch, items: store.all(req.params.c) }); });
adm.get('/:c/new', (req, res, next) => { const sch = schemas[req.params.c]; if (!sch) return next(); A(res, 'form', { c: req.params.c, sch, item: { published: true }, refs: refs(sch), isNew: true, err: '' }); });
adm.get('/:c/:slug', (req, res, next) => {
  const sch = schemas[req.params.c]; const item = sch && store.find(req.params.c, req.params.slug); if (!item) return next();
  A(res, 'form', { c: req.params.c, sch, item, refs: refs(sch), isNew: false, err: '' });
});
adm.post('/:c/:slug', upload.any(), async (req, res, next) => {
  const c = req.params.c, sch = schemas[c]; if (!sch) return next();
  const isNew = req.params.slug === 'new', old = isNew ? {} : store.find(c, req.params.slug);
  if (!isNew && !old) return next();
  if (req.body._delete) { store.remove(c, req.params.slug); return res.redirect('/admin/' + c); }
  const rec = await build(sch, req.body, req.files, old);
  const saved = store.upsert(c, rec, isNew ? null : req.params.slug);
  res.redirect(`/admin/${c}/${saved.slug}?saved=1`);
});
app.use('/admin', adm);

// ---------- 404 / errors ----------
app.use((req, res) => res.page('404', { title: 'Page Not Found', description: '', status: 404, noindex: true, canonical: req.path }, { services: services().slice(0, 6) }));
app.use((err, req, res, next) => { console.error(err); res.status(500).type('text').send('Something went wrong.'); });
app.listen(PORT, () => console.log(`Greenway AFS running on :${PORT}${ADMIN_PW ? '' : '  (ADMIN_PASSWORD not set: admin disabled)'}`));
