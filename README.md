# Weak Cards Quiz

Weak Cards Quiz is a browser app for practising difficult questions from the Irish driving theory test. It is designed for Russian-speaking learners who take the official test in English.

The app complements the official theory-test app. Its main purpose is to collect questions you repeatedly get wrong and practise them separately.

## How the app works

- Quizzes use batches of the size set on the Quiz page.
- The app chooses the phase automatically each time a quiz starts; you cannot switch phases manually. As long as unseen cards remain, it runs Phase 1. Once all cards have been seen, the next quiz starts Phase 2.
- **Phase 1:** The quiz presents cards that have never been shown, in their stored order.
- **Phase 2:** The quiz randomly selects shown cards that have had a mistake and have not yet reached the mastery target. A correct answer increases their consecutive-correct count; a wrong answer resets it to zero.
- A card answered correctly on its first showing is already considered learned. A card that had a mistake is learned after reaching the configured number of consecutive correct answers.
- The mastery target is set in Settings. It defaults to 3 and can be changed at any time.
- Statistics tiles change with the phase. In Phase 1, **Shown** reports how many cards have been seen and **Cards with errors** counts cards that will need Phase 2 review. In Phase 2, **Learned** reports mastered cards, **Cards with errors** shows the remaining review pool, and **Cards with an incorrect last answer** counts cards whose latest answer was wrong.
- The two error-related tiles filter the card list when clicked; they do not start a quiz. Click an active tile again to clear its filter. Start a quiz only with **Start quiz** on the Quiz page.
- Answer options are shuffled each time a quiz starts, so the correct answer can appear in a different position when you see the same card again.
- You can switch any card between English and Russian to understand the complete question and answer options.

## Recommended workflow

1. Complete the questions in the official Irish theory-test app.
2. Open its `Previously answered incorrectly` section.
3. Take screenshots of the questions you answered incorrectly.
4. Send up to 15 screenshots at a time to an AI assistant with the prompt below.
5. Save the AI response as a `.json` file.
6. Open Weak Cards Quiz and click `Import JSON`.
7. Select one or more generated JSON files, then click `Start quiz`.
8. The quiz first covers every imported card, then repeats cards with mistakes until they reach the mastery target shown in Settings.

## Importing and exporting cards

The app accepts a top-level JSON array of card objects. When several files are selected, valid cards are imported even if another file or card is invalid. Invalid cards are skipped and reported.

Duplicate detection is automatic. A new card is skipped when its English question and English correct-answer text match an existing card. Letter case and whitespace are ignored during this comparison. Existing card statistics are preserved when new cards are imported.

The `Export JSON` button downloads all saved cards. The exported file contains the card content and accumulated `stats`, but not the internal `id` field. This makes it possible to back up cards and move them, together with their statistics, to another device.

## Local data storage

The app has no backend. Cards, quiz statistics, the selected batch size, and the mastery target are stored in the browser's `localStorage`, which persists across browser and computer restarts.

The interface language is also stored in `localStorage`. English is selected by default and Russian can be enabled in Settings. The interface language is independent from the English/Russian language switch inside each card.

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

The app adds or updates the internal `stats` data while you practise. Option IDs must match in both language versions, and `correctOptionId` must exist in both option lists.

## Prompt for creating cards from screenshots

Use this prompt with an AI assistant and attach no more than 15 screenshots per request:

```text
Convert the questions in the screenshots into a JSON array for a driving theory test revision app.

Requirements:
- Process no more than 15 cards. If there are more, process only the first 15.
- Return only a valid JSON array. Do not include explanations, Markdown, or a json code fence.
- For every card, create the fields en and ru. Each must contain question and options.
- Preserve the English question and answer options from the screenshot in en.
- Translate the question and every answer option into Russian in ru.
- Use the same option IDs in en.options and ru.options: opt1, opt2, opt3, and so on.
- Set correctOptionId to the ID of the correct answer, for example "opt2".
- Do not invent or alter the question or answer content. If the text or correct answer is not readable, ask me for a clearer screenshot first.

Format:
{
  "correctOptionId": "opt1",
  "en": {
    "question": "Question in English",
    "options": {
      "opt1": "First answer",
      "opt2": "Second answer"
    }
  },
  "ru": {
    "question": "Russian translation of the question",
    "options": {
      "opt1": "Russian translation of the first answer",
      "opt2": "Russian translation of the second answer"
    }
  }
}
```

After the AI returns the JSON, save it as a file, upload it to the app, and start a quiz.
