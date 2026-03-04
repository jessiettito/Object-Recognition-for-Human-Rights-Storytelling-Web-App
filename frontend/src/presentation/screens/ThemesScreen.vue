<!-- frontend/src/presentation/screens/ThemesScreen.vue -->
<template>
  <main class="screen themesScreen" role="main" aria-label="Themes screen">

    <section class="contentArea" aria-labelledby="title">
      <div class="modalCard">
        <h1 id="title" class="title">{{ screenText.title }}</h1>

        <p class="body">
          {{ screenText.body }}
        </p>

        <div v-if="selectionText" class="selection">
          <span class="pill">{{ selectionText }}</span>
        </div>

        <div class="modalButtons">
          <button class="mainButton startButton" type="button" @click="goBack">
            {{ screenText.back }}
          </button>

          <button class="mainButton secondaryButton" type="button" @click="goToCapture">
            {{ screenText.tryAgain }}
          </button>

          <button class="mainButton secondaryButton" type="button" @click="goToList">
            {{ screenText.list }}
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  language: { type: String, default: "en" },
});

const router = useRouter();

const navigationState = computed(() => window.history.state || {});

// coming from ListScreen click handlers (optional)
const selectedType = computed(() => navigationState.value.type || "");
const selectedName = computed(() => navigationState.value.name || "");

const selectionText = computed(() => {
  if (!selectedName.value) return "";
  const prefix = selectedType.value === "topic"
    ? (props.language === "fr" ? "Sujet" : "Topic")
    : (props.language === "fr" ? "Objet" : "Object");
  return `${prefix}: ${selectedName.value}`;
});

const textByLanguage = {
  en: {
    title: "Themes & Prompts",
    body:
      "This screen is under construction",
    back: "Back",
    tryAgain: "Try again",
    list: "Choose from list"
  },
  fr: {
    title: "Thèmes et questions",
    body:
      "Cette page est en cours de construction.",
    back: "Retour",
    tryAgain: "Réessayer",
    list: "Choisir dans la liste"
  },
};

const screenText = computed(() => (props.language === "fr" ? textByLanguage.fr : textByLanguage.en));

function goBack() {
  router.back();
}

function goToCapture() {
  router.push("/capture");
}

function goToList() {
  router.push("/list");
}
</script>

<style scoped>

.title {
  margin: 0;
  font-size: clamp(34px, 5.2vw, 64px);
  line-height: 1.04;
}

.body {
  margin: 14px auto 0 auto;
  max-width: 60ch;
  font-size: 14px;
  opacity: 0.92;
}

.selection {
  margin-top: 14px;
}
</style>