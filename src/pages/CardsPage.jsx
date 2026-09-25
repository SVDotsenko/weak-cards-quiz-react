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
    t,
  } = useApp();
  const visibleCards = sortCardsForDisplay(filterCards(cards, filter));

  function handleDeleteOrLoadSample() {
    if (!cards.length) {
      loadSampleCards();
      return;
    }
    if (window.confirm(t("cards.confirmDelete"))) {
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
            {t("cards.import")}
          </label>
          <button onClick={exportCards} disabled={!cards.length}>
            {t("cards.export")}
          </button>
          <button onClick={resetStats} disabled={!cards.length}>
            {t("cards.resetStats")}
          </button>
          <button onClick={handleDeleteOrLoadSample}>
            {cards.length ? t("cards.deleteAll") : t("cards.loadSample")}
          </button>
          <button
            type="button"
            title={
              filter === "all" ? t("cards.showErrors") : t("cards.showAll")
            }
            onClick={() => setFilter(filter === "all" ? "errors" : "all")}
          >
            {filter === "all" ? t("cards.showAll") : t("cards.errors")}
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
          <div className="empty-state">{t("cards.empty")}</div>
        )}
      </section>
    </>
  );
}

export default CardsPage;
