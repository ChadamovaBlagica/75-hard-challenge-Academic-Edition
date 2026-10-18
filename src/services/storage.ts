
import type { ChallengeState } from "../types";

const STORAGE_KEY = "academic-75-hard-state";

export function loadChallenge(): ChallengeState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return null;

    return JSON.parse(raw) as ChallengeState;
  } catch {
    return null;
  }
}

export function saveChallenge(state: ChallengeState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
