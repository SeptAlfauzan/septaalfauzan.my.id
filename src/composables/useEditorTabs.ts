export interface FileMeta {
  route: string
  file: string
  dot: string
  lang: string
  pos: string
}

export const FILES: FileMeta[] = [
  { route: '/about', file: 'about.dart', dot: 'var(--blue)', lang: 'Dart', pos: 'Ln 33, Col 2' },
  { route: '/experiences', file: 'experience.log', dot: 'var(--text-muted)', lang: 'Log', pos: 'Ln 42, Col 1' },
  { route: '/projects', file: 'projects.json', dot: 'var(--yellow)', lang: 'JSON', pos: 'Ln 4, Col 1' },
  { route: '/skills', file: 'skills.yaml', dot: 'var(--purple)', lang: 'YAML', pos: 'Ln 19, Col 1' },
  { route: '/contacts', file: 'contact.md', dot: 'var(--blue)', lang: 'Markdown', pos: 'Ln 11, Col 1' },
]

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function detailFileMeta(projectName: string | null): FileMeta {
  return {
    route: '/projects/:id',
    file: `${projectName ? slugify(projectName) : 'project'}.md`,
    dot: 'var(--cyan)',
    lang: 'Markdown',
    pos: 'Ln 12, Col 1',
  }
}

export function activeFileMeta(routePath: string, projectName: string | null): FileMeta {
  if (routePath.startsWith('/projects/') && routePath !== '/projects') {
    return detailFileMeta(projectName)
  }
  return FILES.find((f) => routePath.startsWith(f.route)) ?? FILES[0]!
}
