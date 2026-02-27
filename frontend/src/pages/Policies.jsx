import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle.jsx";

const Policies = () => {
  return (
    <div className="page-shell">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 pb-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-sm font-bold text-amber-100 dark:bg-amber-100 dark:text-slate-900">
              SB
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                SeatFlow
              </p>
              <h1 className="text-2xl font-semibold">Booking policies</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />
            <Link
              className="rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 border-[color:var(--panel-border)] bg-[color:var(--panel-box-bg)] text-[color:var(--panel-text)]"
              to="/"
            >
              Back to landing
            </Link>
          </div>
        </header>

        <section className="rounded-3xl border p-8 shadow-xl bg-[color:var(--panel-bg)] border-[color:var(--panel-border)] text-[color:var(--panel-text)]">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--panel-muted)]">
            Policies
          </p>
          <h2 className="mt-4 text-3xl font-semibold">Seat booking rules</h2>
          <p className="mt-3 text-base text-[color:var(--panel-muted)]">
            These rules keep access fair across batches and ensure seats remain
            available for business days only.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Regular seats",
                body: "Book from today up to the next 14 days on your batch days.",
              },
              {
                title: "Floater seats",
                body: "Available after 11:00 AM for the next business day (weekends skipped).",
              },
              {
                title: "Weekends",
                body: "No bookings are allowed on Saturday or Sunday.",
              },
              {
                title: "Single booking",
                body: "Each user can hold only one seat per date.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border p-5 shadow-sm bg-[color:var(--panel-box-bg)] border-[color:var(--panel-box-border)]"
              >
                <h3 className="text-lg font-semibold text-[color:var(--panel-text)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-[color:var(--panel-muted)]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border p-6 shadow-lg bg-[color:var(--panel-bg)] border-[color:var(--panel-border)] text-[color:var(--panel-text)]">
          <h3 className="text-2xl font-semibold">Release rules</h3>
          <p className="mt-3 text-sm text-[color:var(--panel-muted)]">
            You can release a seat before the booking date. Releases on the same
            day are locked. Regular seats released become floater seats for that
            date.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              className="rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 border-[color:var(--panel-border)] bg-[color:var(--panel-box-bg)] text-[color:var(--panel-text)]"
              to="/app"
            >
              Go to booking
            </Link>
            <Link
              className="rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 border-[color:var(--panel-border)] bg-[color:var(--panel-box-bg)] text-[color:var(--panel-text)]"
              to="/about"
            >
              About SeatFlow
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Policies;
