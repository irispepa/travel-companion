import '@testing-library/jest-dom'
import 'fake-indexeddb/auto'

;(globalThis as unknown as Record<string, unknown>).createImageBitmap = async (_blob: unknown) => {
  return { width: 10, height: 10, close: () => {} } as ImageBitmap
}

HTMLCanvasElement.prototype.toBlob = function(callback, type) {
  const dataURL = this.toDataURL(type ?? 'image/jpeg')
  const arr = dataURL.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) u8arr[n] = bstr.charCodeAt(n)
  callback(new Blob([u8arr], { type: mime }))
}

HTMLCanvasElement.prototype.toDataURL = function() {
  return 'data:image/jpeg;base64,/9j/fake'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(HTMLCanvasElement.prototype as any).getContext = function() {
  return { drawImage: () => {} }
}
