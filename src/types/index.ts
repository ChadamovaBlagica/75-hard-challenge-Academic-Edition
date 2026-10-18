
export type ChallengeTask = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

export type DayRecord = {
  date: string;
  tasks: ChallengeTask[];
  reflection: string;
};

export type ChallengeState = {
  startDate: string;
  days: Record<string, DayRecord>;
};
