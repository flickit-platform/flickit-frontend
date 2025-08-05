const languageDetector = (text?: string | null) => {
  const farsiChars = new Set("ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی");

  if (!text || text === undefined) {
    if (document.dir === "rtl") {
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
