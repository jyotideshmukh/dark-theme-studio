
import type { defaultLightPalette } from '../config/defaultLightPalette'

export type ColorToken = keyof typeof defaultLightPalette

export type ColorPalette = Record<ColorToken, string>

export type ThemeMode = 'light' | 'dark'

export type PreviewMode = 'light' | 'dark' | 'comparison'

export type ThemeStrategy =
  | 'soft-dark'
  | 'midnight-blue'
  | 'pure-black'
  | 'brand-tinted'
  | 'high-contrast'
  | 'warm-dark'

export interface ColorTokenDefinition {
  key: ColorToken
  label: string
  description?: string
}

export interface ColorCategory {
  id: string
  label: string
  tokens: ColorTokenDefinition[]
}

export interface ThemeConfiguration {
  lightPalette: ColorPalette
  darkPalette: ColorPalette | null
  strategy: ThemeStrategy
  previewMode: PreviewMode
}

export type PaletteEditorMode =
  | 'light'
  | 'dark'
  | 'comparison'

export type DarkOverrides =
  Partial<Record<ColorToken, string>>

export type CssExportMode =
  | 'combined'
  | 'light'
  | 'dark'

export interface CssExportOptions {
  mode: CssExportMode

  includeComponents: boolean

  includeSystemPreference: boolean
}
