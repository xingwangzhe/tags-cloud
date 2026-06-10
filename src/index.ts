/**
 * @xingwangzhe/tags-cloud
 *
 * 纯数学 3D 标签云引擎 / Pure math 3D tag cloud engine
 *
 * ── 用法 / Usage ──
 *
 * ```ts
 * import { TagCloud } from "@xingwangzhe/tags-cloud";
 *
 * const cloud = new TagCloud(container, {
 *   tags: ["TS", "Canvas", "3D"],
 *   radius: 300,
 *   onRender(tags) {
 *     for (const t of tags) ctx.fillText(t.text, t.x, t.y);
 *   },
 * });
 * ```
 *
 * ── 底层数学模块 / Low-level math modules ──
 *
 * ```ts
 * import { fibonacciSphere, rotatePoints, project } from "@xingwangzhe/tags-cloud";
 * ```
 */

export { TagCloud } from "./TagCloud";
export type { TagCloudOptions, TagData } from "./TagCloud";
export { fibonacciSphere } from "./core/distribution";
export type { Vec3 } from "./core/distribution";
export { rotatePoint, rotatePoints } from "./core/rotation";
export { project } from "./core/projection";
export type { ProjectedTag } from "./core/projection";
