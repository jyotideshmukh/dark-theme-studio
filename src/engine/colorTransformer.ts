
import {
  clamp,
  hexToOklch,
} from './colorConverter'

import { oklchToHex } from './gamutMapper'

import type {
  TransformationRole,
} from '../config/transformationRules'

import type {
  ThemeStrategyConfig,
} from '../config/themeStrategies'

export function transformColor(
  hex: string,
  role: TransformationRole,
  strategy: ThemeStrategyConfig,
  brandHue: number,
): string {
  const input = hexToOklch(hex)

  const neutralHue =
    strategy.neutralHue === 'brand'
      ? brandHue
      : strategy.neutralHue === 'source'
        ? input.h
        : strategy.neutralHue

  const neutralChroma =
    strategy.neutralHue === 'source'
      ? Math.min(input.c, strategy.neutralChroma)
      : strategy.neutralChroma

  const accentChroma = Math.min(
    input.c * strategy.accentChromaMultiplier,
    0.24,
  )

  // Retain some differences between source colors.
  const lightnessVariation = (0.6 - input.l) * 0.12

  let l = input.l
  let c = input.c
  let h = input.h

  switch (role) {
    case 'background':
      l = strategy.backgroundLightness
      c = neutralChroma
      h = neutralHue
      break

    case 'surface':
      l = strategy.surfaceLightness
        + (1 - input.l) * 0.08
      c = neutralChroma
      h = neutralHue
      break

    case 'elevated-surface':
      l = strategy.surfaceLightness + 0.07
      c = neutralChroma
      h = neutralHue
      break

    case 'subtle-surface':
      l = strategy.surfaceLightness + 0.025
      c = neutralChroma
      h = neutralHue
      break

    case 'text':
      l = strategy.textLightness
        + lightnessVariation
      c = Math.min(input.c * 0.6, 0.06)
      break

    case 'muted-text':
      l = strategy.mutedTextLightness
        + lightnessVariation
      c = Math.min(input.c * 0.6, 0.04)
      break

    case 'disabled-text':
      l = 0.55
      c = neutralChroma
      h = neutralHue
      break

    case 'accent':
      l = strategy.accentLightness
        + lightnessVariation
      c = accentChroma
      break

    case 'accent-hover':
      l = strategy.accentLightness
        + 0.06
        + lightnessVariation
      c = accentChroma * 0.95
      break

    case 'accent-active':
      l = strategy.accentLightness
        - 0.045
        + lightnessVariation
      c = accentChroma
      break

    case 'on-accent':
      l = 0.14
      c = Math.min(input.c, 0.02)
      break

    case 'tinted-surface':
      l = strategy.surfaceLightness + 0.07
      c = Math.min(input.c * 0.65, 0.09)
      break

    case 'status-text':
      l = Math.max(
        strategy.accentLightness + 0.08,
        0.80,
      )
      c = Math.min(input.c * 0.75, 0.17)
      break

    case 'status-background':
      l = strategy.surfaceLightness + 0.025
      c = Math.min(input.c * 1.5, 0.065)
      break

    case 'status-border':
      l = strategy.borderLightness + 0.08
      c = Math.min(input.c * 0.8, 0.10)
      break

    case 'border':
      l = strategy.borderLightness
      c = neutralChroma
      h = neutralHue
      break

    case 'divider':
      l = strategy.borderLightness - 0.04
      c = neutralChroma
      h = neutralHue
      break

    case 'interactive-border':
      l = strategy.borderLightness + 0.18
      c = Math.min(input.c, 0.06)
      break

    case 'inverse-background':
      l = 0.90
      c = Math.min(input.c, 0.025)
      break

    case 'inverse-text':
      l = 0.18
      c = Math.min(input.c, 0.02)
      break
  }

  return oklchToHex({
    mode: 'oklch',
    l: clamp(l, 0, 1),
    c: Math.max(0, c),
    h,
  })
}
