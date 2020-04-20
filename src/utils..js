export const getRandomColor = () => {
  var a,
    b = [],
    c = "#";
  for (var i = 0; i < 6; i++) {
    a = Math.ceil(Math.random() * 16)
      .toString(16)
      .toLocaleUpperCase();
    b[i] = a;
    c += b[i];
  }
  c = c.substr(0, 7);
  return c;
};
