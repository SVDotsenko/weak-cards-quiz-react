import { useState } from "react";
import { useApp } from "../../app/useApp";

function CardView({ card, review, selectedOptionId }) {
  const { t } = useApp();
  const [language, setLanguage] = useState("en");
  const content = card[language] || card.en;

  return (
    <article className="card-item">
      <div className="card-header">
        <h3>{content.question}</h3>
        <button
          className="language-button"
          onClick={() => setLanguage(language === "en" ? "ru" : "en")}
        >
          {language === "en"
            ? t("cards.cardLanguage")
            : t("cards.cardLanguageEnglish")}
        </button>
      </div>
      <ul className="option-list">
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
