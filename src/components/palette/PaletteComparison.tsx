
import { useState } from 'react'

import {
  Search,
  Copy,
  Check,
  Lock,
  LockOpen,
} from 'lucide-react'

import {
  colorCategories,
} from '../../config/tokenDefinitions'

import {
  useThemeStore,
} from '../../store/themeStore'

import type {
  ColorToken,
} from '../../types/theme.types'

export default function PaletteComparison() {

  const [search, setSearch] = useState('')

  const [copiedKey, setCopiedKey] =
    useState<string | null>(null)

  const [copyError, setCopyError] =
    useState(false)

  const lightPalette = useThemeStore(
    (state) => state.lightPalette,
  )

  const darkPalette = useThemeStore(
    (state) => state.darkPalette,
  )

  const overrides = useThemeStore(
    (state) => state.darkOverrides,
  )

  const toggleDarkLock = useThemeStore(
    (state) => state.toggleDarkLock,
  )

  const query = search.trim().toLowerCase()

  const filteredCategories = colorCategories
    .map((category) => ({
      ...category,

      tokens: category.tokens.filter(
        (token) =>
          token.label.toLowerCase().includes(query)
          || token.key.toLowerCase().includes(query)
          || category.label.toLowerCase().includes(query)
          || lightPalette[token.key]
            .toLowerCase().includes(query)
          || darkPalette[token.key]
            .toLowerCase().includes(query),
      ),
    }))
    .filter(
      (category) => category.tokens.length > 0,
    )

  async function copyColor(
    token: ColorToken,
    mode: 'light' | 'dark',
  ) {
    const color =
      mode === 'light'
        ? lightPalette[token]
        : darkPalette[token]

    try {
      await navigator.clipboard.writeText(color)

      setCopiedKey(`${token}-${mode}-${color}`)
      setCopyError(false)
    } catch {
      setCopyError(true)
      setCopiedKey(null)
    }
  }

  return (
    <div>

      <div className="relative mb-4">

        <Search
          size={16}
          className="absolute left-3 top-3
            text-slate-400"
        />

        <input
          type="search"
          aria-label="Search color tokens"
          placeholder="Search color tokens..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          className="w-full rounded-lg border
            border-slate-300 py-2.5 pl-9 pr-3
            text-sm outline-none
            focus:border-indigo-500"
        />

      </div>

      {copyError && (
        <p role="alert" className="mb-3
          text-xs text-red-600">
          Unable to copy color.
        </p>
      )}

      {filteredCategories.length === 0 && (
        <p className="py-4 text-center
          text-sm text-slate-500">
          No matching color tokens.
        </p>
      )}

      <div className="space-y-4">

        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="rounded-lg border
              border-slate-200 overflow-hidden"
          >

            <h3 className="bg-slate-50 px-3 py-3
              text-sm font-semibold text-slate-700">

              {category.label}

            </h3>

            <div className="overflow-x-auto">

              <table className="w-full text-xs">

                <thead className="text-slate-500">

                  <tr>

                    <th scope="col" className="p-2 text-left">
                      Token
                    </th>

                    <th scope="col" className="p-2 text-left">
                      Light
                    </th>

                    <th scope="col" className="p-2 text-left">
                      Dark
                    </th>

                    <th scope="col" className="p-2">
                      Lock
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {category.tokens.map((token) => (
                    <tr
                      key={token.key}
                      className="border-t border-slate-100
                        hover:bg-slate-50"
                    >

                      <td className="p-2 text-slate-700">

                        {token.label}

                      </td>

                      {(['light', 'dark'] as const)
                        .map((mode) => {
                          const color =
                            mode === 'light'
                              ? lightPalette[token.key]
                              : darkPalette[token.key]

                          return (
                            <td
                              key={mode}
                              className="p-2"
                            >

                              <button
                                type="button"
                                title={`Copy ${color}`}
                                aria-label={
                                  `Copy ${mode} ${token.label}`
                                }
                                onClick={() =>
                                  copyColor(token.key, mode)
                                }
                                className="flex items-center
                                  gap-1.5 font-mono
                                  cursor-pointer"
                              >

                                <span
                                  className="w-4 h-4
                                    shrink-0 rounded
                                    border border-slate-300"
                                  style={{
                                    backgroundColor: color,
                                  }}
                                />

                                {color}

                                {copiedKey ===
                                  `${token.key}-${mode}-${color}`
                                  ? <Check size={12}
                                      className="text-green-600" />
                                  : <Copy size={12}
                                      className="text-slate-400" />
                                }

                              </button>

                            </td>
                          )
                        })}

                      <td className="p-2 text-center">

                        <button
                          type="button"
                          aria-label={`Toggle lock for ${token.label}`}
                          aria-pressed={token.key in overrides}
                          onClick={() =>
                            toggleDarkLock(token.key)
                          }
                          className="cursor-pointer"
                        >

                          {token.key in overrides
                            ? <Lock size={14}
                                className="text-indigo-600" />
                            : <LockOpen size={14}
                                className="text-slate-400" />
                          }

                        </button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>
        ))}

      </div>

    </div>
  )
}
