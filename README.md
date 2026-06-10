# @xingwangzhe/tags-cloud

> 纯数学 3D 标签云引擎 / Pure math 3D tag cloud engine

## 特性 / Features

- **零 DOM 开销** — 纯数学输出，渲染交给回调
- **斐波那契球面分布** — 标签均匀分布在 3D 球面
- **鼠标交互** — 鼠标移动控制旋转角度
- **纯 TypeScript** — 全类型安全
- **~1.4KB** gzipped

## 安装 / Install

```bash
bun add @xingwangzhe/tags-cloud
```

## 使用 / Usage

```ts
import { TagCloud } from "@xingwangzhe/tags-cloud";

const cloud = new TagCloud(container, {
  tags: ["TypeScript", "Canvas", "3D"],
  radius: 300,
  onRender(tags) {
    // tags: { text, x, y, z, scale, alpha }[]
    // 在这里用 Canvas / WebGL 画标签
    for (const t of tags) {
      ctx.fillText(t.text, t.x, t.y);
    }
  },
});
```

## API

### `new TagCloud(container, options)`

| 参数 / Option | 类型 / Type                 | 默认 / Default | 说明 / Description   |
| ------------- | --------------------------- | -------------- | -------------------- |
| `tags`        | `string[]`                  | —              | 标签文本列表         |
| `radius`      | `number`                    | `300`          | 球面半径（px）       |
| `speed`       | `number`                    | `0.3`          | 旋转速度系数         |
| `direction`   | `number`                    | `135`          | 初始方向（顺时针°）  |
| `keep`        | `boolean`                   | `true`         | 鼠标离开后是否继续转 |
| `reverse`     | `boolean`                   | `false`        | 是否反转方向         |
| `onRender`    | `(tags: TagData[]) => void` | —              | 每帧渲染回调         |

### 实例方法 / Instance Methods

```ts
cloud.setTags(["新", "标签"]); // 更新标签
cloud.pause(); // 暂停
cloud.resume(); // 恢复
cloud.destroy(); // 销毁（清理事件+rAF）
```

## 底层数学模块 / Low-level Math

```ts
import {
  fibonacciSphere, // 斐波那契球面分布
  rotatePoints, // 批量 3D 旋转
  project, // 透视投影
} from "@xingwangzhe/tags-cloud";
```

## 开发 / Development

```bash
bun install
bun run build    # vite build
bun run lint     # oxlint
bun run fmt      # oxfmt
```

## 致谢 / Credits

核心算法移植自 [cong-min/TagCloud](https://github.com/cong-min/TagCloud)

## 许可 / License

MIT
