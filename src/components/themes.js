// my themes colors
// ['bg','font']
export const themes = [
  ["#eee", "#666"],
  ["#E5EFC1", "#557B83"],
  ["turquoise", "indigo"],
  ["#FEF1E6", "#90AACB"],
  ["black", "lightgreen"],
  ["#333", "orange"],
  ["#18251B", "#DEE5F8"],
  ["#666", "#eee"],
  ["#055D89", "#A3A272"],
  ["#00107A", "#E65A27"],
];
let index = 0;
export const changeTheme = (i) => {
  if (!isNaN(i)) index = i;
  index = (index + 1) % themes.length;
  document.documentElement.style.setProperty("--color0", themes[index][0]);
  document.documentElement.style.setProperty("--color1", themes[index][1]);
  // console.log("current theme is #" + index);
};
