
import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

import ColorInput from './ColorInput'

import { useThemeStore } from '../../store/themeStore'

import type { ColorCategory } from '../../types/theme.types'

interface ColorGroupProps {
  category: ColorCategory
  defaultOpen?: boolean
}

export default function ColorGroup({
  category,
  defaultOpen = false,
}: ColorGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const palette = useThemeStore((state) => state.lightPalette)

  const setLightColor = useThemeStore(
    (state) => state.setLightColor,
  )

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">

      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full
          px-3 py-3 bg-slate-50 hover:bg-slate-100
          cursor-pointer"
      >
        <div className="flex items-center gap-2 text-sm
          font-semibold text-slate-700">

          {isOpen ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}

          {category.label}
        </div>

        <span className="text-xs text-slate-500">
          {category.tokens.length}
        </span>

      </button>

      {isOpen && (
        <div className="p-3">

          {category.tokens.map((token) => (
            <ColorInput
              key={token.key}
              label={token.label}
              value={palette[token.key]}
              onChange={(value) =>
                setLightColor(token.key, value)
              }
            />
          ))}

        </div>
      )}

    </div>
  )
}
