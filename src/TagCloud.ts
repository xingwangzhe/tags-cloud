/**
 * 3D 标签云 — 纯数学引擎
 * 3D Tag Cloud — Pure Math Engine
 *
 * 零 DOM 渲染，每帧通过 onRender 回调输出投影坐标
 * Zero DOM rendering, outputs projected coords via onRender callback each frame
 *
 * 基于 cong-min/TagCloud 算法
 * Based on cong-min/TagCloud algorithm
 */
import { fibonacciSphere } from "./core/distribution";

// ── 标签项类型
// ── Tag Item Types

/** 图片标签 */
export interface ImageTag {
  type: "image";
  src: string;
  width: number;
  height: number;
  onClick?: () => void;
}

/** SVG 标签 */
export interface SvgTag {
  type: "svg";
  content: string;
  width: number;
  height: number;
  onClick?: () => void;
}

/** HTML 标签（支持 innerHTML 字符串） */
export interface HtmlTag {
  type: "html";
  html: string;
  onClick?: () => void;
}

/** 视频标签 */
export interface VideoTag {
  type: "video";
  src: string;
  width: number;
  height: number;
  onClick?: () => void;
}

/** 任意 DOM 元素标签 */
export interface ElementTag {
  type: "element";
  element: HTMLElement;
  onClick?: () => void;
}

/** 标签内容：字符串 = 纯文本（Canvas 渲染），对象 = 富媒体 */
/** Tag content: string = plain text (Canvas), object = rich media */
export type TagItem = string | ImageTag | SvgTag | HtmlTag | VideoTag | ElementTag;

// ── 通用类型
// ── Common Types

/** 投影后的标签数据 */
/** Projected tag data */
export interface TagData {
  /** 原始标签项 */
  item: TagItem;
  /** 容器内 X 坐标（像素） */
  x: number;
  /** 容器内 Y 坐标（像素） */
  y: number;
  /** Z 深度（-radius ~ +radius） */
  z: number;
  /** 缩放比例 (0 ~ 1+) */
  scale: number;
  /** 透明度 (0 ~ 1) */
  alpha: number;
}

export interface TagCloudOptions {
  /** 标签列表（字符串 = 纯文本，对象 = 富媒体） */
  /** tag list (string = plain text, object = rich media) */
  tags: TagItem[];
  /** 球面半径（px） */
  /** sphere radius (px) (default 300) */
  radius?: number;
  /** Canvas 宽度（px） */
  /** canvas width in px (default follows container) */
  width?: number;
  /** Canvas 高度（px） */
  /** canvas height in px (default follows container) */
  height?: number;
  /** 绕 Y 轴自旋速度（°/帧）: +右转 -左转 0=关 */
  /** Y-axis auto-spin speed (°/frame): +right -left 0=off (default 0) */
  spinY?: number;
  /** 绕 X 轴自旋速度（°/帧）: +下转 -上转 0=关 */
  /** X-axis auto-spin speed (°/frame): +down -up 0=off (default 0) */
  spinX?: number;
  /** 反转方向（X+Y 同时） */
  /** reverse both axes (default false) */
  reverse?: boolean;
  /** 单独反转 X 轴（上下拖拽） */
  /** reverse X-axis drag only (default false) */
  reverseX?: boolean;
  /** 反转 Y 轴拖拽方向 */
  /** reverse Y-axis drag direction (default false) */
  reverseY?: boolean;
  /** 惯性衰减系数（每帧乘以此值） */
  /** inertia decay per frame (default 0.96) */
  inertiaDecay?: number;
  /** 拖拽灵敏度（松手后惯性速度倍率） */
  /** drag sensitivity for release velocity (default 3) */
  dragSensitivity?: number;
  /** 字体 */
  /** font family (default "system-ui, sans-serif") */
  fontFamily?: string;
  /** 基础字号（px） */
  /** base font size in px (default 14) */
  fontSize?: number;
  /** 文字颜色 */
  /** text color (default "#ffffff") */
  color?: string;
  /** 全局标签点击回调（所有标签共用，通过 tag 文本区分） */
  /** global click callback for all tags (distinguish by tag text) */
  onTagClick?: (item: TagItem) => void;
  /** 视频标签点击全屏 / video tags click to fullscreen (default true) */
  videoFullscreen?: boolean;
  /** 自定义渲染回调（如不提供则用内置 Canvas） */
  /** custom render callback (built-in Canvas if omitted) */
  onRender?: (tags: TagData[]) => void;
}

// ── 内部类型
// ── Internal Types

