const fs = require('fs');
const path = require('path');
const seed = require('../content/seed');
const schemas = require('./schemas');

const DATA = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const UPLOADS = path.join(DATA, 'uploads');
fs.mkdirSync(UPLOADS, { recursive: true });

const cache = {};
const file = (n) => path.join(DATA, n + '.json');
function load(n, fallback) {
  if (cache[n]) return cache[n];
  if (!fs.existsSync(file(n))) fs.writeFileSync(file(n), JSON.stringify(seed[n] ?? fallback, null, 2));
  return (cache[n] = JSON.parse(fs.readFileSync(file(n), 'utf8')));
}
function save(n, v) {
  fs.writeFileSync(file(n) + '.tmp', JSON.stringify(v, null, 2));
  fs.renameSync(file(n) + '.tmp', file(n));
  cache[n] = v;
}
const slugify = (s) => String(s || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const store = {
  DATA, UPLOADS, slugify,
  settings: () => ({ ...seed.settings, ...load('settings', {}) }),
  saveSettings: (v) => save('settings', v),
  all: (n) => load(n, []),
  pub: (n) => load(n, []).filter((x) => x.published !== false),
  find: (n, slug) => load(n, []).find((x) => x.slug === slug),
  upsert(n, rec, oldSlug) {
    const list = load(n, []);
    const t = schemas[n].title;
    rec.slug = slugify(rec.slug || rec[t]) || 'item-' + Date.now();
    if (!rec.id) rec.id = rec.slug;
    const idx = list.findIndex((x) => x.slug === (oldSlug || rec.slug));
    if (idx >= 0) list[idx] = rec;
    else {
      let base = rec.slug, k = 2;
      while (list.some((x) => x.slug === rec.slug)) rec.slug = base + '-' + k++;
      list.push(rec);
    }
    save(n, list);
    return rec;
  },
  remove(n, slug) { save(n, load(n, []).filter((x) => x.slug !== slug)); },
  leads: () => load('leads', []),
  addLead(l) { const a = load('leads', []); a.unshift(l); save('leads', a); },
  saveLeads: (a) => save('leads', a),
  redirects: () => load('redirects', {}),
};
module.exports = store;
