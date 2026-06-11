import { describe, expect, it } from "vitest";
import { rotatePoint, rotatePoints } from "../src/core/rotation";
import type { Vec3 } from "../src/core/distribution";

const PI_HALF = Math.PI / 2;
const PI_FULL = Math.PI * 2;

describe("rotatePoint", () => {
  it("Y-axis rotation 90° of (0,1,0) → (0,0,1)", () => {
    const p: Vec3 = { x: 0, y: 1, z: 0 };
    const r = rotatePoint(p, PI_HALF, 0);
    expect(r.x).toBeCloseTo(0, 10);
    expect(r.y).toBeCloseTo(0, 10);
    expect(r.z).toBeCloseTo(1, 10);
  });

  it("X-axis rotation 90° of (1,0,0) → (0,0,-1)", () => {
    const p: Vec3 = { x: 1, y: 0, z: 0 };
    const r = rotatePoint(p, 0, PI_HALF);
    expect(r.x).toBeCloseTo(0, 10);
    expect(r.y).toBeCloseTo(0, 10);
    expect(r.z).toBeCloseTo(-1, 10);
  });

  it("0° rotation is identity", () => {
    const p: Vec3 = { x: 3, y: 4, z: 5 };
    const r = rotatePoint(p, 0, 0);
    expect(r.x).toBeCloseTo(3, 10);
    expect(r.y).toBeCloseTo(4, 10);
    expect(r.z).toBeCloseTo(5, 10);
  });

  it("360° Y rotation returns to original", () => {
    const p: Vec3 = { x: 3, y: 4, z: 5 };
    const r = rotatePoint(p, PI_FULL, 0);
    expect(r.x).toBeCloseTo(3, 10);
    expect(r.y).toBeCloseTo(4, 10);
    expect(r.z).toBeCloseTo(5, 10);
  });

  it("preserves distance (isometry)", () => {
    const p: Vec3 = { x: 3, y: 4, z: 12 };
    const result = rotatePoint(p, 1.5, -2.3);
    const origMag = Math.sqrt(p.x ** 2 + p.y ** 2 + p.z ** 2);
    const newMag = Math.sqrt(result.x ** 2 + result.y ** 2 + result.z ** 2);
    expect(newMag).toBeCloseTo(origMag, 10);
  });

  it("Y-axis rotation 90° of (0,0,1) maps to (0,-1,0)", () => {
    const p: Vec3 = { x: 0, y: 0, z: 1 };
    const r = rotatePoint(p, PI_HALF, 0);
    expect(r.x).toBeCloseTo(0, 10);
    expect(r.y).toBeCloseTo(-1, 10);
    expect(r.z).toBeCloseTo(0, 10);
  });

  it("X-axis rotation 90° of (0,0,1) maps to (1,0,0)", () => {
    const p: Vec3 = { x: 0, y: 0, z: 1 };
    const r = rotatePoint(p, 0, PI_HALF);
    expect(r.x).toBeCloseTo(1, 10);
    expect(r.y).toBeCloseTo(0, 10);
    expect(r.z).toBeCloseTo(0, 10);
  });
});

describe("rotatePoints", () => {
  it("batch matches individual rotatePoint results", () => {
    const pts: Vec3[] = [
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: 3, y: 4, z: 5 },
    ];
    const batch = rotatePoints(pts, 1.5, -2.3);
    for (let i = 0; i < pts.length; i++) {
      const s = rotatePoint(pts[i]!, 1.5, -2.3);
      expect(batch[i]!.x).toBeCloseTo(s.x, 10);
      expect(batch[i]!.y).toBeCloseTo(s.y, 10);
      expect(batch[i]!.z).toBeCloseTo(s.z, 10);
    }
  });

  it("empty array returns empty", () => {
    expect(rotatePoints([], 1, 1)).toEqual([]);
  });

  it("Y then X differs from X then Y (non-commutative)", () => {
    const p: Vec3 = { x: 1, y: 0, z: 0 };
    const yx = rotatePoint(rotatePoint(p, PI_HALF, 0), 0, PI_HALF);
    const xy = rotatePoint(rotatePoint(p, 0, PI_HALF), PI_HALF, 0);
    const diff = Math.abs(yx.x - xy.x) + Math.abs(yx.y - xy.y) + Math.abs(yx.z - xy.z);
    expect(diff).toBeGreaterThan(1e-10);
  });
});
