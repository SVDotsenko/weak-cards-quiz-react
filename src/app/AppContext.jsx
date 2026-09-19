import { useEffect, useState } from 'react'
import {
  BATCH_SIZE_STORAGE_KEY,
  DEFAULT_BATCH_SIZE,
  EXPORT_FORMAT_STORAGE_KEY,
  STORAGE_KEY,
  buildQuizBatch,
  getExportableCards,
  getStoredCards,
  mergeUniqueImportedCards,
  normalizeBatchSize,
  parseImportedCards,
  saveCards,
  shuffleOptions,
} from '../cards'
import { AppContext } from './context'

export function AppProvider({ children }) {
  const [cards, setCards] = useState(getStoredCards)
  const [filter, setFilter] = useState('all')
  const [batchSize, setBatchSize] = useState(() => normalizeBatchSize(localStorage.getItem(BATCH_SIZE_STORAGE_KEY), DEFAULT_BATCH_SIZE))
  const [toast, setToast] = useState(null)
  const [quiz, setQuiz] = useState(null)

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(null), 4200)
    return () => clearTimeout(timer)
  }, [toast])

  function notify(message, type = 'success') {
    setToast({ message, type })
  }

  function updateCards(nextCards) {
    setCards(nextCards)
    saveCards(nextCards)
  }

  async function importFiles(files) {
    if (!files.length) {
      notify('Выберите хотя бы один JSON-файл перед загрузкой.', 'error')
      return
    }

    const imported = []
    const invalidTitles = []
    const fileErrors = []
    let format = null

    for (const file of files) {
      try {
        const parsed = JSON.parse(await file.text())
        const result = parseImportedCards(parsed)
        if (!result.cards.length) throw new Error('файл не содержит корректных карточек')
        imported.push(...result.cards)
        invalidTitles.push(...result.invalidTitles)
        format = Array.isArray(parsed) ? 'array' : 'object'
      } catch (error) {
        fileErrors.push(`${file.name || 'Безымянный файл'}: ${error.message}`)
      }
    }

    const merged = mergeUniqueImportedCards(cards, imported)
    updateCards(merged.cards)
    if (format) localStorage.setItem(EXPORT_FORMAT_STORAGE_KEY, format)

    const details = [`Добавлено: ${merged.cards.length - cards.length}`, `Дублей пропущено: ${merged.duplicateTitles.length}`]
    if (invalidTitles.length) details.push(`Не удалось импортировать: ${invalidTitles.join('; ')}`)
    if (fileErrors.length) details.push(`Ошибки файлов: ${fileErrors.join('; ')}`)
    notify(details.join('. '), fileErrors.length || invalidTitles.length ? 'error' : 'success')
  }

  function exportCards() {
    const data = getExportableCards(cards)
    const output = localStorage.getItem(EXPORT_FORMAT_STORAGE_KEY) === 'object' ? { cards: data } : data
    const url = URL.createObjectURL(new Blob([JSON.stringify(output, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'weak-cards-quiz.json'
    link.click()
    URL.revokeObjectURL(url)
    notify(`Экспортировано карточек: ${cards.length}.`)
  }

  function startQuiz() {
    const batch = buildQuizBatch(cards, Math.min(batchSize, cards.length))
    if (!batch.length) {
      notify('Нет карточек для формирования батча.', 'error')
      return false
    }

    const quizCards = batch.map((card) => {
      const shuffledOptionIds = shuffleOptions(card.en.options).map(([optionId]) => optionId)
      return {
        ...card,
        shuffledOptions: {
          en: shuffledOptionIds.map((optionId) => [optionId, card.en.options[optionId]]),
          ru: shuffledOptionIds.map((optionId) => [optionId, card.ru.options[optionId]]),
        },
      }
    })

    setQuiz({ cards: quizCards, index: 0, selected: null, answered: false, mistakes: [], correct: 0, wrong: 0 })
    return true
  }

  function answerQuiz() {
    if (!quiz.selected) {
      notify('Выберите вариант ответа.', 'error')
      return
    }

    const card = quiz.cards[quiz.index]
    const isCorrect = quiz.selected === card.correctOptionId
    const updated = cards.map((stored) => stored.id === card.id
      ? { ...stored, stats: { ...stored.stats, timesShown: stored.stats.timesShown + 1, timesCorrect: stored.stats.timesCorrect + (isCorrect ? 1 : 0), timesWrong: stored.stats.timesWrong + (isCorrect ? 0 : 1), lastAttemptCorrect: isCorrect } }
      : stored)

    updateCards(updated)
    setQuiz({ ...quiz, answered: true, correct: quiz.correct + (isCorrect ? 1 : 0), wrong: quiz.wrong + (isCorrect ? 0 : 1), mistakes: isCorrect ? quiz.mistakes : [...quiz.mistakes, { card, selected: quiz.selected }] })
  }

  function nextQuestion() {
    if (quiz.index >= quiz.cards.length - 1) {
      setQuiz({ ...quiz, done: true })
      return
    }
    setQuiz({ ...quiz, index: quiz.index + 1, selected: null, answered: false })
  }

  function clearCards() {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(EXPORT_FORMAT_STORAGE_KEY)
    setCards([])
    setQuiz(null)
    notify('Все карточки удалены.')
  }

  function changeBatchSize(value) {
    const nextSize = normalizeBatchSize(value)
    setBatchSize(nextSize)
    localStorage.setItem(BATCH_SIZE_STORAGE_KEY, String(nextSize))
  }

  return <AppContext.Provider value={{ cards, filter, setFilter, batchSize, changeBatchSize, toast, quiz, setQuiz, importFiles, exportCards, startQuiz, answerQuiz, nextQuestion, clearCards }}>{children}</AppContext.Provider>
}