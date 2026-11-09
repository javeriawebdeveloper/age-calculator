'use strict';

function localToday(now = new Date()) {
  return `${String(now.getFullYear()).padStart(4, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

document.getElementById('calculation-date').value = localToday();

const form = document.getElementById('age-form');
const birth = document.getElementById('birth-date');
const calculation = document.getElementById('calculation-date');
const result = document.getElementById('result');
const error = document.getElementById('error');
const status = document.getElementById('status');

function clearResults() {
  result.hidden = true;
  error.textContent = '';
  status.textContent = '';
  birth.removeAttribute('aria-invalid');
  calculation.removeAttribute('aria-invalid');
}

form.addEventListener('input', clearResults);
form.addEventListener('change', clearResults);
form.addEventListener('submit', event => {
  event.preventDefault();
  clearResults();
  for (const [field, label] of [[birth, 'date of birth'], [calculation, 'calculation date']]) {
    try { parseDate(field.value, label); }
    catch (problem) {
      error.textContent = problem.message;
      field.setAttribute('aria-invalid', 'true');
      field.focus();
      return;
    }
  }
  try {
    const age = calculateAge(birth.value, calculation.value);
    for (const unit of ['years', 'months', 'days']) document.getElementById(unit).textContent = String(age[unit]);
    result.hidden = false;
    status.textContent = `${age.years} years, ${age.months} months, ${age.days} days.`;
  } catch (problem) {
    error.textContent = problem.message;
    birth.setAttribute('aria-invalid', 'true');
    birth.focus();
  }
});
