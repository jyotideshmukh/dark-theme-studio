
import {
  wcagContrast,
  converter,
} from 'culori'

import type {
  ColorPalette,
  ColorToken,
} from '../types/theme.types'

import { oklchToHex } from './gamutMapper'

// ======================================================
// Types and interfaces
// ======================================================

export type AccessibilityCategory =
  | 'Typography'
  | 'Buttons'
  | 'Forms'
  | 'Links'
  | 'Alerts'
  | 'Navigation'
  | 'Tables'
  | 'Miscellaneous'

export interface ContrastRule {
  id: string
  label: string
  category: AccessibilityCategory
  foreground: ColorToken
  background: ColorToken
  minimumRatio: number
}

export interface AccessibilityResult extends ContrastRule {
  foregroundColor: string
  backgroundColor: string
  ratio: number
  passes: boolean
  suggestedColor: string | null
}

export interface AccessibilitySummary {
  total: number
  passed: number
  failed: number
  percentage: number
}

export interface AccessibilityFixResult {
  palette: ColorPalette
  changes: Partial<Record<ColorToken, string>>
  before: AccessibilitySummary
  after: AccessibilitySummary
  unresolved: AccessibilityResult[]
}

export interface ContrastConstraint {
  background: string
  minimumRatio: number
}

const toOklch = converter('oklch')

// ======================================================
// Contrast rule helper
// ======================================================

function createRule(
  id: string,
  label: string,
  category: AccessibilityCategory,
  foreground: ColorToken,
  background: ColorToken,
  minimumRatio = 4.5,
): ContrastRule {
  return {
    id,
    label,
    category,
    foreground,
    background,
    minimumRatio,
  }
}

// ======================================================
// WCAG contrast rules
// ======================================================

