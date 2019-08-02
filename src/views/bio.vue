<template>
	<div>
		<basic-instructions />
		<v-timeline dense>
			<v-timeline-item v-for="w in cv.work" :key="w.company" :color="w.color">
				<div>{{w.start}} - {{w.end}}</div>
			</v-timeline-item>
			<v-timeline-item color="#ff4422">
				<div>2019 - present</div>
				<v-card>
					<v-card-title class="headline">
						Software developer at
						<a target="cm" href="https://www.casamagalhaes.com.br/"
							>Grupo Casa Magalhães</a
						>
					</v-card-title>
					<v-card-text>
						<p>
							At
							<a href="https://www.casamagalhaes.com.br"
								>Casa Magalhães Group</a
							>
							we deliver mission critical financial operations for the entire
							country with real time receipt validation against the SEFAZ
							webservice.
						</p>
						<p>But there's more.</p>
						<p>
							<v-chip>nodejs</v-chip>
							<v-chip>mysql</v-chip>
							<v-chip>sequelize</v-chip>
							<v-chip>sequelize migrations</v-chip>
							<v-chip>gulp</v-chip>
							<v-chip>AWS Lambda</v-chip>
							<v-chip>Pusher</v-chip>
							<v-chip>AWS DynamoDB</v-chip>
							<v-chip>AWS SES</v-chip>
							<v-chip>AWS Api Gateway</v-chip>
							<v-chip>QT</v-chip>
							<v-chip>quasar framework</v-chip>
							<v-chip>element UI</v-chip>
							<v-chip>kendo UI</v-chip>
							<v-chip>webpack</v-chip>
							<v-chip>vue</v-chip>
							<v-chip>AWS CodeBuild</v-chip>
							<v-chip>material design</v-chip>
							<v-chip>AWS CodePipeline</v-chip>
							<v-chip>SPA</v-chip>
							<v-chip>REST</v-chip>
							<v-chip>AWS SQS</v-chip>
							<v-chip>codeclimate</v-chip>
						</p>
					</v-card-text>
				</v-card>
			</v-timeline-item>
			<v-timeline-item color="cyan">
				<div>2016 - 2019</div>
				<v-card>
					<v-card-title class="headline">
						Chief Technology Officer at
						<a target="tp" href="https://techpar.github.io/">Techpar</a>
					</v-card-title>
					<v-card-text>
						<p>
							This startup dealt with software solutions on various fields. From
							community management to renewable energy.
						</p>
						<p>A company built by former usix/ebix coworkers.</p>
						<h5>Tech stack</h5>
						<p>
							<v-chip>nodejs</v-chip>
							<v-chip>postgresql</v-chip>
							<v-chip>knex</v-chip>
							<v-chip>bookshelf</v-chip>
							<v-chip>express</v-chip>
							<v-chip>socket.io</v-chip>
							<v-chip>onesignal</v-chip>
							<v-chip>elasticemail</v-chip>
							<v-chip>sendgrid</v-chip>
							<v-chip>cordova</v-chip>
							<v-chip>nativescript</v-chip>
							<v-chip>webpack</v-chip>
							<v-chip>browserify</v-chip>
							<v-chip>vue</v-chip>
							<v-chip>angularjs</v-chip>
							<v-chip>material design</v-chip>
							<v-chip>bootstrap</v-chip>
							<v-chip>SPA</v-chip>
							<v-chip>REST</v-chip>
						</p>
					</v-card-text>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="cyan">
				<div>2014 - 2016</div>
				<v-card>
					<v-card-title class="headline">
						Chief Technology Officer at
						<a target="g4" href="https://www.facebook.com/gameforlearning/"
							>G4l - Game For Learning</a
						>
					</v-card-title>
					<v-card-text>
						<p>This startup was focused on Educational mobile games.</p>
						<p>A business by former usix/ebix coworkers.</p>
						<h5>Tech stack</h5>
						<p>
							<v-chip>postgresql</v-chip>
							<v-chip>Java EE</v-chip>
							<v-chip>cordova</v-chip>
							<v-chip>Phaser JS</v-chip>
							<v-chip>angularjs</v-chip>
							<v-chip>bootstrap</v-chip>
							<v-chip>REST</v-chip>
						</p>
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
							>Atlanta Tecnologia</a
						>
					</v-card-title>
					<v-card-text>
						<p>This company was focused on Transit law enforcement.</p>
						<h5>Tech stack</h5>
						<p>
							<v-chip>postgresql</v-chip>
							<v-chip>mysql</v-chip>
							<v-chip>Java EE</v-chip>
							<v-chip>Spring</v-chip>
							<v-chip>nrjavaserial</v-chip>
							<v-chip>angularjs</v-chip>
							<v-chip>bootstrap</v-chip>
							<v-chip>image processing</v-chip>
						</p>
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
							>Ifactory Solutions</a
						>
					</v-card-title>
					<v-card-text>
						<p>
							This company was a big outsource provider for software
							development.
						</p>
						<h5>Tech stack</h5>
						<p>
							<v-chip>Java</v-chip>
							<v-chip>Polopoly</v-chip>
						</p>
					</v-card-text>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="lime">
				<div>2012</div>
				<v-card>
					<v-card-title class="headline">
						Software Developer at
						<a target="he" href="http://www.hexat.com.br/hexa/"
							>Hexa Tecnologia</a
						>
					</v-card-title>
					<v-card-text>
						<p>This company have various P&D works.</p>
						<p>A business backed by IFCE professors.</p>
						<h5>Tech stack</h5>
						<p>
							<v-chip>php</v-chip>
							<v-chip>mysql</v-chip>
							<v-chip>Java EE</v-chip>
							<v-chip>android</v-chip>
							<v-chip>REST</v-chip>
						</p>
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
						<h5>Tech stack</h5>
						<p>
							<v-chip>oracle database</v-chip>
							<v-chip>Java EE</v-chip>
							<v-chip>Spring</v-chip>
							<v-chip>vraptor</v-chip>
							<v-chip>angularjs</v-chip>
							<v-chip>bootstrap</v-chip>
							<v-chip>CD/CI - continuous delivery and integration</v-chip>
						</p>
					</v-card-text>
				</v-card>
			</v-timeline-item>

			<v-timeline-item color="lime">
				<div>2011</div>
				<v-card>
					<v-card-title class="headline">
						R&D Software Developer at
						<a target="no" href="https://www.linkedin.com/company/novelbiz/"
							>Novelbiz</a
						>
					</v-card-title>
					<v-card-text>
						<p>
							This startup had researches in robotics and recommendation
							systems.
						</p>
						<p>A business backed by IFCE professors.</p>
						<h5>Tech stack</h5>
						<p>
							<v-chip>C/C++</v-chip>
							<v-chip>embedded systems</v-chip>
							<v-chip>android</v-chip>
							<v-chip>REST</v-chip>
							<v-chip>Java EE</v-chip>
							<v-chip>mysql</v-chip>
							<v-chip>recommendation systems - collaborative filtering</v-chip>
						</p>
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
						<h5>Tech stack</h5>
						<p>
							<v-chip>JQuery</v-chip>
							<v-chip>DWR - direct web remoting</v-chip>
							<v-chip>SPA</v-chip>
							<v-chip>oracle database</v-chip>
							<v-chip>websphere application server</v-chip>
							<v-chip>Java EE</v-chip>
							<v-chip>JNI - Java Native Interface</v-chip>
							<v-chip>C/C++</v-chip>
							<v-chip>UNIX HP-UX</v-chip>
							<v-chip>proprietary insurance busines metamodel engine</v-chip>
						</p>
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
							>USIX S/A</a
						>
					</v-card-title>
					<v-card-text>
						<p>Core business was insurance market and tackle ie6 bugs</p>
						<h5>Tech stack</h5>
						<p>
							<v-chip>JQuery</v-chip>
							<v-chip>DWR - direct web remoting</v-chip>
							<v-chip>Struts 1</v-chip>
							<v-chip>oracle database</v-chip>
							<v-chip>websphere application server</v-chip>
							<v-chip>Java EE</v-chip>
							<v-chip>JNI - Java Native Interface</v-chip>
							<v-chip>C/C++</v-chip>
							<v-chip>proprietary insurance busines metamodel engine</v-chip>
						</p>
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
							>Cooperativa Pirambu Digital</a
						>
					</v-card-title>
					<v-card-text>
						<p>
							A social project to include young students into the digital market
							outsourcing and building in-house projects.
						</p>
						<h5>Tech stack</h5>
						<p>
							<v-chip>JQuery</v-chip>
							<v-chip>Struts 1</v-chip>
							<v-chip>mysql</v-chip>
							<v-chip>Java</v-chip>
						</p>
					</v-card-text>
				</v-card>
			</v-timeline-item>

			<v-timeline-item v-for="e in cv.education" :key="e.course" :color="e.color">
				<div>{{e.start}} - {{e.end}}</div>
				<v-card>
					<v-card-title class="headline">
						{{e.type}} at
						<a target="if" :href="e.site">{{e.institution}}</a>
					</v-card-title>
					<v-card-text>
						<p>{{e.description}}</p>
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
const cv = require("../curriculum.json");
const BasicInstructions = require("../components/basic-instructions.vue")
module.exports = {
	name: "Bio",
	components:{
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
