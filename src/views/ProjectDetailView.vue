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
  <section class="panel">
    <RouterLink to="/projects" class="card-link">← back to projects</RouterLink>

    <div v-if="loading" class="detail-desc" aria-busy="true">
      <p>Loading project…</p>
    </div>

    <div v-else-if="error" class="detail-desc" role="status">
      <p>{{ error }}</p>
      <button type="button" class="card-link" @click="retry">retry</button>
    </div>

    <article v-else-if="currentProject">
      <h2 class="detail-title">{{ currentProject.name }}</h2>
      <div class="detail-meta">published {{ currentProject.publishedAt.slice(0, 10) }}</div>
      <ProjectCarousel :images="currentProject.images" :alt="currentProject.name" />
      <p class="detail-desc">{{ currentProject.description }}</p>
      <MarkdownContent
        v-if="currentProject.markdownAdditionals"
        :markdown="currentProject.markdownAdditionals"
      />
    </article>

    <div v-else class="detail-desc" role="status">
      <p>Project not found.</p>
      <RouterLink to="/projects" class="card-link">← back to projects</RouterLink>
    </div>
  </section>
</template>
