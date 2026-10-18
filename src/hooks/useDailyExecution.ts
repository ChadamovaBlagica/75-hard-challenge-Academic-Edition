
import { useEffect, useState } from "react";
import { toDateKey } from "../utils/dates";

export const SUBJECTS = [
  { id: "web-programming", name: "Veb programiranje" },
  { id: "databases", name: "Bazi na podatoci" },
  { id: "data-science", name: "Voved vo naukata za podatoci" },
  { id: "advanced-web-design", name: "Napreden veb dizajn" },
  { id: "robotics", name: "Osnovi na robotika" },
];

const STORAGE_KEY = "academic-daily-execution";

type DailyRecords = Record<string, string[]>;

function loadRecords(): DailyRecords {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) as DailyRecords : {};
  } catch {
    return {};
  }
}

export function useDailyExecution() {
  const [records, setRecords] = useState<DailyRecords>(loadRecords);

  const today = toDateKey(new Date());
  const completedSubjects = records[today] ?? [];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  function toggleSubject(subjectId: string) {
    setRecords((current) => {
      const todaySubjects = current[today] ?? [];

      const updatedSubjects = todaySubjects.includes(subjectId)
        ? todaySubjects.filter((id) => id !== subjectId)
        : [...todaySubjects, subjectId];

      return {
        ...current,
        [today]: updatedSubjects,
      };
    });
  }

  const completedCount = completedSubjects.length;
  const totalSubjects = SUBJECTS.length;
  const progress = Math.round(
    (completedCount / totalSubjects) * 100
  );

  return {
    subjects: SUBJECTS,
    records,
    today,
    completedSubjects,
    completedCount,
    totalSubjects,
    progress,
    toggleSubject,
  };
}
