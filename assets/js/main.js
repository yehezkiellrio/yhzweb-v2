/**
 * Yehezkiel's Insight — Main JS v3.0
 * Search, topic filter, sticky header, animations, URL-based filtering
 */
(function () {
  'use strict';

  // Load enhancements
  (function () {
    const current = document.currentScript?.src;
    if (!current) return;
    const base = current.replace(/assets\/js\/main\.js(\?.*)?$/, '');
    const s = document.createElement('script');
    s.src = base + 'assets/js/enhancements.js';
    s.defer = true;
    document.head.appendChild(s);
  })();

  let header, searchInput, postCards;
  let isScrolled = false;
  let searchTimeout;

  function init() {
    header = document.getElementById('header');
    searchInput = document.getElementById('searchInput');
    postCards = document.querySelectorAll('.post-card');

    initStickyHeader();
    initSearch();
    initTopicFilter();
    initAnimations();
    initKeyboard();
    updateURLFromFilter();
  }

  /* ── Sticky Header ──────────────────────────────────────── */
  function initStickyHeader() {
    if (!header) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY > 50;
          if (scrolled !== isScrolled) {
            isScrolled = scrolled;
            header.classList.toggle('scrolled', isScrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── Search ─────────────────────────────────────────────── */
  function initSearch() {
    if (!searchInput || !postCards.length) return;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => performSearch(e.target.value), 300);
    });
  }

  function performSearch(query) {
    const term = query.toLowerCase().trim();
    let visible = 0;

    postCards.forEach(card => {
      const title = card.querySelector('.post-title a');
      const excerpt = card.querySelector('.post-excerpt');
      if (!title) return;

      const match = !term ||
        title.textContent.toLowerCase().includes(term) ||
        (excerpt && excerpt.textContent.toLowerCase().includes(term));

      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    // No results message
    const existing = document.querySelector('.no-results-message');
    if (existing) existing.remove();

    if (visible === 0 && term) {
      const msg = document.createElement('div');
      msg.className = 'no-results-message';
      msg.innerHTML = `<h3>No posts found</h3><p>Try different keywords.</p>`;
      const section = document.querySelector('.posts-section');
      if (section) section.appendChild(msg);
    }
  }

  /* ── Topic Filter ───────────────────────────────────────── */
  let currentTag = 'all';

  function initTopicFilter() {
    const allButtons = document.querySelectorAll('.topic-tag');
    if (!allButtons.length) return;

    allButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        currentTag = btn.dataset.tag;
        // Sync all instances of this tag button
        document.querySelectorAll('.topic-tag').forEach(b => {
          b.classList.toggle('active', b.dataset.tag === currentTag);
        });
        applyFilter(currentTag);
        updateURLFromFilter();
      });
    });

    // Check URL for initial filter
    const params = new URLSearchParams(window.location.search);
    const urlCat = params.get('category');
    if (urlCat) {
      currentTag = urlCat;
      document.querySelectorAll('.topic-tag').forEach(b => {
        b.classList.toggle('active', b.dataset.tag === urlCat);
      });
      applyFilter(urlCat);
    }
  }

  function applyFilter(tag) {
    postCards.forEach(card => {
      if (tag === 'all') {
        card.style.display = '';
      } else {
        const cardTag = card.querySelector('.post-tag');
        card.style.display = (cardTag && cardTag.textContent.trim() === tag) ? '' : 'none';
      }
    });

    // Clear search when filtering
    if (searchInput) searchInput.value = '';
    const noRes = document.querySelector('.no-results-message');
    if (noRes) noRes.remove();
  }

  function updateURLFromFilter() {
    if (!window.history?.replaceState) return;
    const url = new URL(window.location.href);
    if (currentTag && currentTag !== 'all') {
      url.searchParams.set('category', currentTag);
    } else {
      url.searchParams.delete('category');
    }
    window.history.replaceState({}, '', url.toString());
  }

  /* ── Animations ─────────────────────────────────────────── */
  function initAnimations() {
    if (!('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    postCards.forEach(card => obs.observe(card));
    document.querySelectorAll('.sidebar-widget').forEach(w => obs.observe(w));
  }

  /* ── Keyboard ───────────────────────────────────────────── */
  function initKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchInput && document.activeElement === searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.blur();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInput) { searchInput.focus(); searchInput.select(); }
      }
    });
  }

  /* ── Smooth scroll ──────────────────────────────────────── */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });

  /* ── Run ────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
