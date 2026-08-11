<script setup lang="ts">
import { experiences } from '@/data/experience'
</script>

<template>
  <section class="panel">
    <div class="log-list">
      <article v-for="e in experiences" :key="e.hash" class="commit">
        <div class="commit-meta">
          <span class="hash">{{ e.hash }}</span>
          <span v-if="e.refs" class="refs">{{ e.refs }}</span>
          <div class="line2">Author: {{ e.author }} &nbsp;·&nbsp; Date: {{ e.dateRange }}</div>
        </div>
        <h3 class="commit-subject">{{ e.subject }}</h3>
        <p class="commit-body">{{ e.body }}</p>
        <ul v-if="e.bullets.length" class="commit-bullets">
          <li v-for="(b, i) in e.bullets" :key="i">{{ b }}</li>
        </ul>
      </article>
    </div>
  </section>
</template>
