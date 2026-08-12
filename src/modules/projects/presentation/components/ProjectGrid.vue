<script setup lang="ts">
import type { Project } from '@/modules/projects/domain/project.model'
import ProjectCard from './ProjectCard.vue'

defineProps<{
  projects: Project[]
  loading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  open: [id: string]
  retry: []
}>()

function openProject(id: string) {
  emit('open', id)
}
</script>

<template>
  <div
    v-if="loading"
    class="grid"
    aria-busy="true"
    aria-label="Loading projects"
  >
    <div v-for="n in 3" :key="n" class="card">
      <div class="card-thumb card-thumb--placeholder" aria-hidden="true" />
      <div class="card-body">
        <div class="pill">…</div>
      </div>
    </div>
  </div>

  <div v-else-if="error" class="more-note" role="status">
    <p>{{ error }}</p>
    <button type="button" class="card-link" @click="emit('retry')">retry</button>
  </div>

  <div v-else-if="projects.length === 0" class="more-note" role="status">
    <p>No projects yet</p>
  </div>

  <div v-else class="grid">
    <ProjectCard
      v-for="project in projects"
      :key="project.id"
      :project="project"
      @open="openProject"
    />
  </div>
</template>
