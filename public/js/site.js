(function () {
  var b = document.querySelector('.burger'), n = document.getElementById('nav');
  if (b) b.addEventListener('click', function () { var o = n.classList.toggle('open'); b.setAttribute('aria-expanded', o); });
  function track(name, p) { window.dataLayer = window.dataLayer || []; var d = Object.assign({ event: name }, p || {}); window.dataLayer.push(d); if (window.gtag) gtag('event', name, p || {}); }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-track],a[href^="tel:"],a[href^="mailto:"]'); if (!a) return;
    var h = a.getAttribute('href') || '';
    var name = a.dataset.track || (h.indexOf('tel:') === 0 ? 'phone_click' : 'email_click');
    track(name, { location: a.dataset.loc || '', page: location.pathname });
  });
  document.querySelectorAll('[data-track-video]').forEach(function (w) {
    var v = w.querySelector('video'); if (v) v.addEventListener('play', function () { track('video_play', { video: w.dataset.trackVideo }); }, { once: true });
    else w.addEventListener('click', function () { track('video_play', { video: w.dataset.trackVideo }); }, { once: true });
  });
  var f = document.querySelector('form[data-form]'); if (f) f.addEventListener('submit', function () { track('submit_field_assessment'); });
  var p = location.pathname.match(/^\/(services|projects)\/([^/]+)/); if (p) track(p[1] === 'services' ? 'service_view' : 'project_view', { slug: p[2] });
})();
