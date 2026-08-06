<template>
    <ul>
    <h5>
    {{ title }}
    </h5>
    <li v-for="(item, index) in items" :key="index">
  {{ item }}
</li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  items: string[]
}>()
</script>