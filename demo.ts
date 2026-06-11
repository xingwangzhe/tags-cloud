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
// ── GitHub Explore topic logos (toImg helper)
const T = "https://raw.githubusercontent.com/github/explore/main/topics";
const toImg = (slug: string, url: string) => ({
  type: "image" as const,
  src: `${T}/${slug}/${slug}.png`,
  width: 40,
  height: 40,
  onClick: () => window.open(url, "_blank"),
});

const logoImages = [
  toImg("bun", "https://bun.sh/"),
  toImg("react", "https://react.dev/"),
  toImg("vue", "https://vuejs.org/"),
  toImg("svelte", "https://svelte.dev/"),
  toImg("docker", "https://www.docker.com/"),
  toImg("graphql", "https://graphql.org/"),
  toImg("postgresql", "https://www.postgresql.org/"),
  toImg("redis", "https://redis.io/"),
  toImg("deno", "https://deno.com/"),
  toImg("vite", "https://vite.dev/"),
  toImg("astro", "https://astro.build/"),
  toImg("webassembly", "https://webassembly.org/"),
];

// ── 文字链接（logo 已覆盖的移除，避免重复）──
const links: { text: string; url: string }[] = [
  { text: "TypeScript", url: "https://www.typescriptlang.org/" },
  { text: "Rust", url: "https://www.rust-lang.org/" },
  { text: "Zig", url: "https://ziglang.org/" },
  { text: "Solid", url: "https://www.solidjs.com/" },
  { text: "Qwik", url: "https://qwik.dev/" },
  { text: "Nix", url: "https://nixos.org/" },
  { text: "Git", url: "https://git-scm.com/" },
  { text: "GitHub", url: "https://github.com/" },
  { text: "SQLite", url: "https://www.sqlite.org/" },
  { text: "WebGL", url: "https://www.khronos.org/webgl/" },
  { text: "WebGPU", url: "https://www.w3.org/TR/webgpu/" },
  { text: "WebRTC", url: "https://webrtc.org/" },
  { text: "WebSocket", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" },
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
    // ── HTML 卡片 ──
    {
      html: '<div style="display:inline-flex;align-items:center;gap:10px;padding:6px 14px 6px 6px;border-radius:99px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);white-space:nowrap;cursor:pointer"><img src="https://xingwangzhe.fun/avatar.webp" width="32" height="32" style="border-radius:50%" alt="xingwangzhe" /><span style="font-weight:600;font-size:13px;color:#fff">xingwangzhe</span><span style="font-size:11px;color:rgba(255,255,255,0.5)">@GitHub</span></div>',
      type: "html",
      onClick: () => window.open("https://github.com/xingwangzhe", "_blank"),
    },
    // ── 外部图片 ──
    {
      type: "image",
      src: "https://xingwangzhe.fun/avatar.webp",
      width: 40,
      height: 40,
      onClick: () => window.open("https://xingwangzhe.fun", "_blank"),
    },
    {
      type: "image",
      src: "https://raw.githubusercontent.com/github/explore/main/topics/typescript/typescript.png",
      width: 40,
      height: 40,
      onClick: () => window.open("https://www.typescriptlang.org/", "_blank"),
    },
    {
      type: "image",
      src: "https://raw.githubusercontent.com/github/explore/main/topics/rust/rust.png",
      width: 40,
      height: 40,
      onClick: () => window.open("https://www.rust-lang.org/", "_blank"),
    },
    // ── SVG 图标 ──
    {
      type: "svg",
      content:
        '<svg viewBox="0 0 24 24" fill="#FFD600"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
      width: 32,
      height: 32,
    },
    {
      type: "svg",
      content:
        '<svg viewBox="0 0 24 24" fill="#FF3D00"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
      width: 28,
      height: 28,
    },
    // ── 视频 ──
    {
      type: "video",
      src: "https://clipqr.needhelp.icu/%E6%BC%94%E7%A4%BA%E8%A7%86%E9%A2%91.mp4",
      width: 120,
      height: 68,
    },
    // ── Logo 图片 ──
    ...logoImages,
    // ── 链接标签 ──
    ...linkTags,
    // ── 纯文本 ──
    "3D",
    "ES6",
    "Node.js",
    "Linux",
    "macOS",
    "Windows",
    "Fibonacci",
    "Quaternion",
    "Arcball",
    "Matrix",
    "Rodrigues",
    "Euler",
    "Decay",
    "Inertia",
    "Canvas2D",
    "Offscreen",
    "Isometry",
    "Raycast",
    "Pipeline",
    "Gzip ~3KB",
    "Zero Deps",
    "O(N)",
  ],
  height: isMobile ? MOBILE_HEIGHT : 0,
  radius: isMobile ? MOBILE_RADIUS : DESKTOP_RADIUS,
  spinY: isMobile ? MOBILE_SPIN : DESKTOP_SPIN,
  width: isMobile ? innerWidth - MOBILE_PADDING : 0,
});

// 持有引用，避免被 GC 回收 / keep reference to prevent GC
void cloud;
