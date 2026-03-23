<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>

    <div class="wrapper">
      <h1>Hello, Im Septa Alfauzan</h1>
      <h2>Mobile Developer specializing in native and multiplatform app development</h2>
      <p>I build production-ready apps used by real users — from SIM management platforms to IoT systems and enterprise tools.

Currently working with international clients and shipping apps to Play Store & App Store.</p>

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/experiences">Experiences</RouterLink>
        <RouterLink to="/skills">Skills</RouterLink>
      </nav>
    </div>
  </header>
<RouterView/>
</template>
