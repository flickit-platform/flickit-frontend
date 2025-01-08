const languageDetector = (text?: string | null) => {
  const farsiChars = new Set("ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی");

  if (!text) return false;
  for (const char of text) {
    if (farsiChars.has(char)) {
      return true;
    }
  }

  return false;
};

export default languageDetector;
