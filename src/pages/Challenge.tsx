
type ChallengeProps = {
  dayNumber: number;
  progress: number;
};

export default function Challenge({ dayNumber, progress }: ChallengeProps) {
  return (
    <section className="panel simple-page">
      <p className="eyebrow accent-text">75-DAY PROGRAM</p>
      <h1>The challenge</h1>
      <p className="welcome-copy">
        Build discipline through consistent daily action.
      </p>
      <div className="challenge-summary">
        <div>
          <span className="muted">Current day</span>
          <strong>{dayNumber} / 75</strong>
        </div>
        <div>
          <span className="muted">Today's completion</span>
          <strong>{progress}%</strong>
        </div>
      </div>
      <p className="muted">
        Your daily commitments are available on the Dashboard. This page will
        become the full 75-day overview.
      </p>
    </section>
  );
}