export const contrastRules: readonly ContrastRule[] = [

  // --------------------------------------------------
  // Typography
  // --------------------------------------------------

  createRule(
    'title-background',
    'Title on page',
    'Typography',
    'title',
    'background',
  ),

  createRule(
    'title-surface',
    'Title on card',
    'Typography',
    'title',
    'surface',
  ),

  createRule(
    'title-header',
    'Title on header',
    'Typography',
    'title',
    'headerBackground',
  ),

  createRule(
    'heading-background',
    'Heading on page',
    'Typography',
    'heading',
    'background',
  ),

  createRule(
    'heading-surface',
    'Heading on card',
    'Typography',
    'heading',
    'surface',
  ),

  createRule(
    'heading-modal',
    'Heading on modal',
    'Typography',
    'heading',
    'modalBackground',
  ),

  createRule(
    'subtitle-background',
    'Subtitle on page',
    'Typography',
    'subtitle',
    'background',
  ),

  createRule(
    'subtitle-surface',
    'Subtitle on card',
    'Typography',
    'subtitle',
    'surface',
  ),

  createRule(
    'text-background',
    'Body text on page',
    'Typography',
    'text',
    'background',
  ),

  createRule(
    'text-surface',
    'Body text on card',
    'Typography',
    'text',
    'surface',
  ),

  createRule(
    'text-modal',
    'Body text on modal',
    'Typography',
    'text',
    'modalBackground',
  ),

  createRule(
    'muted-background',
    'Muted text on page',
    'Typography',
    'mutedText',
    'background',
  ),

  createRule(
    'muted-surface',
    'Muted text on card',
    'Typography',
    'mutedText',
    'surface',
  ),

  // --------------------------------------------------
  // Primary buttons
  // --------------------------------------------------

  createRule(
    'primary-default',
    'Primary button',
    'Buttons',
    'primaryButtonText',
    'primaryButton',
  ),

  createRule(
    'primary-hover',
    'Primary button hover',
    'Buttons',
    'primaryButtonText',
    'primaryButtonHover',
  ),

  createRule(
    'primary-active',
    'Primary button active',
    'Buttons',
    'primaryButtonText',
    'primaryButtonActive',
  ),

  // --------------------------------------------------
  // Secondary buttons
  // --------------------------------------------------

  createRule(
    'secondary-default',
    'Secondary button',
    'Buttons',
    'secondaryButtonText',
    'secondaryButton',
  ),

  createRule(
    'secondary-hover',
    'Secondary button hover',
    'Buttons',
    'secondaryButtonText',
    'secondaryButtonHover',
  ),

  createRule(
    'secondary-active',
    'Secondary button active',
    'Buttons',
    'secondaryButtonText',
    'secondaryButtonActive',
  ),

  // --------------------------------------------------
  // Destructive buttons
  // --------------------------------------------------

  createRule(
    'danger-default',
    'Destructive button',
    'Buttons',
    'dangerButtonText',
    'dangerButton',
  ),

  createRule(
    'danger-hover',
    'Destructive button hover',
    'Buttons',
    'dangerButtonText',
    'dangerButtonHover',
  ),

  // Disabled controls are excluded
  // from mandatory WCAG contrast checks.

  // --------------------------------------------------
  // Links
  // --------------------------------------------------

  createRule(
    'link-default',
    'Default link',
    'Links',
    'link',
    'surface',
  ),

  createRule(
    'link-background',
    'Link on page',
    'Links',
    'link',
    'background',
  ),

  createRule(
    'link-hover',
    'Hovered link',
    'Links',
    'linkHover',
    'surface',
  ),

  createRule(
    'link-hover-background',
    'Hovered link on page',
    'Links',
    'linkHover',
    'background',
  ),

  createRule(
    'link-active',
    'Active link',
    'Links',
    'linkActive',
    'surface',
  ),

  createRule(
    'link-active-background',
    'Active link on page',
    'Links',
    'linkActive',
    'background',
  ),

  createRule(
    'link-visited',
    'Visited link',
    'Links',
    'linkVisited',
    'surface',
  ),

  createRule(
    'link-visited-background',
    'Visited link on page',
    'Links',
    'linkVisited',
    'background',
  ),

  // --------------------------------------------------
  // Form controls
  // --------------------------------------------------

  createRule(
    'input-text',
    'Input text',
    'Forms',
    'inputText',
    'inputBackground',
  ),

  createRule(
    'input-placeholder',
    'Input placeholder',
    'Forms',
    'inputPlaceholder',
    'inputBackground',
  ),

  createRule(
    'input-border',
    'Input boundary on card',
    'Forms',
    'inputBorder',
    'surface',
    3,
  ),

  createRule(
    'input-border-background',
    'Input boundary against fill',
    'Forms',
    'inputBorder',
    'inputBackground',
    3,
  ),

  createRule(
    'input-focus',
    'Input focus boundary',
    'Forms',
    'inputFocusBorder',
    'surface',
    3,
  ),

  createRule(
    'input-focus-background',
    'Input focus boundary against fill',
    'Forms',
    'inputFocusBorder',
    'inputBackground',
    3,
  ),

  createRule(
    'input-error',
    'Input error boundary',
    'Forms',
    'inputErrorBorder',
    'surface',
    3,
  ),

  createRule(
    'input-error-background',
    'Input error boundary against fill',
    'Forms',
    'inputErrorBorder',
    'inputBackground',
    3,
  ),

  createRule(
    'focus-ring',
    'Focus ring on card',
    'Forms',
    'focusRing',
    'surface',
    3,
  ),

  createRule(
    'focus-ring-background',
    'Focus ring on page',
    'Forms',
    'focusRing',
    'background',
    3,
  ),

  createRule(
    'checkbox-background',
    'Checkbox accent on page',
    'Forms',
    'checkbox',
    'background',
    3,
  ),

  createRule(
    'checkbox-surface',
    'Checkbox accent on card',
    'Forms',
    'checkbox',
    'surface',
    3,
  ),

  createRule(
    'selected-input-text',
    'Selected input text',
    'Forms',
    'inputText',
    'selectedBackground',
  ),

  createRule(
    'form-error-message',
    'Form validation message',
    'Forms',
    'errorText',
    'surface',
  ),

  // --------------------------------------------------
  // Error alerts
  // --------------------------------------------------

  createRule(
    'error-text',
    'Error message',
    'Alerts',
    'errorText',
    'errorBackground',
  ),

  createRule(
    'error-icon',
    'Error icon',
    'Alerts',
    'errorIcon',
    'errorBackground',
    3,
  ),

  // --------------------------------------------------
  // Success alerts
  // --------------------------------------------------

  createRule(
    'success-text',
    'Success message',
    'Alerts',
    'successText',
    'successBackground',
  ),

  createRule(
    'success-icon',
    'Success icon',
    'Alerts',
    'successIcon',
    'successBackground',
    3,
  ),

  createRule(
    'success-text-surface',
    'Success text on card',
    'Alerts',
    'successText',
    'surface',
  ),

  // --------------------------------------------------
  // Warning alerts
  // --------------------------------------------------

  createRule(
    'warning-text',
    'Warning message',
    'Alerts',
    'warningText',
    'warningBackground',
  ),

  createRule(
    'warning-icon',
    'Warning icon',
    'Alerts',
    'warningIcon',
    'warningBackground',
    3,
  ),

  // --------------------------------------------------
  // Information alerts
  // --------------------------------------------------

  createRule(
    'info-text',
    'Information message',
    'Alerts',
    'infoText',
    'infoBackground',
  ),

  createRule(
    'info-icon',
    'Information icon',
    'Alerts',
    'infoIcon',
    'infoBackground',
    3,
  ),

  // --------------------------------------------------
  // Navigation
  // --------------------------------------------------

  createRule(
    'menu-text',
    'Navigation text',
    'Navigation',
    'menuText',
    'sidebarBackground',
  ),

  createRule(
    'menu-hover',
    'Hovered navigation text',
    'Navigation',
    'menuText',
    'menuHover',
  ),

  createRule(
    'menu-header',
    'Navigation text on header',
    'Navigation',
    'menuText',
    'headerBackground',
  ),

  createRule(
    'menu-active',
    'Active navigation text',
    'Navigation',
    'menuActive',
    'sidebarBackground',
  ),

  createRule(
    'menu-active-hover',
    'Active navigation hover',
    'Navigation',
    'menuActive',
    'menuHover',
  ),

  createRule(
    'menu-active-header',
    'Active navigation on header',
    'Navigation',
    'menuActive',
    'headerBackground',
  ),

  // --------------------------------------------------
  // Tables
  // --------------------------------------------------

  createRule(
    'table-header',
    'Table header text',
    'Tables',
    'tableHeaderText',
    'tableHeader',
  ),

  createRule(
    'table-row',
    'Table row text',
    'Tables',
    'text',
    'tableRow',
  ),

  createRule(
    'table-alternate-row',
    'Alternate table row',
    'Tables',
    'text',
    'tableAlternateRow',
  ),

  createRule(
    'table-hover',
    'Hovered table row',
    'Tables',
    'text',
    'tableRowHover',
  ),

  createRule(
    'table-selected',
    'Selected table row',
    'Tables',
    'text',
    'tableSelectedRow',
  ),

  // --------------------------------------------------
  // Miscellaneous
  // --------------------------------------------------

  createRule(
    'tooltip-text',
    'Tooltip text',
    'Miscellaneous',
    'tooltipText',
    'tooltipBackground',
  ),

  createRule(
    'badge-text',
    'Badge text',
    'Miscellaneous',
    'badgeText',
    'badgeBackground',
  ),

  createRule(
    'icon-background',
    'Icon on page',
    'Miscellaneous',
    'icon',
    'background',
    3,
  ),

  createRule(
    'icon-surface',
    'Icon on card',
    'Miscellaneous',
    'icon',
    'surface',
    3,
  ),

  createRule(
    'icon-header',
    'Icon on header',
    'Miscellaneous',
    'icon',
    'headerBackground',
    3,
  ),

  createRule(
    'chart-bar',
    'Chart bar on card',
    'Miscellaneous',
    'primaryButton',
    'surface',
    3,
  ),
]

