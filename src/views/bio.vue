<template>
	<div>
		<small>same colors means same working group, just different business</small>
		<v-timeline dense>
			<v-timeline-item color="cyan">
				<div>2016 - present</div>
				<v-card>
					<v-card-title class="headline">
						Chief Technology Officer at
						<a target="tp" href="https://techpar.github.io/">Techpar</a>
					</v-card-title>
					<v-card-text>
						<p>
							This startup currently deals with software solutions on various fields.
							From community management to renewable energy.
						</p>
						<p>A business by former usix/ebix coworkers.</p>
					</v-card-text>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="cyan">
				<div>2014 - 2016</div>
				<v-card>
					<v-card-title class="headline">
						Chief Technology Officer at
						<a
							target="g4"
							href="https://www.facebook.com/gameforlearning/"
						>G4l - Game For Learning</a>
					</v-card-title>
					<v-card-text>
						<p>This startup was focused on Educational mobile games.</p>
						<p>A business by former usix/ebix coworkers.</p>
					</v-card-text>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="indigo">
				<div>2013 - 2014</div>
				<v-card>
					<v-card-title class="headline">
						Software Developer at
						<a
							target="at"
							href="http://www.atlantatecnologia.com.br/pt/index.php"
						>Atlanta Tecnologia</a>
					</v-card-title>
					<v-card-text>
						<p>This company was focused on Transit law enforcement.</p>
					</v-card-text>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="green">
				<div>2013</div>
				<v-card>
					<v-card-title class="headline">
						Software Developer at
						<a
							target="if"
							href="https://www.linkedin.com/company/ifactory-solutions/"
						>Ifactory Solutions</a>
					</v-card-title>
					<v-card-text>
						<p>This company was a big outsource provider for software development.</p>
					</v-card-text>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="lime">
				<div>2012</div>
				<v-card>
					<v-card-title class="headline">
						Software Developer at
						<a target="he" href="http://www.hexat.com.br/hexa/">Hexa Tecnologia</a>
					</v-card-title>
					<v-card-text>
						<p>This company have various P&D works.</p>
						<p>A business backed by IFCE professors.</p>
					</v-card-text>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="lime">
				<div>2012</div>
				<v-card>
					<v-card-title class="headline">
						Software Developer at
						<a target="ld" href="http://lds.ifce.edu.br/">LDS</a>
					</v-card-title>
					<v-card-text>
						<p>This company have various P&D works.</p>
						<p>A business backed by IFCE professors.</p>
					</v-card-text>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="lime">
				<div>2011</div>
				<v-card>
					<v-card-title class="headline">
						R&D Software Developer at
						<a
							target="no"
							href="https://www.linkedin.com/company/novelbiz/"
						>Novelbiz</a>
					</v-card-title>
					<v-card-text>
						<p>This startup had researches in robotics and recommendation systems.</p>
						<p>A business backed by IFCE professors.</p>
					</v-card-text>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="blue">
				<div>2010 - 2011</div>
				<v-card>
					<v-card-title class="headline">
						Senior Analyst at
						<a target="eb" href="https://www.ebix.com/">Ebix Inc.</a>
					</v-card-title>
					<v-card-text>
						<p>USIX S/A was acquired by Ebix Inc. in 2010.</p>
						<p>Core business still was insurance market.</p>
					</v-card-text>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="blue">
				<div>2007 - 2010</div>
				<v-card>
					<v-card-title class="headline">
						Trainee, Programmer and Senior Programmer at
						<a
							target="us"
							href="https://www.linkedin.com/company/usix-technology/"
						>USIX S/A</a>
					</v-card-title>
					<v-card-text>
						<p>Core business was insurance market and tackle ie6 bugs</p>
					</v-card-text>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="orange">
				<div>2006</div>
				<v-card>
					<v-card-title class="headline">
						Trainee at
						<a
							target="co"
							href="https://www.facebook.com/pirambudigital/?rf=351248931610166"
						>Cooperativa Pirambu Digital</a>
					</v-card-title>
					<v-card-text>
						<p>
							A social project to include young students into the digital market outsourcing
							and building in-house projects.
						</p>
					</v-card-text>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="white">
				<div>1984</div>
				<v-card>
					<v-card-title class="headline">Born.</v-card-title>
					<v-card-text>
						<p>
							Lots of things happened between this professional experience and the next listed here,
							however 10+ years sounds good enough to me, hope it sounds good enough to you.
						</p>
						<p>
							Nowadays i really like to solve problems, either to pay my bills or just for fun.
							Also sports, i like to pratice sports. Running. Biking. Swimming sometimes.
							Gamer when it's possible.
						</p>
						<p>
							Please let me know if i can help you with something,
							the sidebar menu has plenty of contact options.
						</p>
					</v-card-text>
				</v-card>
			</v-timeline-item>
		</v-timeline>
	</div>
</template>
<script>
module.exports = {
	name: "Bio",
	mounted() {
		this.$store.commit("setTitle", "About Myself");
	}
};
</script>
