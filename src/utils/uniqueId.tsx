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
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    id = Array.from(array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    localStorage.setItem(key, id);
  }
  return id;
};

export default uniqueId;
