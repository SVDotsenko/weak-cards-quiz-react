import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../app/useApp";
import QuizCard from "../components/quiz/QuizCard";

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
    t,
  } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const handledLaunchRef = useRef(false);

  useEffect(() => {
    if (handledLaunchRef.current) return;
    handledLaunchRef.current = true;

    const requestedMode = location.state?.quizMode;
    if (requestedMode === "problem" || requestedMode === "errors") {
      startQuiz(requestedMode);
      navigate(".", { replace: true, state: null });
    } else {
      setQuiz(null);
    }
  }, [location.state, navigate, setQuiz, startQuiz]);

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
              title={t("quiz.startTooltip")}
            >
              {t("quiz.start")}
            </button>
          </div>
        </div>
      </section>
    );

  const currentCard = quiz.cards[quiz.index];
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
      />
    </section>
  );
}

export default QuizPage;
