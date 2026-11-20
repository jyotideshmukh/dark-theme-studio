
import { converter } from 'culori'

import { hexToOklch } from './colorConverter'
import { oklchToHex } from './gamutMapper'

const convertToRgb = converter('rgb')

export interface ContrastResult {
  ratio: number
  requiredRatio: number
  passes: boolean
}

export function linearizeChannel(
  channel: number,
): number {
  return channel <= 0.04045
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4)
}

export function relativeLuminance(hex: string): number {
  const rgb = convertToRgb(hex)

  if (!rgb) {
    throw new Error(`Invalid color: ${hex}`)
  }

  const r = linearizeChannel(rgb.r)
  const g = linearizeChannel(rgb.g)
  const b = linearizeChannel(rgb.b)

  return (
    0.2126 * r +
    0.7152 * g +
    0.0722 * b
  )
}

export function contrastRatio(
  foreground: string,
  background: string,
): number {
  const l1 = relativeLuminance(foreground)
  const l2 = relativeLuminance(background)

  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

export function validateContrast(
  foreground: string,
  background: string,
  requiredRatio = 4.5,
): ContrastResult {
  const ratio = contrastRatio(foreground, background)

  return {
    ratio,
    requiredRatio,
    passes: ratio >= requiredRatio,
  }
}

export function minimumContrast(
  foreground: string,
  backgrounds: string[],
): number {
  return Math.min(
    ...backgrounds.map(
      (background) => contrastRatio(foreground, background),
    ),
  )
}

export function ensureContrast(
  foreground: string,
  background: string | string[],
  requiredRatio = 4.5,
): string {
  const backgrounds = Array.isArray(background)
    ? background
    : [background]

  if (backgrounds.length === 0) {
    return foreground
  }

  const initialRatio = minimumContrast(
    foreground,
    backgrounds,
  )

  if (initialRatio >= requiredRatio) {
    return foreground
  }

  const original = hexToOklch(foreground)

  let bestPassing: string | null = null
  let smallestChange = Infinity

  let bestFallback = foreground
  let bestRatio = initialRatio

  // Search both lighter and darker candidates.
  for (let step = 0; step <= 100; step++) {
    const lightness = step / 100

    const candidate = oklchToHex({
      ...original,
      l: lightness,
    })

    const ratio = minimumContrast(
      candidate,
      backgrounds,
    )

    if (ratio > bestRatio) {
      bestRatio = ratio
      bestFallback = candidate
    }

    if (ratio >= requiredRatio) {
      const difference = Math.abs(
        original.l - lightness,
      )

      if (difference < smallestChange) {
        smallestChange = difference
        bestPassing = candidate
      }
    }
  }

  // If the target is impossible, return the
  // best available candidate instead.
  return bestPassing ?? bestFallback
}
