const pluginWebc = require("@11ty/eleventy-plugin-webc");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {

    eleventyConfig.addPassthroughCopy({
        "src/assets": "assets",
        // "node_modules/prism-themes/themes/prism-a11y-dark.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-atom-dark.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-base16-ateliersulphurpool.light.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-cb.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-coldark-cold.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-coldark-dark.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-coy-without-shadows.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-darcula.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-dracula.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-duotone-dark.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-duotone-earth.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-duotone-forest.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-duotone-light.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-duotone-sea.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-duotone-space.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-ghcolors.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-gruvbox-dark.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-gruvbox-light.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-holi-theme.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-hopscotch.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-lucario.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-material-dark.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-material-light.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-material-oceanic.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-night-owl.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-nord.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-one-dark.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-one-light.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-pojoaque.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-shades-of-purple.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-solarized-dark-atom.min.css": "assets/prism-theme.css"
        "node_modules/prism-themes/themes/prism-synthwave84.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-vs.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-vsc-dark-plus.min.css": "assets/prism-theme.css"
        // "node_modules/prism-themes/themes/prism-z-touch.min.css": "assets/prism-theme.css"
    });

    eleventyConfig.addPlugin(pluginWebc, {
        components: "src/**/*.webc",
    });

    eleventyConfig.addPlugin(syntaxHighlight);

    return {
        dir: {
            input: "src/pages",
            layouts: "../layouts",
            data: "../assets",
            output: "dist",
        }
    }
};