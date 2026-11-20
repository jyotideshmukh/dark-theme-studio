
import {
  Moon,
  Sun,
  RotateCcw,
  Columns2,
} from 'lucide-react'

import PaletteEditor from './components/palette/PaletteEditor'
//import ThemePreview from './components/preview/ThemePreview'

import { useThemeStore } from './store/themeStore'
import ExportDialog from './components/export/ExportDialog'

import { useState } from 'react'

import ComprehensivePreview from
  './components/preview/ComprehensivePreview'

import AccessibilityDashboard from
  './components/accessibility/AccessibilityDashboard'

import type { PreviewSection } from
  './components/preview/ComprehensivePreview'

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
   const [previewSection, setPreviewSection] =
  useState<PreviewSection>('all')

const [workspaceTab, setWorkspaceTab] =
  useState<'preview' | 'accessibility'>(
    'preview',
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

        
<section className="min-w-0 bg-slate-100 p-5">

  {/* Workspace tabs */}

  <div className="mb-5 flex gap-2
    border-b border-slate-200">

    <button
      type="button"
      aria-pressed={
        workspaceTab === 'preview'
      }
      onClick={() =>
        setWorkspaceTab('preview')
      }
      className={`px-4 py-3 text-sm
        font-medium cursor-pointer ${
          workspaceTab === 'preview'
            ? 'border-b-2 border-indigo-600 text-indigo-600'
            : 'text-slate-600'
        }`}
    >

      Live Preview

    </button>

    <button
      type="button"
      aria-pressed={
        workspaceTab === 'accessibility'
      }
      onClick={() =>
        setWorkspaceTab('accessibility')
      }
      className={`px-4 py-3 text-sm
        font-medium cursor-pointer ${
          workspaceTab === 'accessibility'
            ? 'border-b-2 border-indigo-600 text-indigo-600'
            : 'text-slate-600'
        }`}
    >

      Accessibility

    </button>

  </div>

  {workspaceTab === 'preview' && (

    <>
       
<div className="mb-4 flex flex-wrap items-center
  justify-end gap-2">

  <div className="inline-flex rounded-lg
    border border-slate-200 bg-white p-1">

    <button
      type="button"
      aria-pressed={previewMode === 'light'}
      onClick={() => setPreviewMode('light')}
      className={`flex items-center gap-2
        rounded-md px-3 py-2 text-sm
        cursor-pointer ${
          previewMode === 'light'
            ? 'bg-indigo-600 text-white'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
    >
      <Sun size={16} />
      Light
    </button>

    <button
      type="button"
      aria-pressed={previewMode === 'dark'}
      onClick={() => setPreviewMode('dark')}
      className={`flex items-center gap-2
        rounded-md px-3 py-2 text-sm
        cursor-pointer ${
          previewMode === 'dark'
            ? 'bg-indigo-600 text-white'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
    >
      <Moon size={16} />
      Dark
    </button>

    <button
      type="button"
      aria-pressed={previewMode === 'comparison'}
      onClick={() => setPreviewMode('comparison')}
      className={`flex items-center gap-2
        rounded-md px-3 py-2 text-sm
        cursor-pointer ${
          previewMode === 'comparison'
            ? 'bg-indigo-600 text-white'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
    >
      <Columns2 size={16} />
      Compare
    </button>

  </div>

</div>

      <div className="mb-4 flex
        flex-wrap items-center
        justify-between gap-3">

        <div>

          <h2 className="text-xl font-semibold
            text-slate-900">

            Component Preview

          </h2>

          <p className="text-sm text-slate-500">

            Compare your light and dark themes.

          </p>

        </div>

        <select
          aria-label="Select preview component"
          value={previewSection}
          onChange={(event) =>
            setPreviewSection(
              event.target.value as PreviewSection,
            )
          }
          className="rounded-lg border
            border-slate-300 bg-white
            px-3 py-2 text-sm"
        >

          <option value="all">
            All components
          </option>

          <option value="dashboard">
            Dashboard
          </option>

          <option value="typography">
            Typography
          </option>

          <option value="buttons">
            Buttons
          </option>

          <option value="forms">
            Forms
          </option>

          <option value="alerts">
            Alerts
          </option>

          <option value="table">
            Data table
          </option>

        </select>

      </div>

      <div className={`grid gap-4 ${
        previewMode === 'comparison'
          ? 'grid-cols-1 xl:grid-cols-2'
          : 'grid-cols-1'
      }`}>

        {previewMode !== 'dark' && (

          <ComprehensivePreview
            palette={lightPalette}
            mode="light"
            section={previewSection}
          />

        )}

        {previewMode !== 'light' && (

          <ComprehensivePreview
            palette={darkPalette}
            mode="dark"
            section={previewSection}
          />

        )}

      </div>

    </>

  )}

  {workspaceTab === 'accessibility' && (

    <AccessibilityDashboard />

  )}

</section>

      </main>

    </div>
  )
}

export default App
