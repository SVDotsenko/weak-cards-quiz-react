import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  // при заходе на маршрут всегда начинать с экрана "Начать тест", а не с результата прошлого прохода
  useEffect(() => {
    setQuiz(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleNext() {
    const isLastQuestion = quiz.index >= quiz.cards.length - 1;
    nextQuestion();
    if (isLastQuestion) navigate("/cards");
  }

  if (!quiz)
    return (
      <section className="panel empty-state">
        <p>{t("quiz.notStarted")}</p>
        <label className="setting-field">
          {t("quiz.batchSize")}
          <input
            type="number"
            min="1"
            max="100"
            value={batchSize}
            onChange={(event) => changeBatchSize(event.target.value)}
          />
        </label>
        <button onClick={startQuiz} disabled={!cards.length}>
          {t("quiz.start")}
        </button>
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
