export const STORAGE_KEY = 'weak-cards-quiz.cards'
export const BATCH_SIZE_STORAGE_KEY = 'weak-cards-quiz.batch-size'
export const DEFAULT_BATCH_SIZE = 10
export const CORRECT_TO_LEARN_STORAGE_KEY = 'weak-cards-quiz.correct-answers-to-learn'
export const DEFAULT_CORRECT_TO_LEARN = 3
export const START_ROUTE_STORAGE_KEY = 'weak-cards-quiz.start-route'
export const START_ROUTE_OPTIONS = ['/cards', '/quiz', '/about']
export const DEFAULT_START_ROUTE = '/about'

export function normalizeBatchSize(value, fallback = DEFAULT_BATCH_SIZE) {
    const parsed = Number(value)
    return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : fallback
}

export function normalizeCorrectToLearn(value, fallback = DEFAULT_CORRECT_TO_LEARN) {
    const parsed = Number(value)
    return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : fallback
}

export function normalizeStartRoute(value, fallback = DEFAULT_START_ROUTE) {
    return START_ROUTE_OPTIONS.includes(value) ? value : fallback
}

export function normalizeCards(rawCards) {
    if (!Array.isArray(rawCards)) throw new Error('JSON должен содержать массив карточек.')
    const usedIds = new Set()
    return rawCards.map((card, index) => {
        let id = String(card.id ?? `card-${index + 1}`)
        while (usedIds.has(id)) id = `card-${index + 1}-${usedIds.size}`
        usedIds.add(id)
        return {
            ...card,
            id,
            en: { question: card.en?.question ?? 'Нет вопроса', options: card.en?.options ?? {} },
            ru: { question: card.ru?.question ?? 'Нет перевода', options: card.ru?.options ?? {} },
            correctOptionId: card.correctOptionId ?? Object.keys(card.en?.options ?? {})[0] ?? 'opt1',
            stats: { timesShown: Number(card.stats?.timesShown ?? 0), timesCorrect: Number(card.stats?.timesCorrect ?? 0), lastSelectedOptionId: card.stats?.lastSelectedOptionId ?? null },
        }
    })
}

export function validateImportedCard(card, index) {
    const title = String(card?.en?.question || card?.question || `Карточка ${index + 1}`)
    const hasLanguage = (language) => language && typeof language === 'object' && typeof language.question === 'string' && language.question.trim() && language.options && typeof language.options === 'object' && !Array.isArray(language.options) && Object.keys(language.options).length > 0
    const correct = String(card?.correctOptionId ?? '')
    const valid = card && typeof card === 'object' && !Array.isArray(card) && hasLanguage(card.en) && hasLanguage(card.ru) && correct && Object.hasOwn(card.en.options, correct) && Object.hasOwn(card.ru.options, correct)
    return { valid: Boolean(valid), title }
}

export function parseImportedCards(raw) {
    if (!Array.isArray(raw)) throw new Error('JSON должен содержать массив карточек.')
    const invalidTitles = []
    const validCards = raw.flatMap((card, index) => {
        const validation = validateImportedCard(card, index)
        if (!validation.valid) { invalidTitles.push(validation.title); return [] }
        return [card]
    })
    return { cards: normalizeCards(validCards), invalidTitles }
}

export function normalizeDuplicateValue(value) { return String(value ?? '').toLocaleLowerCase().replace(/\s+/g, '') }
export function getCardDuplicateKey(card) {
    const correctAnswerText = card.en?.options?.[card.correctOptionId] ?? ''
    return `${normalizeDuplicateValue(card.en?.question)}::${normalizeDuplicateValue(correctAnswerText)}`
}

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
export function clearStoredCards() { localStorage.removeItem(STORAGE_KEY) }
export function getCardStatus(card, correctAnswersToLearn = DEFAULT_CORRECT_TO_LEARN) {
    const timesShown = Number(card.stats?.timesShown ?? 0)
    const timesCorrect = Number(card.stats?.timesCorrect ?? 0)
    if (timesShown === 0) return 'new'
    // Equal counts mean this card has never had an incorrect answer.
    if (timesShown === timesCorrect || timesCorrect >= correctAnswersToLearn) return 'learned'
    if (timesCorrect === 0) return 'problem'
    return 'learning'
}

export function calculateOverallStats(cards, correctAnswersToLearn = DEFAULT_CORRECT_TO_LEARN) {
    const statuses = cards.map((card) => getCardStatus(card, correctAnswersToLearn))
    const totalCount = cards.length
    const shownCount = cards.filter((card) => Number(card.stats?.timesShown ?? 0) > 0).length
    const studiedCount = statuses.filter((status) => status === 'learned').length
    return {
        totalCount,
        shownCount,
        shownPercent: totalCount ? Math.round((shownCount / totalCount) * 100) : 0,
        studiedCount,
        studiedPercent: totalCount ? Math.round((studiedCount / totalCount) * 100) : 0,
        cardsWithErrorsCount: statuses.filter((status) => status === 'problem' || status === 'learning').length,
        lastIncorrectCount: statuses.filter((status) => status === 'problem').length,
        isInitialPhase: statuses.includes('new'),
    }
}

export function filterCards(cards, filter, correctAnswersToLearn = DEFAULT_CORRECT_TO_LEARN) {
    if (filter === 'errors') {
        return cards.filter((card) => {
            const status = getCardStatus(card, correctAnswersToLearn)
            return status === 'problem' || status === 'learning'
        })
    }
    if (filter === 'problem') return cards.filter((card) => getCardStatus(card, correctAnswersToLearn) === 'problem')
    return cards
}

function compareShownDescending(first, second) {
    return Number(second.stats?.timesShown ?? 0) - Number(first.stats?.timesShown ?? 0)
}

export function sortCardsForDisplay(cards) {
    const recentIncorrect = []
    const neverIncorrect = []
    const otherCards = []

    for (const card of cards) {
        const timesShown = Number(card.stats?.timesShown ?? 0)
        const timesCorrect = Number(card.stats?.timesCorrect ?? 0)
        if (card.stats?.lastSelectedOptionId != null && card.stats.lastSelectedOptionId !== card.correctOptionId) {
            recentIncorrect.push(card)
        } else if (timesShown > 0 && timesShown === timesCorrect) {
            neverIncorrect.push(card)
        } else {
            otherCards.push(card)
        }
    }

    return [recentIncorrect, otherCards, neverIncorrect]
        .map((group) => group.sort(compareShownDescending))
        .flat()
}

function shuffleCards(cards) {
    const shuffled = [...cards]
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1))
            ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
    }
    return shuffled
}

export function buildQuizBatch(cards, requestedCount, correctAnswersToLearn = DEFAULT_CORRECT_TO_LEARN) {
    const unseen = cards.filter((card) => getCardStatus(card, correctAnswersToLearn) === 'new')
    const candidates = unseen.length
        ? unseen
        : cards.filter((card) => {
            const status = getCardStatus(card, correctAnswersToLearn)
            return status === 'problem' || status === 'learning'
        })
    return (unseen.length ? candidates : shuffleCards(candidates)).slice(0, requestedCount)
}
export function shuffleOptions(options) { return [...Object.entries(options || {})].sort(() => Math.random() - 0.5) }
export function getExportableCards(cards) {
    return cards.map((card) => {
        const exported = { ...card }
        delete exported.id
        return exported
    })
}