
import { converter, formatHex } from 'culori'

import {
  clamp,
  normalizeHue,
} from './colorConverter'

import type { OklchColor } from './colorConverter'

const convertToRgb = converter('rgb')

export function isInSrgbGamut(
  color: OklchColor,
): boolean {
  const rgb = convertToRgb(color)

  if (!rgb) {
    return false
  }

  const epsilon = 0.000001

  return [rgb.r, rgb.g, rgb.b].every(
    (channel) =>
      Number.isFinite(channel) &&
      channel >= -epsilon &&
      channel <= 1 + epsilon,
  )
}

export function mapToSrgb(
  color: OklchColor,
): OklchColor {
  const normalized: OklchColor = {
    mode: 'oklch',
    l: clamp(color.l, 0, 1),
    c: Math.max(0, color.c),
    h: normalizeHue(color.h),
  }

  if (isInSrgbGamut(normalized)) {
    return normalized
  }

  let low = 0
  let high = normalized.c

  // Binary search for the highest usable chroma.
  for (let iteration = 0; iteration < 24; iteration++) {
    const middle = (low + high) / 2

    const candidate: OklchColor = {
      ...normalized,
      c: middle,
    }

    if (isInSrgbGamut(candidate)) {
      low = middle
    } else {
      high = middle
    }
  }

  return {
    ...normalized,
    c: low,
  }
}

export function oklchToHex(color: OklchColor): string {
  const mappedColor = mapToSrgb(color)

  const hex = formatHex(mappedColor)

  if (!hex) {
    throw new Error('Unable to convert OKLCH to HEX')
  }

  return hex.toUpperCase()
}
