<template>
  <main class="captureScreen" role="main" aria-label="Capture screen">
    <div class="backgroundLayers" aria-hidden="true">
      <div class="backgroundPhoto" :style="backgroundStyle"></div>
      <div class="backgroundPhotoBlur" :style="backgroundStyle"></div>
      <div class="backgroundDarkenOverlay"></div>
    </div>

    <!-- Main camera UI -->
    <section class="mainArea" aria-label="Camera area">
      <div class="cameraFrame" role="img" aria-label="Camera preview placeholder">
        <div class="cameraHint">{{ screenText.previewHint }}</div>
      </div>

      <div class="bottomControls" aria-label="Camera controls">
        <button class="mainButton captureButton" type="button" :disabled="showPermissionModal">
          {{ screenText.captureButton }}
        </button>

        <button class="mainButton secondaryButton" type="button" @click="goToList">
          {{ screenText.chooseObject }}
        </button>

        <button class="mainButton homeButton" type="button" @click="goHome">
          {{ screenText.home }}
        </button>

        <label class="uploadButton">
          Upload image (test)
          <input
            class="hiddenInput"
            type="file"
            accept="image/*"
            @change="onTestImageUpload"
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
            <button class="mainButton startButton" type="button" @click="simulatePermissionYes">
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
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import cmhrExteriorPhoto from "../../assets/backgrounds/CMHR_exterior.jpg";
import cmhrInteriorPhoto from "../../assets/backgrounds/CMHR_interior.jpg";
import { detectMainObject } from "../../logic/ObjectDetection.js";

const props = defineProps({
  appTitle: { type: String, default: "Human Rights Object Stories" },
  backgroundName: { type: String, default: "CMHR_interior.jpg" },
  language: { type: String, default: "en" },
});

const router = useRouter();

const showPermissionModal = ref(true);

//Show permission modal 

function goHome() {
  router.push("/");
}

function goToList() {
  router.push("/list");
}

function simulatePermissionYes() {
  showPermissionModal.value = false;
}

const hiddenImageForDetection = ref(null);
const isRunningDetection = ref(false);
const detectionErrorMessage = ref("");

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onerror = () => reject(new Error("Could not read the image file."));
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.readAsDataURL(file);
  });
}

function waitForImageToLoad(imageElement, dataUrl) {
  return new Promise((resolve, reject) => {
    imageElement.onload = () => resolve();
    imageElement.onerror = () => reject(new Error("Could not load the image for detection."));
    imageElement.src = dataUrl;
  });
}

async function onTestImageUpload(event) {
  detectionErrorMessage.value = "";
  const selectedFile = event.target.files?.[0];
  if (!selectedFile) return;

  try {
    isRunningDetection.value = true;

    const imageDataUrl = await readFileAsDataUrl(selectedFile);

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
  } catch (error) {
    detectionErrorMessage.value = error?.message ?? "Something went wrong during detection.";
  } finally {
    isRunningDetection.value = false;
    event.target.value = ""; // lets you upload the same file again
  }
}

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
</style>
