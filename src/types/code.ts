export interface CodeToken {
  cls: string
  text: string
}

export interface CodeLine {
  tokens: CodeToken[]
}

function tok(cls: string, text: string): CodeToken {
  return { cls, text }
}

export const plain = (text: string): CodeToken => tok('code', text)
export const kw = (text: string): CodeToken => tok('tok-kw', text)
export const typ = (text: string): CodeToken => tok('tok-type', text)
export const str = (text: string): CodeToken => tok('tok-str', text)
export const com = (text: string): CodeToken => tok('tok-com', text)
export const fn = (text: string): CodeToken => tok('tok-fn', text)
export const num = (text: string): CodeToken => tok('tok-num', text)
export const prop = (text: string): CodeToken => tok('tok-prop', text)
export const punc = (text: string): CodeToken => tok('tok-punc', text)
export const bright = (text: string): CodeToken => tok('tok-bright', text)

export function line(...tokens: CodeToken[]): CodeLine {
  return { tokens }
}

export function blank(): CodeLine {
  return { tokens: [] }
}
