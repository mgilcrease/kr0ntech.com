import { LitElement as w, html as x, css as b } from "lit";
(function() {
  const i = document.createElement("link").relList;
  if (i && i.supports && i.supports("modulepreload"))
    return;
  for (const t of document.querySelectorAll('link[rel="modulepreload"]'))
    e(t);
  new MutationObserver((t) => {
    for (const n of t)
      if (n.type === "childList")
        for (const h of n.addedNodes)
          h.tagName === "LINK" && h.rel === "modulepreload" && e(h);
  }).observe(document, { childList: !0, subtree: !0 });
  function r(t) {
    const n = {};
    return t.integrity && (n.integrity = t.integrity), t.referrerpolicy && (n.referrerPolicy = t.referrerpolicy), t.crossorigin === "use-credentials" ? n.credentials = "include" : t.crossorigin === "anonymous" ? n.credentials = "omit" : n.credentials = "same-origin", n;
  }
  function e(t) {
    if (t.ep)
      return;
    t.ep = !0;
    const n = r(t);
    fetch(t.href, n);
  }
})();
class v extends w {
  static get properties() {
    return {};
  }
  constructor() {
    super();
  }
  render() {
    return x`<canvas id="animated-graph"></canvas>`;
  }
  /**
  	This closure implements the Particle physics as described in Franks Laboratory, with a few minor alterations
  	to make it work the way I want
  */
  renderCanvas() {
    const i = this.renderRoot.querySelector("#animated-graph"), r = i.getContext("2d");
    i.width = window.innerWidth, i.height = window.innerHeight;
    let e;
    class t {
      constructor(o, s, c, d, l, f) {
        this.x = o, this.y = s, this.directionX = c, this.directionY = d, this.size = l, this.color = f;
      }
      draw() {
        r.beginPath(), r.arc(this.x, this.y, this.size, 0, Math.PI * 2, !1), r.fillStyle = "#d3d3d3", r.fill();
      }
      // update position & redraw particle
      update() {
        (this.x > i.width || this.x < 0) && (this.directionX = -this.directionX), (this.y > i.height || this.y < 0) && (this.directionY = -this.directionY), this.x += this.directionX, this.y += this.directionY, this.draw();
      }
    }
    const n = () => {
      let a = 0.9;
      for (let o = 0; o < e.length; o++)
        for (let s = o; s < e.length; s++) {
          const c = Math.pow(e[o].x - e[s].x, 2) + Math.pow(e[o].y - e[s].y, 2);
          c < i.width / 7 * (i.height / 7) && (a = 0.9 - c / 2e4, r.strokeStyle = `rgba(200,200,200,${a})`, r.lineWidth = 1, r.beginPath(), r.moveTo(e[o].x, e[o].y), r.lineTo(e[s].x, e[s].y), r.stroke());
        }
    }, h = () => {
      const o = () => Math.random() * 0.125 - 0.0625;
      e = [];
      let s = i.height * i.width / 9e3;
      for (let c = 0; c < s; c++) {
        let d = Math.random() * 5 + 1, l = Math.random() * (innerWidth - d * 2 - d * 2) + d * 2, f = Math.random() * (innerHeight - d * 2 - d * 2) + d * 2, g = o(), m = o(), y = "#d3d3d3";
        e.push(new t(l, f, g, m, d, y));
      }
    }, u = () => {
      requestAnimationFrame(u), r.clearRect(0, 0, innerWidth, innerHeight);
      for (let a = 0; a < e.length; a++)
        e[a].update();
      n();
    };
    window.addEventListener("resize", function() {
      i.width = innerWidth, i.height = innerHeight, h();
    }), h(), u();
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
    return b`
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
window.customElements.define("animated-graph", v);
