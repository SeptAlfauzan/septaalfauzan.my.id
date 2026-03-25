<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { gsap } from "gsap"
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"
import { TextPlugin } from "gsap/TextPlugin";


gsap.registerPlugin(ScrambleTextPlugin)
gsap.registerPlugin(TextPlugin)

onMounted(() => {
  const element = document.getElementById('scramble-header');
  
  if (element) {
    gsap.to(element, {
      duration: 1, 
      // repeat: -1,
      delay: 1,
      
      scrambleText: {
        
        text: "Im Septa Alfauzan", 
        chars: "XO", 
        // revealDelay: 0.5, 
        speed: 0.5, 
        // newClass: "myClass"
      }
    });
  }
  



const tl = gsap.timeline({ repeat: -1, repeatDelay: 3.5 }); // repeat: -1 loops forever


tl.to(".type-effect", {
  duration: 2,
  text: {
     value: "Software engineer specializing in mobile development for both native and multiplatform app development",
    delimiter: "",
    speed: 0.5,
  },
  ease: "none"
})
.to(".type-effect", {
  duration: 1.5,
  text: {
    value: "",
    rtl: true,
    delimiter: "",
    speed: 0.5,
  },
  ease: "none",
  delay: 10 // pause before deleting
});
})

</script>

<template>

    <div class="wrapper">
      <h1>Hello, <span id="scramble-header">I am</span></h1>
      <h2 class="type-effect terminal-prompt"></h2>
      <p>With 2+ years experience in mobile development, I build production-ready apps used by real users — from SIM management platforms to IoT systems and enterprise tools. Currently working with international clients and shipping apps to Play Store & App Store.</p>
      <a
      href="https://drive.google.com/file/d/1Ubv2crCzDHV0yKea2qPwq3jtaPdim1vm/view?usp=sharing"
      target="blank"
      class="btn btn-default btn-ghost"
      >Download My Resume</a>
      <nav class="main-nav">
        <RouterLink active-class="active-router"  to="/">/</RouterLink>
        <RouterLink active-class="active-router"  to="/about">About</RouterLink>
        <RouterLink  active-class="active-router" to="/experiences">Experiences</RouterLink>
        <RouterLink active-class="active-router" to="/skills">Skills</RouterLink>
        <RouterLink  active-class="active-router" to="/contacts">Contacts</RouterLink>
      </nav>
    </div>
    

  <div id="router-content">
    <RouterView/>
  </div>
</template>