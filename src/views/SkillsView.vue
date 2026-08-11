<script setup lang="ts">
import { skillGroups } from '@/data/skills'
</script>

<template>
  <section class="panel">
    <div class="yaml-block">
      <div v-for="g in skillGroups" :key="g.key" class="yaml-group">
        <div><span class="yaml-key">{{ g.key }}:</span></div>
        <div v-for="item in g.items" :key="item">
          <span class="yaml-dash">&nbsp;&nbsp;-</span> <span class="yaml-val">{{ item }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
