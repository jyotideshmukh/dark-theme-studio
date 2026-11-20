
import type {
  ColorPalette,
  ThemeStrategy,
  DarkOverrides,
} from '../types/theme.types'

export interface ThemeJsonExport {
  version: string

  generator: string

  strategy: ThemeStrategy

  light: ColorPalette

  dark: ColorPalette

  darkOverrides: DarkOverrides
}

export function generateThemeJson(
  lightPalette: ColorPalette,
  darkPalette: ColorPalette,
  strategy: ThemeStrategy,
  darkOverrides: DarkOverrides = {},
): string {

  const output: ThemeJsonExport = {
    version: '1.0',

    generator: 'Dark Theme Studio',

    strategy,

    light: {
      ...lightPalette,
    },

    dark: {
      ...darkPalette,
    },

    darkOverrides: {
      ...darkOverrides,
    },
  }

  return JSON.stringify(output, null, 2)
}
