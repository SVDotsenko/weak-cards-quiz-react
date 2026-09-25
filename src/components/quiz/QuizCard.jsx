import { useId, useRef, useState } from "react";
import { useApp } from "../../app/useApp";
import { startViewTransition } from "../../app/viewTransition";

function QuizCard({ card, quiz, setQuiz, onAnswer, onNext }) {
  const { t } = useApp();
  const transitionId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const questionRef = useRef(null);
  const optionsRef = useRef(null);
  const [language, setLanguage] = useState("en");
  const content = card[language] || card.en;
  const options = card.shuffledOptions[language] || [];

  return (
    <div className="quiz-card">
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
                  name: `quiz-question-${transitionId}`,
                },
                {
                  element: optionsRef.current,
                  name: `quiz-options-${transitionId}`,
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
      <div ref={optionsRef} className="quiz-options">
        {options.map(([id, text]) => (
          <label
            key={id}
            className={
              quiz.answered && id === card.correctOptionId
                ? "answer-correct"
                : quiz.answered && id === quiz.selected
                  ? "answer-wrong"
                  : ""
            }
          >
            <input
              type="radio"
              name="quiz-answer"
              value={id}
              checked={quiz.selected === id}
              disabled={quiz.answered}
              onChange={() => setQuiz({ ...quiz, selected: id })}
            />
            {text}
          </label>
        ))}
      </div>
      <button
        className="primary-button quiz-action"
        disabled={!quiz.selected && !quiz.answered}
        onClick={quiz.answered ? onNext : onAnswer}
      >
        {quiz.answered ? t("quiz.next") : t("quiz.answer")}
      </button>
    </div>
  );
}

export default QuizCard;
