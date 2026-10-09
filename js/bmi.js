/* ============================================
   FitLife - BMI Calculator Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('bmiForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      calculateBMI();
    });
  }
});

function calculateBMI() {
  const weight = parseFloat(document.getElementById('weight').value);
  const heightCm = parseFloat(document.getElementById('height').value);
  const resultBox = document.getElementById('bmiResult');

  if (!weight || !heightCm || weight <= 0 || heightCm <= 0) {
    alert('Please enter valid weight and height values.');
    return;
  }

  // Convert height from cm to meters
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  const bmiRounded = bmi.toFixed(1);

  let category = '';
  let message = '';
  let color = '';

  if (bmi < 18.5) {
    category = 'Underweight';
    message = 'You may need to gain some weight. Consider a balanced diet and strength training.';
    color = '#3498db';
  } else if (bmi < 25) {
    category = 'Normal';
    message = 'Great! You are in a healthy weight range. Keep up the good work!';
    color = '#2ecc71';
  } else if (bmi < 30) {
    category = 'Overweight';
    message = 'Consider incorporating more cardio and watching your calorie intake.';
    color = '#f39c12';
  } else {
    category = 'Obese';
    message = 'It is recommended to consult a healthcare professional and start a structured fitness plan.';
    color = '#e74c3c';
  }

  document.getElementById('bmiValue').textContent = bmiRounded;
  document.getElementById('bmiValue').style.color = color;
  document.getElementById('bmiCategory').textContent = category;
  document.getElementById('bmiCategory').style.color = color;
  document.getElementById('bmiMessage').textContent = message;

  resultBox.classList.add('show');
}
