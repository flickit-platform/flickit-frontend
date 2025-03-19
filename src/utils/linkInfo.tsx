export const linkInfo = ({ link }: { link: any }) => {
  const reg = /\/([^/?]+)\?/; 
  const match = link?.match(reg);
  const name = match ? match[1] : null;
  const exp = name?.includes(".") ? name.substring(name.indexOf(".")) : null;
  return { name, exp };
};
