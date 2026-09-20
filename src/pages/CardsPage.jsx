import { filterCards, sortCardsForDisplay } from "../cards";
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
    loadSampleCards,
  } = useApp();
  const visibleCards = sortCardsForDisplay(filterCards(cards, filter));

  function handleDeleteOrLoadSample() {
    if (!cards.length) {
      loadSampleCards();
      return;
    }
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
          <button onClick={handleDeleteOrLoadSample}>
            {cards.length
              ? "Удалить все карточки"
              : "Загрузить тестовые карточки"}
          </button>
          <button
            type="button"
            onClick={() => setFilter(filter === "all" ? "errors" : "all")}
          >
            {filter === "all" ? "Все карточки" : "С ошибками"}
          </button>
        </div>
      </section>
      <section className="panel">
        <Stats cards={cards} visible={filter === "all"} />
        {visibleCards.length ? (
          <div className="cards-list">
            {visibleCards.map((card, index) => (
              <CardView
                key={card.id}
                card={card}
                index={index}
                selectedOptionId={
                  card.stats.lastAttemptCorrect === false
                    ? card.stats.lastSelectedOptionId
                    : undefined
                }
              />
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
