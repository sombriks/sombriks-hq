// my themes colors
// ['bg','font']
export const themes = [
	/*0*/["#eee", "#666"],
	/*1*/["#E5EFC1", "#557B83"],
	/*2*/["#FEF1E6", "#90AACB"],
	/*3*/["black", "lightgreen"],
	/*4*/["#333", "orange"],
	/*5*/["#18251B", "#DEE5F8"],
	/*6*/["#334", "#eee"],
	/*7*/["#005080", "#A3A272"],
	/*8*/["#00107A", "#E65A27"],
	/*9*/["#26210d", "#B7464c"],
	/*10*/["#F5DE7A", "#003300"],
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
