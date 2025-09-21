export const capitalizeFirstLetter = (text?: string) => {
  if (!text) return text; // Handle empty or undefined text
  return text.charAt(0).toUpperCase() + text.slice(1);
};
