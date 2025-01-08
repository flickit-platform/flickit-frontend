const languageDetector = (text?: string) => {
  const farsiChars = new Set("ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی");

  if (!text) return;
  for (const char of text) {
    if (farsiChars.has(char)) {
      return true;
    }
  }

  return false;
};

export default languageDetector;
