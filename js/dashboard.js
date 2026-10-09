/* ============================================
   FitLife - Dashboard Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  // Protect page
  if (typeof requireAuth === 'function') {
    requireAuth();
  }

  // Load user info when auth is ready
  if (typeof auth !== 'undefined') {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        updateDashboard(user);
      }
    });
  } else {
    // Demo mode without Firebase
    updateDashboard({ displayName: 'Guest User', email: 'guest@fitlife.com' });
  }
});

function updateDashboard(user) {
  const nameEl = document.getElementById('dashUserName');
  const emailEl = document.getElementById('dashUserEmail');

  if (nameEl) nameEl.textContent = user.displayName || 'Fitness Enthusiast';
  if (emailEl) emailEl.textContent = user.email || '';

  // Favorites count
  try {
    const favs = JSON.parse(localStorage.getItem('fitlife-favorites') || '[]');
    const favCountEl = document.getElementById('favCount');
    if (favCountEl) favCountEl.textContent = favs.length;
  } catch (e) {
    // ignore
  }
}
