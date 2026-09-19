import { NavLink } from "react-router-dom";

const links = [
  ["/cards", "Все карточки"],
  ["/quiz", "Тест"],
  ["/settings", "Настройки"],
  ["/about", "О приложении"],
];

function Navigation() {
  return (
    <nav className="main-navigation" aria-label="Основное меню">
      {links.map(([to, label]) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default Navigation;
