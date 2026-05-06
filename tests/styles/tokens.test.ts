import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('design tokens', () => {
  it('token file exists and exports expected variable names', () => {
    const css = readFileSync(resolve(__dirname, '../../src/styles/tokens.css'), 'utf-8')
    expect(css).toContain('--color-bg')
    expect(css).toContain('--color-cream')
    expect(css).toContain('--color-gold')
  })
})
