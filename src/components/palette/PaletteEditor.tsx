
import {
  Palette,
  Sun,
  Moon,
  Columns2,
  RefreshCw,
  LockOpen,
} from 'lucide-react'

import ColorGroup from './ColorGroup'

import DarkColorGroup from './DarkColorGroup'

import PaletteComparison from './PaletteComparison'

import ThemeStrategySelector from './ThemeStrategySelector'

import {
  colorCategories,
} from '../../config/tokenDefinitions'

import {
  useThemeStore,
} from '../../store/themeStore'

import type {
  PaletteEditorMode,
} from '../../types/theme.types'

import { useMemo } from 'react'

import {
  auditPaletteContrast,
} from '../../engine/darkThemeGenerator'

import {
  themeStrategies,
} from '../../config/themeStrategies'

export default function PaletteEditor() {

  const editorMode = useThemeStore(
    (state) => state.editorMode,
  )

  const setEditorMode = useThemeStore(
    (state) => state.setEditorMode,
  )

  const overrides = useThemeStore(
    (state) => state.darkOverrides,
  )

  const regenerate = useThemeStore(
    (state) => state.regenerateDarkPalette,
  )

  const clearOverrides = useThemeStore(
    (state) => state.clearDarkOverrides,
  )

  const lockedCount =
    Object.keys(overrides).length

  const totalTokens = colorCategories.reduce(
    (total, category) =>
      total + category.tokens.length,
    0,
  )

  const tabs = [
    {
      mode: 'light',
      label: 'Light',
      icon: Sun,
    },
    {
      mode: 'dark',
      label: 'Dark',
      icon: Moon,
    },
    {
      mode: 'comparison',
      label: 'Compare',
      icon: Columns2,
    },
  ] as const

  function selectMode(mode: PaletteEditorMode) {
    setEditorMode(mode)
  }

  const darkPalette = useThemeStore(
  (state) => state.darkPalette,
)

const strategy = useThemeStore(
  (state) => state.strategy,
)

const contrastFailures = useMemo(
  () => auditPaletteContrast(
    darkPalette,
    themeStrategies[strategy].minimumContrast,
  ).filter((result) => !result.passes),
  [darkPalette, strategy],
)

  return (
    <div>

      <div className="flex items-center gap-2">

        <Palette
          size={20}
          className="text-indigo-600"
        />

        <h2 className="text-lg font-semibold
          text-slate-900">
          Color Palette
        </h2>

      </div>

      <p className="mt-1 text-sm text-slate-500">
        Configure and compare theme colors.
      </p>

      <div className="my-4 rounded-lg
        bg-indigo-50 px-3 py-2 text-xs
        text-indigo-700">

        {totalTokens} semantic color tokens
        {' · '}
        {lockedCount} locked

      </div>

      <ThemeStrategySelector />

      {contrastFailures.length > 0 && (
  <div className="mb-4 rounded-lg border
    border-amber-200 bg-amber-50
    p-3 text-xs text-amber-900">

    <p className="font-semibold">
      Contrast Warning
    </p>

    <p className="mt-1">
      {contrastFailures.length} color pairs
      do not meet the selected contrast target.
    </p>

    <p className="mt-1">
      Review manually overridden colors.
    </p>

  </div>
)}

      {/* Palette editor tabs */}

      <div className="mb-4 flex gap-1
        rounded-lg bg-slate-100 p-1">

        {tabs.map(({ mode, label, icon: Icon }) => (
          <button
            key={mode}
            type="button"
            aria-pressed={editorMode === mode}
            onClick={() => selectMode(mode)}
            className={`flex flex-1 items-center
              justify-center gap-1.5 rounded-md
              px-2 py-2 text-xs cursor-pointer
              ${
                editorMode === mode
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600'
              }`}
          >

            <Icon size={15} />

            {label}

          </button>
        ))}

      </div>

      {editorMode !== 'light' && (
        <div className="mb-4 space-y-3">

          <button
            type="button"
            onClick={regenerate}
            className="flex w-full items-center
              justify-center gap-2 rounded-md
              bg-indigo-600 px-3 py-2.5
              text-sm text-white cursor-pointer"
          >

            <RefreshCw size={15} />

            Regenerate Dark Palette

          </button>

          <button
            type="button"
            disabled={lockedCount === 0}
            onClick={clearOverrides}
            className="flex w-full items-center
              justify-center gap-2 rounded-md
              border border-slate-300 px-3 py-2
              text-xs text-slate-600
              disabled:opacity-40
              disabled:cursor-not-allowed"
          >

            <LockOpen size={15} />

            Clear All Overrides

          </button>

          <p className="text-xs text-slate-500">
            Manual dark-color changes are locked
            automatically. Unlock a color to restore
            its generated value.
          </p>

        </div>
      )}

      <div className="space-y-3">

        {editorMode === 'light' &&
          colorCategories.map((category, index) => (
            <ColorGroup
              key={category.id}
              category={category}
              defaultOpen={index < 2}
            />
          ))
        }

        {editorMode === 'dark' &&
          colorCategories.map((category, index) => (
            <DarkColorGroup
              key={category.id}
              category={category}
              defaultOpen={index < 2}
            />
          ))
        }

        {editorMode === 'comparison' && (
          <PaletteComparison />
        )}

      </div>

    </div>
  )
}
