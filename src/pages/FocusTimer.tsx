
import { useEffect, useState } from "react";
import {
  BookOpen,
  Clock3,
  Coffee,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Timer,
  Flame,
} from "lucide-react";

const SUBJECTS = [
  { id: "web-programming", name: "Web Programming" },
  { id: "databases", name: "Databases" },
  { id: "data-science", name: "Introduction to Data Science" },
  { id: "advanced-web-design", name: "Advanced Web Design" },
  { id: "robotics", name: "Fundamentals of Robotics" },
];

const STORAGE_KEY = "academic-focus-sessions-v1";

type StudySession = {
  id: string;
  subjectId: string;
  subjectName: string;
  date: string;
  durationMinutes: number;
  completedAt: string;
};

type TimerMode = "focus" | "break";

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMonday(date: Date) {
  const monday = new Date(date);
  monday.setHours(12, 0, 0, 0);

  const day = monday.getDay();
  monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));

  return monday;
}

function loadSessions(): StudySession[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

export default function FocusTimer() {
  const [sessions, setSessions] = useState<StudySession[]>(loadSessions);
  const [subjectId, setSubjectId] = useState(SUBJECTS[0].id);
  const [mode, setMode] = useState<TimerMode>("focus");
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState(
    "Get ready and start studying."
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current > 1) return current - 1;

        window.clearInterval(intervalId);
        setIsRunning(false);

        if (mode === "focus") {
          const selectedSubject = SUBJECTS.find(
            (subject) => subject.id === subjectId
          );

          if (selectedSubject) {
            const session: StudySession = {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              subjectId: selectedSubject.id,
              subjectName: selectedSubject.name,
              date: getDateKey(),
              durationMinutes: focusMinutes,
              completedAt: new Date().toISOString(),
            };

            setSessions((previous) => [...previous, session]);
          }

          setMessage(
            `Great job! You completed ${focusMinutes} minutes of focused study. Your session has been saved.`
          );
          setMode("break");
          return breakMinutes * 60;
        }

        setMessage("Break complete. Ready for your next session!");
        setMode("focus");
        return focusMinutes * 60;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning, mode, subjectId, focusMinutes, breakMinutes]);

  const todayKey = getDateKey();
  const mondayKey = getDateKey(getMonday(new Date()));

  const todaySessions = sessions.filter(
    (session) => session.date === todayKey
  );

  const weekSessions = sessions.filter(
    (session) => session.date >= mondayKey && session.date <= todayKey
  );

  const todayMinutes = todaySessions.reduce(
    (total, session) => total + session.durationMinutes,
    0
  );

  const weekMinutes = weekSessions.reduce(
    (total, session) => total + session.durationMinutes,
    0
  );

  const subjectMinutes = SUBJECTS.map((subject) => ({
    ...subject,
    minutes: todaySessions
      .filter((session) => session.subjectId === subject.id)
      .reduce((total, session) => total + session.durationMinutes, 0),
  }));

  const progressTotal = mode === "focus" ? focusMinutes : breakMinutes;
  const progress = Math.min(
    100,
    Math.max(
      0,
      ((progressTotal * 60 - remainingSeconds) / (progressTotal * 60)) * 100
    )
  );

  function startTimer() {
    setMessage(
      mode === "focus"
        ? `Focus on ${SUBJECTS.find((s) => s.id === subjectId)?.name}.`
        : "Take a break before your next session."
    );
    setIsRunning(true);
  }

  function resetTimer() {
    setIsRunning(false);
    setRemainingSeconds(
      (mode === "focus" ? focusMinutes : breakMinutes) * 60
    );
    setMessage("Timer has been reset.");
  }

  function changeMode(nextMode: TimerMode) {
    setIsRunning(false);
    setMode(nextMode);
    setRemainingSeconds(
      (nextMode === "focus" ? focusMinutes : breakMinutes) * 60
    );
    setMessage(
      nextMode === "focus"
        ? "Get ready and start studying."
        : "Time for a short break."
    );
  }

  function savePartialSession() {
    if (mode !== "focus") return;

    const elapsedSeconds = focusMinutes * 60 - remainingSeconds;
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);

    if (elapsedMinutes < 1) {
      setMessage("Study for at least 1 minute to save a session.");
      return;
    }

    const selectedSubject = SUBJECTS.find(
      (subject) => subject.id === subjectId
    );

    if (!selectedSubject) return;

    const session: StudySession = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      subjectId: selectedSubject.id,
      subjectName: selectedSubject.name,
      date: getDateKey(),
      durationMinutes: elapsedMinutes,
      completedAt: new Date().toISOString(),
    };

    setSessions((previous) => [...previous, session]);
    setIsRunning(false);
    setRemainingSeconds(focusMinutes * 60);
    setMessage(`Saved ${elapsedMinutes} minutes of study.`);
  }

  function updateDuration(nextMode: TimerMode, value: number) {
    const safeValue = Math.min(120, Math.max(1, value));

    if (nextMode === "focus") {
      setFocusMinutes(safeValue);
    } else {
      setBreakMinutes(safeValue);
    }

    if (!isRunning && mode === nextMode) {
      setRemainingSeconds(safeValue * 60);
    }
  }

  return (
    <main className="focus-page">
      <header className="focus-header">
        <div>
          <p className="focus-eyebrow">DEEP WORK · REAL PROGRESS</p>
          <h1>Focus Timer</h1>
          <p className="focus-subtitle">
            Less distraction. More meaningful study time.
          </p>
        </div>
        <div className="focus-header-icon">
          <Timer size={26} />
        </div>
      </header>

      <section className="focus-stats">
        <article className="focus-stat-card">
          <div className="focus-stat-icon"><Clock3 size={20} /></div>
          <span>TODAY</span>
          <strong>{todayMinutes} <small>min</small></strong>
          <p>{todaySessions.length} sessions recorded</p>
        </article>

        <article className="focus-stat-card">
          <div className="focus-stat-icon"><Flame size={20} /></div>
          <span>THIS WEEK</span>
          <strong>{weekMinutes} <small>min</small></strong>
          <p>{weekSessions.length} completed sessions</p>
        </article>

        <article className="focus-stat-card">
          <div className="focus-stat-icon"><BookOpen size={20} /></div>
          <span>ALL TIME</span>
          <strong>{sessions.length}</strong>
          <p>recorded sessions</p>
        </article>
      </section>

      <section className="focus-main-grid">
        <article className="focus-timer-card">
          <div className="focus-mode-switch">
            <button
              type="button"
              className={mode === "focus" ? "active" : ""}
              onClick={() => changeMode("focus")}
            >
              <BookOpen size={16} /> Focus
            </button>
            <button
              type="button"
              className={mode === "break" ? "active" : ""}
              onClick={() => changeMode("break")}
            >
              <Coffee size={16} /> Break
            </button>
          </div>

          <div className="focus-clock" aria-live="polite">
            <svg className="focus-progress-ring" viewBox="0 0 220 220">
              <circle className="focus-ring-track" cx="110" cy="110" r="96" />
              <circle
                className="focus-ring-progress"
                cx="110"
                cy="110"
                r="96"
                strokeDasharray={2 * Math.PI * 96}
                strokeDashoffset={
                  2 * Math.PI * 96 * (1 - progress / 100)
                }
              />
            </svg>
            <div className="focus-clock-content">
              <span>
                {mode === "focus" ? "TIME TO FOCUS" : "TAKE A BREATH"}
              </span>
              <strong>{formatTime(remainingSeconds)}</strong>
              <small>
                {mode === "focus"
                  ? `${focusMinutes} min focus`
                  : `${breakMinutes} min break`}
              </small>
            </div>
          </div>

          <p className="focus-status">{message}</p>

          <div className="focus-timer-controls">
            {!isRunning ? (
              <button
                type="button"
                className="focus-start-button"
                onClick={startTimer}
              >
                <Play size={18} fill="currentColor" /> Start
              </button>
            ) : (
              <button
                type="button"
                className="focus-start-button"
                onClick={() => {
                  setIsRunning(false);
                  setMessage("Timer paused.");
                }}
              >
                <Pause size={18} fill="currentColor" /> Pause
              </button>
            )}

            <button
              type="button"
              className="focus-reset-button"
              onClick={resetTimer}
            >
              <RotateCcw size={17} /> Reset
            </button>
          </div>

          {mode === "focus" && (
            <button
              type="button"
              className="focus-save-partial"
              onClick={savePartialSession}
              disabled={remainingSeconds === focusMinutes * 60}
            >
              <CheckCircle2 size={16} /> Finish & Save Elapsed Time
            </button>
          )}
        </article>

        <aside className="focus-settings-card">
          <h2>Study Settings</h2>
          <p>Choose a subject and customize your session durations.</p>

          <label className="focus-field">
            Subject
            <select
              value={subjectId}
              disabled={isRunning || mode === "break"}
              onChange={(event) => setSubjectId(event.target.value)}
            >
              {SUBJECTS.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </label>

          <label className="focus-field">
            Focus Duration (minutes)
            <input
              type="number"
              min="1"
              max="120"
              value={focusMinutes}
              disabled={isRunning}
              onChange={(event) =>
                updateDuration("focus", Number(event.target.value) || 1)
              }
            />
          </label>

          <label className="focus-field">
            Break Duration (minutes)
            <input
              type="number"
              min="1"
              max="120"
              value={breakMinutes}
              disabled={isRunning}
              onChange={(event) =>
                updateDuration("break", Number(event.target.value) || 1)
              }
            />
          </label>

          <div className="focus-preset-row">
            <button
              type="button"
              onClick={() => {
                setIsRunning(false);
                setFocusMinutes(25);
                setBreakMinutes(5);
                setMode("focus");
                setRemainingSeconds(25 * 60);
                setMessage("Classic Pomodoro selected: 25/5.");
              }}
            >
              25 / 5
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRunning(false);
                setFocusMinutes(50);
                setBreakMinutes(10);
                setMode("focus");
                setRemainingSeconds(50 * 60);
                setMessage("Long focus selected: 50/10.");
              }}
            >
              50 / 10
            </button>
          </div>

          <div className="focus-subject-totals">
            <h3>Today's Study by Subject</h3>
            {subjectMinutes.map((subject) => (
              <div className="focus-subject-row" key={subject.id}>
                <span>{subject.name}</span>
                <strong>{subject.minutes} min</strong>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="focus-history-card">
        <div className="focus-history-heading">
          <div>
            <h2>Recent Sessions</h2>
            <p>Your recorded study history.</p>
          </div>
          <span>{sessions.length} total</span>
        </div>

        {sessions.length === 0 ? (
          <div className="focus-empty-state">
            <Timer size={26} />
            <strong>Your first session starts here.</strong>
            <p>
              Start studying and complete or save a session to see it here.
            </p>
          </div>
        ) : (
          <div className="focus-session-list">
            {[...sessions].reverse().slice(0, 8).map((session) => (
              <article className="focus-session-row" key={session.id}>
                <div className="focus-session-icon">
                  <BookOpen size={18} />
                </div>
                <div className="focus-session-info">
                  <strong>{session.subjectName}</strong>
                  <span>
                    {new Date(session.completedAt).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <strong className="focus-session-duration">
                  {session.durationMinutes} min
                </strong>
              </article>
            ))}
          </div>
        )}
      </section>

      <p className="focus-footnote">
        Your sessions are saved in this browser. When the focus timer ends,
        the session is recorded automatically. If you stop early, select
        "Finish & Save Elapsed Time" to record the full elapsed minutes.
      </p>
    </main>
  );
}
