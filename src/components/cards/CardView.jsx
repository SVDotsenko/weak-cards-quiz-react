import { useState } from "react";

function CardView({ card, index, review, selectedOptionId }) {
  const [language, setLanguage] = useState("en");
  const content = card[language] || card.en;

  return (
    <article className="card-item">
      <div className="card-header">
        <button
          className="language-button"
          onClick={() => setLanguage(language === "en" ? "ru" : "en")}
        >
          {language === "en" ? "Русский" : "English"}
        </button>
      </div>
      <p className="question">{content.question}</p>
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
          <span>Ошибок: {card.stats.timesWrong}</span>
          <span>Изучений: {card.stats.timesShown}</span>
        </div>
      )}
    </article>
  );
}

export default CardView;
