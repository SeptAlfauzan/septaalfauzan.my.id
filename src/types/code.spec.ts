import { describe, it, expect } from 'vitest'
import { line, blank, plain, kw, com } from './code'

describe('code line helpers', () => {
  it('builds a line from tokens', () => {
    expect(line(kw('class'), plain(' '), com('// x'))).toEqual({
      tokens: [
        { cls: 'tok-kw', text: 'class' },
        { cls: 'code', text: ' ' },
        { cls: 'tok-com', text: '// x' },
      ],
    })
  })

  it('builds a blank line', () => {
    expect(blank()).toEqual({ tokens: [] })
  })
})
