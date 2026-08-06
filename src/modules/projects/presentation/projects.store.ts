import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Project } from '../domain/project.model'
import { getProjectByIdUseCase, getProjectsUseCase } from './di'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const currentProject = ref<Project | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadProjects() {
    loading.value = true
    error.value = null
    try {
      projects.value = await getProjectsUseCase.execute()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load projects'
    } finally {
      loading.value = false
    }
  }

  let detailRequestSeq = 0

  async function loadProjectDetail(id: string) {
    const seq = ++detailRequestSeq
    loading.value = true
    error.value = null
    currentProject.value = null
    try {
      const project = await getProjectByIdUseCase.execute(id)
      if (seq !== detailRequestSeq) return
      currentProject.value = project
    } catch (e) {
      if (seq !== detailRequestSeq) return
      error.value = e instanceof Error ? e.message : 'Failed to load project'
    } finally {
      if (seq === detailRequestSeq) loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    projects,
    currentProject,
    loading,
    error,
    loadProjects,
    loadProjectDetail,
    clearError,
  }
})
