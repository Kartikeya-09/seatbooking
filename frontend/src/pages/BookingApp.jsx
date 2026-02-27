import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  createBooking,
  deleteBooking,
  getBookings,
  getMe,
  getSeats,
  getAuthToken,
  setAuthToken,
} from "../api.js";
import ThemeToggle from "../components/ThemeToggle.jsx";

const formatDate = (date) => date.toISOString().split("T")[0];
const toDateOnly = (value) => new Date(value.getFullYear(), value.getMonth(), value.getDate());

const getDayDiff = (target, base) => {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((toDateOnly(target) - toDateOnly(base)) / msPerDay);
};

const isBusinessDay = (date) => {
  const dayIndex = date.getDay();
  return dayIndex >= 1 && dayIndex <= 5;
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

const isWithinRegularWindow = (targetDate, now) => {
  const diff = getDayDiff(targetDate, now);
  return diff >= 0 && diff <= 14;
};

const getNextBusinessDay = (now) => {
  const next = new Date(now);
  next.setDate(next.getDate() + 1);
  while (!isBusinessDay(next)) {
    next.setDate(next.getDate() + 1);
  }
  return toDateOnly(next);
};

const isAfterFloaterStart = (now) => {
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return hours > 11 || (hours === 11 && minutes >= 0);
};

const isWithinFlexWindow = (targetDate, now) => {
  return toDateOnly(targetDate).getTime() === getNextBusinessDay(now).getTime();
};

const BookingApp = () => {
  const [seats, setSeats] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("Loading users...");
  const [date, setDate] = useState(formatDate(new Date()));
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [popup, setPopup] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!getAuthToken()) {
          navigate("/login");
          return;
        }

        const data = await getMe();
        setUser(data);
        setStatus("Pick a date to see seats.");
      } catch (error) {
        setStatus(error.message);
        setAuthToken(null);
        navigate("/login");
      }
    };

    loadUser();
  }, [navigate]);

  useEffect(() => {
    const loadSeats = async () => {
      if (!user || !date) {
        return;
      }

      setLoading(true);
      try {
        const [seatData, bookingData] = await Promise.all([
          getSeats({ date }),
          getBookings({ date }),
        ]);
        setSeats(seatData);
        setBookings(bookingData);
        setStatus("Click an available seat to book.");
      } catch (error) {
        setStatus(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSeats();
  }, [user, date]);

  const bookingMap = useMemo(() => {
    const map = new Map();
    bookings.forEach((booking) => {
      const seatId = booking.seat?._id || booking.seat;
      if (seatId) {
        map.set(seatId, booking);
      }
    });
    return map;
  }, [bookings]);

  const seatStats = useMemo(() => {
    const totals = { total: seats.length, booked: 0, allowed: 0 };
    seats.forEach((seat) => {
      if (seat.isBooked) {
        totals.booked += 1;
      }
      if (!seat.isBooked && seat.isAllowed) {
        totals.allowed += 1;
      }
    });
    return totals;
  }, [seats]);

  const filteredSeats = useMemo(() => {
    return seats.filter((seat) => {
      const isMine = Boolean(bookingMap.get(seat._id));
      const seatType = seat.type === "flex" ? "floater" : seat.type;

      if (typeFilter !== "all" && seatType !== typeFilter) {
        return false;
      }

      if (statusFilter === "available") {
        return !seat.isBooked && seat.isAllowed;
      }

      if (statusFilter === "booked") {
        return seat.isBooked;
      }

      if (statusFilter === "mine") {
        return isMine;
      }

      if (statusFilter === "locked") {
        return !seat.isBooked && !seat.isAllowed;
      }

      return true;
    });
  }, [seats, bookingMap, statusFilter, typeFilter]);

  const handleBooking = async (seat) => {
    if (!user || !date || seat.isBooked || !seat.isAllowed) {
      return;
    }

    setLoading(true);
    try {
      await createBooking({ seatId: seat._id, date });
      const [seatData, bookingData] = await Promise.all([
        getSeats({ date }),
        getBookings({ date }),
      ]);
      setSeats(seatData);
      setBookings(bookingData);
      setStatus(`Seat ${seat.seatNumber} booked for ${date}.`);
      setPopup("");
    } catch (error) {
      setStatus(error.message);
      setPopup(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRelease = async (bookingId, seatNumber) => {
    if (!bookingId) {
      return;
    }

    setLoading(true);
    try {
      await deleteBooking(bookingId);
      const [seatData, bookingData] = await Promise.all([
        getSeats({ date }),
        getBookings({ date }),
      ]);
      setSeats(seatData);
      setBookings(bookingData);
      setStatus(`Seat ${seatNumber} released.`);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  const windowNote = useMemo(() => {
    if (!user || !date) {
      return "";
    }

    const target = new Date(`${date}T00:00:00`);
    const now = new Date();

    if (!isBusinessDay(target)) {
      return "No booking on weekends.";
    }

    const allowedType = isBatchDayForUser(user, target) ? "regular" : "flex";

    if (allowedType === "regular" && !isWithinRegularWindow(target, now)) {
      return "Regular seats can be booked from today up to 14 days ahead.";
    }

    if (
      allowedType === "flex" &&
      (!isWithinFlexWindow(target, now) || !isAfterFloaterStart(now))
    ) {
      return "Floater seats can be booked after 11:00 AM for the next business day.";
    }

    const allowedLabel = allowedType === "flex" ? "floater" : allowedType;
    return `Booking window is open for ${allowedLabel} seats.`;
  }, [user, date]);

  return (
    <div className="page-shell">
      {popup ? (
        <div className="fixed inset-x-0 top-6 z-50 flex justify-center px-4">
          <div className="flex max-w-lg items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg bg-[color:var(--panel-bg)] border-[color:var(--panel-border)] text-[color:var(--panel-text)]">
            <span className="text-sm font-semibold">{popup}</span>
            <button
              type="button"
              onClick={() => setPopup("")}
              className="rounded-full border px-3 py-1 text-xs font-semibold border-[color:var(--panel-box-border)] bg-[color:var(--panel-box-bg)] text-[color:var(--panel-text)]"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 pb-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-sm font-bold text-amber-100 dark:bg-amber-100 dark:text-slate-900">
              SB
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                SeatFlow
              </p>
              <h1 className="text-2xl font-semibold">Booking desk</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />
            <Link
              className="rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 border-[color:var(--panel-border)] bg-[color:var(--panel-box-bg)] text-[color:var(--panel-text)]"
              to="/profile"
            >
              View profile
            </Link>
            <Link
              className="rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 border-[color:var(--panel-border)] bg-[color:var(--panel-box-bg)] text-[color:var(--panel-text)]"
              to="/"
            >
              Back to landing
            </Link>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          <aside className="rounded-3xl border p-6 shadow-xl bg-[color:var(--panel-bg)] border-[color:var(--panel-border)] text-[color:var(--panel-text)] lg:sticky lg:top-24 lg:self-start">
            <h2 className="text-xl font-semibold">Book a seat</h2>
            <p className="mt-2 text-sm text-[color:var(--panel-muted)]">
              Signed in as <span className="font-semibold">{user ? user.name : "..."}</span>
            </p>
            {windowNote ? (
              <p className="mt-2 text-sm text-[color:var(--panel-muted)]">{windowNote}</p>
            ) : null}
            <div className="mt-5">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--panel-muted)]">
                Date
              </label>
              <input
                className="mt-2 w-full rounded-2xl border px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none bg-[color:var(--panel-box-bg)] border-[color:var(--panel-box-border)]"
                id="date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
            <p className="mt-4 text-sm text-[color:var(--panel-muted)]">
              {loading ? "Updating..." : status}
            </p>

            <div className="mt-6 grid gap-3">
              {[
                { label: "Total seats", value: seatStats.total },
                { label: "Available to book", value: seatStats.allowed },
                { label: "Booked today", value: seatStats.booked },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border px-4 py-3 bg-[color:var(--panel-box-bg)] border-[color:var(--panel-box-border)]"
                >
                  <p className="text-xs uppercase tracking-wide text-[color:var(--panel-muted)]">
                    {item.label}
                  </p>
                  <p className="text-2xl font-semibold text-[color:var(--panel-text)]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </aside>

          <section className="rounded-3xl border p-6 shadow-xl bg-[color:var(--panel-bg)] border-[color:var(--panel-border)] text-[color:var(--panel-text)]">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <h2 className="text-xl font-semibold">Choose a seat</h2>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs uppercase tracking-[0.3em] text-[color:var(--panel-muted)]">
                  {date}
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "All", value: "all" },
                    { label: "Available", value: "available" },
                    { label: "Booked", value: "booked" },
                    { label: "Mine", value: "mine" },
                    { label: "Locked", value: "locked" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setStatusFilter(item.value)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition hover:-translate-y-0.5 border-[color:var(--panel-box-border)] ${
                        statusFilter === item.value
                          ? "bg-slate-900 text-amber-100"
                          : "bg-[color:var(--panel-box-bg)] text-[color:var(--panel-text)]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-xs text-[color:var(--panel-muted)]">
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { label: "Available", color: "bg-emerald-500" },
                  { label: "Booked", color: "bg-rose-500" },
                  { label: "Yours", color: "bg-amber-500" },
                  { label: "Locked", color: "bg-slate-400" },
                ].map((item) => (
                  <span key={item.label} className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${item.color}`} />
                    {item.label}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-[0.2em]">Type</span>
                {[
                  { label: "All", value: "all" },
                  { label: "Regular", value: "regular" },
                  { label: "Floater", value: "floater" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setTypeFilter(item.value)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition hover:-translate-y-0.5 border-[color:var(--panel-box-border)] ${
                      typeFilter === item.value
                        ? "bg-slate-900 text-amber-100"
                        : "bg-[color:var(--panel-box-bg)] text-[color:var(--panel-text)]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {filteredSeats.map((seat) => {
                const booking = bookingMap.get(seat._id);
                const isMine = Boolean(booking);
                const bookedByName = seat.bookedBy
                  ? seat.bookedBy.name || seat.bookedBy.username
                  : "";
                const canRelease = isMine
                  ? getDayDiff(new Date(`${date}T00:00:00`), new Date()) > 0
                  : false;
                const baseClasses =
                  "group relative rounded-2xl border px-4 py-5 text-left text-sm transition";
                const stateClasses = seat.isBooked
                  ? isMine
                    ? "border-amber-300 bg-amber-50 dark:border-amber-400/40 dark:bg-amber-400/10"
                    : "border-rose-200 bg-rose-50 dark:border-rose-400/40 dark:bg-rose-400/10"
                  : seat.isAllowed
                    ? "border-[color:var(--panel-box-border)] bg-[color:var(--panel-box-bg)] hover:-translate-y-0.5 hover:shadow"
                    : "border-[color:var(--panel-box-border)] bg-[color:var(--panel-box-bg)] text-slate-400";

                return (
                  <div key={seat._id} className={`${baseClasses} ${stateClasses}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">Seat {seat.seatNumber}</span>
                      <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-100">
                        {seat.type === "flex" ? "Floater" : "Regular"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-[color:var(--panel-muted)]">
                      {seat.isBooked
                        ? isMine
                          ? "Booked by you"
                          : "Already booked"
                        : seat.isAllowed
                          ? "Available now"
                          : "Outside booking window"}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          seat.isBooked ? (isMine ? "bg-amber-500" : "bg-rose-500") :
                          seat.isAllowed ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--panel-muted)]">
                        {seat.isBooked ? (isMine ? "Yours" : "Booked") : seat.isAllowed ? "Available" : "Locked"}
                      </span>
                    </div>
                    {seat.isBooked && bookedByName ? (
                      <div className="mt-2 opacity-0 transition group-hover:opacity-100">
                        <span className="inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] border-[color:var(--panel-box-border)] bg-[color:var(--panel-box-bg)] text-[color:var(--panel-text)]">
                          Booked by {bookedByName}
                        </span>
                      </div>
                    ) : null}
                    <div className="mt-3">
                      {isMine ? (
                        <button
                          className="rounded-full border px-3 py-1 text-xs font-semibold border-[color:var(--panel-box-border)] text-[color:var(--panel-text)] bg-[color:var(--panel-box-bg)] disabled:text-slate-400 disabled:opacity-70"
                          type="button"
                          onClick={() => handleRelease(booking._id, seat.seatNumber)}
                          disabled={!canRelease || loading}
                        >
                          {canRelease ? "Release" : "Locked"}
                        </button>
                      ) : (
                        <button
                          className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-amber-100 disabled:opacity-50"
                          type="button"
                          onClick={() => handleBooking(seat)}
                          disabled={seat.isBooked || !seat.isAllowed || loading}
                        >
                          Book
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BookingApp;
