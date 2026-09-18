export const STORAGE_KEY = 'weak-cards-quiz.cards'
export const BATCH_SIZE_STORAGE_KEY = 'weak-cards-quiz.batch-size'
export const EXPORT_FORMAT_STORAGE_KEY = 'weak-cards-quiz.export-format'
export const DEFAULT_BATCH_SIZE = 10

export function normalizeBatchSize(value, fallback = DEFAULT_BATCH_SIZE) {
    const parsed = Number(value)
    return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : fallback
}

export function normalizeCards(rawCards) {
    const cards = Array.isArray(rawCards) ? rawCards : rawCards?.cards
    if (!Array.isArray(cards)) throw new Error('JSON должен содержать массив карточек или объект с массивом cards.')
    return cards.map((card, index) => ({
        ...card,
        id: String(card.id ?? `card-${index + 1}`),
        en: { question: card.en?.question ?? 'Нет вопроса', options: card.en?.options ?? {} },
        ru: { question: card.ru?.question ?? 'Нет перевода', options: card.ru?.options ?? {} },
        correctOptionId: card.correctOptionId ?? Object.keys(card.en?.options ?? {})[0] ?? 'opt1',
        stats: { timesShown: Number(card.stats?.timesShown ?? 0), timesCorrect: Number(card.stats?.timesCorrect ?? 0), timesWrong: Number(card.stats?.timesWrong ?? 0), lastAttemptCorrect: card.stats?.lastAttemptCorrect ?? null },
    }))
}

export function validateImportedCard(card, index) {
    const title = String(card?.en?.question || card?.question || `Карточка ${index + 1}`)
    const hasLanguage = (language) => language && typeof language === 'object' && typeof language.question === 'string' && language.question.trim() && language.options && typeof language.options === 'object' && !Array.isArray(language.options) && Object.keys(language.options).length > 0
    const correct = String(card?.correctOptionId ?? '')
    const valid = card && typeof card === 'object' && !Array.isArray(card) && hasLanguage(card.en) && hasLanguage(card.ru) && correct && Object.hasOwn(card.en.options, correct) && Object.hasOwn(card.ru.options, correct)
    return { valid: Boolean(valid), title }
}

export function parseImportedCards(raw) {
    const source = Array.isArray(raw) ? raw : raw?.cards
    if (!Array.isArray(source)) throw new Error('JSON должен содержать массив карточек или объект с массивом cards.')
    const invalidTitles = []
    const cards = source.flatMap((card, index) => {
        const validation = validateImportedCard(card, index)
        if (!validation.valid) { invalidTitles.push(validation.title); return [] }
        return normalizeCards([card])
    })
    return { cards, invalidTitles }
}

export function normalizeDuplicateValue(value) { return String(value ?? '').toLocaleLowerCase().replace(/\s+/g, '') }
export function getCardDuplicateKey(card) { return `${normalizeDuplicateValue(card.en?.question)}::${String(card.correctOptionId ?? '')}` }

function lastCardNumber(cards) {
    return cards.reduce((last, card) => {
        const match = String(card.id ?? '').match(/(\d+)$/)
        return match ? Math.max(last, Number(match[1])) : last
    }, 0)
}

export function mergeUniqueImportedCards(storedCards, importedCards) {
    const keys = new Set(storedCards.map(getCardDuplicateKey)); const duplicateTitles = []
    const unique = importedCards.filter((card) => { const key = getCardDuplicateKey(card); if (keys.has(key)) { duplicateTitles.push(card.en.question); return false } keys.add(key); return true })
    return { cards: [...storedCards, ...unique.map((card, index) => ({ ...card, id: String(lastCardNumber(storedCards) + index + 1) }))], duplicateTitles }
}

export function getStoredCards() { try { return normalizeCards(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')) } catch { localStorage.removeItem(STORAGE_KEY); return [] } }
export function saveCards(cards) { localStorage.setItem(STORAGE_KEY, JSON.stringify(cards)) }
export function calculateOverallStats(cards) {
    const studiedCount = cards.filter((card) => card.stats.timesShown > 0).length
    return { totalCount: cards.length, problemCount: cards.filter((card) => card.stats.lastAttemptCorrect === false).length, studiedPercent: cards.length ? Math.round((studiedCount / cards.length) * 100) : 0, answeredCount: cards.reduce((total, card) => total + card.stats.timesShown, 0) }
}
export function filterCards(cards, filter) { return filter === 'problem' ? cards.filter((card) => card.stats.lastAttemptCorrect === false) : filter === 'errors' ? cards.filter((card) => card.stats.timesWrong > 0) : cards }
export function buildQuizBatch(cards, requestedCount) {
    const prioritized = cards.filter((card) => card.stats.lastAttemptCorrect === false); const untouched = cards.filter((card) => card.stats.lastAttemptCorrect === null); const seen = new Set(prioritized.map((card) => card.id))
    return [...prioritized, ...untouched.filter((card) => !seen.has(card.id)), ...cards.filter((card) => !seen.has(card.id))].slice(0, requestedCount)
}
export function shuffleOptions(options) { return [...Object.entries(options || {})].sort(() => Math.random() - 0.5) }
export function getExportableCards(cards) {
    return cards.map((card) => {
        const exported = { ...card }
        delete exported.id
        delete exported.stats
        return exported
    })
}