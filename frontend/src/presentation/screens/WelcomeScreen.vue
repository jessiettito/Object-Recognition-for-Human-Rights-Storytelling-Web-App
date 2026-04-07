<template>
  <main class="screen welcomeScreen" role="main" aria-label="Welcome screen">
   
    <!-- Center content with welcome message and buttons -->
    <section class="centerArea" aria-labelledby="welcomeTitle">
      <div class="centerCard">
        <h1 id="welcomeTitle" class="welcomeTitle">{{ screenText.title }}</h1>

        <p class="purposeText">{{ screenText.purpose }}</p>

        <!-- How it works -->
        <ol class="stepsList" aria-label="How it works">
          <li class="stepItem">
            <div class="stepIconWrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <strong class="stepLabel">{{ screenText.steps[0].label }}</strong>
            <span class="stepDesc">{{ screenText.steps[0].desc }}</span>
          </li>
          <li class="stepItem">
            <div class="stepIconWrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" width="22" height="22">
                <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
              </svg>
            </div>
            <strong class="stepLabel">{{ screenText.steps[1].label }}</strong>
            <span class="stepDesc">{{ screenText.steps[1].desc }}</span>
          </li>
          <li class="stepItem">
            <div class="stepIconWrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <strong class="stepLabel">{{ screenText.steps[2].label }}</strong>
            <span class="stepDesc">{{ screenText.steps[2].desc }}</span>
          </li>
        </ol>

        <div class="buttonGroup">
          <button class="mainButton startButton" type="button" @click="startScan">
            {{ screenText.startButtonText }}
          </button>

          <button class="mainButton chooseButton" type="button" @click="skipScan">
            {{ screenText.chooseButtonText }}
          </button>
        </div>

        <div class="prototypeLabel">{{ screenText.footerNote }}</div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from 'vue-router'
const router = useRouter();

const props = defineProps({
  appTitle: { type: String, default: "Human Rights Object Stories" },
  language: { type: String, default: "en" },
});


const textByLanguage = {
  en: {
    title: "Welcome!",
    purpose: "Scan everyday objects to uncover the human rights stories they carry.",
    steps: [
      { label: "Point",    desc: "Aim your camera at any object" },
      { label: "Scan",     desc: "The app identifies it instantly" },
      { label: "Discover", desc: "Explore the human rights story behind it" },
    ],
    startButtonText: "Start scanning!",
    chooseButtonText: "Choose an object instead",
    footerNote: "Prototype experience",
  },
  fr: {
    title: "Bienvenue!",
    purpose: "Scannez des objets du quotidien pour découvrir les histoires de droits humains qu'ils portent.",
    steps: [
      { label: "Pointez",   desc: "Dirigez votre caméra vers un objet" },
      { label: "Scannez",   desc: "L'application l'identifie instantanément" },
      { label: "Découvrez", desc: "Explorez l'histoire des droits humains" },
    ],
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

.purposeText {
  margin: clamp(12px, 2vw, 20px) auto 0 auto;
  width: min(560px, 92vw);
  font-size: clamp(16px, 2vw, 22px);
  font-weight: 600;
  line-height: 1.55;
  opacity: 1;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7);
  letter-spacing: 0.01em;
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

/* ── How it works steps ── */
.stepsList {
  list-style: none;
  padding: 0;
  margin: clamp(16px, 2.4vw, 28px) auto 0 auto;
  width: min(620px, 92vw);
  display: flex;
  gap: 8px;
}

.stepItem {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  padding: 10px 8px;
}

.stepIconWrap {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
}

.stepLabel {
  font-size: clamp(12px, 1.4vw, 14px);
  font-weight: 800;
  letter-spacing: 0.01em;
}

.stepDesc {
  font-size: clamp(10px, 1.1vw, 12px);
  opacity: 0.65;
  line-height: 1.4;
}

</style>
