import { calculateOverallStats } from "../../cards";
import { useApp } from "../../app/useApp";

function Stats({ cards, visible }) {
  const { t } = useApp();
  const stats = calculateOverallStats(cards);
  const values = [
    [t("stats.total"), stats.totalCount],
    [t("stats.problems"), stats.problemCount],
    [t("stats.studied"), `${stats.studiedCount} (${stats.studiedPercent}%)`],
    [t("stats.answered"), stats.answeredCount],
  ];

  return (
    <div
      className={`stats-grid ${visible ? "stats-grid--visible" : "stats-grid--hidden"}`}
    >
      {values.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}

export default Stats;
