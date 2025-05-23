const firstCharDetector = (text?: string | null) => {
  const farsiPattern = /[\u0600-\u06FF\uFB50-\uFBFF\u0590-\u05FF\u2000-\u206F]/;
  const firstCharacter = text?.charAt(0);
  if (firstCharacter && farsiPattern.test(firstCharacter)) {
    return true;
  }

  return false;
};

export default firstCharDetector;
