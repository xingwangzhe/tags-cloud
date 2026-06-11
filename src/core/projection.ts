/**
 * 透视投影
 * Perspective projection
 *
 * 根据 Z 深度计算每个标签的缩放比例和透明度
 * Calculates scale and alpha for each tag based on Z depth
 *
 * per = (2 × depth) / (2 × depth + z)
 * scale = per
 * alpha = per² − 0.25 → clamped [0, 1]
 *
 * ported from TagCloud.js _next() projection logic
 */

export interface ProjectedTag {
  /** 原始 X 坐标 */
  /** original X coordinate */
  x: number;
  /** 原始 Y 坐标 */
  /** original Y coordinate */
  y: number;
  /** 原始 Z 深度 */
  /** original Z depth */
  z: number;
  /** 缩放比例 (1 = 最近, 0 = 最远) */
  /** scale factor (1 = nearest, 0 = farthest) */
  scale: number;
  /** 透明度 (1 = 最前, 0 = 最后) */
  /** opacity (1 = front, 0 = back) */
  alpha: number;
}

/**
 * 对旋转后的点做透视投影
 * Apply perspective projection to rotated points
 *
 * @param points — 旋转后的 3D 点
 * @param points — rotated 3D points
 * @param depth — 透视深度 = 2 × 球半径
 * @param depth — perspective depth = 2 × sphere radius
 */
export const project = (
  points: { x: number; y: number; z: number }[],
  depth: number,
): ProjectedTag[] => {
  const d2 = 2 * depth;
  return points.map((p) => {
    // 透视缩放
    // perspective scale
    const per = d2 / (d2 + p.z);
    // 透明度从 per² − 0.25 计算
    // alpha derived from per² − 0.25
    const alpha = Math.min(1, Math.max(0, per * per - 0.25));
    return { x: p.x, y: p.y, z: p.z, scale: per, alpha };
  });
};
