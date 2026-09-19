import { calculateOverallStats } from "../../cards";

function Stats({ cards }) {
  const stats = calculateOverallStats(cards);
  const values = [
    ["Всего карточек", stats.totalCount],
    ["Проблемных", stats.problemCount],
    ["Изучено", `${stats.studiedCount} (${stats.studiedPercent}%)`],
    ["Отвечено", stats.answeredCount],
  ];

  return (
    <div className="stats-grid">
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
