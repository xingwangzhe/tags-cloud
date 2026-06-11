/**
 * 3D 旋转变换
 * 3D rotation transforms
 *
 * 绕 Y 轴和 X 轴旋转球面上的所有点
 * Rotates all points around Y and X axes
 *
 * ported from TagCloud.js _next() rotation logic
 */

import type { Vec3 } from "./distribution";

/**
 * 旋转单个 3D 点
 * Rotate a single 3D point
 *
 * @param p - 待旋转的点
 * @param p - point to rotate
 * @param a - 绕 Y 轴的旋转角（弧度）
 * @param a - Y-axis rotation angle (radians)
 * @param b - 绕 X 轴的旋转角（弧度）
 * @param b - X-axis rotation angle (radians)
 */
const _rotatePoint = (p: Vec3, a: number, b: number): Vec3 => {
  const sinA = Math.sin(a);
  const cosA = Math.cos(a);
  const sinB = Math.sin(b);
  const cosB = Math.cos(b);

  // Y 轴旋转
  // Y-axis rotation
  const y1 = p.y * cosA + p.z * -sinA;
  const z1 = p.y * sinA + p.z * cosA;

  // X 轴旋转
  // X-axis rotation
  const x2 = p.x * cosB + z1 * sinB;
  const z2 = z1 * cosB - p.x * sinB;

  return { x: x2, y: y1, z: z2 };
};

/**
 * 批量旋转所有点
 * Rotate all points in batch
 */
const _rotatePoints = (points: Vec3[], a: number, b: number): Vec3[] =>
  points.map((p) => _rotatePoint(p, a, b));

export { _rotatePoint as rotatePoint, _rotatePoints as rotatePoints };
