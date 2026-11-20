
import type { CSSProperties } from 'react'

import {
  Sun,
  Moon,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
} from 'lucide-react'

import type {
  ColorPalette,
  ThemeMode,
} from '../../types/theme.types'

import { toCssVariables } from '../../utils/colorUtils'

interface ThemePreviewProps {
  mode: ThemeMode
  palette: ColorPalette
}

export default function ThemePreview({
  mode,
  palette,
}: ThemePreviewProps) {
  const variables = toCssVariables(palette) as CSSProperties

  return (
    <div
      style={{
        ...variables,
        backgroundColor: palette.background,
        color: palette.text,
        borderColor: palette.border,
        colorScheme: mode,
      }}
      className="rounded-xl border p-5 min-w-0"
    >

      {/* Theme label */}

      <div
        className="flex items-center gap-2 mb-6 text-sm"
        style={{ color: palette.mutedText }}
      >
        {mode === 'light'
          ? <Sun size={18} />
          : <Moon size={18} />
        }

        {mode === 'light' ? 'Light Mode' : 'Dark Mode'}

      </div>

      {/* Typography */}

      <h1
        className="text-3xl font-bold"
        style={{ color: palette.title }}
      >
        Welcome back
      </h1>

      <p
        className="text-base mt-2"
        style={{ color: palette.subtitle }}
      >
        Manage your workspace and preferences.
      </p>

      <p
        className="text-sm mt-4 leading-relaxed"
        style={{ color: palette.text }}
      >
        This is an interactive preview of your color
        palette. Modify the colors using the editor
        to see the changes in real time.
      </p>

      <a
        href="#preview-documentation"
        onClick={(event) => event.preventDefault()}
        className="inline-block mt-3 text-sm underline
          text-[var(--color-link)]
          hover:text-[var(--color-link-hover)]
          active:text-[var(--color-link-active)]"
      >
        Read documentation
      </a>

      {/* Card */}

      <div
        className="mt-6 rounded-lg border p-4"
        style={{
          backgroundColor: palette.surface,
          borderColor: palette.border,
        }}
      >

        <h2
          className="text-lg font-semibold"
          style={{ color: palette.heading }}
        >
          Account Settings
        </h2>

        <p
          className="mt-1 text-sm"
          style={{ color: palette.mutedText }}
        >
          Update your personal information.
        </p>

        {/* Form Elements */}

        <div className="mt-5">

          <label className="block text-sm mb-2">
            Email address

            <input
              type="email"
              placeholder="name@example.com"
              className="mt-2 w-full rounded-md border px-3 py-2
                text-sm outline-none
                bg-[var(--color-input-background)]
                text-[var(--color-input-text)]
                border-[var(--color-input-border)]
                placeholder:text-[var(--color-input-placeholder)]
                focus:border-[var(--color-input-focus-border)]"
            />
          </label>

        </div>

        <div className="flex items-center gap-2 mt-4">

          <input
            type="checkbox"
            defaultChecked
            aria-label="Enable email notifications"
            style={{ accentColor: palette.checkbox }}
          />

          <span className="text-sm">
            Enable email notifications
          </span>

        </div>

        {/* Buttons */}

        <div className="flex flex-wrap gap-2 mt-5">

          <button
            type="button"
            className="rounded-md px-4 py-2 text-sm
              cursor-pointer
              bg-[var(--color-primary-button)]
              text-[var(--color-primary-button-text)]
              hover:bg-[var(--color-primary-button-hover)]
              active:bg-[var(--color-primary-button-active)]
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-[var(--color-focus-ring)]"
          >
            Save Changes
          </button>

          <button
            type="button"
            className="rounded-md px-4 py-2 text-sm
              bg-[var(--color-secondary-button)]
              text-[var(--color-secondary-button-text)]
              hover:bg-[var(--color-secondary-button-hover)]
              active:bg-[var(--color-secondary-button-active)]"
          >
            Cancel
          </button>

          <button
            type="button"
            className="rounded-md px-4 py-2 text-sm
              bg-[var(--color-danger-button)]
              text-[var(--color-danger-button-text)]
              hover:bg-[var(--color-danger-button-hover)]"
          >
            Delete
          </button>

          <button
            type="button"
            disabled
            className="rounded-md px-4 py-2 text-sm
              cursor-not-allowed
              bg-[var(--color-primary-button-disabled)]
              text-[var(--color-primary-button-disabled-text)]"
          >
            Disabled
          </button>

        </div>

      </div>

      {/* Status Messages */}

      <div className="space-y-3 mt-6">

        <div
          className="flex items-center gap-2 rounded-md border p-3 text-sm"
          style={{
            backgroundColor: palette.successBackground,
            borderColor: palette.successBorder,
            color: palette.successText,
          }}
        >
          <CheckCircle
            size={18}
            style={{ color: palette.successIcon }}
          />

          Changes saved successfully.
        </div>

        <div
          className="flex items-center gap-2 rounded-md border p-3 text-sm"
          style={{
            backgroundColor: palette.errorBackground,
            borderColor: palette.errorBorder,
            color: palette.errorText,
          }}
        >
          <AlertCircle
            size={18}
            style={{ color: palette.errorIcon }}
          />

          Unable to complete your request.
        </div>

        <div
          className="flex items-center gap-2 rounded-md border p-3 text-sm"
          style={{
            backgroundColor: palette.warningBackground,
            borderColor: palette.warningBorder,
            color: palette.warningText,
          }}
        >
          <AlertTriangle
            size={18}
            style={{ color: palette.warningIcon }}
          />

          Your subscription expires soon.
        </div>

        <div
          className="flex items-center gap-2 rounded-md border p-3 text-sm"
          style={{
            backgroundColor: palette.infoBackground,
            borderColor: palette.infoBorder,
            color: palette.infoText,
          }}
        >
          <Info
            size={18}
            style={{ color: palette.infoIcon }}
          />

          A new update is available.
        </div>

      </div>

    </div>
  )
}
