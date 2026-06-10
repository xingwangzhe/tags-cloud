import { TagCloud } from "./index.ts";

new TagCloud(document.getElementById("cloud")!, {
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
});
