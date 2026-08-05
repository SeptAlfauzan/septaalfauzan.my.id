<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectsStore } from '@/modules/projects/presentation/projects.store'
import MarkdownContent from '@/modules/projects/presentation/components/MarkdownContent.vue'
import ProjectCarousel from '@/modules/projects/presentation/components/ProjectCarousel.vue'

const route = useRoute()
const store = useProjectsStore()
const { currentProject, loading, error } = storeToRefs(store)

const projectId = computed(() => String(route.params.id ?? ''))

onMounted(() => {
  store.loadProjectDetail(projectId.value)
})

watch(projectId, (id) => {
  store.loadProjectDetail(id)
})

function retry() {
  store.loadProjectDetail(projectId.value)
}
</script>

<template>
  <main>
    <RouterLink to="/projects" class="back-link">← projects</RouterLink>

    <div v-if="loading" class="detail-skeleton" aria-busy="true">
      <div class="skeleton-block" />
      <div class="skeleton-block skeleton-wide" />
    </div>

    <div v-else-if="error" class="project-status" role="status">
      <p>{{ error }}</p>
      <button class="btn btn-default" @click="retry">retry</button>
    </div>

    <article v-else-if="currentProject">
      <h2>{{ currentProject.name }}</h2>
      <ProjectCarousel
        :images="currentProject.images"
        :alt="currentProject.name"
      />
      <p class="project-desc">{{ currentProject.description }}</p>
      <MarkdownContent
        v-if="currentProject.markdownAdditionals"
        :markdown="currentProject.markdownAdditionals"
      />
    </article>

    <div v-else class="project-status" role="status">
      <p>Project not found.</p>
      <RouterLink to="/projects" class="btn btn-default">← back to projects</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.back-link {
  display: inline-block;
  margin-bottom: 1rem;
}

.project-desc {
  margin: 1rem 0;
}

.detail-skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.skeleton-block {
  height: 1.5rem;
  border-radius: 4px;
  background: rgba(181, 222, 255, 0.15);
  animation: skeletonPulse 1.2s ease-in-out infinite;
}

.skeleton-wide {
  height: 12rem;
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
