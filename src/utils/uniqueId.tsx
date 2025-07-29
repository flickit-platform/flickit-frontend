let counter = 0;

/**
 * Generate a unique ID with an optional prefix.
 * @param {string} prefix - Optional prefix for the ID.
 * @returns {string} - A unique ID.
 */
const uniqueId = (prefix = "") => `${prefix}${++counter}`;

export const getOrCreateVisitorId = () => {
  const key = "visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = [...Array(16)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");
    localStorage.setItem(key, id);
  }
  return id;
};

export default uniqueId;
