import { calculateOverallStats } from "../../cards";
import { useApp } from "../../app/useApp";

function Stats({ cards, correctAnswersToLearn, filter, onFilterChange }) {
  const { t } = useApp();
  const stats = calculateOverallStats(cards, correctAnswersToLearn);
  const ratio = (count, percent) =>
    stats.totalCount ? `${count} / ${stats.totalCount} (${percent}%)` : "0 / 0";
  const values = stats.isInitialPhase
    ? [
        {
          label: t("stats.shown"),
          value: ratio(stats.shownCount, stats.shownPercent),
        },
        {
          label: t("stats.cardsWithErrors"),
          value: stats.cardsWithErrorsCount,
          mode: "errors",
        },
      ]
    : [
        {
          label: t("stats.studied"),
          value: ratio(stats.studiedCount, stats.studiedPercent),
        },
        {
          label: t("stats.cardsWithErrors"),
          value: stats.cardsWithErrorsCount,
          mode: "errors",
        },
        {
          label: t("stats.incorrectLastAnswer"),
          value: stats.lastIncorrectCount,
          mode: "problem",
        },
      ];

  return (
    <div className="stats-grid">
      {values.map(({ label, value, mode }) => {
        const contents = (
          <>
            <span>{label}</span>
            <strong>{value}</strong>
          </>
        );

        return mode ? (
          <button
            key={label}
            className="stats-grid__action"
            type="button"
            aria-pressed={filter === mode}
            onClick={() => onFilterChange(filter === mode ? "all" : mode)}
          >
            {contents}
          </button>
        ) : (
          <div key={label}>{contents}</div>
        );
      })}
    </div>
  );
}

export default Stats;
