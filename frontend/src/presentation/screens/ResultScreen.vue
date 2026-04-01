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
          <h1 v-if="results.length" id="objectName" class="objectName">{{ objectNameText }}</h1>

          <!-- Nothing detected -->
          <template v-if="!results.length">
            <p class="libraryStatus libraryStatus--missing">✗ No object detected</p>
            <p class="subtext">Make sure the object is well-lit and clearly visible.</p>
            <button class="secondaryButton resultButton" type="button" @click="goBackToCapture">
              Try again
            </button>
          </template>

          <!-- Object detected -->
          <template v-else>
            <p class="libraryStatus" :class="isAvailable ? 'libraryStatus--found' : 'libraryStatus--missing'">
              {{ isAvailable ? '✓ Object found in library' : '✗ Object not available in library' }}
            </p>

            <div v-if="isAvailable" class="choices" role="list" aria-label="Top detected objects">
              <button
                v-for="(item, idx) in results"
                :key="item.name + idx"
                class="choiceBtn"
                :class="{ selected: idx === selectedIndex, 'choiceBtn--unavailable': !isObjectAvailable(item.name) }"
                type="button"
                :aria-pressed="idx === selectedIndex"
                @click="chooseIndex(idx)"
              >
                <span class="choiceName">{{ item.name }}</span>
                <span class="choiceScore">{{ Math.round(item.confidence * 100) }}%</span>
              </button>
            </div>

            <!-- Available: Continue -->
            <div v-if="isAvailable">
              <button class="startButton resultButton" type="button" @click="goToNextScreen">
                Continue
              </button>
            </div>

            <!-- Not in library -->
            <div v-else class="unavailable-state">
              <p class="subtext">Try scanning again or explore other stories and themes.</p>
              <button class="startButton resultButton" type="button" @click="goToList">Browse Objects or Themes</button>
            </div>

            <button
                v-if="!showListOption || !isAvailable"
                class="secondaryButton resultButton"
                type="button"
                @click="goBackToCapture">
              Try again
            </button>

            <!-- only show list option after max retries if the object is available -->
            <button
                v-if="showListOption && isAvailable"
                class="startButton resultButton"
                type="button"
                @click="goToList">
              Choose from list of objects
            </button>
          </template>

          <div v-if="confidenceText" class="smallMeta">{{ confidenceText }}</div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { objects as objectData } from "../../data/Objects.js";

const router = useRouter();


/**
 * We pass data using router.push({ state: { ... } }).
 */
const navigationState = computed(() => window.history.state || {});

const capturedImageDataUrl = computed(() => navigationState.value.imageDataUrl || "");
// New: list of results
const results = computed(() => {
  const r = navigationState.value.results;
  return Array.isArray(r) ? r : [];
});

const RETRY_KEY = "objectDetectionRetries";
const MAX_RETRIES = 3;
const retryCount = ref(parseInt(localStorage.getItem(RETRY_KEY) || "0"));

// Selected index (default to 0)
const selectedIndex = ref(0);

const showListOption = computed(() => retryCount.value === MAX_RETRIES);

const selected = computed(() => results.value[selectedIndex.value] || null);
const detectedObjectLabel = computed(() => selected.value?.name || "");
const detectedObjectScore = computed(() => selected.value?.confidence ?? null);

const objectNameText = computed(() => {
  if (!detectedObjectLabel.value) return "Result";
  return detectedObjectLabel.value.charAt(0).toUpperCase() + detectedObjectLabel.value.slice(1);
});

const confidenceText = computed(() => {
  if (detectedObjectScore.value == null) return "";
  return `Confidence: ${Math.round(detectedObjectScore.value * 100)}%`;
});

function chooseIndex(index) {
  if (index >= 0 && index < results.value.length) {
    selectedIndex.value = index;
  }
}

function goBackToCapture() {
  const nextCount = retryCount.value + 1;

  retryCount.value = nextCount;
  localStorage.setItem(RETRY_KEY, String(nextCount));

  router.push("/capture");
}

function resetRetryCount() {
  retryCount.value = 0;
  localStorage.removeItem(RETRY_KEY);
}

function goToNextScreen() {
  resetRetryCount();

  router.push({
    path: "/themes",
    state: {
      source: "result",
      type: "object",
      objectId: selectedObjectId.value,
      name: objectNameText.value,
    },
  });
}

function goToList() {
  resetRetryCount();
  router.push("/list");
}

function findObjectByLabel(label) {
  const normalized = (label || "").toLowerCase().trim();
  return objectData.find(
    (item) =>
      item.id.toLowerCase() === normalized ||
      item.en.toLowerCase() === normalized
  );
}

function isObjectAvailable(label) {
  return !!findObjectByLabel(label);
}

const selectedObjectId = computed(() => findObjectByLabel(detectedObjectLabel.value)?.id || "");

const isAvailable = computed(() => !!findObjectByLabel(detectedObjectLabel.value));

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

.resultButton {
  margin-top: 16px;
  width: min(520px, 92vw);
  margin-left: auto;
  margin-right: auto;

  padding: 14px 18px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 12px;

  display: block;
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

.choices {
  margin-top: 14px;
  display: grid;
  gap: 10px;
  width: min(520px, 92vw);
  margin-left: auto;
  margin-right: auto;
}

.choiceBtn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 12px 14px;
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.95);

  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}

.choiceBtn:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.10);
  border-color: rgba(255, 255, 255, 0.22);
}

.choiceBtn.selected,
.choiceBtn[aria-pressed="true"] {
  background: rgba(2, 153, 83, 0.26);
  border-color: rgba(167, 243, 208, 0.90);
  box-shadow: 0 0 0 3px rgba(167, 243, 208, 0.22), 0 18px 36px rgba(0, 0, 0, 0.28);
  transform: translateY(-1px);
}

.choiceName {
  text-transform: capitalize;
  font-weight: 800;
  letter-spacing: 0.01em;
}

.choiceScore {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.85;
}

.choiceBtn--unavailable {
  opacity: 0.7;
}

.subtext {
  margin: 6px auto 0;
  font-size: 13px;
  opacity: 0.7;
  max-width: 38ch;
}

.libraryStatus {
  margin: 12px auto 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.libraryStatus--found {
  color: #a7f3d0;
}

.libraryStatus--missing {
  color: #fca5a5;
}

.noResults {
  margin-top: 14px;
  font-size: 14px;
  opacity: 0.9;
}
</style>