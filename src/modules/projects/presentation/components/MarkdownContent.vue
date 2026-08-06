<script setup lang="ts">
import { computed } from 'vue'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

const props = defineProps<{ markdown: string }>()

const html = computed(() =>
  DOMPurify.sanitize(marked.parse(props.markdown, { async: false }) as string),
)
</script>

<template>
  <div class="markdown-body" v-html="html" />
</template>

<style scoped>
.markdown-body {
  margin-top: 1.5rem;
  line-height: 1.6;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  margin: 1rem 0 0.5rem;
}

.markdown-body :deep(h2) {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.25rem;
}

.markdown-body :deep(a) {
  color: #1a95e1;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 1.5rem;
}

.markdown-body :deep(code) {
  background: rgba(181, 222, 255, 0.15);
  padding: 0.125rem 0.25rem;
}
</style>
