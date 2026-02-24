<template>
  <header class="topBar" role="banner">
    <div class="brand" aria-label="Appname">
      <span class="dot" aria-hidden="true"></span>
      <span class="title">{{ title }}</span>
    </div>

    <div class="languageToggle" role="group" aria-label="Language">
      <button
        class="languageButton"
        :class="{ active: language === 'en' }"
        type="button"
        @click="setLanguage('en')"
      >
        Eng
      </button>
      <button
        class="languageButton"
        :class="{ active: language === 'fr' }"
        type="button"
        @click="setLanguage('fr')"
      >
        Fra
      </button>
    </div>
  </header>
</template>

<script setup>

// Shared header used on every screen
const props = defineProps({
  title: { type: String, default: "Human Rights Object Stories" },
  language: { type: String, default: "en" }, // english by default 
});

const emit = defineEmits(["update:language"]);

// Language change handler 
function setLanguage(nextLanguage) {
  if (nextLanguage === props.language) return;
  emit("update:language", nextLanguage);
}
</script>

