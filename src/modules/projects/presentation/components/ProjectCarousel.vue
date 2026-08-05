<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ProjectImage } from '@/modules/projects/data/types'

const props = defineProps<{ images: ProjectImage[]; alt: string }>()

const currentIndex = ref(0)

const currentImage = computed(() => props.images[currentIndex.value])

function next() {
  if (props.images.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

function prev() {
  if (props.images.length === 0) return
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}
</script>

<template>
  <figure v-if="currentImage" class="project-carousel">
    <button
      type="button"
      class="carousel-btn"
      aria-label="Previous image"
      @click="prev"
    >
      ‹
    </button>
    <img :src="currentImage.url" :alt="alt" class="carousel-image" />
    <button
      type="button"
      class="carousel-btn"
      aria-label="Next image"
      @click="next"
    >
      ›
    </button>
    <figcaption class="carousel-counter">
      {{ currentIndex + 1 }} / {{ images.length }}
    </figcaption>
  </figure>
</template>

<style scoped>
.project-carousel {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}

.carousel-image {
  flex: 1;
  min-width: 0;
  max-height: 420px;
  width: 100%;
  object-fit: contain;
}

.carousel-btn {
  flex: 0 0 auto;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}

.carousel-counter {
  text-align: center;
  flex: 0 0 auto;
}
</style>
