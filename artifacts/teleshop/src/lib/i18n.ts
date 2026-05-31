import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en";
import vi from "@/locales/vi";
import ru from "@/locales/ru";
import zh from "@/locales/zh";

function detectLanguage(): string {
  const stored = localStorage.getItem("teleshop_lang");
  if (stored) return stored;

  try {
    const tg = (window as any).Telegram?.WebApp;
    const tgLang = tg?.initDataUnsafe?.user?.language_code;
    if (tgLang) {
      if (tgLang.startsWith("vi")) return "vi";
      if (tgLang.startsWith("ru")) return "ru";
      if (tgLang.startsWith("zh")) return "zh";
      return "en";
    }
  } catch {}

  const browser = navigator.language?.toLowerCase() ?? "";
  if (browser.startsWith("vi")) return "vi";
  if (browser.startsWith("ru")) return "ru";
  if (browser.startsWith("zh")) return "zh";
  return "en";
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
      ru: { translation: ru },
      zh: { translation: zh },
    },
    lng: detectLanguage(),
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export function setLanguage(lang: string) {
  localStorage.setItem("teleshop_lang", lang);
  i18n.changeLanguage(lang);
}

export const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
] as const;

export default i18n;
