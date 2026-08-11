<script setup lang="ts">
import type { Project } from '@/modules/projects/domain/project.model'

defineProps<{ project: Project }>()

const emit = defineEmits<{ open: [id: string] }>()
</script>

<template>
  <article class="card" @click="emit('open', project.id)">
    <img
      v-if="project.images[0]"
      :src="project.images[0].url"
      :alt="project.name"
      class="card-thumb"
    />
    <div v-else class="card-thumb card-thumb--placeholder" aria-hidden="true">SA</div>
    <div class="card-body">
      <h4>{{ project.name }}</h4>
      <p>{{ project.description }}</p>
      <button type="button" class="card-link" @click.stop="emit('open', project.id)">
        → view details
      </button>
    </div>
  </article>
</template>
