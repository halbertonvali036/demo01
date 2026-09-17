(function () {
  'use strict';

  function icon(name, cls) {
    return '<svg class="icon ' + (cls || '') + '" aria-hidden="true"><use href="#i-' + name + '"></use></svg>';
  }

  var AVATAR_COLORS = ['#6366f1', '#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#f43f5e', '#14b8a6', '#dc2626', '#7c3aed', '#0891b2'];

  function avatarColor(name) {
    var n = 0;
    for (var i = 0; i < name.length; i++) n += name.charCodeAt(i);
    return AVATAR_COLORS[n % AVATAR_COLORS.length];
  }

  function initials(name) {
    return name.split(' ').map(function (w) { return w.charAt(0); }).slice(0, 2).join('').toUpperCase();
  }

  function timeAgo(dateStr) {
    var d = new Date(dateStr);
    var diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var state = {
    users: [
      { id: 1, name: 'Taylor Evans', email: 'taylor@acme.io', role: 'Admin', projects: 24, status: 'active', joined: '2022-03-14', lastActive: '2026-09-17T09:12:00' },
      { id: 2, name: 'Jasmine Singh', email: 'jasmine@cosmiclabs.io', role: 'Admin', projects: 31, status: 'active', joined: '2022-06-02', lastActive: '2026-09-17T08:44:00' },
      { id: 3, name: 'Marcus Kim', email: 'marcus@brightside.dev', role: 'Editor', projects: 12, status: 'active', joined: '2023-01-19', lastActive: '2026-09-16T22:30:00' },
      { id: 4, name: 'Sophie Owens', email: 'sophie@northpeak.co', role: 'Editor', projects: 18, status: 'active', joined: '2023-05-27', lastActive: '2026-09-17T07:15:00' },
      { id: 5, name: 'Daniel Reyes', email: 'daniel@loopform.io', role: 'User', projects: 4, status: 'active', joined: '2024-02-11', lastActive: '2026-09-14T18:02:00' },
      { id: 6, name: 'Ava Thompson', email: 'ava@craftgrid.studio', role: 'User', projects: 7, status: 'suspended', joined: '2024-04-08', lastActive: '2026-08-29T11:47:00' },
      { id: 7, name: 'Noah Patel', email: 'noah@vertexhq.dev', role: 'Viewer', projects: 2, status: 'active', joined: '2025-07-23', lastActive: '2026-09-15T14:20:00' },
      { id: 8, name: 'Emma Laurent', email: 'emma@zephyr.studio', role: 'User', projects: 9, status: 'active', joined: '2025-09-01', lastActive: '2026-09-17T05:33:00' },
      { id: 9, name: 'Liam Carter', email: 'liam@goodwell.app', role: 'User', projects: 3, status: 'suspended', joined: '2025-11-16', lastActive: '2026-08-12T09:58:00' },
      { id: 10, name: 'Mia Fernandez', email: 'mia@plainview.io', role: 'Editor', projects: 14, status: 'active', joined: '2026-01-05', lastActive: '2026-09-16T19:41:00' }
    ],
    projects: [
      { id: 1, name: 'SaaS Launchpad', owner: 'Taylor Evans', type: 'Landing page', status: 'Published', created: '2026-06-12', modified: '2026-09-17T09:02:00', views: 84211, enabled: true },
      { id: 2, name: 'Admin Analytics', owner: 'Jasmine Singh', type: 'Dashboard', status: 'Draft', created: '2026-07-03', modified: '2026-09-16T18:25:00', views: 0, enabled: true },
      { id: 3, name: 'Customer Portal', owner: 'Marcus Kim', type: 'Portal', status: 'Published', created: '2026-06-22', modified: '2026-09-15T11:10:00', views: 42123, enabled: true },
      { id: 4, name: 'Event RSVP Form', owner: 'Sophie Owens', type: 'Form', status: 'Draft', created: '2026-08-14', modified: '2026-09-12T15:48:00', views: 0, enabled: true },
      { id: 5, name: 'Product Showcase', owner: 'Daniel Reyes', type: 'Landing page', status: 'Published', created: '2026-05-30', modified: '2026-09-10T10:22:00', views: 31085, enabled: true },
      { id: 6, name: 'Order Management', owner: 'Ava Thompson', type: 'Web application', status: 'Draft', created: '2026-08-02', modified: '2026-08-29T14:05:00', views: 0, enabled: false },
      { id: 7, name: 'Online Store', owner: 'Emma Laurent', type: 'Store', status: 'Published', created: '2026-07-19', modified: '2026-09-14T09:33:00', views: 128744, enabled: true },
      { id: 8, name: 'Portfolio Site', owner: 'Mia Fernandez', type: 'Landing page', status: 'Published', created: '2026-04-25', modified: '2026-09-08T16:12:00', views: 18930, enabled: true },
      { id: 9, name: 'Data Report', owner: 'Noah Patel', type: 'Web application', status: 'Draft', created: '2026-09-01', modified: '2026-09-05T12:00:00', views: 0, enabled: true },
      { id: 10, name: 'Team Wiki', owner: 'Liam Carter', type: 'Web application', status: 'Published', created: '2025-12-08', modified: '2026-08-01T08:26:00', views: 8872, enabled: true }
    ],
    templates: [
      { id: 1, name: 'SaaS landing page', desc: 'A conversion-focused landing page with pricing and FAQ sections.', category: 'Marketing', color: '#6366f1', layout: 'hero', featured: true, enabled: true },
      { id: 2, name: 'Admin dashboard', desc: 'Internal dashboard with charts, KPIs, and a drill-down report view.', category: 'Internal', color: '#0ea5e9', layout: 'split', featured: true, enabled: true },
      { id: 3, name: 'Portfolio showcase', desc: 'Elegant gallery site for a design studio collection.', category: 'Creative', color: '#f43f5e', layout: 'grid', featured: false, enabled: true },
      { id: 4, name: 'Waitlist & forms', desc: 'Multi-step registration flow with confirmation screens.', category: 'Conversion', color: '#10b981', layout: 'form', featured: false, enabled: true },
      { id: 5, name: 'Customer portal', desc: 'Secure client portal with sign-in, invoices, and support tickets.', category: 'Accounts', color: '#8b5cf6', layout: 'split', featured: true, enabled: true },
      { id: 6, name: 'E-commerce storefront', desc: 'Modern storefront with product cards and a robust checkout.', category: 'Store', color: '#f59e0b', layout: 'grid', featured: false, enabled: true },
      { id: 7, name: 'Analytics report', desc: 'Data narrative with headless tables and inline charts.', category: 'Data', color: '#0d9488', layout: 'form', featured: false, enabled: false },
      { id: 8, name: 'Event landing', desc: 'Grab people\'s attention for your next live event.', category: 'Events', color: '#dc2626', layout: 'hero', featured: false, enabled: true }
    ],
    reports: [
      { id: 1, project: 'SafePay Wireframe', reporter: 'Priya Nair', reason: 'Copyright infringement', date: '2026-09-16T14:20:00', status: 'Pending', detail: 'Project appears to closely copy the SafePay marketing site, including layout, copy and color palette.' },
      { id: 2, project: 'TrollNet Forum', reporter: 'Tomas Blake', reason: 'Abusive content', date: '2026-09-16T09:05:00', status: 'Pending', detail: 'The published forum contains hateful language and targeted harassment in its sample content.' },
      { id: 3, project: 'Ghost Store', reporter: 'Reina Mota', reason: 'Spam', date: '2026-09-15T18:44:00', status: 'Pending', detail: 'Store advertises products that do not exist and links out to spam websites.' },
      { id: 4, project: 'DropShip Plus', reporter: 'Omar Hadi', reason: 'Misleading content', date: '2026-09-10T11:30:00', status: 'Reviewed', detail: 'Claims certifications that the business does not hold.' },
      { id: 5, project: 'CoinFast Clone', reporter: 'Grace Lin', reason: 'Phishing', date: '2026-09-06T07:12:00', status: 'Dismissed', detail: 'Suspected phishing design; investigation found no harmful scripts.' },
      { id: 6, project: 'Adult Casino Ads', reporter: 'Yusuf Khan', reason: 'Inappropriate content', date: '2026-09-01T20:51:00', status: 'Reviewed', detail: 'Auto-generated ads include adult content not allowed by policy.' }
    ],
    activity: [
      { id: 1, event: 'User registered', actor: 'Emma Laurent', type: 'User', target: 'emma@zephyr.studio', time: '2026-09-17T08:58:00' },
      { id: 2, event: 'Project published', actor: 'Jasmine Singh', type: 'Project', target: 'Lumen Analytics', time: '2026-09-17T08:45:00' },
      { id: 3, event: 'Admin action', actor: 'Alex Doe', type: 'Admin', target: 'Suspended @rogue_designs', time: '2026-09-17T07:02:00' },
      { id: 4, event: 'Project created', actor: 'Marcus Kim', type: 'Project', target: 'FitTrack Mobile', time: '2026-09-17T06:31:00' },
      { id: 5, event: 'Template created', actor: 'Alex Doe', type: 'Template', target: 'Event landing', time: '2026-09-16T21:14:00' },
      { id: 6, event: 'User suspended', actor: 'Alex Doe', type: 'Admin', target: 'ava@craftgrid.studio', time: '2026-09-16T19:40:00' },
      { id: 7, event: 'Project published', actor: 'Taylor Evans', type: 'Project', target: 'SaaS Launchpad', time: '2026-09-16T16:22:00' },
      { id: 8, event: 'User registered', actor: 'Noah Patel', type: 'User', target: 'noah@vertexhq.dev', time: '2026-09-16T12:05:00' },
      { id: 9, event: 'Template edited', actor: 'Alex Doe', type: 'Template', target: 'Admin dashboard', time: '2026-09-15T18:33:00' },
      { id: 10, event: 'Admin action', actor: 'Alex Doe', type: 'Admin', target: 'Changed role for sophie@northpeak.co', time: '2026-09-15T15:12:00' },
      { id: 11, event: 'User registered', actor: 'Mia Fernandez', type: 'User', target: 'mia@plainview.io', time: '2026-09-14T10:28:00' },
      { id: 12, event: 'Project created', actor: 'Emma Laurent', type: 'Project', target: 'Online Store', time: '2026-09-14T09:45:00' }
    ],
    currentSection: 'overview',
    confirmCb: null,
    projectThumbIndex: 0,
    tplSequence: 9
  };

  /* ---------- Section navigation ---------- */
  var navItems = document.querySelectorAll('#adminNav .nav-item[data-section]');
  var sections = document.querySelectorAll('.admin-section');

  function showSection(name) {
    state.currentSection = name;
    navItems.forEach(function (item) {
      item.classList.toggle('active', item.getAttribute('data-section') === name);
    });
    sections.forEach(function (sec) {
      sec.classList.toggle('active', sec.id === 'section-' + name);
    });
    document.querySelector('.admin-content').scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMobileSidebar();
    document.querySelectorAll('.action-menu').forEach(function (m) { m.classList.remove('open'); });
  }

  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      showSection(item.getAttribute('data-section'));
    });
  });

  document.querySelectorAll('[data-goto-section]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      showSection(el.getAttribute('data-goto-section'));
    });
  });

  /* ---------- Collapsible sidebar ---------- */
  var sidebar = document.getElementById('adminSidebar');
  var collapseBtn = document.getElementById('sidebarCollapseBtn');

  collapseBtn.addEventListener('click', function () {
    sidebar.classList.toggle('collapsed');
  });

  /* ---------- Mobile sidebar ---------- */
  var topbarToggle = document.getElementById('adminSidebarToggle');
  var backdrop = document.getElementById('adminBackdrop');

  function closeMobileSidebar() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('show');
  }

  topbarToggle.addEventListener('click', function () {
    sidebar.classList.add('open');
    backdrop.classList.add('show');
  });

  backdrop.addEventListener('click', closeMobileSidebar);

  /* ---------- Global helpers ---------- */
  function statusBadge(status) {
    if (status === 'active' || status === 'Published' || status === 'Enabled' || status === 'enabled') {
      return '<span class="badge badge-success"><span class="badge-dot"></span> ' + status + '</span>';
    }
    if (status === 'suspended' || status === 'Suspended' || status === 'Disabled' || status === 'disabled' || status === 'Dismissed') {
      return '<span class="badge badge-danger"><span class="badge-dot"></span> ' + status + '</span>';
    }
    if (status === 'Draft') {
      return '<span class="badge badge-warning"><span class="badge-dot"></span> Draft</span>';
    }
    if (status === 'Pending') {
      return '<span class="badge badge-warning"><span class="badge-dot"></span> Pending</span>';
    }
    if (status === 'Reviewed') {
      return '<span class="badge badge-info"><span class="badge-dot"></span> Reviewed</span>';
    }
    return '<span class="badge">' + status + '</span>';
  }

  function roleBadge(role) {
    if (role === 'Admin') return '<span class="badge badge-primary">Admin</span>';
    if (role === 'Editor') return '<span class="badge badge-info">Editor</span>';
    return '<span class="badge">' + role + '</span>';
  }

  function actionMenu(items) {
    var html = '<div class="action-menu-wrap"><button class="action-menu-btn" aria-label="More actions">' + icon('dot') + '</button><div class="action-menu">';
    items.forEach(function (item) {
      if (item.divider) {
        html += '<div class="divider"></div>';
      } else {
        html += '<button class="' + (item.danger ? 'danger' : '') + '" data-action="' + item.action + '">' + icon(item.icon) + item.label + '</button>';
      }
    });
    html += '</div></div>';
    return html;
  }

  document.addEventListener('click', function (e) {
    var menuBtn = e.target.closest('.action-menu-btn');
    if (menuBtn) {
      e.stopPropagation();
      var all = document.querySelectorAll('.action-menu');
      all.forEach(function (m) { m.classList.remove('open'); });
      menuBtn.nextElementSibling.classList.toggle('open');
      return;
    }
    if (e.target.closest('.action-menu button') || e.target.closest('.action-menu a')) {
      var menu = e.target.closest('.action-menu');
      if (menu) menu.classList.remove('open');
      return;
    }
    if (!e.target.closest('.action-menu')) {
      document.querySelectorAll('.action-menu').forEach(function (m) { m.classList.remove('open'); });
    }
  });

  /* ---------- Confirm dialog ---------- */
  var confirmOverlay = document.getElementById('confirmOverlay');

  function confirmDialog(opts) {
    document.getElementById('confirmTitle').textContent = opts.title || 'Are you sure?';
    document.getElementById('confirmText').textContent = opts.text || 'This action cannot be undone.';
    var iconWrap = document.getElementById('confirmIcon');
    iconWrap.querySelector('use').setAttribute('href', '#i-' + (opts.icon || 'alert'));
    iconWrap.className = 'icon-wrap ' + (opts.tone || '');
    var okBtn = document.getElementById('confirmOk');
    okBtn.textContent = opts.confirmText || 'Confirm';
    okBtn.className = opts.danger === false ? 'btn btn-primary' : 'btn btn-danger';
    state.confirmCb = opts.onConfirm;
    confirmOverlay.classList.add('open');
  }

  document.getElementById('confirmCancel').addEventListener('click', function () {
    confirmOverlay.classList.remove('open');
    state.confirmCb = null;
  });

  document.getElementById('confirmOk').addEventListener('click', function () {
    var cb = state.confirmCb;
    confirmOverlay.classList.remove('open');
    state.confirmCb = null;
    if (cb) cb();
  });

  confirmOverlay.addEventListener('mousedown', function (e) {
    if (e.target === confirmOverlay) {
      confirmOverlay.classList.remove('open');
      state.confirmCb = null;
    }
  });

  /* ---------- Toggle switches ---------- */
  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('.toggle');
    if (toggle) {
      toggle.classList.toggle('on');
      var checked = toggle.classList.contains('on');
      toggle.setAttribute('aria-checked', checked ? 'true' : 'false');
      var key = toggle.getAttribute('data-toggle-setting');
      if (key === 'maintenance' && checked) {
        window.toast('Maintenance mode will be turned on after you save settings.', 'info');
      }
    }
  });

  /* =================================================
     USERS
     ================================================= */
  var usersBody = document.getElementById('usersBody');

  function renderUsers() {
    var q = (document.getElementById('userSearch').value || '').trim().toLowerCase();
    var roleF = document.getElementById('userRoleFilter').value;
    var statusF = document.getElementById('userStatusFilter').value;

    var filtered = state.users.filter(function (u) {
      var okQ = !q || u.name.toLowerCase().indexOf(q) > -1 || u.email.toLowerCase().indexOf(q) > -1 || u.role.toLowerCase().indexOf(q) > -1;
      var okRole = roleF === 'all' || u.role === roleF;
      var okStatus = statusF === 'all' || u.status === statusF;
      return okQ && okRole && okStatus;
    });

    document.getElementById('userResultCount').textContent = 'Showing ' + filtered.length + ' users';

    if (!filtered.length) {
      usersBody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:50px;color:var(--text-3)"><div style="margin-bottom:10px">No users match your filters.</div><button class="btn btn-secondary btn-sm" data-clear-users>Clear filters</button></td></tr>';
      return;
    }

    usersBody.innerHTML = filtered.map(function (u) {
      return '<tr data-user-id="' + u.id + '">' +
        '<td><div class="user-cell"><span class="avatar" style="background:' + avatarColor(u.name) + '">' + initials(u.name) + '</span>' +
        '<div><div class="name">' + esc(u.name) + '</div><div class="email">' + esc(u.email) + '</div></div></div></td>' +
        '<td>' + roleBadge(u.role) + '</td>' +
        '<td><strong>' + u.projects + '</strong></td>' +
        '<td>' + statusBadge(u.status) + '</td>' +
        '<td>' + esc(u.joined) + '</td>' +
        '<td>' + timeAgo(u.lastActive) + '</td>' +
        '<td>' + actionMenu([
          { action: 'view-user', icon: 'eye', label: 'View user' },
          { action: 'edit-user', icon: 'edit', label: 'Edit user' },
          u.status === 'active' ? { action: 'suspend-user', icon: 'pause', label: 'Suspend account' } : { action: 'activate-user', icon: 'check', label: 'Activate account' },
          { divider: true },
          u.role === 'Admin' ? { action: 'demote-user', icon: 'users', label: 'Change role to User' } : { action: 'promote-user', icon: 'rocket', label: 'Change role to Admin' },
          { divider: true },
          { action: 'delete-user', icon: 'trash', label: 'Delete user', danger: true }
        ]) + '</td>' +
        '</tr>';
    }).join('');
  }

  document.getElementById('userSearch').addEventListener('input', renderUsers);
  document.getElementById('userRoleFilter').addEventListener('change', renderUsers);
  document.getElementById('userStatusFilter').addEventListener('change', renderUsers);

  function findUser(id) {
    for (var i = 0; i < state.users.length; i++) {
      if (state.users[i].id === id) return state.users[i];
    }
    return null;
  }

  usersBody.addEventListener('click', function (e) {
    var tr = e.target.closest('tr');
    if (!tr) return;
    var user = findUser(parseInt(tr.getAttribute('data-user-id'), 10));
    if (!user) return;
    var action = e.target.closest('[data-action]');
    if (!action) return;

    if (action.getAttribute('data-action') === 'view-user') {
      window.toast('Opening profile for ' + user.name + '…', 'info', { duration: 1600 });
      setTimeout(function () {
        window.toast(user.name + ' · ' + user.email + ' · Joined ' + user.joined + ' · ' + user.projects + ' projects', 'info', { duration: 4000 });
      }, 900);
    } else if (action.getAttribute('data-action') === 'edit-user') {
      window.toast('Editing user ' + user.name + '…', 'info', { duration: 1600 });
      setTimeout(function () {
        window.toast('User details updated (demo).', 'success');
      }, 900);
    } else if (action.getAttribute('data-action') === 'suspend-user') {
      confirmDialog({
        title: 'Suspend ' + user.name + '?',
        text: 'They will no longer be able to sign in, publish, or edit projects until reactivated.',
        confirmText: 'Suspend account',
        onConfirm: function () {
          user.status = 'suspended';
          renderUsers();
          updateUserCounts();
          window.toast(user.name + ' has been suspended.', 'success');
          state.activity.unshift({ id: Date.now(), event: 'User suspended', actor: 'Alex Doe', type: 'Admin', target: user.email, time: new Date().toISOString() });
        }
      });
    } else if (action.getAttribute('data-action') === 'activate-user') {
      user.status = 'active';
      renderUsers();
      updateUserCounts();
      window.toast(user.name + ' has been reactivated.', 'success');
    } else if (action.getAttribute('data-action') === 'promote-user') {
      user.role = 'Admin';
      renderUsers();
      window.toast(user.name + ' is now an Admin.', 'success');
      state.activity.unshift({ id: Date.now(), event: 'Admin action', actor: 'Alex Doe', type: 'Admin', target: 'Changed role for ' + user.email, time: new Date().toISOString() });
    } else if (action.getAttribute('data-action') === 'demote-user') {
      user.role = 'User';
      renderUsers();
      window.toast(user.name + ' is now a regular User.', 'success');
    } else if (action.getAttribute('data-action') === 'delete-user') {
      confirmDialog({
        title: 'Delete ' + user.name + '?',
        text: 'This permanently deletes their account and all ' + user.projects + ' associated projects. This cannot be undone.',
        confirmText: 'Delete user',
        onConfirm: function () {
          state.users = state.users.filter(function (u) { return u.id !== user.id; });
          renderUsers();
          updateUserCounts();
          window.toast(user.name + ' and their projects have been deleted.', 'error');
        }
      });
    }
  });

  usersBody.addEventListener('click', function (e) {
    if (e.target.closest('[data-clear-users]')) {
      document.getElementById('userSearch').value = '';
      document.getElementById('userRoleFilter').value = 'all';
      document.getElementById('userStatusFilter').value = 'all';
      renderUsers();
    }
  });

  function updateUserCounts() {
    var q = document.querySelector('[data-users-count]');
    if (q) q.textContent = state.users.reduce(function (s, u) { return s + 1; }, 0);
  }

  var inviteBtn = document.getElementById('inviteUserBtn');
  if (inviteBtn) {
    inviteBtn.addEventListener('click', function () {
      window.toast('Invite link copied to clipboard (demo).', 'success');
    });
  }

  /* =================================================
     PROJECTS
     ================================================= */
  var projectsBody = document.getElementById('projectsBody');
  var THUMB_CLASSES = ['thumb-1', 'thumb-2', 'thumb-3', 'thumb-4', 'thumb-5', 'thumb-6', 'thumb-7', 'thumb-8'];

  function renderProjects() {
    var q = (document.getElementById('projectSearch').value || '').trim().toLowerCase();
    var statusF = document.getElementById('projectStatusFilter').value;
    var typeF = document.getElementById('projectTypeFilter').value;

    var filtered = state.projects.filter(function (p) {
      var okQ = !q || p.name.toLowerCase().indexOf(q) > -1 || p.owner.toLowerCase().indexOf(q) > -1;
      var okStatus = statusF === 'all' || p.status === statusF;
      var okType = typeF === 'all' || p.type === typeF;
      return okQ && okStatus && okType;
    });

    document.getElementById('projectResultCount').textContent = 'Showing ' + filtered.length + ' projects';

    if (!filtered.length) {
      projectsBody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:50px;color:var(--text-3)">No projects match your filters.</td></tr>';
      return;
    }

    projectsBody.innerHTML = filtered.map(function (p) {
      state.projectThumbIndex = (state.projectThumbIndex + 1) % THUMB_CLASSES.length;
      var thumbClass = THUMB_CLASSES[state.projectThumbIndex];
      var statusText = p.status === 'Published' && !p.enabled ? 'Disabled' : p.status;
      return '<tr data-project-id="' + p.id + '">' +
        '<td><div class="project-cell">' +
        '<span class="thumb ' + thumbClass + '">' +
        '<span style="width:22px;height:22px;border-radius:6px;background:rgba(255,255,255,.95);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800">' + initials(p.name) + '</span>' +
        '</span>' +
        '<div><div class="name">' + esc(p.name) + '</div><div class="type">' + esc(p.type) + '</div></div></div></td>' +
        '<td>' + esc(p.owner) + '</td>' +
        '<td>' + esc(p.type) + '</td>' +
        '<td>' + statusBadge(statusText) + '</td>' +
        '<td>' + esc(p.created) + '</td>' +
        '<td>' + timeAgo(p.modified) + '</td>' +
        '<td>' + (p.views ? p.views.toLocaleString() : '0') + '</td>' +
        '<td>' + actionMenu([
          { action: 'view-project', icon: 'eye', label: 'View project' },
          p.enabled ? { action: 'disable-project', icon: 'pause', label: 'Disable project' } : { action: 'enable-project', icon: 'power', label: 'Enable project' },
          { divider: true },
          { action: 'delete-project', icon: 'trash', label: 'Delete project', danger: true }
        ]) + '</td>' +
        '</tr>';
    }).join('');
  }

  document.getElementById('projectSearch').addEventListener('input', renderProjects);
  document.getElementById('projectStatusFilter').addEventListener('change', renderProjects);
  document.getElementById('projectTypeFilter').addEventListener('change', renderProjects);

  function findProject(id) {
    for (var i = 0; i < state.projects.length; i++) {
      if (state.projects[i].id === id) return state.projects[i];
    }
    return null;
  }

  projectsBody.addEventListener('click', function (e) {
    var tr = e.target.closest('tr');
    if (!tr) return;
    var proj = findProject(parseInt(tr.getAttribute('data-project-id'), 10));
    if (!proj) return;
    var action = e.target.closest('[data-action]');
    if (!action) return;

    var a = action.getAttribute('data-action');

    if (a === 'view-project') {
      if (proj.status === 'Draft') {
        window.toast('Opening "' + proj.name + '" in the builder…', 'info', { duration: 1600 });
        setTimeout(function () {
          window.location.href = 'builder.html?project=' + encodeURIComponent(proj.name);
        }, 900);
      } else {
        window.location.href = 'builder.html?project=' + encodeURIComponent(proj.name);
      }
    } else if (a === 'disable-project') {
      confirmDialog({
        title: 'Disable "' + proj.name + '"?',
        text: 'If published, it will be taken offline immediately. Drafts will be locked until re-enabled.',
        confirmText: 'Disable project',
        onConfirm: function () {
          proj.enabled = false;
          renderProjects();
          window.toast('"' + proj.name + '" has been disabled.', 'success');
          state.activity.unshift({ id: Date.now(), event: 'Admin action', actor: 'Alex Doe', type: 'Admin', target: 'Disabled ' + proj.name, time: new Date().toISOString() });
        }
      });
    } else if (a === 'enable-project') {
      proj.enabled = true;
      renderProjects();
      window.toast('"' + proj.name + '" has been re-enabled.', 'success');
    } else if (a === 'delete-project') {
      confirmDialog({
        title: 'Delete "' + proj.name + '"?',
        text: 'The project and all its pages will be permanently removed. This cannot be undone.',
        confirmText: 'Delete project',
        onConfirm: function () {
          state.projects = state.projects.filter(function (p) { return p.id !== proj.id; });
          renderProjects();
          window.toast('"' + proj.name + '" has been deleted.', 'error');
        }
      });
    }
  });

  /* =================================================
     TEMPLATES
     ================================================= */
  var templatesGrid = document.getElementById('adminTemplatesGrid');

  function tplArt(layout, color) {
    var inner;
    if (layout === 'split' || layout === 'form') {
      inner = '<div class="t-nav"><i></i><span></span><span></span><span class="t-btn-nav"></span></div>' +
        '<div class="t-card"><div class="t-lines"><i></i><i></i></div><div class="t-btn2"></div></div>';
    } else if (layout === 'grid') {
      inner = '<div class="t-nav"><i></i><span></span><span></span><span class="t-btn-nav"></span></div>' +
        '<div class="t-card"><div class="t-lines"><i></i><i></i></div><div class="t-rows"><i></i><i></i><i></i></div></div>';
    } else {
      inner = '<div class="t-nav"><i></i><span></span><span></span><span class="t-btn-nav"></span></div>' +
        '<div class="t-card"><div class="t-lines"><i></i><i></i><i></i></div></div>';
    }
    return '<div class="tpl-art" style="--c1:' + color + ';--c2:' + color + '" data-layout="' + layout + '">' + inner + '</div>';
  }

  function renderTemplates() {
    var q = (document.getElementById('templateSearch').value || '').trim().toLowerCase();
    var catF = document.getElementById('templateCategoryFilter').value;
    var statusF = document.getElementById('templateStatusFilter').value;

    var filtered = state.templates.filter(function (t) {
      var okQ = !q || t.name.toLowerCase().indexOf(q) > -1 || t.category.toLowerCase().indexOf(q) > -1;
      var okCat = catF === 'all' || t.category === catF;
      var okStatus = statusF === 'all' || (statusF === 'enabled' && t.enabled) || (statusF === 'disabled' && !t.enabled);
      return okQ && okCat && okStatus;
    });

    document.getElementById('templateResultCount').textContent = 'Showing ' + filtered.length + ' templates';

    if (!filtered.length) {
      templatesGrid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><svg class="icon" style="width:36px;height:36px"><use href="#i-templates"></use></svg><h3>No templates found</h3><p style="margin-top:6px">Try adjusting your search or filters.</p></div>';
      return;
    }

    templatesGrid.innerHTML = filtered.map(function (t) {
      return '<div class="admin-tpl-card" data-tpl-id="' + t.id + '">' +
        '<div class="admin-tpl-preview"><div class="tpl-art" style="--c1:' + t.color + ';--c2:' + t.color + '" data-layout="' + t.layout + '">' +
        '<div class="t-nav"><i></i><span></span><span></span><span class="t-btn-nav"></span></div>' +
        '<div class="t-card"><div class="t-lines"><i></i><i></i></div>' + (t.layout === 'grid' ? '<div class="t-rows"><i></i><i></i><i></i></div>' : (t.layout === 'form' ? '<div class="t-rows"><i></i><i></i></div>' : '')) + '</div>' +
        '</div>' +
        '<div class="tpl-overlay">' +
        '<button class="btn btn-white btn-sm" data-tpl-action="view" data-tpl-id="' + t.id + '">' + icon('eye') + ' View</button>' +
        '<button class="btn btn-primary btn-sm" data-tpl-action="edit" data-tpl-id="' + t.id + '">' + icon('edit') + ' Edit</button>' +
        '</div></div>' +
        '<div class="admin-tpl-meta">' +
        '<div class="admin-tpl-status"><h3>' + esc(t.name) + '</h3><span class="badge">' + esc(t.category) + '</span></div>' +
        '<p>' + esc(t.desc) + '</p>' +
        '</div>' +
        '<div class="admin-tpl-footer">' +
        '<div style="display:flex;gap:6px;align-items:center">' +
        (t.enabled ? '<span class="badge badge-success"><span class="badge-dot"></span> Enabled</span>' : '<span class="badge badge-danger"><span class="badge-dot"></span> Disabled</span>') +
        (t.featured ? '<span class="badge badge-primary">' + icon('star', '') + ' Featured</span>' : '') +
        '</div>' +
        '<div style="display:flex;gap:4px">' +
        '<button class="icon-btn" style="width:30px;height:30px" data-tpl-action="toggle" data-tpl-id="' + t.id + '" aria-label="Toggle enabled">' + icon('power') + '</button>' +
        '<button class="icon-btn" style="width:30px;height:30px" data-tpl-action="feature" data-tpl-id="' + t.id + '" aria-label="Toggle featured">' + icon('star') + '</button>' +
        '<button class="icon-btn" style="width:30px;height:30px;color:var(--danger)" data-tpl-action="delete" data-tpl-id="' + t.id + '" aria-label="Delete template">' + icon('trash') + '</button>' +
        '</div>' +
        '</div>' +
        '</div>';
    }).join('');
  }

  document.getElementById('templateSearch').addEventListener('input', renderTemplates);
  document.getElementById('templateCategoryFilter').addEventListener('change', renderTemplates);
  document.getElementById('templateStatusFilter').addEventListener('change', renderTemplates);

  function findTemplate(id) {
    for (var i = 0; i < state.templates.length; i++) {
      if (state.templates[i].id === id) return state.templates[i];
    }
    return null;
  }

  templatesGrid.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-tpl-action]');
    if (!btn) return;
    var tpl = findTemplate(parseInt(btn.getAttribute('data-tpl-id'), 10));
    if (!tpl) return;
    var action = btn.getAttribute('data-tpl-action');

    if (action === 'view') {
      window.toast('Opening "' + tpl.name + '" preview…', 'info', { duration: 1600 });
      setTimeout(function () {
        window.location.href = 'builder.html?template=' + encodeURIComponent(tpl.name);
      }, 900);
    } else if (action === 'edit') {
      openTemplateModal(tpl.id);
    } else if (action === 'toggle') {
      tpl.enabled = !tpl.enabled;
      renderTemplates();
      window.toast('"' + tpl.name + '" ' + (tpl.enabled ? 'enabled' : 'disabled') + '.', 'success');
    } else if (action === 'feature') {
      tpl.featured = !tpl.featured;
      renderTemplates();
      window.toast('"' + tpl.name + '" ' + (tpl.featured ? 'marked as Featured' : 'removed from Featured') + '.', 'success');
    } else if (action === 'delete') {
      confirmDialog({
        title: 'Delete "' + tpl.name + '"?',
        text: 'Users will no longer be able to start projects from this template.',
        confirmText: 'Delete template',
        onConfirm: function () {
          state.templates = state.templates.filter(function (t) { return t.id !== tpl.id; });
          renderTemplates();
          window.toast('"' + tpl.name + '" has been deleted.', 'error');
          state.activity.unshift({ id: Date.now(), event: 'Admin action', actor: 'Alex Doe', type: 'Admin', target: 'Deleted template ' + tpl.name, time: new Date().toISOString() });
        }
      });
    }
  });

  /* ---------- Add / edit template modal ---------- */
  var tplAccentDots = document.querySelectorAll('#tplAccentDots .color-dot');
  var tplThumbOpts = document.querySelectorAll('#tplThumbOptions .proj-thumb-opt');

  function resetTemplateModal() {
    document.getElementById('tplId').value = '';
    document.getElementById('tplName').value = '';
    document.getElementById('tplDesc').value = '';
    document.getElementById('tplCategory').selectedIndex = 0;
    tplAccentDots.forEach(function (d) { d.classList.remove('active'); });
    tplAccentDots[0].classList.add('active');
    document.getElementById('tplAccent').value = '#6366f1';
    tplThumbOpts.forEach(function (o) { o.classList.remove('active'); });
    tplThumbOpts[0].classList.add('active');
    document.getElementById('tplLayout').value = 'hero';
    var feat = document.querySelector('[data-toggle-setting="tplFeatured"]');
    feat.classList.remove('on');
    feat.setAttribute('aria-checked', 'false');
  }

  function openTemplateModal(id) {
    var tpl = findTemplate(id);
    document.getElementById('addTemplateModalTitle').textContent = 'Edit Template';
    document.getElementById('tplId').value = tpl.id;
    document.getElementById('tplName').value = tpl.name;
    document.getElementById('tplDesc').value = tpl.desc;
    document.getElementById('tplCategory').value = tpl.category;
    tplAccentDots.forEach(function (d) {
      d.classList.toggle('active', d.getAttribute('data-color') === tpl.color);
    });
    document.getElementById('tplAccent').value = tpl.color;
    tplThumbOpts.forEach(function (o) {
      var layout = o.querySelector('.min-label').textContent.toLowerCase();
      o.classList.toggle('active', layout === tpl.layout);
    });
    document.getElementById('tplLayout').value = tpl.layout;
    var feat = document.querySelector('[data-toggle-setting="tplFeatured"]');
    feat.classList.toggle('on', tpl.featured);
    feat.setAttribute('aria-checked', tpl.featured ? 'true' : 'false');
    document.getElementById('addTemplateModal').classList.add('open');
  }

  tplAccentDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      tplAccentDots.forEach(function (d) { d.classList.remove('active'); });
      dot.classList.add('active');
      document.getElementById('tplAccent').value = dot.getAttribute('data-color');
    });
  });

  tplThumbOpts.forEach(function (opt) {
    opt.addEventListener('click', function () {
      tplThumbOpts.forEach(function (o) { o.classList.remove('active'); });
      opt.classList.add('active');
      document.getElementById('tplLayout').value = opt.querySelector('.min-label').textContent.toLowerCase();
    });
  });

  var addTemplateBtn = document.getElementById('addTemplateBtn');
  if (addTemplateBtn) {
    addTemplateBtn.addEventListener('click', function () {
      resetTemplateModal();
      document.getElementById('addTemplateModalTitle').textContent = 'Add Template';
      document.getElementById('addTemplateModal').classList.add('open');
    });
  }

  var templateForm = document.getElementById('templateForm');
  templateForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('tplName').value.trim();
    if (!name) {
      window.toast('Give the template a name.', 'error');
      return;
    }
    var id = document.getElementById('tplId').value;
    var featured = document.querySelector('[data-toggle-setting="tplFeatured"]').classList.contains('on');
    if (id) {
      var tpl = findTemplate(parseInt(id, 10));
      if (tpl) {
        tpl.name = name;
        tpl.desc = document.getElementById('tplDesc').value.trim();
        tpl.category = document.getElementById('tplCategory').value;
        tpl.color = document.getElementById('tplAccent').value;
        tpl.layout = document.getElementById('tplLayout').value;
        tpl.featured = featured;
      }
      window.toast('Template updated successfully.', 'success');
      state.activity.unshift({ id: Date.now(), event: 'Template edited', actor: 'Alex Doe', type: 'Template', target: name, time: new Date().toISOString() });
    } else {
      state.templates.push({
        id: state.tplSequence++,
        name: name,
        desc: document.getElementById('tplDesc').value.trim(),
        category: document.getElementById('tplCategory').value,
        color: document.getElementById('tplAccent').value,
        layout: document.getElementById('tplLayout').value,
        featured: featured,
        enabled: true
      });
      window.toast('"' + name + '" added to the template library.', 'success');
      state.activity.unshift({ id: Date.now(), event: 'Template created', actor: 'Alex Doe', type: 'Template', target: name, time: new Date().toISOString() });
    }
    document.getElementById('addTemplateModal').classList.remove('open');
    renderTemplates();
  });

  document.addEventListener('click', function (e) {
    var closeBtn = e.target.closest('[data-modal-close]');
    if (closeBtn) {
      var overlay = closeBtn.closest('.modal-overlay');
      if (overlay) overlay.classList.remove('open');
    }
  });

  /* =================================================
     REPORTS
     ================================================= */
  var reportsList = document.getElementById('reportsList');

  function renderReports() {
    var q = (document.getElementById('reportSearch').value || '').trim().toLowerCase();
    var statusF = document.getElementById('reportStatusFilter').value;

    var filtered = state.reports.filter(function (r) {
      var okQ = !q || r.project.toLowerCase().indexOf(q) > -1 || r.reporter.toLowerCase().indexOf(q) > -1 || r.reason.toLowerCase().indexOf(q) > -1;
      var okStatus = statusF === 'all' || r.status === statusF;
      return okQ && okStatus;
    });

    document.getElementById('reportResultCount').textContent = 'Showing ' + filtered.length + ' reports';

    if (!filtered.length) {
      reportsList.innerHTML = '<div class="empty-state"><svg class="icon" style="width:36px;height:36px"><use href="#i-flag"></use></svg><h3>No reports found</h3><p style="margin-top:6px">All caught up.</p></div>';
      return;
    }

    reportsList.innerHTML = filtered.map(function (r) {
      return '<div class="report-item" data-report-id="' + r.id + '">' +
        '<div class="report-icon">' + icon('flag') + '</div>' +
        '<div class="report-body">' +
        '<h4>' + esc(r.project) + '</h4>' +
        '<p><strong>' + esc(r.reason) + '</strong> — ' + esc(r.detail) + '</p>' +
        '<div class="report-meta">' +
        '<span><strong>Reporter:</strong> ' + esc(r.reporter) + '</span>' +
        '<span>' + new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + '</span>' +
        statusBadge(r.status) +
        '</div>' +
        '</div>' +
        '<div class="report-actions">' +
        (r.status === 'Pending' ? '<button class="btn btn-secondary btn-sm" data-report-action="review" data-report-id="' + r.id + '">' + icon('eye') + ' Review details</button>' : '') +
        (r.status === 'Pending' || r.status === 'Reviewed' ? '<button class="btn btn-ghost btn-sm" data-report-action="dismiss" data-report-id="' + r.id + '">Dismiss</button>' : '') +
        (r.status === 'Pending' ? '<button class="btn btn-danger btn-sm" data-report-action="remove" data-report-id="' + r.id + '">' + icon('trash') + ' Remove project</button>' : '') +
        '</div>' +
        '</div>';
    }).join('');
  }

  document.getElementById('reportSearch').addEventListener('input', renderReports);
  document.getElementById('reportStatusFilter').addEventListener('change', renderReports);

  function findReport(id) {
    for (var i = 0; i < state.reports.length; i++) {
      if (state.reports[i].id === id) return state.reports[i];
    }
    return null;
  }

  reportsList.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-report-action]');
    if (!btn) return;
    var report = findReport(parseInt(btn.getAttribute('data-report-id'), 10));
    if (!report) return;
    var action = btn.getAttribute('data-report-action');

    if (action === 'review') {
      window.toast('Reviewing "' + report.project + '" report…', 'info', { duration: 1600 });
      setTimeout(function () {
        window.toast(report.reason + ' · Reported by ' + report.reporter, 'info', { duration: 4000 });
      }, 900);
    } else if (action === 'dismiss') {
      confirmDialog({
        title: 'Dismiss this report?',
        text: 'No action will be taken against "' + report.project + '".',
        confirmText: 'Dismiss report',
        tone: 'warn',
        onConfirm: function () {
          report.status = 'Dismissed';
          renderReports();
          updateReportBadge();
          window.toast('Report for "' + report.project + '" dismissed.', 'success');
        }
      });
    } else if (action === 'remove') {
      confirmDialog({
        title: 'Remove "' + report.project + '"?',
        text: 'The project will be taken down immediately and the owner notified.',
        confirmText: 'Remove project',
        onConfirm: function () {
          report.status = 'Reviewed';
          state.projects = state.projects.filter(function (p) { return p.name !== report.project; });
          renderReports();
          updateReportBadge();
          window.toast('"' + report.project + '" has been removed.', 'error');
          state.activity.unshift({ id: Date.now(), event: 'Admin action', actor: 'Alex Doe', type: 'Admin', target: 'Removed project ' + report.project, time: new Date().toISOString() });
        }
      });
    }
  });

  function updateReportBadge() {
    var count = state.reports.filter(function (r) { return r.status === 'Pending'; }).length;
    var badge = document.getElementById('reportsBadge');
    if (badge) badge.textContent = count;
  }

  /* =================================================
     SYSTEM ACTIVITY
     ================================================= */
  var activityBody = document.getElementById('activityBody');

  function renderActivity() {
    var q = (document.getElementById('activitySearch').value || '').trim().toLowerCase();
    var typeF = document.getElementById('activityTypeFilter').value;

    var filtered = state.activity.filter(function (a) {
      var okQ = !q || a.event.toLowerCase().indexOf(q) > -1 || a.actor.toLowerCase().indexOf(q) > -1 || a.target.toLowerCase().indexOf(q) > -1;
      var okType = typeF === 'all' || a.type === typeF;
      return okQ && okType;
    });

    document.getElementById('activityResultCount').textContent = 'Showing ' + filtered.length + ' events';

    if (!filtered.length) {
      activityBody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:50px;color:var(--text-3)">No activity matches your filters.</td></tr>';
      return;
    }

    activityBody.innerHTML = filtered.map(function (a) {
      var typeColor = a.type === 'Admin' ? 'var(--danger)' : a.type === 'User' ? 'var(--primary)' : a.type === 'Template' ? 'var(--warning)' : 'var(--info)';
      return '<tr>' +
        '<td><div class="user-cell"><span class="avatar" style="background:' + typeColor + '">' + icon('dot') + '</span><div><div class="name">' + esc(a.event) + '</div></div></div></td>' +
        '<td>' + esc(a.actor) + '</td>' +
        '<td>' + roleBadge(a.type) + '</td>' +
        '<td>' + esc(a.target) + '</td>' +
        '<td>' + timeAgo(a.time) + '<div style="font-size:12px;color:var(--text-3)">' + new Date(a.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + '</div></td>' +
        '</tr>';
    }).join('');
  }

  document.getElementById('activitySearch').addEventListener('input', renderActivity);
  document.getElementById('activityTypeFilter').addEventListener('change', renderActivity);

  document.getElementById('clearActivityFilter').addEventListener('click', function () {
    document.getElementById('activitySearch').value = '';
    document.getElementById('activityTypeFilter').value = 'all';
    renderActivity();
  });

  /* =================================================
     SETTINGS
     ================================================= */
  var saveSettingsBtn = document.getElementById('saveSettingsBtn');
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', function () {
      var name = document.getElementById('settingsPlatformName').value.trim();
      saveSettingsBtn.disabled = true;
      saveSettingsBtn.innerHTML = icon('clock') + ' Saving…';
      setTimeout(function () {
        saveSettingsBtn.disabled = false;
        saveSettingsBtn.innerHTML = icon('save') + ' Save settings';
        window.toast('Platform settings saved successfully.', 'success');
        state.activity.unshift({ id: Date.now(), event: 'Admin action', actor: 'Alex Doe', type: 'Admin', target: 'Updated platform settings' + (name ? ' · ' + name : ''), time: new Date().toISOString() });
      }, 1200);
    });
  }

  document.getElementById('resetSettingsBtn').addEventListener('click', function () {
    confirmDialog({
      title: 'Reset all settings?',
      text: 'All platform settings will return to their default values.',
      confirmText: 'Reset settings',
      tone: 'warn',
      onConfirm: function () {
        document.getElementById('settingsPlatformName').value = 'Nimbus';
        document.getElementById('settingsDefaultProjects').value = 10;
        document.getElementById('settingsDefaultPages').value = 5;
        document.getElementById('settingsDefaultRole').selectedIndex = 0;
        document.getElementById('settingsMaxUpload').value = 50;
        document.getElementById('settingsSupportEmail').value = 'support@nimbus.app';
        document.querySelectorAll('[data-toggle-setting]').forEach(function (t) {
          var key = t.getAttribute('data-toggle-setting');
          if (key === 'maintenance' || key === 'approval' || key === 'tplFeatured') {
            t.classList.remove('on');
            t.setAttribute('aria-checked', 'false');
          } else {
            t.classList.add('on');
            t.setAttribute('aria-checked', 'true');
          }
        });
        window.toast('Settings reset to defaults.', 'success');
      }
    });
  });

  /* =================================================
     Topbar extras
     ================================================= */
  document.getElementById('adminBell').addEventListener('click', function () {
    window.toast('3 new platform notifications', 'info');
  });

  document.getElementById('adminLogout').addEventListener('click', function () {
    window.toast('Signing out…', 'info', { duration: 1200 });
    setTimeout(function () {
      window.location.href = 'index.html';
    }, 1400);
  });

  var globalSearch = document.getElementById('adminGlobalSearch');
  if (globalSearch) {
    globalSearch.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var q = globalSearch.value.trim().toLowerCase();
        if (!q) return;
        var hit = null;
        state.users.forEach(function (u) {
          if (u.name.toLowerCase().indexOf(q) > -1 || u.email.toLowerCase().indexOf(q) > -1) hit = { section: 'users', label: 'User ' + u.name };
        });
        if (!hit) {
          state.projects.forEach(function (p) {
            if (p.name.toLowerCase().indexOf(q) > -1) hit = { section: 'projects', label: 'Project ' + p.name };
          });
        }
        if (!hit) {
          state.templates.forEach(function (t) {
            if (t.name.toLowerCase().indexOf(q) > -1) hit = { section: 'templates', label: 'Template ' + t.name };
          });
        }
        if (hit) {
          showSection(hit.section);
          window.toast('Found: ' + hit.label, 'success');
        } else {
          window.toast('No results found for "' + q + '".', 'info');
        }
      }
    });
  }

  document.getElementById('refreshBtn').addEventListener('click', function () {
    var btn = this;
    btn.disabled = true;
    var original = btn.innerHTML;
    btn.innerHTML = icon('clock') + ' Refreshing…';
    setTimeout(function () {
      btn.disabled = false;
      btn.innerHTML = original;
      window.toast('Dashboard data refreshed.', 'success');
    }, 1200);
  });

  /* ---------- Init ---------- */
  renderUsers();
  renderProjects();
  renderTemplates();
  renderReports();
  renderActivity();
  updateReportBadge();
  updateUserCounts();
})();