import { TagCloud } from "../src/index.ts";

// ── GitHub Card Web Component ──
class GitHubCard extends HTMLElement {
  connectedCallback() {
    const user = this.getAttribute("user") || "xingwangzhe";
    this.innerHTML = `<img src="https://xingwangzhe.fun/avatar.webp" alt="${user}" /><span class="name">xingwangzhe.fun</span><span class="stats">⭐ loading...</span>`;
    fetch(`https://api.github.com/users/${user}`)
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then((d) => {
        this.innerHTML = `<img src="${d.avatar_url}" alt="${user}" /><span class="name">xingwangzhe.fun</span><span class="stats">⭐ ${d.public_repos} repos · ${d.followers} followers</span>`;
      })
      .catch(() => {
        this.innerHTML = `<img src="https://xingwangzhe.fun/avatar.webp" alt="${user}" /><span class="name">xingwangzhe.fun</span><span class="stats">👋 Developer</span>`;
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
      onClick: () => window.open("https://xingwangzhe.fun", "_blank"),
    },
    { type: "image", src: "https://xingwangzhe.fun/avatar.webp", width: 40, height: 40, onClick: () => window.open("https://github.com/xingwangzhe", "_blank") },
    { type: "video", src: "https://clipqr.needhelp.icu/%E6%BC%94%E7%A4%BA%E8%A7%86%E9%A2%91.mp4", width: 120, height: 68 },
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
  width: 1100,
  height: 600,
  onTagClick(item) {
    const urls: Record<string, string> = {
      TypeScript: "https://www.typescriptlang.org/",
      Rust: "https://www.rust-lang.org/",
      Zig: "https://ziglang.org/",
      Bun: "https://bun.sh/",
      Vite: "https://vite.dev/",
      Astro: "https://astro.build/",
      Vue: "https://vuejs.org/",
      React: "https://react.dev/",
      Svelte: "https://svelte.dev/",
      Solid: "https://www.solidjs.com/",
      Qwik: "https://qwik.dev/",
      Deno: "https://deno.com/",
      Docker: "https://www.docker.com/",
      Nix: "https://nixos.org/",
      Git: "https://git-scm.com/",
      GitHub: "https://github.com/",
      GraphQL: "https://graphql.org/",
      Postgres: "https://www.postgresql.org/",
      SQLite: "https://www.sqlite.org/",
      Redis: "https://redis.io/",
      WebGL: "https://www.khronos.org/webgl/",
      WebGPU: "https://www.w3.org/TR/webgpu/",
      WebRTC: "https://webrtc.org/",
      WebSocket: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API",
      WASM: "https://webassembly.org/",
      Canvas: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API",
      CSS: "https://developer.mozilla.org/en-US/docs/Web/CSS",
      SVG: "https://developer.mozilla.org/en-US/docs/Web/SVG",
      oxc: "https://oxc.rs/",
      oxlint: "https://oxc.rs/docs/guide/usage/linter.html",
      oxfmt: "https://oxc.rs/docs/guide/usage/formatter.html",
      Biome: "https://biomejs.dev/",
      Prettier: "https://prettier.io/",
      TagCloud: "https://github.com/xingwangzhe/tags-cloud",
      Stalux: "https://github.com/xingwangzhe/stalux",
      xingwangzhe: "https://xingwangzhe.fun",
    };
    const name = typeof item === "string" ? item : "";
    if (urls[name]) window.open(urls[name], "_blank");
  },
  radius: 320,
  spinY: 0.15,
});
