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
  <section class="panel">
    <div class="json-line">
      <span class="k">"projects"</span>: <span class="tok-punc">[</span>
      <span class="tok-com">// {{ projects.length }} shipped — click a card for details</span>
    </div>
    <ProjectGrid
      :projects="projects"
      :loading="loading"
      :error="error"
      @open="openProject"
      @retry="store.loadProjects"
    />
  </section>
</template>
