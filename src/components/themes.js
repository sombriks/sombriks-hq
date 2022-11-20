// my themes colors
// ['bg','font']
export const themes = [
	/*0*/["#eee", "#666"],
	/*1*/["#E5EFC1", "#557B83"],
	/*2*/["#f3db76", "#003300"],
	/*3*/["#ffd4dc", "#b61785"],
	/*4*/["#0e3a5c", "#d2d27a"],
	/*5*/["#00107A", "#E65A27"],
	/*6*/["#26210d", "#B7464c"],
	/*7*/["#333", "orange"],
	/*8*/["#18251B", "#DEE5F8"],
	/*9*/["#334", "#eee"],
	/*10*/["black", "lightgreen"],
];
export let index = 0;
export const changeTheme = (i) => {
	if (!isNaN(i)) index = i;
	index = (index + 1) % themes.length;
	document.documentElement.style.setProperty("--color0", themes[index][0]);
	document.documentElement.style.setProperty("--color1", themes[index][1]);
	// console.log(index, themes[index]);
	return index;
};
