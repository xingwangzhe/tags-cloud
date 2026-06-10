# @xingwangzhe/tags-cloud

[中文文档](README_CN.md) | [English](#)

> Pure math 3D tag cloud engine

## Features

- **Zero DOM overhead** — pure math output, render via callback
- **Fibonacci sphere distribution** — tags evenly placed on 3D sphere
- **Arcball interaction** — drag to rotate with quaternion-based Shoemake arcball
- **Auto-spin** — configurable per-axis spin (X/Y) with independent speed and direction
- **TypeScript** — fully typed
- **~2.3KB** gzipped

## Install

```bash
bun add @xingwangzhe/tags-cloud
```

## Usage

```ts
import { TagCloud } from "@xingwangzhe/tags-cloud";

// Zero config — auto-creates Canvas and renders text
new TagCloud(document.getElementById("cloud"), {
  tags: ["TypeScript", "Canvas", "3D"],
  radius: 300,
});
```

## API

### `new TagCloud(container, options)`

| Option            | Type             | Default         | Description                     |
| ----------------- | ---------------- | --------------- | ------------------------------- |
| `tags`            | `string[]`       | —               | Tag text list                   |
| `radius`          | `number`         | `300`           | Sphere radius (px)              |
| `spinY`           | `number`         | `0`             | Y-axis spin: +right -left 0=off |
| `spinX`           | `number`         | `0`             | X-axis spin: +down -up 0=off    |
| `reverse`         | `boolean`        | `false`         | Reverse both drag axes          |
| `reverseX`        | `boolean`        | `false`         | Reverse X-axis drag only        |
| `reverseY`        | `boolean`        | `false`         | Reverse Y-axis drag only        |
| `inertiaDecay`    | `number`         | `0.96`          | Inertia decay per frame         |
| `dragSensitivity` | `number`         | `3`             | Drag sensitivity multiplier     |
| `fontFamily`      | `string`         | `system-ui`     | Font family                     |
| `fontSize`        | `number`         | `14`            | Base font size (px)             |
| `color`           | `string`         | `#fff`          | Text color                      |
| `onRender`        | `(tags) => void` | built-in Canvas | Custom render callback          |

### Instance Methods

```ts
cloud.setTags(["new", "tags"]); // Update tags
cloud.pause(); // Pause
cloud.resume(); // Resume
cloud.destroy(); // Destroy (cleanup events + rAF)
```

## Development

```bash
bun install
bun run build    # vite build
bun run lint     # oxlint
bun run fmt      # oxfmt
```

## Credits

Core algorithm ported from [cong-min/TagCloud](https://github.com/cong-min/TagCloud)

## License

MIT
