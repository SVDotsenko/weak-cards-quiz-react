import { useApp } from "../app/useApp";

function SettingsPage() {
  const { batchSize, changeBatchSize } = useApp();

  return (
    <section className="panel page-copy">
      <h2>Настройки</h2>
      <p>Параметры прохождения теста сохраняются в браузере.</p>
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
    </section>
  );
}

export default SettingsPage;
