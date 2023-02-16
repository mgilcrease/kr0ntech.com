/**
	This web component implements a canvas-based animation taken from the excellent youtube channel, Franks laboratory.

	https://www.youtube.com/@Frankslaboratory

	Highly recommended for developers who want to learn about writing visual animations using the html5 canvas tag.

	I decided to implement the animation as a web component using the lit-element library, in order to review & refine
	my web component skills. I love standards-based web development using libraries that are elegantly designed to
	simplify the use of vanilla js, html & css.
*/
import { LitElement, css, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

export class AnimatedGraph extends LitElement {
	static get properties() {
		return {
		}
	}

	constructor() {
		super();
	}

	render() {
		// lit-element is great, because it allows you to write your web components with html tags encoded in
		// interpolated strings, rather than writing messy DOM js code. You get a simple set of methods & lifecycle events
		// very similar to react, but without the virtual DOM overhead
		return html`<canvas id="animated-graph"></canvas>`;
	}

	/**
		This closure implements the Particle physics as described in Franks Laboratory, with a few minor alterations
		to make it work the way I want
	*/
	renderCanvas() {
		const canvas = this.renderRoot.querySelector('#animated-graph');
		const ctx = canvas.getContext('2d');

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		let particles;

		// create particle
		let edgeBounce = 10;
		class Particle {
			constructor(x, y, directionX, directionY, size, color) {
				this.x = x;
				this.y = y;
				this.directionX = directionX;
				this.directionY = directionY;
				this.size = size;
				this.color = color;
			}

			draw() {
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
				ctx.fillStyle = '#d3d3d3';
				ctx.fill();	
			}

			// update position & redraw particle
			update() {
				if (this.x > canvas.width || this.x < 0) {
					this.directionX = -this.directionX;
				}
				if (this.y > canvas.height || this.y < 0) {
					this.directionY = -this.directionY;
				}

				this.x += this.directionX;
				this.y += this.directionY;
					
				// draw particle
				this.draw();
			}
		}

		const connect = () => {
			let opacity = .9;
			for (let a = 0; a < particles.length; a++) {
				for (let b = a; b < particles.length; b++) {
					const distance = Math.pow((particles[a].x - particles[b].x), 2) + Math.pow((particles[a].y - particles[b].y), 2);

					if (distance < (canvas.width/7) * (canvas.height/7)) {
						opacity = .9 - (distance / 20000);
						ctx.strokeStyle = `rgba(200,200,200,${opacity})`;
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.moveTo(particles[a].x, particles[a].y);
						ctx.lineTo(particles[b].x, particles[b].y);
						ctx.stroke();
					}
				}
			}
		}

		/**
			Initialize the particle set
		*/
		const init = () => {
			const speedFactor = .05; 
			const particleVelocity = () => (Math.random() * (2.5 * speedFactor)) - (1.25 * speedFactor);

			particles = [];
			let numberOfParticles = (canvas.height * canvas.width) / 9000;
			for (let i = 0; i < numberOfParticles; i++) {
				let size = (Math.random() * 5) + 1;
				let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
				let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
				let directionX = particleVelocity();
				let directionY = particleVelocity();
				let color = '#d3d3d3';

				particles.push(new Particle(x, y, directionX, directionY, size, color));
			}
		}

		/**
			Animation loop
		*/
		const animate = () => {
			requestAnimationFrame(animate);

			ctx.clearRect(0, 0, innerWidth, innerHeight);

			for (let i = 0; i < particles.length; i++) {
				particles[i].update();
			}

			connect();
		}

		window.addEventListener('resize', function() {
			canvas.width = innerWidth;
			canvas.height = innerHeight;
			init();
		});

		// GO!
		init();
		animate();
	}

	/**
		lit-element lifecycle event handler. Runs init code for your element once it has attached to your document
	*/
	firstUpdated() {
		this.renderCanvas();
	}

	/**
		lit-element interpolated string for defining your css at the component-level. Similar to how react does it, but
		nicer
	*/
	static get styles() {
		return css`
			#animated-graph {
				display: block;
				position: fixed;
				margin: 0; padding: 0;
				border: 0;
				outline: 0;
				top: 0; left: 0;
				width: 100%;
				height: 100%;
				background: radial-gradient(#fafafa, #ffffff);
				z-index: -1;
			}
		`;
	}
}

// Register this web component
window.customElements.define('animated-graph', AnimatedGraph);
