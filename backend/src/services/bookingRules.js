const parseDateInput = (dateString) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    throw new Error("Date must be in YYYY-MM-DD format");
  }

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date provided");
  }

  return date;
};

const isBatchDayForUser = (user, date) => {
  const dayIndex = date.getDay();
  if (user.type === "batch1") {
    return dayIndex >= 1 && dayIndex <= 3;
  }

  if (user.type === "batch2") {
    return dayIndex >= 4 && dayIndex <= 5;
  }

  return false;
};

const isBusinessDay = (date) => {
  const dayIndex = date.getDay();
  return dayIndex >= 1 && dayIndex <= 5;
};

const getDateOnly = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const getDayDiff = (targetDate, baseDate) => {
  const msPerDay = 24 * 60 * 60 * 1000;
  const target = getDateOnly(targetDate).getTime();
  const base = getDateOnly(baseDate).getTime();
  return Math.floor((target - base) / msPerDay);
};

const isWithinRegularWindow = (targetDate, now = new Date()) => {
  const diff = getDayDiff(targetDate, now);
  return diff >= 0 && diff <= 14;
};

const getNextBusinessDay = (now = new Date()) => {
  const next = new Date(now);
  next.setDate(next.getDate() + 1);
  while (!isBusinessDay(next)) {
    next.setDate(next.getDate() + 1);
  }
  return getDateOnly(next);
};

const isAfterFloaterStart = (now = new Date()) => {
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return hours > 11 || (hours === 11 && minutes >= 0);
};

const isWithinFlexWindow = (targetDate, now = new Date()) => {
  const nextBusinessDay = getNextBusinessDay(now).getTime();
  return getDateOnly(targetDate).getTime() === nextBusinessDay;
};

const getAllowedSeatType = (user, date) => {
  return isBatchDayForUser(user, date) ? "regular" : "flex";
};

const canBookSeatType = (seatType, targetDate, now = new Date()) => {
  if (seatType === "regular") {
    return isWithinRegularWindow(targetDate, now);
  }

  if (seatType === "flex") {
    return isWithinFlexWindow(targetDate, now) && isAfterFloaterStart(now);
  }

  return false;
};

const canCancelBooking = (targetDate, now = new Date()) => {
  return getDayDiff(targetDate, now) > 0;
};

export {
  parseDateInput,
  isBatchDayForUser,
  isBusinessDay,
  getAllowedSeatType,
  canBookSeatType,
  canCancelBooking,
};