interface SpherePoint {
  x: number;
  y: number;
  z: number;
  item: TagItem;
}

type ResolvedOptions = TagCloudOptions & Required<Omit<TagCloudOptions, "onRender">>;

const DEFAULTS: Omit<ResolvedOptions, "tags" | "onRender"> = {
  radius: 300,
  width: 0,
  height: 0,
  spinY: 0,
  spinX: 0,
  reverse: false,
  reverseX: false,
  reverseY: false,
  inertiaDecay: 0.96,
  dragSensitivity: 3,
  fontFamily: "system-ui, sans-serif",
  fontSize: 14,
  videoFullscreen: true,
  color: "#ffffff",
};

/** 判断是否为对象类型的标签 */
function isObjectTag(item: TagItem): item is Exclude<TagItem, string> {
  return typeof item !== "string";
}

// ── 主类
// ── Main Class

export class TagCloud {
  #opts: ResolvedOptions;
  #points: SpherePoint[] = [];
  #radius: number;
  #depth: number;

  // 旋转状态 — 四元数
  #qNow = { w: 1, x: 0, y: 0, z: 0 };
  #qDown = { w: 1, x: 0, y: 0, z: 0 };
  #velY = 0;
  #velX = 0;
  #paused = false;

  // 拖拽状态
  #dragging = false;
  #dragged = false;
  #vDown = { x: 0, y: 0, z: 0 };

  // 内存
  #raf = 0;
  #container: HTMLElement;
  #handlers!: { down: EventListener; move: EventListener; up: EventListener };

  // 内置 Canvas
  #canvas?: HTMLCanvasElement;
  #ctx?: CanvasRenderingContext2D;

  // DOM overlay（渲染 element/html/svg/video 标签）
  #overlay?: HTMLDivElement;
  #domEls: Map<TagItem, HTMLElement> = new Map();

  // 点击：存储上一帧的 Canvas 标签投影坐标，供 raycast 查找
  #lastCanvasTags: { item: TagItem; x: number; y: number; scale: number }[] = [];

  constructor(container: HTMLElement, options: TagCloudOptions) {
    this.#container = container;
    this.#opts = { ...DEFAULTS, ...options } as ResolvedOptions;
    this.#radius = this.#opts.radius;
    this.#depth = 2 * this.#radius;

    if (!this.#opts.onRender) {
      this.#opts.onRender = this.#canvasRender;
    }

    this.#initTags(this.#opts.tags);
    this.#bindEvents();
    this.#bindClicks();
    this.#loop();
  }

  // ── 公开 API
  // ── Public API

  setTags(tags: TagItem[]): void {
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
    if (this.#overlay) this.#overlay.remove();
  }

  // ── 内部方法
  // ── Internal

  #initTags(tags: TagItem[]): void {
    const size = 1.5 * this.#radius;
    const positions = fibonacciSphere(tags.length, size / 2);
    this.#points = positions.map((p, i) => ({ ...p, item: tags[i]! }));
  }

