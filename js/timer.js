/* ============================================
   FitLife - Workout Timer Logic
   ============================================ */

let timerSeconds = 0;
let timerInterval = null;
let isRunning = false;

document.addEventListener('DOMContentLoaded', function () {
  const startBtn = document.getElementById('timerStart');
  const pauseBtn = document.getElementById('timerPause');
  const resetBtn = document.getElementById('timerReset');

  if (startBtn) startBtn.addEventListener('click', startTimer);
  if (pauseBtn) pauseBtn.addEventListener('click', pauseTimer);
  if (resetBtn) resetBtn.addEventListener('click', resetTimer);
});

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timerInterval = setInterval(function () {
    timerSeconds++;
    updateDisplay();
  }, 1000);
}

function pauseTimer() {
  isRunning = false;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resetTimer() {
  pauseTimer();
  timerSeconds = 0;
  updateDisplay();
}

function updateDisplay() {
  const display = document.getElementById('timerDisplay');
  if (!display) return;

  const mins = Math.floor(timerSeconds / 60);
  const secs = timerSeconds % 60;
  display.textContent =
    String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
}