// ======================================================
// Calculate contrast ratio
// ======================================================

export function calculateContrast(
  foreground: string,
  background: string,
): number {
  return wcagContrast(
    foreground,
    background,
  )
}

// ======================================================
// Validate minimum contrast
// ======================================================

export function meetsContrast(
  foreground: string,
  background: string,
  minimumRatio = 4.5,
): boolean {
  return calculateContrast(
    foreground,
    background,
  ) >= minimumRatio
}

// ======================================================
// Suggest an accessible foreground color
// ======================================================

export function suggestAccessibleColor(
  foreground: string,
  constraints: ContrastConstraint[],
): string | null {

  if (
    !/^#[0-9A-Fa-f]{6}$/.test(foreground)
  ) {
    return null
  }

  if (constraints.some(
    (constraint) =>
      !/^#[0-9A-Fa-f]{6}$/.test(
        constraint.background,
      ) ||
      !Number.isFinite(
        constraint.minimumRatio,
      ) ||
      constraint.minimumRatio < 1 ||
      constraint.minimumRatio > 21,
  )) {
    return null
  }

  function passesAll(color: string): boolean {
    return constraints.every(
      (constraint) =>
        meetsContrast(
          color,
          constraint.background,
          constraint.minimumRatio,
        ),
    )
  }

  // Preserve an already accessible color.

  if (passesAll(foreground)) {
    return foreground.toUpperCase()
  }

  const original = toOklch(foreground)

  if (!original) {
    return null
  }

  let bestColor: string | null = null
  let bestDistance = Infinity

  const chromaFactors = [
    1,
    0.75,
    0.5,
    0.25,
    0,
  ]

  // Avoid evaluating the same HEX
  // color repeatedly.

  const evaluatedColors = new Set<string>()

  for (const factor of chromaFactors) {

    for (let step = 0; step <= 200; step++) {

      const lightness = step / 200

      const candidate = {
        mode: 'oklch' as const,
        l: lightness,
        c: original.c * factor,
        h: original.h ?? 0,
      }

      const hex = oklchToHex(candidate)

      if (evaluatedColors.has(hex)) {
        continue
      }

      evaluatedColors.add(hex)

      if (!passesAll(hex)) {
        continue
      }

      // Measure the actual gamut-mapped color.

      const mapped = toOklch(hex)

      if (!mapped) {
        continue
      }

      const distance = Math.hypot(
        mapped.l - original.l,
        mapped.c - original.c,
      )

      if (distance < bestDistance) {
        bestDistance = distance
        bestColor = hex
      }
    }
  }

  return bestColor
}

