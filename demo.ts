import { TagCloud } from "./src/index";

// ── 响应式断点常量 / Responsive breakpoint constants
const MOBILE_BREAKPOINT = 768;
const MOBILE_RADIUS = 220;
const DESKTOP_RADIUS = 320;
const MOBILE_SPIN = 0.1;
const DESKTOP_SPIN = 0.15;
const MOBILE_HEIGHT = 400;
const MOBILE_PADDING = 32;

const isMobile = innerWidth < MOBILE_BREAKPOINT;

// ── 外部链接（link 类型：Canvas 文本 + 自带点击跳转，零额外开销）
const links: { text: string; url: string }[] = [
  { text: "TypeScript", url: "https://www.typescriptlang.org/" },
  { text: "Rust", url: "https://www.rust-lang.org/" },
  { text: "Zig", url: "https://ziglang.org/" },
  { text: "Bun", url: "https://bun.sh/" },
  { text: "Vite", url: "https://vite.dev/" },
  { text: "Astro", url: "https://astro.build/" },
  { text: "Vue", url: "https://vuejs.org/" },
  { text: "React", url: "https://react.dev/" },
  { text: "Svelte", url: "https://svelte.dev/" },
  { text: "Solid", url: "https://www.solidjs.com/" },
  { text: "Qwik", url: "https://qwik.dev/" },
  { text: "Deno", url: "https://deno.com/" },
  { text: "Docker", url: "https://www.docker.com/" },
  { text: "Nix", url: "https://nixos.org/" },
  { text: "Git", url: "https://git-scm.com/" },
  { text: "GitHub", url: "https://github.com/" },
  { text: "GraphQL", url: "https://graphql.org/" },
  { text: "Postgres", url: "https://www.postgresql.org/" },
  { text: "SQLite", url: "https://www.sqlite.org/" },
  { text: "Redis", url: "https://redis.io/" },
  { text: "WebGL", url: "https://www.khronos.org/webgl/" },
  { text: "WebGPU", url: "https://www.w3.org/TR/webgpu/" },
  { text: "WebRTC", url: "https://webrtc.org/" },
  { text: "WebSocket", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" },
  { text: "WASM", url: "https://webassembly.org/" },
  { text: "Canvas", url: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" },
  { text: "CSS", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { text: "SVG", url: "https://developer.mozilla.org/en-US/docs/Web/SVG" },
  { text: "oxc", url: "https://oxc.rs/" },
  { text: "oxlint", url: "https://oxc.rs/docs/guide/usage/linter.html" },
  { text: "oxfmt", url: "https://oxc.rs/docs/guide/usage/formatter.html" },
  { text: "Biome", url: "https://biomejs.dev/" },
  { text: "Prettier", url: "https://prettier.io/" },
  { text: "TagCloud", url: "https://github.com/xingwangzhe/tags-cloud" },
  { text: "Stalux", url: "https://github.com/xingwangzhe/stalux" },
  { text: "xingwangzhe", url: "https://xingwangzhe.fun" },
];

const linkTags = links.map((l) => ({
  type: "link" as const,
  text: l.text,
  url: l.url,
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
