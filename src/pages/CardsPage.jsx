import { useState } from "react";
import { filterCards, sortCardsForDisplay } from "../cards";
import { useApp } from "../app/useApp";
import CardView from "../components/cards/CardView";
import Stats from "../components/cards/Stats";

function CardsPage() {
  const [filter, setFilter] = useState("all");
  const {
    cards,
    correctAnswersToLearn,
    importFiles,
    exportCards,
    resetStats,
    deleteAllCards,
    loadSampleCards,
    t,
  } = useApp();
  const visibleCards = sortCardsForDisplay(
    filterCards(cards, filter, correctAnswersToLearn),
  );

  function handleDeleteOrLoadSample() {
    if (!cards.length) {
      setFilter("all");
      loadSampleCards();
      return;
    }
    if (window.confirm(t("cards.confirmDelete"))) {
      setFilter("all");
      deleteAllCards();
    }
  }

  function handleImport(event) {
    const files = [...event.target.files];
    setFilter("all");
    importFiles(files);
    event.target.value = "";
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
              onChange={handleImport}
            />
            {t("cards.import")}
          </label>
          <button onClick={exportCards} disabled={!cards.length}>
            {t("cards.export")}
          </button>
          <button
            onClick={() => {
              setFilter("all");
              resetStats();
            }}
            disabled={!cards.length}
          >
            {t("cards.resetStats")}
          </button>
          <button onClick={handleDeleteOrLoadSample}>
            {cards.length ? t("cards.deleteAll") : t("cards.loadSample")}
          </button>
        </div>
      </section>
      <section className="panel">
        <Stats
          cards={cards}
          correctAnswersToLearn={correctAnswersToLearn}
          filter={filter}
          onFilterChange={setFilter}
        />
        {visibleCards.length ? (
          <div className="cards-list">
            {visibleCards.map((card, index) => (
              <CardView
                key={card.id}
                card={card}
                index={index}
                correctAnswersToLearn={correctAnswersToLearn}
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
