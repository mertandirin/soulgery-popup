(function() {
  if (document.getElementById('soulgeryOverlay')) return;

  /* Activation logic — India targeting, fully client-side (no third-party API):
     1. ?india_ads param → always show (manual override for ad links)
     2. Already activated this session → show (persists across page navigations)
     3. Otherwise → detect India via browser timezone (Asia/Kolkata) or an
        Indian locale (navigator.languages ending in -IN).
     The timezone string comes from the public-domain IANA tz database via the
     standard Intl API: no network request, no API key, no attribution, no rate
     limit, and nothing ever leaves the visitor's browser. */
  var hasParam = window.location.search.indexOf('india_ads') !== -1;
  if (hasParam) sessionStorage.setItem('soulgery_india', '1');

  if (!sessionStorage.getItem('soulgery_india') && isLikelyIndia()) {
    sessionStorage.setItem('soulgery_india', '1');
  }

  if (!sessionStorage.getItem('soulgery_india')) return;

  function isLikelyIndia() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') return true;
    } catch (e) {}
    var langs = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < langs.length; i++) {
      if (/-IN$/i.test(langs[i])) return true;
    }
    return false;
  }

  init();

  function init() {
  if (document.getElementById('soulgeryOverlay')) return;

  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap';
  document.head.appendChild(link);

  var css = document.createElement('style');
  css.textContent =
    /* FAB button */
    '.soulgery-fab{position:fixed;bottom:20px;right:20px;z-index:9999;background:#2665F0;color:#fff;border:none;border-radius:50px;padding:14px 22px;font-family:"Open Sans",sans-serif;font-size:13px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;cursor:pointer;box-shadow:0 4px 20px rgba(14,58,91,0.3);transition:background .2s ease,transform .2s ease,box-shadow .2s ease}' +
    '.soulgery-fab:hover{background:#1a52c9;transform:translateY(-2px);box-shadow:0 6px 28px rgba(14,58,91,0.4)}' +
    '.soulgery-fab:active{transform:scale(0.96)}' +
    /* Overlay */
    '.soulgery-overlay{position:fixed;inset:0;background:rgba(14,58,91,0.55);display:flex;align-items:center;justify-content:center;z-index:10000;opacity:0;visibility:hidden;transition:opacity .3s ease,visibility .3s ease;padding:16px;font-family:"Open Sans",sans-serif}' +
    '.soulgery-overlay.active{opacity:1;visibility:visible}' +
    /* Modal */
    '.soulgery-modal{background:#fff;border-radius:20px;max-width:580px;width:100%;padding:32px 20px 24px;position:relative;box-shadow:0 25px 60px rgba(14,58,91,0.25);transform:translateY(20px) scale(0.95);transition:transform .35s cubic-bezier(0.34,1.56,0.64,1);max-height:90vh;overflow-y:auto}' +
    '.soulgery-overlay.active .soulgery-modal{transform:translateY(0) scale(1)}' +
    '.soulgery-close{position:absolute;top:12px;right:14px;background:none;border:none;font-size:28px;color:#0E3A5B;cursor:pointer;line-height:1;padding:4px 8px;border-radius:8px;transition:color .2s ease,background .2s ease}' +
    '.soulgery-close:hover{color:#2665F0;background:#E2ECF8}' +
    '.soulgery-title{font-family:bookmania,Georgia,"Times New Roman",serif;color:#0E3A5B;font-size:24px;font-weight:400;text-align:center;margin:0 0 4px}' +
    '.soulgery-subtitle{color:#849172;font-size:14px;text-align:center;margin:0 0 20px;font-family:"Open Sans",sans-serif}' +
    /* Grid — mobile first: 1 column */
    '.soulgery-platforms{display:grid;grid-template-columns:1fr;gap:10px}' +
    /* Cards — mobile first: horizontal row */
    '.soulgery-platform-card{display:flex;flex-direction:row;align-items:center;gap:14px;background:#F7F9FC;border:1.5px solid #E2ECF8;border-radius:14px;padding:14px 18px;text-decoration:none;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;cursor:pointer}' +
    '.soulgery-platform-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(14,58,91,0.12);border-color:#2665F0}' +
    '.soulgery-platform-icon{width:36px;height:36px;display:flex;align-items:center;justify-content:center;flex-shrink:0}' +
    '.soulgery-platform-icon img{width:100%;height:100%;object-fit:contain}' +
    '.soulgery-platform-text{display:flex;flex-direction:column;gap:2px}' +
    '.soulgery-platform-name{display:block;font-weight:700;font-size:14px;color:#0E3A5B;font-family:"Open Sans",sans-serif;line-height:1.3}' +
    '.soulgery-platform-format{display:block;font-size:12px;color:#849172;font-family:"Open Sans",sans-serif;line-height:1.3}' +
    /* Tablet: 2 columns, vertical cards */
    '@media(min-width:481px){' +
      '.soulgery-fab{bottom:28px;right:28px;padding:16px 28px;font-size:14px}' +
      '.soulgery-modal{padding:40px 32px 32px}' +
      '.soulgery-title{font-size:28px;margin-bottom:6px}' +
      '.soulgery-subtitle{font-size:15px;margin-bottom:28px}' +
      '.soulgery-platforms{grid-template-columns:1fr 1fr;gap:14px}' +
      '.soulgery-platform-card{flex-direction:column;padding:22px 16px 18px;gap:8px;text-align:center}' +
      '.soulgery-platform-icon{width:40px;height:40px;margin-bottom:2px}' +
      '.soulgery-platform-text{align-items:center}' +
    '}' +
    /* Desktop: 3 columns */
    '@media(min-width:641px){' +
      '.soulgery-modal{padding:48px 40px 40px}' +
      '.soulgery-subtitle{margin-bottom:32px}' +
      '.soulgery-platforms{grid-template-columns:1fr 1fr 1fr}' +
      '.soulgery-platform-icon{width:44px;height:44px}' +
    '}';
  document.head.appendChild(css);

  /* Platform logos hosted on GitHub Pages */
  var baseUrl = 'https://mertandirin.github.io/soulgery-popup/logos/';
  var logos = {
    storytel: baseUrl + 'storytel.png',
    audible: baseUrl + 'audible.png',
    everand: baseUrl + 'everand.png',
    amazon: baseUrl + 'amazon.png',
    kobo: baseUrl + 'kobo.png',
    googleplay: baseUrl + 'googleplay.png'
  };

  var overlay = document.createElement('div');
  overlay.className = 'soulgery-overlay';
  overlay.id = 'soulgeryOverlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML =
    '<div class="soulgery-modal">' +
      '<button class="soulgery-close" aria-label="Close">&times;</button>' +
      '<h2 class="soulgery-title">Get Your Copy</h2>' +
      '<p class="soulgery-subtitle">Available on your favorite platform</p>' +
      '<div class="soulgery-platforms">' +
        '<a href="https://www.storytel.com/in/books/soulgery-a-lifelong-guide-to-unlocking-your-potential-12506798" class="soulgery-platform-card" target="_blank" rel="noopener" data-platform="Storytel">' +
          '<div class="soulgery-platform-icon"><img src="' + logos.storytel + '" alt="Storytel"></div>' +
          '<div class="soulgery-platform-text"><span class="soulgery-platform-name">Storytel</span><span class="soulgery-platform-format">Audiobook</span></div>' +
        '</a>' +
        '<a href="https://www.audible.in/pd/Soulgery-Audiobook/B0FTNJK8JQ" class="soulgery-platform-card" target="_blank" rel="noopener" data-platform="Audible">' +
          '<div class="soulgery-platform-icon"><img src="' + logos.audible + '" alt="Audible"></div>' +
          '<div class="soulgery-platform-text"><span class="soulgery-platform-name">Audible</span><span class="soulgery-platform-format">Audiobook</span></div>' +
        '</a>' +
        '<a href="https://www.everand.com/audiobook/923526246/Soulgery-A-Lifelong-Guide-to-Unlocking-Your-Potential" class="soulgery-platform-card" target="_blank" rel="noopener" data-platform="Everand">' +
          '<div class="soulgery-platform-icon"><img src="' + logos.everand + '" alt="Everand"></div>' +
          '<div class="soulgery-platform-text"><span class="soulgery-platform-name">Everand</span><span class="soulgery-platform-format">Audiobook</span></div>' +
        '</a>' +
        '<a href="https://www.amazon.com/Soulgery-Lifelong-Guide-Unlocking-Potential/dp/B0FF81HWH4" class="soulgery-platform-card" target="_blank" rel="noopener" data-platform="Amazon Books">' +
          '<div class="soulgery-platform-icon"><img src="' + logos.amazon + '" alt="Amazon"></div>' +
          '<div class="soulgery-platform-text"><span class="soulgery-platform-name">Amazon Books</span><span class="soulgery-platform-format">Paperback & Kindle</span></div>' +
        '</a>' +
        '<a href="https://www.kobo.com" class="soulgery-platform-card" target="_blank" rel="noopener" data-platform="Kobo">' +
          '<div class="soulgery-platform-icon"><img src="' + logos.kobo + '" alt="Kobo"></div>' +
          '<div class="soulgery-platform-text"><span class="soulgery-platform-name">Kobo</span><span class="soulgery-platform-format">Audiobook</span></div>' +
        '</a>' +
        '<a href="https://play.google.com/store/books" class="soulgery-platform-card" target="_blank" rel="noopener" data-platform="Google Play Books">' +
          '<div class="soulgery-platform-icon"><img src="' + logos.googleplay + '" alt="Google Play Books"></div>' +
          '<div class="soulgery-platform-text"><span class="soulgery-platform-name">Google Play Books</span><span class="soulgery-platform-format">Audiobook</span></div>' +
        '</a>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);

  var fab = document.createElement('button');
  fab.className = 'soulgery-fab';
  fab.id = 'soulgeryFab';
  fab.textContent = 'GET THE BOOK';
  document.body.appendChild(fab);

  window.dataLayer = window.dataLayer || [];

  function pushEvent(eventName, params) {
    window.dataLayer.push(Object.assign({ event: eventName }, params || {}));
  }

  function openPopup(trigger) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    sessionStorage.setItem('soulgery_popup_open', '1');
    pushEvent('soulgery_popup_open', { popup_trigger: trigger || 'manual' });
  }

  function closePopup() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    sessionStorage.removeItem('soulgery_popup_open');
    pushEvent('soulgery_popup_close');
  }

  fab.addEventListener('click', function() { openPopup('fab_button'); });
  overlay.querySelector('.soulgery-close').addEventListener('click', closePopup);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closePopup(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && overlay.classList.contains('active')) closePopup(); });

  overlay.querySelectorAll('.soulgery-platform-card').forEach(function(card) {
    card.addEventListener('click', function() {
      var platform = card.getAttribute('data-platform');
      pushEvent('soulgery_platform_click', {
        platform_name: platform,
        platform_url: card.href
      });
    });
  });

  /* Re-open popup if it was open on the previous page */
  if (sessionStorage.getItem('soulgery_popup_open')) {
    openPopup('page_persist');
  } else if (!sessionStorage.getItem('soulgery_popup_shown')) {
    setTimeout(function() {
      openPopup('auto');
      sessionStorage.setItem('soulgery_popup_shown', '1');
    }, 2000);
  }

  window.openSoulgeryPopup = function() { openPopup('manual'); };
  } /* end init */
})();
