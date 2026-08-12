import type { CodeLine } from '@/types/code'
import { line, blank, plain, fn, bright, punc } from '@/types/code'

export interface SocialLink {
  label: string
  url: string
}

export interface Contact {
  email: string
  phone: string
  phoneHref: string
  socials: SocialLink[]
}

export const contact: Contact = {
  email: 'alfauzansepta@gmail.com',
  phone: '+62 821-323-514-998',
  phoneHref: 'tel:+6282132351498',
  socials: [
    { label: 'LinkedIn', url: 'http://linkedin.com/in/septa-alfauzan-a11a891b0/' },
    { label: 'GitHub', url: 'http://github.com/septAlfauzan/' },
    { label: 'Medium', url: 'https://medium.com/@alfauzansepta' },
  ],
}

export function contactMdLines(): CodeLine[] {
  return [
    line(bright("# Let's work together")),
    blank(),
    line(plain('Open to mobile engineering roles, freelance')),
    line(plain('builds, and interesting collaborations.')),
    blank(),
    line(bright('**Email:**'), plain(' '), fn(contact.email)),
    line(bright('**Phone:**'), plain(' '), fn(contact.phone)),
    blank(),
    line(punc('---')),
    ...contact.socials.map((s) => line(punc('-'), plain(' ['), fn(s.label), plain(`](${s.url})`))),
  ]
}
