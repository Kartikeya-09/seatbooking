import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.25),transparent_42%),radial-gradient(circle_at_85%_10%,rgba(14,116,144,0.2),transparent_35%),linear-gradient(120deg,#fff7ed,#f8fafc_45%,#fff1f2_100%)] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 pb-12">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-900 text-sm font-bold text-amber-100">
              SB
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">SeatFlow</p>
              <h1 className="text-2xl font-semibold">Seat booking control room</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              className="rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5"
              to="/login"
            >
              Open Booking
            </Link>
            <a
              className="rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5"
              href="#overview"
            >
              See how it works
            </a>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Daily seat intelligence
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight">
              Smart seat booking for squads and batches.
            </h2>
            <p className="mt-4 text-base text-slate-600">
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
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-4"
                >
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-amber-100 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-200">
              Booking rules
            </p>
            <h3 className="mt-4 text-2xl font-semibold">Daily access</h3>
            <p className="mt-3 text-sm text-amber-200">
              Batch day users can book from 40 regular seats. Non-batch days
              unlock the 10 floater seats for tomorrow.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="rounded-2xl border border-amber-200/20 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-amber-200">Regular</p>
                <p className="text-lg font-semibold">Book today + next 14 days</p>
              </div>
              <div className="rounded-2xl border border-amber-200/20 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-amber-200">Floater</p>
                <p className="text-lg font-semibold">Tomorrow only</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="rounded-full border px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
                to="/login"
              >
                Start booking
              </Link>
              <Link
                className="rounded-full border border-amber-100/40 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:-translate-y-0.5"
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
            <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
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
                className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;
