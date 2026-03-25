<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
    <div class="wrapper">
      <h1>Hello, Im Septa Alfauzan</h1>
      <h2>Mobile Developer specializing in native and multiplatform app development</h2>
      <p>With 2+ years experience in mobile development, I build production-ready apps used by real users — from SIM management platforms to IoT systems and enterprise tools. Currently working with international clients and shipping apps to Play Store & App Store.</p>
      <a href="https://drive.google.com/file/d/1Ubv2crCzDHV0yKea2qPwq3jtaPdim1vm/view?usp=sharing" 
      target="blank"
      class="btn btn-default btn-ghost" >Download My Resume</a>
      <nav>
        <RouterLink to="/">/</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/experiences">Experiences</RouterLink>
        <RouterLink to="/skills">Skills</RouterLink>
        <RouterLink to="/contacts">Contacts</RouterLink>
      </nav>
    </div>

  <div id="router-content">
    <RouterView/>
  </div>
</template>
