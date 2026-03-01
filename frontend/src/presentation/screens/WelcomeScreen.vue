<template>
  <main class="welcomeScreen" role="main" aria-label="Welcome screen">
   
    <!-- Center content with welcome message and buttons -->
    <section class="centerArea" aria-labelledby="welcomeTitle">
      <div class="centerCard">
        <h1 id="welcomeTitle" class="welcomeTitle">{{ screenText.title }}</h1>

        <div class="buttonGroup">
          <button class="mainButton startButton" type="button" @click="$router.push('/capture')">
            {{ screenText.startButtonText }}
          </button>

          <button class="mainButton chooseButton" type="button" @click="$router.push('/list')">
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
import { useRouter } from 'vue-router'
const router = useRouter();

const props = defineProps({
  appTitle: { type: String, default: "Human Rights Object Stories" },
  language: { type: String, default: "en" },
});


const textByLanguage = {
  en: {
    title: "Welcome!",
    startButtonText: "Start scanning!",
    chooseButtonText: "Choose an object instead",
    footerNote: "Prototype experience",
  },
  fr: {
    title: "Bienvenue!",
    startButtonText: "Commencer le scan!",
    chooseButtonText: "Choisir plutôt un objet",
    footerNote: "Expérience prototype",
  },
};

const screenText = computed(() => (props.language === "fr" ? textByLanguage.fr : textByLanguage.en));

//router control
function startScan() {
  router.push('/capture')
}

function skipScan() {
  router.push('/list')
}

</script>

<style scoped>
.welcomeScreen {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.92);
  background: #07070a;
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
