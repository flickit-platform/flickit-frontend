export const formatLanguageCodes = (
  languages: (string | { code: string; title: string })[],
  currentLang: string,
): string => {
  if (typeof languages[0] === 'object' && languages[0] !== null) {
    const titles = (languages as { code: string; title: string }[]).map((lang) => lang.title);
    const separator = currentLang === "fa" ? " و " : " & ";
    return titles.join(separator);
  }

  if (currentLang === "fa") {
    return (languages as string[]).join("، ");
  }

  let separator = ", ";

  const formattedLanguages = (languages as string[]).map((lang) => {
    const lowerLang = lang.toLowerCase();
    if (lowerLang === "fa" || lowerLang === "persian") return "FA";
    if (lowerLang === "en" || lowerLang === "english") return "EN";
    return lang.slice(0, 2).toUpperCase();
  });

  return formattedLanguages.join(separator);
};
