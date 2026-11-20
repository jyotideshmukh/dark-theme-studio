
import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  calculateContrast,
  meetsContrast,
  suggestAccessibleColor,
  auditAccessibility,
  summarizeAccessibility,
  fixPaletteAccessibility,
  contrastRules,
} from '../../src/engine/accessibilityEngine'

import {
  defaultLightPalette,
} from '../../src/config/defaultLightPalette'

import {
  generateDarkPalette,
} from '../../src/engine/darkThemeGenerator'

import type {
  ContrastRule,
} from '../../src/engine/accessibilityEngine'

describe('Accessibility Engine', () => {

  it('calculates black and white contrast', () => {

    expect(
      calculateContrast(
        '#000000',
        '#FFFFFF',
      ),
    ).toBeCloseTo(21, 5)
  })

  it('calculates identical color contrast', () => {

    expect(
      calculateContrast(
        '#FFFFFF',
        '#FFFFFF',
      ),
    ).toBe(1)
  })

  it('does not depend on color order', () => {

    expect(
      calculateContrast(
        '#123456',
        '#ABCDEF',
      ),
    ).toBeCloseTo(
      calculateContrast(
        '#ABCDEF',
        '#123456',
      ),
      5,
    )
  })

  it('validates passing contrast', () => {

    expect(
      meetsContrast(
        '#000000',
        '#FFFFFF',
        4.5,
      ),
    ).toBe(true)
  })

  it('identifies failing contrast', () => {

    expect(
      meetsContrast(
        '#777777',
        '#FFFFFF',
        4.5,
      ),
    ).toBe(false)
  })

  it('suggests an accessible foreground', () => {

    const corrected =
      suggestAccessibleColor(
        '#555555',
        [{
          background: '#121212',
          minimumRatio: 4.5,
        }],
      )

    expect(corrected).not.toBeNull()

    expect(
      calculateContrast(
        corrected!,
        '#121212',
      ),
    ).toBeGreaterThanOrEqual(4.5)
  })

  it('preserves already accessible colors', () => {

    expect(
      suggestAccessibleColor(
        '#FFFFFF',
        [{
          background: '#000000',
          minimumRatio: 4.5,
        }],
      ),
    ).toBe('#FFFFFF')
  })

  it('validates multiple backgrounds', () => {

    const constraints = [
      {
        background: '#121212',
        minimumRatio: 4.5,
      },
      {
        background: '#303030',
        minimumRatio: 4.5,
      },
    ]

    const corrected =
      suggestAccessibleColor(
        '#555555',
        constraints,
      )

    expect(corrected).not.toBeNull()

    for (const constraint of constraints) {

      expect(
        calculateContrast(
          corrected!,
          constraint.background,
        ),
      ).toBeGreaterThanOrEqual(
        constraint.minimumRatio,
      )
    }
  })

  it('returns null for impossible constraints', () => {

    const corrected =
      suggestAccessibleColor(
        '#777777',
        [
          {
            background: '#000000',
            minimumRatio: 7,
          },
          {
            background: '#FFFFFF',
            minimumRatio: 7,
          },
        ],
      )

    expect(corrected).toBeNull()
  })

  it('audits all configured contrast rules', () => {

    const results = auditAccessibility(
      defaultLightPalette,
    )

    expect(results.length).toBe(
      contrastRules.length,
    )

    expect(
      results.every(
        (result) =>
          Number.isFinite(result.ratio) &&
          result.ratio >= 1 &&
          result.ratio <= 21,
      ),
    ).toBe(true)
  })

  it('generates accurate summary counts', () => {

    const results =
      auditAccessibility(
        defaultLightPalette,
      )

    const summary =
      summarizeAccessibility(results)

    expect(
      summary.passed + summary.failed,
    ).toBe(summary.total)

    expect(summary.percentage)
      .toBeGreaterThanOrEqual(0)

    expect(summary.percentage)
      .toBeLessThanOrEqual(100)
  })

  it('fixes a failing color pair', () => {

    const rules: ContrastRule[] = [{
      id: 'test-text',
      label: 'Test text',
      category: 'Typography',
      foreground: 'text',
      background: 'background',
      minimumRatio: 4.5,
    }]

    const palette = {
      ...defaultLightPalette,
      text: '#555555',
      background: '#121212',
    }

    const result =
      fixPaletteAccessibility(
        palette,
        [],
        rules,
      )

    expect(result.before.failed).toBe(1)

    expect(result.after.failed).toBe(0)

    expect(result.after.percentage).toBe(100)

    expect(result.changes.text)
      .toBeDefined()
  })

  it('preserves locked colors', () => {

    const palette = {
      ...defaultLightPalette,
      title: '#111111',
    }

    const result =
      fixPaletteAccessibility(
        palette,
        ['title'],
      )

    expect(result.palette.title)
      .toBe('#111111')
  })

  it('does not modify the input palette', () => {

    const palette = {
      ...defaultLightPalette,
    }

    const original = {
      ...palette,
    }

    fixPaletteAccessibility(palette)

    expect(palette).toEqual(original)
  })

  it('does not introduce new contrast failures', () => {

    const darkPalette =
      generateDarkPalette(
        defaultLightPalette,
        'soft-dark',
      )

    const originalFailures = new Set(
      auditAccessibility(darkPalette)
        .filter((r) => !r.passes)
        .map((r) => r.id),
    )

    const result =
      fixPaletteAccessibility(
        darkPalette,
      )

    expect(result.after.failed)
      .toBeLessThanOrEqual(
        result.before.failed,
      )

    expect(
      result.unresolved.every(
        (r) => originalFailures.has(r.id),
      ),
    ).toBe(true)
  })

})
