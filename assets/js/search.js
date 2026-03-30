/* Terre'Happy — Search engine */
(function () {
  'use strict';

  /* ---- accent normalization ---- */
  function normalize(str) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/['']/g, "'");
  }

  /* ---- build modal DOM ---- */
  function buildModal() {
    var overlay = document.createElement('div');
    overlay.id = 'search-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Recherche');
    overlay.innerHTML =
      '<div id="search-modal">' +
        '<div id="search-header">' +
          '<div id="search-input-wrap">' +
            '<i class="fas fa-search" id="search-icon"></i>' +
            '<input id="search-input" type="search" placeholder="Rechercher un thérapeute, une thérapie, une info…" autocomplete="off" spellcheck="false">' +
            '<button id="search-clear" aria-label="Effacer" style="display:none"><i class="fas fa-times"></i></button>' +
          '</div>' +
          '<button id="search-close" aria-label="Fermer la recherche"><i class="fas fa-times"></i> Fermer</button>' +
        '</div>' +
        '<div id="search-results" role="listbox" aria-label="Résultats"></div>' +
        '<div id="search-footer">' +
          '<span><kbd>↑</kbd><kbd>↓</kbd> naviguer</span>' +
          '<span><kbd>↵</kbd> ouvrir</span>' +
          '<span><kbd>Échap</kbd> fermer</span>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  /* ---- category labels & icons ---- */
  var CAT = {
    therapeute: { label: 'Thérapeutes', icon: 'fa-user-circle' },
    therapie:   { label: 'Thérapies',   icon: 'fa-leaf' },
    page:       { label: 'Pages',       icon: 'fa-file-alt' },
    info:       { label: 'Infos pratiques', icon: 'fa-info-circle' }
  };

  /* ---- score a single item ---- */
  function score(item, query) {
    var q = normalize(query);
    var n = normalize(item.name);
    var d = normalize(item.description || '');
    var t = (item.tags || []).map(normalize).join(' ');

    if (n === q)          return 100;
    if (n.startsWith(q)) return 80;
    if (n.includes(q))   return 60;
    if (t.includes(q))   return 40;
    if (d.includes(q))   return 20;
    return 0;
  }

  /* ---- search ---- */
  function search(query) {
    if (!query || query.trim().length < 2) return [];
    var q = query.trim();
    var results = [];
    (window.TH_SEARCH_DATA || []).forEach(function (item) {
      var s = score(item, q);
      if (s > 0) results.push({ item: item, score: s });
    });
    results.sort(function (a, b) { return b.score - a.score; });
    return results.map(function (r) { return r.item; });
  }

  /* ---- render results ---- */
  function render(items, query, container) {
    container.innerHTML = '';

    if (query.trim().length < 2) {
      container.innerHTML = '<p class="search-hint">Tapez au moins 2 caractères pour lancer la recherche.</p>';
      return;
    }

    if (items.length === 0) {
      container.innerHTML = '<p class="search-hint">Aucun résultat pour &ldquo;' + escHtml(query) + '&rdquo;.</p>';
      return;
    }

    /* group by type in order */
    var groups = {};
    var order = ['therapeute', 'therapie', 'page', 'info'];
    order.forEach(function (t) { groups[t] = []; });
    items.forEach(function (item) {
      if (groups[item.type]) groups[item.type].push(item);
    });

    var focused = 0;
    var allItems = [];

    order.forEach(function (type) {
      var list = groups[type];
      if (!list.length) return;

      var section = document.createElement('div');
      section.className = 'search-section';

      var heading = document.createElement('div');
      heading.className = 'search-section-title';
      heading.innerHTML = '<i class="fas ' + CAT[type].icon + '"></i> ' + CAT[type].label;
      section.appendChild(heading);

      list.forEach(function (item) {
        var el = document.createElement('a');
        el.href = item.url;
        el.className = 'search-result-item';
        el.setAttribute('role', 'option');
        el.setAttribute('data-index', allItems.length);

        var left = '';
        if (type === 'therapeute' && item.photo) {
          left = '<img src="' + escHtml(item.photo) + '" alt="' + escHtml(item.name) + '" class="search-result-photo" loading="lazy">';
        } else {
          left = '<div class="search-result-icon"><i class="fas ' + CAT[type].icon + '"></i></div>';
        }

        var badge = '';
        if (type === 'therapeute' && item.tags && item.tags[0]) {
          badge = '<span class="search-result-badge">' + escHtml(item.tags[0]) + '</span>';
        }

        var phone = '';
        if (type === 'therapeute' && item.phone) {
          phone = '<span class="search-result-phone"><i class="fas fa-phone"></i> ' + escHtml(item.phone) + '</span>';
        }

        el.innerHTML =
          left +
          '<div class="search-result-body">' +
            '<span class="search-result-name">' + highlight(item.name, query) + '</span>' +
            badge +
            '<span class="search-result-desc">' + highlight(item.description || '', query) + '</span>' +
            phone +
          '</div>' +
          '<i class="fas fa-chevron-right search-result-arrow"></i>';

        section.appendChild(el);
        allItems.push(el);
      });

      container.appendChild(section);
    });

    /* keyboard nav via data-index */
    window._searchItems = allItems;
    window._searchFocus = -1;
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function highlight(text, query) {
    if (!query || query.length < 2) return escHtml(text);
    var safe = escHtml(text);
    var safeQ = escHtml(query.trim());
    var re = new RegExp('(' + safeQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return safe.replace(re, '<mark>$1</mark>');
  }

  /* ---- keyboard navigation ---- */
  function moveFocus(dir) {
    var items = window._searchItems || [];
    if (!items.length) return;
    var idx = (window._searchFocus === undefined ? -1 : window._searchFocus) + dir;
    if (idx < 0) idx = items.length - 1;
    if (idx >= items.length) idx = 0;
    window._searchFocus = idx;
    items.forEach(function (el, i) {
      el.classList.toggle('search-result-focused', i === idx);
    });
    if (items[idx]) items[idx].scrollIntoView({ block: 'nearest' });
  }

  /* ---- open / close ---- */
  var overlay, input, results, clearBtn;
  var isOpen = false;

  function open() {
    if (!overlay) {
      overlay = buildModal();
      input    = overlay.querySelector('#search-input');
      results  = overlay.querySelector('#search-results');
      clearBtn = overlay.querySelector('#search-clear');

      input.addEventListener('input', function () {
        var q = input.value;
        clearBtn.style.display = q ? 'flex' : 'none';
        render(search(q), q, results);
        window._searchFocus = -1;
      });

      clearBtn.addEventListener('click', function () {
        input.value = '';
        clearBtn.style.display = 'none';
        render([], '', results);
        input.focus();
      });

      overlay.querySelector('#search-close').addEventListener('click', close);

      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close();
      });

      overlay.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { close(); return; }
        if (e.key === 'ArrowDown') { e.preventDefault(); moveFocus(1); return; }
        if (e.key === 'ArrowUp')   { e.preventDefault(); moveFocus(-1); return; }
        if (e.key === 'Enter') {
          var items = window._searchItems || [];
          var idx = window._searchFocus;
          if (idx >= 0 && items[idx]) { items[idx].click(); return; }
        }
      });
    }

    overlay.classList.add('search-open');
    document.body.classList.add('search-active');
    isOpen = true;
    setTimeout(function () { input.focus(); }, 50);
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('search-open');
    document.body.classList.remove('search-active');
    isOpen = false;
    /* reset */
    if (input) input.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    if (results) results.innerHTML = '';
    window._searchItems = [];
    window._searchFocus = -1;
  }

  /* ---- wire up trigger buttons ---- */
  function init() {
    document.querySelectorAll('.search-trigger').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        isOpen ? close() : open();
      });
    });

    /* global shortcut: Ctrl+K or / (when not in input) */
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? close() : open();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
