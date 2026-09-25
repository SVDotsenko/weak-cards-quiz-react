import { useEffect, useState } from "react";
import {
  BATCH_SIZE_STORAGE_KEY,
  DEFAULT_BATCH_SIZE,
  START_ROUTE_STORAGE_KEY,
  STORAGE_KEY,
  buildQuizBatch,
  clearStoredCards,
  getExportableCards,
  getStoredCards,
  mergeUniqueImportedCards,
  normalizeBatchSize,
  normalizeStartRoute,
  parseImportedCards,
  saveCards,
  shuffleOptions,
} from "../cards";
import {
  DEFAULT_UI_LANGUAGE,
  UI_LANGUAGE_STORAGE_KEY,
  getTranslator,
  normalizeUILanguage,
} from "../i18n";
import { AppContext } from "./context";

const SAMPLE_CARDS_URL = `${import.meta.env.BASE_URL}sample.json`;

export function AppProvider({ children }) {
  const [cards, setCards] = useState(getStoredCards);
  const [filter, setFilter] = useState("all");
  const [batchSize, setBatchSize] = useState(() =>
    normalizeBatchSize(
      localStorage.getItem(BATCH_SIZE_STORAGE_KEY),
      DEFAULT_BATCH_SIZE,
    ),
  );
  const [toast, setToast] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [startRoute, setStartRoute] = useState(() =>
    normalizeStartRoute(localStorage.getItem(START_ROUTE_STORAGE_KEY)),
  );
  const [uiLanguage, setUILanguage] = useState(() =>
    normalizeUILanguage(
      localStorage.getItem(UI_LANGUAGE_STORAGE_KEY) || DEFAULT_UI_LANGUAGE,
    ),
  );
  const t = getTranslator(uiLanguage);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) loadSampleCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function notify(message, type = "success") {
    setToast({ message, type });
  }

  async function loadSampleCards() {
    if (!import.meta.env.PROD) {
      notify(t("notifications.localSampleUnavailable"), "error");
      return;
    }

    try {
      const response = await fetch(SAMPLE_CARDS_URL);
      if (!response.ok) throw new Error(t("notifications.sampleNotFound"));
      const result = parseImportedCards(JSON.parse(await response.text()));
      if (!result.cards.length) throw new Error(t("notifications.sampleEmpty"));
      setCards(result.cards);
      saveCards(result.cards);
      notify(t("notifications.sampleLoaded", { count: result.cards.length }));
    } catch (error) {
      notify(
        t("notifications.sampleLoadFailed", { error: error.message }),
        "error",
      );
    }
  }

  function updateCards(nextCards) {
    setCards(nextCards);
    saveCards(nextCards);
  }

  function deleteAllCards() {
    clearStoredCards();
    setCards([]);
    setQuiz(null);
    notify(t("notifications.cardsDeleted"));
  }

  async function importFiles(files) {
    if (!files.length) {
      notify(t("notifications.selectFile"), "error");
      return;
    }

    const imported = [];
    const invalidTitles = [];
    const fileErrors = [];

    for (const file of files) {
      try {
        const parsed = JSON.parse(await file.text());
        const result = parseImportedCards(parsed);
        if (!result.cards.length)
          throw new Error(t("notifications.invalidFile"));
        imported.push(...result.cards);
        invalidTitles.push(...result.invalidTitles);
      } catch (error) {
        fileErrors.push(
          `${file.name || t("notifications.unnamedFile")}: ${error.message}`,
        );
      }
    }

    const merged = mergeUniqueImportedCards(cards, imported);
    updateCards(merged.cards);

    const details = [
      t("notifications.added", { count: merged.cards.length - cards.length }),
      t("notifications.duplicates", {
        count: merged.duplicateTitles.length,
      }),
    ];
    if (invalidTitles.length)
      details.push(
        t("notifications.invalidCards", { titles: invalidTitles.join("; ") }),
      );
    if (fileErrors.length)
      details.push(
        t("notifications.fileErrors", { errors: fileErrors.join("; ") }),
      );
    notify(
      details.join(". "),
      fileErrors.length || invalidTitles.length ? "error" : "success",
    );
  }

  function exportCards() {
    const data = getExportableCards(cards);
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "weak-cards-quiz.json";
    link.click();
    URL.revokeObjectURL(url);
    notify(t("notifications.exported", { count: cards.length }));
  }

  function startQuiz() {
    const batch = buildQuizBatch(cards, Math.min(batchSize, cards.length));
    if (!batch.length) {
      notify(t("notifications.noCardsForQuiz"), "error");
      return false;
    }

    const quizCards = batch.map((card) => {
      const shuffledOptionIds = shuffleOptions(card.en.options).map(
        ([optionId]) => optionId,
      );
      return {
        ...card,
        shuffledOptions: {
          en: shuffledOptionIds.map((optionId) => [
            optionId,
            card.en.options[optionId],
          ]),
          ru: shuffledOptionIds.map((optionId) => [
            optionId,
            card.ru.options[optionId],
          ]),
        },
      };
    });

    setQuiz({
      cards: quizCards,
      index: 0,
      selected: null,
      answered: false,
      correct: 0,
      wrong: 0,
    });
    return true;
  }

  function answerQuiz() {
    if (!quiz.selected) {
      notify(t("notifications.selectAnswer"), "error");
      return;
    }

    const card = quiz.cards[quiz.index];
    const isCorrect = quiz.selected === card.correctOptionId;
    const updated = cards.map((stored) =>
      stored.id === card.id
        ? {
            ...stored,
            stats: {
              ...stored.stats,
              timesShown: stored.stats.timesShown + 1,
              timesWrong: stored.stats.timesWrong + (isCorrect ? 0 : 1),
              lastAttemptCorrect: isCorrect,
              lastSelectedOptionId: quiz.selected,
            },
          }
        : stored,
    );

    updateCards(updated);
    setQuiz({
      ...quiz,
      answered: true,
      correct: quiz.correct + (isCorrect ? 1 : 0),
      wrong: quiz.wrong + (isCorrect ? 0 : 1),
    });
  }

  function nextQuestion() {
    if (quiz.index >= quiz.cards.length - 1) {
      setQuiz(null);
      return;
    }
    setQuiz({
      ...quiz,
      index: quiz.index + 1,
      selected: null,
      answered: false,
    });
  }

  function resetStats() {
    const updated = cards.map((card) => ({
      ...card,
      stats: {
        timesShown: 0,
        timesWrong: 0,
        lastAttemptCorrect: null,
        lastSelectedOptionId: null,
      },
    }));
    updateCards(updated);
    setQuiz(null);
    notify(t("notifications.statsReset"));
  }

  function changeBatchSize(value) {
    const nextSize = normalizeBatchSize(value);
    setBatchSize(nextSize);
    localStorage.setItem(BATCH_SIZE_STORAGE_KEY, String(nextSize));
  }

  function changeStartRoute(value) {
    const nextRoute = normalizeStartRoute(value);
    setStartRoute(nextRoute);
    localStorage.setItem(START_ROUTE_STORAGE_KEY, nextRoute);
  }

  function changeUILanguage(value) {
    const nextLanguage = normalizeUILanguage(value);
    setUILanguage(nextLanguage);
    localStorage.setItem(UI_LANGUAGE_STORAGE_KEY, nextLanguage);
  }

  return (
    <AppContext.Provider
      value={{
        cards,
        filter,
        setFilter,
        batchSize,
        changeBatchSize,
        startRoute,
        changeStartRoute,
        uiLanguage,
        changeUILanguage,
        t,
        notify,
        toast,
        quiz,
        setQuiz,
        importFiles,
        exportCards,
        deleteAllCards,
        loadSampleCards,
        startQuiz,
        answerQuiz,
        nextQuestion,
        resetStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
