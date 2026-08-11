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
  font-size: 13px;
  color: var(--text);
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  margin: 1rem 0 0.5rem;
  color: var(--text-bright);
}

.markdown-body :deep(h2) {
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.25rem;
}

.markdown-body :deep(a) {
  color: var(--blue);
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 1.5rem;
}

.markdown-body :deep(code) {
  background: var(--bg-hover);
  padding: 0.125rem 0.25rem;
}
</style>
