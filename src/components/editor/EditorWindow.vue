<script setup lang="ts">
import TitleBar from './TitleBar.vue'
import ActivityBar from './ActivityBar.vue'
import FileExplorer from './FileExplorer.vue'
import TabBar from './TabBar.vue'
import StatusBar from './StatusBar.vue'
import Minimap from './Minimap.vue'
</script>

<template>
  <div class="window">
    <TitleBar />
    <div class="body">
      <ActivityBar />
      <FileExplorer />
      <div class="editor">
        <TabBar />
        <div class="editor-content">
          <RouterView v-slot="{ Component }">
            <Transition name="panel" mode="out-in">
              <component :is="Component" :key="$route.fullPath" />
            </Transition>
          </RouterView>
        </div>
      </div>
      <Minimap />
    </div>
    <StatusBar />
  </div>
</template>
