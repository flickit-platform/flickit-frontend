export const isPathMatching = (pathname: string, patterns: string[]) => {
  return patterns.some((pattern: string) =>{
    if(pattern.includes("report")){
      return  pathname.includes(pattern)
    }else{
      return pathname.startsWith(pattern)
    }
  });
};
