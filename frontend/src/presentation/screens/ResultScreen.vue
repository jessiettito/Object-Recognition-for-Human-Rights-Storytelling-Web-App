<!-- frontend/src/presentation/screens/ResultScreen.vue -->
<template>
  <main class="resultScreen" role="main" aria-label="Result screen">
    <!-- Use captured image as background (blurred) -->
    <div class="backgroundLayers" aria-hidden="true">
      <div class="backgroundPhoto" :style="capturedBgStyle"></div>
      <div class="backgroundPhotoBlur strongBlur" :style="capturedBgStyle"></div>
      <div class="backgroundDarkenOverlay"></div>
    </div>

    <section class="centerArea" aria-labelledby="resultTitle">
      <div class="resultCard">
        <h1 id="resultTitle" class="resultTitle">{{ titleText }}</h1>

        <div class="previewFrame" aria-label="Captured image preview">
          <img v-if="capturedImageUrl" class="previewImage" :src="capturedImageUrl" :alt="titleText" />
          <div v-else class="previewFallback">No image</div>
        </div>

        <div class="buttonGroup">
          <button class="mainButton startButton" type="button" @click="continueFlow">
            {{ uiText.continue }}
          </button>
          <button class="mainButton secondaryButton" type="button" @click="tryAgain">
            {{ uiText.tryAgain }}
          </button>
        </div>

        <div v-if="scoreText" class="smallMeta">{{ scoreText }}</div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

/**
 * Router state expected:
 *  - imageDataUrl: string (data:image/..)
 *  - label: string (e.g. "cup")
 *  - score: number (0..1) optional
 */
const route = useRoute();
const router = useRouter();

const state = computed(() => route.state ?? {});
const capturedImageUrl = computed(() => state.value.imageDataUrl ?? "");
const detectedLabel = computed(() => state.value.label ?? "");
const detectedScore = computed(() => {
  const raw = state.value.score;
  return typeof raw === "number" && Number.isFinite(raw) ? raw : null;
});

const uiText = computed(() => {
  const lang = route.params?.lang; // not used now, kept simple
  // You already have a global language state; for now keep English labels minimal.
  return {
    continue: "Continue",
    tryAgain: "Try again",
  };
});

const titleText = computed(() => {
  // Minimal: just the object name, or fallback text
  if (!detectedLabel.value) return "Result";
  // Capitalize first letter
  return detectedLabel.value.charAt(0).toUpperCase() + detectedLabel.value.slice(1);
});

const scoreText = computed(() => {
  if (detectedScore.value == null) return "";
  const percent = Math.round(detectedScore.value * 100);
  return `Confidence: ${percent}%`;
});

const capturedBgStyle = computed(() => ({
  backgroundImage: capturedImageUrl.value ? `url("${capturedImageUrl.value}")` : "none",
}));

function tryAgain() {
  router.push("/capture");
}

function continueFlow() {
  // Next: themes/prompts screen
  router.push("/list"); // placeholder until you add the theme screen route
}
</script>

<style scoped>
.resultScreen {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}

/* Make the blur stronger for result screen background */
.strongBlur {
  filter: blur(22px) !important;
  opacity: 0.35 !important;
}

.centerArea {
  position: relative;
  z-index: 2;
  height: 100%;
  display: grid;
  place-items: center;
  padding: clamp(16px, 4vw, 48px);
}

/* Glass card */
.resultCard {
  width: min(820px, 92vw);
  text-align: center;

  padding: clamp(16px, 2.6vw, 28px);
  border-radius: 22px;

  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.38);
}

.resultTitle {
  margin: 0;
  font-size: clamp(34px, 5.2vw, 72px);
  line-height: 1.04;
  text-shadow: 0 12px 34px rgba(0, 0, 0, 0.65);
}

/* Captured preview */
.previewFrame {
  margin: clamp(14px, 2.8vw, 22px) auto 0 auto;
  width: min(640px, 92vw);
  border-radius: 18px;
  overflow: hidden;

  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.previewImage {
  width: 100%;
  height: auto;
  display: block;
}

.previewFallback {
  padding: 24px;
  opacity: 0.85;
}

.buttonGroup {
  margin: clamp(14px, 2.6vw, 22px) auto 0 auto;
  display: grid;
  gap: 12px;
  width: min(560px, 92vw);
}

.smallMeta {
  margin-top: 12px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.78;
}
</style>