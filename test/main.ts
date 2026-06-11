import { TagCloud } from "../src/index.ts";

// ── 响应式断点常量 / Responsive breakpoint constants
const MOBILE_BREAKPOINT = 768;
const MOBILE_RADIUS = 220;
const DESKTOP_RADIUS = 320;
const MOBILE_SPIN = 0.1;
const DESKTOP_SPIN = 0.15;
const MOBILE_HEIGHT = 400;
const MOBILE_PADDING = 32;

const isMobile = innerWidth < MOBILE_BREAKPOINT;

// ── 多模态标签云 ──
const cloud = new TagCloud(document.getElementById("cloud")!, {
  tags: [
    {
      html: '<div style="display:inline-flex;align-items:center;gap:10px;padding:6px 14px 6px 6px;border-radius:99px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);white-space:nowrap;cursor:pointer"><img src="https://xingwangzhe.fun/avatar.webp" width="32" height="32" style="border-radius:50%" alt="xingwangzhe" /><span style="font-weight:600;font-size:13px;color:#fff">xingwangzhe</span><span style="font-size:11px;color:rgba(255,255,255,0.5)">@GitHub</span></div>',
      type: "html",
      onClick: () => {
        window.open("https://github.com/xingwangzhe", "_blank");
      },
    },
    {
      height: 40,
      src: "https://xingwangzhe.fun/avatar.webp",
      type: "image",
      width: 40,
      onClick: () => {
        window.open("https://github.com/xingwangzhe", "_blank");
      },
    },
    {
      height: 68,
      src: "https://clipqr.needhelp.icu/%E6%BC%94%E7%A4%BA%E8%A7%86%E9%A2%91.mp4",
      type: "video",
      width: 120,
    },
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
  height: isMobile ? MOBILE_HEIGHT : 0,
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
    if (urls[name]) {
      window.open(urls[name], "_blank");
    }
  },
  radius: isMobile ? MOBILE_RADIUS : DESKTOP_RADIUS,
  spinY: isMobile ? MOBILE_SPIN : DESKTOP_SPIN,
  width: isMobile ? innerWidth - MOBILE_PADDING : 0,
});

// 持有引用，避免被 GC 回收 / keep reference to prevent GC
void cloud;
