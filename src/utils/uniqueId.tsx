let counter = 0;

/**
 * Generate a unique ID with an optional prefix.
 * @param {string} prefix - Optional prefix for the ID.
 * @returns {string} - A unique ID.
 */
const uniqueId = (prefix = "") => `${prefix}${++counter}`;

export default uniqueId;