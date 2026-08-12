<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FILES, activeFileMeta, detailFileMeta } from '@/composables/useEditorTabs'
import { useProjectsStore } from '@/modules/projects/presentation/projects.store'

const route = useRoute()
const router = useRouter()
const store = useProjectsStore()

const isDetail = computed(
  () => route.path.startsWith('/projects/') && route.path !== '/projects',
)
const active = computed(() => activeFileMeta(route.path, store.currentProject?.name ?? null))
const detail = computed(() =>
  isDetail.value ? detailFileMeta(store.currentProject?.name ?? null) : null,
)

function go(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="tabbar" role="tablist" aria-label="Open files">
    <button
      v-for="f in FILES"
      :key="f.route"
      type="button"
      role="tab"
      class="tab"
      :class="{ active: active.route === f.route }"
      :aria-selected="active.route === f.route"
      @click="go(f.route)"
    >
      <span class="dot" :style="{ background: f.dot }"></span>{{ f.file }}<span class="x" aria-hidden="true">×</span>
    </button>
    <button
      v-if="detail"
      type="button"
      role="tab"
      class="tab active"
      aria-selected="true"
    >
      <span class="dot" :style="{ background: detail.dot }"></span>{{ detail.file }}<span class="x" aria-hidden="true">×</span>
    </button>
  </div>
</template>
