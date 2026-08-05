<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectsStore } from '@/modules/projects/presentation/projects.store'
import ProjectGrid from '@/modules/projects/presentation/components/ProjectGrid.vue'

const router = useRouter()
const store = useProjectsStore()
const { projects, loading, error } = storeToRefs(store)

onMounted(() => {
  store.loadProjects()
})

function openProject(id: string) {
  router.push(`/projects/${id}`)
}
</script>

<template>
  <main>
    <h2>Projects</h2>
    <ProjectGrid
      :projects="projects"
      :loading="loading"
      :error="error"
      @open="openProject"
      @retry="store.loadProjects"
    />
  </main>
</template>
