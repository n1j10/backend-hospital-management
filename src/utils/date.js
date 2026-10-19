// Ported from actions/helpers.ts + actions/dashboard.ts.

// The date after X days from now.
const getDateAfterDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

// The start of today and the start of tomorrow.
const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

module.exports = { getDateAfterDays, getTodayRange };
