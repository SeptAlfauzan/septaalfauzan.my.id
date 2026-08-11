<script setup lang="ts">
import { computed } from 'vue'
import CodeBlock from '@/components/shared/CodeBlock.vue'
import { profile, aboutCodeLines } from '@/data/profile'
import { useTypewriter } from '@/composables/useTypewriter'

const typed = useTypewriter("// Hello, I'm Septa Alfauzan 👋")
const lines = computed(() => aboutCodeLines(typed.text.value))
</script>

<template>
  <section class="panel">
    <div class="split">
      <div class="code-col">
        <CodeBlock :lines="lines" :cursor="!typed.done" />
      </div>

      <div class="preview-card">
        <div class="avatar">SA</div>
        <h3>{{ profile.name }}</h3>
        <div class="role">{{ profile.tagline }}</div>
        <a
          :href="profile.resumeUrl"
          target="_blank"
          rel="noopener"
          class="btn primary"
        >
          ↓ Download Résumé
        </a>
        <div class="pill-row">
          <span v-for="s in profile.stack" :key="s" class="pill">{{ s }}</span>
        </div>
        <div class="stat-line">
          <template v-for="(stat, i) in profile.stats" :key="i">
            {{ stat.before }}<b>{{ stat.bold }}</b>{{ stat.after }}<br />
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
