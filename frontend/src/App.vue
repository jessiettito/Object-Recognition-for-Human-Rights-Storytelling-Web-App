<template>
  <div class="appShell">
    <AppHeader
      :title="appTitle"
      :language="currentLanguage"
      @update:language="currentLanguage = $event"
    />

    <!-- Show whichever screen matches the route -->
    <RouterView v-slot="{ Component }">
      <component
        :is="Component"
        :appTitle="appTitle"
        :language="currentLanguage"
      />
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

