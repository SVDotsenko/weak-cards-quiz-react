import { Link } from "react-router-dom";
import { useApp } from "../app/useApp";
import CardView from "../components/cards/CardView";
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

  if (quiz.done)
    return (
      <section className="panel">
        {quiz.mistakes.length ? (
          <div className="cards-list">
            {quiz.mistakes.map((item, index) => (
              <CardView
                key={item.card.id}
                card={item.card}
                index={index}
                review
                selectedOptionId={item.selected}
              />
            ))}
          </div>
        ) : (
          <p>Ошибок нет.</p>
        )}
        <Link className="button-link" to="/cards">
          Вернуться к карточкам
        </Link>
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
        onNext={nextQuestion}
      />
    </section>
  );
}

export default QuizPage;
