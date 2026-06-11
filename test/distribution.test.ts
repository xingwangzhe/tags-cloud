import { describe, expect, it } from "vitest";
import { fibonacciSphere } from "../src/core/distribution";

describe("fibonacciSphere", () => {
  it("returns empty array for n=0", () => {
    expect(fibonacciSphere(0, 100)).toEqual([]);
  });

  it("returns single point on sphere for n=1", () => {
    const points = fibonacciSphere(1, 10);
    expect(points).toHaveLength(1);
    const mag = Math.sqrt(points[0]!.x ** 2 + points[0]!.y ** 2 + points[0]!.z ** 2);
    expect(mag).toBeCloseTo(10, 10);
  });

  it("returns correct number of points for n=100", () => {
    expect(fibonacciSphere(100, 300)).toHaveLength(100);
  });

  it("all points are on sphere surface at distance R", () => {
    const R = 300;
    for (const p of fibonacciSphere(50, R)) {
      const dist = Math.sqrt(p.x ** 2 + p.y ** 2 + p.z ** 2);
      expect(dist).toBeCloseTo(R, 10);
    }
  });

  it("no duplicate points for n=30", () => {
    const seen = new Set<string>();
    for (const p of fibonacciSphere(30, 100)) {
      const key = `${p.x.toFixed(8)},${p.y.toFixed(8)},${p.z.toFixed(8)}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it("R=0 yields all zero coordinates", () => {
    for (const p of fibonacciSphere(10, 0)) {
      expect(p.x).toBeCloseTo(0, 10);
      expect(p.y).toBeCloseTo(0, 10);
      expect(p.z).toBeCloseTo(0, 10);
    }
  });

  it("n=2 yields well-separated points on opposite hemispheres", () => {
    const points = fibonacciSphere(2, 100);
    expect(points).toHaveLength(2);
    const dot =
      points[0]!.x * points[1]!.x + points[0]!.y * points[1]!.y + points[0]!.z * points[1]!.z;
    // Fibonacci sphere n=2 gives ~154° separation, dot ≈ -9000 (not perfect antipodal)
    expect(dot).toBeLessThan(-8500);
  });

  it("latitude bins roughly uniform for large N", () => {
    const N = 200;
    const bins = 10;
    const counts = Array.from<number>({ length: bins }).fill(0);
    for (const p of fibonacciSphere(N, 1)) {
      const idx = Math.floor(((p.z + 1) / 2) * bins);
      counts[Math.max(0, Math.min(bins - 1, idx))]!++;
    }
    const expected = N / bins;
    for (const c of counts) {
      expect(Math.abs(c - expected)).toBeLessThan(expected * 0.4);
    }
  });
});
