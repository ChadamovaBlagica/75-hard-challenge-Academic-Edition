
import { CalendarDays, Flame, TrendingUp } from "lucide-react";
import { useDailyExecution } from "../hooks/useDailyExecution";

function shiftDate(dateKey: string, amount: number): string {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + amount);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isActive(
  records: Record<string, string[]>,
  date: string
): boolean {
  return (records[date] ?? []).length > 0;
}

function calculateCurrentStreak(
  records: Record<string, string[]>,
  today: string
): number {
  // If today has no activity yet, continue checking from yesterday.
  let cursor = isActive(records, today)
    ? today
    : shiftDate(today, -1);

  let streak = 0;

  while (isActive(records, cursor)) {
    streak++;
    cursor = shiftDate(cursor, -1);
  }

  return streak;
}

function calculateLongestStreak(
  records: Record<string, string[]>
): number {
  const activeDates = Object.keys(records)
    .filter((date) => isActive(records, date))
    .sort();

  if (activeDates.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < activeDates.length; i++) {
    const expectedNextDay = shiftDate(activeDates[i - 1], 1);

    if (activeDates[i] === expectedNextDay) {
      current++;
    } else {
      current = 1;
    }

    longest = Math.max(longest, current);
  }

  return longest;
}

function getActivityLevel(count: number): string {
  if (count === 0) return "level-0";
  if (count === 1) return "level-1";
  if (count === 2) return "level-2";
  if (count === 3) return "level-3";
  return "level-4";
}

export default function StudyStreak() {
  const { records, today, totalSubjects } = useDailyExecution();

  const currentStreak = calculateCurrentStreak(records, today);
  const longestStreak = calculateLongestStreak(records);

  const currentMonth = today.slice(0, 7);

  const activeDaysThisMonth = Object.keys(records).filter(
    (date) =>
      date.startsWith(currentMonth) &&
      isActive(records, date)
  ).length;

  const monthDate = new Date(`${today}T12:00:00`);
  const monthName = monthDate.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Monday-first calendar: Monday = 0, Sunday = 6.
  const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;

  const calendarCells: (string | null)[] = [
    ...Array.from({ length: firstDayOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => {
      const day = String(index + 1).padStart(2, "0");
      return `${currentMonth}-${day}`;
    }),
  ];

  const totalSubjectDays = Object.values(records).reduce(
    (total, subjectIds) => total + subjectIds.length,
    0
  );

  return (
    <main className="streak-page">
      <header className="streak-header">
        <div>
          <p className="streak-eyebrow">CONSISTENCY OVER PERFECTION</p>
          <h1>Study Streak</h1>
          <p className="streak-subtitle">
            Every active day is a step forward. Build a routine you can sustain.
          </p>
        </div>
        <div className="streak-date">
          <CalendarDays size={18} />
          <span>{monthName}</span>
        </div>
      </header>

      <section className="streak-stats">
        <article className="streak-stat-card">
          <div className="streak-stat-icon orange">
            <Flame size={22} />
          </div>
          <p>Current streak</p>
          <div className="streak-stat-value">
            {currentStreak} <span>days</span>
          </div>
          <small>Consecutive active days</small>
        </article>

        <article className="streak-stat-card">
          <div className="streak-stat-icon blue">
            <TrendingUp size={22} />
          </div>
          <p>Longest streak</p>
          <div className="streak-stat-value">
            {longestStreak} <span>days</span>
          </div>
          <small>Your personal record</small>
        </article>

        <article className="streak-stat-card">
          <div className="streak-stat-icon green">
            <CalendarDays size={22} />
          </div>
          <p>Active days this month</p>
          <div className="streak-stat-value">
            {activeDaysThisMonth} <span>/ {daysInMonth}</span>
          </div>
          <small>Days with at least one subject</small>
        </article>
      </section>

      <section className="streak-heatmap-card">
        <div className="streak-section-heading">
          <div>
            <h2>Your activity</h2>
            <p>Each square represents one day of studying.</p>
          </div>
          <span className="streak-total">
            {totalSubjectDays} subject check-ins recorded
          </span>
        </div>

        <div className="streak-calendar">
          <div className="streak-weekdays">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (day) => (
                <span key={day}>{day}</span>
              )
            )}
          </div>

          <div className="streak-calendar-grid">
            {calendarCells.map((date, index) => {
              if (!date) {
                return (
                  <span
                    className="streak-day-empty"
                    key={`empty-${index}`}
                  />
                );
              }

              const count = (records[date] ?? []).length;
              const dayNumber = Number(date.slice(-2));
              const isToday = date === today;

              return (
                <div
                  key={date}
                  className={`streak-day ${getActivityLevel(count)} ${
                    isToday ? "is-today" : ""
                  }`}
                  title={`${date}: ${count}/${totalSubjects} subjects studied`}
                  aria-label={`${date}: ${count} subjects studied`}
                >
                  {dayNumber}
                </div>
              );
            })}
          </div>
        </div>

        <div className="streak-legend">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span
              key={level}
              className={`streak-legend-cell level-${level}`}
              title={
                level === 0
                  ? "No subjects"
                  : level === 4
                    ? "4 or more subjects"
                    : `${level} subject${level > 1 ? "s" : ""}`
              }
            />
          ))}
          <span>More</span>
        </div>

        <p className="streak-footnote">
          Activity is based on the subjects checked in Daily Execution.
          Your existing saved records are used; no activity is invented.
        </p>
      </section>
    </main>
  );
}
