
import type {
  ColorPalette,
  ColorToken,
  ThemeStrategy,
} from '../types/theme.types'

import {
  transformationRules,
} from '../config/transformationRules'

import {
  themeStrategies,
} from '../config/themeStrategies'

import { hexToOklch } from './colorConverter'
import { transformColor } from './colorTransformer'

import {
  contrastRatio,
  ensureContrast,
} from './contrastValidator'

interface ContrastPair {
  foreground: ColorToken
  backgrounds: ColorToken[]
  minimum?: number
}

const contrastPairs: ContrastPair[] = [
  {
    foreground: 'title',
    backgrounds: ['background', 'surface'],
  },
  {
    foreground: 'heading',
    backgrounds: ['background', 'surface', 'modalBackground'],
  },
  {
    foreground: 'subtitle',
    backgrounds: ['background', 'surface'],
  },
  {
    foreground: 'text',
    backgrounds: [
      'background',
      'surface',
      'modalBackground',
      'tableRow',
      'tableAlternateRow',
      'tableRowHover',
      'tableSelectedRow',
    ],
  },
  {
    foreground: 'mutedText',
    backgrounds: ['background', 'surface'],
  },

  // Links
  {
    foreground: 'link',
    backgrounds: ['background', 'surface'],
  },
  {
    foreground: 'linkHover',
    backgrounds: ['background', 'surface'],
  },
  {
    foreground: 'linkActive',
    backgrounds: ['background', 'surface'],
  },
  {
    foreground: 'linkVisited',
    backgrounds: ['background', 'surface'],
  },

  // Buttons
  {
    foreground: 'primaryButtonText',
    backgrounds: [
      'primaryButton',
      'primaryButtonHover',
      'primaryButtonActive',
    ],
  },
  {
    foreground: 'secondaryButtonText',
    backgrounds: [
      'secondaryButton',
      'secondaryButtonHover',
      'secondaryButtonActive',
    ],
  },
  {
    foreground: 'dangerButtonText',
    backgrounds: [
      'dangerButton',
      'dangerButtonHover',
    ],
  },

  // Forms
  {
    foreground: 'inputText',
    backgrounds: ['inputBackground'],
  },
  {
    foreground: 'inputPlaceholder',
    backgrounds: ['inputBackground'],
  },
  {
    foreground: 'inputBorder',
    backgrounds: ['inputBackground', 'surface'],
    minimum: 3,
  },
  {
    foreground: 'inputFocusBorder',
    backgrounds: ['inputBackground', 'surface'],
    minimum: 3,
  },
  {
    foreground: 'inputErrorBorder',
    backgrounds: ['inputBackground', 'surface'],
    minimum: 3,
  },
  {
    foreground: 'focusRing',
    backgrounds: ['background', 'surface'],
    minimum: 3,
  },
  {
    foreground: 'checkbox',
    backgrounds: ['background', 'surface'],
    minimum: 3,
  },

  // Status messages
  {
    foreground: 'errorText',
    backgrounds: ['errorBackground'],
  },
  {
    foreground: 'successText',
    backgrounds: ['successBackground'],
  },
  {
    foreground: 'warningText',
    backgrounds: ['warningBackground'],
  },
  {
    foreground: 'infoText',
    backgrounds: ['infoBackground'],
  },

  // Status icons
  {
    foreground: 'errorIcon',
    backgrounds: ['errorBackground'],
    minimum: 3,
  },
  {
    foreground: 'successIcon',
    backgrounds: ['successBackground'],
    minimum: 3,
  },
  {
    foreground: 'warningIcon',
    backgrounds: ['warningBackground'],
    minimum: 3,
  },
  {
    foreground: 'infoIcon',
    backgrounds: ['infoBackground'],
    minimum: 3,
  },

  // Tables and navigation
  {
    foreground: 'tableHeaderText',
    backgrounds: ['tableHeader'],
  },
  {
    foreground: 'menuText',
    backgrounds: [
      'sidebarBackground',
      'headerBackground',
      'menuHover',
    ],
  },
  {
    foreground: 'menuActive',
    backgrounds: [
      'sidebarBackground',
      'headerBackground',
      'menuHover',
    ],
  },

  // Miscellaneous
  {
    foreground: 'tooltipText',
    backgrounds: ['tooltipBackground'],
  },
  {
    foreground: 'badgeText',
    backgrounds: ['badgeBackground'],
  },
  {
    foreground: 'icon',
    backgrounds: ['background', 'surface'],
    minimum: 3,
  },
]

export interface PaletteContrastResult {
  foreground: ColorToken
  background: ColorToken
  ratio: number
  requiredRatio: number
  passes: boolean
}

export function generateDarkPalette(
  lightPalette: ColorPalette,
  strategyName: ThemeStrategy = 'soft-dark',
): ColorPalette {
  const strategy = themeStrategies[strategyName]

  const brandColor = hexToOklch(
    lightPalette.primaryButton,
  )

  const brandHue = brandColor.h

  const tokens = Object.keys(
    transformationRules,
  ) as ColorToken[]

  // Phase 1: Semantic OKLCH transformation.
  const darkPalette = Object.fromEntries(
    tokens.map((token) => [
      token,
      transformColor(
        lightPalette[token],
        transformationRules[token],
        strategy,
        brandHue,
      ),
    ]),
  ) as ColorPalette

  // Phase 2: Contrast correction.
  for (const pair of contrastPairs) {
    const backgrounds = pair.backgrounds.map(
      (token) => darkPalette[token],
    )

    darkPalette[pair.foreground] = ensureContrast(
      darkPalette[pair.foreground],
      backgrounds,
      pair.minimum ?? strategy.minimumContrast,
    )
  }

  return darkPalette
}

export function auditPaletteContrast(
  palette: ColorPalette,
  minimumTextContrast = 4.5,
): PaletteContrastResult[] {
  return contrastPairs.flatMap((pair) =>
    pair.backgrounds.map((background) => {
      const ratio = contrastRatio(
        palette[pair.foreground],
        palette[background],
      )

      const requiredRatio =
        pair.minimum ?? minimumTextContrast

      return {
        foreground: pair.foreground,
        background,
        ratio,
        requiredRatio,
        passes: ratio >= requiredRatio,
      }
    }),
  )
}
