<script setup lang="ts">
import CodeBlock from '@/components/shared/CodeBlock.vue'
import { contact, contactMdLines } from '@/data/contact'
</script>

<template>
  <section class="panel">
    <div class="split">
      <div class="code-col">
        <CodeBlock :lines="contactMdLines()" />
      </div>

      <div class="preview-card contact-preview">
        <h3>Let's work together.</h3>
        <p>Preview — this is how contact.md renders.</p>
        <div class="contact-row">
          <span>Email</span>
          <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
        </div>
        <div class="contact-row">
          <span>Phone</span>
          <a :href="contact.phoneHref">{{ contact.phone }}</a>
        </div>
        <div class="social-row">
          <a
            v-for="s in contact.socials"
            :key="s.label"
            :href="s.url"
            target="_blank"
            rel="noopener"
          >
            {{ s.label }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
