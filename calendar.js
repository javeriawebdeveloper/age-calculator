'use strict';

function daysInMonth(year, month) {
  if (month === 2) return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function parseDate(value, label) {
  if (!value) throw new Error(`Enter ${label}.`);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error(`Enter a valid ${label} between years 0001 and 9999.`);
  const [, y, m, d] = match;
  const date = { year: Number(y), month: Number(m), day: Number(d) };
  if (date.year < 1 || date.month < 1 || date.month > 12 || date.day < 1 || date.day > daysInMonth(date.year, date.month)) {
    throw new Error(`Enter a valid ${label}.`);
  }
  return date;
}

function dateStamp(date) {
  // UTC is used only for calendar arithmetic, avoiding daylight-saving offsets.
  // setUTCFullYear also handles years 0001–0099 without the Date constructor's offset.
  const stamp = new Date(0);
  stamp.setUTCFullYear(date.year, date.month - 1, date.day);
  return stamp.getTime();
}

function addYears(date, years) {
  const year = date.year + years;
  return { year, month: date.month, day: Math.min(date.day, daysInMonth(year, date.month)) };
}

function addMonths(date, months) {
  const index = date.month - 1 + months;
  const year = date.year + Math.floor(index / 12);
  const month = index % 12 + 1;
  return { year, month, day: Math.min(date.day, daysInMonth(year, month)) };
}

function calculateAge(birthValue, calculationValue) {
  const birth = parseDate(birthValue, 'date of birth');
  const end = parseDate(calculationValue, 'calculation date');
  const endStamp = dateStamp(end);
  if (dateStamp(birth) > endStamp) throw new Error('Date of Birth must not be later than Calculate Age On.');
  let years = end.year - birth.year;
  if (dateStamp(addYears(birth, years)) > endStamp) years--;
  const anniversary = addYears(birth, years);
  let months = 0;
  while (months < 11 && dateStamp(addMonths(anniversary, months + 1)) <= endStamp) months++;
  const days = Math.round((endStamp - dateStamp(addMonths(anniversary, months))) / 86400000);
  return { years, months, days };
}

if (typeof module !== 'undefined') module.exports = { calculateAge, parseDate };
