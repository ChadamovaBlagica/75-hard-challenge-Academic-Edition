
import { useEffect, useState } from "react";
import type { ChallengeState, ChallengeTask, DayRecord } from "../types";
import { loadChallenge, saveChallenge } from "../services/storage";
import { toDateKey } from "../utils/dates";

const DEFAULT_TASKS: ChallengeTask[] = [
  {
    id: "deep-work",
    title: "Deep work",
    description: "Complete one focused study session.",
    completed: false,
  },
  {
    id: "learning",
    title: "Active learning",
    description: "Practice instead of only rereading.",
    completed: false,
  },
  {
    id: "reading",
    title: "Read for 20 minutes",
    description: "Read a book or educational material.",
    completed: false,
  },
  {
    id: "reflection",
    title: "Daily reflection",
    description: "Write what you learned today.",
    completed: false,
  },
];

function createInitialState(): ChallengeState {
  return {
    startDate: "",
    days: {},
  };
}

function createTodayRecord(date: string): DayRecord {
  return {
    date,
    tasks: DEFAULT_TASKS.map((task) => ({ ...task })),
    reflection: "",
  };
}

function ensureToday(state: ChallengeState): ChallengeState {
  // Do not create daily records before the challenge starts.
  if (!state.startDate) return state;

  const today = toDateKey(new Date());

  if (state.days[today]) return state;

  return {
    ...state,
    days: {
      ...state.days,
      [today]: createTodayRecord(today),
    },
  };
}

export function useChallenge() {
  const [state, setState] = useState<ChallengeState>(() => {
    const saved = loadChallenge();
    return saved ? ensureToday(saved) : createInitialState();
  });

  useEffect(() => {
    saveChallenge(state);
  }, [state]);

  const todayKey = toDateKey(new Date());
  const started = Boolean(state.startDate);

  // Provide an empty display record before the challenge starts.
  // This record is not saved until Start Challenge is clicked.
  const today: DayRecord =
    state.days[todayKey] ?? createTodayRecord(todayKey);

  const completedCount = today.tasks.filter(
    (task) => task.completed
  ).length;

  const progress = started
    ? Math.round((completedCount / today.tasks.length) * 100)
    : 0;

  const dayNumber = started
    ? Math.min(
        75,
        Math.max(
          1,
          Math.floor(
            (new Date(`${todayKey}T00:00:00`).getTime() -
              new Date(`${state.startDate}T00:00:00`).getTime()) /
              86_400_000
          ) + 1
        )
      )
    : 0;

  function startChallenge() {
    setState((current) => {
      // Starting twice must not reset the challenge.
      if (current.startDate) return current;

      const startDate = toDateKey(new Date());

      return {
        startDate,
        days: {
          ...current.days,
          [startDate]: createTodayRecord(startDate),
        },
      };
    });
  }

  function toggleTask(taskId: string) {
    setState((current) => {
      if (!current.startDate) return current;

      const record =
        current.days[todayKey] ?? createTodayRecord(todayKey);

      return {
        ...current,
        days: {
          ...current.days,
          [todayKey]: {
            ...record,
            tasks: record.tasks.map((task) =>
              task.id === taskId
                ? { ...task, completed: !task.completed }
                : task
            ),
          },
        },
      };
    });
  }

  function updateReflection(reflection: string) {
    setState((current) => {
      if (!current.startDate) return current;

      const record =
        current.days[todayKey] ?? createTodayRecord(todayKey);

      return {
        ...current,
        days: {
          ...current.days,
          [todayKey]: {
            ...record,
            reflection,
          },
        },
      };
    });
  }

  return {
    state,
    today,
    started,
    startChallenge,
    dayNumber,
    completedCount,
    totalTasks: today.tasks.length,
    progress,
    toggleTask,
    updateReflection,
  };
}
