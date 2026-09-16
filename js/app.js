(function () {
  'use strict';

  var ICONS_PATH = './icons.svg';

  function icon(name) {
    return '<svg class="icon" aria-hidden="true"><use href="' + ICONS_PATH + '#i-' + name + '"></use></svg>';
  }

  /* ---------- Toasts ---------- */
  window.toast = function toast(message, type, opts) {
    opts = opts || {};
    var container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    var map = {
      success: { name: 'check', label: 'Success' },
      error: { name: 'alert', label: 'Error' },
      info: { name: 'info', label: 'Info' }
    };
    var kind = map[type] || map.info;
    var el = document.createElement('div');
    el.className = 'toast ' + (type || 'info');
    el.innerHTML =
      '<span class="t-icon">' + icon(kind.name) + '</span>' +
      '<span>' + message + '</span>' +
      '<button class="t-close" aria-label="Dismiss">' + icon('x') + '</button>';
    container.appendChild(el);
    var dismiss = function () {
      if (!el.isConnected) return;
      el.classList.add('out');
      setTimeout(function () { el.remove(); }, 260);
    };
    el.querySelector('.t-close').addEventListener('click', dismiss);
    var t = opts.duration == null ? 3200 : opts.duration;
    setTimeout(dismiss, t);
  };

  /* ---------- Modal helpers ---------- */
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-modal-open]');
    if (trigger) {
      var id = trigger.getAttribute('data-modal-open');
      var modal = document.getElementById(id);
      if (modal) {
        modal.classList.add('open');
        var first = modal.querySelector('input, select, textarea');
        if (first) setTimeout(function () { first.focus(); }, 120);
      }
      return;
    }
    var close = e.target.closest('[data-modal-close]');
    if (close) fireClose(close);
  });

  function fireClose(btn) {
    var modal = btn.closest('.modal-overlay');
    if (!modal) return;
    modal.classList.remove('open');
    setTimeout(function () {
      var forms = modal.querySelectorAll('form');
      for (var i = 0; i < forms.length; i++) forms[i].reset();
    }, 250);
  }

  document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
    overlay.addEventListener('mousedown', function (e) {
      if (e.target === overlay) {
        overlay.classList.remove('open');
      }
    });
  });

  /* ---------- Mobile nav menu (landing) ---------- */
  var navToggle = document.getElementById('navToggle');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      document.getElementById('mobileMenu').classList.toggle('open');
    });
  }

  /* ---------- Landing reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 0.05 + 's';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ---------- Sidebar (dashboard) ---------- */
  var sidebarToggle = document.getElementById('sidebarToggle');
  var sidebar = document.getElementById('sidebar');
  var backdrop = document.getElementById('sidebarBackdrop');
  if (sidebarToggle && sidebar) {
    var closeSidebar = function () {
      sidebar.classList.remove('open');
      if (backdrop) backdrop.classList.remove('show');
    };
    sidebarToggle.addEventListener('click', function () {
      sidebar.classList.add('open');
      if (backdrop) backdrop.classList.add('show');
    });
    if (backdrop) backdrop.addEventListener('click', closeSidebar);
    document.querySelectorAll('#sidebar a').forEach(function (a) {
      a.addEventListener('click', closeSidebar);
    });
  }

  /* ---------- New project modal ---------- */
  var createForm = document.getElementById('createProjectForm');
  var originInput = document.getElementById('projOrigin');
  var originCards = (document.querySelectorAll('#projOriginTabs .opt-card') ||
    []);
  originCards.forEach(function (card) {
    card.addEventListener('click', function () {
      originCards.forEach(function (c) { c.classList.remove('active'); });
      card.classList.add('active');
      if (originInput) originInput.value = card.getAttribute('data-origin');
      toggleStartFromTemplates();
    });
  });

  function toggleStartFromTemplates() {
    var fromTpl = document.getElementById('startFromTemplates');
    if (!fromTpl) return;
    fromTpl.style.display = (originInput && originInput.value === 'template') ? 'flex' : 'none';
  }
  toggleStartFromTemplates();

  var thumbOpts = (document.querySelectorAll('#thumbOptions .proj-thumb-opt') || []);
  thumbOpts.forEach(function (opt) {
    opt.addEventListener('click', function () {
      thumbOpts.forEach(function (o) { o.classList.remove('active'); });
      opt.classList.add('active');
    });
  });

  var colorDots = (document.querySelectorAll('#accentDots .color-dot') || []);
  colorDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      colorDots.forEach(function (d) { d.classList.remove('active'); });
      dot.classList.add('active');
      var accent = dot.getAttribute('data-color');
      var preview = document.getElementById('projPreview');
      if (preview && accent) preview.style.background = accent;
      var accentInput = document.getElementById('projAccent');
      if (accentInput) accentInput.value = accent;
    });
  });

  var startTemplateSelect = document.getElementById('startTemplateSelect');

  if (createForm) {
    createForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('projName').value.trim();
      if (!name) {
        window.toast('Give your project a name first.', 'error');
        return;
      }

      var overlay = document.getElementById('createProjectModal');
      if (overlay) overlay.classList.remove('open');

      var tplName = '';
      if (startTemplateSelect && startTemplateSelect.value && originInput.value === 'template') {
        tplName = ' from ' + startTemplateSelect.value;
      }
      window.toast('Creating "' + name + '"' + tplName + '…', 'info', { duration: 1800 });
      setTimeout(function () {
        window.toast('Project created and ready to build.', 'success');
        setTimeout(function () {
          window.location.href = 'builder.html?project=' + encodeURIComponent(name);
        }, 900);
      }, 1600);
    });
  }

  /* ---------- Templates page: filters & search ---------- */
  var templateCards = (document.querySelectorAll('.template-card') || []);
  var filterChips = (document.querySelectorAll('.filter-row .chip') || []);

  function applyTemplateFilters(filter, search) {
    var shown = 0;
    templateCards.forEach(function (card) {
      var cats = (card.getAttribute('data-cats') || '').split(',');
      var title = (card.getAttribute('data-title') || '').toLowerCase();
      var okCat = filter === 'all' || cats.indexOf(filter) > -1;
      var okSearch = !search || title.indexOf(search) > -1;
      var visible = okCat && okSearch;
      card.style.display = visible ? '' : 'none';
      if (visible) shown++;
    });
    var empty = document.getElementById('templatesEmpty');
    if (empty) empty.style.display = shown ? 'none' : 'block';
  }

  filterChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      filterChips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      var input = document.getElementById('templatesSearchInput');
      applyTemplateFilters(chip.getAttribute('data-filter'), input ? input.value.trim().toLowerCase() : '');
    });
  });

  var tplSearch = document.getElementById('templatesSearchInput');
  if (tplSearch) {
    tplSearch.addEventListener('input', function () {
      var active = document.querySelector('.filter-row .chip.active');
      applyTemplateFilters(active ? active.getAttribute('data-filter') : 'all', tplSearch.value.trim().toLowerCase());
    });
  }
  var tplSearchBtn = document.getElementById('templatesSearch');
  if (tplSearchBtn) {
    tplSearchBtn.addEventListener('submit', function (e) { e.preventDefault(); });
  }

  document.querySelectorAll('[data-use-template]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tpl = btn.getAttribute('data-use-template');
      window.toast('Applying "' + tpl + '" template…', 'info', { duration: 1400 });
      setTimeout(function () {
        window.location.href = 'builder.html?template=' + encodeURIComponent(tpl);
      }, 1000);
    });
  });

  document.querySelectorAll('[data-preview-template]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tpl = btn.getAttribute('data-preview-template');
      window.toast('Opening "' + tpl + '" in preview…', 'info', { duration: 1200 });
      setTimeout(function () {
        window.location.href = 'builder.html?template=' + encodeURIComponent(tpl) + '&preview=1';
      }, 900);
    });
  });

  /* ---------- Project card menu + edit ---------- */
  document.querySelectorAll('.project-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('.proj-more, a, button')) return;
      var name = card.getAttribute('data-name') || 'Untitled app';
      window.location.href = 'builder.html?project=' + encodeURIComponent(name);
    });
    var more = card.querySelector('.proj-more');
    if (more) {
      more.addEventListener('click', function (ev) {
        ev.stopPropagation();
        var actions = more.getAttribute('aria-label') || 'Project options';
        window.toast(actions + ' — a menu will open here.', 'info');
      });
    }
  });

  /* ---------- Global mini search (topbar) ---------- */
  var topSearch = document.getElementById('topSearch');
  if (topSearch) {
    topSearch.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        window.toast('Search is coming in a future iteration.', 'info');
      }
    });
  }

  /* ---------- Notification bell placeholder ---------- */
  var bell = document.getElementById('notifBell');
  if (bell) {
    bell.addEventListener('click', function () {
      window.toast('2 new notifications', 'info');
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();