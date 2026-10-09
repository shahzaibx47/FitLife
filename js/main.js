/* ============================================
   FitLife - Main JavaScript
   Handles: Navbar, Theme Toggle, Auth State UI
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  initTheme();
  initNavbar();
  initAuthUI();
  initProtectedNavigation();
  preserveAuthDestination();
});

/* ---- Theme Toggle ---- */
function initTheme() {
  const savedTheme = localStorage.getItem('fitlife-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  const toggleBtn = document.getElementById('themeToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('fitlife-theme', next);
      updateThemeIcon(next);
    });
  }
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('themeToggle');
  if (toggleBtn) {
    toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    toggleBtn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }
}

/* ---- Navbar ---- */
function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.querySelector('.navbar');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // Navbar scroll effect
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Highlight active page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
}

/* ---- Auth State UI ---- */
function initAuthUI() {
  // Wait for Firebase to be ready
  if (typeof firebase === 'undefined' || typeof auth === 'undefined') {
    // Firebase not loaded (or config not set) - show guest UI
    showGuestUI();
    return;
  }

  auth.onAuthStateChanged(function (user) {
    if (user) {
      showLoggedInUI(user);
    } else {
      showGuestUI();
    }
  });
}

function showLoggedInUI(user) {
  // Desktop auth buttons
  const authGuest = document.getElementById('authGuest');
  const authUser = document.getElementById('authUser');
  if (authGuest) authGuest.classList.add('hidden');
  if (authUser) authUser.classList.remove('hidden');

  // Mobile auth
  const mobileGuest = document.getElementById('mobileAuthGuest');
  const mobileUser = document.getElementById('mobileAuthUser');
  if (mobileGuest) mobileGuest.classList.add('hidden');
  if (mobileUser) mobileUser.classList.remove('hidden');

  // Set user name if available
  const userNameEls = document.querySelectorAll('.user-display-name');
  userNameEls.forEach(function (el) {
    el.textContent = user.displayName || user.email || 'User';
  });
}

function showGuestUI() {
  const authGuest = document.getElementById('authGuest');
  const authUser = document.getElementById('authUser');
  if (authGuest) authGuest.classList.remove('hidden');
  if (authUser) authUser.classList.add('hidden');

  const mobileGuest = document.getElementById('mobileAuthGuest');
  const mobileUser = document.getElementById('mobileAuthUser');
  if (mobileGuest) mobileGuest.classList.remove('hidden');
  if (mobileUser) mobileUser.classList.add('hidden');
}

/* ---- Logout ---- */
function handleLogout() {
  if (typeof auth === 'undefined') {
    window.location.href = 'login.html';
    return;
  }
  auth.signOut().then(function () {
    window.location.href = 'login.html';
  }).catch(function (error) {
    console.error('Logout error:', error);
    alert('Error logging out. Please try again.');
  });
}

/* ---- Utility: Protect page (redirect if not logged in) ---- */
function requireAuth() {
  if (typeof auth === 'undefined') {
    window.location.href = 'login.html?next=' + encodeURIComponent(window.location.pathname.split('/').pop() + window.location.search);
    return;
  }
  auth.onAuthStateChanged(function (user) {
    if (!user) {
      const next = window.location.pathname.split('/').pop() + window.location.search;
      window.location.replace('login.html?next=' + encodeURIComponent(next));
    }
  });
}

function initProtectedNavigation() {
  const protectedPages = ['workouts.html','exercise-details.html','bmi.html','favorites.html','dashboard.html'];
  document.querySelectorAll('a[href]').forEach(function (link) {
    const raw = link.getAttribute('href') || '';
    const target = raw.split('?')[0];
    if (!protectedPages.includes(target)) return;
    link.classList.add('protected-link');
    link.addEventListener('click', function (event) {
      if (typeof auth === 'undefined') { event.preventDefault(); window.location.href = 'login.html?next=' + encodeURIComponent(raw); return; }
      if (!auth.currentUser) { event.preventDefault(); window.location.href = 'login.html?next=' + encodeURIComponent(raw); }
    });
  });
  const page = window.location.pathname.split('/').pop();
  if (protectedPages.includes(page)) requireAuth();
}

/* ---- Utility: Show alert ---- */
function showAlert(elementId, message, type) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.className = 'alert alert-' + type + ' show';
  setTimeout(function () {
    el.classList.remove('show');
  }, 5000);
}

function preserveAuthDestination() {
  const params = new URLSearchParams(window.location.search);
  const next = params.get('next');
  if (!next) return;
  document.querySelectorAll('a[href="login.html"], a[href="signup.html"]').forEach(function (link) {
    link.href = link.getAttribute('href') + '?next=' + encodeURIComponent(next);
  });
}
