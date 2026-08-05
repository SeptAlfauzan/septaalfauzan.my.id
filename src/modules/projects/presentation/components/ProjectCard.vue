<script setup lang="ts">
import type { Project } from '@/modules/projects/domain/project.model'

defineProps<{ project: Project }>()

const emit = defineEmits<{ open: [id: string] }>()
</script>

<template>
  <article class="terminal-card project-card">
    <img
      v-if="project.images[0]"
      :src="project.images[0].url"
      :alt="project.name"
      class="project-thumb"
    />
    <div class="project-body">
      <h3 class="project-name">{{ project.name }}</h3>
      <p class="project-desc">{{ project.description }}</p>
      <button class="btn btn-default" @click="emit('open', project.id)">
        check details
      </button>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.project-thumb {
  display: block;
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.project-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  flex: 1;
}

.project-name {
  margin: 0;
}

.project-desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-body .btn {
  margin-top: auto;
  align-self: flex-start;
}
</style>
