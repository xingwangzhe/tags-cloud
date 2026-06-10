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
  /** 每帧渲染回调 / render callback each frame */
  onRender: (tags: TagData[]) => void;
}

// ── 内部类型 / Internal Types ──

interface SpherePoint {
  x: number;
  y: number;
  z: number;
  text: string;
}

const DEFAULTS = {
  radius: 300,
  mode: "both" as TagCloudMode,
  autoSpeed: 0.15,
  reverse: false,
};

// ── 主类 / Main Class ──

export class TagCloud {
  #opts: TagCloudOptions & typeof DEFAULTS;
  #points: SpherePoint[] = [];
  #radius: number;
  #depth: number;

  // 旋转状态 / rotation state
  #rotY = 0;
  #rotX = 0;
  #velY = 0; // 拖拽惯性 / drag inertia
  #velX = 0;
  #paused = false;

  // 拖拽状态 / arcball drag state
  #dragging = false;
  #dragPrev = { x: 0, y: 0, z: 0 }; // 上一帧的球面 3D 抓取点

  // 动画 / animation
  #raf = 0;
  #container: HTMLElement;
  #handlers!: { down: EventListener; move: EventListener; up: EventListener };

  constructor(container: HTMLElement, options: TagCloudOptions) {
    this.#container = container;
    this.#opts = { ...DEFAULTS, ...options };
    this.#radius = this.#opts.radius;
    this.#depth = 2 * this.#radius;

    this.#initTags(this.#opts.tags);
    this.#bindEvents();
    this.#loop();
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
        const r = rect();
        this.#dragPrev = this.#screenToSphere(
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
        const cur = this.#screenToSphere(e.clientX - r.left, e.clientY - r.top, r.width, r.height);
        const prev = this.#dragPrev;
        // 四元数旋转：从 prev 到 cur 的角速度
        const crossX = prev.y * cur.z - prev.z * cur.y;
        const crossY = prev.z * cur.x - prev.x * cur.z;
        const crossZ = prev.x * cur.y - prev.y * cur.x;
        const dot = prev.x * cur.x + prev.y * cur.y + prev.z * cur.z;
        const angle = Math.acos(Math.min(1, Math.max(-1, dot)));
        if (angle > 0.001) {
          const s = Math.sin(angle);
          const qx = (crossX / s) * angle;
          const qy = (crossY / s) * angle;
          // qz = (crossZ / s) * angle — Z 轴旋转暂不使用 / Z-axis rotation unused
          this.#velY = qy * (180 / Math.PI) * 0.8;
          this.#velX = qx * (180 / Math.PI) * 0.8;
          this.#rotY += this.#velY;
          this.#rotX += this.#velX;
        }
        this.#dragPrev = cur;
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

  #tick(): void {
    const rect = this.#container.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const mode = this.#opts.mode;

    // 旋转
    if (mode === "auto" || mode === "both") {
      if (!this.#dragging) {
        // 自旋 + 惯性衰减 / auto-spin + inertia decay
        this.#rotY += this.#opts.autoSpeed + this.#velY;
        this.#rotX += this.#velX;
        this.#velY *= 0.96;
        this.#velX *= 0.96;
      }
    } else {
      // drag-only：只响应拖拽 / drag-only: only respond to drag
      this.#rotY += this.#velY;
      this.#rotX += this.#velX;
      this.#velY *= 0.95;
      this.#velX *= 0.95;
    }

    const sinA = Math.sin((this.#rotX * Math.PI) / 180);
    const cosA = Math.cos((this.#rotX * Math.PI) / 180);
    const sinB = Math.sin((this.#rotY * Math.PI) / 180);
    const cosB = Math.cos((this.#rotY * Math.PI) / 180);

    const d2 = this.#depth * 2;
    const projected: TagData[] = [];

    for (const p of this.#points) {
      const y1 = p.y * cosA + p.z * -sinA;
      const z1 = p.y * sinA + p.z * cosA;
      const x2 = p.x * cosB + z1 * sinB;
      const z2 = z1 * cosB - p.x * sinB;

      const per = d2 / (d2 + z2);
      const alpha = Math.min(1, Math.max(0, per * per - 0.25));

      projected.push({
        text: p.text,
        x: cx + x2 * per,
        y: cy + y1 * per,
        z: z2,
        scale: per,
        alpha,
      });
    }

    this.#opts.onRender(projected.sort((a, b) => b.z - a.z));
  }
}

export default TagCloud;
