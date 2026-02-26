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

const isWithinFloaterWindow = (targetDate, now) => {
  const diff = getDayDiff(targetDate, now);
  return diff === 1;
};

const BookingApp = () => {
  const [seats, setSeats] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("Loading users...");
  const [date, setDate] = useState(formatDate(new Date()));
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
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
    } catch (error) {
      setStatus(error.message);
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

    const allowedType = isBatchDayForUser(user, target) ? "regular" : "floater";

    if (allowedType === "regular" && !isWithinRegularWindow(target, now)) {
      return "Regular seats can be booked from today up to 14 days ahead.";
    }

    if (allowedType === "floater" && !isWithinFloaterWindow(target, now)) {
      return "Floater seats can be booked for tomorrow only.";
    }

    return `Booking window is open for ${allowedType} seats.`;
  }, [user, date]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.2),transparent_42%),radial-gradient(circle_at_85%_10%,rgba(14,116,144,0.2),transparent_35%),linear-gradient(120deg,#fff7ed,#f8fafc_45%,#fff1f2_100%)] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 pb-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-sm font-bold text-amber-100">
              SB
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">SeatFlow</p>
              <h1 className="text-2xl font-semibold">Booking desk</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              className="rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5"
              to="/profile"
            >
              View profile
            </Link>
            <Link
              className="rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5"
              to="/"
            >
              Back to landing
            </Link>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl">
            <h2 className="text-xl font-semibold">Book a seat</h2>
            <p className="mt-2 text-sm text-slate-600">
              Signed in as <span className="font-semibold">{user ? user.name : "..."}</span>
            </p>
            {windowNote ? <p className="mt-2 text-sm text-slate-600">{windowNote}</p> : null}
            <div className="mt-5">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Date
              </label>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
                id="date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
            <p className="mt-4 text-sm text-slate-500">
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
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                >
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {item.label}
                  </p>
                  <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </aside>

          <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Choose a seat</h2>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
                {date}
              </span>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {seats.map((seat) => {
                const booking = bookingMap.get(seat._id);
                const isMine = Boolean(booking);
                const canRelease = isMine
                  ? getDayDiff(new Date(`${date}T00:00:00`), new Date()) > 0
                  : false;
                const baseClasses =
                  "rounded-2xl border px-3 py-3 text-left text-sm transition";
                const stateClasses = seat.isBooked
                  ? isMine
                    ? "border-amber-300 bg-amber-50"
                    : "border-rose-200 bg-rose-50"
                  : seat.isAllowed
                    ? "border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow"
                    : "border-slate-200 bg-slate-100 text-slate-400";

                return (
                  <div key={seat._id} className={`${baseClasses} ${stateClasses}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">Seat {seat.seatNumber}</span>
                      <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-100">
                        {seat.type === "floater" ? "Floater" : "Regular"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      {seat.isBooked
                        ? isMine
                          ? "Booked by you"
                          : "Already booked"
                        : seat.isAllowed
                          ? "Available now"
                          : "Outside booking window"}
                    </p>
                    <div className="mt-3">
                      {isMine ? (
                        <button
                          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 disabled:opacity-50"
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
