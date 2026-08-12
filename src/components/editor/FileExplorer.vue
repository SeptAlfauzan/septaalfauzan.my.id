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
  <nav class="sidebar" aria-label="File explorer">
    <div class="sidebar-label">EXPLORER</div>
    <div class="tree-folder">
      <span class="chev" aria-hidden="true">▾</span> PORTFOLIO
    </div>
    <div class="tree-files">
      <button
        v-for="f in FILES"
        :key="f.route"
        type="button"
        class="tree-file"
        :class="{ active: active.route === f.route }"
        @click="go(f.route)"
      >
        <span class="dot" :style="{ background: f.dot }"></span>{{ f.file }}
      </button>
      <button v-if="detail" type="button" class="tree-file active">
        <span class="dot" :style="{ background: detail.dot }"></span>{{ detail.file }}
      </button>
    </div>
    <div class="sidebar-note">
      Surabaya, Indonesia<br />
      Mobile Engineer · Flutter &amp; Native
    </div>
  </nav>
</template>
