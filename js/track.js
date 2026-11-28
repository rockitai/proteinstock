/* Protein Stock — marketing & analytics tags (same IDs and events as the old Zappy store) + cookie consent.
   Meta Pixel 1120769657458456 · Google Analytics 4 G-R26YTRKNR6 · TikTok Pixel DBCB1TBC77U4J2JQ8DLG · Cloudflare Web Analytics.
   Store events (Meta / GA4 / TikTok): PageView/page_view/page · ViewContent/view_item/ViewContent ·
   AddToCart/add_to_cart/AddToCart · InitiateCheckout/begin_checkout/InitiateCheckout · Purchase/purchase/CompletePayment.
   Clicks: WhatsApp, phone, contact & lead forms.
   Cookie consent (see privacy.html): analytics (GA4) and marketing (Meta, TikTok) cookies only after the visitor allows them.
   Until then GA runs in consent mode (no cookies) and Meta / TikTok hold their events. Cloudflare is cookieless and always on.
   Purchase is reported by order-success.html only after the server confirms the payment.
   Cart abandonment: the checkout draft (phone or email + cart) is saved to the store database as the shopper types.
   Loaded by js/app.js on every storefront page (never on /admin). */
(function () {
  if (window.PSTrack || /\/admin/.test(location.pathname)) return;
  try { if (window.self !== window.top) return; } catch (e) { return; }   // not inside the admin's live preview: no cookie banner, no tracking
  const FB = '1120769657458456', GA = 'G-R26YTRKNR6', CF = 'ba4da9700791400bb1fed45649c4c1b7';
  const TT = 'DBCB1TBC77U4J2JQ8DLG';   // TikTok Pixel (same as the old Zappy store); empty = TikTok off
  const CUR = 'ILS';
  const add = (src, attrs) => { const s = document.createElement('script'); s.async = true; s.src = src; Object.entries(attrs || {}).forEach(([k, v]) => s.setAttribute(k, v)); document.head.appendChild(s); };

  /* ---- consent: { a: analytics, m: marketing } ---- */
  const CK = 'ps_consent';
  const readC = () => { try { const c = JSON.parse(localStorage.getItem(CK) || 'null'); return c && typeof c === 'object' ? c : null; } catch (e) { return null; } };
  let consent = readC();

  /* ---- Google Analytics 4 (consent mode) ---- */
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  const gaState = c => ({ analytics_storage: c && c.a ? 'granted' : 'denied', ad_storage: c && c.m ? 'granted' : 'denied', ad_user_data: c && c.m ? 'granted' : 'denied', ad_personalization: c && c.m ? 'granted' : 'denied' });
  gtag('consent', 'default', { ...gaState(consent), wait_for_update: 500 });
  gtag('js', new Date());
  gtag('config', GA);
  add('https://www.googletagmanager.com/gtag/js?id=' + GA);

  /* ---- Meta Pixel ---- */
  /* eslint-disable */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  fbq('consent', consent && consent.m ? 'grant' : 'revoke');
  fbq('init', FB);
  fbq('track', 'PageView');

  /* ---- TikTok Pixel ---- */
  const tt = (...a) => { if (TT && window.ttq) window.ttq.track(...a); };
  if (TT) {
    /* eslint-disable */
    !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=d.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=d.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};}(window,document,'ttq');
    /* eslint-enable */
    if (!(consent && consent.m)) window.ttq.holdConsent();
    window.ttq.load(TT);
    window.ttq.page();
  }

  /* ---- Cloudflare Web Analytics (same token as the old site; no cookies) ---- */
  add('https://static.cloudflareinsights.com/beacon.min.js', { 'data-cf-beacon': JSON.stringify({ token: CF, spa: false }), defer: '' });

  const applyConsent = c => {
    consent = c;
    try { localStorage.setItem(CK, JSON.stringify({ ...c, t: Date.now(), v: 1 })); } catch (e) { /* ignore */ }
    gtag('consent', 'update', gaState(c));
    fbq('consent', c.m ? 'grant' : 'revoke');
    if (TT && window.ttq) (c.m ? window.ttq.grantConsent() : window.ttq.revokeConsent());
  };

  /* ---- helpers ---- */
  const prod = id => (typeof byId === 'function' ? byId(id) : null);
  const item = (p, q, v) => ({ item_id: p.id, item_name: p.name, item_brand: p.brand || undefined, item_category: p.cat || undefined, price: Number(p.price) || 0, quantity: q || 1, item_variant: v || undefined });
  const ttc = i => ({ content_id: i.item_id, content_type: 'product', content_name: i.item_name, quantity: i.quantity || 1, price: i.price });
  const once = key => { try { const k = 'ps_tr_' + key; if (sessionStorage.getItem(k)) return false; sessionStorage.setItem(k, '1'); return true; } catch (e) { return true; } };
  const eid = (name, k) => name + '.' + k;   // event_id, so the browser and any server-side copy can be de-duplicated
  const log = (...a) => { (window.__psTrackLog = window.__psTrackLog || []).push(a); };

  const T = {
    viewItem(p) {
      if (!p) return;
      const it = item(p, 1), v = Number(p.price) || 0;
      gtag('event', 'view_item', { currency: CUR, value: v, items: [it] });
      fbq('track', 'ViewContent', { content_ids: [p.id], content_type: 'product', content_name: p.name, value: v, currency: CUR });
      tt('ViewContent', { contents: [ttc(it)], content_type: 'product', value: v, currency: CUR });
      log('view_item', p.id);
    },
    addToCart(p, q, v) {
      if (!p) return; q = q || 1;
      const it = item(p, q, v), val = (Number(p.price) || 0) * q;
      gtag('event', 'add_to_cart', { currency: CUR, value: val, items: [it] });
      fbq('track', 'AddToCart', { content_ids: [p.id], content_type: 'product', content_name: p.name, contents: [{ id: p.id, quantity: q }], value: val, currency: CUR });
      tt('AddToCart', { contents: [ttc(it)], content_type: 'product', value: val, currency: CUR });
      log('add_to_cart', p.id, q);
    },
    beginCheckout(lines, total) {
      const items = lines.map(l => { const p = prod(l.id); return p ? item(p, l.q, l.v) : null; }).filter(Boolean);
      if (!items.length) return;
      gtag('event', 'begin_checkout', { currency: CUR, value: total, items });
      fbq('track', 'InitiateCheckout', { content_ids: items.map(i => i.item_id), contents: items.map(i => ({ id: i.item_id, quantity: i.quantity })), content_type: 'product', num_items: items.reduce((s, i) => s + i.quantity, 0), value: total, currency: CUR });
      tt('InitiateCheckout', { contents: items.map(ttc), content_type: 'product', value: total, currency: CUR });
      log('begin_checkout', items.length, total);
    },
    purchase(order) {
      if (!order || !order.number || !once('purchase_' + order.number)) return;
      const lines = Array.isArray(order.items) ? order.items : [];
      const items = lines.map(l => { const p = prod(l.id); return p ? item(p, l.q) : { item_id: l.id, quantity: l.q, price: Number(l.price) || undefined }; });
      const value = Number(order.total) || 0;
      gtag('event', 'purchase', { transaction_id: order.number, currency: CUR, value, coupon: order.coupon || undefined, shipping: order.shipping || undefined, items });
      fbq('track', 'Purchase', { content_ids: items.map(i => i.item_id), contents: items.map(i => ({ id: i.item_id, quantity: i.quantity })), content_type: 'product', num_items: items.reduce((s, i) => s + (i.quantity || 1), 0), value, currency: CUR }, { eventID: eid('purchase', order.number) });
      tt('CompletePayment', { contents: items.map(ttc), content_type: 'product', value, currency: CUR }, { event_id: eid('purchase', order.number) });
      log('purchase', order.number, value);
    },
    contact(kind) {   // kind: whatsapp | phone | email | form
      gtag('event', kind === 'whatsapp' ? 'whatsapp_click' : kind === 'phone' ? 'phone_click' : kind === 'email' ? 'email_click' : 'generate_lead', { method: kind, page_path: location.pathname });
      fbq('track', 'Contact', { content_name: kind });
      tt(kind === 'form' ? 'SubmitForm' : 'Contact', { description: kind });
      log('contact', kind);
    },
    lead(kind) {      // newsletter / wholesale quote
      gtag('event', kind === 'newsletter' ? 'sign_up' : 'generate_lead', { method: kind });
      fbq('track', kind === 'newsletter' ? 'CompleteRegistration' : 'Lead', { content_name: kind });
      tt(kind === 'newsletter' ? 'CompleteRegistration' : 'SubmitForm', { description: kind });
      log('lead', kind);
    },
    search(q) {
      if (!q) return;
      gtag('event', 'search', { search_term: q });
      fbq('track', 'Search', { search_string: q });
      tt('Search', { query: q });
      log('search', q);
    },
    /* cart abandonment: save the checkout draft (debounced) */
    draft: (function () {
      let t = null;
      return function (d) {
        clearTimeout(t);
        t = setTimeout(() => {
          try {
            let key = localStorage.getItem('ps_ck_key');
            if (!key) { key = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(36).slice(2)); localStorage.setItem('ps_ck_key', key); }
            fetch('/api/rpc/ps_save_checkout', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ p: { key, name: d.name, phone: d.phone, email: d.email, items: d.items, total: d.total, step: d.step } }) })
              .then(r => log('draft_saved', r.status)).catch(() => {});
            // the same draft to the sales system, so the store's bot can follow up (no cookies, only this store's origin is accepted there)
            fetch('https://sales.proteinstock.co.il/api/public/checkout-draft', { method: 'POST', keepalive: true, mode: 'cors', credentials: 'omit', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ key, name: d.name, phone: d.phone, email: d.email, items: (d.items || []).map(i => ({ name: i.name, q: i.q })), total: d.total, step: d.step }) }).catch(() => {});
          } catch (e) { /* ignore */ }
        }, 1200);
      };
    })(),
  };
  window.PSTrack = T;

  /* ---- cookie banner ---- */
  const banner = (custom) => {
    const old = document.getElementById('ps-cc'); if (old) old.remove();
    const c = consent || { a: true, m: true };
    const el = document.createElement('div'); el.id = 'ps-cc'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'הודעת עוגיות');
    el.innerHTML = `<button type="button" class="cc-x" data-cc="x" aria-label="סגירה (עוגיות חיוניות בלבד)">✕</button>
      <p class="cc-t"><b>האתר משתמש בעוגיות 🍪</b> אנחנו משתמשים בעוגיות חיוניות כדי שהאתר והעגלה יעבדו, ובאישורכם גם בעוגיות ניתוח ושיווק (כמו Google Analytics, פייסבוק וטיקטוק) כדי לשפר את האתר ולהציג פרסומות מותאמות. <a href="privacy">מדיניות פרטיות</a></p>
      <div class="cc-opts"${custom ? '' : ' hidden'}>
        <label><input type="checkbox" checked disabled> <span><b>חיוניות</b> · עגלה, תשלום ושמירת הבחירה. תמיד פעילות.</span></label>
        <label><input type="checkbox" data-k="a"${c.a ? ' checked' : ''}> <span><b>ניתוח</b> · הבנת השימוש באתר (Google Analytics).</span></label>
        <label><input type="checkbox" data-k="m"${c.m ? ' checked' : ''}> <span><b>שיווק</b> · מדידה ופרסום (Meta, TikTok).</span></label>
      </div>
      <div class="cc-a">${custom ? '<button type="button" class="btn btn-primary" data-cc="save">שמירת הבחירה</button>' : '<button type="button" class="btn btn-primary" data-cc="all">אישור הכל</button><button type="button" class="btn btn-outline" data-cc="custom">התאמה אישית</button>'}<button type="button" class="btn btn-link" data-cc="min">רק הכרחי</button></div>`;
    el.onclick = e => {
      const b = e.target.closest('[data-cc]'); if (!b) return;
      const k = b.dataset.cc;
      if (k === 'custom') return banner(true);
      if (k === 'all') applyConsent({ a: true, m: true });
      else if (k === 'min' || k === 'x') applyConsent({ a: false, m: false });
      else if (k === 'save') applyConsent({ a: !!el.querySelector('[data-k=a]').checked, m: !!el.querySelector('[data-k=m]').checked });
      el.remove();
    };
    document.body.appendChild(el);
  };
  window.PSConsent = { open: () => banner(true), get: () => consent };

  /* ---- automatic: product page view, checkout start, clicks, forms ---- */
  const whenProduct = (id, fn, tries = 0) => { const p = prod(id); if (p) return fn(p); if (tries < 40) setTimeout(() => whenProduct(id, fn, tries + 1), 150); };
  const onReady = fn => (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn());
  onReady(() => {
    if (!consent) banner(false);
    const path = location.pathname.replace(/\/+$/, ''), qs = new URLSearchParams(location.search);
    const pid = window.PS_PID || (/\/product(\.html)?$/.test(path) ? (qs.get('id') || '') : '') || ((path.match(/\/product\/[^/]*-([a-z0-9]{6})$/) || [])[1] || '');
    if (pid) whenProduct(pid, p => T.viewItem(p));
    if (/\/products(\.html)?$/.test(path) && qs.get('q')) T.search(qs.get('q').slice(0, 80));
    if (/\/checkout(\.html)?$/.test(path)) {
      const fire = (tries = 0) => {
        if (typeof Cart === 'undefined') return;
        const lines = Cart.items.filter(i => prod(i.id));
        if (!lines.length) { if (tries < 40) setTimeout(() => fire(tries + 1), 150); return; }
        T.beginCheckout(lines, Math.round(lines.reduce((s, i) => s + prod(i.id).price * i.q, 0) * 100) / 100);
      };
      fire();
    }
    /* purchase: reported by order-success.html once the server confirms the payment */
  });
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    const h = a.getAttribute('href') || '';
    if (/wa\.me|api\.whatsapp\.com|whatsapp:/i.test(h)) T.contact('whatsapp');
    else if (/^tel:/i.test(h)) T.contact('phone');
    else if (/^mailto:/i.test(h)) T.contact('email');
    else if (h === '#cookies') { e.preventDefault(); banner(true); }
  }, true);
  document.addEventListener('submit', e => {
    const f = e.target; if (!f || !f.id) return;
    if (f.id === 'news') T.lead('newsletter');
    else if (f.id === 'f' && /\/contact/.test(location.pathname)) T.contact('form');
    else if (/\/business-wholesale/.test(location.pathname)) T.lead('wholesale');
  }, true);
})();
