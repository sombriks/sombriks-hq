<template>
	<div>
		<basic-instructions />
		<v-timeline dense>
			<v-timeline-item v-for="w in cv.work" :key="w.company" :color="w.color">
				<div>{{ w.start }} - {{ w.end }}</div>
				<v-card>
					<v-card-title class="headline">
						{{ w.position || w.positions.join(",") }}
						<i>&nbsp;at&nbsp;</i>
						<a v-if="w.site" target="x" :href="w.site">{{ w.company }}</a>
						<template v-if="w.sites">
							<b>{{ w.company }}</b>
							<a target="x" v-for="s in w.sites" :key="s" :href="s">{{ s }}</a>
						</template>
					</v-card-title>
					<v-card-text>
						<p>{{ w.description }}</p>
						<h5>Projects/Client</h5>
						<ul>
							<li v-for="p in w.projects" :key="p.name">
								<b>{{ p.name }}</b> -
								<i>{{ p.description }}</i>
							</li>
						</ul>
						<h5>Tech stack</h5>
						<p>
							<v-chip v-for="st in w.techstack" :key="st">{{ st }}</v-chip>
						</p>
					</v-card-text>
				</v-card>
			</v-timeline-item>
			<v-timeline-item v-for="e in cv.education" :key="e.course" :color="e.color">
				<div>{{ e.start }} - {{ e.end }}</div>
				<v-card>
					<v-card-title class="headline">
						{{ e.type }} at
						<a target="if" :href="e.site">{{ e.institution }}</a>
					</v-card-title>
					<v-card-text>
						<p>{{ e.description }}</p>
					</v-card-text>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="white">
				<div>1984</div>
				<v-card>
					<v-card-title class="headline">Born.</v-card-title>
					<v-card-text>
						<p>
							Lots of things happened between this first professional experience
							and the others listed here, however 10+ years sounds good enough
							to me, hope it sounds good enough to you.
						</p>
						<p>
							Nowadays i really like to solve problems, either to pay my bills
							or just for fun. Also sports, i like to pratice sports. Running.
							Biking. Swimming sometimes. Gamer when it's possible.
						</p>
						<p>
							Please let me know if i can help you with something, the sidebar
							menu has plenty of contact options.
						</p>
					</v-card-text>
				</v-card>
			</v-timeline-item>
		</v-timeline>
	</div>
</template>
<script>
const cv = require("../../assets/curriculum.json");
const BasicInstructions = require("../components/basic-instructions.vue");
module.exports = {
	name: "Bio",
	components: {
		BasicInstructions
	},
	mounted() {
		this.$store.commit("setTitle", "About Myself");
	},
	data: _ => ({
		cv
	})
};
</script>
