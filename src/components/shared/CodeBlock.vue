<script setup lang="ts">
import type { CodeLine } from '@/types/code'

defineProps<{
  lines: CodeLine[]
  cursor?: boolean
}>()
</script>

<template>
  <div class="code-block">
    <div v-for="(l, i) in lines" :key="i" class="line">
      <template v-for="(t, j) in l.tokens" :key="j">
        <span :class="t.cls">{{ t.text }}</span>
      </template>
      <span v-if="cursor && i === 0" class="typed-cursor"></span>
    </div>
  </div>
</template>
