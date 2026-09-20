import { filterCards } from "../cards";
import { useApp } from "../app/useApp";
import CardView from "../components/cards/CardView";
import Stats from "../components/cards/Stats";

function CardsPage() {
  const {
    cards,
    filter,
    setFilter,
    importFiles,
    exportCards,
    resetStats,
    deleteAllCards,
  } = useApp();
  const visibleCards = filterCards(cards, filter);

  function handleDeleteAll() {
    if (window.confirm("Удалить все карточки безвозвратно?")) {
      deleteAllCards();
    }
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
          <button onClick={exportCards} disabled={!cards.length}>
            Экспортировать JSON
          </button>
          <button onClick={resetStats} disabled={!cards.length}>
            Обнулить статистику
          </button>
          <button onClick={handleDeleteAll} disabled={!cards.length}>
            Удалить все карточки
          </button>
          <select
            className="filter-select"
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
