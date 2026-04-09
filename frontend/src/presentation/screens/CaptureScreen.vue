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

         <!-- Countdown timer -->
        <div v-else class="countdownOverlay" aria-label="Auto capture countdown">
          <div v-if="countdown > 0 && !isRunningDetection" class="countdownNumber">
            {{ countdown }}
          </div>
          <div class="countdownSub" :class="{ bold: isRunningDetection }">
            <span v-if="isRunningDetection">Processing…</span>
            <span v-else>Hold still</span>
          </div>
          <button
            v-if="!isRunningDetection"
            class="captureButton"
            type="button"
            @click="manualCapture"
            :aria-label="screenText.capture"
          >
            {{ screenText.capture }}
          </button>
        </div>        
      </div>

      <canvas ref="canvas" style="display:none"></canvas>

    </section>
  </main>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

import { detectTopObjects } from "../../logic/ObjectDetection.js";

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

const CAMERA_REQUESTED_KEY = "cameraPermissionRequested";
const CAMERA_GRANTED_KEY = "cameraPermissionGranted";

/**
 * Auto-capture 
 */
const COUNTDOWN_SECONDS = 5; 
const countdown = ref(COUNTDOWN_SECONDS);
let countdownTimerId = null; 


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

function startCountdown() {
  stopCountdown(); 
  countdown.value = COUNTDOWN_SECONDS; 

  countdownTimerId = window.setInterval (async () => {
    if(!cameraStarted.value) return; 
    if(isRunningDetection.value) return; 

    countdown.value -= 1; 

    if(countdown.value <= 0) {
      stopCountdown(); 
      countdown.value = 0; 
      await autoCaptureOnce(); 
    }
  }, 1000);
}

function stopCountdown() {
  if(countdownTimerId) {
    window.clearInterval(countdownTimerId);
    countdownTimerId = null; 
  }
}

onMounted(async () => {
  const hasAskedBefore = localStorage.getItem(CAMERA_REQUESTED_KEY) === "true";
  const cameraGrantedBefore = localStorage.getItem(CAMERA_GRANTED_KEY) === "true";

  if (!hasAskedBefore) {
    const ok = await startCamera();
    if (ok) startCountdown(); 
    return;
  }

  if (cameraGrantedBefore) {
    const ok = await startCamera();
    if (ok) startCountdown(); 
  }
});

onUnmounted(() => {
  stopCountdown();
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
    startCountdown(); // Restart countdown to try again
    return;
  }

  try { 
    countdown.value = 0;

    isRunningDetection.value = true;

    const snapshotDataUrl = captureSnapshotDataUrl();

    await runDetectionFromDataUrl(snapshotDataUrl); 
  } catch (error) {
    detectionErrorMessage.value = error?.message ?? "Something went wrong during detection."
    startCountdown(); 
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

function manualCapture() {
  stopCountdown();
  autoCaptureOnce();
}

/* Computed properties for text and styles */
const textByLanguage = {
  en: {
    chooseObject: "Choose from list",
    previewHint: "Camera preview will appear here",
    home: "Home",
    capture: "Capture now",
  },
  fr: {
    chooseObject: "Choisir un objet",
    previewHint: "Aperçu de la caméra ici",
    home: "Accueil",
    capture: "Capturer",
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

.countdownOverlay {
  position: absolute;
  inset: 0; 
  display: grid; 
  place-items: center;
  pointer-events: none;
  text-align: center;
  z-index: 10; 
}

.countdownNumber {
  font-size: clamp(64px, 10vw, 120px);
  font-weight: 900;
  color: #ffffff;
  text-shadow: 0 18px 40px rgba(0, 0, 0, 0.7);
  background: rgba(0, 0, 0, 0.45);
  padding: 10px 18px; 
  border-radius: 999px;
  backdrop-filter: blur(8px);
}

.countdownSub {
  margin-top: 10px;
  font-size: 12px;
  letter-spacing: 0.12em; 
  text-transform: uppercase;
  opacity: 0.9; 
  background: rgba(0, 0, 0, 0.25);
  padding: 8px 14px;
  border-radius: 999px;
  backdrop-filter: blur(8px);
  color: #fff;
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
  overflow : hidden;
  object-fit: cover;
  border-radius: 18px;
  transform: scaleX(-1); /* Flips the camera horizontally */
  z-index: 1;
}

.captureButton {
  margin-top: 20px;
  padding: 12px 32px;
  border-radius: 999px;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  pointer-events: all;
}

.captureButton:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.7);
}

.snapshotPreview img {
  width: 100%;
  max-height: 320px;
  object-fit: cover;
  border-radius: 14px;
  margin: 16px 0;
}
</style>
