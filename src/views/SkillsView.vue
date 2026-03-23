<script setup lang="ts">
import SkillItem from '@/components/SkillItem.vue';
const mobileDevItems = ['Flutter', 'Android (Jetpack Compose, SDK)'];
const architectureItems = [
  'MVVM', 'Clean Architecture', 'BLoC/Cubit'
];
const backendIntegrationItems = [
'REST API', 'WebSocket', 'Firebase, Micro CMS'
];
const webDevItems = [
  
'React.JS', 'Next.JS'
];
const toolItems = [
'Git', 'Jira', 'CI/CD', 'TestFlight', 'Firebase App Distribution',
];

</script>

<template>
  <div
  style="display: block;">
  <h2>Skills</h2>
  
  <SkillItem title="Mobile Development" :items="mobileDevItems" />
  <SkillItem title="Architecture" :items="architectureItems" />
  <SkillItem title="Backend & Integration" :items="backendIntegrationItems" />
  <SkillItem title="Web Development" :items="mobileDevItems" />
  <SkillItem title="Tools" :items="toolItems" />
</div>
</template>
