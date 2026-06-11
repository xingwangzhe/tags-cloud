# @xingwangzhe/tags-cloud

[English](README.md) | [中文文档](#)

> 纯数学 3D 标签云引擎

## 特性

- **多模态** — 文字、图片、SVG、HTML、视频、Web Component
- **斐波那契球面分布** — 标签均匀分布在 3D 球面
- **Arcball 交互** — Shoemake 四元数弧球拖拽旋转
- **自旋** — 可配置分轴自旋（X/Y），独立速度和方向
- **TypeScript** — 全类型安全
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
    "plain text",
    { type: "image", src: "/avatar.webp", width: 40, height: 40, onClick: () => open("/profile") },
    { type: "element", element: myComponent, onClick: () => console.log("clicked") },
    { type: "svg", content: "<svg>...</svg>", width: 48, height: 48 },
    { type: "html", html: "<b>bold</b>" },
    { type: "video", src: "/clip.mp4", width: 120, height: 68 },
  ],
  radius: 300,
  spinY: 0.15,
  onTagClick(item) {
    console.log("clicked", item);
  },
});
```

## 标签类型

| TagItem              | 渲染   | 示例                                               |
| -------------------- | ------ | -------------------------------------------------- |
| `string`             | Canvas | `"TypeScript"`                                     |
| `{ type:"image" }`   | Canvas | `{ type:"image", src, width, height, onClick? }`   |
| `{ type:"svg" }`     | DOM    | `{ type:"svg", content, width, height, onClick? }` |
| `{ type:"html" }`    | DOM    | `{ type:"html", html, onClick? }`                  |
| `{ type:"video" }`   | DOM    | `{ type:"video", src, width, height, onClick? }`   |
| `{ type:"element" }` | DOM    | `{ type:"element", element, onClick? }`            |

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
bun run lint        # oxlint
bun run fmt         # oxfmt
```

## 致谢

**特别感谢 [cong-min/TagCloud](https://github.com/cong-min/TagCloud)** — 本项目受其 3D 标签云库启发，核心球面分布和旋转算法移植自 TagCloud.js。

## 许可

MIT
