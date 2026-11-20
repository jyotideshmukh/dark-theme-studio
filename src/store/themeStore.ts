
import { create } from 'zustand'

import {
  defaultLightPalette,
} from '../config/defaultLightPalette'

import {
  generateDarkPalette,
} from '../engine/darkThemeGenerator'

import type {
  ColorPalette,
  ColorToken,
  PreviewMode,
  ThemeStrategy,
  PaletteEditorMode,
  DarkOverrides,
} from '../types/theme.types'

import {
  isValidHex,
  normalizeHex,
} from '../utils/colorUtils'

interface ThemeStore {
  lightPalette: ColorPalette

  autoDarkPalette: ColorPalette

  darkPalette: ColorPalette

  darkOverrides: DarkOverrides

  previewMode: PreviewMode

  editorMode: PaletteEditorMode

  strategy: ThemeStrategy

  setLightColor: (
    token: ColorToken,
    value: string,
  ) => void

  setDarkColor: (
    token: ColorToken,
    value: string,
  ) => void

  toggleDarkLock: (token: ColorToken) => void

  resetDarkColor: (token: ColorToken) => void

  clearDarkOverrides: () => void

  setPreviewMode: (mode: PreviewMode) => void

  setEditorMode: (mode: PaletteEditorMode) => void

  setStrategy: (strategy: ThemeStrategy) => void

  regenerateDarkPalette: () => void

  resetPalette: () => void
}

function mergePalette(
  generated: ColorPalette,
  overrides: DarkOverrides,
): ColorPalette {
  return {
    ...generated,
    ...overrides,
  }
}

function createInitialState() {
  const lightPalette = {
    ...defaultLightPalette,
  }

  const autoDarkPalette = generateDarkPalette(
    lightPalette,
    'soft-dark',
  )

  return {
    lightPalette,

    autoDarkPalette,

    darkPalette: { ...autoDarkPalette },

    darkOverrides: {} as DarkOverrides,

    previewMode: 'comparison' as PreviewMode,

    editorMode: 'light' as PaletteEditorMode,

    strategy: 'soft-dark' as ThemeStrategy,
  }
}

export const useThemeStore =
  create<ThemeStore>((set) => ({

    ...createInitialState(),

    setLightColor: (token, value) => {
      const color = normalizeHex(value)

      if (!isValidHex(color)) {
        return
      }

      set((state) => {
        if (state.lightPalette[token] === color) {
          return state
        }

        const lightPalette = {
          ...state.lightPalette,
          [token]: color,
        }

        const autoDarkPalette =
          generateDarkPalette(
            lightPalette,
            state.strategy,
          )

        return {
          lightPalette,

          autoDarkPalette,

          darkPalette: mergePalette(
            autoDarkPalette,
            state.darkOverrides,
          ),
        }
      })
    },

    setDarkColor: (token, value) => {
      const color = normalizeHex(value)

      if (!isValidHex(color)) {
        return
      }

      set((state) => {
        const darkOverrides = {
          ...state.darkOverrides,
          [token]: color,
        }

        return {
          darkOverrides,

          darkPalette: mergePalette(
            state.autoDarkPalette,
            darkOverrides,
          ),
        }
      })
    },

    toggleDarkLock: (token) => {
      set((state) => {
        const darkOverrides = {
          ...state.darkOverrides,
        }

        if (token in darkOverrides) {
          delete darkOverrides[token]
        } else {
          darkOverrides[token] =
            state.darkPalette[token]
        }

        return {
          darkOverrides,

          darkPalette: mergePalette(
            state.autoDarkPalette,
            darkOverrides,
          ),
        }
      })
    },

    resetDarkColor: (token) => {
      set((state) => {
        const darkOverrides = {
          ...state.darkOverrides,
        }

        delete darkOverrides[token]

        return {
          darkOverrides,

          darkPalette: mergePalette(
            state.autoDarkPalette,
            darkOverrides,
          ),
        }
      })
    },

    clearDarkOverrides: () => {
      set((state) => ({
        darkOverrides: {},

        darkPalette: {
          ...state.autoDarkPalette,
        },
      }))
    },

    setPreviewMode: (previewMode) => {
      set({ previewMode })
    },

    setEditorMode: (editorMode) => {
      set({ editorMode })
    },

    setStrategy: (strategy) => {
      set((state) => {
        const autoDarkPalette =
          generateDarkPalette(
            state.lightPalette,
            strategy,
          )

        return {
          strategy,

          autoDarkPalette,

          darkPalette: mergePalette(
            autoDarkPalette,
            state.darkOverrides,
          ),
        }
      })
    },

    regenerateDarkPalette: () => {
      set((state) => {
        const autoDarkPalette =
          generateDarkPalette(
            state.lightPalette,
            state.strategy,
          )

        return {
          autoDarkPalette,

          darkPalette: mergePalette(
            autoDarkPalette,
            state.darkOverrides,
          ),
        }
      })
    },

    resetPalette: () => {
      set(createInitialState())
    },

  }))
