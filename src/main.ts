import { TagCloud } from "./index.ts";

const container = document.getElementById("cloud")!;
const canvas = document.createElement("canvas");
const dpr = window.devicePixelRatio || 1;
canvas.style.width = "100%";
canvas.style.height = "100%";
container.appendChild(canvas);

const ctx = canvas.getContext("2d")!;

const resize = () => {
  const { width, height } = container.getBoundingClientRect();
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};
resize();
window.addEventListener("resize", resize);

new TagCloud(container, {
  tags: [
    "TypeScript",
    "Canvas",
    "3D",
    "Tag Cloud",
    "Fibonacci",
    "Sphere",
    "Rotation",
    "Projection",
    "ES6",
    "Bun",
    "Vite",
    "oxlint",
    "oxfmt",
    "Lucide",
    "Astro",
    "date-fns",
    "Stalux",
    "Rust",
    "WASM",
    "Node.js",
  ],
  radius: 280,
  mode: "both",
  autoSpeed: 0.15,
  onRender(items) {
    const { width, height } = container.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    for (const t of items) {
      ctx.save();
      ctx.globalAlpha = t.alpha;
      ctx.font = `${13 + t.scale * 5}px system-ui, sans-serif`;
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    }
  },
});
