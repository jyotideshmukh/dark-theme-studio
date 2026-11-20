
import {
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  Download,
  Copy,
  Check,
  X,
  FileCode,
} from 'lucide-react'

import {
  useThemeStore,
} from '../../store/themeStore'

import {
  generateCss,
  getCssFilename,
} from '../../exporters/cssExporter'

import {
  generateThemeJson,
} from '../../exporters/jsonExporter'

import {
  downloadTextFile,
} from '../../utils/downloadUtils'

import type {
  CssExportMode,
} from '../../types/theme.types'

type ExportFormat = 'css' | 'json'

export default function ExportDialog() {

  const dialogRef =
    useRef<HTMLDialogElement>(null)

  const [format, setFormat] =
    useState<ExportFormat>('css')

  const [mode, setMode] =
    useState<CssExportMode>('combined')

  const [includeComponents, setIncludeComponents] =
    useState(true)

  const [includeSystemPreference, setIncludeSystemPreference] =
    useState(false)

  const [copiedContent, setCopiedContent] =
    useState<string | null>(null)

  const [message, setMessage] = useState('')

  const lightPalette = useThemeStore(
    (state) => state.lightPalette,
  )

  const darkPalette = useThemeStore(
    (state) => state.darkPalette,
  )

  const strategy = useThemeStore(
    (state) => state.strategy,
  )

  const darkOverrides = useThemeStore(
    (state) => state.darkOverrides,
  )

  const content = useMemo(() => {

    if (format === 'json') {

      return generateThemeJson(
        lightPalette,
        darkPalette,
        strategy,
        darkOverrides,
      )

    }

    return generateCss(
      lightPalette,

      darkPalette,

      {
        mode,

        includeComponents,

        includeSystemPreference:
          mode === 'combined'
          && includeSystemPreference,
      },
    )

  }, [
    format,
    mode,
    includeComponents,
    includeSystemPreference,
    lightPalette,
    darkPalette,
    strategy,
    darkOverrides,
  ])

  const filename =
    format === 'json'
      ? 'theme.json'
      : getCssFilename(mode)

  const sizeInBytes =
    new Blob([content]).size

  const copied = copiedContent === content

  function openDialog() {
    setCopiedContent(null)
    setMessage('')
    dialogRef.current?.showModal()
  }

  function closeDialog() {
    dialogRef.current?.close()
  }

  function download() {

    try {
      downloadTextFile(
        content,
        filename,
        format === 'json'
          ? 'application/json'
          : 'text/css',
      )

      setMessage('Download requested.')

    } catch {
      setMessage('Unable to download file.')
    }
  }

  async function copyCode() {

    try {
      await navigator.clipboard.writeText(content)

      setCopiedContent(content)

      setMessage('Code copied to clipboard.')

    } catch {
      setMessage('Unable to access clipboard.')
    }
  }

  const exportModes = [
    {
      value: 'combined',
      label: 'Combined light and dark',
      filename: 'theme.css',
    },
    {
      value: 'light',
      label: 'Light theme only',
      filename: 'light-theme.css',
    },
    {
      value: 'dark',
      label: 'Dark theme only',
      filename: 'dark-theme.css',
    },
  ] as const

  return (
    <>

      {/* Header button */}

      <button
        type="button"
        onClick={openDialog}
        className="flex items-center gap-2
          rounded-lg bg-indigo-600 px-4 py-2
          text-white hover:bg-indigo-700
          cursor-pointer"
      >

        <Download size={17} />

        Download CSS

      </button>

      {/* Export modal */}

      <dialog
        ref={dialogRef}
        aria-labelledby="export-dialog-title"
        className="m-auto w-[calc(100%-2rem)]
          max-w-2xl max-h-[90vh]
          overflow-y-auto rounded-2xl
          bg-white p-0 text-slate-900
          shadow-2xl backdrop:bg-black/50"
      >

        <div className="p-6">

          {/* Title */}

          <div className="flex items-center
            justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="rounded-lg
                bg-indigo-50 p-3 text-indigo-600">

                <FileCode size={23} />

              </div>

              <div>

                <h2
                  id="export-dialog-title"
                  className="text-xl font-semibold"
                >
                  Export Theme
                </h2>

                <p className="text-sm text-slate-500">
                  Download your complete color palette
                </p>

              </div>

            </div>

            <button
              type="button"
              aria-label="Close export dialog"
              onClick={closeDialog}
              className="rounded-md p-2
                text-slate-400 hover:bg-slate-100"
            >

              <X size={20} />

            </button>

          </div>

          {/* Format tabs */}

          <div className="mt-6 flex gap-1
            rounded-lg bg-slate-100 p-1">

            {(['css', 'json'] as const).map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={format === item}
                  onClick={() => {
                    setFormat(item)
                    setMessage('')
                  }}
                  className={`flex-1 rounded-md
                    px-4 py-2 text-sm
                    ${
                      format === item
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-600'
                    }`}
                >

                  {item.toUpperCase()} Export

                </button>
              ),
            )}

          </div>

          {/* CSS export options */}

          {format === 'css' && (

            <div className="mt-5">

              <fieldset className="space-y-3">

                <legend className="mb-3
                  text-sm font-semibold">
                  Export Type
                </legend>

                {exportModes.map((item) => (
                  <label
                    key={item.value}
                    className="flex cursor-pointer
                      items-center gap-3 rounded-lg
                      border border-slate-200 p-3"
                  >

                    <input
                      type="radio"
                      name="css-export-mode"
                      value={item.value}
                      checked={mode === item.value}
                      onChange={() => {
                        setMode(item.value)
                        setMessage('')
                      }}
                      className="accent-indigo-600"
                    />

                    <span>

                      <span className="block
                        text-sm font-medium">

                        {item.label}

                      </span>

                      <span className="text-xs
                        text-slate-500">

                        {item.filename}

                      </span>

                    </span>

                  </label>
                ))}

              </fieldset>

              <div className="mt-5 space-y-3">

                <label className="flex items-center
                  gap-3 text-sm cursor-pointer">

                  <input
                    type="checkbox"
                    checked={includeComponents}
                    onChange={(event) => {
                      setIncludeComponents(
                        event.target.checked,
                      )
                      setMessage('')
                    }}
                    className="accent-indigo-600"
                  />

                  Include sample component styles

                </label>

                <label className="flex items-center
                  gap-3 text-sm cursor-pointer">

                  <input
                    type="checkbox"
                    checked={
                      mode === 'combined'
                      && includeSystemPreference
                    }
                    disabled={mode !== 'combined'}
                    onChange={(event) => {
                      setIncludeSystemPreference(
                        event.target.checked,
                      )
                      setMessage('')
                    }}
                    className="accent-indigo-600"
                  />

                  Support system dark-mode preference

                </label>

              </div>

            </div>

          )}

          {/* Code preview */}

          <div className="mt-6">

            <div className="mb-2 flex items-center
              justify-between gap-2">

              <h3 className="text-sm font-semibold">

                Generated Code

              </h3>

              <span className="text-xs text-slate-500">

                {filename}
                {' · '}
                {(sizeInBytes / 1024).toFixed(1)}
                {' KB'}

              </span>

            </div>

            <pre
              tabIndex={0}
              aria-label="Generated code preview"
              className="max-h-64 overflow-auto
                rounded-xl bg-slate-950 p-4
                text-xs leading-relaxed text-cyan-200"
            >

              <code>{content}</code>

            </pre>

          </div>

          {message && (
            <p
              role="status"
              className="mt-3 text-sm text-slate-600"
            >
              {message}
            </p>
          )}

          {/* Export actions */}

          <div className="mt-6 flex flex-wrap
            justify-end gap-3">

            <button
              type="button"
              onClick={copyCode}
              className="flex items-center gap-2
                rounded-lg border border-slate-300
                px-4 py-2 text-sm text-slate-700
                hover:bg-slate-50"
            >

              {copied
                ? <Check size={16} />
                : <Copy size={16} />
              }

              {copied ? 'Copied' : 'Copy Code'}

            </button>

            <button
              type="button"
              onClick={download}
              className="flex items-center gap-2
                rounded-lg bg-indigo-600 px-4 py-2
                text-sm text-white
                hover:bg-indigo-700"
            >

              <Download size={16} />

              Download {filename}

            </button>

          </div>

        </div>

      </dialog>

    </>
  )
}
