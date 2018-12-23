<template>
	<v-layout column>
		<v-layout row align-start wrap>
			<a href="https://stackexchange.com/users/184203">
				<img
					src="https://stackexchange.com/users/flair/184203.png?theme=dark"
					width="208"
					height="58"
					alt="profile for Sombriks on Stack Exchange, a network of free, community-driven Q&amp;A sites"
					title="profile for Sombriks on Stack Exchange, a network of free, community-driven Q&amp;A sites"
				>
			</a>
			<div id="cnv"></div>
		</v-layout>
		<v-layout column>
			<p>
				These skills of couse has a little interpretation bias.
				This is how i see myself.
			</p>
			<p>
				In order to help you to figure out what those points means, see my
				<i>
					personal
					<a target="dbz" href="http://dragonball.wikia.com/wiki/Power_Level">combat level</a>
					scale:
				</i>
			</p>
			<h2>0 - 9 points</h2>
			<p>
				Complete noob. Never studied more than 6 hours of that. However if i
				still dare to put it there means that i could master it quite quickly.
			</p>
			<h2>10 - 99 points</h2>
			<p>
				This is what used to pay or pays my rent nowadays. I can tell you by
        heart how to configure some feature or which bugs or design flaws can
        compromise a project if we adopt it so we simply avoid such caveats.
			</p>
			<h2>100+ points</h2>
			<p>
				<i>
					Ah you think darkness is your ally? You merely adopted the dark.
					I was born in it, molded by it. I didn't see the light until I was
					already a man, by then it was nothing to me but blinding!
				</i> -- Bane in <b>Batman: The Dark Knight Rises</b>
			</p>
      <h3>Go ahead and click the charts.</h3>
		</v-layout>
		<!-- <div>
    <h2>Good pratices</h2>
    <p>
      Funcional Programming, Object-oriented programming, Design Patterns (GOF: factory, facade, adapter, strategy, decorator, etc),
      Test-driven development, Unified modeling language, Model-view-controller, Model-view-view-model, Database Migrations
    </p>
    <h2>Misc</h2>
    <p>Project management, Requirements analysis, Scrum</p>
		</div>-->
		<v-layout column>
			<h1>Languages</h1>
			<chart-languages/>
		</v-layout>
		<v-layout column>
			<h1>Frameworks</h1>
      <chart-frameworks/>
		</v-layout>
		<v-layout column>
			<h1>DevOps</h1>
      <chart-devops/>
		</v-layout>
		<v-layout column>
			<h1>Patterns and Social</h1>
			<chart-social/>
		</v-layout>
	</v-layout>
</template>

<script>
const PIXI = require("pixi.js");
const imgs = [
	"picture_9-a.jpg",
	"picture_9.jpg",
	"picture_10.jpg",
	"picture_11.jpg",
	"picture_12.jpg",
	"picture_13.jpg",
	"picture_15.jpg",
	"picture_16.jpg",
	"picture_17.jpg",
	"picture_21.jpg"
];
module.exports = {
	name: "Skills",
	mounted() {
		this.$store.commit("setTitle", "Skills");
		app = new PIXI.Application(350, 50);
		document.getElementById("cnv").appendChild(app.view);

		const textures = imgs.map(e =>
			PIXI.Texture.fromImage(`assets/profile-pics/${e}`)
		);

		let idx = 0;

		const pic = new PIXI.Sprite(textures[0]);
		pic.anchor.set(0.5, 0.3);
		pic.x = app.renderer.width / 2;
		pic.y = app.renderer.height / 2;
		pic.interactive = true;
		pic.on("pointerup", _ => {
			pic.texture = textures[(idx = ++idx % textures.length)];
		});

		app.stage.addChild(pic);
		app.ticker.add(delta => {
			pic.rotation += 0.04 * delta;
		});
	}
};
</script>
