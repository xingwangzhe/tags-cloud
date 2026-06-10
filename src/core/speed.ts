/**
 * 速度配置映射
 * Speed configuration maps
 *
 * 将语义化速度名映射为数值
 * Maps semantic speed names to numeric values
 *
 * ported from TagCloud.js _getMaxSpeed / _getInitSpeed
 */

/** 最大旋转速度 / max rotation speed */
export const SPEED_MAP = {
  slow: 0.5,
  normal: 1,
  fast: 2,
} as const;

/** 初始旋转速度（°每帧） / initial rotation speed (deg per frame) */
export const INIT_SPEED_MAP = {
  slow: 16,
  normal: 32,
  fast: 80,
} as const;

/** 速度档位 / speed tier */
export type Speed = keyof typeof SPEED_MAP;

/** 获取最大旋转速度 / get max rotation speed */
export function getMaxSpeed(name: Speed): number {
  return SPEED_MAP[name];
}

/** 获取初始旋转速度 / get initial rotation speed */
export function getInitSpeed(name: Speed): number {
  return INIT_SPEED_MAP[name];
}
