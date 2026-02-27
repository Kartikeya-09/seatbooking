import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle.jsx";

const Landing = () => {
  return (
    <div className="page-shell">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 pb-12">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-900 text-sm font-bold text-amber-100 dark:bg-amber-100 dark:text-slate-900">
              SB
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                SeatFlow
              </p>
              <h1 className="text-2xl font-semibold">Seat booking control room</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              className="rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 border-[color:var(--panel-border)] bg-[color:var(--panel-box-bg)] text-[color:var(--panel-text)]"
              to="/login"
            >
              Open Booking
            </Link>
            <a
              className="rounded-full border px-4 py-2 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5 border-[color:var(--panel-border)] bg-[color:var(--panel-box-bg)] text-[color:var(--panel-text)]"
              href="#overview"
            >
              See how it works
            </a>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border p-8 shadow-xl bg-[color:var(--panel-bg)] border-[color:var(--panel-border)] text-[color:var(--panel-text)]">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--panel-muted)]">
              Daily seat intelligence
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight">
              Smart seat booking for squads and batches.
            </h2>
            <p className="mt-4 text-base text-[color:var(--panel-muted)]">
              Plan 50 desks, balance two batch schedules, and keep floater requests
              in motion. SeatFlow shows exactly who can book which seats every day.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Total seats", value: "50" },
                { label: "Batch seats", value: "40" },
                { label: "Floater seats", value: "10" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border px-4 py-4 bg-[color:var(--panel-box-bg)] border-[color:var(--panel-box-border)]"
                >
                  <p className="text-xs uppercase tracking-wide text-[color:var(--panel-muted)]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-[color:var(--panel-text)]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border p-8 shadow-xl bg-[color:var(--panel-bg)] border-[color:var(--panel-border)] text-[color:var(--panel-text)]">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--panel-muted)]">
              Booking rules
            </p>
            <h3 className="mt-4 text-2xl font-semibold">Daily access</h3>
            <p className="mt-3 text-sm text-[color:var(--panel-muted)]">
              Batch day users can book from 40 regular seats. Non-batch days
              unlock the 10 floater seats for tomorrow.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="rounded-2xl border px-4 py-3 bg-[color:var(--panel-box-bg)] border-[color:var(--panel-box-border)]">
                <p className="text-xs uppercase tracking-wide text-[color:var(--panel-muted)]">
                  Regular
                </p>
                <p className="text-lg font-semibold">Book today + next 14 days</p>
              </div>
              <div className="rounded-2xl border px-4 py-3 bg-[color:var(--panel-box-bg)] border-[color:var(--panel-box-border)]">
                <p className="text-xs uppercase tracking-wide text-[color:var(--panel-muted)]">
                  Floater
                </p>
                <p className="text-lg font-semibold">Tomorrow only</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-amber-100 shadow-lg transition hover:-translate-y-0.5 dark:bg-amber-200 dark:text-slate-900"
                to="/login"
              >
                Start booking
              </Link>
              <Link
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 dark:border-amber-100/40 dark:text-amber-100"
                to="/signup"
              >
                Create account
              </Link>
            </div>
          </div>
        </section>

        <section id="overview" className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">How it works</h2>
            <span className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              3 steps
            </span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Pick your identity",
                body: "Sign in and SeatFlow knows your batch access instantly.",
              },
              {
                title: "Select the date",
                body: "We highlight seats and windows that match your batch.",
              },
              {
                title: "Book or release",
                body: "Reserve a seat or release it before the booking date.",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border p-5 shadow-sm bg-[color:var(--panel-box-bg)] border-[color:var(--panel-box-border)]"
              >
                <h3 className="text-lg font-semibold text-[color:var(--panel-text)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-[color:var(--panel-muted)]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;
