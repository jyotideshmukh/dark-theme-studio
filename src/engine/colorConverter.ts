
import { converter } from 'culori'

export interface OklchColor {
  mode: 'oklch'
  l: number
  c: number
  h: number
}

const convertToOklch = converter('oklch')

export function hexToOklch(hex: string): OklchColor {
  const color = convertToOklch(hex)

  if (!color) {
    throw new Error(`Invalid color: ${hex}`)
  }

  return {
    mode: 'oklch',
    l: color.l,
    c: color.c,
    h: color.h ?? 0,
  }
}

export function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(max, Math.max(min, value))
}

export function normalizeHue(hue: number): number {
  return ((hue % 360) + 360) % 360
}
