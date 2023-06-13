export const getImageUrl = (imgPath?: string) => {
  if (!imgPath) return "";
  return `${process.env.REACT_APP_BACKEND_HOST}/${imgPath}`;
};
