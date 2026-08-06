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
    class="project-grid"
    aria-busy="true"
    aria-label="Loading projects"
  >
    <div v-for="n in 3" :key="n" class="terminal-card project-skeleton">
      <div class="skeleton-block skeleton-image" />
      <div class="skeleton-block" />
      <div class="skeleton-block skeleton-line" />
    </div>
  </div>

  <div v-else-if="error" class="project-status" role="status">
    <p>{{ error }}</p>
    <button class="btn btn-default" @click="emit('retry')">retry</button>
  </div>

  <div v-else-if="projects.length === 0" class="project-status" role="status">
    <p>No projects yet</p>
  </div>

  <div v-else class="project-grid">
    <ProjectCard
      v-for="project in projects"
      :key="project.id"
      :project="project"
      @open="openProject"
    />
  </div>
</template>

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.project-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
}

.skeleton-block {
  height: 1rem;
  border-radius: 4px;
  background: rgba(181, 222, 255, 0.15);
  animation: skeletonPulse 1.2s ease-in-out infinite;
}

.skeleton-image {
  height: 140px;
  width: 100%;
}

.skeleton-line {
  width: 60%;
}

.project-status {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
}

@keyframes skeletonPulse {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}
</style>