// ======================================================
// Audit the complete palette
// ======================================================

export function auditAccessibility(
  palette: ColorPalette,
  activeRules: readonly ContrastRule[] =
    contrastRules,
  includeSuggestions = false,
): AccessibilityResult[] {

  const suggestions = new Map<
    ColorToken,
    string | null
  >()

  return activeRules.map((rule) => {

    const foregroundColor =
      palette[rule.foreground]

    const backgroundColor =
      palette[rule.background]

    const ratio = calculateContrast(
      foregroundColor,
      backgroundColor,
    )

    const passes =
      ratio >= rule.minimumRatio

    let suggestedColor: string | null = null

    if (!passes && includeSuggestions) {

      // Consider all backgrounds using
      // the same foreground token.

      if (!suggestions.has(rule.foreground)) {

        const constraints = activeRules
          .filter(
            (item) =>
              item.foreground === rule.foreground,
          )
          .map((item) => ({
            background:
              palette[item.background],

            minimumRatio:
              item.minimumRatio,
          }))

        suggestions.set(
          rule.foreground,
          suggestAccessibleColor(
            foregroundColor,
            constraints,
          ),
        )
      }

      suggestedColor =
        suggestions.get(rule.foreground) ?? null
    }

    return {
      ...rule,
      foregroundColor,
      backgroundColor,
      ratio,
      passes,
      suggestedColor,
    }
  })
}

