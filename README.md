# Greenway Athletic Field Services: website + built-in CMS

Node/Express site, server-rendered, with a password-protected admin at `/admin`.
No database: content lives in JSON files and uploaded images in `DATA_DIR` (default `./data`).

## Deploy (GitHub → Render)
1. Push this folder to GitHub.
2. In Render: **New → Blueprint** (uses `render.yaml`) or create a Web Service (build `npm install`, start `npm start`).
3. Set `ADMIN_PASSWORD` in the dashboard. Keep the **persistent disk** at `/var/data` with `DATA_DIR=/var/data`,
   otherwise admin edits and uploads are lost on every deploy.
4. Point `www.greenwayafs.com` at the Render service; set **Site URL** in Admin → Settings.

Local: `npm install && ADMIN_PASSWORD=test npm start` → http://localhost:3000 (admin at /admin).

## What the admin controls
Projects, Services, Testimonials, Who We Serve (industry pages), Team, Resources, Leads, and Settings
(phone, email, service area, stats, hero image/video, social links, GA4 ID, lead webhook).
A new project or service is just a form; its page, sitemap entry, filters, schema and related-content links appear automatically.
Photos upload in the browser and are converted to WebP (max 2200px).

## Placeholders
Anything Greenway hasn't confirmed is a yellow `[ADD …]` note or a hatched photo slot. Fill them in via the admin, then
untick **Show placeholders** in Settings before launch (notes disappear; empty photo slots become plain turf-pattern blocks).

## Must-confirm before launch
- Phone and email (legacy `info@greenwayps.com` is intentionally NOT used)
- Service area text ("Connecticut, New York and the surrounding Northeast" is the prompt's example)
- Stats (135+/300+/125+/1,000+ come from the current site per the brief)
- Project details: years, sports, scope, challenge/solution/result, before/after photos
- Rocco and Rocky Lagana bios and portraits; the "Built Beneath the Surface" PDF
- Whether any legacy "Greenway Property Services" mention should stay (Settings → historical note; blank by default)

## SEO / tracking built in
Per-page title, description, canonical, Open Graph; Organization/LocalBusiness, Service, Article, FAQ (only when real FAQs exist) and Breadcrumb JSON-LD;
`/sitemap.xml`, `/robots.txt`, 404, trailing-slash redirects, and `data/redirects.json` (`{"/old": "/new"}`) for Wix URL redirects.
Analytics: add a GA4 ID in Settings; events fire for phone/email clicks, CTA clicks, form submits, service/project views, guide downloads, video plays.

## Not included yet
Email delivery of leads (leads are stored in Admin → Leads; set a webhook URL for Slack/Zapier/Make alerts), responsive `srcset`
variants, and the legacy Wix redirect map (needs the old URL list).
