
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  BookOpen,
} from "lucide-react";

type DayName =
  | "Понеделник"
  | "Вторник"
  | "Среда"
  | "Четврток"
  | "Петок"
  | "Сабота"
  | "Недела";

type PlannerItemType =
  | "Предавање"
  | "АВ"
  | "Лабораториска"
  | "Самостојно учење"
  | "Домашна задача"
  | "Друго";

type PlannerItem = {
  id: string;
  day: DayName;
  startTime: string;
  endTime: string;
  subject: string;
  type: PlannerItemType;
  room: string;
  person: string;
  completedDates: string[];
};

const STORAGE_KEY = "academic-weekly-planner-v1";

const DAYS: DayName[] = [
  "Понеделник",
  "Вторник",
  "Среда",
  "Четврток",
  "Петок",
  "Сабота",
  "Недела",
];

const SUBJECTS = [
  "Веб програмирање",
  "Бази на податоци",
  "Вовед во науката за податоци",
  "Напреден веб дизајн",
  "Основи на роботика",
];

const ITEM_TYPES: PlannerItemType[] = [
  "Предавање",
  "АВ",
  "Лабораториска",
  "Самостојно учење",
  "Домашна задача",
  "Друго",
];

const INITIAL_ITEMS: PlannerItem[] = [
  {
    id: "fixed-mon-web-design",
    day: "Понеделник",
    startTime: "10:00",
    endTime: "11:45",
    subject: "Напреден веб дизајн",
    type: "Предавање",
    room: "А1",
    person: "Бобан Ј.",
    completedDates: [],
  },
  {
    id: "fixed-tue-databases",
    day: "Вторник",
    startTime: "10:00",
    endTime: "11:45",
    subject: "Бази на податоци",
    type: "Предавање",
    room: "Б.3.2",
    person: "Слободан К.",
    completedDates: [],
  },
  {
    id: "fixed-wed-web-av",
    day: "Среда",
    startTime: "08:00",
    endTime: "09:45",
    subject: "Веб програмирање",
    type: "АВ",
    room: "Б.2.2",
    person: "Бојана М.",
    completedDates: [],
  },
  {
    id: "fixed-wed-web-lecture",
    day: "Среда",
    startTime: "10:00",
    endTime: "11:45",
    subject: "Веб програмирање",
    type: "Предавање",
    room: "Б.2.2",
    person: "Ристе С.",
    completedDates: [],
  },
  {
    id: "fixed-wed-data-science",
    day: "Среда",
    startTime: "14:00",
    endTime: "15:45",
    subject: "Вовед во науката за податоци",
    type: "Предавање",
    room: "Амф МФ",
    person: "Игор М.",
    completedDates: [],
  },
  {
    id: "fixed-wed-robotics",
    day: "Среда",
    startTime: "16:00",
    endTime: "17:45",
    subject: "Основи на роботика",
    type: "АВ",
    room: "315 ТМФ",
    person: "Влатко С.",
    completedDates: [],
  },
  {
    id: "fixed-thu-web-design-av",
    day: "Четврток",
    startTime: "12:00",
    endTime: "13:45",
    subject: "Напреден веб дизајн",
    type: "АВ",
    room: "Б1",
    person: "Мила Д.",
    completedDates: [],
  },
  {
    id: "fixed-fri-data-science-av",
    day: "Петок",
    startTime: "08:00",
    endTime: "09:45",
    subject: "Вовед во науката за податоци",
    type: "АВ",
    room: "Педагошки",
    person: "Димитар П.",
    completedDates: [],
  },
  {
    id: "fixed-fri-databases-av",
    day: "Петок",
    startTime: "10:00",
    endTime: "11:45",
    subject: "Бази на податоци",
    type: "АВ",
    room: "Педагошки",
    person: "Милан Т.",
    completedDates: [],
  },
];

function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMonday(date: Date): Date {
  const monday = new Date(date);
  monday.setHours(12, 0, 0, 0);

  const weekday = monday.getDay();
  const daysSinceMonday = weekday === 0 ? 6 : weekday - 1;

  monday.setDate(monday.getDate() - daysSinceMonday);
  return monday;
}

