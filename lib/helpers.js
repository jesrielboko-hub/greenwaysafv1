const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const I = {
  drainage: 'M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11zM9 15a3 3 0 0 0 3 3',
  irrigation: 'M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z',
  maintenance: 'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1',
  grading: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 1v4M12 19v4M1 12h4M19 12h4',
  aeration: 'M12 21v-9M12 12c0-4 3-6 7-6 0 4-3 6-7 6zM12 15c0-3-2-5-6-5 0 3 2 5 6 5z',
  sod: 'M5 19c0-9 5-14 15-14 0 10-5 15-14 15M5 19l7-7',
  fertilization: 'M5 19c0-9 5-14 15-14 0 10-5 15-14 15M5 19l7-7',
  infield: 'M12 3l9 9-9 9-9-9z',
  lining: 'M4 5h16v14H4zM12 5v14M4 12h16',
  weed: 'M9 8a3 3 0 0 1 6 0v8a3 3 0 0 1-6 0zM9 11H4M15 11h5M9 15H5M15 15h4M10 5L8 3M14 5l2-2',
  overseed: 'M4 20c1-6 2-10 3-14M10 20c0-6 1-11 2-15M16 20c0-5 1-9 4-13',
  fence: 'M5 20V8l2-2 2 2v12M11 20V8l2-2 2 2v12M17 20V8l2-2 2 2v12M3 12h18M3 16h18',
  mound: 'M3 18c3-8 15-8 18 0zM2 18h20',
  repair: 'M14.5 6.5a4 4 0 0 0-5 5L3 18l3 3 6.5-6.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z',
  construction: 'M3 17h18M5 17a7 7 0 0 1 14 0M12 6v4',
  renovation: 'M20 12a8 8 0 1 1-3-6.2M20 4v5h-5',
  schools: 'M3 20h18M5 20V9l7-5 7 5v11M10 20v-6h4v6',
  municipalities: 'M3 9l9-5 9 5M5 9v9M9 9v9M15 9v9M19 9v9M3 20h18',
  parks: 'M12 21v-6M12 3a6 6 0 0 0-3 11h6A6 6 0 0 0 12 3z',
  colleges: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5',
  sports: 'M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v1a3 3 0 0 0 4 3M16 6h4v1a3 3 0 0 1-4 3M12 13v4M8 20h8M10 17h4',
  baseball: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM6 6c2 3 2 9 0 12M18 6c-2 3-2 9 0 12',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5',
  people: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-4 3-6 6-6s6 2 6 6M17 11a2.5 2.5 0 1 0 0-5M16 14c3 0 5 2 5 5',
  chart: 'M5 20V12M11 20V6M17 20V10M3 20h18',
  leaf: 'M5 19c0-9 5-14 15-14 0 10-5 15-14 15M5 19l7-7',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  check: 'M5 12l5 5 9-10',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  mail: 'M3 6h18v12H3zM3 7l9 7 9-7',
  pin: 'M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12zM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  download: 'M12 4v11M7 11l5 5 5-5M5 20h14',
  play: 'M8 5l11 7-11 7z',
  menu: 'M4 7h16M4 12h16M4 17h16',
};
const icon = (k, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${I[k] || I.leaf}"/></svg>`;

const paras = (t) => String(t || '').split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
const isPh = (t) => /^\[[A-Z]/.test(String(t || '').trim());
const faqs = (t) => String(t || '').split('\n').map((l) => l.split('::')).filter((a) => a.length >= 2 && a[0].trim() && a[1].trim()).map((a) => ({ q: a[0].trim(), a: a.slice(1).join('::').trim() }));

function video(url) {
  if (!url) return '';
  let m;
  if ((m = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/))) return `<iframe class="vid" src="https://www.youtube-nocookie.com/embed/${m[1]}" title="Greenway project video" loading="lazy" allowfullscreen></iframe>`;
  if ((m = url.match(/vimeo\.com\/(\d+)/))) return `<iframe class="vid" src="https://player.vimeo.com/video/${m[1]}" title="Greenway project video" loading="lazy" allowfullscreen></iframe>`;
  return `<video class="vid" controls preload="metadata" src="${esc(url)}"></video>`;
}

module.exports = { esc, icon, paras, isPh, faqs, video };
