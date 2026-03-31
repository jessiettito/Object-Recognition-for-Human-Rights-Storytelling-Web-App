<template>
  <main class="screen resultScreen" role="main" aria-label="Result screen">
    <section class="contentArea" aria-labelledby="objectName">

      <!-- ── FOUND: object is in our library ── -->
      <div v-if="isAvailable" class="resultCard resultCard--found panelCard">
        <div class="circlePreview circlePreview--found" aria-label="Object preview">
          <img
            v-if="capturedImageDataUrl"
            class="circleImage"
            :src="capturedImageDataUrl"
            :alt="objectNameText"
          />
          <div v-else class="circleFallback">No image</div>
        </div>

        <div class="resultText">
          <p class="statusLabel statusLabel--found">✓ Found in library</p>
          <h1 id="objectName" class="objectName">{{ objectNameText }}</h1>

          <div v-if="results.length" class="choices" role="list" aria-label="Top detected objects">
            <button
              v-for="(item, idx) in results"
              :key="item.name + idx"
              class="choiceBtn"
              :class="{ 'choiceBtn--available': isObjectAvailable(item.name) }"
              type="button"
              :aria-pressed="idx === selectedIndex"
              @click="chooseIndex(idx)"
            >
              <span class="choiceName">{{ item.name }}</span>
              <span class="choiceScore">{{ Math.round(item.confidence * 100) }}%</span>
            </button>
          </div>

          <button class="startButton resultButton" type="button" @click="goToNextScreen">
            Continue →
          </button>

          <button class="secondaryButton resultButton" type="button" @click="goBackToCapture">
            Try again
          </button>

          <div v-if="confidenceText" class="smallMeta">{{ confidenceText }}</div>
        </div>
      </div>

      <!-- ── NOT RECOGNIZED: model returned no results ── -->
      <div v-else-if="!isDetected" class="resultCard resultCard--unrecognized panelCard">
        <div class="circlePreview circlePreview--unrecognized" aria-label="Object preview">
          <img
            v-if="capturedImageDataUrl"
            class="circleImage circleImage--dim"
            :src="capturedImageDataUrl"
            alt="Unrecognized object"
          />
          <div v-else class="circleFallback">No image</div>
          <div class="notFoundBadge notFoundBadge--grey">×</div>
        </div>

        <div class="resultText">
          <p class="statusLabel statusLabel--unrecognized">Object not recognized</p>
          <h1 class="objectName objectName--notfound">Nothing detected</h1>
          <p class="notFoundMessage">
            We couldn't identify any object in the image. Make sure the object is well-lit and clearly visible, then try again.
          </p>

          <div class="notFoundActions">
            <button class="secondaryButton resultButton" type="button" @click="goBackToCapture">
              Try again
            </button>
            <button class="ghostButton resultButton" type="button" @click="goToList">
              Browse library instead
            </button>
          </div>
        </div>
      </div>

      <!-- ── NOT IN LIBRARY: object detected but not in our library ── -->
      <div v-else class="resultCard resultCard--notfound panelCard">
        <div class="circlePreview circlePreview--notfound" aria-label="Object preview">
          <img
            v-if="capturedImageDataUrl"
            class="circleImage circleImage--dim"
            :src="capturedImageDataUrl"
            :alt="objectNameText"
          />
          <div v-else class="circleFallback">No image</div>
          <div class="notFoundBadge">?</div>
        </div>

        <div class="resultText">
          <p class="statusLabel statusLabel--notfound">Not in our library</p>
          <h1 id="objectName" class="objectName objectName--notfound">{{ objectNameText }}</h1>
          <p class="notFoundMessage">
            We detected <strong>{{ objectNameText }}</strong>, but it isn't part of our story collection yet.
            Try a different object or explore the library manually.
          </p>

          <div v-if="results.length" class="choices choices--secondary" role="list" aria-label="Top detected objects">
            <button
              v-for="(item, idx) in results"
              :key="item.name + idx"
              class="choiceBtn"
              :class="{ 'choiceBtn--available': isObjectAvailable(item.name) }"
              type="button"
              :aria-pressed="idx === selectedIndex"
              @click="chooseIndex(idx)"
            >
              <span class="choiceName">{{ item.name }}</span>
              <span class="choiceScore">{{ Math.round(item.confidence * 100) }}%</span>
              <span v-if="isObjectAvailable(item.name)" class="choiceAvailableBadge">in library</span>
            </button>
          </div>

          <div class="notFoundActions">
            <button
              v-if="showListOption"
              class="startButton resultButton"
              type="button"
              @click="goToList"
            >
              Browse library
            </button>
            <button class="secondaryButton resultButton" type="button" @click="goBackToCapture">
              Try again
            </button>
            <button v-if="!showListOption" class="ghostButton resultButton" type="button" @click="goToList">
              Browse library instead
            </button>
          </div>

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

const navigationState = computed(() => window.history.state || {});
const capturedImageDataUrl = computed(() => navigationState.value.imageDataUrl || "");
const results = computed(() => {
  const r = navigationState.value.results;
  return Array.isArray(r) ? r : [];
});

const RETRY_KEY = "objectDetectionRetries";
const MAX_RETRIES = 3;
const retryCount = ref(parseInt(localStorage.getItem(RETRY_KEY) || "0"));

