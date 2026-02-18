<!-- frontend/src/presentation/screens/WelcomeScreen.vue -->
<template>
  <main class="welcomeScreen" role="main" aria-label="Welcome screen">
    <div class="backgroundLayers" aria-hidden="true">
      <div class="backgroundPhoto" :style="backgroundStyle"></div>
      <div class="backgroundPhotoBlur" :style="backgroundStyle"></div>
      <div class="backgroundDarkenOverlay"></div>
    </div>

    <header class="topBar">
      <div class="brand" aria-label="App name">
        <span class="dot" aria-hidden="true"></span>
        <span class="title">{{ appTitle }}</span>
      </div>

      <div class="languageToggle" role="group" aria-label="Language">
        <button
          class="languageButton"
          :class="{ active: selectedLanguage === 'en' }"
          type="button"
          @click="changeLanguage('en')"
        >
          Eng
        </button>
        <button
          class="languageButton"
          :class="{ active: selectedLanguage === 'fr' }"
          type="button"
          @click="changeLanguage('fr')"
        >
          Fra
        </button>
      </div>
    </header>

    <section class="centerArea" aria-labelledby="welcomeTitle">
      <div class="centerCard">
        <h1 id="welcomeTitle" class="welcomeTitle">{{ screenText.title }}</h1>

        <div class="buttonGroup">
          <button class="mainButton startButton" type="button" @click="emit('startScan')">
            {{ screenText.startButtonText }}
          </button>

          <button class="mainButton chooseButton" type="button" @click="emit('skipScan')">
            {{ screenText.chooseButtonText }}
          </button>
        </div>

        <div class="prototypeLabel">{{ screenText.footerNote }}</div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from "vue";

// Direct imports 
import cmhrExteriorPhoto from "../../assets/backgrounds/CMHR_exterior.jpg";
import cmhrInteriorPhoto from "../../assets/backgrounds/CMHR_interior.jpg";

const props = defineProps({
  appTitle: { type: String, default: "Human Rights Object Stories" },

  backgroundName: { type: String, default: "CMHR_exterior.jpg" },

  // "en" or "fr"
  defaultLanguage: { type: String, default: "en" },
});

const emit = defineEmits(["startScan", "skipScan", "languageChange"]);

const selectedLanguage = ref(props.defaultLanguage === "fr" ? "fr" : "en");

function changeLanguage(newLanguage) {
  selectedLanguage.value = newLanguage;
  emit("languageChange", newLanguage);
}

const textByLanguage = {
  en: {
    title: "Welcome!",
    startButtonText: "Start scanning",
    chooseButtonText: "Choose an object instead",
    footerNote: "Prototype experience",
  },
  fr: {
    title: "Bienvenue!",
    startButtonText: "Commencer le scan",
    chooseButtonText: "Choisir plutôt un objet",
    footerNote: "Expérience prototype",
  },
};

const screenText = computed(() => textByLanguage[selectedLanguage.value]);

const backgroundPhotoByName = {
  "CMHR_exterior.jpg": cmhrExteriorPhoto,
  "CMHR_interior.jpg": cmhrInteriorPhoto,
};

const chosenBackgroundPhotoUrl = computed(() => {
  return backgroundPhotoByName[props.backgroundName] ?? cmhrExteriorPhoto;
});

const backgroundStyle = computed(() => ({
  backgroundImage: `url("${chosenBackgroundPhotoUrl.value}")`,
}));
</script>

<style scoped>
:global(html, body, #app) {
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: hidden;
}
:global(*) {
  box-sizing: border-box;
}

.welcomeScreen {
  height: 100svh;
  width: 100%;
  position: relative;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.92);
  background: #07070a;
}

/* Background */
.backgroundLayers {
  position: absolute;
  inset: 0;
}

.backgroundPhoto,
.backgroundPhotoBlur {
  background-size: cover;
  background-position: center 30%;
}

.backgroundPhoto {
  position: absolute;
  inset: 0;
  transform: scale(1.02);
  opacity: 1;
}

.backgroundPhotoBlur {
  position: absolute;
  inset: 0;
  transform: scale(1.08);
  filter: blur(10px);
  opacity: 0.12;
}

.backgroundDarkenOverlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(900px 600px at 50% 35%, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.30)),
    linear-gradient(180deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.32) 85%);
}

/* Top bar */
.topBar {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding-top: calc(clamp(12px, 2.6vw, 22px) + env(safe-area-inset-top));
  padding-bottom: clamp(12px, 2.6vw, 22px);

  padding-left: calc(clamp(14px, 3.8vw, 40px) + env(safe-area-inset-left));
  padding-right: calc(clamp(14px, 3.8vw, 40px) + env(safe-area-inset-right));
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
}

.title {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.01em;
}

/* Language handle */
.languageToggle {
  display: inline-flex;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(10px);
}

.languageButton {
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.86);
  padding: 10px 14px;
  font-weight: 900;
  cursor: pointer;
}

.languageButton.active {
  background: rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.98);
}

.languageButton:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.7);
  outline-offset: 2px;
}

/* Center content */
.centerArea {
  position: relative;
  z-index: 2;
  height: calc(100svh - 80px);
  display: grid;
  place-items: center;
  padding: clamp(16px, 4vw, 48px);
}

.centerCard {
  width: min(820px, 92vw);
  text-align: center;
}

.welcomeTitle {
  margin: 0;
  font-size: clamp(40px, 6vw, 92px);
  line-height: 1.02;
  letter-spacing: -0.02em;
  text-shadow: 0 12px 34px rgba(0, 0, 0, 0.65);
}

/* Buttons */
.buttonGroup {
  margin: clamp(16px, 2.6vw, 22px) auto 0 auto;
  display: grid;
  gap: 12px;
  width: min(560px, 92vw);
}

.mainButton {
  width: 100%;
  border: 0;
  border-radius: 14px;
  padding: 14px 16px;
  font-size: 16px;
  font-weight: 950;
  cursor: pointer;
  transition: transform 120ms ease, filter 120ms ease;
}

.mainButton:active {
  transform: translateY(1px);
}

.mainButton:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.7);
  outline-offset: 2px;
}

.startButton {
  color: rgba(0, 0, 0, 0.92);
  background: linear-gradient(90deg, #a7f3d0, #60a5fa);
}

.chooseButton {
  color: rgba(255, 255, 255, 0.94);
  background: rgba(0, 0, 0, 0.46);
  border: 1px solid rgba(255, 255, 255, 0.22);
}

.prototypeLabel {
  margin-top: 14px;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.78;
}
</style>
