
import type { ColorCategory } from '../types/theme.types'

export const colorCategories: ColorCategory[] = [
  {
    id: 'backgrounds',
    label: 'Backgrounds & Surfaces',
    tokens: [
      { key: 'background', label: 'Page Background' },
      { key: 'surface', label: 'Card Background' },
      { key: 'headerBackground', label: 'Header Background' },
      { key: 'sidebarBackground', label: 'Sidebar Background' },
      { key: 'modalBackground', label: 'Modal Background' },
    ],
  },
  {
    id: 'typography',
    label: 'Typography',
    tokens: [
      { key: 'title', label: 'Title' },
      { key: 'heading', label: 'Heading' },
      { key: 'subtitle', label: 'Subtitle' },
      { key: 'text', label: 'Body Text' },
      { key: 'mutedText', label: 'Muted Text' },
      { key: 'disabledText', label: 'Disabled Text' },
    ],
  },
  {
    id: 'links',
    label: 'Links',
    tokens: [
      { key: 'link', label: 'Default' },
      { key: 'linkHover', label: 'Hover' },
      { key: 'linkActive', label: 'Active' },
      { key: 'linkVisited', label: 'Visited' },
    ],
  },
  {
    id: 'primary-buttons',
    label: 'Primary Buttons',
    tokens: [
      { key: 'primaryButton', label: 'Background' },
      { key: 'primaryButtonText', label: 'Text' },
      { key: 'primaryButtonHover', label: 'Hover' },
      { key: 'primaryButtonActive', label: 'Active' },
      { key: 'primaryButtonDisabled', label: 'Disabled' },
      { key: 'primaryButtonDisabledText', label: 'Disabled Text' },
      { key: 'focusRing', label: 'Focus Ring' },
    ],
  },
  {
    id: 'secondary-buttons',
    label: 'Secondary & Destructive Buttons',
    tokens: [
      { key: 'secondaryButton', label: 'Secondary Background' },
      { key: 'secondaryButtonText', label: 'Secondary Text' },
      { key: 'secondaryButtonHover', label: 'Secondary Hover' },
      { key: 'secondaryButtonActive', label: 'Secondary Active' },
      { key: 'dangerButton', label: 'Danger Background' },
      { key: 'dangerButtonText', label: 'Danger Text' },
      { key: 'dangerButtonHover', label: 'Danger Hover' },
    ],
  },
  {
    id: 'forms',
    label: 'Form Elements',
    tokens: [
      { key: 'inputBackground', label: 'Input Background' },
      { key: 'inputText', label: 'Input Text' },
      { key: 'inputPlaceholder', label: 'Placeholder' },
      { key: 'inputBorder', label: 'Border' },
      { key: 'inputFocusBorder', label: 'Focus Border' },
      { key: 'inputErrorBorder', label: 'Error Border' },
      { key: 'inputDisabledBackground', label: 'Disabled Background' },
      { key: 'checkbox', label: 'Checkbox & Radio' },
      { key: 'selectedBackground', label: 'Selected Background' },
    ],
  },
  {
    id: 'errors',
    label: 'Error Messages',
    tokens: [
      { key: 'errorText', label: 'Text' },
      { key: 'errorBackground', label: 'Background' },
      { key: 'errorBorder', label: 'Border' },
      { key: 'errorIcon', label: 'Icon' },
    ],
  },
  {
    id: 'success',
    label: 'Success Messages',
    tokens: [
      { key: 'successText', label: 'Text' },
      { key: 'successBackground', label: 'Background' },
      { key: 'successBorder', label: 'Border' },
      { key: 'successIcon', label: 'Icon' },
    ],
  },
  {
    id: 'warnings',
    label: 'Warning Messages',
    tokens: [
      { key: 'warningText', label: 'Text' },
      { key: 'warningBackground', label: 'Background' },
      { key: 'warningBorder', label: 'Border' },
      { key: 'warningIcon', label: 'Icon' },
    ],
  },
  {
    id: 'information',
    label: 'Information Messages',
    tokens: [
      { key: 'infoText', label: 'Text' },
      { key: 'infoBackground', label: 'Background' },
      { key: 'infoBorder', label: 'Border' },
      { key: 'infoIcon', label: 'Icon' },
    ],
  },
  {
    id: 'tables',
    label: 'Tables',
    tokens: [
      { key: 'tableHeader', label: 'Header Background' },
      { key: 'tableHeaderText', label: 'Header Text' },
      { key: 'tableRow', label: 'Row Background' },
      { key: 'tableAlternateRow', label: 'Alternate Row' },
      { key: 'tableRowHover', label: 'Row Hover' },
      { key: 'tableSelectedRow', label: 'Selected Row' },
      { key: 'tableBorder', label: 'Border' },
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation & Miscellaneous',
    tokens: [
      { key: 'menuText', label: 'Menu Text' },
      { key: 'menuActive', label: 'Active Menu' },
      { key: 'menuHover', label: 'Menu Hover' },
      { key: 'border', label: 'Border' },
      { key: 'divider', label: 'Divider' },
      { key: 'icon', label: 'Icon' },
      { key: 'tooltipBackground', label: 'Tooltip Background' },
      { key: 'tooltipText', label: 'Tooltip Text' },
      { key: 'badgeBackground', label: 'Badge Background' },
      { key: 'badgeText', label: 'Badge Text' },
    ],
  },
]