  #bindEvents(): void {
    this.#container.style.cursor = "grab";
    this.#container.style.touchAction = "none"; // 防止移动端手势干扰 / prevent mobile gestures
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
        this.#dragged = true;
        const r = rect();
        const vCur = this.#screenToSphere(e.clientX - r.left, e.clientY - r.top, r.width, r.height);
        const vA = this.#vDown;
        const dot = vA.x * vCur.x + vA.y * vCur.y + vA.z * vCur.z;
        // Shoemake arcball 四元数
        const revX = this.#opts.reverse || this.#opts.reverseX ? -1 : 1;
        const revY = this.#opts.reverse || this.#opts.reverseY ? -1 : 1;
        const qDrag = {
          w: 1 + dot,
          x: (vA.y * vCur.z - vA.z * vCur.y) * revX,
          y: (vA.x * vCur.z - vA.z * vCur.x) * revY,
          z: (vA.x * vCur.y - vA.y * vCur.x) * revX * revY,
        };
        const len = Math.sqrt(qDrag.w ** 2 + qDrag.x ** 2 + qDrag.y ** 2 + qDrag.z ** 2);
        qDrag.w /= len;
        qDrag.x /= len;
        qDrag.y /= len;
        qDrag.z /= len;
        const qD = this.#qDown;
        this.#qNow = {
          w: qDrag.w * qD.w - qDrag.x * qD.x - qDrag.y * qD.y - qDrag.z * qD.z,
          x: qDrag.w * qD.x + qDrag.x * qD.w + qDrag.y * qD.z - qDrag.z * qD.y,
          y: qDrag.w * qD.y - qDrag.x * qD.z + qDrag.y * qD.w + qDrag.z * qD.x,
          z: qDrag.w * qD.z + qDrag.x * qD.y - qDrag.y * qD.x + qDrag.z * qD.w,
        };
        const sens = this.#opts.dragSensitivity;
        this.#velY = (qDrag.y / len) * sens;
        this.#velX = (qDrag.x / len) * sens;
      }) as EventListener,
      up: () => {
        this.#dragging = false;
        this.#container.style.cursor = "grab";
        setTimeout(() => { this.#dragged = false; }, 0);
      },
    };

    this.#container.addEventListener("pointerdown", this.#handlers.down);
    window.addEventListener("pointermove", this.#handlers.move);
    window.addEventListener("pointerup", this.#handlers.up);
  }

  #bindClicks(): void {
    this.#container.addEventListener("click", (e) => {
      if (this.#dragged) return;
      const r = this.#container.getBoundingClientRect();
      const cx = e.clientX - r.left;
      const cy = e.clientY - r.top;
      let best: { item: TagItem; dist: number } | null = null;
      for (const t of this.#lastCanvasTags) {
        if (typeof t.item !== "string" && !t.item.onClick) continue;
        const dx = cx - t.x;
        const dy = cy - t.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const rw = t.item.type === "image" ? t.item.width / 2 : 30;
        const hitRadius = rw * t.scale;
        if (d < hitRadius && (!best || d < best.dist)) {
          best = { item: t.item, dist: d };
        }
      }
      if (best) {
        const item = best.item;
        if (isObjectTag(item) && item.onClick) item.onClick();
        if (this.#opts.onTagClick) this.#opts.onTagClick(item);
      }
    });
  }

  /** 屏幕坐标 → 球面 3D 点 */
  #screenToSphere(
    sx: number,
    sy: number,
    w: number,
    h: number,
  ): { x: number; y: number; z: number } {
    const x = (sx / w) * 2 - 1;
    const y = -((sy / h) * 2 - 1);
    const r2 = x * x + y * y;
    if (r2 > 1) {
      const inv = 1 / Math.sqrt(r2);
      return { x: x * inv, y: y * inv, z: 0 };
    }
    return { x, y, z: Math.sqrt(1 - r2) };
  }

  /** 内置 Canvas 渲染器（文本 + 图片） */
  #canvasRender = (tags: TagData[]): void => {
    if (!this.#canvas) {
      const c = document.createElement("canvas");
      if (this.#opts.width) { c.style.width = `${this.#opts.width}px`; this.#container.style.width = `${this.#opts.width}px`; }
      else c.style.width = "100%";
      if (this.#opts.height) { c.style.height = `${this.#opts.height}px`; this.#container.style.height = `${this.#opts.height}px`; }
      else c.style.height = "100%";
      this.#container.appendChild(c);
      this.#canvas = c;
      this.#ctx = c.getContext("2d")!;
      this.#resizeCanvas();
    }
    // 初始化 DOM overlay
    if (!this.#overlay) {
      this.#container.style.position = "relative";
      const o = document.createElement("div");
      o.style.position = "absolute";
      o.style.inset = "0";
      o.style.pointerEvents = "none";
      o.style.overflow = "hidden";
      this.#container.appendChild(o);
      this.#overlay = o;
    }
    const { width, height } = this.#canvas.getBoundingClientRect();
    const ctx = this.#ctx!;
    ctx.clearRect(0, 0, width, height);

    // 保存文本标签坐标（用于点击 raycast）
    const canvasTags: { item: TagItem; x: number; y: number; scale: number }[] = [];
    const currentDoms = new Set<TagItem>();

    // 先加载需要的图片
    const imageCache = new Map<string, HTMLImageElement>();
    const pendingImages: Promise<void>[] = [];

    for (const t of tags) {
      if (typeof t.item === "string") {
        // 文本标签
        const { fontFamily, fontSize, color } = this.#opts;
        ctx.save();
        ctx.globalAlpha = t.alpha;
        ctx.font = `${fontSize + t.scale * 5}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(t.item, t.x, t.y);
        ctx.restore();
        canvasTags.push({ item: t.item, x: t.x, y: t.y, scale: t.scale });
      } else if (t.item.type === "image") {
        // 图片标签 — Canvas drawImage()
        let img = imageCache.get(t.item.src);
        if (!img) {
          img = new Image();
          img.src = t.item.src;
          imageCache.set(t.item.src, img);
          pendingImages.push(
            new Promise((r) => {
              img!.onload = () => r();
            }),
          );
        }
        const { width: iw, height: ih } = t.item;
        const sw = iw * t.scale;
        const sh = ih * t.scale;
        ctx.save();
        ctx.globalAlpha = t.alpha;
        ctx.drawImage(img, t.x - sw / 2, t.y - sh / 2, sw, sh);
        ctx.restore();
        canvasTags.push({ item: t.item, x: t.x, y: t.y, scale: t.scale });
      } else {
        // DOM 标签（element/html/svg/video）→ overlay 渲染
        currentDoms.add(t.item);
        let el = this.#domEls.get(t.item);
        if (!el) {
          el = this.#createDomTag(t.item);
          this.#domEls.set(t.item, el);
          this.#overlay!.appendChild(el);
        }
        el.style.transform = `translate3d(${t.x.toFixed(1)}px, ${t.y.toFixed(1)}px, 0) scale(${t.scale.toFixed(2)})`;
        el.style.opacity = String(t.alpha);
        el.style.zIndex = String(Math.round(t.scale * 100));
        canvasTags.push({ item: t.item, x: t.x, y: t.y, scale: t.scale });
      }
    }

    // 清理已移除的 DOM 标签
    for (const [item, el] of this.#domEls) {
      if (!currentDoms.has(item)) {
        el.remove();
        this.#domEls.delete(item);
      }
    }

    this.#lastCanvasTags = canvasTags;
  };

  /** 为富媒体标签创建 DOM 元素 */
  #createDomTag(item: Exclude<TagItem, string>): HTMLElement {
    const el = document.createElement("div");
    el.style.position = "absolute";
    el.style.top = "0";
    el.style.left = "0";
    el.style.willChange = "transform, opacity";
    const clickable = !!(item.onClick || (item.type === "video" && this.#opts.videoFullscreen));
    el.style.cursor = clickable ? "pointer" : "default";
    el.style.pointerEvents = clickable ? "auto" : "none";
    if (item.type === "element") el.appendChild(item.element);
    else if (item.type === "html") el.innerHTML = item.html;
    else if (item.type === "svg") el.innerHTML = item.content;
    else if (item.type === "video") {
      el.innerHTML = `<video src="${item.src}" width="${item.width}" height="${item.height}" autoplay muted loop playsinline></video>`;
      if (this.#opts.videoFullscreen) {
        el.addEventListener("click", () => {
          const v = el.querySelector("video")!;
          if (document.fullscreenElement) { document.exitFullscreen(); }
          else { v.play(); v.requestFullscreen(); }
        });
      }
    }
    if (item.onClick || this.#opts.onTagClick) {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        if (item.onClick) item.onClick();
        if (this.#opts.onTagClick) this.#opts.onTagClick(item);
      });
    }
    return el;
  }

  #resizeCanvas(): void {
    const c = this.#canvas;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = c.getBoundingClientRect();
    c.width = width * dpr;
    c.height = height * dpr;
    this.#ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  #loop = (): void => {
    if (!this.#paused) this.#tick();
    this.#raf = requestAnimationFrame(this.#loop);
  };

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

    // 自旋 + 惯性
    const revY = this.#opts.reverse || this.#opts.reverseY ? -1 : 1;
    const revX = this.#opts.reverse || this.#opts.reverseX ? -1 : 1;
    const decay = this.#opts.inertiaDecay;
    if (!this.#dragging) {
      this.#rotateY((this.#opts.spinY + this.#velY) * revY);
      this.#rotateX((this.#opts.spinX + this.#velX) * revX);
      this.#velY *= decay;
      this.#velX *= decay;
    }

    // 四元数构造旋转矩阵
    const { w, x, y, z } = this.#qNow;
    const m00 = 1 - 2 * (y * y + z * z);
    const m01 = 2 * (x * y - w * z);
    const m02 = 2 * (x * z + w * y);
    const m10 = 2 * (x * y + w * z);
    const m11 = 1 - 2 * (x * x + z * z);
    const m12 = 2 * (y * z - w * x);
    const m20 = 2 * (x * z - w * y);
    const m21 = 2 * (y * z + w * x);

    const d2 = this.#depth * 2;
    const projected: TagData[] = [];

    for (const p of this.#points) {
      const rx = m00 * p.x + m01 * p.y + m02 * p.z;
      const ry = m10 * p.x + m11 * p.y + m12 * p.z;
      const rz = m20 * p.x + m21 * p.y + (1 - 2 * (x * x + y * y)) * p.z;

      const per = d2 / (d2 + rz);
      const alpha = Math.min(1, Math.max(0, per * per - 0.25));

      projected.push({
        item: p.item,
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
