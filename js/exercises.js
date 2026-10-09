/* ============================================
   FitLife - Exercises Page Logic
   Search, Filter, Favorites, Render Cards
   ============================================ */

let allExercises = [];

document.addEventListener('DOMContentLoaded', function () {
  loadExercises();

  const searchInput = document.getElementById('searchExercises');
  const categoryFilter = document.getElementById('categoryFilter');
  const difficultyFilter = document.getElementById('difficultyFilter');

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
  if (difficultyFilter) difficultyFilter.addEventListener('change', applyFilters);
});

function loadExercises() {
  const container = document.getElementById('exercisesGrid');
  if (!container) return;

  container.innerHTML = '<div class="spinner"></div>';

  fetch('data/exercises.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      allExercises = data;
      renderExercises(allExercises);
    })
    .catch(function (err) {
      console.error('Error loading exercises:', err);
      container.innerHTML = '<div class="empty-state"><div class="icon">⚠️</div><h3>Failed to load exercises</h3><p>Please try again later.</p></div>';
    });
}

function applyFilters() {
  const search = (document.getElementById('searchExercises') || {}).value || '';
  const category = (document.getElementById('categoryFilter') || {}).value || '';
  const difficulty = (document.getElementById('difficultyFilter') || {}).value || '';

  let filtered = allExercises.filter(function (ex) {
    const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.target.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !category || ex.category === category;
    const matchDifficulty = !difficulty || ex.difficulty === difficulty;
    return matchSearch && matchCategory && matchDifficulty;
  });

  renderExercises(filtered);
}

function renderExercises(exercises) {
  const container = document.getElementById('exercisesGrid');
  if (!container) return;

  if (exercises.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="icon">🔍</div><h3>No exercises found</h3><p>Try adjusting your search or filters.</p></div>';
    return;
  }

  const favorites = getFavorites();

  let html = '';
  exercises.forEach(function (ex) {
    const isFav = favorites.includes(ex.id);
    const diffBadge = ex.difficulty === 'Beginner' ? 'badge-success' :
      ex.difficulty === 'Intermediate' ? 'badge-warning' : 'badge-primary';

    html += `
      <div class="card fade-in">
        <img src="${ex.image}" alt="${ex.name}" class="card-img" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop'">
        <div class="card-body">
          <div style="display:flex;justify-content:space-between;align-items:start;">
            <h3>${ex.name}</h3>
            <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${ex.id}, this)" title="Add to Favorites">
              ${isFav ? '❤️' : '🤍'}
            </button>
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
}

/* ---- Favorites helpers (shared) ---- */
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('fitlife-favorites') || '[]');
  } catch (e) {
    return [];
  }
}

function saveFavorites(favs) {
  localStorage.setItem('fitlife-favorites', JSON.stringify(favs));
}

function toggleFavorite(id, btn) {
  let favs = getFavorites();
  const index = favs.indexOf(id);

  if (index > -1) {
    favs.splice(index, 1);
    if (btn) {
      btn.classList.remove('active');
      btn.textContent = '🤍';
    }
  } else {
    favs.push(id);
    if (btn) {
      btn.classList.add('active');
      btn.textContent = '❤️';
    }
  }
  saveFavorites(favs);
}
