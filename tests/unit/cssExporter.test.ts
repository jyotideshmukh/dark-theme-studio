
import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  defaultLightPalette,
} from '../../src/config/defaultLightPalette'

import {
  generateDarkPalette,
} from '../../src/engine/darkThemeGenerator'

import {
  generateCss,
  getCssFilename,
  tokenToCssVariable,
} from '../../src/exporters/cssExporter'

import {
  generateThemeJson,
} from '../../src/exporters/jsonExporter'

import type {
  ColorToken,
} from '../../src/types/theme.types'

const lightPalette = defaultLightPalette

const darkPalette = generateDarkPalette(
  lightPalette,
)

describe('CSS Exporter', () => {

  it('converts token names to CSS variables', () => {

    expect(
      tokenToCssVariable('primaryButtonHover'),
    ).toBe('--color-primary-button-hover')

  })

  it('exports combined light and dark themes', () => {

    const css = generateCss(
      lightPalette,
      darkPalette,
      {
        mode: 'combined',
        includeComponents: false,
        includeSystemPreference: false,
      },
    )

    expect(css).toContain(':root')

    expect(css).toContain(
      '[data-theme="dark"]',
    )

    expect(css).toContain(
      '--color-background:'
      + ` ${lightPalette.background};`,
    )

    expect(css).toContain(
      '--color-background:'
      + ` ${darkPalette.background};`,
    )

  })

  it('exports every semantic token', () => {

    const css = generateCss(
      lightPalette,
      darkPalette,
      {
        mode: 'combined',
        includeComponents: false,
        includeSystemPreference: false,
      },
    )

    const tokens = Object.keys(
      lightPalette,
    ) as ColorToken[]

    for (const token of tokens) {

      expect(css).toContain(
        `${tokenToCssVariable(token)}: ${
          lightPalette[token]
        };`,
      )

      expect(css).toContain(
        `${tokenToCssVariable(token)}: ${
          darkPalette[token]
        };`,
      )

    }

  })

  it('exports only light mode when requested', () => {

    const css = generateCss(
      lightPalette,
      darkPalette,
      {
        mode: 'light',
        includeComponents: false,
        includeSystemPreference: false,
      },
    )

    expect(css).toContain(
      'color-scheme: light',
    )

    expect(css).not.toContain(
      'color-scheme: dark',
    )

  })

  it('exports only dark mode when requested', () => {

    const css = generateCss(
      lightPalette,
      darkPalette,
      {
        mode: 'dark',
        includeComponents: false,
        includeSystemPreference: false,
      },
    )

    expect(css).toContain(
      'color-scheme: dark',
    )

    expect(css).not.toContain(
      'color-scheme: light',
    )

  })

  it('includes sample component CSS', () => {

    const css = generateCss(
      lightPalette,
      darkPalette,
      {
        mode: 'combined',
        includeComponents: true,
        includeSystemPreference: false,
      },
    )

    expect(css).toContain('.btn-primary')

    expect(css).toContain('.alert-error')

    expect(css).toContain('.theme-input')

  })

  it('excludes sample styles when disabled', () => {

    const css = generateCss(
      lightPalette,
      darkPalette,
      {
        mode: 'combined',
        includeComponents: false,
        includeSystemPreference: false,
      },
    )

    expect(css).not.toContain('.btn-primary')

  })

  it('includes system dark preference', () => {

    const css = generateCss(
      lightPalette,
      darkPalette,
      {
        mode: 'combined',
        includeComponents: false,
        includeSystemPreference: true,
      },
    )

    expect(css).toContain(
      '@media (prefers-color-scheme: dark)',
    )

    expect(css).toContain(
      ':root:not([data-theme])',
    )

  })

  it('exports manually overridden colors', () => {

    const modified = {
      ...darkPalette,
      primaryButton: '#BB86FC',
    }

    const css = generateCss(
      lightPalette,
      modified,
      {
        mode: 'dark',
        includeComponents: false,
        includeSystemPreference: false,
      },
    )

    expect(css).toContain(
      '--color-primary-button: #BB86FC;',
    )

  })

  it('rejects invalid color values', () => {

    const invalidPalette = {
      ...lightPalette,
      background: 'invalid',
    }

    expect(() => generateCss(
      invalidPalette,
      darkPalette,
      {
        mode: 'light',
        includeComponents: false,
        includeSystemPreference: false,
      },
    )).toThrow()

  })

  it('generates correct filenames', () => {

    expect(
      getCssFilename('combined'),
    ).toBe('theme.css')

    expect(
      getCssFilename('light'),
    ).toBe('light-theme.css')

    expect(
      getCssFilename('dark'),
    ).toBe('dark-theme.css')

  })

})

describe('JSON Exporter', () => {

  it('generates valid JSON', () => {

    const json = generateThemeJson(
      lightPalette,
      darkPalette,
      'soft-dark',
    )

    const result = JSON.parse(json)

    expect(result.light).toEqual(
      lightPalette,
    )

    expect(result.dark).toEqual(
      darkPalette,
    )

    expect(result.strategy).toBe(
      'soft-dark',
    )

  })

  it('includes dark color overrides', () => {

    const overrides = {
      primaryButton: '#BB86FC',
    }

    const json = generateThemeJson(
      lightPalette,
      {
        ...darkPalette,
        ...overrides,
      },
      'soft-dark',
      overrides,
    )

    const result = JSON.parse(json)

    expect(
      result.darkOverrides.primaryButton,
    ).toBe('#BB86FC')

  })

})