const selectedIndex = ref(0);
const showListOption = computed(() => retryCount.value >= MAX_RETRIES);

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

function findObjectByLabel(label) {
  const normalized = (label || "").toLowerCase().trim();
  return objectData.find(
    (item) =>
      item.id.toLowerCase() === normalized ||
      item.en.toLowerCase() === normalized
  );
}

const selectedObjectId = computed(() => findObjectByLabel(detectedObjectLabel.value)?.id || "");
const isDetected = computed(() => results.value.length > 0);
const isAvailable = computed(() => isDetected.value && !!findObjectByLabel(detectedObjectLabel.value));

function isObjectAvailable(label) {
  return !!findObjectByLabel(label);
}

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

/* ── Base card ── */
.resultCard {
  width: min(980px, 92vw);
  display: grid;
  grid-template-columns: auto 1fr;
  gap: clamp(16px, 3vw, 28px);
  align-items: center;
  padding: clamp(16px, 2.6vw, 28px);
  border-radius: 22px;
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.38);
}

/* ── Found state — green tint ── */
.resultCard--found {
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(167, 243, 208, 0.28);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.38), 0 0 0 1px rgba(167, 243, 208, 0.12);
}

/* ── Unrecognized state — grey/muted tint ── */
.resultCard--unrecognized {
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid rgba(148, 163, 184, 0.22);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.38), 0 0 0 1px rgba(148, 163, 184, 0.08);
}

/* ── Not found state — amber tint ── */
.resultCard--notfound {
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid rgba(251, 191, 36, 0.28);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.38), 0 0 0 1px rgba(251, 191, 36, 0.1);
}

/* ── Circle preview ── */
.circlePreview {
  position: relative;
  width: clamp(120px, 22vw, 220px);
  height: clamp(120px, 22vw, 220px);
  border-radius: 999px;
  overflow: visible;
  display: grid;
  place-items: center;
}

.circlePreview--found {
  border: 2px solid rgba(167, 243, 208, 0.45);
  box-shadow: 0 0 24px rgba(167, 243, 208, 0.18);
  overflow: hidden;
  background: rgba(0, 0, 0, 0.45);
}

.circlePreview--unrecognized {
  border: 2px solid rgba(148, 163, 184, 0.3);
  box-shadow: 0 0 24px rgba(148, 163, 184, 0.1);
  overflow: hidden;
  background: rgba(0, 0, 0, 0.45);
}

.notFoundBadge--grey {
  background: rgba(148, 163, 184, 0.85);
  font-size: 22px;
}

.statusLabel--unrecognized {
  color: #94a3b8;
}

.circlePreview--notfound {
  border: 2px solid rgba(251, 191, 36, 0.35);
  box-shadow: 0 0 24px rgba(251, 191, 36, 0.14);
  overflow: hidden;
  background: rgba(0, 0, 0, 0.45);
}

.circleImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.circleImage--dim {
  filter: brightness(0.45) saturate(0.5);
}

/* "?" badge overlaid on circle */
.notFoundBadge {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: rgba(251, 191, 36, 0.9);
  color: #1a1a1a;
  font-size: 20px;
  font-weight: 900;
  display: grid;
  place-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  z-index: 2;
}

.circleFallback {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.8;
}

/* ── Text area ── */
.resultText {
  text-align: center;
}

.statusLabel {
  margin: 0 0 8px 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.statusLabel--found {
  color: #a7f3d0;
}

.statusLabel--notfound {
  color: #fbbf24;
}

.objectName {
  margin: 0;
  font-size: clamp(34px, 5.2vw, 72px);
  line-height: 1.04;
  text-shadow: 0 12px 34px rgba(0, 0, 0, 0.65);
}

.objectName--notfound {
  opacity: 0.55;
  font-size: clamp(26px, 4vw, 52px);
}

.notFoundMessage {
  margin: 14px auto 0;
  max-width: 44ch;
  font-size: 15px;
  line-height: 1.6;
  opacity: 0.82;
}

/* ── Choices ── */
.choices {
  margin-top: 14px;
  display: grid;
  gap: 10px;
  width: min(520px, 92vw);
  margin-left: auto;
  margin-right: auto;
}

.choices--secondary {
  opacity: 0.75;
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

.choiceBtn[aria-pressed="true"] {
  background: rgba(167, 243, 208, 0.16);
  border-color: rgba(167, 243, 208, 0.38);
}

/* highlight choices that ARE in the library */
.choiceBtn--available {
  border-color: rgba(167, 243, 208, 0.3);
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

.choiceAvailableBadge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #a7f3d0;
  background: rgba(167, 243, 208, 0.12);
  border: 1px solid rgba(167, 243, 208, 0.3);
  padding: 2px 8px;
  border-radius: 999px;
  margin-left: 8px;
}

/* ── Buttons ── */
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

.notFoundActions {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ghostButton {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;
}

.ghostButton:hover {
  border-color: rgba(255, 255, 255, 0.4);
  color: rgba(255, 255, 255, 0.85);
}

.smallMeta {
  margin-top: 12px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.78;
}

/* ── Mobile ── */
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
