<template>
  <main class="screen captureScreen" role="main" aria-label="Capture screen">
    <!-- Main camera UI -->
    <section class="mainArea" aria-label="Camera area">

      <!-- Screen buttons -->
      <div class="topControls" aria-label="Camera controls">
        <button class="mainButton pillButton" type="button" @click="goHome">
          {{ screenText.home }}
        </button>

        <button class="mainButton pillBUtton" type="button" @click="goToList">
          {{ screenText.chooseObject }}
        </button>

        <img ref="hiddenImageForDetection" class="hiddenPreview" alt="" />

        <div v-if="detectionErrorMessage" class="errorText">
          {{ detectionErrorMessage }}
        </div>
      </div>

      <!-- Camera preview -->
      <div class="cameraFrame" :class="{ isProcessing: isRunningDetection }">
        <video
          ref="video"
          autoplay
          playsinline
          class="cameraVideo">
        </video>


        <div v-if="!cameraStarted" class="cameraHint">
          {{ screenText.previewHint }}
        </div>

        <!-- Status overlay -->
        <div v-if="cameraStarted" class="statusOverlay">
          <span v-if="isRunningDetection" class="statusBadge">Processing…</span>
          <span v-else-if="liveLabel" class="statusBadge statusBadge--active">{{ liveLabel }}</span>
          <span v-else class="statusBadge statusBadge--idle">{{ screenText.aimHint }}</span>
        </div>

        <!-- Stability progress bar -->
        <div v-if="stableProgress > 0 && !isRunningDetection" class="progressBar">
          <div class="progressFill" :style="{ width: (stableProgress * 100) + '%' }"></div>
        </div>
      </div>

      <canvas ref="canvas" style="display:none"></canvas>

    </section>
  </main>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

import { detectTopObjects, detectObjectsWithBoxes } from "../../logic/ObjectDetection.js";


const props = defineProps({
  appTitle: { type: String, default: "Human Rights Object Stories" },
  language: { type: String, default: "en" },
});

const router = useRouter();

const video = ref(null);
const canvas = ref(null);

let stream = null; 

const cameraStarted = ref(false);
const hiddenImageForDetection = ref(null);
const isRunningDetection = ref(false);
const detectionErrorMessage = ref("");
const liveLabel = ref("");
const stableProgress = ref(0); // 0–1
let liveDetectTimerId = null;
let stableLabel = "";
let stableStart = 0;

const STABLE_MS = 3000;
const MIN_CONFIDENCE = 0.4;

const CAMERA_REQUESTED_KEY = "cameraPermissionRequested";
const CAMERA_GRANTED_KEY = "cameraPermissionGranted";


/* Camera */
async function startCamera() {

  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true })
    
    if(video.value) {
      video.value.srcObject = stream
      await video.value.play().catch((err) => {
        console.error("Error playing video:", err);
      });
    }

    cameraStarted.value = true

    localStorage.setItem(CAMERA_REQUESTED_KEY, "true");
    localStorage.setItem(CAMERA_GRANTED_KEY, "true");

    return true;

  } catch (err) {
    alert("Camera access failed. Please allow camera permission.")
    console.error(err)

    localStorage.setItem(CAMERA_REQUESTED_KEY, "true");
    localStorage.setItem(CAMERA_GRANTED_KEY, "false");

    cameraStarted.value = false;
    return false;
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }

  if (video.value) {
    video.value.srcObject = null;
  }

  cameraStarted.value = false;
}



function startLiveDetection() {
  liveDetectTimerId = window.setInterval(async () => {
    if (!cameraStarted.value || isRunningDetection.value || !video.value) return;
    if (video.value.readyState < 2) return;
    try {
      const results = await detectObjectsWithBoxes(video.value, { topK: 3, ignorePerson: true, minScore: 0.3 });
      drawDetections(results);

      const top = results[0];
      if (top && top.confidence >= MIN_CONFIDENCE) {
        const name = top.name;
        liveLabel.value = name.charAt(0).toUpperCase() + name.slice(1);

        if (name === stableLabel) {
          const elapsed = Date.now() - stableStart;
          stableProgress.value = Math.min(elapsed / STABLE_MS, 1);
          if (elapsed >= STABLE_MS) {
            stopLiveDetection();
            await autoCaptureOnce();
          }
        } else {
          stableLabel = name;
          stableStart = Date.now();
          stableProgress.value = 0;
        }
      } else {
        liveLabel.value = "";
        stableLabel = "";
        stableStart = 0;
        stableProgress.value = 0;
      }
    } catch {
      // silently ignore live detection errors
    }
  }, 300);
}

function stopLiveDetection() {
  if (liveDetectTimerId) {
    window.clearInterval(liveDetectTimerId);
    liveDetectTimerId = null;
  }
  liveLabel.value = "";
  stableLabel = "";
  stableStart = 0;
  stableProgress.value = 0;
  clearDetections();
}

onMounted(async () => {
  const hasAskedBefore = localStorage.getItem(CAMERA_REQUESTED_KEY) === "true";
  const cameraGrantedBefore = localStorage.getItem(CAMERA_GRANTED_KEY) === "true";

  if (!hasAskedBefore) {
    const ok = await startCamera();
    if (ok) startLiveDetection();
    return;
  }

  if (cameraGrantedBefore) {
    const ok = await startCamera();
    if (ok) startLiveDetection();
  }
});

