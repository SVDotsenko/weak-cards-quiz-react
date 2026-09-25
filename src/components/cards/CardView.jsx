import { useId, useRef, useState } from "react";
import { useApp } from "../../app/useApp";
import { startViewTransition } from "../../app/viewTransition";

function CardView({ card, review, selectedOptionId }) {
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
            className={`${id === card.correctOptionId ? "correct-option" : ""} ${id === selectedOptionId && id !== card.correctOptionId ? "wrong-option" : ""}`}
          >
            {text}
          </li>
        ))}
      </ul>
      {!review && (
        <div className="card-meta">
          <span>{t("cards.mistakes", { count: card.stats.timesWrong })}</span>
          <span>{t("cards.studied", { count: card.stats.timesShown })}</span>
        </div>
      )}
    </article>
  );
}

export default CardView;
