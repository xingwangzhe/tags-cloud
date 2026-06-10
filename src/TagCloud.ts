/**
 * 3D 标签云 — 纯数学引擎 / 3D Tag Cloud — Pure Math Engine
 *
 * 零 DOM 渲染，每帧通过 onRender 回调输出投影坐标
 * Zero DOM rendering, outputs projected coords via onRender callback each frame
 *
 * 基于 cong-min/TagCloud 算法 / Based on cong-min/TagCloud algorithm
 */
import { fibonacciSphere } from "./core/distribution";

// ── 类型 / Types ──

export type TagCloudMode = "auto" | "drag" | "both";

/** 投影后的标签数据 / Projected tag data */
export interface TagData {
  text: string;
  /** 容器内 X 坐标（像素）/ X coordinate in container (px) */
  x: number;
  /** 容器内 Y 坐标（像素）/ Y coordinate in container (px) */
  y: number;
  /** Z 深度（-radius ~ +radius）/ Z depth */
  z: number;
  /** 缩放比例 (0 ~ 1+) / scale factor */
  scale: number;
  /** 透明度 (0 ~ 1) / opacity */
  alpha: number;
}

export interface TagCloudOptions {
  /** 标签文本数组 / tag text array */
  tags: string[];
  /** 球面半径（px）/ sphere radius (px) (default 300) */
  radius?: number;
  /** 交互模式 / interaction mode (default "both") */
  mode?: TagCloudMode;
  /** 自旋速度（°/帧）/ auto-spin speed in degrees per frame (default 0.15) */
  autoSpeed?: number;
  /** 反转方向 / reverse direction (default false) */
  reverse?: boolean;
  /** 字体 / font family (default "system-ui, sans-serif") */
  fontFamily?: string;
  /** 基础字号（px）/ base font size in px (default 14) */
  fontSize?: number;
  /** 文字颜色 / text color (default "#ffffff") */
  color?: string;
  /** 自定义渲染回调（如不提供则用内置 Canvas）/ custom render callback (built-in Canvas if omitted) */
  onRender?: (tags: TagData[]) => void;
}

// ── 内部类型 / Internal Types ──

interface SpherePoint {
  x: number;
  y: number;
  z: number;
  text: string;
}

type ResolvedOptions = TagCloudOptions & Required<Omit<TagCloudOptions, "onRender">>;

const DEFAULTS: Omit<ResolvedOptions, "tags" | "onRender"> = {
  radius: 300,
  mode: "both",
  autoSpeed: 0.15,
  reverse: false,
  fontFamily: "system-ui, sans-serif",
  fontSize: 14,
  color: "#ffffff",
};

// ── 主类 / Main Class ──

export class TagCloud {
  #opts: ResolvedOptions;
  #points: SpherePoint[] = [];
  #radius: number;
  #depth: number;

  // 旋转状态 — 四元数 / rotation state as quaternion
  #qNow = { w: 1, x: 0, y: 0, z: 0 }; // 当前朝向 / current orientation
  #qDown = { w: 1, x: 0, y: 0, z: 0 }; // 拖拽起始朝向 / drag start orientation
  #velY = 0;
  #velX = 0;
  #paused = false;

  // 拖拽状态 / arcball drag state
  #dragging = false;
  #vDown = { x: 0, y: 0, z: 0 };

  // 动画 / animation
  #raf = 0;
  #container: HTMLElement;
  #handlers!: { down: EventListener; move: EventListener; up: EventListener };

  // 内置 Canvas（仅当 onRender 未提供时创建）/ built-in Canvas (only when onRender is not provided)
  #canvas?: HTMLCanvasElement;
  #ctx?: CanvasRenderingContext2D;

  constructor(container: HTMLElement, options: TagCloudOptions) {
    this.#container = container;
    this.#opts = { ...DEFAULTS, ...options } as ResolvedOptions;
    this.#radius = this.#opts.radius;
    this.#depth = 2 * this.#radius;

    // 内置 Canvas 渲染器 / built-in Canvas renderer
    if (!this.#opts.onRender) {
      this.#opts.onRender = this.#canvasRender;
    }

    this.#initTags(this.#opts.tags);
    this.#bindEvents();
    this.#loop();
  }

