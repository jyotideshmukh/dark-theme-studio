
export function isValidHex(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value)
}

export function normalizeHex(value: string): string {
  const color = value.trim().toUpperCase()

  return color.startsWith('#') ? color : `#${color}`
}

export function toCssVariables(
  palette: Record<string, string>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(palette).map(([key, value]) => {
      const cssKey = key.replace(
        /[A-Z]/g,
        (letter) => `-${letter.toLowerCase()}`,
      )

      return [`--color-${cssKey}`, value]
    }),
  )
}
