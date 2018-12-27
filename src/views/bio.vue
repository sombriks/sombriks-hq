<template>
	<!-- <p>Born in 1984, Male.</p>
    <p>Made in Brazil.</p>
    <p>Thinker. Coder.</p>
    <p>Chaotic evil.</p>
    <p>Never stops to get amazed on how a problem can be torn apart into smaller pieces.</p>
    <p>Quite unable to understand the fiercer mad love that some people have for Soccer teams.</p>
    <p>Running guy, Biking guy. Swimming guy sometimes.</p>
    <p>Gamer when it's possible.</p>
    <p>Have a hard time to see the difference between code and have fun.</p>
    <p>
      Think that to
      <i>reimagine</i> how people do their daily tasks is the real purpose of create better software.
	</p>-->
	<div>
		<small>same colors means same working group, just different business</small>
		<v-timeline>
			<v-timeline-item color="cyan">
				<div slot="opposite">2016 - present</div>
				<v-card>
					<v-card-title>
						<p class="headline">
							Chief Technology Officer at
							<a target="tp" href="https://techpar.github.io/">Techpar</a>
						</p>
						<p>
							This startup currently deals with software solutions on various fields.
							From community management to renewable energy.
						</p>
						<p>A business by former usix/ebix coworkers.</p>
					</v-card-title>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="cyan">
				<div slot="opposite">2014 - 2016</div>
				<v-card>
					<v-card-title>
						<p class="headline">
							Chief Technology Officer at
							<a
								target="g4"
								href="https://www.facebook.com/gameforlearning/"
							>G4l - Game For Learning</a>
						</p>
						<p>This startup was focused on Educational mobile games.</p>
						<p>A business by former usix/ebix coworkers.</p>
					</v-card-title>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="indigo">
				<div slot="opposite">2013 - 2014</div>
				<v-card>
					<v-card-title>
						<p class="headline">
							Software Developer at
							<a
								target="at"
								href="http://www.atlantatecnologia.com.br/pt/index.php"
							>Atlanta Tecnologia</a>
						</p>
						<p>This company was focused on Transit law enforcement.</p>
					</v-card-title>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="green">
				<div slot="opposite">2013</div>
				<v-card>
					<v-card-title>
						<p class="headline">
							Software Developer at
							<a
								target="if"
								href="https://www.linkedin.com/company/ifactory-solutions/"
							>Ifactory Solutions</a>
						</p>
						<p>This company was a big outsource provider for software development.</p>
					</v-card-title>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="lime">
				<div slot="opposite">2012</div>
				<v-card>
					<v-card-title>
						<p class="headline">
							Software Developer at
							<a target="he" href="http://www.hexat.com.br/hexa/">Hexa Tecnologia</a>
						</p>
						<p>This company have various P&D works.</p>
						<p>A business backed by IFCE professors.</p>
					</v-card-title>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="lime">
				<div slot="opposite">2012</div>
				<v-card>
					<v-card-title>
						<p class="headline">
							Software Developer at
							<a target="ld" href="http://lds.ifce.edu.br/">LDS</a>
						</p>
						<p>This company have various P&D works.</p>
						<p>A business backed by IFCE professors.</p>
					</v-card-title>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="lime">
				<div slot="opposite">2011</div>
				<v-card>
					<v-card-title>
						<p class="headline">
							R&D Software Developer at
							<a
								target="no"
								href="https://www.linkedin.com/company/novelbiz/"
							>Novelbiz</a>
						</p>
						<p>This startup had researches in robotics and recommendation systems.</p>
						<p>A business backed by IFCE professors.</p>
					</v-card-title>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="blue">
				<div slot="opposite">2010 - 2011</div>
				<v-card>
					<v-card-title>
						<p class="headline">
							Senior Analyst at
							<a target="eb" href="https://www.ebix.com/">Ebix Inc.</a>
						</p>
						<p>USIX S/A was acquired by Ebix Inc. in 2010.</p>
						<p>Core business still was insurance market.</p>
					</v-card-title>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="blue">
				<div slot="opposite">2007 - 2010</div>
				<v-card>
					<v-card-title>
						<p class="headline">
							Trainee, Programmer and Senior Programmer at
							<a
								target="us"
								href="https://www.linkedin.com/company/usix-technology/"
							>USIX S/A</a>
						</p>
						<p>Core business was insurance market and tackle ie6 bugs</p>
					</v-card-title>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="orange">
				<div slot="opposite">2006</div>
				<v-card>
					<v-card-title>
						<p class="headline">
							Trainee at
							<a
								target="co"
								href="https://www.facebook.com/pirambudigital/?rf=351248931610166"
							>Cooperativa Pirambu Digital</a>
						</p>
						<p>
							A social project to include young students into the digital market outsourcing
							and building in-house projects.
						</p>
					</v-card-title>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="white">
				<div slot="opposite">1984</div>
				<v-card>
					<v-card-title>
						<p class="headline">Born.</p>
						<p>
							Nowadays i really like to solve problems, either to pay my bills or just for fun.
							Also sports, i like to pratice sports. Running. Biking. Swimming sometimes. 
              Gamer when it's possible. 
						</p>
					</v-card-title>
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
