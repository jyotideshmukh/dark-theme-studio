
import {
  Moon,
  Sun,
  RotateCcw,
  Columns2,
} from 'lucide-react'

import PaletteEditor from './components/palette/PaletteEditor'
import ThemePreview from './components/preview/ThemePreview'

import { useThemeStore } from './store/themeStore'
import ExportDialog from './components/export/ExportDialog'

function App() {
  const lightPalette = useThemeStore(
    (state) => state.lightPalette,
  )

  const darkPalette = useThemeStore(
    (state) => state.darkPalette,
  )

  const previewMode = useThemeStore(
    (state) => state.previewMode,
  )

  const setPreviewMode = useThemeStore(
    (state) => state.setPreviewMode,
  )

  const resetPalette = useThemeStore(
    (state) => state.resetPalette,
  )

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}

      <header className="sticky top-0 z-30 bg-white
        border-b border-slate-200 px-6 py-4">

        <div className="flex flex-wrap items-center
          justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="bg-indigo-600 text-white
              p-3 rounded-xl">

              <Moon size={24} />

            </div>

            <div>

              <h1 className="text-xl font-bold text-slate-900">
                Dark Theme Studio
              </h1>

              <p className="text-sm text-slate-500">
                Light to dark color palette generator
              </p>

            </div>

          </div>

          <div className="flex gap-3">

            <button
              type="button"
              onClick={resetPalette}
              className="flex items-center gap-2 border
                border-slate-300 rounded-lg px-4 py-2
                text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw size={16} />
              Reset
            </button>

            <ExportDialog />

          </div>

        </div>

      </header>

      {/* Main Layout */}

      <main className="grid grid-cols-1
  lg:grid-cols-[400px_minmax(0,1fr)]">

        <aside className="bg-white border-r border-slate-200
          p-4 lg:h-[calc(100vh-85px)]
          lg:sticky lg:top-[85px] lg:overflow-y-auto">

          <PaletteEditor />

        </aside>

        <section className="p-5 min-w-0">

          <div className="flex flex-wrap items-center
            justify-between gap-4 mb-6">

            <div>

              <h2 className="text-xl font-semibold text-slate-900">
                Live Preview
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Compare your light and dark color palettes.
              </p>

            </div>

            {/* Preview Mode Controls */}

            <div className="flex gap-1 rounded-lg
              bg-slate-200 p-1">

              <button
                type="button"
                aria-pressed={previewMode === 'light'}
                onClick={() => setPreviewMode('light')}
                className={`flex items-center gap-2 px-3 py-2
                  rounded-md text-sm
                  ${previewMode === 'light'
                    ? 'bg-white shadow-sm'
                    : 'text-slate-600'
                  }`}
              >
                <Sun size={16} />
                Light
              </button>

              <button
                type="button"
                aria-pressed={previewMode === 'dark'}
                onClick={() => setPreviewMode('dark')}
                className={`flex items-center gap-2 px-3 py-2
                  rounded-md text-sm
                  ${previewMode === 'dark'
                    ? 'bg-white shadow-sm'
                    : 'text-slate-600'
                  }`}
              >
                <Moon size={16} />
                Dark
              </button>

              <button
                type="button"
                aria-pressed={previewMode === 'comparison'}
                onClick={() => setPreviewMode('comparison')}
                className={`flex items-center gap-2 px-3 py-2
                  rounded-md text-sm
                  ${previewMode === 'comparison'
                    ? 'bg-white shadow-sm'
                    : 'text-slate-600'
                  }`}
              >
                <Columns2 size={16} />
                Compare
              </button>

            </div>

          </div>

          {/* Preview Panels */}

          <div className={`grid gap-4 ${
  previewMode === 'comparison'
    ? 'grid-cols-1 lg:grid-cols-2'
    : 'grid-cols-1'
}`}>

  {previewMode !== 'dark' && (
    <ThemePreview
      mode="light"
      palette={lightPalette}
    />
  )}

  {previewMode !== 'light' && (
    <ThemePreview
      mode="dark"
      palette={darkPalette}
    />
  )}

</div>

        </section>

      </main>

    </div>
  )
}

export default App
