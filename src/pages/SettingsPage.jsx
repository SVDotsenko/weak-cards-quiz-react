import { useApp } from "../app/useApp";

function SettingsPage() {
  const { startRoute, changeStartRoute, uiLanguage, changeUILanguage, t } =
    useApp();
  const startRouteChoices = [
    { value: "/cards", label: t("settings.routeCards") },
    { value: "/quiz", label: t("settings.routeQuiz") },
    { value: "/about", label: t("settings.routeAbout") },
  ];

  return (
    <section className="panel page-copy">
      <fieldset className="setting-radio-group">
        <legend>{t("settings.startPage")}</legend>
        {startRouteChoices.map(({ value, label }) => (
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
      <fieldset className="setting-radio-group">
        <legend>{t("settings.interfaceLanguage")}</legend>
        <label>
          <input
            type="radio"
            name="ui-language"
            value="en"
            checked={uiLanguage === "en"}
            onChange={() => changeUILanguage("en")}
          />
          {t("settings.english")}
        </label>
        <label>
          <input
            type="radio"
            name="ui-language"
            value="ru"
            checked={uiLanguage === "ru"}
            onChange={() => changeUILanguage("ru")}
          />
          {t("settings.russian")}
        </label>
      </fieldset>
    </section>
  );
}

export default SettingsPage;
