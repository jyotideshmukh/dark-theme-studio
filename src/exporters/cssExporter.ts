
import type {
  ColorPalette,
  ColorToken,
  CssExportOptions,
} from '../types/theme.types'

import {
  colorCategories,
} from '../config/tokenDefinitions'

import {
  isValidHex,
} from '../utils/colorUtils'

export function tokenToCssVariable(
  token: ColorToken,
): string {
  return `--color-${
    token.replace(
      /[A-Z]/g,
      (letter) => `-${letter.toLowerCase()}`,
    )
  }`
}

function generateVariables(
  palette: ColorPalette,
  indent = '  ',
): string {
  return colorCategories.map((category) => {

    const lines = category.tokens.map((token) => {
      const color = palette[token.key]

      if (!isValidHex(color)) {
        throw new Error(
          `Invalid CSS color for ${token.key}`,
        )
      }

      return `${indent}${tokenToCssVariable(
        token.key,
      )}: ${color};`
    })

    return [
      `${indent}/* ${category.label} */`,
      ...lines,
    ].join('\n')

  }).join('\n\n')
}

function generateThemeBlock(
  selector: string,
  palette: ColorPalette,
  mode: 'light' | 'dark',
): string {
  return [
    `${selector} {`,
    `  color-scheme: ${mode};`,
    '',
    generateVariables(palette),
    '}',
  ].join('\n')
}

function generateSystemPreference(
  darkPalette: ColorPalette,
): string {

  const darkBlock = generateThemeBlock(
    ':root:not([data-theme])',
    darkPalette,
    'dark',
  )

  return [
    '@media (prefers-color-scheme: dark) {',

    darkBlock
      .split('\n')
      .map((line) => `  ${line}`)
      .join('\n'),

    '}',
  ].join('\n')
}

