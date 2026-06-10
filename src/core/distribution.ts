/**
 * 斐波那契球面分布
 * Fibonacci sphere distribution
 *
 * 将 N 个点均匀分布在球面上，避免两极聚集
 * Evenly distributes N points on a sphere, avoiding polar clustering
 *
 * ported from TagCloud.js _computePosition
 */

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/**
 * 生成球面上均匀分布的 N 个点
 * Generate N evenly distributed points on a sphere of radius R
 */
export function fibonacciSphere(n: number, R: number): Vec3[] {
  const points: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    // φ = acos(1 - 2(i+0.5)/N) — 纬度均匀分布
    // φ = acos(1 - 2(i+0.5)/N) — uniform latitude
    const phi = Math.acos(-1 + (2 * i + 1) / n);
    // θ = √(Nπ) × φ — 经度黄金比例螺旋
    // θ = √(Nπ) × φ — golden ratio spiral for longitude
    const theta = Math.sqrt(n * Math.PI) * phi;
    points.push({
      x: R * Math.cos(theta) * Math.sin(phi),
      y: R * Math.sin(theta) * Math.sin(phi),
      z: R * Math.cos(phi),
    });
  }
  return points;
}
