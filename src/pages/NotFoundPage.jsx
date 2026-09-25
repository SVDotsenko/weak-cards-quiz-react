import { Link } from "react-router-dom";
import { useApp } from "../app/useApp";

function NotFoundPage() {
  const { t } = useApp();
  return (
    <section className="panel empty-state">
      <h2>{t("notFound.title")}</h2>
      <Link className="button-link" to="/cards">
        {t("notFound.back")}
      </Link>
    </section>
  );
}

export default NotFoundPage;
