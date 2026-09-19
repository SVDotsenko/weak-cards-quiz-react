import { useEffect, useState } from 'react'
import { BATCH_SIZE_STORAGE_KEY, DEFAULT_BATCH_SIZE, EXPORT_FORMAT_STORAGE_KEY, buildQuizBatch, calculateOverallStats, filterCards, getExportableCards, getStoredCards, mergeUniqueImportedCards, normalizeBatchSize, parseImportedCards, saveCards, shuffleOptions } from './cards'
import './App.css'

function Toast({ toast }) { return toast && <div className={`toast ${toast.type}`} role="status">{toast.message}</div> }

function CardView({ card, index, review, selectedOptionId }) {
  const [language, setLanguage] = useState('en'); const content = card[language] || card.en
  return <article className="card-item"><div className="card-header"><h3>Карточка {index + 1}</h3><button className="language-button" onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}>{language === 'en' ? 'Русский' : 'English'}</button></div><p className="question">{content.question}</p><ul className="option-list">{Object.entries(content.options).map(([id, text]) => <li key={id} className={`${id === card.correctOptionId && review ? 'correct-option' : ''} ${id === selectedOptionId && id !== card.correctOptionId ? 'wrong-option' : ''}`}>{text}</li>)}</ul>{!review && <div className="card-meta"><span>Верно: {card.stats.timesCorrect}</span><span>Неверно: {card.stats.timesWrong}</span></div>}</article>
}

