import { calculateOverallStats } from "../../cards";
import { useApp } from "../../app/useApp";

function Stats({ cards, visible, onStudy }) {
  const { t } = useApp();
  const stats = calculateOverallStats(cards);
  const values = [
    {
      label: t("stats.studied"),
      value: `${stats.studiedCount} / ${stats.totalCount} (${stats.studiedPercent}%)`,
    },
    {
      label: t("stats.problems"),
      value: stats.problemCount,
      mode: "problem",
      tooltip: t("stats.problemsTooltip"),
    },
    {
      label: t("stats.mistakes"),
      value: stats.mistakesCount,
      mode: "errors",
      tooltip: t("stats.mistakesTooltip"),
    },
  ];

  return (
    <div
      className={`stats-grid ${visible ? "stats-grid--visible" : "stats-grid--hidden"}`}
    >
      {values.map(({ label, value, mode, tooltip }) => {
        const canStudy = mode && value > 0;
        const contents = (
          <>
            <span>{label}</span>
            <strong>{value}</strong>
          </>
        );

        return canStudy ? (
          <button
            key={label}
            className="stats-grid__action"
            type="button"
            title={tooltip}
            onClick={() => onStudy(mode)}
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
