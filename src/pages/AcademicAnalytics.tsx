
import { useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { useDailyExecution } from "../hooks/useDailyExecution";

type Period = "week" | "month";

function shiftDate(dateKey: string, amount: number): string {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + amount);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateKey: string): string {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export default function AcademicAnalytics() {
  const { records, today, subjects } = useDailyExecution();
  const [period, setPeriod] = useState<Period>("week");

  const analytics = useMemo(() => {
    const todayDate = new Date(`${today}T12:00:00`);
    let dates: string[] = [];

    if (period === "week") {
      // Last 7 calendar days, including today.
      dates = Array.from({ length: 7 }, (_, index) =>
        shiftDate(today, index - 6)
      );
    } else {
      const year = todayDate.getFullYear();
      const month = todayDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const monthPrefix = today.slice(0, 7);

      dates = Array.from({ length: daysInMonth }, (_, index) => {
        const day = String(index + 1).padStart(2, "0");
        return `${monthPrefix}-${day}`;
      }).filter((date) => date <= today);
    }

    const subjectCounts = subjects.map((subject) => {
      const count = dates.reduce((total, date) => {
        const completed = records[date] ?? [];
        return total + (completed.includes(subject.id) ? 1 : 0);
      }, 0);

      return {
        ...subject,
        count,
      };
    });

    const activeDays = dates.filter(
      (date) => (records[date] ?? []).length > 0
    ).length;

    const subjectDays = dates.reduce(
      (total, date) => total + (records[date] ?? []).length,
      0
    );

    const mostStudied = [...subjectCounts].sort(
      (a, b) => b.count - a.count
    )[0];

    const leastStudied = [...subjectCounts].sort(
      (a, b) => a.count - b.count
    )[0];

    const daysElapsed = dates.length;
    const activityRate =
      daysElapsed > 0 ? Math.round((activeDays / daysElapsed) * 100) : 0;

    return {
      dates,
      subjectCounts,
      activeDays,
      subjectDays,
      mostStudied,
      leastStudied,
      daysElapsed,
      activityRate,
    };
  }, [records, today, subjects, period]);

  const hasActivity = analytics.subjectDays > 0;
  const maxSubjectCount = Math.max(
    1,
    ...analytics.subjectCounts.map((subject) => subject.count)
  );

  const periodLabel =
    period === "week"
      ? `${formatDate(analytics.dates[0])} – ${formatDate(today)}`
      : new Date(`${today}T12:00:00`).toLocaleDateString("en-GB", {
          month: "long",
          year: "numeric",
        });

  return (
    <main className="analytics-page">
      <header className="analytics-header">
        <div>
          <p className="analytics-eyebrow">MEASURE YOUR PROGRESS</p>
          <h1>Academic Analytics</h1>
          <p className="analytics-subtitle">
            Understand your study habits and decide where to focus next.
          </p>
        </div>

        <div className="analytics-period-switch" aria-label="Analytics period">
          <button
            type="button"
            className={period === "week" ? "selected" : ""}
            onClick={() => setPeriod("week")}
          >
            Weekly
          </button>
          <button
            type="button"
            className={period === "month" ? "selected" : ""}
            onClick={() => setPeriod("month")}
          >
            Monthly
          </button>
        </div>
      </header>

      <div className="analytics-period-label">
        <CalendarDays size={16} />
        <span>{periodLabel}</span>
      </div>

      <section className="analytics-stat-grid">
        <article className="analytics-stat-card">
          <div className="analytics-stat-icon blue">
            <CalendarDays size={21} />
          </div>
          <p>Active days</p>
          <h2>
            {analytics.activeDays}
            <span> / {analytics.daysElapsed}</span>
          </h2>
          <small>Days with at least one subject checked</small>
        </article>

        <article className="analytics-stat-card">
          <div className="analytics-stat-icon green">
            <CheckCircle2 size={21} />
          </div>
          <p>Subject check-ins</p>
          <h2>{analytics.subjectDays}</h2>
          <small>Total subject completions in this period</small>
        </article>

        <article className="analytics-stat-card">
          <div className="analytics-stat-icon purple">
            <BarChart3 size={21} />
          </div>
          <p>Activity rate</p>
          <h2>{analytics.activityRate}%</h2>
          <small>Share of elapsed days with study activity</small>
        </article>
      </section>

      <section className="analytics-chart-card">
        <div className="analytics-section-heading">
          <div>
            <h2>Study distribution</h2>
            <p>Number of days each subject was marked as studied.</p>
          </div>
          <BookOpen size={23} />
        </div>

        {!hasActivity ? (
          <div className="analytics-empty">
            <BarChart3 size={30} />
            <strong>No study data for this period yet</strong>
            <p>
              Open Daily Execution and check a subject after studying it.
              Your chart will update automatically.
            </p>
          </div>
        ) : (
          <div className="analytics-bars">
            {analytics.subjectCounts.map((subject) => {
              const width = (subject.count / maxSubjectCount) * 100;

              return (
                <div className="analytics-bar-row" key={subject.id}>
                  <div className="analytics-bar-label">
                    <span>{subject.name}</span>
                    <strong>
                      {subject.count} {subject.count === 1 ? "day" : "days"}
                    </strong>
                  </div>

                  <div className="analytics-bar-track">
                    <div
                      className="analytics-bar-fill"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="analytics-chart-note">
          These values count study days, not study hours or minutes.
        </p>
      </section>

      <section className="analytics-insights-grid">
        <article className="analytics-insight-card">
          <div className="analytics-insight-heading">
            <TrendingUp size={20} />
            <span>Most studied</span>
          </div>

          {hasActivity && analytics.mostStudied.count > 0 ? (
            <>
              <h3>{analytics.mostStudied.name}</h3>
              <p>
                Marked as studied on{" "}
                <strong>{analytics.mostStudied.count}</strong>{" "}
                {analytics.mostStudied.count === 1 ? "day" : "days"}.
              </p>
            </>
          ) : (
            <p>No study activity recorded in this period yet.</p>
          )}
        </article>

        <article className="analytics-insight-card least">
          <div className="analytics-insight-heading">
            <TrendingDown size={20} />
            <span>Needs more attention</span>
          </div>

          {hasActivity ? (
            <>
              <h3>{analytics.leastStudied.name}</h3>
              <p>
                Marked as studied on{" "}
                <strong>{analytics.leastStudied.count}</strong>{" "}
                {analytics.leastStudied.count === 1 ? "day" : "days"}.
              </p>
            </>
          ) : (
            <p>Start tracking your subjects to see where to focus.</p>
          )}
        </article>
      </section>

      <section className="analytics-detail-card">
        <div className="analytics-section-heading">
          <div>
            <h2>Subject breakdown</h2>
            <p>Exact counts for the selected period.</p>
          </div>
        </div>

        <div className="analytics-subject-table">
          {analytics.subjectCounts.map((subject) => (
            <div className="analytics-subject-row" key={subject.id}>
              <span>{subject.name}</span>
              <div className="analytics-mini-track">
                <div
                  className="analytics-mini-fill"
                  style={{
                    width: `${(subject.count / maxSubjectCount) * 100}%`,
                  }}
                />
              </div>
              <strong>{subject.count}</strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
