'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { calculateAge } = require('./calendar.js');

const cases = [
  ['2000-06-15', '2026-11-09', 26, 4, 25],
  ['2000-06-15', '2026-06-15', 26, 0, 0],
  ['2000-06-15', '2026-06-14', 25, 11, 30],
  ['2025-01-31', '2025-02-28', 0, 1, 0],
  ['2025-01-31', '2025-03-30', 0, 1, 30],
  ['2024-01-31', '2024-02-29', 0, 1, 0],
  ['2024-02-29', '2025-02-28', 1, 0, 0],
  ['2024-02-29', '2025-03-01', 1, 0, 1],
  ['2024-02-28', '2024-03-01', 0, 0, 2],
  ['2025-12-31', '2026-01-01', 0, 0, 1],
  ['2026-11-09', '2026-11-09', 0, 0, 0]
];
for (const [birth, end, years, months, days] of cases) {
  test(`${birth} to ${end}`, () => {
    assert.deepEqual(calculateAge(birth, end), { years, months, days });
  });
}

test('missing, reversed, malformed, and impossible dates', () => {
  for (const date of ['', '2025-02-29', '2025-04-31', '1900-02-29', '2100-02-29', '0000-01-01', '2025-13-01', '2025-01-00', '2025-1-1', '10000-01-01', 'text']) {
    assert.throws(() => calculateAge(date, '2026-11-09'));
    assert.throws(() => calculateAge('0001-01-01', date));
  }
  assert.throws(() => calculateAge('', ''));
  assert.throws(() => calculateAge('2026-11-10', '2026-11-09'), /later than/);
});

test('century leap rules and years below 100', () => {
  assert.deepEqual(calculateAge('2000-02-28', '2000-03-01'), { years: 0, months: 0, days: 2 });
  for (const year of ['1900', '2100']) {
    assert.equal(calculateAge(`${year}-02-28`, `${year}-03-01`).days, 1);
  }
  assert.deepEqual(calculateAge('0001-01-01', '0002-01-01'), { years: 1, months: 0, days: 0 });
  assert.deepEqual(calculateAge('0001-01-01', '9999-12-31'), { years: 9998, months: 11, days: 30 });
});

test('date arithmetic is independent of daylight-saving and time zones', () => {
  const { execFileSync } = require('node:child_process');
  const code = "console.log(JSON.stringify(require('./calendar.js').calculateAge('2025-03-08','2025-03-10')))";
  for (const TZ of ['UTC', 'America/New_York', 'Asia/Karachi', 'Pacific/Kiritimati']) {
    const age = JSON.parse(execFileSync(process.execPath, ['-e', code], { env: { ...process.env, TZ }, encoding: 'utf8' }));
    assert.deepEqual(age, { years: 0, months: 0, days: 2 });
  }
});

function page() {
  const fs = require('node:fs');
  const vm = require('node:vm');
  const elements = new Map();
  const document = { getElementById(id) {
    if (!elements.has(id)) elements.set(id, {
      value: '', textContent: '', hidden: true, attributes: {}, listeners: {},
      addEventListener(type, fn) { this.listeners[type] = fn; },
      removeAttribute(key) { delete this.attributes[key]; },
      setAttribute(key, value) { this.attributes[key] = value; },
      focus() { this.focused = true; }
    });
    return elements.get(id);
  } };
  const context = vm.createContext({ document });
  vm.runInContext(fs.readFileSync('calendar.js', 'utf8'), context);
  vm.runInContext(fs.readFileSync('app.js', 'utf8'), context);
  return { el: id => document.getElementById(id), context };
}

test('today default uses local date fields rather than UTC conversion', () => {
  const { el, context } = page();
  const now = new Date();
  const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  assert.equal(el('calculation-date').value, expected);
  const vm = require('node:vm');
  assert.equal(vm.runInContext('localToday({getFullYear:()=>2026,getMonth:()=>0,getDate:()=>1,toISOString:()=>{throw Error("UTC must not be used")}})', context), '2026-01-01');
});

test('UI displays results, clears stale output, focuses errors, and recalculates', () => {
  const { el } = page();
  const submit = () => el('age-form').listeners.submit({ preventDefault() {} });
  el('birth-date').value = '2000-06-15'; el('calculation-date').value = '2026-11-09'; submit();
  assert.equal(el('result').hidden, false);
  assert.equal(el('years').textContent, '26');
  assert.equal(el('months').textContent, '4');
  assert.equal(el('days').textContent, '25');
  assert.match(el('status').textContent, /26 years, 4 months, 25 days/);
  el('age-form').listeners.input(); assert.equal(el('result').hidden, true);
  el('birth-date').value = ''; submit();
  assert.match(el('error').textContent, /date of birth/);
  assert.equal(el('birth-date').focused, true);
  assert.equal(el('birth-date').attributes['aria-invalid'], 'true');
  el('birth-date').value = '2024-02-29'; el('calculation-date').value = ''; submit();
  assert.equal(el('calculation-date').attributes['aria-invalid'], 'true');
  el('calculation-date').value = '2024-02-28'; submit();
  assert.match(el('error').textContent, /later than/);
  assert.equal(el('result').hidden, true);
  el('calculation-date').value = '2025-02-28'; submit();
  assert.equal(el('years').textContent, '1');
  assert.equal(el('error').textContent, '');
  assert.equal(el('birth-date').attributes['aria-invalid'], undefined);
  el('age-form').listeners.change(); assert.equal(el('result').hidden, true);
});
