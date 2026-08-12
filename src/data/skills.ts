export interface SkillGroup {
  key: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  { key: 'mobile_development', items: ['Flutter', 'Android (Jetpack Compose, SDK)'] },
  { key: 'architecture', items: ['MVVM', 'Clean Architecture', 'BLoC / Cubit'] },
  { key: 'backend_integration', items: ['REST API', 'WebSocket', 'Firebase, Micro CMS'] },
  {
    key: 'tools',
    items: ['Git', 'Jira', 'CI/CD', 'TestFlight', 'Firebase App Distribution'],
  },
]
