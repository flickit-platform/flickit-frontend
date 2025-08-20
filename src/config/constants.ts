export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? import.meta.env.VITE_LOCAL_BASE_URL
    : process.env.BASE_URL;
export const MULTILINGUALITY = import.meta.env.VITE_MULTILINGUALITY;
export const APP_LABEL = import.meta.env.VITE_APP_TITLE;
export const CDN_DIRECTORY =
  process.env.NODE_ENV === "development"
    ? "https://flickit-cdn.hectora.app/"
    : import.meta.env.VITE_LOCAL_BASE_URL;

export const HOME_URL = "/spaces";
