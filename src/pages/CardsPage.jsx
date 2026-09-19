import { useNavigate } from "react-router-dom";
import { filterCards } from "../cards";
import { useApp } from "../app/useApp";
import CardView from "../components/cards/CardView";
import Stats from "../components/cards/Stats";

function CardsPage() {
  const navigate = useNavigate();
  const {
    cards,
    filter,
    setFilter,
    batchSize,
    changeBatchSize,
    importFiles,
    exportCards,
    clearCards,
    startQuiz,
  } = useApp();
  const visibleCards = filterCards(cards, filter);

  function beginQuiz() {
    if (startQuiz()) navigate("/quiz");
  }

  return (
    <>
      <section className="panel controls-panel">
        <div className="control-row">
          <label className="file-picker">
            <input
              type="file"
              accept="application/json"
              multiple
              onChange={(event) => importFiles([...event.target.files])}
            />
            Загрузить JSON-файл
          </label>
          <button onClick={beginQuiz} disabled={!cards.length}>
            Начать тест
          </button>
          <button onClick={exportCards} disabled={!cards.length}>
            Экспортировать JSON
          </button>
          <button onClick={clearCards} disabled={!cards.length}>
            Удалить все карточки
          </button>
        </div>
        <div className="batch-row">
          <label>
            Размер батча{" "}
            <input
              type="number"
              min="1"
              max="100"
              value={batchSize}
              onChange={(event) => changeBatchSize(event.target.value)}
            />
          </label>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">Все карточки</option>
            <option value="problem">Проблемные</option>
            <option value="errors">С ошибками</option>
          </select>
        </div>
      </section>
      <section className="panel">
        <Stats cards={cards} />
        {visibleCards.length ? (
          <div className="cards-list">
            {visibleCards.map((card, index) => (
              <CardView key={card.id} card={card} index={index} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            Карточки не найдены. Загрузите JSON-файл, чтобы начать.
          </div>
        )}
      </section>
    </>
  );
}

export default CardsPage;
