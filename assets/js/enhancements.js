/**
 * Yehezkiel's Insight — Enhancements v3.0
 * Dark mode, back-to-top, reading progress, newsletter, load more
 */
(function () {
  'use strict';

  /* ── Dark Mode ──────────────────────────────────────────── */
  function initDarkMode() {
    const btn = document.getElementById('darkModeToggle');
    if (!btn) return;
    const icon = btn.querySelector('.dm-icon');
    const label = btn.querySelector('.dm-label');

    function setDark(on) {
      document.documentElement.classList.toggle('dark-mode', on);
      if (icon) icon.textContent = on ? '☀️' : '🌙';
      if (label) label.textContent = on ? 'Light Mode' : 'Dark Mode';
      btn.setAttribute('aria-label', on ? 'Switch to light mode' : 'Switch to dark mode');
      try { localStorage.setItem('yhz-dark', on ? '1' : '0'); } catch(e){}
    }

    let stored = '0';
    try { stored = localStorage.getItem('yhz-dark') || '0'; } catch(e){}
    setDark(stored === '1');

    btn.addEventListener('click', () => {
      setDark(!document.documentElement.classList.contains('dark-mode'));
    });
  }

  /* ── Back to Top ────────────────────────────────────────── */
  function initBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'Back to top');
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(btn);

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          btn.classList.toggle('show', window.scrollY > 350);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── Reading Progress Bar ───────────────────────────────── */
  function initReadingProgress() {
    const bar = document.getElementById('reading-progress');
    if (!bar) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
          bar.style.width = pct + '%';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── Load More ──────────────────────────────────────────── */
  function initLoadMore() {
    const btn = document.getElementById('loadMorePosts');
    if (!btn) return;
    btn.addEventListener('click', () => {
      btn.textContent = 'No more posts to load';
      btn.disabled = true;
      btn.style.opacity = '0.5';
    });
  }

  /* ── Newsletter Subscribe ───────────────────────────────── */
  function initNewsletter() {
    const subscribeBtn = document.getElementById('subscribeBtn');
    const emailInput = document.getElementById('emailInput');
    if (!subscribeBtn || !emailInput) return;

    subscribeBtn.addEventListener('click', () => {
      const email = emailInput.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address.', '#E74C3C');
        return;
      }
      subscribeBtn.textContent = 'Subscribing...';
      subscribeBtn.disabled = true;
      setTimeout(() => {
        showToast('🙏 Thank you! You\'re now subscribed.', '#1A6B6B');
        emailInput.value = '';
        subscribeBtn.textContent = 'Subscribe →';
        subscribeBtn.disabled = false;
      }, 1500);
    });

    emailInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') subscribeBtn.click();
    });
  }

  /* ── Toast Notification ─────────────────────────────────── */
  function showToast(msg, bg) {
    const el = document.createElement('div');
    el.className = 'user-message';
    el.style.background = bg || '#1A6B6B';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(110%)'; el.style.transition = 'all 0.3s ease'; setTimeout(() => el.remove(), 400); }, 4000);
  }

  /* ── URL-based category filtering ──────────────────────── */
  function initURLFilter() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (!cat) return;

    // Sync sidebar topic buttons
    document.querySelectorAll('.topic-tag').forEach(btn => {
      if (btn.dataset.tag === cat) {
        btn.classList.add('active');
        btn.click();
      } else {
        btn.classList.remove('active');
      }
    });
  }

  /* ── Init ───────────────────────────────────────────────── */
  function init() {
    initDarkMode();
    initBackToTop();
    initReadingProgress();
    initLoadMore();
    initNewsletter();
    setTimeout(initURLFilter, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
