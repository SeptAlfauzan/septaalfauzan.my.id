<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h1>{{ msg }}</h1>
    <p class="subtitle">
      Gruvbox hues, tactile gradients, and a type stack built for focus. Remix the layout, keep the
      warmth.
    </p>
  </div>
</template>

<style scoped>
.greetings {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

h1 {
  font-weight: 600;
  font-size: clamp(2.4rem, 4vw, 3.6rem);
  background: linear-gradient(120deg, rgba(251, 241, 199, 0.95), rgba(215, 153, 33, 0.95));
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 0.02em;
}

.subtitle {
  font-size: 1.05rem;
  color: var(--color-muted);
  max-width: 46ch;
}

@media (max-width: 600px) {
  h1 {
    text-align: left;
  }
}
</style>
