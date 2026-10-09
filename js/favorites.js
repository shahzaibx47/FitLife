/* ============================================
   FitLife - Favorites Page Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  // Protect page if auth is available
  if (typeof requireAuth === 'function') {
    requireAuth();
  }
  loadFavorites();
});

function loadFavorites() {
  const container = document.getElementById('favoritesGrid');
  if (!container) return;

  const favIds = getFavorites();

  if (favIds.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">🤍</div>
        <h3>No favorites yet</h3>
        <p>Browse exercises and tap the heart icon to save your favorites.</p>
        <a href="exercises.html" class="btn btn-primary mt-20">Browse Exercises</a>
      </div>
    `;
    return;
  }

  container.innerHTML = '<div class="spinner"></div>';

  fetch('data/exercises.json')
    .then(function (res) { return res.json(); })
    .then(function (exercises) {
      const favExercises = exercises.filter(function (ex) {
        return favIds.includes(ex.id);
      });

      if (favExercises.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="icon">🤍</div>
            <h3>No favorites yet</h3>
            <p>Browse exercises and tap the heart icon to save your favorites.</p>
            <a href="exercises.html" class="btn btn-primary mt-20">Browse Exercises</a>
          </div>
        `;
        return;
      }

      let html = '';
      favExercises.forEach(function (ex) {
        const diffBadge = ex.difficulty === 'Beginner' ? 'badge-success' :
          ex.difficulty === 'Intermediate' ? 'badge-warning' : 'badge-primary';

        html += `
          <div class="card fade-in">
            <img src="${ex.image}" alt="${ex.name}" class="card-img" loading="lazy"
                 onerror="this.src='https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop'">
            <div class="card-body">
              <div style="display:flex;justify-content:space-between;align-items:start;">
                <h3>${ex.name}</h3>
                <button class="fav-btn active" onclick="removeFavorite(${ex.id})" title="Remove from Favorites">❤️</button>
              </div>
              <div class="card-meta">
                <span class="badge badge-info">${ex.category}</span>
                <span class="badge ${diffBadge}">${ex.difficulty}</span>
              </div>
              <div class="card-info">
                <span>🎯 ${ex.target}</span>
                <span>🛠️ ${ex.equipment}</span>
              </div>
              <div class="card-actions">
                <a href="exercise-details.html?id=${ex.id}" class="btn btn-primary btn-sm">View Details</a>
              </div>
            </div>
          </div>
        `;
      });
      container.innerHTML = html;
    })
    .catch(function (err) {
      console.error(err);
      container.innerHTML = '<div class="empty-state"><div class="icon">⚠️</div><h3>Failed to load favorites</h3></div>';
    });
}

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('fitlife-favorites') || '[]');
  } catch (e) {
    return [];
  }
}

function removeFavorite(id) {
  let favs = getFavorites();
  favs = favs.filter(function (fid) { return fid !== id; });
  localStorage.setItem('fitlife-favorites', JSON.stringify(favs));
  loadFavorites();
}
