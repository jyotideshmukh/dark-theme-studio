
export function downloadTextFile(
  content: string,
  filename: string,
  mimeType = 'text/plain',
): void {

  const blob = new Blob(
    [content],
    {
      type: `${mimeType};charset=utf-8`,
    },
  )

  const url = URL.createObjectURL(blob)

  const anchor = document.createElement('a')

  anchor.href = url

  anchor.download = filename

  document.body.appendChild(anchor)

  try {
    anchor.click()
  } finally {
    anchor.remove()

    // Release the temporary object URL.
    window.setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 1000)
  }
}
