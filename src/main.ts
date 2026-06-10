import { TagCloud } from "./index.ts";

// ── GitHub Card Web Component ──
class GitHubCard extends HTMLElement {
  connectedCallback() {
    const user = this.getAttribute("user") || "xingwangzhe";
    this.innerHTML = `<img src="https://xingwangzhe.fun/avatar.webp" alt="${user}" /><span class="name">@${user}</span><span class="stats">⭐ loading...</span>`;
    fetch(`https://api.github.com/users/${user}`)
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then((d) => {
        this.innerHTML = `<img src="${d.avatar_url}" alt="${user}" /><span class="name">@${user}</span><span class="stats">⭐ ${d.public_repos} repos · ${d.followers} followers</span>`;
      })
      .catch(() => {
        this.innerHTML = `<img src="https://xingwangzhe.fun/avatar.webp" alt="${user}" /><span class="name">@${user}</span><span class="stats">👋 Developer</span>`;
      });
  }
}
customElements.define("github-card", GitHubCard);

// ── 多模态标签云 ──
new TagCloud(document.getElementById("cloud")!, {
  tags: [
    {
      type: "element",
      element: new GitHubCard(),
      onClick: () => window.open("https://github.com/xingwangzhe", "_blank"),
    },
    { type: "image", src: "https://xingwangzhe.fun/avatar.webp", width: 40, height: 40, onClick: () => window.open("https://xingwangzhe.fun", "_blank") },
"TypeScript",
    "Canvas",
    "3D",
    "WebGL",
    "WebGPU",
    "Rust",
    "Zig",
    "Bun",
    "Vite",
    "oxc",
    "ES6",
    "WASM",
    "Node.js",
    "Deno",
    "Astro",
    "Vue",
    "React",
    "Svelte",
    "Solid",
    "Qwik",
    "Docker",
    "Linux",
    "Nix",
    "Git",
    "GitHub",
    "Postgres",
    "SQLite",
    "Redis",
    "GraphQL",
    "CSS",
    "SVG",
    "WebSocket",
    "WebRTC",
    "oxlint",
    "oxfmt",
    "Biome",
    "Prettier",
    "Fibonacci",
    "Quaternion",
    "Arcball",
    "TagCloud",
    "Stalux",
    "xingwangzhe",
  ],
  width: 900,
  height: 600,
  radius: 320,
  spinY: 0.15,
});
