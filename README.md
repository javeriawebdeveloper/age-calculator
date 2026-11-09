# Age Calculator

## Project goal

Build a beginner-friendly age calculator using plain HTML, CSS, and JavaScript.
Open `index.html` directly in a browser without installation or a server.

The page will have **Date of Birth**, **Calculate Age On**, a **Calculate**
button, and a results area showing completed years, months, and days.
Calculate Age On will default to today's date in the user's local time zone
when the page opens. Users can change it to another date.

All three milestones are implemented on `develop`. The `main` branch still
contains the initial README, pending review and a requested merge.

## Open on Windows

1. On GitHub, select the `develop` branch and choose **Code > Download ZIP**.
2. In File Explorer, right-click the ZIP and choose **Extract All**.
3. Open the extracted folder and double-click `index.html` to open it in Edge
   or Chrome. Keep `styles.css`, `calendar.js`, and `app.js` in the same folder.
4. Enter **Date of Birth**, check **Calculate Age On**, and choose **Calculate
   age**. Pressing Enter from a form input also submits the form.

JavaScript must be enabled. No installation or server is required. The GitHub
link shows source files, not a hosted running app. Date controls may display
dates in your browser's regional format; the calculations use calendar dates.

## Calendar rules

Use calendar dates, not a total number of days divided by 365 or 30. Ignore
time of day and daylight-saving changes.

To make month ends and leap days predictable, use this convention:

1. Add the largest number of complete years to the birth date without passing
   the calculation date. If the original day does not exist in that year,
   use the last day of that month.
2. From that year-adjusted date, add the largest number of complete months
   (0–11) without passing the calculation date. For each candidate, keep the
   year-adjusted day if possible; otherwise use the target month's last day.
3. Count the remaining calendar days from that month-adjusted date.

For example, January 31 to February 28, 2025 is one completed month under this
convention. A February 29 birthday reaches its annual anniversary on February
28 in a non-leap year. These are calculation conventions, not legal age rules.

## Development milestones

1. Build the labeled date inputs, Calculate button, and results area; default
   the calculation date to local today.
2. Add calendar calculations, leap-year and month-end handling, and clear
   validation. Missing or invalid dates and a birth date after the calculation
   date must show an error rather than a result. Editing input clears stale
   results. Equal dates are allowed and produce zero years, months, and days.
3. Test the calculator and document Windows opening instructions, passed
   checks, and any remaining verification limits.

Each milestone has a separate commit and push on `develop`. After setup, the
user requested completion of all three milestones without intermediate pauses.

## Test cases

Dates below are written as YYYY-MM-DD. Expected ages use the convention above.

| Birth date | Calculate age on | Years | Months | Days |
| --- | --- | --- | --- | --- |
| 2000-06-15 | 2026-11-09 | 26 | 4 | 25 |
| 2000-06-15 | 2026-06-15 | 26 | 0 | 0 |
| 2000-06-15 | 2026-06-14 | 25 | 11 | 30 |
| 2025-01-31 | 2025-02-28 | 0 | 1 | 0 |
| 2025-01-31 | 2025-03-30 | 0 | 1 | 30 |
| 2024-01-31 | 2024-02-29 | 0 | 1 | 0 |
| 2024-02-29 | 2025-02-28 | 1 | 0 | 0 |
| 2024-02-29 | 2025-03-01 | 1 | 0 | 1 |
| 2024-02-28 | 2024-03-01 | 0 | 0 | 2 |
| 2025-12-31 | 2026-01-01 | 0 | 0 | 1 |
| 2026-11-09 | 2026-11-09 | 0 | 0 | 0 |

Also check:

- Either or both dates missing: show a clear error and no age result.
- Birth date later than the calculation date: show a clear error.
- Invalid dates, such as 2025-02-29 or April 31: reject rather than silently
  shifting to another day.
- Leap-century rules: 2000 is a leap year; 1900 and 2100 are not.
- Local today defaults correctly, including near midnight in different time
  zones; it must not use the UTC date accidentally.
- Daylight-saving transitions do not change the result for the same dates.
- Editing either input hides the previous result; recalculating updates it.
- Open directly in Edge and Chrome on Windows. Check labels, keyboard controls,
  error announcements, narrow screens, and the browser console.

Use automated tests for calendar logic and UI wiring, plus actual browser
checks where available. Record passed checks and pending browser checks
separately; simulated UI tests do not replace browser review.

## Verification results

Run `node --test calendar.test.js` with Node.js to repeat the tests.

- **16 automated tests passed:** all 11 table examples, missing and invalid
  inputs, reversed dates, century leap rules, years below 100, daylight-saving
  and time-zone independence, local today initialization, and UI wiring.
- The UI checks cover displayed ages, clearing stale results, error focus,
  validation attributes, and recalculation. They use a simulated document.
- JavaScript syntax checks, HTML labels and asset links, and Git whitespace
  checks passed.
- Actual Edge/Chrome visual, keyboard, and date-picker checks on Windows remain
  pending. The managed environment's required browser tool was unavailable;
  no real browser verification is claimed.

## Git workflow

The initial README is on `main`. Work on `develop` and wait for review after
setup and after each milestone. Merge to `main` only when requested.
