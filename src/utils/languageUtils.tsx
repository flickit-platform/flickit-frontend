export const formatLanguageCodes = (
  languages: string[],
  currentLang: string,
): string => {
  return currentLang === "fa"
    ? languages.join(currentLang === "fa" ? "، " : ", ")
    : languages
        .map((lang) => {
          const lowerLang = lang.toLowerCase();
          if (lowerLang === "fa" || lowerLang === "persian") return "FA";
          if (lowerLang === "en" || lowerLang === "english") return "EN";
          return lang.slice(0, 2).toUpperCase();
        })
        .join(currentLang === "fa" ? "، " : ", ");
};
