import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../app/useApp";
import QuizCard from "../components/quiz/QuizCard";
import { getCardStatus } from "../cards";

function QuizPage() {
  const {
    quiz,
    setQuiz,
    answerQuiz,
    nextQuestion,
    startQuiz,
    cards,
    batchSize,
    changeBatchSize,
    correctAnswersToLearn,
    t,
  } = useApp();
  const navigate = useNavigate();
  const hasUnseenCards = cards.some(
    (card) => getCardStatus(card, correctAnswersToLearn) === "new",
  );

  useEffect(() => {
    setQuiz(null);
  }, [setQuiz]);

  function handleNext() {
    const isLastQuestion = quiz.index >= quiz.cards.length - 1;
    nextQuestion();
    if (isLastQuestion) navigate("/cards");
  }

  if (!quiz)
    return (
      <section className="panel empty-state">
        <div className="quiz-launch-controls">
          <div className="quiz-start-row">
            <input
              type="number"
              min="1"
              max="100"
              value={batchSize}
              onChange={(event) => changeBatchSize(event.target.value)}
              aria-label={t("quiz.cardCount")}
              title={t("quiz.cardCountTooltip")}
            />
            <button
              onClick={() => startQuiz()}
              disabled={!cards.length}
              title={t(
                hasUnseenCards
                  ? "quiz.startTooltipUnseen"
                  : "quiz.startTooltipReview",
                { count: correctAnswersToLearn },
              )}
            >
              {t("quiz.start")}
            </button>
          </div>
        </div>
      </section>
    );

  const currentCard = quiz.cards[quiz.index];
  const storedCard = cards.find((card) => card.id === currentCard.id);
  const isCorrect = quiz.selected === currentCard.correctOptionId;
  const flash = (tone) =>
    quiz.answered ? `stat-value stat-flash stat-flash--${tone}` : "stat-value";

  function withHighlightedValue(key, params, value, className) {
    const [before, after] = t(key, { ...params, count: "\u0000" }).split(
      "\u0000",
    );
    return (
      <>
        {before}
        <span className={className}>{value}</span>
        {after}
      </>
    );
  }

  return (
    <section className="panel quiz-panel">
      <div className="panel-header">
        <span>
          {t("quiz.card", {
            current: quiz.index + 1,
            total: quiz.cards.length,
          })}
        </span>
      </div>
      <QuizCard
        key={currentCard.id}
        card={currentCard}
        quiz={quiz}
        setQuiz={setQuiz}
        onAnswer={answerQuiz}
        onNext={handleNext}
        meta={
          quiz.isReviewPhase &&
          storedCard && (
            <div className="card-meta quiz-meta">
              <span>
                {getCardStatus(storedCard, correctAnswersToLearn) ===
                "learned" ? (
                  <span className={flash("up")}>{t("cards.learned")}</span>
                ) : (
                  withHighlightedValue(
                    "cards.correctInRow",
                    { threshold: correctAnswersToLearn },
                    storedCard.stats.timesCorrect,
                    flash(isCorrect ? "up" : "down"),
                  )
                )}
              </span>
              <span>
                {withHighlightedValue(
                  "cards.shown",
                  {},
                  storedCard.stats.timesShown,
                  flash("up"),
                )}
              </span>
            </div>
          )
        }
      />
    </section>
  );
}

export default QuizPage;
