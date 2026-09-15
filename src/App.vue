<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import EditorWindow from '@/components/editor/EditorWindow.vue'

const route = useRoute()
const standalone = computed(() => route.meta.standalone === true)
</script>

<template>
  <RouterView v-if="standalone" />
  <EditorWindow v-else />
</template>