<template>
  <main class=" screen resultScreen" role="main" aria-label="Result screen">

    <section class="contentArea" aria-labelledby="objectName">
      <div class="resultCard panelCard">
        <!-- Circle preview on the side -->
        <div class="circlePreview" aria-label="Object preview">
          <img
            v-if="capturedImageDataUrl"
            class="circleImage"
            :src="capturedImageDataUrl"
            :alt="objectNameText"
          />
          <div v-else class="circleFallback">No image</div>
        </div>

        <!-- Object name in the center -->
        <div class="resultText">
          <h1 id="objectName" class="objectName">{{ objectNameText }}</h1>

          <button class="mainButton startButton continueButton" type="button" @click="goToNextScreen">
            Continue
          </button>

          <button class="mainButton secondaryButton tryAgainButton" type="button" @click="goBackToCapture">
            Try again
          </button>

          <div v-if="confidenceText" class="smallMeta">{{ confidenceText }}</div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

/**
 * We pass data using router.push({ state: { ... } }).
 */
const navigationState = computed(() => window.history.state || {});

const capturedImageDataUrl = computed(() => navigationState.value.imageDataUrl || "");
const detectedObjectLabel = computed(() => navigationState.value.label || "");
const detectedObjectScore = computed(() => {
  const score = navigationState.value.score;
  return typeof score === "number" ? score : null;
});

const objectNameText = computed(() => {
  if (!detectedObjectLabel.value) return "Result";
  return detectedObjectLabel.value.charAt(0).toUpperCase() + detectedObjectLabel.value.slice(1);
});

const confidenceText = computed(() => {
  if (detectedObjectScore.value == null) return "";
  return `Confidence: ${Math.round(detectedObjectScore.value * 100)}%`;
});

function goBackToCapture() {
  router.push("/capture");
}

function goToNextScreen() {
  // As of now moving to the list screen **** we will adding the theme screen here. *** for myself reminder...
  router.push("/list");
}
</script>

<style scoped>
.contentArea {
  position: relative;
  z-index: 2;
  height: 100%;
  display: grid;
  place-items: center;
  padding: clamp(16px, 4vw, 48px);
}

/* Glass card layout: circle on left, text center on the right side */
.resultCard {
  width: min(980px, 92vw);
  display: grid;
  grid-template-columns: auto 1fr;
  gap: clamp(16px, 3vw, 28px);
  align-items: center;

  padding: clamp(16px, 2.6vw, 28px);
  border-radius: 22px;

  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.38);
}

/* Circle preview */
.circlePreview {
  width: clamp(120px, 22vw, 220px);
  height: clamp(120px, 22vw, 220px);
  border-radius: 999px;
  overflow: hidden;

  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.14);
  display: grid;
  place-items: center;
}

.circleImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.circleFallback {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.8;
}

.resultText {
  text-align: center;
}

.objectName {
  margin: 0;
  font-size: clamp(34px, 5.2vw, 72px);
  line-height: 1.04;
  text-shadow: 0 12px 34px rgba(0, 0, 0, 0.65);
}

.continueButton {
  margin-top: 16px;
}

.tryAgainButton {
  margin-top: 10px;
}

.smallMeta {
  margin-top: 12px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.78;
}

/* Mobile: stack vertically */
@media (max-width: 640px) {
  .resultCard {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }

  .resultText {
    width: 100%;
  }
}
</style>