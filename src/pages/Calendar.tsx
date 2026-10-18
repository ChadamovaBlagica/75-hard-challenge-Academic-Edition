
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Circle,
  CalendarDays,
} from "lucide-react";
import type { ChallengeState } from "../types";
import { toDateKey } from "../utils/dates";

type CalendarProps = {
  state: ChallengeState;
};

function dateKey(date: Date): string {
  return toDateKey(date);
}

function addDays(date: Date, amount: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function getChallengeDay(date: Date, startDate: string): number {
  const start = new Date(`${startDate}T00:00:00`);
  const difference = Math.round(
    (new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() -
      start.getTime()) /
      86_400_000
  );

  return difference + 1;
}

export default function Calendar({ state }: CalendarProps) {
  const today = new Date();
  const todayKey = dateKey(today);

  const [visibleMonth, setVisibleMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(todayKey);

  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(visibleMonth);

  const firstDay = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth(),
    1
  );

  // The calendar starts on Monday.
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = addDays(firstDay, -mondayOffset);

  const lastDay = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    0
  );

  const totalCells =
    Math.ceil(((lastDay.getDate() + mondayOffset) / 7)) * 7;

  const calendarDates = Array.from({ length: totalCells }, (_, index) =>
    addDays(gridStart, index)
  );

  const selectedRecord = state.days[selectedDate];
  const selectedDateObject = new Date(`${selectedDate}T00:00:00`);
  const selectedChallengeDay = getChallengeDay(
    selectedDateObject,
    state.startDate
  );

  const isInChallenge =
    selectedChallengeDay >= 1 && selectedChallengeDay <= 75;

  const isSelectedFuture = selectedDate > todayKey;

  function changeMonth(amount: number) {
    setVisibleMonth(
      new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth() + amount,
        1
      )
    );
  }

  function goToToday() {
    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(todayKey);
  }

  return (
    <section className="calendar-page">
      <div className="calendar-heading">
        <div>
          <p className="eyebrow accent-text">PLAN WITH PURPOSE</p>
          <h1>Your calendar</h1>
          <p className="welcome-copy">
            Every day is a chance to keep your promise to yourself.
          </p>
        </div>

        <div className="calendar-heading-icon">
          <CalendarDays size={26} />
        </div>
      </div>

      <div className="calendar-layout">
        <section className="panel month-panel">
          <div className="month-toolbar">
            <div>
              <h2>{monthName}</h2>
              <p className="muted">Your 75-day journey, one day at a time.</p>
            </div>

            <div className="month-controls">
              <button
                className="calendar-today-button"
                onClick={goToToday}
                type="button"
              >
                Today
              </button>
              <button
                className="calendar-nav-button"
                onClick={() => changeMonth(-1)}
                aria-label="Previous month"
                type="button"
              >
                <ChevronLeft size={19} />
              </button>
              <button
                className="calendar-nav-button"
                onClick={() => changeMonth(1)}
                aria-label="Next month"
                type="button"
              >
                <ChevronRight size={19} />
              </button>
            </div>
          </div>

          <div className="calendar-grid">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (weekday) => (
                <div className="calendar-weekday" key={weekday}>
                  {weekday}
                </div>
              )
            )}

            {calendarDates.map((date) => {
              const key = dateKey(date);
              const record = state.days[key];
              const isCurrentMonth =
                date.getMonth() === visibleMonth.getMonth();
              const isToday = key === todayKey;
              const isSelected = key === selectedDate;
              const challengeDay = getChallengeDay(date, state.startDate);
              const inChallenge =
                challengeDay >= 1 && challengeDay <= 75;
              const isFuture = key > todayKey;

              const completed = record
                ? record.tasks.filter((task) => task.completed).length
                : 0;

              const allCompleted =
                !!record &&
                record.tasks.length > 0 &&
                completed === record.tasks.length;

              let statusClass = "day-no-record";

              if (isFuture) {
                statusClass = "day-future";
              } else if (allCompleted) {
                statusClass = "day-complete";
              } else if (completed > 0) {
                statusClass = "day-partial";
              } else if (record) {
                statusClass = "day-started";
              }

              return (
                <button
                  className={[
                    "calendar-day",
                    isCurrentMonth ? "" : "outside-month",
                    isToday ? "is-today" : "",
                    isSelected ? "is-selected" : "",
                    inChallenge ? "" : "outside-challenge",
                    statusClass,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={key}
                  onClick={() => setSelectedDate(key)}
                  type="button"
                  aria-label={`${key}${record ? `, ${completed} of ${record.tasks.length} tasks completed` : ", no saved record"}`}
                >
                  <span className="calendar-day-number">{date.getDate()}</span>

                  {inChallenge && (
                    <span className="calendar-day-challenge">
                      Day {challengeDay}
                    </span>
                  )}

                  <span className="calendar-day-status">
                    {allCompleted ? (
                      <Check size={14} />
                    ) : record && completed > 0 ? (
                      <span className="partial-dot" />
                    ) : record ? (
                      <Circle size={10} />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="calendar-legend">
            <span><i className="legend-dot complete-dot" /> All tasks done</span>
            <span><i className="legend-dot partial-dot-legend" /> In progress</span>
            <span><i className="legend-dot empty-dot" /> No tasks completed</span>
          </div>
        </section>

        <aside className="panel calendar-detail-panel">
          <p className="eyebrow accent-text">DAILY HISTORY</p>
          <h2>
            {new Intl.DateTimeFormat("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            }).format(selectedDateObject)}
          </h2>

          {isInChallenge ? (
            <p className="calendar-detail-day">
              Day {selectedChallengeDay} of 75
            </p>
          ) : (
            <p className="calendar-detail-day">
              {selectedDate < state.startDate
                ? "Before your challenge"
                : "Outside your 75-day challenge"}
            </p>
          )}

          {isSelectedFuture ? (
            <div className="calendar-empty-state">
              <CalendarDays size={25} />
              <p>This day hasn't arrived yet.</p>
              <span>Your future progress will appear here.</span>
            </div>
          ) : selectedRecord ? (
            <>
              <div className="detail-progress">
                <div className="detail-progress-label">
                  <span>Daily progress</span>
                  <strong>
                    {selectedRecord.tasks.length
                      ? Math.round(
                          (selectedRecord.tasks.filter((task) => task.completed)
                            .length /
                            selectedRecord.tasks.length) *
                            100
                        )
                      : 0}
                    %
                  </strong>
                </div>
                <div className="detail-progress-track">
                  <div
                    className="detail-progress-fill"
                    style={{
                      width: `${
                        selectedRecord.tasks.length
                          ? (selectedRecord.tasks.filter(
                              (task) => task.completed
                            ).length /
                              selectedRecord.tasks.length) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <h3 className="detail-section-title">Your tasks</h3>
              <div className="calendar-task-list">
                {selectedRecord.tasks.map((task) => (
                  <div className="calendar-task" key={task.id}>
                    <span
                      className={
                        task.completed
                          ? "calendar-task-check is-done"
                          : "calendar-task-check"
                      }
                    >
                      {task.completed && <Check size={13} />}
                    </span>
                    <div>
                      <p className={task.completed ? "task-done-text" : ""}>
                        {task.title}
                      </p>
                      <span>{task.completed ? "Completed" : "Not completed"}</span>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="detail-section-title">Daily reflection</h3>
              <div className="calendar-reflection">
                {selectedRecord.reflection.trim() ||
                  "No reflection saved for this day."}
              </div>
            </>
          ) : (
            <div className="calendar-empty-state">
              <Circle size={25} />
              <p>No saved record for this day.</p>
              <span>
                The calendar only shows progress that has actually been saved.
              </span>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
