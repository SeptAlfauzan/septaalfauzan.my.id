import type { CodeLine } from '@/types/code'
import { line, blank, kw, typ, str, num, com, fn, plain } from '@/types/code'

export interface ProfileStat {
  before: string
  bold: string
  after: string
}

export interface Profile {
  name: string
  role: string
  location: string
  tagline: string
  resumeUrl: string
  stack: string[]
  stats: ProfileStat[]
}

export const profile: Profile = {
  name: 'Septa Alfauzan',
  role: 'Software Engineer, Mobile',
  location: 'Surabaya, Indonesia',
  tagline: 'Mobile Engineer · Flutter & Native',
  resumeUrl:
    'https://drive.google.com/file/d/1Ubv2crCzDHV0yKea2qPwq3jtaPdim1vm/view?usp=sharing',
  stack: ['Flutter', 'Kotlin', 'SwiftUI', 'Compose'],
  stats: [
    { before: '', bold: '2+ yrs', after: ' production mobile dev' },
    { before: 'Shipping to ', bold: 'Play Store & App Store', after: '' },
    { before: 'Clients across ', bold: 'ID & Japan', after: '' },
  ],
}

const BIO_LINES = [
    "I'm a mobile developer focused on building",
    'scalable, production-grade apps using Flutter',
    "and Android. I don't just write code — I handle",
    'the full lifecycle: requirements, integration,',
    'deployment, and post-release stability.',
    "With 2+ years in mobile development, I build",
    "production-ready apps used by real users — from",
    "SIM management platforms to IoT systems and",
    "enterprise tools. Currently shipping to Play",
    "Store & App Store for international clients."
]

const FOCUS = [
  'Migrating & scaling apps used by 1000s of users',
  'Shipping apps from scratch to Play & App Store',
  'Integrating backend, IoT & realtime pipelines',
]

export function aboutCodeLines(comment: string): CodeLine[] {
  return [
    line(com(comment)),
    blank(),
    line(kw('import'), plain(' '), str("'package:portfolio/core.dart'"), plain(';')),
    blank(),
    line(com('/// Mobile Engineer · Surabaya, Indonesia')),
    line(kw('class'), plain(' '), typ('Septa'), plain(' '), kw('extends'), plain(' '), typ('Developer'), plain(' {')),
    line(plain('  '), kw('final'), plain(' '), typ('String'), plain(' name = '), str("'Septa Alfauzan'"), plain(';')),
    line(plain('  '), kw('final'), plain(' '), typ('String'), plain(' role = '), str("'Software Engineer, Mobile'"), plain(';')),
    line(plain('  '), kw('final'), plain(' '), typ('int'), plain(' experienceYears = '), num('2'), plain(';')),
    blank(),
    line(plain('  '), kw('final'), plain(' '), typ('List'), plain('<'), typ('String'), plain('> stack = [')),
    line(plain('    '), str("'Flutter'"), plain(', '), str("'Kotlin'"), plain(', '), str("'Swift'"), plain(', '), str("'Jetpack Compose'"), plain(',')),
    line(plain('  '), plain('];')),
    blank(),

    line(plain('  '), typ('String'), plain(' '), kw('get'), plain(' '), fn('bio'), plain(' => '), str("'''")),
    ...BIO_LINES.map((b) => line(plain('    '), plain(b))),
    line(plain('  '), str("''';")),
    blank(),
    line(plain('  '), typ('List'), plain('<'), typ('String'), plain('> '), fn('focus'), plain('() => [')),
    ...FOCUS.map((f) => line(plain('    '), str(`'${f}'`), plain(','))),
    line(plain('  '), plain('];')),
    line(plain('}')),
  ]
}
