# Weak Cards Quiz

A lightweight browser app for training on weak questions before the Irish driving theory test. It is designed for reviewing mistakes and repeating the questions that are most likely to cause errors.

## What this app is for

This application is intended for the Irish theory test preparation workflow:

- you collect problematic questions from the official app or test screens,
- export them as a JSON dataset,
- load that file into the app,
- review the questions in a quiz flow,
- repeat the hardest questions first,
- review mistakes at the end of the session.

The app is built around the idea that the card is considered difficult when the last answer was wrong.

## How to use the app

1. Open the app in a browser.
2. Click the "Upload JSON file" button.
3. Select one or more JSON files with question sets. Correct files are imported even when another selected file or card is invalid.
4. Click "Start quiz".
5. Answer all questions in the current set.
6. Review incorrect answers after the round ends.

When an invalid card is skipped, the app reports its English question title. Duplicate cards are skipped using the English question and `correctOptionId`, ignoring letter case and whitespace. Existing card statistics are preserved.

The "Export JSON" button downloads the saved cards in the same top-level format as the most recently imported file. The internal `id` field is excluded, while card `stats` and other fields are preserved. The exported file can be imported again. "Delete all cards" clears the saved cards immediately without confirmation.

## How to create your own JSON file

The app does not use the bundled sample cards for real learning. It is meant to work only with your own question set.

The recommended workflow is:

1. Use the official Irish theory test app.
2. Mark or note the questions you find difficult.
3. Take screenshots of those questions in groups of 10.
4. Send those screenshots to an AI assistant.
5. Ask the AI to convert them into a JSON file in the exact structure required by this app.

## Required JSON structure

The app expects a JSON array of card objects, or an object with a `cards` array.

Each item must look like this:

```json
[
  {
    "en": {
      "question": "What does this sign mean?",
      "options": {
        "opt1": "No overtaking",
        "opt2": "Parking is allowed",
        "opt3": "Road works ahead",
        "opt4": "Roundabout ahead"
      }
    },
    "ru": {
      "question": "Что означает этот знак?",
      "options": {
        "opt1": "Обгон запрещён",
        "opt2": "Парковка разрешена",
        "opt3": "Дорожные работы впереди",
        "opt4": "Поворот кругом впереди"
      }
    },
    "correctOptionId": "opt1"
  }
]
```

- The app adds the `stats` section automatically when cards are loaded.

## Prompt to generate the JSON from screenshots

Use this prompt with an AI assistant after collecting the screenshots:

```text
Create a JSON file for a driving theory test revision app.

Requirements:
- The output must be valid JSON only, with no Markdown fences.
- Use a top-level array of cards.
- Each card must have this exact structure:
  {
    "en": {
      "question": "...",
      "options": {
        "opt1": "...",
        "opt2": "...",
        "opt3": "...",
        "opt4": "..."
      }
    },
    "ru": {
      "question": "...",
      "options": {
        "opt1": "...",
        "opt2": "...",
        "opt3": "...",
        "opt4": "..."
      }
    },
    "correctOptionId": "opt1"
  }

Important rules:
- Each screenshot is one question.
- Extract the exact question text and the exact answer options from the image.
- The correct answer must be determined from the official Irish theory test content.
- Keep the question in English and add a Russian translation for each question.
- For Russian translations, translate the question and the option texts naturally and clearly.
- Keep the same option IDs across English and Russian versions.
- `correctOptionId` must match the correct answer option in both language versions.
- The app assigns sequential IDs automatically when cards are loaded.
- Do not add comments, explanations, or extra text outside the JSON.

Input screenshots:
[attach screenshots here, grouped in batches of 10]
```

2. Click "Upload JSON file".
3. Select your generated file.
4. Then start the quiz.

The app will use only your file after that, and will not rely on the bundled sample data.

## Notes

- The app stores the loaded data in browser localStorage.
- To switch to another question set, load a new JSON file and replace the saved data.
- For best results, build the file in batches of difficult questions and review them repeatedly.
