
import { useState } from 'react'

import {
  ChevronDown,
  ChevronRight,
  Lock,
  LockOpen,
} from 'lucide-react'

import ColorInput from './ColorInput'

import {
  useThemeStore,
} from '../../store/themeStore'

import type {
  ColorCategory,
} from '../../types/theme.types'

interface DarkColorGroupProps {
  category: ColorCategory
  defaultOpen?: boolean
}

export default function DarkColorGroup({
  category,
  defaultOpen = false,
}: DarkColorGroupProps) {

  const [isOpen, setIsOpen] = useState(
    defaultOpen,
  )

  const palette = useThemeStore(
    (state) => state.darkPalette,
  )

  const overrides = useThemeStore(
    (state) => state.darkOverrides,
  )

  const setDarkColor = useThemeStore(
    (state) => state.setDarkColor,
  )

  const toggleDarkLock = useThemeStore(
    (state) => state.toggleDarkLock,
  )

  return (
    <div className="rounded-lg border
      border-slate-200 overflow-hidden">

      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center
          justify-between bg-slate-50 px-3 py-3
          hover:bg-slate-100 cursor-pointer"
      >

        <span className="flex items-center gap-2
          text-sm font-semibold text-slate-700">

          {isOpen
            ? <ChevronDown size={16} />
            : <ChevronRight size={16} />
          }

          {category.label}

        </span>

        <span className="text-xs text-slate-500">
          {category.tokens.length}
        </span>

      </button>

      {isOpen && (
        <div className="p-3">

          {category.tokens.map((token) => {
            const locked = token.key in overrides

            return (
              <div
                key={token.key}
                className="flex items-start gap-2"
              >

                <div className="flex-1 min-w-0">

                  <ColorInput
                    label={token.label}
                    value={palette[token.key]}
                    onChange={(value) =>
                      setDarkColor(
                        token.key,
                        value,
                      )
                    }
                  />

                </div>

                <button
                  type="button"
                  aria-label={
                    locked
                      ? `Unlock ${token.label}`
                      : `Lock ${token.label}`
                  }
                  aria-pressed={locked}
                  title={
                    locked
                      ? 'Restore automatic color'
                      : 'Preserve this color'
                  }
                  onClick={() =>
                    toggleDarkLock(token.key)
                  }
                  className={`mt-1.5 p-1
                    rounded cursor-pointer
                    ${
                      locked
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-slate-400 hover:text-indigo-600'
                    }`}
                >

                  {locked
                    ? <Lock size={15} />
                    : <LockOpen size={15} />
                  }

                </button>

              </div>
            )
          })}

        </div>
      )}

    </div>
  )
}
