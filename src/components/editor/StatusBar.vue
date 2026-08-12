<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { activeFileMeta } from '@/composables/useEditorTabs'
import { useProjectsStore } from '@/modules/projects/presentation/projects.store'

const route = useRoute()
const store = useProjectsStore()

const meta = computed(() => activeFileMeta(route.path, store.currentProject?.name ?? null))
</script>

<template>
  <footer class="statusbar" aria-hidden="true">
    <div class="left">
      <span class="branch">⎇ main</span>
      <span>0 problems</span>
    </div>
    <div class="right">
      <span class="lang">
        <span class="ldot" :style="{ background: meta.dot }"></span>{{ meta.lang }}
      </span>
      <span>{{ meta.pos }}</span>
      <span>UTF-8</span>
      <span>LF</span>
    </div>
  </footer>
</template>
