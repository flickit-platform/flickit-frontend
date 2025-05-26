export const isPathMatching = (pathname: string, patterns: string[]) => {
  return patterns.some((pattern) => pathname.includes(pattern));
};