// ======================================================
// Generate accessibility summary
// ======================================================

export function summarizeAccessibility(
  results: AccessibilityResult[],
): AccessibilitySummary {

  const total = results.length

  const passed = results.filter(
    (result) => result.passes,
  ).length

  const failed = total - passed

  return {
    total,
    passed,
    failed,

    percentage:
      total === 0
        ? 0
        : failed === 0
          ? 100
          : Math.min(
              99,
              Math.round(passed / total * 100),
            ),
  }
}

// ======================================================
// Automatically fix accessibility issues
// ======================================================

export function fixPaletteAccessibility(
  palette: ColorPalette,
  lockedTokens: ColorToken[] = [],
  activeRules: readonly ContrastRule[] =
    contrastRules,
): AccessibilityFixResult {

  // Create a copy to prevent mutation
  // of the original palette.

  const updatedPalette = {
    ...palette,
  }

  const changes: Partial<
    Record<ColorToken, string>
  > = {}

  const before = summarizeAccessibility(
    auditAccessibility(
      palette,
      activeRules,
    ),
  )

  const locked = new Set(lockedTokens)

  // Obtain unique foreground color tokens.

  const foregroundTokens = [
    ...new Set(
      activeRules.map(
        (rule) => rule.foreground,
      ),
    ),
  ]

  // Multiple passes help resolve dependencies
  // between foreground and background tokens.

  const maximumPasses = 3

  for (
    let pass = 0;
    pass < maximumPasses;
    pass++
  ) {

    let changed = false

    for (const token of foregroundTokens) {

      // Never modify manually locked colors.

      if (locked.has(token)) {
        continue
      }

      const relatedRules =
        activeRules.filter(
          (rule) =>
            rule.foreground === token,
        )

      const constraints: ContrastConstraint[] =
        relatedRules.map((rule) => ({
          background:
            updatedPalette[rule.background],

          minimumRatio:
            rule.minimumRatio,
        }))

      const currentColor =
        updatedPalette[token]

      const correctedColor =
        suggestAccessibleColor(
          currentColor,
          constraints,
        )

      // Skip colors that are already accessible
      // or cannot be corrected.

      if (
        !correctedColor ||
        correctedColor ===
          currentColor.toUpperCase()
      ) {
        continue
      }

      // Create a candidate palette.

      const candidatePalette = {
        ...updatedPalette,
        [token]: correctedColor,
      }

      // Identify existing failures.

      const previousFailures =
        auditAccessibility(
          updatedPalette,
          activeRules,
        ).filter(
          (result) => !result.passes,
        )

      // Identify failures after correction.

      const nextFailures =
        auditAccessibility(
          candidatePalette,
          activeRules,
        ).filter(
          (result) => !result.passes,
        )

      const previousFailureIds = new Set(
        previousFailures.map(
          (result) => result.id,
        ),
      )

      // Do not introduce a new failure
      // while correcting an existing one.

      const introducesFailure =
        nextFailures.some(
          (result) =>
            !previousFailureIds.has(
              result.id,
            ),
        )

      if (
        introducesFailure ||
        nextFailures.length >=
          previousFailures.length
      ) {
        continue
      }

      // Accept the correction.

      updatedPalette[token] =
        correctedColor

      changes[token] =
        correctedColor

      changed = true
    }

    // Stop if no further improvement
    // was made during this pass.

    if (!changed) {
      break
    }
  }

  // Perform the final accessibility audit.

  const finalResults =
    auditAccessibility(
      updatedPalette,
      activeRules,
    )

  const after =
    summarizeAccessibility(finalResults)

  const unresolved =
    finalResults.filter(
      (result) => !result.passes,
    )

  return {
    palette: updatedPalette,
    changes,
    before,
    after,
    unresolved,
  }
}
