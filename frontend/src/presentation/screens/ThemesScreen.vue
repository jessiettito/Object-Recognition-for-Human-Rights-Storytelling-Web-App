<!-- frontend/src/presentation/screens/ThemesScreen.vue -->
<template>
  <main class="themesScreen" role="main" aria-label="Themes screen">

    <section class="contentArea" aria-labelledby="title">
      <div class="card">
        <h1 id="title" class="title">{{ screenText.title }}</h1>

        <p class="body">
          {{ screenText.body }}
        </p>

        <div v-if="selectionText" class="selection">
          <span class="pill">{{ selectionText }}</span>
        </div>

        <div class="buttons">
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
const imageDataUrl = computed(() => navigationState.value.imageDataUrl || "");

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
.themesScreen {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.contentArea {
  position: relative;
  z-index: 2;
  height: 100%;
  display: grid;
  place-items: center;
  padding: clamp(16px, 4vw, 48px);
}

.card {
  width: min(980px, 92vw);
  text-align: center;
  padding: clamp(16px, 2.6vw, 28px);
  border-radius: 22px;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.38);
}

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

.pill {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.buttons {
  margin: 18px auto 0 auto;
  display: grid;
  gap: 12px;
  width: min(560px, 92vw);
}

.smallMeta {
  margin-top: 14px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.78;
}
</style>