function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function loadItems(): PlannerItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return INITIAL_ITEMS;

    const parsed = JSON.parse(saved) as PlannerItem[];

    if (!Array.isArray(parsed)) return INITIAL_ITEMS;

    // Preserve any new fixed timetable entries if defaults are updated later.
    const savedIds = new Set(parsed.map((item) => item.id));
    const missingDefaults = INITIAL_ITEMS.filter(
      (item) => !savedIds.has(item.id)
    );

    return [...parsed, ...missingDefaults];
  } catch {
    return INITIAL_ITEMS;
  }
}

export default function WeeklyPlanner() {
  const [items, setItems] = useState<PlannerItem[]>(loadItems);
  const [weekStart, setWeekStart] = useState<Date>(() =>
    getMonday(new Date())
  );

  const [showForm, setShowForm] = useState(false);
  const [day, setDay] = useState<DayName>("Понеделник");
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("13:00");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [type, setType] = useState<PlannerItemType>("Самостојно учење");
  const [room, setRoom] = useState("");
  const [person, setPerson] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const todayKey = getTodayKey();
  const weekDates = DAYS.map((_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  });

  const weekEnd = weekDates[6];

  const weekLabel = `${weekStart.toLocaleDateString("mk-MK", {
    day: "numeric",
    month: "short",
  })} – ${weekEnd.toLocaleDateString("mk-MK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;

  const completedCount = items.reduce((total, item) => {
    const itemDate = weekDates[DAYS.indexOf(item.day)];
    if (!itemDate) return total;

    const dateKey = getDateKey(itemDate);

    return total + (item.completedDates.includes(dateKey) ? 1 : 0);
  }, 0);

  const plannedCount = items.length * 0 +
    weekDates.reduce((total, date) => {
      const weekdayIndex = (date.getDay() + 6) % 7;
      const dayName = DAYS[weekdayIndex];
      return total + items.filter((item) => item.day === dayName).length;
    }, 0);

  function changeWeek(amount: number) {
    setWeekStart((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + amount * 7);
      return next;
    });
  }

  function addItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!subject.trim() || !startTime || !endTime) return;
    if (endTime <= startTime) {
      window.alert("Времето на завршување мора да биде по почетното време.");
      return;
    }

    const newItem: PlannerItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      day,
      startTime,
      endTime,
      subject: subject.trim(),
      type,
      room: room.trim(),
      person: person.trim(),
      completedDates: [],
    };

    setItems((current) => [...current, newItem]);
    setShowForm(false);
    setRoom("");
    setPerson("");
  }

  function toggleCompleted(item: PlannerItem, dateKey: string) {
    setItems((current) =>
      current.map((currentItem) => {
        if (currentItem.id !== item.id) return currentItem;

        const isCompleted = currentItem.completedDates.includes(dateKey);

        return {
          ...currentItem,
          completedDates: isCompleted
            ? currentItem.completedDates.filter((date) => date !== dateKey)
            : [...currentItem.completedDates, dateKey],
        };
      })
    );
  }

  function deleteItem(item: PlannerItem) {
    if (item.id.startsWith("fixed-")) {
      window.alert(
        "Ова е фиксен факултетски термин. Можеш да го оставиш во распоредот или подоцна да додадеме опција за уредување."
      );
      return;
    }

    setItems((current) =>
      current.filter((currentItem) => currentItem.id !== item.id)
    );
  }

  function resetToCurrentWeek() {
    setWeekStart(getMonday(new Date()));
  }

  return (
    <main className="planner-page">
      <header className="planner-header">
        <div>
          <p className="planner-eyebrow">PLAN WITH PURPOSE</p>
          <h1>Weekly Planner</h1>
          <p className="planner-subtitle">
            Your university timetable and personal study sessions in one place.
          </p>
        </div>

        <button
          type="button"
          className="planner-add-button"
          onClick={() => setShowForm((visible) => !visible)}
        >
          <Plus size={18} />
          Add study block
        </button>
      </header>

      <section className="planner-summary">
        <div className="planner-summary-icon">
          <CalendarDays size={22} />
        </div>
        <div>
          <p>WEEK AT A GLANCE</p>
          <h2>{weekLabel}</h2>
          <span>
            {plannedCount} scheduled blocks · {completedCount} marked complete
          </span>
        </div>
      </section>

      {showForm && (
        <section className="planner-form-card">
          <div className="planner-section-heading">
            <div>
              <h2>Add a study block</h2>
              <p>Add personal study, lab work, homework or another commitment.</p>
            </div>
          </div>

          <form className="planner-form" onSubmit={addItem}>
            <label>
              Day
              <select
                value={day}
                onChange={(event) => setDay(event.target.value as DayName)}
              >
                {DAYS.map((dayName) => (
                  <option key={dayName} value={dayName}>
                    {dayName}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Subject
              <select
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              >
                {SUBJECTS.map((subjectName) => (
                  <option key={subjectName} value={subjectName}>
                    {subjectName}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Type
              <select
                value={type}
                onChange={(event) =>
                  setType(event.target.value as PlannerItemType)
                }
              >
                {ITEM_TYPES.map((itemType) => (
                  <option key={itemType} value={itemType}>
                    {itemType}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Start time
              <input
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                required
              />
            </label>

            <label>
              End time
              <input
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                required
              />
            </label>

            <label>
              Room / location (optional)
              <input
                type="text"
                value={room}
                onChange={(event) => setRoom(event.target.value)}
                placeholder="e.g. Lab 2"
              />
            </label>

            <label className="planner-form-full">
              Notes / assistant (optional)
              <input
                type="text"
                value={person}
                onChange={(event) => setPerson(event.target.value)}
                placeholder="e.g. Lab assignment 3"
              />
            </label>

            <div className="planner-form-actions">
              <button
                type="button"
                className="planner-cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="planner-add-button">
                <Plus size={17} />
                Save block
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="planner-timetable-card">
        <div className="planner-week-controls">
          <div>
            <h2>Your timetable</h2>
            <p>Fixed university classes and personal study blocks.</p>
          </div>

          <div className="planner-week-buttons">
            <button
              type="button"
              onClick={() => changeWeek(-1)}
              aria-label="Previous week"
            >
              ‹
            </button>
            <button type="button" onClick={resetToCurrentWeek}>
              Today
            </button>
            <button
              type="button"
              onClick={() => changeWeek(1)}
              aria-label="Next week"
            >
              ›
            </button>
          </div>
        </div>

        <div className="planner-days">
          {weekDates.map((date, index) => {
            const dayName = DAYS[index];
            const dateKey = getDateKey(date);
            const isToday = dateKey === todayKey;

            const dayItems = items
              .filter((item) => item.day === dayName)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <article
                className={`planner-day-column ${isToday ? "today" : ""}`}
                key={dayName}
              >
                <header className="planner-day-header">
                  <span>{dayName}</span>
                  <strong>{date.getDate()}</strong>
                  {isToday && <small>Today</small>}
                </header>

                <div className="planner-day-items">
                  {dayItems.length === 0 ? (
                    <p className="planner-no-items">No blocks planned</p>
                  ) : (
                    dayItems.map((item) => {
                      const completed =
                        item.completedDates.includes(dateKey);

                      return (
                        <div
                          className={`planner-event ${
                            completed ? "completed" : ""
                          } ${
                            item.id.startsWith("fixed-")
                              ? "university-event"
                              : "personal-event"
                          }`}
                          key={item.id}
                        >
                          <div className="planner-event-time">
                            <Clock3 size={13} />
                            <span>
                              {item.startTime}–{item.endTime}
                            </span>
                          </div>

                          <strong className="planner-event-subject">
                            {item.subject}
                          </strong>

                          <span className="planner-event-type">
                            {item.type}
                          </span>

                          {item.room && (
                            <span className="planner-event-meta">
                              <MapPin size={12} />
                              {item.room}
                            </span>
                          )}

                          {item.person && (
                            <span className="planner-event-meta">
                              <BookOpen size={12} />
                              {item.person}
                            </span>
                          )}

                          <div className="planner-event-actions">
                            <button
                              type="button"
                              onClick={() => toggleCompleted(item, dateKey)}
                              title={
                                completed
                                  ? "Mark as not completed"
                                  : "Mark as completed"
                              }
                            >
                              {completed ? (
                                <CheckCircle2 size={16} />
                              ) : (
                                <Circle size={16} />
                              )}
                              <span>
                                {completed ? "Completed" : "Mark done"}
                              </span>
                            </button>

                            {!item.id.startsWith("fixed-") && (
                              <button
                                type="button"
                                className="planner-delete-button"
                                onClick={() => deleteItem(item)}
                                title="Delete block"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <p className="planner-footnote">
        Your custom study blocks and completion records are saved in this browser.
        University classes repeat weekly. Lab sessions can be added when their
        timetable is confirmed.
      </p>
    </main>
  );
}
