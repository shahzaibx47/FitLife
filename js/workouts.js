/* ============================================
   FitLife - Workouts Page Logic
   Search, Filter, Sort, Render Cards
   ============================================ */

let allWorkouts = [];

document.addEventListener('DOMContentLoaded', function () {
  loadWorkouts();

  const searchInput = document.getElementById('searchWorkouts');
  const categoryFilter = document.getElementById('categoryFilter');
  const difficultyFilter = document.getElementById('difficultyFilter');
  const sortFilter = document.getElementById('sortFilter');

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
  if (difficultyFilter) difficultyFilter.addEventListener('change', applyFilters);
  if (sortFilter) sortFilter.addEventListener('change', applyFilters);
});

function loadWorkouts() {
  const container = document.getElementById('workoutsGrid');
  if (!container) return;

  container.innerHTML = '<div class="spinner"></div>';

  fetch('data/workouts.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      allWorkouts = data;
      renderWorkouts(allWorkouts);
    })
    .catch(function (err) {
      console.error('Error loading workouts:', err);
      container.innerHTML = '<div class="empty-state"><div class="icon">⚠️</div><h3>Failed to load workouts</h3><p>Please try again later.</p></div>';
    });
}

function applyFilters() {
  const search = (document.getElementById('searchWorkouts') || {}).value || '';
  const category = (document.getElementById('categoryFilter') || {}).value || '';
  const difficulty = (document.getElementById('difficultyFilter') || {}).value || '';
  const sort = (document.getElementById('sortFilter') || {}).value || '';

  let filtered = allWorkouts.filter(function (w) {
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.target.toLowerCase().includes(search.toLowerCase()) ||
      w.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !category || w.category === category;
    const matchDifficulty = !difficulty || w.difficulty === difficulty;
    return matchSearch && matchCategory && matchDifficulty;
  });

  // Sort
  if (sort === 'name-asc') {
    filtered.sort(function (a, b) { return a.name.localeCompare(b.name); });
  } else if (sort === 'name-desc') {
    filtered.sort(function (a, b) { return b.name.localeCompare(a.name); });
  } else if (sort === 'duration') {
    filtered.sort(function (a, b) {
      return parseInt(a.duration) - parseInt(b.duration);
    });
  } else if (sort === 'calories') {
    filtered.sort(function (a, b) { return b.calories - a.calories; });
  }

  renderWorkouts(filtered);
}

function renderWorkouts(workouts) {
  const container = document.getElementById('workoutsGrid');
  if (!container) return;

  if (workouts.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="icon">🔍</div><h3>No workouts found</h3><p>Try adjusting your search or filters.</p></div>';
    return;
  }

  let html = '';
  workouts.forEach(function (w) {
    const diffBadge = w.difficulty === 'Beginner' ? 'badge-success' :
      w.difficulty === 'Intermediate' ? 'badge-warning' : 'badge-primary';

    html += `
      <div class="card fade-in">
        <img src="${w.image}" alt="${w.name}" class="card-img" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop'">
        <div class="card-body">
          <h3>${w.name}</h3>
          <div class="card-meta">
            <span class="badge badge-primary">${w.category}</span>
            <span class="badge ${diffBadge}">${w.difficulty}</span>
          </div>
          <div class="card-info">
            <span>⏱️ ${w.duration}</span>
            <span>🎯 ${w.target}</span>
            <span>🔥 ${w.calories} cal</span>
          </div>
          <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:15px;">${w.description}</p>
          <div class="card-actions">
            <a href="exercises.html" class="btn btn-primary btn-sm">View Workout</a>
          </div>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}
