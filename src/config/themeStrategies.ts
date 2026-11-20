
import type { ThemeStrategy } from '../types/theme.types'

export interface ThemeStrategyConfig {
  label: string
  description: string

  backgroundLightness: number
  surfaceLightness: number
  textLightness: number
  mutedTextLightness: number
  borderLightness: number

  accentLightness: number
  accentChromaMultiplier: number

  neutralHue: number | 'brand' | 'source'
  neutralChroma: number

  minimumContrast: number
}

export const themeStrategies: Record<
  ThemeStrategy,
  ThemeStrategyConfig
> = {
  'soft-dark': {
    label: 'Soft Dark',
    description: 'Balanced everyday dark theme',
    backgroundLightness: 0.18,
    surfaceLightness: 0.24,
    textLightness: 0.92,
    mutedTextLightness: 0.72,
    borderLightness: 0.36,
    accentLightness: 0.72,
    accentChromaMultiplier: 0.75,
    neutralHue: 'source',
    neutralChroma: 0.015,
    minimumContrast: 4.5,
  },

  'midnight-blue': {
    label: 'Midnight Blue',
    description: 'Deep blue-tinted surfaces',
    backgroundLightness: 0.17,
    surfaceLightness: 0.23,
    textLightness: 0.94,
    mutedTextLightness: 0.75,
    borderLightness: 0.38,
    accentLightness: 0.74,
    accentChromaMultiplier: 0.8,
    neutralHue: 260,
    neutralChroma: 0.035,
    minimumContrast: 4.5,
  },

  'pure-black': {
    label: 'Pure Black / AMOLED',
    description: 'True black page background',
    backgroundLightness: 0,
    surfaceLightness: 0.18,
    textLightness: 0.95,
    mutedTextLightness: 0.75,
    borderLightness: 0.32,
    accentLightness: 0.76,
    accentChromaMultiplier: 0.75,
    neutralHue: 0,
    neutralChroma: 0,
    minimumContrast: 4.5,
  },

  'brand-tinted': {
    label: 'Brand Tinted',
    description: 'Dark surfaces using the brand hue',
    backgroundLightness: 0.18,
    surfaceLightness: 0.25,
    textLightness: 0.93,
    mutedTextLightness: 0.75,
    borderLightness: 0.39,
    accentLightness: 0.73,
    accentChromaMultiplier: 0.85,
    neutralHue: 'brand',
    neutralChroma: 0.035,
    minimumContrast: 4.5,
  },

  'high-contrast': {
    label: 'High Contrast',
    description: 'Higher contrast for readability',
    backgroundLightness: 0.12,
    surfaceLightness: 0.19,
    textLightness: 0.99,
    mutedTextLightness: 0.90,
    borderLightness: 0.60,
    accentLightness: 0.84,
    accentChromaMultiplier: 0.65,
    neutralHue: 0,
    neutralChroma: 0,
    minimumContrast: 7,
  },

  'warm-dark': {
    label: 'Warm Dark',
    description: 'Warm brown-tinted surfaces',
    backgroundLightness: 0.20,
    surfaceLightness: 0.27,
    textLightness: 0.94,
    mutedTextLightness: 0.76,
    borderLightness: 0.40,
    accentLightness: 0.73,
    accentChromaMultiplier: 0.7,
    neutralHue: 65,
    neutralChroma: 0.025,
    minimumContrast: 4.5,
  },
}
