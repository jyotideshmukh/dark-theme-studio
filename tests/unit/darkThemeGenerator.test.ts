
import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  defaultLightPalette,
} from '../../src/config/defaultLightPalette'

import {
  themeStrategies,
} from '../../src/config/themeStrategies'

import {
  generateDarkPalette,
  auditPaletteContrast,
} from '../../src/engine/darkThemeGenerator'

import {
  contrastRatio,
  ensureContrast,
} from '../../src/engine/contrastValidator'

import {
  hexToOklch,
} from '../../src/engine/colorConverter'

import {
  oklchToHex,
  isInSrgbGamut,
  mapToSrgb,
} from '../../src/engine/gamutMapper'

import type {
  ThemeStrategy,
} from '../../src/types/theme.types'

describe('OKLCH Color Converter', () => {
  it('converts HEX to OKLCH and back', () => {
    const original = '#2563EB'

    const color = hexToOklch(original)

    expect(oklchToHex(color)).toBe(original)
  })

  it('rejects invalid colors', () => {
    expect(() => hexToOklch('invalid-color'))
      .toThrow()
  })

  it('maps out-of-gamut colors into sRGB', () => {
    const color = mapToSrgb({
      mode: 'oklch',
      l: 0.65,
      c: 0.8,
      h: 260,
    })

    expect(isInSrgbGamut(color)).toBe(true)
    expect(color.c).toBeLessThan(0.8)
  })
})

describe('Contrast Validator', () => {
  it('calculates black and white contrast', () => {
    expect(
      contrastRatio('#FFFFFF', '#000000'),
    ).toBeCloseTo(21, 5)
  })

  it('calculates identical color contrast', () => {
    expect(
      contrastRatio('#FFFFFF', '#FFFFFF'),
    ).toBeCloseTo(1, 5)
  })

  it('corrects insufficient text contrast', () => {
    const corrected = ensureContrast(
      '#333333',
      '#222222',
      4.5,
    )

    expect(
      contrastRatio(corrected, '#222222'),
    ).toBeGreaterThanOrEqual(4.5)
  })

  it('preserves a color that already passes', () => {
    expect(
      ensureContrast('#FFFFFF', '#000000', 4.5),
    ).toBe('#FFFFFF')
  })

  it('supports multiple backgrounds', () => {
    const backgrounds = ['#EEEEEE', '#CCCCCC']

    const corrected = ensureContrast(
      '#999999',
      backgrounds,
      4.5,
    )

    for (const background of backgrounds) {
      expect(
        contrastRatio(corrected, background),
      ).toBeGreaterThanOrEqual(4.5)
    }
  })
})

describe('Dark Theme Generator', () => {
  it('generates every semantic token', () => {
    const dark = generateDarkPalette(
      defaultLightPalette,
    )

    expect(Object.keys(dark).sort())
      .toEqual(
        Object.keys(defaultLightPalette).sort(),
      )
  })

  it('does not mutate the original light palette', () => {
    const original = { ...defaultLightPalette }

    generateDarkPalette(original)

    expect(original).toEqual(defaultLightPalette)
  })

  it('generates valid HEX values for every strategy', () => {
    const strategies = Object.keys(
      themeStrategies,
    ) as ThemeStrategy[]

    for (const strategy of strategies) {
      const dark = generateDarkPalette(
        defaultLightPalette,
        strategy,
      )

      for (const color of Object.values(dark)) {
        expect(color).toMatch(/^#[0-9A-F]{6}$/)
      }
    }
  })

  it('generates a dark background', () => {
    const dark = generateDarkPalette(
      defaultLightPalette,
    )

    expect(hexToOklch(dark.background).l)
      .toBeLessThan(0.35)
  })

  it('preserves surface hierarchy', () => {
    const dark = generateDarkPalette(
      defaultLightPalette,
    )

    expect(hexToOklch(dark.surface).l)
      .toBeGreaterThan(
        hexToOklch(dark.background).l,
      )
  })

  it('generates pure black for AMOLED mode', () => {
    const dark = generateDarkPalette(
      defaultLightPalette,
      'pure-black',
    )

    expect(dark.background).toBe('#000000')
  })

  it('responds to changes in brand color', () => {
    const blueTheme = generateDarkPalette(
      defaultLightPalette,
    )

    const redTheme = generateDarkPalette({
      ...defaultLightPalette,
      primaryButton: '#DC2626',
    })

    expect(redTheme.primaryButton)
      .not.toBe(blueTheme.primaryButton)
  })

  it('produces deterministic results', () => {
    const first = generateDarkPalette(
      defaultLightPalette,
    )

    const second = generateDarkPalette(
      defaultLightPalette,
    )

    expect(first).toEqual(second)
  })

  it('makes normal body text readable', () => {
    const dark = generateDarkPalette(
      defaultLightPalette,
      'soft-dark',
    )

    expect(
      contrastRatio(dark.text, dark.background),
    ).toBeGreaterThanOrEqual(4.5)
  })

  it('makes primary button text readable in all states', () => {
    const dark = generateDarkPalette(
      defaultLightPalette,
    )

    const backgrounds = [
      dark.primaryButton,
      dark.primaryButtonHover,
      dark.primaryButtonActive,
    ]

    for (const background of backgrounds) {
      expect(
        contrastRatio(
          dark.primaryButtonText,
          background,
        ),
      ).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('produces a contrast audit report', () => {
    const dark = generateDarkPalette(
      defaultLightPalette,
    )

    const report = auditPaletteContrast(dark)

    expect(report.length).toBeGreaterThan(0)

    expect(report.every(
      (result) =>
        result.passes ===
        (result.ratio >= result.requiredRatio),
    )).toBe(true)
  })
})
