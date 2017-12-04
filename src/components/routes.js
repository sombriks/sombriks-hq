module.exports = [
  { path: "/bio", label: "Bio", component: require("../features/bio.vue"), alias: "/" },
  { path: "/skills", label: "Skills", component: require("../features/skills.vue") },
  { path: "/showcases", label: "Showcases", component: require("../features/showcases.vue") },
  { path: "/blog/:post", label: "Blog", component: require("../features/blog.vue") },
]