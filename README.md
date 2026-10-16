**🇬🇧 English** | [🇷🇺 Русский](README.ru.md)

# Weak Cards Quiz

Weak Cards Quiz is a browser app for practising difficult questions from the Irish driving theory test. It is designed for Russian-speaking learners who take the official test in English.

The app complements the official theory-test app. Its main purpose is to collect questions you repeatedly get wrong and practise them separately.

## How the app works

- Quizzes use batches of the size set on the Quiz page (10 by default). A quiz never contains more cards than you have.
- The app chooses the phase automatically each time a quiz starts; you cannot switch phases manually. As long as unseen cards remain, it runs Phase 1. Once all cards have been seen, the next quiz starts Phase 2.
- **Phase 1:** The quiz presents cards that have never been shown, in their stored order.
- **Phase 2:** The quiz randomly selects shown cards that have had a mistake and have not yet reached the mastery target. A correct answer increases their consecutive-correct count; a wrong answer resets it to zero.
- A card answered correctly on its first showing is already considered learned. A card that had a mistake is learned after reaching the configured number of consecutive correct answers.
- The mastery target is set in Settings. It defaults to 3 and can be changed at any time.
- Statistics tiles change with the phase. In Phase 1, **Shown** reports how many cards have been seen and **Cards with errors** counts cards that will need Phase 2 review. In Phase 2, **Learned** reports mastered cards and **Cards with errors** shows the remaining review pool.
- The **Cards with errors** tile filters the card list when clicked; it does not start a quiz. Click the active tile again to clear the filter. **Shown** and **Learned** are not clickable. Start a quiz only with **Start quiz** on the Quiz page.
- In Phase 2, each quiz card shows its current consecutive-correct count (or **Learned**) and how many times it has been shown. After the last card of a batch, the app returns to the card list.
- The card list always highlights the correct option in green. If your last answer to a card was wrong, the option you picked is highlighted in red. Cards whose last answer was wrong are listed first, cards never answered incorrectly are listed last, and each group is sorted by times shown.
- Answer options are shuffled each time a quiz starts, so the correct answer can appear in a different position when you see the same card again.
- You can switch any card between English and Russian to understand the complete question and answer options.

## Recommended workflow

1. Complete the questions in the official Irish theory-test app.
2. Open its `Previously answered incorrectly` section.
3. Take screenshots of the questions you answered incorrectly.
4. Send up to 15 screenshots at a time to an AI assistant with the prompt below.
5. Download the JSON file the AI creates, or save its response as a `.json` file.
6. Open Weak Cards Quiz and click `Import JSON`.
7. Select one or more generated JSON files, then open the Quiz page and click `Start quiz`.
8. The quiz first covers every imported card, then repeats cards with mistakes until they reach the mastery target shown in Settings.

## Importing and exporting cards

The app accepts a top-level JSON array of card objects. When several files are selected, valid cards are imported even if another file or card is invalid. Invalid cards are skipped and reported.

Duplicate detection is automatic. A new card is skipped when its English question and English correct-answer text match an existing card, or another card in the same import. Letter case and whitespace are ignored during this comparison. Existing card statistics are preserved when new cards are imported. Imported cards keep the `stats` stored in the file, if any.

The `Export JSON` button downloads all saved cards as `weak-cards-quiz.json`. The exported file contains the card content and accumulated `stats`, but not the internal `id` field. This makes it possible to back up cards and move them, together with their statistics, to another device.

## Local data storage

The app has no backend. Cards, quiz statistics, the selected batch size, the mastery target, and the start page are stored in the browser's `localStorage`, which persists across browser and computer restarts. A quiz in progress is kept only in memory.

On the first launch of the published app, when no cards are saved yet, a set of sample cards is loaded automatically. When the card list is empty, the `Load sample cards` button loads them again; otherwise the same button deletes all cards after confirmation. `Reset statistics` clears the statistics of every card.

The interface language is also stored in `localStorage`. English is selected by default and Russian can be enabled in Settings. Settings also let you choose the page opened on launch: All cards, Quiz, or About (default). The interface language is independent from the English/Russian language switch inside each card.

This data is available only in the browser on the device where it was created. To move cards and their accumulated statistics to another device, export the cards to JSON and upload that file on the other device.

## JSON format

Each card must contain English and Russian versions with the same option IDs, plus `correctOptionId`:

```json
[
  {
    "en": {
      "question": "What does this sign mean?",
      "options": {
        "opt1": "No overtaking",
        "opt2": "Parking is allowed",
        "opt3": "Road works ahead"
      }
    },
    "ru": {
      "question": "Что означает этот знак?",
      "options": {
        "opt1": "Обгон запрещён",
        "opt2": "Парковка разрешена",
        "opt3": "Дорожные работы впереди"
      }
    },
    "correctOptionId": "opt1"
  }
]
```

The app adds or updates the internal `stats` data (`timesShown`, `timesCorrect`, `lastSelectedOptionId`) while you practise. A card is rejected on import unless both `en` and `ru` have a non-empty `question` and a non-empty `options` object, and `correctOptionId` exists in both option lists. Option IDs should be the same in both language versions: the quiz takes option IDs from `en` and looks up the Russian text by the same IDs.

## Prompt for creating cards from screenshots

The About page shows this prompt with a `Copy` button (in Russian when the interface language is Russian). Attach no more than 15 screenshots per request:

```text
Analyze the provided screenshots from the Driving Theory Test app (Ireland, RSA).

Create and provide a ready-to-download data.json file containing the analysis results.

Data structure in the JSON file:

- "correctOptionId": ID of the correct answer ("opt1", "opt2", "opt3", "opt4", etc.).
- "en": an object with the question and answer options in English (as shown in the screenshot).
- "ru": an object with a high-quality Russian translation of the question and answer options.

File structure template:
[
  {
    "correctOptionId": "opt1",
    "en": {
      "question": "English question text?",
      "options": {
        "opt1": "Option 1",
        "opt2": "Option 2",
        "opt3": "Option 3"
      }
    },
    "ru": {
      "question": "Текст вопроса на русском?",
      "options": {
        "opt1": "Вариант 1",
        "opt2": "Вариант 2",
        "opt3": "Вариант 3"
      }
    }
  }
]
```

After the AI returns the JSON file, import it into the app and start a quiz.
