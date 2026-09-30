import { useApp } from "../app/useApp";
import { getTranslationGroup } from "../i18n";

const prompts = {
  en: `Analyze the provided screenshots from the Driving Theory Test app (Ireland, RSA).

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
]`,
  ru: `Проанализируй предоставленные скриншоты из приложения Driving Theory Test (Ирландия, RSA).

Сформируй и предоставь для скачивания готовый файл data.json с результатами анализа.

Структура данных внутри JSON-файла:

- "correctOptionId": ID правильного ответа ("opt1", "opt2", "opt3", "opt4" и т. д.).
- "en": объект с вопросом и вариантами ответов на английском языке (как на скриншоте).
- "ru": объект с качественным переводом вопроса и вариантов ответов на русский язык.

Шаблон структуры файла:
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
]`,
};

function AboutPage() {
  const { notify, uiLanguage } = useApp();
  const about = getTranslationGroup(uiLanguage, "about");
  const prompt = prompts[uiLanguage];

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      notify(about.promptCopied);
    } catch {
      notify(about.promptCopyFailed, "error");
    }
  }

  return (
    <section className="panel page-copy">
      <h3>{about.purposeTitle}</h3>
      <p>{about.purpose}</p>
      <h3>{about.audienceTitle}</h3>
      <p>{about.audience}</p>
      <h3>{about.usageTitle}</h3>
      <ol>
        {about.usage.map((item) => (
          <li key={item}>{item}</li>
        ))}
        <li>
          <span className="prompt-block">
            <button type="button" onClick={copyPrompt}>
              {about.copyPrompt}
            </button>
            <pre>{prompt}</pre>
          </span>
        </li>
      </ol>
      <h3>{about.featuresTitle}</h3>
      <ul>
        {about.features.map(([title, description]) => (
          <li key={title}>
            <strong>{title}.</strong> {description}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default AboutPage;
