import { TagCloud } from "./src/index";

// ── 响应式断点
const MOBILE_BREAKPOINT = 768;
const MOBILE_RADIUS = 220;
const DESKTOP_RADIUS = 320;
const MOBILE_SPIN = 0.1;
const DESKTOP_SPIN = 0.15;
const MOBILE_HEIGHT = 400;
const MOBILE_PADDING = 32;
const isMobile = innerWidth < MOBILE_BREAKPOINT;

// 品牌 Logo（本地 PNG，零网络请求）
const toImg = (name: string, url: string) => ({
  type: "image" as const,
  src: `/logos/${name}.png`,
  width: 40,
  height: 40,
  onClick: () => window.open(url, "_blank"),
});

const logoImages = [
  toImg("typescript", "https://www.typescriptlang.org/"),
  toImg("rust", "https://www.rust-lang.org/"),
  toImg("bun", "https://bun.sh/"),
  toImg("react", "https://react.dev/"),
  toImg("vue", "https://vuejs.org/"),
  toImg("svelte", "https://svelte.dev/"),
  toImg("docker", "https://www.docker.com/"),
  toImg("graphql", "https://graphql.org/"),
  toImg("postgresql", "https://www.postgresql.org/"),
  toImg("redis", "https://redis.io/"),
  toImg("vite", "https://vite.dev/"),
  toImg("deno", "https://deno.com/"),
  toImg("astro", "https://astro.build/"),
  toImg("nodejs", "https://nodejs.org/"),
  toImg("git", "https://git-scm.com/"),
  toImg("github", "https://github.com/"),
  toImg("sqlite", "https://www.sqlite.org/"),
  toImg("zig", "https://ziglang.org/"),
  toImg("webassembly", "https://webassembly.org/"),
  toImg("webrtc", "https://webrtc.org/"),
];

// 文字链接
const linkItems = [
  { type: "link" as const, text: "Solid", url: "https://www.solidjs.com/" },
  { type: "link" as const, text: "Qwik", url: "https://qwik.dev/" },
  { type: "link" as const, text: "Nix", url: "https://nixos.org/" },
  { type: "link" as const, text: "Linux", url: "https://www.linux.org/" },
  { type: "link" as const, text: "WebGL", url: "https://www.khronos.org/webgl/" },
  { type: "link" as const, text: "WebGPU", url: "https://www.w3.org/TR/webgpu/" },
  {
    type: "link" as const,
    text: "WebSocket",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API",
  },
  {
    type: "link" as const,
    text: "Canvas",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API",
  },
  { type: "link" as const, text: "CSS", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { type: "link" as const, text: "SVG", url: "https://developer.mozilla.org/en-US/docs/Web/SVG" },
  { type: "link" as const, text: "oxc", url: "https://oxc.rs/" },
  { type: "link" as const, text: "oxlint", url: "https://oxc.rs/docs/guide/usage/linter.html" },
  { type: "link" as const, text: "oxfmt", url: "https://oxc.rs/docs/guide/usage/formatter.html" },
  { type: "link" as const, text: "Biome", url: "https://biomejs.dev/" },
  { type: "link" as const, text: "Prettier", url: "https://prettier.io/" },
  { type: "link" as const, text: "TagCloud", url: "https://github.com/xingwangzhe/tags-cloud" },
  { type: "link" as const, text: "Stalux", url: "https://github.com/xingwangzhe/stalux" },
  { type: "link" as const, text: "xingwangzhe", url: "https://xingwangzhe.fun" },
];

// ── 标签云
const cloud = new TagCloud(document.getElementById("cloud")!, {
  tags: [
    // GitHub 卡片
    {
      html: '<div style="display:inline-flex;align-items:center;gap:10px;padding:6px 14px 6px 6px;border-radius:99px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);white-space:nowrap;cursor:pointer"><img src="/logos/github.png" width="32" height="32" style="border-radius:50%"><span style="font-weight:600;font-size:13px;color:#fff">xingwangzhe</span><span style="font-size:11px;color:rgba(255,255,255,0.5)">@GitHub</span></div>',
      type: "html",
      onClick: () => window.open("https://github.com/xingwangzhe", "_blank"),
    },
    // 品牌 Logo（本地 PNG）
    ...logoImages,
    // SVG 装饰
    {
      type: "svg",
      content:
        '<svg viewBox="0 0 24 24" fill="#FFD600"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
      width: 28,
      height: 28,
    },
    {
      type: "svg",
      content:
        '<svg viewBox="0 0 24 24" fill="#FF3D00"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
      width: 24,
      height: 24,
    },
    // 视频
    {
      type: "video",
      src: "https://clipqr.needhelp.icu/%E6%BC%94%E7%A4%BA%E8%A7%86%E9%A2%91.mp4",
      width: 120,
      height: 68,
    },
    // 文字链接
    ...linkItems,
    // 纯文本
    "3D",
    "ES6",
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

void cloud;
