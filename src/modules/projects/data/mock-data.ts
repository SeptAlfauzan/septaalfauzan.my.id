import type { ProjectDto } from './types'

export const mockProjects: ProjectDto[] = [
  {
    id: '8_ak9spxa08c',
    createdAt: '2026-08-05T10:26:23.766Z',
    updatedAt: '2026-08-05T10:26:23.766Z',
    publishedAt: '2026-08-05T10:26:23.766Z',
    revisedAt: '2026-08-05T10:26:23.766Z',
    projectName: 'dummy',
    projectDesc:
      'lorem ipsum doaLorem ipsum dolor sit amet, duis aliquip aliqua ad velit. Duis anim sed aute in ullamco tempor minim cupidatat id do. Cillum qui enim incididunt deserunt laboris in id et in proident sunt. Commodo sed qui pariatur nulla in ut cillum voluptate est incididunt dolore sunt. Aliquip cillum mollit id fugiat velit eiusmod cupidatat in deserunt in excepteur.\n\nIncididunt quis consequat quis nulla irure anim officia aliqua in in. Labore dolore aliquip culpa ut quis tempor pariatur proident deserunt. Magna ut excepteur anim consectetur culpa labore pariatur in sunt enim aute ea. Ut nisi voluptate dolor magna laboris labore commodo pariatur proident.\n\nDolore id veniam eiusmod fugiat in ut cupidatat aliquip quis. Ut duis excepteur incididunt proident quis nostrud culpa. Tempor excepteur pariatur reprehenderit esse veniam esse duis ex in. Et in irure irure duis ad nisi magna irure. Ad irure ea duis culpa nulla occaecat velit. Nulla in ut nulla ut laboris consequat non magna velit reprehenderit in.',
    markdownAdditionals:
      '# Useful Links\n\n## 📱 Google Play Store\nDownload the app here:\nhttps://play.google.com/store/apps/details?id=com.example.myapp\n\n## 💬 Reddit Discussion\nJoin the discussion:\nhttps://www.reddit.com/r/androiddev/comments/abcdef/example_post_title/\n\n## Alternative Markdown Format\n\n- **Play Store:** <https://play.google.com/store/apps/details?id=com.example.myapp>\n- **Reddit:** <https://www.reddit.com/r/androiddev/comments/abcdef/example_post_title/>',
    images: {
      fieldId: 'carouselImages',
      images: [
        {
          url: 'https://images.microcms-assets.io/assets/da58f335d548467a9a561bf3a1f9438c/74067a2485f64a5f93e84c4596effb78/feature-graphic%20(1).png',
          height: 500,
          width: 1024,
        },
        {
          url: 'https://images.microcms-assets.io/assets/da58f335d548467a9a561bf3a1f9438c/0a5144b79d384e33812558e9cf42d7d2/virgil.jpeg',
          height: 358,
          width: 637,
        },
      ],
    },
  },
  {
    id: 'proj_hris',
    createdAt: '2025-01-15T08:00:00.000Z',
    updatedAt: '2025-06-01T08:00:00.000Z',
    publishedAt: '2025-03-10T08:00:00.000Z',
    revisedAt: '2025-06-01T08:00:00.000Z',
    projectName: 'HRIS Mobile Platform',
    projectDesc:
      'End-to-end HRIS mobile system covering attendance, payroll, and employee workflows. Handled the full lifecycle from requirements through CI/CD to Play Store and App Store deployment, reducing manual operations through digitalization of internal business processes.',
    markdownAdditionals:
      '# Useful Links\n\n## 🏢 Company\n- **Official Site:** https://example.com/hris\n\n## 🔧 Features\n- Attendance tracking with geolocation\n- Payroll review and payslip history\n- Employee leave management\n- Push notification reminders',
    images: {
      fieldId: 'carouselImages',
      images: [
        { url: 'https://picsum.photos/seed/hris-1/1024/500', height: 500, width: 1024 },
        { url: 'https://picsum.photos/seed/hris-2/637/358', height: 358, width: 637 },
      ],
    },
  },
  {
    id: 'proj_iot',
    createdAt: '2024-06-01T08:00:00.000Z',
    updatedAt: '2024-11-20T08:00:00.000Z',
    publishedAt: '2024-08-15T08:00:00.000Z',
    revisedAt: '2024-11-20T08:00:00.000Z',
    projectName: 'Smart Greenhouse IoT',
    projectDesc:
      'IoT smart greenhouse app for Bank Indonesia with real-time sensor monitoring. Integrated WebSocket for live telemetry, reducing latency and connection drops while enabling remote greenhouse control from a mobile app.',
    markdownAdditionals:
      '# Useful Links\n\n## 🌱 Project Demo\n- **Live Demo:** https://example.com/greenhouse\n- **GitHub:** https://github.com/septAlfauzan/smart-greenhouse\n\n## 📊 Tech Stack\n- Flutter\n- WebSocket\n- MQTT / IoT sensors',
    images: {
      fieldId: 'carouselImages',
      images: [
        { url: 'https://picsum.photos/seed/greenhouse-1/1024/500', height: 500, width: 1024 },
        { url: 'https://picsum.photos/seed/greenhouse-2/637/358', height: 358, width: 637 },
      ],
    },
  },
]
