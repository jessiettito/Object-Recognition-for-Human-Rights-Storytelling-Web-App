<template>
  <main class="captureScreen" role="main" aria-label="Capture screen">
    <div class="backgroundLayers" aria-hidden="true">
      <div class="backgroundPhoto" :style="backgroundStyle"></div>
      <div class="backgroundPhotoBlur" :style="backgroundStyle"></div>
      <div class="backgroundDarkenOverlay"></div>
    </div>

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

        <button class="mainButton homeButton" type="button" @click="goHome">
          {{ screenText.home }}
        </button>
      </div>

      <!-- Permission modal -->
      <div
        v-if="showPermissionModal"
        class="modalOverlay"
        role="dialog"
        aria-modal="true"
        aria-label="Camera permission prompt">
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

            <button class=" homeButton" type="button" @click="goHome">
              {{ screenText.home }}
            </button>
          </div>
        </div>
      </div>

    <!-- Result window -->
    <div 
      v-if="showResultModal" class="modalOverlay">
      <div class="modalCard resultCard">
        <h1 class="modalTitle">We detected an object!</h1>
        <p class="modalBody">This is a placeholder message. Detection algorithm is not connected yet.</p>

        <div class="snapshotPreview">
          <img :src="capturedPhoto" alt="Snapshot preview" />
        </div>

        <div class="modalButtons">
          <button class="mainButton startButton" @click="retakePhoto">
            Take another picture
          </button>
          <button class="mainButton secondaryButton" @click="goToList">
            Read about object
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

import cmhrExteriorPhoto from "../../assets/backgrounds/CMHR_exterior.jpg";
import cmhrInteriorPhoto from "../../assets/backgrounds/CMHR_interior.jpg";

const props = defineProps({
  appTitle: { type: String, default: "Human Rights Object Stories" },
  backgroundName: { type: String, default: "CMHR_interior.jpg" },
  language: { type: String, default: "en" },
});

const router = useRouter();

//Show permission modal 
const showPermissionModal = ref(true);

const video = ref(null)
const canvas = ref(null)

let stream = null
const cameraStarted = ref(false)
const capturedPhoto = ref(null)
const showResultModal = ref(false)

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
function capturePhoto() {
  if (!video.value || !canvas.value) return

  const canvasEl = canvas.value
  const videoEl = video.value

  const ctx = canvas.value.getContext("2d")

  canvas.value.width = video.value.videoWidth
  canvas.value.height = video.value.videoHeight

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

 
  // Show result window
  showResultModal.value = true

  return photo
}

async function retakePhoto() {
  showResultModal.value = false
  capturedPhoto.value = null

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true
    })

    video.value.srcObject = stream
    cameraStarted.value = true

  } catch (err) {
    console.error(err)
    alert("Unable to restart camera")
  }
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

const textByLanguage = {
  en: {
    permissionTitle: "Use camera?",
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

const backgroundPhotoByName = {
  "CMHR_exterior.jpg": cmhrExteriorPhoto,
  "CMHR_interior.jpg": cmhrInteriorPhoto,
};

const chosenBackground = computed(() => backgroundPhotoByName[props.backgroundName] ?? cmhrInteriorPhoto);

const backgroundStyle = computed(() => ({
  backgroundImage: `url("${chosenBackground.value}")`,
}));
</script>

<style scoped>
.captureScreen {
  height: 100%;
  width: 100%; 
  position: relative;
  overflow : hidden;
  background: #05060a;  
}

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

.homeButton {
  width: 100%;
  border-radius: 999px;
  padding: 10px 14px;
  font-weight: 900;
  cursor: pointer;

  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(0, 0, 0, 0.20);
  color: rgba(255, 255, 255, 0.92);
}


/* Modal */
.modalOverlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: clamp(14px, 3.2vw, 28px);
  background: rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(6px);
}

.modalCard {
  width: min(720px, 92vw);
  text-align: center;
  padding: clamp(16px, 2.6vw, 28px);
  border-radius: 22px;
  background: rgba(0, 0, 0, 0.20);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}

.modalTitle {
  margin: 0;
  font-size: clamp(28px, 4.4vw, 52px);
  line-height: 1.05;
}

.modalBody {
  margin: 12px auto 0 auto;
  max-width: 46ch;
  font-size: 14px;
  opacity: 0.9;
}

.modalButtons {
  margin: 18px auto 0 auto;
  display: grid;
  gap: 12px;
  width: min(560px, 92vw);
}

.cameraVideo {
  width: 100%;
  height: 100%;
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
