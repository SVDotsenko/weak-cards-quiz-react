import { calculateOverallStats } from "../../cards";

function Stats({ cards, visible }) {
  const stats = calculateOverallStats(cards);
  const values = [
    ["Всего карточек", stats.totalCount],
    ["Проблемных", stats.problemCount],
    ["Изучено", `${stats.studiedCount} (${stats.studiedPercent}%)`],
    ["Отвечено", stats.answeredCount],
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
