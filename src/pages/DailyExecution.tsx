
import { CalendarDays, CheckCircle2, Circle, GraduationCap } from "lucide-react";
import { useDailyExecution } from "../hooks/useDailyExecution";

export default function DailyExecution() {
  const {
    subjects,
    records,
    today,
    completedSubjects,
    completedCount,
    totalSubjects,
    progress,
    toggleSubject,
  } = useDailyExecution();

  const formattedDate = new Date(`${today}T00:00:00`).toLocaleDateString(
    "en-GB",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const historyDates = Object.keys(records)
    .filter((date) => date !== today && records[date].length > 0)
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 7);

  return (
    <main className="daily-execution-page">
      <header className="daily-header">
        <div>
          <p className="daily-eyebrow">YOUR ACADEMIC ROUTINE</p>
          <h1>Daily Execution</h1>
          <p className="daily-subtitle">
            Small steps every day. Track the subjects you studied.
          </p>
        </div>
        <div className="daily-date">
          <CalendarDays size={18} />
          <span>{formattedDate}</span>
        </div>
      </header>

      <section className="daily-progress-card">
        <div className="daily-progress-top">
          <div>
            <p className="daily-muted">TODAY'S PROGRESS</p>
            <h2>
              {completedCount} <span>/ {totalSubjects} subjects</span>
            </h2>
          </div>
          <div className="daily-progress-percent">{progress}%</div>
        </div>

        <div className="daily-progress-track">
          <div
            className="daily-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="daily-progress-message">
          {completedCount === 0
            ? "Start by checking the subjects you study today."
            : completedCount === totalSubjects
              ? "Amazing! You studied all your subjects today."
              : `You've studied ${completedCount} ${
                  completedCount === 1 ? "subject" : "subjects"
                } today. Keep going!`}
        </p>
      </section>

      <section className="daily-subjects-card">
        <div className="daily-section-heading">
          <div>
            <h2>Today's checklist</h2>
            <p>Check a subject after studying it.</p>
          </div>
          <GraduationCap size={25} />
        </div>

        <div className="daily-subject-list">
          {subjects.map((subject) => {
            const isCompleted = completedSubjects.includes(subject.id);

            return (
              <button
                key={subject.id}
                type="button"
                className={`daily-subject ${
                  isCompleted ? "completed" : ""
                }`}
                onClick={() => toggleSubject(subject.id)}
                aria-pressed={isCompleted}
              >
                {isCompleted ? (
                  <CheckCircle2 className="daily-check-icon" size={23} />
                ) : (
                  <Circle className="daily-check-icon" size={23} />
                )}

                <span>{subject.name}</span>

                <span className="daily-subject-status">
                  {isCompleted ? "Studied" : "Not yet"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="daily-history-card">
        <div className="daily-section-heading">
          <div>
            <h2>Recent study days</h2>
            <p>Your saved progress from previous days.</p>
          </div>
          <CalendarDays size={22} />
        </div>

        {historyDates.length === 0 ? (
          <p className="daily-empty-history">
            Your previous study days will appear here automatically.
          </p>
        ) : (
          <div className="daily-history-list">
            {historyDates.map((date) => {
              const count = records[date].length;
              const dateLabel = new Date(`${date}T00:00:00`).toLocaleDateString(
                "en-GB",
                { day: "numeric", month: "short", year: "numeric" }
              );

              return (
                <div className="daily-history-row" key={date}>
                  <span>{dateLabel}</span>
                  <div className="daily-history-track">
                    <div
                      className="daily-history-fill"
                      style={{ width: `${(count / totalSubjects) * 100}%` }}
                    />
                  </div>
                  <strong>{count}/{totalSubjects}</strong>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