export function generateComponentStyles(): string {
  return `
/* =====================================
   SAMPLE COMPONENT STYLES
   ===================================== */

body {
  background-color: var(--color-background);
  color: var(--color-text);
}

.theme-header {
  background-color: var(--color-header-background);
  color: var(--color-title);
  border-bottom: 1px solid var(--color-border);
}

.theme-sidebar {
  background-color: var(--color-sidebar-background);
  color: var(--color-text);
}

.theme-card {
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.theme-modal {
  background-color: var(--color-modal-background);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.theme-title {
  color: var(--color-title);
}

.theme-heading {
  color: var(--color-heading);
}

.theme-subtitle {
  color: var(--color-subtitle);
}

.theme-text {
  color: var(--color-text);
}

.theme-muted {
  color: var(--color-muted-text);
}

/* Links */

.theme-link {
  color: var(--color-link);
}

.theme-link:visited {
  color: var(--color-link-visited);
}

.theme-link:hover {
  color: var(--color-link-hover);
}

.theme-link:active {
  color: var(--color-link-active);
}

/* Primary button */

.btn-primary {
  background-color: var(--color-primary-button);
  color: var(--color-primary-button-text);
  border: 1px solid transparent;
}

.btn-primary:not(:disabled):hover {
  background-color: var(--color-primary-button-hover);
}

.btn-primary:not(:disabled):active {
  background-color: var(--color-primary-button-active);
}

.btn-primary:disabled {
  background-color: var(--color-primary-button-disabled);
  color: var(--color-primary-button-disabled-text);
  cursor: not-allowed;
}

/* Secondary button */

.btn-secondary {
  background-color: var(--color-secondary-button);
  color: var(--color-secondary-button-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:not(:disabled):hover {
  background-color: var(--color-secondary-button-hover);
}

.btn-secondary:not(:disabled):active {
  background-color: var(--color-secondary-button-active);
}

/* Destructive button */

.btn-danger {
  background-color: var(--color-danger-button);
  color: var(--color-danger-button-text);
  border: 1px solid transparent;
}

.btn-danger:not(:disabled):hover {
  background-color: var(--color-danger-button-hover);
}

/* Keyboard focus */

.btn-primary:focus-visible,
.btn-secondary:focus-visible,
.btn-danger:focus-visible,
.theme-link:focus-visible,
.theme-input:focus-visible,
.theme-checkbox:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

/* Forms */

.theme-input {
  background-color: var(--color-input-background);
  color: var(--color-input-text);
  border: 1px solid var(--color-input-border);
}

.theme-input::placeholder {
  color: var(--color-input-placeholder);
}

.theme-input:focus {
  border-color: var(--color-input-focus-border);
}

.theme-input[aria-invalid="true"] {
  border-color: var(--color-input-error-border);
}

.theme-input:disabled {
  background-color: var(--color-input-disabled-background);
  color: var(--color-disabled-text);
}

.theme-checkbox {
  accent-color: var(--color-checkbox);
}

.theme-input::selection {
  background-color: var(--color-selected-background);
  color: var(--color-input-text);
}

/* Alerts */

.alert-error {
  color: var(--color-error-text);
  background-color: var(--color-error-background);
  border: 1px solid var(--color-error-border);
}

.alert-error .alert-icon {
  color: var(--color-error-icon);
}

.alert-success {
  color: var(--color-success-text);
  background-color: var(--color-success-background);
  border: 1px solid var(--color-success-border);
}

.alert-success .alert-icon {
  color: var(--color-success-icon);
}

.alert-warning {
  color: var(--color-warning-text);
  background-color: var(--color-warning-background);
  border: 1px solid var(--color-warning-border);
}

.alert-warning .alert-icon {
  color: var(--color-warning-icon);
}

.alert-info {
  color: var(--color-info-text);
  background-color: var(--color-info-background);
  border: 1px solid var(--color-info-border);
}

.alert-info .alert-icon {
  color: var(--color-info-icon);
}

/* Tables */

.theme-table {
  width: 100%;
  border-collapse: collapse;
  color: var(--color-text);
}

.theme-table th {
  background-color: var(--color-table-header);
  color: var(--color-table-header-text);
}

.theme-table td {
  border-bottom: 1px solid var(--color-table-border);
}

.theme-table tbody tr {
  background-color: var(--color-table-row);
}

.theme-table tbody tr:nth-child(even) {
  background-color: var(--color-table-alternate-row);
}

.theme-table tbody tr:hover {
  background-color: var(--color-table-row-hover);
}

.theme-table tbody tr.is-selected {
  background-color: var(--color-table-selected-row);
}

/* Navigation */

.theme-menu-item {
  color: var(--color-menu-text);
}

.theme-menu-item:hover {
  background-color: var(--color-menu-hover);
}

.theme-menu-item.is-active {
  color: var(--color-menu-active);
}

/* Miscellaneous */

.theme-divider {
  border: 0;
  border-top: 1px solid var(--color-divider);
}

.theme-icon {
  color: var(--color-icon);
}

.theme-tooltip {
  background-color: var(--color-tooltip-background);
  color: var(--color-tooltip-text);
}

.theme-badge {
  background-color: var(--color-badge-background);
  color: var(--color-badge-text);
}
`.trim()
}

export function generateCss(
  lightPalette: ColorPalette,
  darkPalette: ColorPalette,
  options: CssExportOptions,
): string {

  const sections: string[] = [
    [
      '/*',
      ' * Generated by Dark Theme Studio',
      ' * Semantic color palette',
      ' *',
      ' * Validate accessibility in your application.',
      ' */',
    ].join('\n'),
  ]

  if (options.mode === 'combined') {

    sections.push(
      generateThemeBlock(
        ':root, [data-theme="light"]',
        lightPalette,
        'light',
      ),
    )

    sections.push(
      generateThemeBlock(
        '[data-theme="dark"]',
        darkPalette,
        'dark',
      ),
    )

    if (options.includeSystemPreference) {
      sections.push(
        generateSystemPreference(darkPalette),
      )
    }

  } else if (options.mode === 'light') {

    sections.push(
      generateThemeBlock(
        ':root',
        lightPalette,
        'light',
      ),
    )

  } else {

    sections.push(
      generateThemeBlock(
        ':root',
        darkPalette,
        'dark',
      ),
    )

  }

  if (options.includeComponents) {
    sections.push(
      generateComponentStyles(),
    )
  }

  return sections.join('\n\n') + '\n'
}

export function getCssFilename(
  mode: CssExportOptions['mode'],
): string {
  switch (mode) {
    case 'light':
      return 'light-theme.css'

    case 'dark':
      return 'dark-theme.css'

    default:
      return 'theme.css'
  }
}
