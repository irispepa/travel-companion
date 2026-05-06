import { describe, it, expect } from 'vitest'
import { compressImage } from '../../src/utils/imageCompressor'

describe('compressImage', () => {
  it('returns a base64 string', async () => {
    const canvas = document.createElement('canvas')
    canvas.width = 10; canvas.height = 10
    const blob = await new Promise<Blob>(r => canvas.toBlob(b => r(b!), 'image/jpeg'))
    const result = await compressImage(blob)
    expect(result).toMatch(/^data:image\/jpeg;base64,/)
  })
})
