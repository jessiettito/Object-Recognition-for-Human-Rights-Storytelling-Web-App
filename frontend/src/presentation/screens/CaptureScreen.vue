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
          :disabled="showPermissionModal || !cameraStarted"
          @click="capturePhoto">
          {{ screenText.captureButton }}
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

      <!-- Permission modal -->
      <div
        v-if="showPermissionModal"
        class="modalOverlay"
        role="dialog"
        aria-modal="true"
        aria-label="Camera permission prompt"
      >
        <div class="modalCard">
          <h1 class="modalTitle">{{ screenText.permissionTitle }}</h1>
          <p class="modalBody">{{ screenText.permissionBody }}</p>

          <div class="modalButtons">
            <button class="mainButton startButton" type="button" @click="startCamera">
              {{ screenText.allowCamera }}
            </button>
            
            <button class="mainButton secondaryButton" type="button" @click="goToList">
              {{ screenText.chooseObject }}
            </button>

            <button class="mainButton pillButton" type="button" @click="goHome">
              {{ screenText.home }}
            </button>
          </div>
        </div>
      </div>

      <canvas ref="canvas" style="display:none"></canvas>

    </section>
  </main>
</template>

<script setup>
import { computed, ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";

import { detectMainObject } from "../../logic/ObjectDetection.js";

const props = defineProps({
  appTitle: { type: String, default: "Human Rights Object Stories" },
  language: { type: String, default: "en" },
});

const router = useRouter();

//Show permission modal 
const showPermissionModal = ref(true); 

const video = ref(null); 
const canvas = ref(null);

let stream = null; 
const cameraStarted = ref(false);

const capturedPhoto = ref(null);
const hiddenImageForDetection = ref(null);
const isRunningDetection = ref(false);
const detectionErrorMessage = ref("");

/* Camera */
async function startCamera() {

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true

    })

    video.value.srcObject = stream
    cameraStarted.value = true
    showPermissionModal.value = false

  } catch (err) {
    alert("Camera access failed. Please allow camera permission.")
    console.error(err)
  }
}

/* Capture snapshot */
async function capturePhoto() {
  if (!video.value || !canvas.value) return
  detectionErrorMessage.value = ""; 

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
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
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

  const detected = await detectMainObject(imageElement);
  const detectedName = detected?.name ?? "unknown";
  const detectedConfidence = detected?.confidence ?? 0;

  router.push({
    path: "/result",
    state: {
      imageDataUrl,
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
    permissionTitle: "Use camera? ",
    permissionBody: "We only use it to scan your object.",
    allowCamera: "Allow camera",
    chooseObject: "Choose from list",
    previewHint: "Camera preview will appear here",
    captureButton: "Capture",
    home: "Home",
  },
  fr: {
    permissionTitle: "Utiliser la caméra?",
    permissionBody: "Nous l’utilisons seulement pour scanner votre objet.",
    allowCamera: "Autoriser la caméra",
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
