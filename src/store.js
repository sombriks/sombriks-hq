const Vue = require("vue");
const Vuex = require("vuex");
Vue.use(Vuex);

const state = {
  title: "Try to Keep It Simple",
  profilepics: [
    "assets/profile-pics/picture_8.png",
    "assets/profile-pics/picture_9-a.jpg",
    "assets/profile-pics/picture_9-b.jpg",
    "assets/profile-pics/picture_9.jpg",
    "assets/profile-pics/picture_17.jpg",
    "assets/profile-pics/picture_16.jpg",
    "assets/profile-pics/picture_15.jpg",
    "assets/profile-pics/picture_13.jpg",
    "assets/profile-pics/picture_12.jpg",
    "assets/profile-pics/picture_11.jpg",
    "assets/profile-pics/picture_10.jpg",
    "assets/profile-pics/picture_18.jpg",
    "assets/profile-pics/picture_19.jpg",
    "assets/profile-pics/picture_21.jpg"
  ]
};

const mutations = {
  setTitle(state, title) {
    state.title = title;
  }
};

const store = new Vuex.Store({
  state,
  mutations
});

module.exports = {
  store
};
