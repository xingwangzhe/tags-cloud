# @xingwangzhe/tags-cloud

[English](README.md) | [中文文档](#)

> 纯数学 3D 标签云引擎

## 特性

- **多模态** — 文本、链接、图片、SVG、HTML、视频、Web Component
- **斐波那契球面分布** — 标签均匀分布在 3D 球面
- **Arcball 交互** — Shoemake 四元数弧球拖拽旋转
- **自旋** — 可配置分轴自旋（X/Y），独立速度和方向
- **TypeScript** — 全类型安全，零 tsc 错误
- **~3KB** gzip

## 安装

```bash
bun add @xingwangzhe/tags-cloud
```

## 使用

```ts
import { TagCloud } from "@xingwangzhe/tags-cloud";

new TagCloud(document.getElementById("cloud"), {
  tags: [
    "纯文本",
    { type: "link", text: "TypeScript", url: "https://www.typescriptlang.org/" },
    { type: "image", src: "/avatar.webp", width: 40, height: 40, onClick: () => open("/profile") },
    { type: "svg", content: "<svg>...</svg>", width: 48, height: 48 },
    { type: "html", html: "<b>粗体</b>" },
    { type: "video", src: "/clip.mp4", width: 120, height: 68 },
    { type: "element", element: myComponent },
  ],
  radius: 300,
  spinY: 0.15,
});
```

## 标签类型

### `string` — 纯文本（Canvas）

```ts
{
  tags: ["TypeScript", "Rust", "3D"];
}
```

| 字段 | 类型     | 必填 | 说明                                               |
| ---- | -------- | :--: | -------------------------------------------------- |
| (值) | `string` |  是  | 文本，使用全局 `fontFamily` / `fontSize` / `color` |

### `{ type: "link" }` — 可点击文本链接（Canvas）

```ts
{ type: "link", text: "TypeScript", url: "https://www.typescriptlang.org/" }
```

| 字段      | 类型         | 必填 | 说明                   |
| --------- | ------------ | :--: | ---------------------- |
| `text`    | `string`     |  是  | 显示文本               |
| `url`     | `string`     |  是  | 点击跳转 URL           |
| `onClick` | `() => void` |  否  | 自定义点击（覆盖 url） |

### `{ type: "image" }` — 图片（Canvas）

```ts
{ type: "image", src: "/avatar.webp", width: 40, height: 40, onClick: () => open("/profile") }
```

| 字段      | 类型         | 必填 | 说明           |
| --------- | ------------ | :--: | -------------- |
| `src`     | `string`     |  是  | 图片 URL       |
| `width`   | `number`     |  是  | 显示宽度（px） |
| `height`  | `number`     |  是  | 显示高度（px） |
| `onClick` | `() => void` |  否  | 点击回调       |

### `{ type: "video" }` — 视频（DOM）

```ts
{ type: "video", src: "/clip.mp4", width: 120, height: 68 }
```

| 字段      | 类型         | 必填 | 说明                 |
| --------- | ------------ | :--: | -------------------- |
| `src`     | `string`     |  是  | 视频 URL             |
| `width`   | `number`     |  是  | 显示宽度（px）       |
| `height`  | `number`     |  是  | 显示高度（px）       |
| `onClick` | `() => void` |  否  | 点击回调（默认全屏） |

### `{ type: "html" }` — HTML（DOM）

```ts
{ type: "html", html: "<b>粗体</b>", onClick: () => console.log("clicked") }
```

| 字段      | 类型         | 必填 | 说明               |
| --------- | ------------ | :--: | ------------------ |
| `html`    | `string`     |  是  | `innerHTML` 字符串 |
| `onClick` | `() => void` |  否  | 点击回调           |

### `{ type: "svg" }` — SVG（DOM）

```ts
{ type: "svg", content: "<svg viewBox=\"0 0 24 24\">...</svg>", width: 48, height: 48 }
```

| 字段      | 类型         | 必填 | 说明           |
| --------- | ------------ | :--: | -------------- |
| `content` | `string`     |  是  | SVG 标记字符串 |
| `width`   | `number`     |  是  | 显示宽度（px） |
| `height`  | `number`     |  是  | 显示高度（px） |
| `onClick` | `() => void` |  否  | 点击回调       |

### `{ type: "element" }` — DOM 元素（DOM）

```ts
const el = document.createElement("div");
el.textContent = "你好";
// ...
{ type: "element", element: el, onClick: () => el.classList.toggle("active") }
```

| 字段      | 类型          | 必填 | 说明                            |
| --------- | ------------- | :--: | ------------------------------- |
| `element` | `HTMLElement` |  是  | 任意 DOM 元素（作为子节点追加） |
| `onClick` | `() => void`  |  否  | 点击回调                        |

## API

### `new TagCloud(container, options)`

| 参数              | 类型             | 默认        | 说明                     |
| ----------------- | ---------------- | ----------- | ------------------------ |
| `tags`            | `TagItem[]`      | —           | 标签列表（字符串或对象） |
| `radius`          | `number`         | `300`       | 球面半径（px）           |
| `width`           | `number`         | `0`         | Canvas 宽度（0=自适应）  |
| `height`          | `number`         | `0`         | Canvas 高度（0=自适应）  |
| `spinY`           | `number`         | `0`         | Y轴自旋 +右/-左/0关      |
| `spinX`           | `number`         | `0`         | X轴自旋 +下/-上/0关      |
| `reverse`         | `boolean`        | `false`     | 全轴反转拖拽             |
| `reverseX`        | `boolean`        | `false`     | 反转上下拖拽             |
| `reverseY`        | `boolean`        | `false`     | 反转左右拖拽             |
| `inertiaDecay`    | `number`         | `0.96`      | 惯性衰减系数             |
| `dragSensitivity` | `number`         | `3`         | 拖拽灵敏度               |
| `fontFamily`      | `string`         | `system-ui` | 字体                     |
| `fontSize`        | `number`         | `14`        | 基础字号                 |
| `color`           | `string`         | `#fff`      | 文字颜色                 |
| `videoFullscreen` | `boolean`        | `true`      | 视频点击全屏             |
| `onTagClick`      | `(item) => void` | —           | 全局点击回调             |
| `onRender`        | `(tags) => void` | 内置Canvas  | 自定义渲染               |

### 实例方法

```ts
cloud.setTags(["新", "标签"]);
cloud.pause();
cloud.resume();
cloud.destroy();
```

## 开发

```bash
bun install
bun run build       # vite build → dist/
bun run build:demo  # vite build → out/ (可部署的 HTML)
bun run lint        # oxlint (零错误配置)
bun run fmt         # oxfmt (自动格式化)
```

## 致谢

**特别感谢 [cong-min/TagCloud](https://github.com/cong-min/TagCloud)** — 本项目受其 3D 标签云库启发，核心球面分布和旋转算法移植自 TagCloud.js。

## 许可

MIT
