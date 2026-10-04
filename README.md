# Greenway Athletic Field Services website

Node/Express site, server-rendered (fast, crawlable). Content lives in `content.json` and is edited at `/admin`.

## Run locally
    npm install
    ADMIN_PASSWORD=yourpassword npm start      # http://localhost:3000  (admin login cookie is Secure, so test admin on https/Render or localhost in a modern browser)

## Deploy on Render
1. Push this folder to GitHub.
2. Render > New > Blueprint > pick the repo (uses `render.yaml`). Set `ADMIN_PASSWORD` when prompted.
3. Persistent disk is required or admin edits are lost on every deploy/restart (Render free instances have no disk). If you want free hosting, move content to Render Postgres instead.
4. Add custom domain www.greenwayafs.com in Render, then update DNS away from Wix.

## Before launch
- Replace placeholder service copy and add photos (put files in `public/img/`, reference as `/img/name.jpg`, or paste image URLs in admin).
- Confirm contact email: site still uses info@greenwayps.com (old brand domain).
- Set up 301 redirects from old Wix URLs, add the site to Google Search Console and Bing, update Google Business Profile, LinkedIn, Facebook (GreenwayPSCT) and Instagram names to Greenway Athletic Field Services.
- Quote requests are stored in admin; add email notifications (e.g. Resend/SendGrid) if desired.
