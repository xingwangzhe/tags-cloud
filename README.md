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

// 零配置，自动创建 Canvas 渲染
new TagCloud(document.getElementById("cloud")!, {
  tags: ["TypeScript", "Canvas", "3D"],
  radius: 300,
});
```

## API

### `new TagCloud(container, options)`

| 参数              | 类型             | 默认        | 说明                |
| ----------------- | ---------------- | ----------- | ------------------- |
| `tags`            | `string[]`       | —           | 标签文本列表        |
| `radius`          | `number`         | `300`       | 球面半径（px）      |
| `spinY`           | `number`         | `0`         | Y轴自旋 +右/-左/0关 |
| `spinX`           | `number`         | `0`         | X轴自旋 +下/-上/0关 |
| `reverse`         | `boolean`        | `false`     | 反转XY拖拽          |
| `reverseX`        | `boolean`        | `false`     | 反转上下拖拽        |
| `reverseY`        | `boolean`        | `false`     | 反转左右拖拽        |
| `inertiaDecay`    | `number`         | `0.96`      | 惯性衰减            |
| `dragSensitivity` | `number`         | `3`         | 拖拽灵敏度          |
| `fontFamily`      | `string`         | `system-ui` | 字体                |
| `fontSize`        | `number`         | `14`        | 字号                |
| `color`           | `string`         | `#fff`      | 颜色                |
| `onRender`        | `(tags) => void` | 内置Canvas  | 自定义渲染          |

### 实例方法 / Instance Methods

```ts
cloud.setTags(["新", "标签"]); // 更新标签
cloud.pause(); // 暂停
cloud.resume(); // 恢复
cloud.destroy(); // 销毁（清理事件+rAF）
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
