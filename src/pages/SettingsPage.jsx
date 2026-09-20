import { useApp } from "../app/useApp";

const START_ROUTE_CHOICES = [
  { value: "/cards", label: "Все карточки" },
  { value: "/quiz", label: "Тест" },
  { value: "/about", label: "О приложении" },
];

function SettingsPage() {
  const { startRoute, changeStartRoute } = useApp();

  return (
    <section className="panel page-copy">
      <fieldset className="setting-radio-group">
        <legend>Страница при входе в приложение</legend>
        {START_ROUTE_CHOICES.map(({ value, label }) => (
          <label key={value}>
            <input
              type="radio"
              name="start-route"
              value={value}
              checked={startRoute === value}
              onChange={() => changeStartRoute(value)}
            />
            {label}
          </label>
        ))}
      </fieldset>
    </section>
  );
}

export default SettingsPage;
