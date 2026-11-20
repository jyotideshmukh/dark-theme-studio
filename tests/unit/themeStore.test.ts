
import {
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'

import {
  useThemeStore,
} from '../../src/store/themeStore'

import {
  defaultLightPalette,
} from '../../src/config/defaultLightPalette'

describe('Theme Store', () => {

  beforeEach(() => {
    useThemeStore.getState().resetPalette()
  })

  it('generates a dark palette initially', () => {

    const state = useThemeStore.getState()

    expect(state.darkPalette).toBeDefined()

    expect(state.darkPalette.background)
      .toMatch(/^#[0-9A-F]{6}$/)

  })

  it('updates light colors', () => {

    useThemeStore.getState().setLightColor(
      'primaryButton',
      '#DC2626',
    )

    expect(
      useThemeStore.getState()
        .lightPalette.primaryButton,
    ).toBe('#DC2626')

  })

  it('rejects invalid HEX values', () => {

    const original = useThemeStore
      .getState()
      .lightPalette.primaryButton

    useThemeStore.getState().setLightColor(
      'primaryButton',
      '#XYZ',
    )

    expect(
      useThemeStore.getState()
        .lightPalette.primaryButton,
    ).toBe(original)

  })

  it('automatically locks manual dark colors', () => {

    useThemeStore.getState().setDarkColor(
      'primaryButton',
      '#BB86FC',
    )

    const state = useThemeStore.getState()

    expect(
      state.darkPalette.primaryButton,
    ).toBe('#BB86FC')

    expect(
      state.darkOverrides.primaryButton,
    ).toBe('#BB86FC')

  })

  it('preserves overrides when light colors change', () => {

    useThemeStore.getState().setDarkColor(
      'primaryButton',
      '#BB86FC',
    )

    useThemeStore.getState().setLightColor(
      'primaryButton',
      '#DC2626',
    )

    expect(
      useThemeStore.getState()
        .darkPalette.primaryButton,
    ).toBe('#BB86FC')

  })

  it('preserves overrides when strategy changes', () => {

    useThemeStore.getState().setDarkColor(
      'title',
      '#ABCDEF',
    )

    useThemeStore.getState().setStrategy(
      'warm-dark',
    )

    expect(
      useThemeStore.getState()
        .darkPalette.title,
    ).toBe('#ABCDEF')

  })

  it('restores generated color when unlocked', () => {

    useThemeStore.getState().setDarkColor(
      'primaryButton',
      '#BB86FC',
    )

    useThemeStore.getState().toggleDarkLock(
      'primaryButton',
    )

    const state = useThemeStore.getState()

    expect(
      state.darkOverrides.primaryButton,
    ).toBeUndefined()

    expect(
      state.darkPalette.primaryButton,
    ).toBe(
      state.autoDarkPalette.primaryButton,
    )

  })

  it('clears all manual overrides', () => {

    useThemeStore.getState().setDarkColor(
      'primaryButton',
      '#BB86FC',
    )

    useThemeStore.getState().setDarkColor(
      'title',
      '#ABCDEF',
    )

    useThemeStore.getState().clearDarkOverrides()

    const state = useThemeStore.getState()

    expect(state.darkOverrides).toEqual({})

    expect(state.darkPalette).toEqual(
      state.autoDarkPalette,
    )

  })

  it('resets the entire palette', () => {

    useThemeStore.getState().setStrategy(
      'warm-dark',
    )

    useThemeStore.getState().setDarkColor(
      'title',
      '#ABCDEF',
    )

    useThemeStore.getState().resetPalette()

    const state = useThemeStore.getState()

    expect(state.strategy).toBe('soft-dark')

    expect(state.darkOverrides).toEqual({})

    expect(state.lightPalette).toEqual(
      defaultLightPalette,
    )

  })

})
