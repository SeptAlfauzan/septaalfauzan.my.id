<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'
</script>

<template>
  <header class="titlebar">
    <div class="traffic" aria-hidden="true">
      <span class="r"></span><span class="y"></span><span class="g"></span>
    </div>
    <div class="titlebar-title">
      <b>septa@portfolio</b> — ~/portfolio — code
    </div>
    <ThemeToggle />
  </header>
</template>
