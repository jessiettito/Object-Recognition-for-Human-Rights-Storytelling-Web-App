<template>
  <main class="screen captureScreen" role="main" aria-label="Capture screen">
    <!-- Main camera UI -->
    <section class="mainArea" aria-label="Camera area">

      <!-- Camera preview -->
      <div class="cameraFrame">
        <video
          ref="video"
          autoplay
          playsinline
          class="cameraVideo">
        </video>

        <div v-if="!cameraStarted" class="cameraHint">
          {{ screenText.previewHint }}
        </div>

      </div>

    <!-- Screen buttons -->
      <div class="bottomControls" aria-label="Camera controls">
        <button
          class="mainButton captureButton"
          type="button"
          :disabled="isRunningDetection"
          @click="capturePhoto">
          {{ isRunningDetection ? "Processing..." : screenText.captureButton }}
        </button>

        <button class="mainButton secondaryButton" type="button" @click="goToList">
          {{ screenText.chooseObject }}
        </button>

        <button class="mainButton pillButton" type="button" @click="goHome">
          {{ screenText.home }}
        </button>

        <!-- *** Temporary upload button for testing object detection without using the camera. Will be removed later. *** -->
        <label class="uploadButton">
          Upload image (test)
          <input
            class="hiddenInput"
            type="file"
            accept="image/*"
            @change="onImageUpload"
            :disabled="isRunningDetection"
          />
        </label>

        <img ref="hiddenImageForDetection" class="hiddenPreview" alt="" />

        <div v-if="detectionErrorMessage" class="errorText">
          {{ detectionErrorMessage }}
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

const capturedPhoto = ref(null);
const hiddenImageForDetection = ref(null);
const isRunningDetection = ref(false);
const detectionErrorMessage = ref("");

const CAMERA_REQUESTED_KEY = "cameraPermissionRequested";
const CAMERA_GRANTED_KEY = "cameraPermissionGranted";

/* Camera */
async function startCamera() {

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true

    })
    
    if(video.value) {
      video.value.srcObject = stream
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

onMounted(async () => {
  const hasAskedBefore = localStorage.getItem(CAMERA_REQUESTED_KEY) === "true";
  const cameraGrantedBefore = localStorage.getItem(CAMERA_GRANTED_KEY) === "true";

  if (!hasAskedBefore) {
    await startCamera();
    return;
  }

  if (cameraGrantedBefore) {
    await startCamera();
  }
});

/* Capture snapshot */
async function capturePhoto() {
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
    return;
  }

  try { 
    isRunningDetection.value = true;

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

    capturedPhoto.value = canvasEl.toDataURL("image/png")

    await runDetectionFromDataUrl(capturedPhoto.value); 
  } catch (error) {
    detectionErrorMessage.value = error?.message ?? "Something went wrong during detection."
  } finally {
    // Stop the camera stream after capturing
    isRunningDetection.value = false;
  }
}

async function retakePhoto() {
  capturedPhoto.value = null

  try {
    await restartCamera()

  } catch (err) {
    console.error(err)
    alert("Unable to restart camera")
  }
}

async function restartCamera() {
  stream = await navigator.mediaDevices.getUserMedia({
    video: true
  })

  video.value.srcObject = stream
  cameraStarted.value = true
}

/* Navigation */
function goHome() {
  router.push("/");
}

function goToList() {
  router.push("/list");
}

/* Cleanup */
onUnmounted(() => {
  stopCamera();
})

// this is to remind myself...
// Helper function for file upload testing (will be removed later)..
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onerror = () => reject(new Error("Could not read the image file."));
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.readAsDataURL(file);
  });
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

// this is to remind myself...
// This is just a test function to allow uploading an image file instead of using the camera. *** will be removd after meeting or testing. 
async function onImageUpload(event) {
  detectionErrorMessage.value = "";
  const selectedFile = event.target.files?.[0];
  if (!selectedFile) return;

  try {
    isRunningDetection.value = true;
    const imageDataUrl = await readFileAsDataUrl(selectedFile);
    await runDetectionFromDataUrl(imageDataUrl);
  } catch (error) {
    detectionErrorMessage.value = error?.message ?? "Something went wrong during detection.";
  } finally {
    isRunningDetection.value = false;
    event.target.value = "";
  }
}

/* Computed properties for text and styles */
const textByLanguage = {
  en: {
    chooseObject: "Choose from list",
    previewHint: "Camera preview will appear here",
    captureButton: "Capture",
    home: "Home",
  },
  fr: {
    chooseObject: "Choisir un objet",
    previewHint: "Aperçu de la caméra ici",
    captureButton: "Capturer",
    home: "Accueil",
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
  justify-content: center;
  gap: clamp(14px, 3vw, 28px);
  padding: clamp(14px, 3.2vw, 28px);
}

.cameraFrame {
  width: min(980px, 94vw);
  height: min(62svh, 520px);
  border-radius: 22px;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  padding: 18px;
}

.cameraHint {
  font-size: 14px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.82;
  text-align: center;
}

.bottomControls {
  width: min(560px, 92vw);
  display: grid;
  gap: 12px;
}

.captureButton {
  color: rgba(0, 0, 0, 0.92);
  background: linear-gradient(90deg, #fde68a, #93c5fd);
}

.cameraVideo {
  width: 100%;
  height: 100%;
  position: relative;
  overflow : hidden;
  object-fit: cover;
  border-radius: 18px;
  transform: scaleX(-1); /* Flips the camera horizontally */
}

.snapshotPreview img {
  width: 100%;
  max-height: 320px;
  object-fit: cover;
  border-radius: 14px;
  margin: 16px 0;
}
</style>
