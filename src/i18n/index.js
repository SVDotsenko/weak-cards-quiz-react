export const UI_LANGUAGE_STORAGE_KEY = "weak-cards-quiz.ui-language";
export const UI_LANGUAGES = ["en", "ru"];
export const DEFAULT_UI_LANGUAGE = "en";

const translations = {
    en: {
        navigation: { cards: "All cards", quiz: "Quiz", settings: "Settings", about: "About", menu: "Main menu", openMenu: "Open menu", closeMenu: "Close menu" },
        settings: { title: "Settings", startPage: "Page to open on launch", interfaceLanguage: "Interface language", english: "English", russian: "Russian", routeCards: "All cards", routeQuiz: "Quiz", routeAbout: "About" },
        cards: { import: "Import JSON", export: "Export JSON", resetStats: "Reset statistics", deleteAll: "Delete all cards", loadSample: "Load sample cards", showErrors: "Show cards with errors", showAll: "Show all cards", errors: "With errors", empty: "No cards found. Import a JSON file to get started.", confirmDelete: "Delete all cards permanently?", cardLanguage: "Russian", cardLanguageEnglish: "English", mistakes: "Mistakes: {count}", studied: "Times studied: {count}" },
        stats: { total: "Total cards", problems: "Problem cards", studied: "Studied", answered: "Answered" },
        quiz: { notStarted: "The quiz has not started yet.", batchSize: "Batch size", start: "Start quiz", card: "Card {current} of {total}", answer: "Answer", next: "Next card" },
        about: {
            purposeTitle: "Why was this app created?",
            purpose: "This app does not replace the official app for preparing for the Irish driving theory test. It complements it by making it easy to select only difficult cards and practise with them.",
            audienceTitle: "Who is it for?",
            audience: "It is designed for Russian-speaking people preparing for the Irish driving theory test and taking it in English.",
            usageTitle: "How to use it",
            usage: ["Complete all questions in the official app.", "Open the Previously answered incorrectly tab to find the questions you answered incorrectly.", "Take screenshots of all those difficult questions.", "Send no more than 15 cards in one request to an AI together with the prompt below so it can create a JSON file.", "Import the resulting JSON files into this app.", "Continue practising only with the difficult questions."],
            featuresTitle: "Key features and how it works",
            features: [["Duplicate protection", "The app checks new cards when they are imported. It compares the English question and correct answer, so an existing card is not added again."], ["Difficult cards first", "The first quiz uses cards in their selected order. After an answer, the app records mistakes and correct options. The next quiz starts with cards missed in the last attempt, followed by cards you have not answered yet."], ["Russian view", "You can switch any card to Russian and read the full translation of the question and answer options instead of guessing their meaning."], ["Shuffled options", "Answer options are shuffled before each quiz. The correct answer can appear in a different position, so you learn the answer rather than its position."], ["Local data storage", "The app has no backend. Cards and statistics are stored in the browser's localStorage and are available only on this device and browser. Export the cards to move them to another device."]],
            copyPrompt: "Copy", promptCopied: "Prompt copied to clipboard.", promptCopyFailed: "Could not copy the prompt to the clipboard."
        },
        notFound: { title: "Page not found", back: "Back to cards" },
        notifications: { localSampleUnavailable: "Sample cards are not loaded in local development. Import cards manually.", sampleNotFound: "sample.json was not found", sampleEmpty: "sample.json does not contain any cards", sampleLoaded: "Sample cards loaded: {count}.", sampleLoadFailed: "Could not load sample cards: {error}.", cardsDeleted: "All cards deleted.", selectFile: "Select at least one JSON file before importing.", invalidFile: "The file does not contain valid cards", unnamedFile: "Unnamed file", added: "Added: {count}", duplicates: "Duplicates skipped: {count}", invalidCards: "Could not import: {titles}", fileErrors: "File errors: {errors}", exported: "Cards exported: {count}.", noCardsForQuiz: "There are no cards to create a batch.", selectAnswer: "Select an answer.", statsReset: "Statistics reset." }
    },
    ru: {
        navigation: { cards: "Все карточки", quiz: "Тест", settings: "Настройки", about: "О приложении", menu: "Основное меню", openMenu: "Открыть меню", closeMenu: "Закрыть меню" },
        settings: { title: "Настройки", startPage: "Страница при входе в приложение", interfaceLanguage: "Язык интерфейса", english: "English", russian: "Русский", routeCards: "Все карточки", routeQuiz: "Тест", routeAbout: "О приложении" },
        cards: { import: "Загрузить JSON-файл", export: "Экспортировать JSON", resetStats: "Обнулить статистику", deleteAll: "Удалить все карточки", loadSample: "Загрузить тестовые карточки", showErrors: "Показать карточки с ошибками", showAll: "Показать все карточки", errors: "С ошибками", empty: "Карточки не найдены. Загрузите JSON-файл, чтобы начать.", confirmDelete: "Удалить все карточки безвозвратно?", cardLanguage: "Русский", cardLanguageEnglish: "English", mistakes: "Ошибок: {count}", studied: "Изучений: {count}" },
        stats: { total: "Всего карточек", problems: "Проблемных", studied: "Изучено", answered: "Отвечено" },
        quiz: { notStarted: "Тест ещё не начат.", batchSize: "Размер батча", start: "Начать тест", card: "Карточка {current} из {total}", answer: "Ответить", next: "Следующая карточка" },
        about: {
            purposeTitle: "Зачем создано это приложение?",
            purpose: "Это приложение не заменяет официальное приложение для подготовки к теоретическому тесту на вождение в Ирландии, а дополняет его. В нём удобно отбирать только сложные карточки и заниматься по ним.",
            audienceTitle: "Для кого?",
            audience: "Для русскоязычных людей, которые готовятся к теоретическому тесту на вождение в Ирландии и будут сдавать его на английском языке.",
            usageTitle: "Как пользоваться?",
            usage: ["Пройдите все вопросы в официальном приложении.", "Откройте вкладку Previously answered incorrectly с вопросами, на которые вы ответили неправильно.", "Сделайте скриншоты всех этих проблемных вопросов.", "Передайте ИИ не более 15 карточек за один запрос вместе с промптом ниже, чтобы он создал JSON-файл.", "Загрузите полученные JSON-файлы в это приложение.", "Продолжайте тренировку только по проблемным вопросам."],
            featuresTitle: "Основные возможности и принцип работы",
            features: [["Защита от дубликатов", "Приложение проверяет новые карточки при загрузке по тексту вопроса и правильного ответа на английском языке, поэтому существующая карточка не добавляется повторно."], ["Приоритет сложных карточек", "В первом тесте карточки идут по порядку. После ответа приложение записывает ошибки и правильные варианты. В следующем тесте сначала появляются карточки с ошибкой в последней попытке, а затем карточки, на которые вы ещё не отвечали."], ["Просмотр на русском языке", "В любой карточке можно переключиться на русский язык и посмотреть полный перевод вопроса и вариантов ответа, чтобы не угадывать смысл."], ["Случайный порядок вариантов", "Перед каждым запуском теста варианты ответов перемешиваются. Правильный ответ может оказаться на другой позиции, поэтому нужно запоминать сам ответ, а не его расположение."], ["Локальное хранение данных", "У приложения нет бэкенда. Карточки и статистика сохраняются в localStorage браузера и доступны только на этом устройстве и в этом браузере. Для переноса на другое устройство экспортируйте карточки."]],
            copyPrompt: "Копировать", promptCopied: "Промпт успешно скопирован в буфер обмена.", promptCopyFailed: "Не удалось скопировать промпт в буфер обмена."
        },
        notFound: { title: "Страница не найдена", back: "Вернуться к карточкам" },
        notifications: { localSampleUnavailable: "Тестовые карточки не загружаются в локальном режиме. Загрузите карточки вручную.", sampleNotFound: "файл sample.json не найден", sampleEmpty: "файл sample.json не содержит карточек", sampleLoaded: "Загружены тестовые карточки: {count}.", sampleLoadFailed: "Не удалось загрузить тестовые карточки: {error}.", cardsDeleted: "Все карточки удалены.", selectFile: "Выберите хотя бы один JSON-файл перед загрузкой.", invalidFile: "файл не содержит корректных карточек", unnamedFile: "Безымянный файл", added: "Добавлено: {count}", duplicates: "Дублей пропущено: {count}", invalidCards: "Не удалось импортировать: {titles}", fileErrors: "Ошибки файлов: {errors}", exported: "Экспортировано карточек: {count}.", noCardsForQuiz: "Нет карточек для формирования батча.", selectAnswer: "Выберите вариант ответа.", statsReset: "Статистика обнулена." }
    }
};

export function normalizeUILanguage(value) {
    return UI_LANGUAGES.includes(value) ? value : DEFAULT_UI_LANGUAGE;
}

function formatMessage(message, params = {}) {
    return message.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`));
}

export function getTranslator(language) {
    const dictionary = translations[normalizeUILanguage(language)];
    return (key, params) => {
        const value = key.split(".").reduce((current, part) => current?.[part], dictionary);
        return formatMessage(typeof value === "string" ? value : key, params);
    };
}

export function getTranslationGroup(language, group) {
    return translations[normalizeUILanguage(language)][group];
}