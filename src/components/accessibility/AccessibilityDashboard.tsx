
import { useMemo, useState } from 'react'

import {
  ShieldCheck,
  CircleCheck,
  CircleX,
  WandSparkles,
  Download,
  Lock,
} from 'lucide-react'

import {
  useThemeStore,
} from '../../store/themeStore'

import {
  auditAccessibility,
  summarizeAccessibility,
} from '../../engine/accessibilityEngine'

import {
  downloadTextFile,
} from '../../utils/downloadUtils'

import type {
  AccessibilityFixResult,
} from '../../engine/accessibilityEngine'

export default function AccessibilityDashboard() {

  const [mode, setMode] =
    useState<'light' | 'dark'>('dark')

  const [onlyFailed, setOnlyFailed] =
    useState(false)

  const [category, setCategory] =
    useState('all')

  const [fixResult, setFixResult] =
    useState<AccessibilityFixResult | null>(
      null,
    )

  const lightPalette = useThemeStore(
    (state) => state.lightPalette,
  )

  const darkPalette = useThemeStore(
    (state) => state.darkPalette,
  )

  const overrides = useThemeStore(
    (state) => state.darkOverrides,
  )

  const fixDarkAccessibility = useThemeStore(
    (state) => state.fixDarkAccessibility,
  )

  const palette =
    mode === 'light'
      ? lightPalette
      : darkPalette

  const results = useMemo(
    () => auditAccessibility(palette),
    [palette],
  )

  const summary = useMemo(
    () => summarizeAccessibility(results),
    [results],
  )

  const categories = [
    ...new Set(
      results.map((r) => r.category),
    ),
  ]

  const filteredResults = results.filter(
    (result) => {

      const matchesCategory =
        category === 'all' ||
        result.category === category

      const matchesStatus =
        !onlyFailed || !result.passes

      return matchesCategory &&
        matchesStatus
    },
  )

  const currentFixResult =
    mode === 'dark' &&
    fixResult &&
    Object.entries(fixResult.palette)
      .every(([key, value]) =>
        darkPalette[
          key as keyof typeof darkPalette
        ] === value,
      )
      ? fixResult
      : null

  function handleAutoFix() {

    const result =
      fixDarkAccessibility()

    setFixResult(result)
  }

  function downloadReport() {

    const report = {
      generator: 'Dark Theme Studio',

      standard:
        'WCAG 2.2 AA color contrast checks',

      mode,

      generatedAt:
        new Date().toISOString(),

      summary,

      results,

      limitation:
        'Color contrast checks only. ' +
        'Not a full WCAG compliance audit.',
    }

    downloadTextFile(
      JSON.stringify(report, null, 2),
      `accessibility-${mode}.json`,
      'application/json',
    )
  }

  return (

    <section className="rounded-xl border
      border-slate-200 bg-white p-5">

      <div className="flex flex-wrap
        items-center justify-between gap-3">

        <div className="flex items-center gap-3">

          <ShieldCheck
            size={25}
            className="text-indigo-600"
          />

          <div>

            <h2 className="text-lg
              font-semibold text-slate-900">

              Accessibility Dashboard

            </h2>

            <p className="text-sm text-slate-500">
              WCAG 2.2 AA color contrast checks
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={downloadReport}
          className="flex items-center gap-2
            rounded-lg border border-slate-300
            px-3 py-2 text-sm cursor-pointer"
        >

          <Download size={16} />

          Report

        </button>

      </div>

      {/* Mode selector */}

      <div className="my-5 flex rounded-lg
        bg-slate-100 p-1">

        {(['light', 'dark'] as const)
          .map((item) => (

            <button
              key={item}
              type="button"
              aria-pressed={mode === item}
              onClick={() => setMode(item)}
              className={`flex-1 rounded-md
                px-3 py-2 text-sm capitalize
                cursor-pointer ${
                  mode === item
                    ? 'bg-white text-indigo-600 shadow'
                    : 'text-slate-600'
                }`}
            >

              {item} mode

            </button>

          ))}

      </div>

      {/* Summary */}

      <div className="grid grid-cols-2
        gap-3 sm:grid-cols-4">

        {[
          {
            label: 'Total checks',
            value: summary.total,
            color: 'text-slate-900',
          },
          {
            label: 'Passed',
            value: summary.passed,
            color: 'text-green-700',
          },
          {
            label: 'Failed',
            value: summary.failed,
            color: 'text-red-700',
          },
          {
            label: 'Pass rate',
            value: `${summary.percentage}%`,
            color: 'text-indigo-700',
          },
        ].map((item) => (

          <div
            key={item.label}
            className="rounded-lg border
              border-slate-200 p-4"
          >

            <p className="text-xs text-slate-500">
              {item.label}
            </p>

            <p className={
              `mt-1 text-2xl font-bold ${item.color}`
            }>

              {item.value}

            </p>

          </div>

        ))}

      </div>

      <div
        role="progressbar"
        aria-label="Contrast checks passed"
        aria-valuenow={summary.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-4 h-2 overflow-hidden
          rounded-full bg-slate-200"
      >

        <div
          className="h-full rounded-full
            bg-green-600 transition-all"
          style={{
            width: `${summary.percentage}%`,
          }}
        />

      </div>

      {/* Filters and correction */}

      <div className="my-5 flex flex-wrap
        items-center gap-3">

        <select
          aria-label="Filter contrast category"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
          className="rounded-md border
            border-slate-300 px-3 py-2 text-sm"
        >

          <option value="all">
            All categories
          </option>

          {categories.map((item) => (

            <option key={item} value={item}>
              {item}
            </option>

          ))}

        </select>

        <label className="flex items-center
          gap-2 text-sm text-slate-600">

          <input
            type="checkbox"
            checked={onlyFailed}
            onChange={(event) =>
              setOnlyFailed(
                event.target.checked,
              )
            }
            className="accent-indigo-600"
          />

          Failed only

        </label>

        <button
          type="button"
          disabled={
            mode === 'light' ||
            summary.failed === 0
          }
          onClick={handleAutoFix}
          className="ml-auto flex items-center
            gap-2 rounded-lg bg-indigo-600
            px-3 py-2 text-sm text-white
            cursor-pointer disabled:opacity-40
            disabled:cursor-not-allowed"
        >

          <WandSparkles size={16} />

          Fix dark contrast

        </button>

      </div>

      {mode === 'light' && (

        <p className="mb-4 text-xs
          text-slate-500">

          Your original light palette will
          not be modified automatically.

        </p>

      )}

      {currentFixResult && (

        <div
          role="status"
          className="mb-4 rounded-lg
            border border-slate-200
            bg-slate-50 p-3 text-sm"
        >

          <p>
            Pass rate:
            {' '}
            {currentFixResult.before.percentage}%
            {' → '}
            {currentFixResult.after.percentage}%
          </p>

          <p>
            {Object.keys(
              currentFixResult.changes,
            ).length} colors corrected.
          </p>

          <p>
            {currentFixResult.unresolved.length}
            {' unresolved contrast checks.'}
          </p>

          <p className="mt-1 text-xs
            text-slate-500">

            Locked colors were preserved.

          </p>

        </div>

      )}

      {/* Results */}

      <div className="overflow-x-auto">

        <table className="w-full text-left
          text-sm">

          <thead className="bg-slate-50
            text-xs text-slate-600">

            <tr>

              <th scope="col" className="p-3">
                Element
              </th>

              <th scope="col" className="p-3">
                Foreground
              </th>

              <th scope="col" className="p-3">
                Background
              </th>

              <th scope="col" className="p-3">
                Contrast
              </th>

              <th scope="col" className="p-3">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredResults.map((result) => (

              <tr
                key={result.id}
                className="border-b
                  border-slate-100"
              >

                <td className="p-3">

                  <p className="font-medium
                    text-slate-800">

                    {result.label}

                  </p>

                  <p className="text-xs
                    text-slate-500">

                    {result.category}

                  </p>

                </td>

                <td className="p-3">

                  <div className="flex
                    items-center gap-2">

                    <span
                      className="h-6 w-6
                        shrink-0 rounded
                        border border-slate-300"
                      style={{
                        background:
                          result.foregroundColor,
                      }}
                    />

                    <span className="font-mono
                      text-xs">

                      {result.foregroundColor}

                    </span>

                    {mode === 'dark' &&
                      result.foreground in overrides &&
                      <Lock
                        size={13}
                        aria-label="Locked color"
                        className="text-indigo-600"
                      />
                    }

                  </div>

                  <p className="mt-1 text-xs
                    text-slate-500 break-all">

                    {result.foreground}

                  </p>

                </td>

                <td className="p-3">

                  <div className="flex
                    items-center gap-2">

                    <span
                      className="h-6 w-6
                        shrink-0 rounded
                        border border-slate-300"
                      style={{
                        background:
                          result.backgroundColor,
                      }}
                    />

                    <span className="font-mono
                      text-xs">

                      {result.backgroundColor}

                    </span>

                  </div>

                  <p className="mt-1 text-xs
                    text-slate-500 break-all">

                    {result.background}

                  </p>

                </td>

                <td className="p-3">

                  <p className="font-semibold">

                    {result.ratio.toFixed(
                      result.passes ? 2 : 3,
                    )}:1

                  </p>

                  <p className="text-xs
                    text-slate-500">

                    Min {result.minimumRatio}:1

                  </p>

                </td>

                <td className="p-3">

                  {result.passes ? (

                    <span className="flex
                      items-center gap-1
                      text-green-700">

                      <CircleCheck size={16} />

                      Pass

                    </span>

                  ) : (

                    <span className="flex
                      items-center gap-1
                      text-red-700">

                      <CircleX size={16} />

                      Fail

                    </span>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {filteredResults.length === 0 && (

        <p className="py-6 text-center
          text-sm text-slate-500">

          No matching contrast checks.

        </p>

      )}

      <p className="mt-4 text-xs
        text-slate-500">

        Results cover configured color pairs.
        They do not certify complete
        WCAG compliance.

      </p>

    </section>
  )
}
