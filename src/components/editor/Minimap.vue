<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
const widths = [40, 65, 30, 80, 55, 20, 70, 45, 60, 35, 75, 50, 25, 65, 40]
</script>

<template>
  <div class="minimap" aria-hidden="true">
    <span v-for="(w, i) in widths" :key="i" :style="{ width: w + '%' }"></span>
  </div>
</template>
