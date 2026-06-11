import { describe, expect, it } from "vitest";
import { project } from "../src/core/projection";

const DEPTH = 300;

describe("project", () => {
  it("z=0 gives scale=1", () => {
    const result = project([{ x: 0, y: 0, z: 0 }], DEPTH);
    expect(result[0]!.scale).toBeCloseTo(1, 10);
  });

  it("z=depth gives scale=2/3", () => {
    const result = project([{ x: 0, y: 0, z: DEPTH }], DEPTH);
    expect(result[0]!.scale).toBeCloseTo(2 / 3, 10);
  });

  it("z=-depth gives scale=2", () => {
    const result = project([{ x: 0, y: 0, z: -DEPTH }], DEPTH);
    expect(result[0]!.scale).toBeCloseTo(2, 10);
  });

  it("scale approaches 0 as z → +∞", () => {
    const result = project([{ x: 0, y: 0, z: 1e12 }], DEPTH);
    expect(result[0]!.scale).toBeCloseTo(0, 5);
  });

  it("all alpha values clamped to [0, 1] for wide Z range", () => {
    const pts = Array.from({ length: 100 }, (_, i) => ({
      x: 0,
      y: 0,
      z: -1000 + i * 20,
    }));
    for (const r of project(pts, DEPTH)) {
      expect(r.alpha).toBeGreaterThanOrEqual(0);
      expect(r.alpha).toBeLessThanOrEqual(1);
    }
  });

  it("empty array returns empty", () => {
    expect(project([], DEPTH)).toEqual([]);
  });

  it("alpha = per² - 0.25 clamped (manual check)", () => {
    const result = project([{ x: 0, y: 0, z: DEPTH }], DEPTH);
    const per = 2 / 3;
    const expected = Math.min(1, Math.max(0, per * per - 0.25));
    expect(result[0]!.alpha).toBeCloseTo(expected, 10);
  });

  it("100 random points produce no NaN or Infinity", () => {
    const pts = Array.from({ length: 100 }, () => ({
      x: (Math.random() - 0.5) * 1000,
      y: (Math.random() - 0.5) * 1000,
      z: (Math.random() - 0.5) * 1000,
    }));
    for (const r of project(pts, DEPTH)) {
      expect(Number.isFinite(r.scale)).toBe(true);
      expect(Number.isFinite(r.alpha)).toBe(true);
    }
  });
});
