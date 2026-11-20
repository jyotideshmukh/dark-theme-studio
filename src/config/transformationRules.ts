
import type { ColorToken } from '../types/theme.types'

export type TransformationRole =
  | 'background'
  | 'surface'
  | 'elevated-surface'
  | 'subtle-surface'
  | 'text'
  | 'muted-text'
  | 'disabled-text'
  | 'accent'
  | 'accent-hover'
  | 'accent-active'
  | 'on-accent'
  | 'tinted-surface'
  | 'status-text'
  | 'status-background'
  | 'status-border'
  | 'border'
  | 'divider'
  | 'interactive-border'
  | 'inverse-background'
  | 'inverse-text'

export const transformationRules: Record<
  ColorToken,
  TransformationRole
> = {
  // Backgrounds
  background: 'background',
  surface: 'surface',
  headerBackground: 'surface',
  sidebarBackground: 'subtle-surface',
  modalBackground: 'elevated-surface',

  // Typography
  title: 'text',
  heading: 'text',
  subtitle: 'muted-text',
  text: 'text',
  mutedText: 'muted-text',
  disabledText: 'disabled-text',

  // Links
  link: 'accent',
  linkHover: 'accent-hover',
  linkActive: 'accent-active',
  linkVisited: 'accent',

  // Primary buttons
  primaryButton: 'accent',
  primaryButtonText: 'on-accent',
  primaryButtonHover: 'accent-hover',
  primaryButtonActive: 'accent-active',
  primaryButtonDisabled: 'subtle-surface',
  primaryButtonDisabledText: 'disabled-text',
  focusRing: 'accent',

  // Secondary buttons
  secondaryButton: 'subtle-surface',
  secondaryButtonText: 'text',
  secondaryButtonHover: 'elevated-surface',
  secondaryButtonActive: 'tinted-surface',

  // Destructive buttons
  dangerButton: 'accent',
  dangerButtonText: 'on-accent',
  dangerButtonHover: 'accent-hover',

  // Forms
  inputBackground: 'surface',
  inputText: 'text',
  inputPlaceholder: 'muted-text',
  inputBorder: 'interactive-border',
  inputFocusBorder: 'accent',
  inputErrorBorder: 'status-text',
  inputDisabledBackground: 'subtle-surface',
  checkbox: 'accent',
  selectedBackground: 'tinted-surface',

  // Error
  errorText: 'status-text',
  errorBackground: 'status-background',
  errorBorder: 'status-border',
  errorIcon: 'status-text',

  // Success
  successText: 'status-text',
  successBackground: 'status-background',
  successBorder: 'status-border',
  successIcon: 'status-text',

  // Warning
  warningText: 'status-text',
  warningBackground: 'status-background',
  warningBorder: 'status-border',
  warningIcon: 'status-text',

  // Information
  infoText: 'status-text',
  infoBackground: 'status-background',
  infoBorder: 'status-border',
  infoIcon: 'status-text',

  // Tables
  tableHeader: 'subtle-surface',
  tableHeaderText: 'text',
  tableRow: 'surface',
  tableAlternateRow: 'subtle-surface',
  tableRowHover: 'elevated-surface',
  tableSelectedRow: 'tinted-surface',
  tableBorder: 'border',

  // Navigation
  menuText: 'muted-text',
  menuActive: 'accent',
  menuHover: 'elevated-surface',

  // Miscellaneous
  border: 'border',
  divider: 'divider',
  icon: 'muted-text',
  tooltipBackground: 'inverse-background',
  tooltipText: 'inverse-text',
  badgeBackground: 'tinted-surface',
  badgeText: 'status-text',
}
