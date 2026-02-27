import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle.jsx";

const About = () => {
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
              <h1 className="text-2xl font-semibold">About SeatFlow</h1>
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
            Mission
          </p>
          <h2 className="mt-4 text-3xl font-semibold">Make seat planning effortless</h2>
          <p className="mt-3 text-base text-[color:var(--panel-muted)]">
            SeatFlow keeps batch access fair while giving teams a fast way to
            reserve regular and floater desks. It highlights availability,
            enforces booking windows, and makes releases visible for everyone.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Clear booking windows",
                body: "Regular seats stay open up to 14 days, while floater seats unlock at 11:00 AM for the next business day.",
              },
              {
                title: "Batch-aware access",
                body: "Batch 1 and Batch 2 users automatically see the right seat types on their eligible days.",
              },
              {
                title: "Live availability",
                body: "Instant updates show who has booked and what can be released before the date.",
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

        <section className="mt-8 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border p-6 shadow-lg bg-[color:var(--panel-bg)] border-[color:var(--panel-border)] text-[color:var(--panel-text)]">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--panel-muted)]">
              How we run
            </p>
            <h3 className="mt-3 text-2xl font-semibold">Reliable, predictable access</h3>
            <p className="mt-3 text-sm text-[color:var(--panel-muted)]">
              We prioritize clear rules so users know when they can book. Everyone
              gets a single booking per date and can release seats ahead of time
              so others can grab them.
            </p>
          </div>
          <div className="rounded-3xl border p-6 shadow-lg bg-[color:var(--panel-bg)] border-[color:var(--panel-border)] text-[color:var(--panel-text)]">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--panel-muted)]">
              Learn more
            </p>
            <h3 className="mt-3 text-2xl font-semibold">Read the policies</h3>
            <p className="mt-3 text-sm text-[color:var(--panel-muted)]">
              See detailed booking rules, time windows, and release guidelines.
            </p>
            <Link
              className="mt-5 inline-flex rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 border-[color:var(--panel-border)] bg-[color:var(--panel-box-bg)] text-[color:var(--panel-text)]"
              to="/policies"
            >
              View policies
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
