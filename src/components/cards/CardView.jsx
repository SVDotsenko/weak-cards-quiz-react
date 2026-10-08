import { useId, useRef, useState } from "react";
import { useApp } from "../../app/useApp";
import { startViewTransition } from "../../app/viewTransition";
import { getCardStatus } from "../../cards";

function CardView({ card, review, correctAnswersToLearn }) {
  const { t } = useApp();
  const transitionId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const questionRef = useRef(null);
  const optionsRef = useRef(null);
  const [language, setLanguage] = useState("en");
  const content = card[language] || card.en;

  return (
    <article className="card-item">
      <div className="card-header">
        <h3 ref={questionRef}>{content.question}</h3>
        <button
          className="language-button"
          onClick={() =>
            startViewTransition(
              () => setLanguage(language === "en" ? "ru" : "en"),
              [
                {
                  element: questionRef.current,
                  name: `card-question-${transitionId}`,
                },
                {
                  element: optionsRef.current,
                  name: `card-options-${transitionId}`,
                },
              ],
            )
          }
        >
          {language === "en"
            ? t("cards.cardLanguage")
            : t("cards.cardLanguageEnglish")}
        </button>
      </div>
      <ul ref={optionsRef} className="option-list">
        {Object.entries(content.options).map(([id, text]) => (
          <li
            key={id}
            className={`${id === card.correctOptionId ? "correct-option" : ""} ${id !== card.correctOptionId && card.stats.lastSelectedOptionId !== card.correctOptionId ? "wrong-option" : ""}`}
          >
            {text}
          </li>
        ))}
      </ul>
      {!review && (
        <div className="card-meta">
          <span>
            {getCardStatus(card, correctAnswersToLearn) === "learned"
              ? t("cards.learned")
              : t("cards.correctInRow", {
                  count: card.stats.timesCorrect,
                  threshold: correctAnswersToLearn,
                })}
          </span>
          <span>{t("cards.shown", { count: card.stats.timesShown })}</span>
        </div>
      )}
    </article>
  );
}

export default CardView;
