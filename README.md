# @xingwangzhe/tags-cloud

[中文文档](README_CN.md) | [English](#)

> Pure math 3D tag cloud engine

## Features

- **Multi-modal** — text, link, images, SVG, HTML, video, Web Components
- **Fibonacci sphere distribution** — tags evenly placed on 3D sphere
- **Arcball interaction** — drag to rotate with quaternion-based Shoemake arcball
- **Auto-spin** — configurable per-axis spin (X/Y) with independent speed and direction
- **TypeScript** — fully typed, zero tsc errors
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
    { type: "link", text: "TypeScript", url: "https://www.typescriptlang.org/" },
    { type: "image", src: "/avatar.webp", width: 40, height: 40, onClick: () => open("/profile") },
    { type: "svg", content: "<svg>...</svg>", width: 48, height: 48 },
    { type: "html", html: "<b>bold</b>" },
    { type: "video", src: "/clip.mp4", width: 120, height: 68 },
    { type: "element", element: myComponent },
  ],
  radius: 300,
  spinY: 0.15,
});
```

## Tag Types

### `string` — Plain Text (Canvas)

```ts
{
  tags: ["TypeScript", "Rust", "3D"];
}
```

| Field   | Type     | Required | Description                                            |
| ------- | -------- | :------: | ------------------------------------------------------ |
| (value) | `string` |   Yes    | Text rendered with `fontFamily` / `fontSize` / `color` |

### `{ type: "link" }` — Clickable Text Link (Canvas)

```ts
{ type: "link", text: "TypeScript", url: "https://www.typescriptlang.org/" }
```

| Field     | Type         | Required | Description                          |
| --------- | ------------ | :------: | ------------------------------------ |
| `text`    | `string`     |   Yes    | Display text                         |
| `url`     | `string`     |   Yes    | URL to open on click                 |
| `onClick` | `() => void` |    No    | Custom click handler (overrides url) |

### `{ type: "image" }` — Image (Canvas)

```ts
{ type: "image", src: "/avatar.webp", width: 40, height: 40, onClick: () => open("/profile") }
```

| Field     | Type         | Required | Description         |
| --------- | ------------ | :------: | ------------------- |
| `src`     | `string`     |   Yes    | Image URL           |
| `width`   | `number`     |   Yes    | Display width (px)  |
| `height`  | `number`     |   Yes    | Display height (px) |
| `onClick` | `() => void` |    No    | Click handler       |

### `{ type: "video" }` — Video (DOM)

```ts
{ type: "video", src: "/clip.mp4", width: 120, height: 68 }
```

| Field     | Type         | Required | Description                           |
| --------- | ------------ | :------: | ------------------------------------- |
| `src`     | `string`     |   Yes    | Video URL                             |
| `width`   | `number`     |   Yes    | Display width (px)                    |
| `height`  | `number`     |   Yes    | Display height (px)                   |
| `onClick` | `() => void` |    No    | Click handler (fullscreen by default) |

### `{ type: "html" }` — HTML (DOM)

```ts
{ type: "html", html: "<b>bold</b>", onClick: () => console.log("clicked") }
```

| Field     | Type         | Required | Description        |
| --------- | ------------ | :------: | ------------------ |
| `html`    | `string`     |   Yes    | `innerHTML` string |
| `onClick` | `() => void` |    No    | Click handler      |

### `{ type: "svg" }` — SVG (DOM)

```ts
{ type: "svg", content: "<svg viewBox=\"0 0 24 24\">...</svg>", width: 48, height: 48 }
```

| Field     | Type         | Required | Description         |
| --------- | ------------ | :------: | ------------------- |
| `content` | `string`     |   Yes    | SVG markup string   |
| `width`   | `number`     |   Yes    | Display width (px)  |
| `height`  | `number`     |   Yes    | Display height (px) |
| `onClick` | `() => void` |    No    | Click handler       |

### `{ type: "element" }` — DOM Element (DOM)

```ts
const el = document.createElement("div");
el.textContent = "Hello";
// ...
{ type: "element", element: el, onClick: () => el.classList.toggle("active") }
```

| Field     | Type          | Required | Description                         |
| --------- | ------------- | :------: | ----------------------------------- |
| `element` | `HTMLElement` |   Yes    | Any DOM element (appended as child) |
| `onClick` | `() => void`  |    No    | Click handler                       |

## API

### `new TagCloud(container, options)`

| Option            | Type             | Default     | Description                        |
| ----------------- | ---------------- | ----------- | ---------------------------------- |
| `tags`            | `TagItem[]`      | —           | Tag list (string or object)        |
| `radius`          | `number`         | `300`       | Sphere radius (px)                 |
| `width`           | `number`         | `0`         | Canvas width in px (0 = auto)      |
| `height`          | `number`         | `0`         | Canvas height in px (0 = auto)     |
| `spinY`           | `number`         | `0`         | Y-axis spin: +right -left 0=off    |
| `spinX`           | `number`         | `0`         | X-axis spin: +down -up 0=off       |
| `reverse`         | `boolean`        | `false`     | Reverse both drag axes             |
| `reverseX`        | `boolean`        | `false`     | Reverse X-axis drag only           |
| `reverseY`        | `boolean`        | `false`     | Reverse Y-axis drag only           |
| `inertiaDecay`    | `number`         | `0.96`      | Inertia decay per frame            |
| `dragSensitivity` | `number`         | `3`         | Drag sensitivity multiplier        |
| `fontFamily`      | `string`         | `system-ui` | Font family                        |
| `fontSize`        | `number`         | `14`        | Base font size (px)                |
| `color`           | `string`         | `#fff`      | Text color                         |
| `videoFullscreen` | `boolean`        | `true`      | Video tags click to fullscreen     |
| `onTagClick`      | `(item) => void` | —           | Global click callback for all tags |
| `onRender`        | `(tags) => void` | built-in    | Custom render callback             |

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
bun run lint        # oxlint (zero-error config)
bun run fmt         # oxfmt (auto-formatted)
```

## Credits

**Special thanks to [cong-min/TagCloud](https://github.com/cong-min/TagCloud)** — the original 3D tag cloud library that inspired this project. Core sphere distribution and rotation algorithms are ported from TagCloud.js.

## License

MIT
