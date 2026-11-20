
import { Moon } from 'lucide-react'

import { useThemeStore } from '../../store/themeStore'

import {
  themeStrategies,
} from '../../config/themeStrategies'

import type {
  ThemeStrategy,
} from '../../types/theme.types'

export default function ThemeStrategySelector() {
  const strategy = useThemeStore(
    (state) => state.strategy,
  )

  const setStrategy = useThemeStore(
    (state) => state.setStrategy,
  )

  const darkPalette = useThemeStore(
    (state) => state.darkPalette,
  )

  const strategies = Object.entries(themeStrategies)

  return (
    <div className="mb-5 rounded-xl border
      border-slate-200 bg-slate-50 p-4">

      <label
        htmlFor="theme-strategy"
        className="flex items-center gap-2
          text-sm font-semibold text-slate-800"
      >
        <Moon size={17} className="text-indigo-600" />

        Dark Mode Strategy
      </label>

      <select
        id="theme-strategy"
        value={strategy}
        onChange={(event) =>
          setStrategy(
            event.target.value as ThemeStrategy,
          )
        }
        className="mt-3 w-full rounded-lg border
          border-slate-300 bg-white px-3 py-2.5
          text-sm text-slate-800
          focus:border-indigo-500"
      >
        {strategies.map(([key, config]) => (
          <option key={key} value={key}>
            {config.label}
          </option>
        ))}
      </select>

      <p className="mt-2 text-xs text-slate-500">
        {themeStrategies[strategy].description}
      </p>

      <div className="mt-4 flex gap-1.5">
        {[
          darkPalette.background,
          darkPalette.surface,
          darkPalette.primaryButton,
          darkPalette.title,
          darkPalette.mutedText,
          darkPalette.errorText,
          darkPalette.successText,
        ].map((color, index) => (
          <div
            key={index}
            title={color}
            className="h-7 flex-1 rounded-md
              border border-slate-300"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Target text contrast:{' '}
        {themeStrategies[strategy].minimumContrast}:1
      </p>

    </div>
  )
}
