export const trimLeft = (str, charlist) => {
  if (charlist === undefined)
    charlist = "\s";

  return str.replace(new RegExp("^[" + charlist + "]+"), "");
};