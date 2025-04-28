export const formatLanguageCodes = (
  languages: string[],
  currentLang: string,
): string => {
  let separator = currentLang === "fa" ? "، " : ", ";

  const formattedLanguages = languages.map((lang) => {
    const lowerLang = lang.toLowerCase();
    if (lowerLang === "fa" || lowerLang === "persian") return "FA";
    if (lowerLang === "en" || lowerLang === "english") return "EN";
    return lang.slice(0, 2).toUpperCase();
  });

  return formattedLanguages.join(separator);
};
