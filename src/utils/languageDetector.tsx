import { theme } from "@/config/theme";

const languageDetector = (text?: string | null) => {
  const farsiChars = new Set("ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی");

  if (!text || text === undefined) {
    if (theme.direction === "rtl") {
      return true;
    } else {
      return false;
    }
  }
  for (const char of text.toString()) {
    if (farsiChars.has(char)) {
      return true;
    }
  }

  return false;
};

export default languageDetector;
