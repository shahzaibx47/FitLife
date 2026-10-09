/* ============================================
   FitLife - Authentication Logic
   Signup, Login, Validation
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');

  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Password visibility toggles
  document.querySelectorAll('.password-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const input = this.parentElement.querySelector('input');
      if (input.type === 'password') {
        input.type = 'text';
        this.textContent = '🙈';
      } else {
        input.type = 'password';
        this.textContent = '👁️';
      }
    });
  });
});

/* ---- Signup ---- */
function handleSignup(e) {
  e.preventDefault();

  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const alertEl = document.getElementById('authAlert');
  const loadingEl = document.getElementById('authLoading');
  const submitBtn = document.getElementById('authSubmitBtn');

  // Validation
  if (!fullName || !email || !password || !confirmPassword) {
    showAuthAlert(alertEl, 'Please fill in all fields.', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showAuthAlert(alertEl, 'Please enter a valid email address.', 'error');
    return;
  }

  if (password.length < 6) {
    showAuthAlert(alertEl, 'Password must be at least 6 characters.', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showAuthAlert(alertEl, 'Passwords do not match.', 'error');
    return;
  }

  // Check if Firebase is configured
  if (typeof auth === 'undefined' || firebaseConfig.apiKey === 'YOUR_API_KEY') {
    showAuthAlert(alertEl, 'Firebase is not configured. Please add your Firebase credentials in js/firebase-config.js', 'error');
    return;
  }

  // Show loading
  if (loadingEl) loadingEl.classList.add('show');
  if (submitBtn) submitBtn.disabled = true;

  auth.createUserWithEmailAndPassword(email, password)
    .then(function (userCredential) {
      // Update display name
      return userCredential.user.updateProfile({
        displayName: fullName
      });
    })
    .then(function () {
      showAuthAlert(alertEl, 'Account created successfully! Redirecting...', 'success');
      setTimeout(function () {
        window.location.href = getPostAuthDestination();
      }, 1500);
    })
    .catch(function (error) {
      let msg = 'Signup failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please login instead.';
      } else if (error.code === 'auth/weak-password') {
        msg = 'Password is too weak. Use at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'Invalid email address.';
      }
      showAuthAlert(alertEl, msg, 'error');
    })
    .finally(function () {
      if (loadingEl) loadingEl.classList.remove('show');
      if (submitBtn) submitBtn.disabled = false;
    });
}

/* ---- Login ---- */
function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const alertEl = document.getElementById('authAlert');
  const loadingEl = document.getElementById('authLoading');
  const submitBtn = document.getElementById('authSubmitBtn');

  if (!email || !password) {
    showAuthAlert(alertEl, 'Please enter email and password.', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showAuthAlert(alertEl, 'Please enter a valid email address.', 'error');
    return;
  }

  if (typeof auth === 'undefined' || firebaseConfig.apiKey === 'YOUR_API_KEY') {
    showAuthAlert(alertEl, 'Firebase is not configured. Please add your Firebase credentials in js/firebase-config.js', 'error');
    return;
  }

  if (loadingEl) loadingEl.classList.add('show');
  if (submitBtn) submitBtn.disabled = true;

  auth.signInWithEmailAndPassword(email, password)
    .then(function () {
      showAuthAlert(alertEl, 'Login successful! Redirecting...', 'success');
      setTimeout(function () {
        window.location.href = getPostAuthDestination();
      }, 1000);
    })
    .catch(function (error) {
      let msg = 'Invalid email or password. Please try again.';
      if (error.code === 'auth/user-not-found') {
        msg = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        msg = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/too-many-requests') {
        msg = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'Invalid email address.';
      }
      showAuthAlert(alertEl, msg, 'error');
    })
    .finally(function () {
      if (loadingEl) loadingEl.classList.remove('show');
      if (submitBtn) submitBtn.disabled = false;
    });
}

/* ---- Helpers ---- */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showAuthAlert(el, message, type) {
  if (!el) return;
  el.textContent = message;
  el.className = 'alert alert-' + type + ' show';
}

function getPostAuthDestination() {
  const params = new URLSearchParams(window.location.search);
  const next = params.get('next');
  if (next && !next.includes('://') && !next.startsWith('//')) return next;
  return 'dashboard.html';
}