function Stats({ cards }) { const stats = calculateOverallStats(cards); return <div className="stats-grid">{[['Всего карточек', stats.totalCount], ['Проблемных', stats.problemCount], ['Изучено', `${stats.studiedPercent}%`], ['Отвечено', stats.answeredCount]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div> }

function App() {
  const [cards, setCards] = useState(getStoredCards); const [filter, setFilter] = useState('all'); const [batchSize, setBatchSize] = useState(() => normalizeBatchSize(localStorage.getItem(BATCH_SIZE_STORAGE_KEY), DEFAULT_BATCH_SIZE)); const [toast, setToast] = useState(null); const [quiz, setQuiz] = useState(null)
  const visibleCards = filterCards(cards, filter); const notify = (message, type = 'success') => setToast({ message, type }); const updateCards = (next) => { setCards(next); saveCards(next) }
  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(null), 4200); return () => clearTimeout(timer) } }, [toast])

  async function importFiles(files) {
    if (!files.length) { notify('Выберите хотя бы один JSON-файл перед загрузкой.', 'error'); return }
    const imported = []; const invalidTitles = []; const fileErrors = []; let format = null
    for (const file of files) { try { const parsed = JSON.parse(await file.text()); const result = parseImportedCards(parsed); if (!result.cards.length) throw new Error('файл не содержит корректных карточек'); imported.push(...result.cards); invalidTitles.push(...result.invalidTitles); format = Array.isArray(parsed) ? 'array' : 'object' } catch (error) { fileErrors.push(`${file.name || 'Безымянный файл'}: ${error.message}`) } }
    const merged = mergeUniqueImportedCards(cards, imported); updateCards(merged.cards); if (format) localStorage.setItem(EXPORT_FORMAT_STORAGE_KEY, format)
    const details = [`Добавлено: ${merged.cards.length - cards.length}`, `Дублей пропущено: ${merged.duplicateTitles.length}`]; if (invalidTitles.length) details.push(`Не удалось импортировать: ${invalidTitles.join('; ')}`); if (fileErrors.length) details.push(`Ошибки файлов: ${fileErrors.join('; ')}`); notify(details.join('. '), fileErrors.length || invalidTitles.length ? 'error' : 'success')
  }
  function exportCards() { const data = getExportableCards(cards); const output = localStorage.getItem(EXPORT_FORMAT_STORAGE_KEY) === 'object' ? { cards: data } : data; const url = URL.createObjectURL(new Blob([JSON.stringify(output, null, 2)], { type: 'application/json' })); const link = document.createElement('a'); link.href = url; link.download = 'weak-cards-quiz.json'; link.click(); URL.revokeObjectURL(url); notify(`Экспортировано карточек: ${cards.length}.`) }
  function startQuiz() {
    const batch = buildQuizBatch(cards, Math.min(batchSize, cards.length))
    if (!batch.length) { notify('Нет карточек для формирования батча.', 'error'); return }
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
  }
  function answer() { if (!quiz.selected) { notify('Выберите вариант ответа.', 'error'); return } const card = quiz.cards[quiz.index]; const isCorrect = quiz.selected === card.correctOptionId; const updated = cards.map((stored) => stored.id === card.id ? { ...stored, stats: { ...stored.stats, timesShown: stored.stats.timesShown + 1, timesCorrect: stored.stats.timesCorrect + (isCorrect ? 1 : 0), timesWrong: stored.stats.timesWrong + (isCorrect ? 0 : 1), lastAttemptCorrect: isCorrect } } : stored); updateCards(updated); setQuiz({ ...quiz, answered: true, correct: quiz.correct + (isCorrect ? 1 : 0), wrong: quiz.wrong + (isCorrect ? 0 : 1), mistakes: isCorrect ? quiz.mistakes : [...quiz.mistakes, { card, selected: quiz.selected }] }) }
  function nextQuestion() { if (quiz.index >= quiz.cards.length - 1) { setQuiz({ ...quiz, done: true }); return } setQuiz({ ...quiz, index: quiz.index + 1, selected: null, answered: false }) }

  return (
    <div className="app-shell"><header><p className="eyebrow">Category D Theory</p><h1>Проблемные карточки</h1></header><main><section className="panel controls-panel"><div className="control-row"><label className="file-picker"><input type="file" accept="application/json" multiple onChange={(event) => importFiles([...event.target.files])} />Загрузить JSON-файл</label><button onClick={startQuiz} disabled={!cards.length}>Начать тест</button><button onClick={exportCards}>Экспортировать JSON</button><button onClick={() => { localStorage.removeItem('weak-cards-quiz.cards'); localStorage.removeItem(EXPORT_FORMAT_STORAGE_KEY); setCards([]); notify('Все карточки удалены.') }}>Удалить все карточки</button></div><div className="batch-row"><label>Размер батча <input type="number" min="1" max="100" value={batchSize} onChange={(event) => { const value = normalizeBatchSize(event.target.value); setBatchSize(value); localStorage.setItem(BATCH_SIZE_STORAGE_KEY, String(value)) }} /></label><select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">Все карточки</option><option value="problem">Проблемные</option><option value="errors">С ошибками</option></select></div></section>{quiz && !quiz.done && <section className="panel quiz-panel"><div className="panel-header"><h2>Тестирование</h2><span>Карточка {quiz.index + 1} из {quiz.cards.length}</span></div><QuizCard key={quiz.cards[quiz.index].id} card={quiz.cards[quiz.index]} quiz={quiz} setQuiz={setQuiz} /><button className="primary-button quiz-action" disabled={!quiz.selected && !quiz.answered} onClick={quiz.answered ? nextQuestion : answer}>{quiz.answered ? 'Следующая карточка' : 'Ответить'}</button></section>}{quiz?.done && <section className="panel"><h2>Батч завершён</h2><p>Правильных ответов: <strong>{quiz.correct}</strong></p><p>Неправильных ответов: <strong>{quiz.wrong}</strong></p>{quiz.mistakes.length ? <div className="cards-list">{quiz.mistakes.map((item, index) => <CardView key={item.card.id} card={item.card} index={index} review selectedOptionId={item.selected} />)}</div> : <p className="empty-state">Ошибок нет.</p>}</section>}<section className="panel"><div className="panel-header"><h2>Карточки</h2><span>{visibleCards.length} карточек</span></div><Stats cards={cards} />{visibleCards.length ? <div className="cards-list">{visibleCards.map((card, index) => <CardView key={card.id} card={card} index={index} />)}</div> : <p className="empty-state">Пока нет карточек. Загрузите JSON-файл, чтобы начать.</p>}</section></main><Toast toast={toast} /></div>
  )
}


function QuizCard({ card, quiz, setQuiz }) { const [language, setLanguage] = useState('en'); const content = card[language] || card.en; const options = card.shuffledOptions[language] || []; return <div className="quiz-card"><div className="card-header"><h3>{content.question}</h3><button className="language-button" onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}>{language === 'en' ? 'Русский' : 'English'}</button></div><div className="quiz-options">{options.map(([id, text]) => <label key={id} className={quiz.answered && id === card.correctOptionId ? 'answer-correct' : quiz.answered && id === quiz.selected ? 'answer-wrong' : ''}><input type="radio" name="quiz-answer" value={id} checked={quiz.selected === id} disabled={quiz.answered} onChange={() => setQuiz({ ...quiz, selected: id })} />{text}</label>)}</div></div> }
export default App