  /** 内置 Canvas 渲染器 / Built-in Canvas renderer */
  #canvasRender = (tags: TagData[]): void => {
    if (!this.#canvas) {
      const c = document.createElement("canvas");
      c.style.width = "100%";
      c.style.height = "100%";
      this.#container.appendChild(c);
      this.#canvas = c;
      this.#ctx = c.getContext("2d")!;
      this.#resizeCanvas();
    }
    const { width, height } = this.#canvas.getBoundingClientRect();
    const ctx = this.#ctx!;
    ctx.clearRect(0, 0, width, height);
    const { fontFamily, fontSize, color } = this.#opts;
    for (const t of tags) {
      ctx.save();
      ctx.globalAlpha = t.alpha;
      ctx.font = `${fontSize + t.scale * 5}px ${fontFamily}`;
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    }
  };

  #resizeCanvas(): void {
    const c = this.#canvas;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = c.getBoundingClientRect();
    c.width = width * dpr;
    c.height = height * dpr;
    this.#ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ── 公开 API / Public API ──

  setTags(tags: string[]): void {
    this.#initTags(tags);
  }
  pause(): void {
    this.#paused = true;
  }
  resume(): void {
    this.#paused = false;
  }

  destroy(): void {
    cancelAnimationFrame(this.#raf);
    const h = this.#handlers;
    this.#container.removeEventListener("pointerdown", h.down);
    window.removeEventListener("pointermove", h.move);
    window.removeEventListener("pointerup", h.up);
    if (this.#canvas) this.#canvas.remove();
  }

  // ── 内部方法 / Internal ──

  #initTags(tags: string[]): void {
    const size = 1.5 * this.#radius;
    const positions = fibonacciSphere(tags.length, size / 2);
    this.#points = positions.map((p, i) => ({ ...p, text: tags[i]! }));
  }

  #bindEvents(): void {
    const mode = this.#opts.mode;
    if (mode === "auto") {
      this.#container.style.cursor = "default";
      return;
    }

    this.#container.style.cursor = "grab";

    const rect = () => this.#container.getBoundingClientRect();

    this.#handlers = {
      down: ((e: PointerEvent) => {
        this.#dragging = true;
        this.#container.style.cursor = "grabbing";
        this.#qDown = { ...this.#qNow };
        const r = rect();
        this.#vDown = this.#screenToSphere(
          e.clientX - r.left,
          e.clientY - r.top,
          r.width,
          r.height,
        );
        this.#velY = 0;
        this.#velX = 0;
      }) as EventListener,
      move: ((e: PointerEvent) => {
        if (!this.#dragging) return;
        const r = rect();
        const vCur = this.#screenToSphere(e.clientX - r.left, e.clientY - r.top, r.width, r.height);
        const vA = this.#vDown;
        const dot = vA.x * vCur.x + vA.y * vCur.y + vA.z * vCur.z;
        const qDrag = {
          w: 1 + dot,
          x: vA.y * vCur.z - vA.z * vCur.y,
          y: vA.z * vCur.x - vA.x * vCur.z,
          z: vA.x * vCur.y - vA.y * vCur.x,
        };
        const len = Math.sqrt(
          qDrag.w * qDrag.w + qDrag.x * qDrag.x + qDrag.y * qDrag.y + qDrag.z * qDrag.z,
        );
        qDrag.w /= len;
        qDrag.x /= len;
        qDrag.y /= len;
        qDrag.z /= len;
        // 组合 / compose
        const qD = this.#qDown;
        this.#qNow = {
          w: qDrag.w * qD.w - qDrag.x * qD.x - qDrag.y * qD.y - qDrag.z * qD.z,
          x: qDrag.w * qD.x + qDrag.x * qD.w + qDrag.y * qD.z - qDrag.z * qD.y,
          y: qDrag.w * qD.y - qDrag.x * qD.z + qDrag.y * qD.w + qDrag.z * qD.x,
          z: qDrag.w * qD.z + qDrag.x * qD.y - qDrag.y * qD.x + qDrag.z * qD.w,
        };
        // 拖拽速度用于松手后惯性 / drag velocity for release inertia
        const rev = this.#opts.reverse ? -1 : 1;
        this.#velY = (qDrag.y / len) * rev * 3;
        this.#velX = (qDrag.x / len) * rev * 3;
      }) as EventListener,
      up: () => {
        this.#dragging = false;
        this.#container.style.cursor = "grab";
      },
    };

    this.#container.addEventListener("pointerdown", this.#handlers.down);
    window.addEventListener("pointermove", this.#handlers.move);
    window.addEventListener("pointerup", this.#handlers.up);
  }

  /** 屏幕坐标 → 球面 3D 点 / screen coords → sphere 3D point */
  #screenToSphere(
    sx: number,
    sy: number,
    w: number,
    h: number,
  ): { x: number; y: number; z: number } {
    const x = (sx / w) * 2 - 1; // -1 ~ 1
    const y = -((sy / h) * 2 - 1); // -1 ~ 1 (flip Y)
    const r2 = x * x + y * y;
    if (r2 > 1) {
      // 球外：投影到球边缘 / outside sphere: project to edge
      const inv = 1 / Math.sqrt(r2);
      return { x: x * inv, y: y * inv, z: 0 };
    }
    return { x, y, z: Math.sqrt(1 - r2) };
  }

  #loop = (): void => {
    if (!this.#paused) this.#tick();
    this.#raf = requestAnimationFrame(this.#loop);
  };

  /** 四元数 → 欧拉角 / quaternion → Euler angles */

  /** 绕 Y 轴旋转 / rotate around Y axis */
  #rotateY(deg: number): void {
    const half = (deg * Math.PI) / 360;
    const qY = { w: Math.cos(half), x: 0, y: Math.sin(half), z: 0 };
    const q = this.#qNow;
    this.#qNow = {
      w: qY.w * q.w - qY.y * q.y,
      x: qY.w * q.x + qY.y * q.z,
      y: qY.w * q.y + qY.y * q.w,
      z: qY.w * q.z - qY.y * q.x,
    };
  }

  /** 绕 X 轴旋转 / rotate around X axis */
  #rotateX(deg: number): void {
    const half = (deg * Math.PI) / 360;
    const qX = { w: Math.cos(half), x: Math.sin(half), y: 0, z: 0 };
    const q = this.#qNow;
    this.#qNow = {
      w: qX.w * q.w - qX.x * q.x,
      x: qX.w * q.x + qX.x * q.w,
      y: qX.w * q.y - qX.x * q.z,
      z: qX.w * q.z + qX.x * q.y,
    };
  }

  #tick(): void {
    const rect = this.#container.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const mode = this.#opts.mode;

    // 自旋 + 惯性 / auto-spin + inertia
    const rev = this.#opts.reverse ? -1 : 1;
    if (!this.#dragging) {
      if (mode === "auto" || mode === "both") {
        this.#rotateY((this.#opts.autoSpeed + this.#velY) * rev);
        this.#rotateX(this.#velX * rev);
        this.#velY *= 0.96;
        this.#velX *= 0.96;
      } else {
        this.#rotateY(this.#velY * rev);
        this.#rotateX(this.#velX * rev);
        this.#velY *= 0.95;
        this.#velX *= 0.95;
      }
    }

    // 直接用四元数构造 3×3 旋转矩阵 / build 3×3 rotation matrix directly from quaternion
    const { w, x, y, z } = this.#qNow;
    const [m00, m01, m02] = [1 - 2 * (y * y + z * z), 2 * (x * y - w * z), 2 * (x * z + w * y)];
    const [m10, m11, m12] = [2 * (x * y + w * z), 1 - 2 * (x * x + z * z), 2 * (y * z - w * x)];
    const [m20, m21, m22] = [2 * (x * z - w * y), 2 * (y * z + w * x), 1 - 2 * (x * x + y * y)];

    const d2 = this.#depth * 2;
    const projected: TagData[] = [];

    for (const p of this.#points) {
      // 四元数旋转矩阵 × 点 / quaternion rotation matrix × point
      const rx = m00 * p.x + m01 * p.y + m02 * p.z;
      const ry = m10 * p.x + m11 * p.y + m12 * p.z;
      const rz = m20 * p.x + m21 * p.y + m22 * p.z;

      const per = d2 / (d2 + rz);
      const alpha = Math.min(1, Math.max(0, per * per - 0.25));

      projected.push({
        text: p.text,
        x: cx + rx * per,
        y: cy + ry * per,
        z: rz,
        scale: per,
        alpha,
      });
    }

    this.#opts.onRender(projected.sort((a, b) => b.z - a.z));
  }
}

export default TagCloud;
