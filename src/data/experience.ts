export interface Experience {
  hash: string
  refs?: string
  author: string
  dateRange: string
  subject: string
  body: string
  bullets: string[]
}

export const experiences: Experience[] = [
  {
    hash: '9f3a1c2',
    refs: '(HEAD -> main, origin/main)',
    author: 'Septa Alfauzan',
    dateRange: 'Feb 2025 — Present',
    subject: 'Mobile Developer @ Delta HQ',
    body: 'Leading development of production mobile applications used by thousands of users across international markets.',
    bullets: [
      'Migrated & revamped JP SMART SIM app using Flutter → resulted in 7,000+ new device acquisitions',
      'Built DeltaHQ PMS mobile app from scratch, handling full lifecycle (requirement → CI/CD → store release)',
      'Integrated Micro CMS enabling non-technical teams to manage in-app promotional content',
      'Collaborated directly with Japanese enterprise clients to translate business needs into scalable solutions',
      'Stabilized legacy apps by reducing crashes and improving reliability',
    ],
  },
  {
    hash: '6b7d4e1',
    author: 'Septa Alfauzan',
    dateRange: 'Oct 2023 — Jan 2025',
    subject: 'Mobile Developer @ Tensai Innovation',
    body: 'Worked on diverse real-world systems including IoT, AI, and hardware integrations.',
    bullets: [
      'Developed IoT smart greenhouse app for Bank Indonesia (real-time monitoring)',
      'Built NFC-based applications and Bluetooth-controlled robot systems',
      'Implemented AI-integrated learning platform using Gemini API',
      'Improved WebSocket reliability → reduced latency and connection drops',
      'Applied MVVM and BLoC/Cubit architecture across projects',
    ],
  },
  {
    hash: '2a1f8c0',
    author: 'Septa Alfauzan',
    dateRange: 'Feb 2024 — Jul 2024',
    subject: 'Mobile Developer Mentor @ Bangkit Academy (by Google)',
    body: 'Mentored and guided Android development students at scale.',
    bullets: [
      'Led 23 students with 4.81/5 mentorship rating',
      'Teaching Assistant for 14 instructor-led sessions (4.95/5 rating)',
      'Helped increase graduation rate to 93%',
    ],
  },
  {
    hash: '4e0b2a9',
    author: 'Septa Alfauzan',
    dateRange: 'Aug 2023 — Sep 2023',
    subject: 'Android Developer Intern @ Algostudio',
    body: 'Early-stage experience building and managing mobile projects.',
    bullets: [
      'Developed employee attendance application',
      'Designed user-friendly UI based on user requirements',
      'Led intern team using Agile methodology and Jira',
    ],
  },
]
