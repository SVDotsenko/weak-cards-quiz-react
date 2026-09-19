import { useState } from "react";

function CardView({ card, index, review, selectedOptionId }) {
  const [language, setLanguage] = useState("en");
  const content = card[language] || card.en;

  return (
    <article className="card-item">
      <div className="card-header">
        <h3>Карточка {index + 1}</h3>
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
            className={`${id === card.correctOptionId && review ? "correct-option" : ""} ${id === selectedOptionId && id !== card.correctOptionId ? "wrong-option" : ""}`}
          >
            {text}
          </li>
        ))}
      </ul>
      {!review && (
        <div className="card-meta">
          <span>Верно: {card.stats.timesCorrect}</span>
          <span>Неверно: {card.stats.timesWrong}</span>
        </div>
      )}
    </article>
  );
}

export default CardView;
