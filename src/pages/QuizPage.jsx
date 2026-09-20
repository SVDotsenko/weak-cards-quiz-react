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
        <p>Тест ещё не начат.</p>
        <label className="setting-field">
          Размер батча
          <input
            type="number"
            min="1"
            max="100"
            value={batchSize}
            onChange={(event) => changeBatchSize(event.target.value)}
          />
        </label>
        <button onClick={startQuiz} disabled={!cards.length}>
          Начать тест
        </button>
      </section>
    );

  const currentCard = quiz.cards[quiz.index];
  return (
    <section className="panel quiz-panel">
      <div className="panel-header">
        <span>
          Карточка {quiz.index + 1} из {quiz.cards.length}
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
