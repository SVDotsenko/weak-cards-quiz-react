import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="panel empty-state">
      <h2>Страница не найдена</h2>
      <Link className="button-link" to="/cards">
        Вернуться к карточкам
      </Link>
    </section>
  );
}

export default NotFoundPage;
