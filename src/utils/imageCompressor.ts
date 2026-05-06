const TARGET_BYTES = 500 * 1024

export async function compressImage(file: Blob): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  const scale = Math.min(1, Math.sqrt(TARGET_BYTES / file.size))
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.8)
}