onUnmounted(() => {
  stopLiveDetection();
  stopCamera();
});

/* Capture snapshot */
async function autoCaptureOnce() {
  detectionErrorMessage.value = ""; 

  if(!cameraStarted.value) {
    const started = await startCamera();

    if (!started) {
      detectionErrorMessage.value = "Camera access is required to capture a photo. Please allow camera permission and try again.";
      return;
    }
  }

  if (!video.value || !canvas.value) {
    detectionErrorMessage.value = "Camera is not ready. Please try again.";
    startLiveDetection();
    return;
  }

  try {
    isRunningDetection.value = true;
    const snapshotDataUrl = captureSnapshotDataUrl();
    await runDetectionFromDataUrl(snapshotDataUrl);
  } catch (error) {
    detectionErrorMessage.value = error?.message ?? "Something went wrong during detection.";
    startLiveDetection();
  } finally {
    // Stop the camera stream after capturing
    isRunningDetection.value = false;
  }
}

function captureSnapshotDataUrl() {
  const canvasEl = canvas.value
    const videoEl = video.value
    const ctx = canvasEl.getContext("2d")

    canvasEl.width = videoEl.videoWidth
    canvasEl.height = videoEl.videoHeight

    // Mirror snapshot to match preview
    ctx.save()
    ctx.scale(-1, 1)
    ctx.drawImage(
      videoEl,
      -canvasEl.width,
      0,
      canvasEl.width,
      canvasEl.height
    )
    ctx.restore()

    return canvasEl.toDataURL("image/png")
}

/* Navigation */
function goHome() {
  router.push("/");
}

function goToList() {
  router.push("/list");
}

/**
 * Waits for the image element to load the given data URL, or rejects if it fails to load.
 * @param imageElement 
 * @param dataUrl 
 */
function waitForImageToLoad(imageElement, dataUrl) {
  return new Promise((resolve, reject) => {
    imageElement.onload = () => resolve();
    imageElement.onerror = () => reject(new Error("Could not load the image for detection."));
    imageElement.src = dataUrl;
  });
}

/**
 * Runs object detection on the given image data URL, then navigates to the result screen with the detection data.
 * @param imageDataUrl 
 */
async function runDetectionFromDataUrl(imageDataUrl) {
  const imageElement = hiddenImageForDetection.value;
  if (!imageElement) throw new Error("Hidden image element is not ready.");

  await waitForImageToLoad(imageElement, imageDataUrl);

  const topResults = await detectTopObjects(imageElement, { topK: 5, ignorePerson: true });
  const detectedName = topResults[0]?.name ?? "unknown";
  const detectedConfidence = topResults[0]?.confidence ?? 0;

  router.push({
    path: "/result",
    state: {
      imageDataUrl,
      results: topResults,
      label: detectedName,
      score: detectedConfidence,
    },
  });
}

/* Computed properties for text and styles */
const textByLanguage = {
  en: {
    chooseObject: "Choose from list",
    previewHint: "Camera preview will appear here",
    home: "Home",
    aimHint: "Aim at an object",
  },
  fr: {
    chooseObject: "Choisir un objet",
    previewHint: "Aperçu de la caméra ici",
    home: "Accueil",
    aimHint: "Pointez vers un objet",
  },
};

const screenText = computed(() => (props.language === "fr" ? textByLanguage.fr : textByLanguage.en));

</script>

<style scoped>
.mainArea {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: clamp(14px, 3vw, 28px);
  padding: clamp(14px, 3.2vw, 28px);
}

.cameraFrame {
  position: relative; 
  overflow: hidden; 
  width: min(1400px, 98vw);
  height: 100%;
  border-radius: 22px;

  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.5);
  padding: 18px;

  display: grid;
  place-items: center;
}

.cameraFrame.isProcessing .cameraVideo {
  filter: blur(12px) brightness(0.9);
}

.cameraHint {
  font-size: 14px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.82;
  text-align: center;

  position: absolute;
  inset: 0; 
  display: grid;
  place-items: center;
  z-index: 3;
}

.statusOverlay {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  pointer-events: none;
}

.statusBadge {
  display: inline-block;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 8px 20px;
  border-radius: 999px;
  white-space: nowrap;
}

.statusBadge--active {
  border-color: rgba(167, 243, 208, 0.5);
  color: #a7f3d0;
}

.statusBadge--idle {
  opacity: 0.7;
  font-weight: 500;
}

.progressBar {
  position: absolute;
  bottom: 18px;
  left: 18px;
  right: 18px;
  height: 4px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  overflow: hidden;
  z-index: 10;
}

.progressFill {
  height: 100%;
  background: linear-gradient(90deg, #6ee7b7, #a7f3d0);
  border-radius: 999px;
  transition: width 0.2s ease;
}


.topControls {
  width: min(920px, 98vw);
  display: grid;
  gap: 12px;
  margin: 0 auto; 
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
  position: sticky; 
  top: 0;
  z-index: 10; 
}

.mainButton {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.cameraVideo {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  object-fit: cover;
  border-radius: 18px;
  transform: scaleX(-1); /* Flips the camera horizontally */
  z-index: 1;
}

.overlayCanvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 18px;
  transform: scaleX(-1); /* Mirror to match video */
  z-index: 2;
  pointer-events: none;
}

.snapshotPreview img {
  width: 100%;
  max-height: 320px;
  object-fit: cover;
  border-radius: 14px;
  margin: 16px 0;
}
</style>
