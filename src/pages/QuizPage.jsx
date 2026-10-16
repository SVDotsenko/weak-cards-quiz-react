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
                {getCardStatus(storedCard, correctAnswersToLearn) === "learned"
                  ? t("cards.learned")
                  : t("cards.correctInRow", {
                      count: storedCard.stats.timesCorrect,
                      threshold: correctAnswersToLearn,
                    })}
              </span>
              <span>
                {t("cards.shown", { count: storedCard.stats.timesShown })}
              </span>
            </div>
          )
        }
      />
    </section>
  );
}

export default QuizPage;
