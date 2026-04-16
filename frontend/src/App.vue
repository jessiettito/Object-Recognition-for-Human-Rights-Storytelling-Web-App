<template>
  <div class="appShell">
    <AppHeader
      :title="appTitle"
      :language="currentLanguage"
      @update:language="currentLanguage = $event"
    />

    <!-- Show whichever screen matches the route -->
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <component
          :is="Component"
          :key="route.path"
          :appTitle="appTitle"
          :language="currentLanguage"
        />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterView } from "vue-router";
import AppHeader from "./components/Header.vue";

const appTitle = "Human Rights Object Stories";
const currentLanguage = ref("en"); // shared language for all screens
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
