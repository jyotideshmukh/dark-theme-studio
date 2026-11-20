
import { useId, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Check, Copy } from 'lucide-react'

import {
  isValidHex,
  normalizeHex,
} from '../../utils/colorUtils'

interface ColorInputProps {
  label: string
  value: string
  onChange: (value: string) => void
}

interface DraftState {
  source: string
  text: string
}

export default function ColorInput({
  label,
  value,
  onChange,
}: ColorInputProps) {

  const [showPicker, setShowPicker] = useState(false)

  const [draftState, setDraftState] =
    useState<DraftState>({
      source: value,
      text: value,
    })

  const [copiedColor, setCopiedColor] =
    useState<string | null>(null)

  const [copyErrorColor, setCopyErrorColor] =
    useState<string | null>(null)

  const inputId = useId()

  // Synchronize local draft when the external color changes.
  // This also handles resetting the palette.
  if (draftState.source !== value) {
    setDraftState({
      source: value,
      text: value,
    })

    setCopiedColor(null)
    setCopyErrorColor(null)
  }

  const draft = draftState.source === value
    ? draftState.text
    : value

  const copied = copiedColor === value

  const copyError = copyErrorColor === value

  const invalid = !isValidHex(normalizeHex(draft))

  function handleInputChange(input: string) {

    const normalized = normalizeHex(input)

    setCopiedColor(null)
    setCopyErrorColor(null)

    if (isValidHex(normalized)) {

      setDraftState({
        source: normalized,
        text: normalized,
      })

      onChange(normalized)

    } else {

      // Allow incomplete HEX values while typing.
      // Do not update the actual color palette.

      setDraftState({
        source: value,
        text: input,
      })
    }
  }

  function handlePickerChange(color: string) {
    handleInputChange(color)
  }

  async function copyColor() {
    try {
      await navigator.clipboard.writeText(value)

      setCopiedColor(value)
      setCopyErrorColor(null)

    } catch {

      setCopiedColor(null)
      setCopyErrorColor(value)
    }
  }

  return (
    <div className="relative mb-3">

      <div className="flex items-center gap-2">

        <label
          htmlFor={inputId}
          className="flex-1 text-sm text-slate-700"
        >
          {label}
        </label>

        <button
          type="button"
          aria-label={`Choose ${label} color`}
          aria-expanded={showPicker}
          onClick={() =>
            setShowPicker((previous) => !previous)
          }
          className="w-7 h-7 shrink-0 rounded-md
            border border-slate-300 cursor-pointer"
          style={{ backgroundColor: value }}
        />

        <input
          id={inputId}
          type="text"
          value={draft}
          maxLength={7}
          aria-invalid={invalid}
          onChange={(event) =>
            handleInputChange(event.target.value)
          }
          className={`w-24 rounded-md border
            px-2 py-1.5 text-xs font-mono outline-none
            ${
              invalid
                ? 'border-red-500'
                : 'border-slate-300 focus:border-indigo-500'
            }`}
        />

        <button
          type="button"
          aria-label={`Copy ${label} color`}
          onClick={copyColor}
          className="text-slate-400
            hover:text-indigo-600 cursor-pointer"
        >
          {copied ? (
            <Check
              size={15}
              className="text-green-600"
            />
          ) : (
            <Copy size={15} />
          )}
        </button>

      </div>

      {invalid && (
        <p className="text-xs text-red-600
          mt-1 text-right">
          Invalid HEX color
        </p>
      )}

      {copyError && (
        <p className="text-xs text-red-600
          mt-1 text-right">
          Unable to copy color
        </p>
      )}

      {showPicker && (
        <div className="relative z-20 mt-2
          rounded-xl border border-slate-200
          bg-white p-3 shadow-lg">

          <HexColorPicker
            color={value}
            onChange={handlePickerChange}
            style={{ width: '100%' }}
          />

          <button
            type="button"
            onClick={() => setShowPicker(false)}
            className="mt-3 w-full rounded-md
              bg-indigo-600 text-white py-2
              text-sm cursor-pointer"
          >
            Done
          </button>

        </div>
      )}

    </div>
  )
}
