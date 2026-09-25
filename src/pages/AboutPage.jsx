import { useApp } from "../app/useApp";
import { getTranslationGroup } from "../i18n";

const prompts = {
  en: `Convert the questions in the screenshots into JSON for a flashcard practice app.

Requirements:
- Process no more than 15 cards. If there are more, create only the first 15.
- Return only a valid JSON array without explanations, Markdown, or a json language block.
- Create en and ru fields for every card. Each must contain question and options.
- Keep the English text from the screenshot in en.question and en.options.
- Translate the question and all answer options into Russian in ru.question and ru.options.
- Use the same option keys in en.options and ru.options: opt1, opt2, opt3, and so on.
- Set the correct option in correctOptionId, for example "opt2".
- Do not invent or change the content. If the text or correct answer is unreadable, ask me for a clearer screenshot first.

Format of one card:
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
    "question": "Question translation",
    "options": {
      "opt1": "First answer translation",
      "opt2": "Second answer translation"
    }
  }
}`,
  ru: `Преобразуй вопросы на скриншотах в JSON для приложения тренировки карточек.

Требования:
- Обработай не более 15 карточек. Если карточек больше, создай только первые 15.
- Верни только корректный JSON-массив без пояснений, Markdown и блока с языком json.
- Для каждой карточки создай поля en и ru. В каждом из них должны быть question и options.
- В en.question и en.options сохрани английский текст со скриншота.
- Переведи вопрос и все варианты ответа на русский язык в ru.question и ru.options.
- Используй одинаковые ключи вариантов в en.options и ru.options: opt1, opt2, opt3 и так далее.
- Укажи правильный вариант в correctOptionId, например "opt2".
- Не придумывай и не меняй содержание вопросов и вариантов. Если текст или правильный ответ на скриншоте не читается, сначала попроси меня прислать более чёткий скриншот.

Формат одной карточки:
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
    "question": "Перевод вопроса",
    "options": {
      "opt1": "Первый ответ",
      "opt2": "Второй ответ"
    }
  }
}`,
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
