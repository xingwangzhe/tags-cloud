# @xingwangzhe/tags-cloud

[中文文档](README_CN.md) | [English](#)

> Pure math 3D tag cloud engine

## Features

- **Multi-modal** — text, images, SVG, HTML, video, Web Components
- **Fibonacci sphere distribution** — tags evenly placed on 3D sphere
- **Arcball interaction** — drag to rotate with quaternion-based Shoemake arcball
- **Auto-spin** — configurable per-axis spin (X/Y) with independent speed and direction
- **TypeScript** — fully typed
- **~3KB** gzipped

## Install

```bash
bun add @xingwangzhe/tags-cloud
```

## Usage

```ts
import { TagCloud } from "@xingwangzhe/tags-cloud";

new TagCloud(document.getElementById("cloud"), {
  tags: [
    "plain text",
    { type: "image", src: "/avatar.webp", width: 40, height: 40, onClick: () => open("/profile") },
    { type: "element", element: myComponent, onClick: () => console.log("clicked") },
    { type: "svg", content: "<svg>...</svg>", width: 48, height: 48 },
    { type: "html", html: "<b>bold</b>" },
    { type: "video", src: "/clip.mp4", width: 120, height: 68 },
  ],
  radius: 300,
  spinY: 0.15,
  onTagClick(item) { console.log("clicked", item); },
});
```

## Tag Types

| TagItem | Renderer | Example |
|---|---|---|
| `string` | Canvas | `"TypeScript"` |
| `{ type:"image" }` | Canvas | `{ type:"image", src, width, height, onClick? }` |
| `{ type:"svg" }` | DOM | `{ type:"svg", content, width, height, onClick? }` |
| `{ type:"html" }` | DOM | `{ type:"html", html, onClick? }` |
| `{ type:"video" }` | DOM | `{ type:"video", src, width, height, onClick? }` |
| `{ type:"element" }` | DOM | `{ type:"element", element, onClick? }` |

## API

### `new TagCloud(container, options)`

| Option | Type | Default | Description |
|---|---|---|---|
| `tags` | `TagItem[]` | — | Tag list (string or object) |
| `radius` | `number` | `300` | Sphere radius (px) |
| `width` | `number` | `0` | Canvas width in px (0 = auto) |
| `height` | `number` | `0` | Canvas height in px (0 = auto) |
| `spinY` | `number` | `0` | Y-axis spin: +right -left 0=off |
| `spinX` | `number` | `0` | X-axis spin: +down -up 0=off |
| `reverse` | `boolean` | `false` | Reverse both drag axes |
| `reverseX` | `boolean` | `false` | Reverse X-axis drag only |
| `reverseY` | `boolean` | `false` | Reverse Y-axis drag only |
| `inertiaDecay` | `number` | `0.96` | Inertia decay per frame |
| `dragSensitivity` | `number` | `3` | Drag sensitivity multiplier |
| `fontFamily` | `string` | `system-ui` | Font family |
| `fontSize` | `number` | `14` | Base font size (px) |
| `color` | `string` | `#fff` | Text color |
| `videoFullscreen` | `boolean` | `true` | Video tags click to fullscreen |
| `onTagClick` | `(item) => void` | — | Global click callback for all tags |
| `onRender` | `(tags) => void` | built-in | Custom render callback |

### Instance Methods

```ts
cloud.setTags(["new", "tags"]);
cloud.pause();
cloud.resume();
cloud.destroy();
```

## Development

```bash
bun install
bun run build       # vite build → dist/
bun run build:demo  # vite build → out/ (deployable HTML)
bun run lint        # oxlint
bun run fmt         # oxfmt
```

## Credits

**Special thanks to [cong-min/TagCloud](https://github.com/cong-min/TagCloud)** — the original 3D tag cloud library that inspired this project. Core sphere distribution and rotation algorithms are ported from TagCloud.js.

## License

MIT
