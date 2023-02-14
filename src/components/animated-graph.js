import { LitElement, css, html } from 'lit'
import { util } from '../scripts/util.js';

export class AnimatedGraph extends LitElement {
	static get properties() {
		return {
		}
	}

	constructor() {
		super();
	}

	render() {
		return html`<canvas id="animated-graph"></canvas>`;
	}

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

			// check particle position, check mouse position, move the particle, draw the particle
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

		const init = () => {
			// Initialize the particle set
			const speedFactor = .05;

			particles = [];
			let numberOfParticles = (canvas.height * canvas.width) / 9000;
			for (let i = 0; i < numberOfParticles; i++) {
				let size = (Math.random() * 5) + 1;
				let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
				let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
				let directionX = (Math.random() * (2.5 * speedFactor)) - (1.25 * speedFactor);
				let directionY = (Math.random() * (2.5 * speedFactor)) - (1.25 * speedFactor);
				let color = '#d3d3d3';

				particles.push(new Particle(x, y, directionX, directionY, size, color));
			}
		}

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
			mouse.radius = ((canvas.height/80) * (canvas.height/80));
			init();
		});

		init();
		animate();
	}



	firstUpdated() {
		this.renderCanvas();
	}

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

window.customElements.define('animated-graph', AnimatedGraph);
