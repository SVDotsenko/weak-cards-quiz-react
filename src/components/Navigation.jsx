import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useApp } from "../app/useApp";
import { UI_LANGUAGES, getTranslator } from "../i18n";

const translators = UI_LANGUAGES.map((language) => getTranslator(language));

function Navigation() {
  const { t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const navigationRef = useRef(null);
  const burgerButtonRef = useRef(null);

  const closeMenu = () => {
    setIsOpen(false);
    burgerButtonRef.current?.focus();
  };

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    const handleOutsideClick = (event) => {
      if (!navigationRef.current?.contains(event.target)) {
        closeMenu();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleLinkClick = (event) => {
    const link = event.currentTarget;
    const hash = link.hash;
    const target = hash ? document.querySelector(hash) : null;

    closeMenu();

    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const links = [
    ["/cards", "navigation.cards"],
    ["/quiz", "navigation.quiz"],
    ["/settings", "navigation.settings"],
    ["/about", "navigation.about"],
  ];

  return (
    <nav
      ref={navigationRef}
      className={`main-navigation menu${isOpen ? " menu--open" : ""}`}
      aria-label={t("navigation.menu")}
    >
      <button
        ref={burgerButtonRef}
        className="burger-button"
        type="button"
        aria-label={
          isOpen ? t("navigation.closeMenu") : t("navigation.openMenu")
        }
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <ul className="menu-list" id="mobile-menu">
        {links.map(([to, key]) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) => (isActive ? "active" : undefined)}
              onClick={handleLinkClick}
            >
              <span>{t(key)}</span>
              {translators.map((translate, index) => (
                <span
                  key={UI_LANGUAGES[index]}
                  className="nav-label-sizer"
                  aria-hidden="true"
                >
                  {translate(key)}
                </span>
              ))}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;
