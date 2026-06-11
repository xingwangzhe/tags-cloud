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

// ── 外部链接（一次定义，自包含 onClick，避免冗余映射）
const links: { name: string; url: string }[] = [
  { name: "TypeScript", url: "https://www.typescriptlang.org/" },
  { name: "Rust", url: "https://www.rust-lang.org/" },
  { name: "Zig", url: "https://ziglang.org/" },
  { name: "Bun", url: "https://bun.sh/" },
  { name: "Vite", url: "https://vite.dev/" },
  { name: "Astro", url: "https://astro.build/" },
  { name: "Vue", url: "https://vuejs.org/" },
  { name: "React", url: "https://react.dev/" },
  { name: "Svelte", url: "https://svelte.dev/" },
  { name: "Solid", url: "https://www.solidjs.com/" },
  { name: "Qwik", url: "https://qwik.dev/" },
  { name: "Deno", url: "https://deno.com/" },
  { name: "Docker", url: "https://www.docker.com/" },
  { name: "Nix", url: "https://nixos.org/" },
  { name: "Git", url: "https://git-scm.com/" },
  { name: "GitHub", url: "https://github.com/" },
  { name: "GraphQL", url: "https://graphql.org/" },
  { name: "Postgres", url: "https://www.postgresql.org/" },
  { name: "SQLite", url: "https://www.sqlite.org/" },
  { name: "Redis", url: "https://redis.io/" },
  { name: "WebGL", url: "https://www.khronos.org/webgl/" },
  { name: "WebGPU", url: "https://www.w3.org/TR/webgpu/" },
  { name: "WebRTC", url: "https://webrtc.org/" },
  { name: "WebSocket", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" },
  { name: "WASM", url: "https://webassembly.org/" },
  { name: "Canvas", url: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" },
  { name: "CSS", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { name: "SVG", url: "https://developer.mozilla.org/en-US/docs/Web/SVG" },
  { name: "oxc", url: "https://oxc.rs/" },
  { name: "oxlint", url: "https://oxc.rs/docs/guide/usage/linter.html" },
  { name: "oxfmt", url: "https://oxc.rs/docs/guide/usage/formatter.html" },
  { name: "Biome", url: "https://biomejs.dev/" },
  { name: "Prettier", url: "https://prettier.io/" },
  { name: "TagCloud", url: "https://github.com/xingwangzhe/tags-cloud" },
  { name: "Stalux", url: "https://github.com/xingwangzhe/stalux" },
  { name: "xingwangzhe", url: "https://xingwangzhe.fun" },
];

const linkTags = links.map((l) => ({
  type: "html" as const,
  html: l.name,
  onClick: () => {
    window.open(l.url, "_blank");
  },
}));

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
    ...linkTags,
    "3D",
    "ES6",
    "Node.js",
    "Linux",
    "Fibonacci",
    "Quaternion",
    "Arcball",
  ],
  height: isMobile ? MOBILE_HEIGHT : 0,
  radius: isMobile ? MOBILE_RADIUS : DESKTOP_RADIUS,
  spinY: isMobile ? MOBILE_SPIN : DESKTOP_SPIN,
  width: isMobile ? innerWidth - MOBILE_PADDING : 0,
});

// 持有引用，避免被 GC 回收 / keep reference to prevent GC
void cloud;
