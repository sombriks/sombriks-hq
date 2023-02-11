// my themes colors
// ['bg','font']
const themes = [
    ["#eee", "#666"],
    ["#E5EFC1", "#557B83"],
    ["#f3db76", "#003300"],
    ["#ffd4dc", "#b61785"],
    ["#0e3a5c", "#d2d27a"],
    ["#523b3b", "#f8ede3"],
    ["#334", "#eee"],
    ["#262b2c", "#32a0ad"],
    ["#030e57", "#E65A27"],
    ["#333", "#ffa500"],
    ["#18251B", "#DEE5F8"],
    ["#26210d", "#B7464c"],
    ["#13005a", "#bccef8"],
    ["#000", "#90ee90"],
];
let index = 0;
const changeTheme = (i) => {
    if (!isNaN(i)) index = i;
    index = (index + 1) % themes.length;
    document.documentElement.style.setProperty("--color0", themes[index][0]);
    document.documentElement.style.setProperty("--color1", themes[index][1]);
    // console.log(index, themes[index]);
    return index;
};