/* =========================================================
   Roti Xpress: site scripts (no libraries needed)
   ========================================================= */
(function () {
  'use strict';

  var EMAIL = 'xpressroti@gmail.com';
  var BANNER_SECONDS = 6.5;   // how long each banner stays up

  /* ---------- Header: shadow + shrink after scrolling, back-to-top button ---------- */
  var header = document.querySelector('.site-header');
  var toTop = document.querySelector('.to-top');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('is-scrolled', y > 40);
    if (toTop) toTop.classList.toggle('is-visible', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !header.contains(e.target)) setMenu(false);
    });
  }

  /* ---------- Highlight the current section in the menu ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Banners: fade between slides, dots, arrows, swipe ---------- */
  var hero = document.querySelector('.hero');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.slide'));
    var dotsBox = hero.querySelector('.hero-dots');
    var heroDots = [];
    var at = 0;
    var timer = null;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var goTo = function (i) {
      at = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === at); });
      heroDots.forEach(function (d, k) { d.setAttribute('aria-selected', k === at ? 'true' : 'false'); });
    };
    var stop = function () { if (timer) { clearInterval(timer); timer = null; } };
    var start = function () {
      stop();
      if (reduceMotion || slides.length < 2) return;
      timer = setInterval(function () { goTo(at + 1); }, BANNER_SECONDS * 1000);
    };

    slides.forEach(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Banner ' + (i + 1));
      b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      b.addEventListener('click', function () { goTo(i); start(); });
      dotsBox.appendChild(b);
      heroDots.push(b);
    });
    hero.querySelector('.hero-prev').addEventListener('click', function () { goTo(at - 1); start(); });
    hero.querySelector('.hero-next').addEventListener('click', function () { goTo(at + 1); start(); });

    // Pause while someone is pointing at, tabbing through, or away from the page
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    hero.addEventListener('focusin', stop);
    hero.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });

    // Swipe left / right on phones
    var sx = null, sy = null;
    hero.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; stop(); }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (sx !== null) {
        var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) goTo(at + (dx < 0 ? 1 : -1));
      }
      sx = null; start();
    }, { passive: true });

    start();
  }

  /* ---------- Mobile order bar steps aside at the contact section ---------- */
  var mobileBar = document.querySelector('.mobile-bar');
  var contact = document.getElementById('contact');
  if ('IntersectionObserver' in window && mobileBar && contact) {
    new IntersectionObserver(function (entries) {
      mobileBar.classList.toggle('is-hidden', entries[0].isIntersecting);
    }, { rootMargin: '0px 0px -35% 0px' }).observe(contact);
  }

  /* ---------- Pre-filled order emails ---------- */
  function orderMailto() {
    var body =
      'Hi Roti Xpress,\n\n' +
      "I'd like to place an order:\n\n" +
      'Product(s): \n' +
      'Quantity: \n' +
      'Date needed: \n' +
      'Time needed: \n\n' +
      'Name: \n' +
      'Business (if any): \n' +
      'Phone: \n\n' +
      'Thank you!';
    return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Order inquiry') + '&body=' + encodeURIComponent(body);
  }
  document.querySelectorAll('.js-email').forEach(function (link) {
    link.setAttribute('href', orderMailto());
  });

  /* ---------- Google map ----------
     The live Google map is added on top of a simple location card.
     If a preview window blocks embedded maps, the map is removed again
     and the location card underneath stays visible. */
  var map = document.getElementById('map');
  if (map && map.getAttribute('data-src')) {
    {
      var frame = document.createElement('iframe');
      frame.title = 'Roti Xpress on Google Maps';
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.setAttribute('allowfullscreen', '');
      document.addEventListener('securitypolicyviolation', function (e) {
        if (String(e.blockedURI || '').indexOf('google.') !== -1 && frame.parentNode) frame.parentNode.removeChild(frame);
      });
      frame.src = map.getAttribute('data-src');
      map.appendChild(frame);
    }
  }

  /* ---------- Reviews: dots for the swipe carousel on phones ---------- */
  var carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    var track = carousel.querySelector('.reviews-track');
    var cards = track.children;
    var dotsWrap = carousel.querySelector('.reviews-dots');
    var dots = [];

    Array.prototype.forEach.call(cards, function (card, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Review ' + (i + 1));
      b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      b.addEventListener('click', function () {
        track.scrollTo({ left: card.offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft), behavior: 'smooth' });
      });
      dotsWrap.appendChild(b);
      dots.push(b);
    });

    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var max = track.scrollWidth - track.clientWidth;
        var idx = max > 0 ? Math.round((track.scrollLeft / max) * (cards.length - 1)) : 0;
        dots.forEach(function (d, i) { d.setAttribute('aria-selected', i === idx ? 'true' : 'false'); });
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Gallery: tap a photo to view it large ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll('.g-item'));
  var box = document.querySelector('.lightbox');
  if (items.length && box) {
    var lbImg = box.querySelector('.lb-img');
    var lbSource = box.querySelector('.lb-source');
    var lbCaption = box.querySelector('.lb-caption');
    var lbCount = box.querySelector('.lb-count');
    var current = 0;
    var lastFocus = null;

    var show = function (i) {
      current = (i + items.length) % items.length;
      var el = items[current];
      lbSource.srcset = el.getAttribute('data-webp');
      lbImg.src = el.getAttribute('data-jpg');
      lbImg.width = el.getAttribute('data-w');
      lbImg.height = el.getAttribute('data-h');
      lbImg.alt = el.querySelector('img').alt;
      lbCaption.textContent = el.getAttribute('data-caption');
      lbCount.textContent = (current + 1) + ' / ' + items.length;
    };
    var openBox = function (i) {
      lastFocus = document.activeElement;
      show(i);
      box.hidden = false;
      document.body.classList.add('no-scroll');
      box.querySelector('.lb-close').focus();
    };
    var closeBox = function () {
      box.hidden = true;
      document.body.classList.remove('no-scroll');
      if (lastFocus) lastFocus.focus();
    };

    items.forEach(function (el, i) {
      el.addEventListener('click', function () { openBox(i); });
    });
    box.querySelector('.lb-close').addEventListener('click', closeBox);
    box.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
    box.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lb-stage')) closeBox();   // tap outside the photo
    });

    // Swipe left / right on phones
    var startX = null;
    box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) show(current + (dx < 0 ? 1 : -1));
      startX = null;
    }, { passive: true });

    // Keep keyboard focus inside the viewer while it is open
    box.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = box.querySelectorAll('button');
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------- Keyboard: Esc closes the menu or the photo viewer ---------- */
  document.addEventListener('keydown', function (e) {
    var viewerOpen = box && !box.hidden;
    if (e.key === 'Escape') {
      if (viewerOpen) box.querySelector('.lb-close').click();
      else if (nav) setMenu(false);
    } else if (viewerOpen && e.key === 'ArrowLeft') {
      box.querySelector('.lb-prev').click();
    } else if (viewerOpen && e.key === 'ArrowRight') {
      box.querySelector('.lb-next').click();
    }
  });

  /* ---------- Products: slide in when scrolled to; tap to play the turn on phones ---------- */
  var productList = document.querySelector('.products');
  if (productList) {
    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ('IntersectionObserver' in window && !calm) {
      productList.classList.add('will-appear');
      var po = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { productList.classList.add('in'); po.disconnect(); }
        });
      }, { threshold: 0.15 });
      po.observe(productList);
    }
    if (!window.matchMedia('(hover: hover)').matches) {
      productList.querySelectorAll('.product').forEach(function (card) {
        card.addEventListener('click', function () {
          var wasOn = card.classList.contains('is-on');
          productList.querySelectorAll('.product.is-on').forEach(function (c) { c.classList.remove('is-on'); });
          if (!wasOn) card.classList.add('is-on');
        });
      });
    }
  }

  /* ---------- Sections fade up as they scroll into view ---------- */
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var groups = [
      ['.section-head', 0], ['.about-media', 0], ['.about-copy', .12], ['.band-title', 0], ['.band-lede', .08],
      ['.supply li', .07], ['.g-item', .06], ['.reviews', 0], ['.reviews-more', 0], ['.faq-item', .06],
      ['.band-orange .band-actions', .1], ['.contact-copy', 0], ['.map', .12]
    ];
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    groups.forEach(function (g) {
      document.querySelectorAll(g[0]).forEach(function (el, i) {
        if (el.closest('.slide') || el.getBoundingClientRect().top < window.innerHeight * 0.9) return;   // already on screen: leave it
        el.classList.add('reveal');
        el.style.setProperty('--d', Math.min(i % 6, 5) * g[1] + 's');
        ro.observe(el);
      });
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
