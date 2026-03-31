<!-- frontend/src/presentation/screens/ThemesScreen.vue -->
<template>
  <main class="screen themesScreen" role="main" aria-label="Themes screen">

    <section class="contentArea" aria-labelledby="title">
      <div class="modalCard">

        <!-- THEME ONLY -->
        <div v-if="!selectedObjectId && currentTheme" class="selection columnLayout">
          <img :src="`/icons/${currentTheme.icon}`" :alt="currentTheme.name" class="themeIcon" />
          <button class="pill pillTimer" :class="{ filling: timerActive }" @click="goToStory">
            <span class="pillText">{{ selectionText }}</span>
            <span class="fillBar"></span>
          </button>
        </div>

        <!-- OBJECT + THEME -->
        <div v-else-if="selectedObjectId && currentTheme" class="selection">
          <img :src="`/icons/${getObjectIcon(selectedObjectId)}`" :alt="selectedName" class="objectIcon" />
          <button class="pill pillTimer" :class="{ filling: timerActive }" @click="goToStory">
            <span class="pillText">{{ selectionText }}</span>
            <span class="fillBar"></span>
          </button>
          <img :src="`/icons/${currentTheme.icon}`" :alt="currentTheme.name" class="themeIcon" />
        </div>

        <!-- Fallback when no theme is selected -->
        <p v-if="!currentTheme" class="body">
          {{ screenText.noThemeSelected }}
        </p>

      </div>
    </section>

    <!-- Pop up screen -->
    <div v-if="showPopup" class="popupOverlay">
      <div class="popupCard">
        <p class="popupEyebrow">{{ selectedName }}</p>
        <h2 class="popupTitle">{{ screenText.popupSubtitle }}</h2>

        <div class="popupOptions">
          <button
            v-for="theme in availableThemes"
            :key="theme.id"
            class="popupButton"
            @click="selectThemeFromPopup(theme.id)"
          >
            <img
              :src="`/icons/${theme.icon}`"
              :alt="getThemeDisplay(theme)"
              class="popupThemeIcon"
            />
            <span class="popupThemeName">{{ getThemeDisplay(theme) }}</span>
          </button>
        </div>

        <button class="popupCancel" @click="goToStory">
          {{ props.language === "fr" ? "Continuer sans choisir" : "Continue without selecting" }}
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { themes } from "../../data/Themes.js";
import { objects } from "../../data/Objects.js";
import { objectThemeMap } from "../../data/ObjectThemeMap.js";

const props = defineProps({
  language: { type: String, default: "en" },
});

const router = useRouter();
const showPopup = ref(false)
const activeThemeId = ref("")
const timerActive = ref(false)
let autoRedirectTimer = null

function startAutoRedirect() {
  timerActive.value = true;
  autoRedirectTimer = setTimeout(goToStory, 5000);
}

onUnmounted(() => {
  if (autoRedirectTimer) clearTimeout(autoRedirectTimer);
})

// Navigation state values
const navigationState = computed(() => window.history.state || {});
const selectedType = computed(() => navigationState.value.type || "");
const selectedName = computed(() => navigationState.value.name || "");
const selectedThemeId = computed(() => navigationState.value.themeId || "");
const selectedObjectId = computed(() => navigationState.value.objectId || "");

// Find the current theme to display
// if theme option was selected
const currentTheme = computed(() => {
  const id = activeThemeId.value || selectedThemeId.value
  return themes.find(t => t.id === id)
})


// if object was selected, show themes
const availableThemes = computed(() => {
  if (!selectedObjectId.value) return []
  const themeIds = objectThemeMap[selectedObjectId.value] || []
  return themes.filter(theme => themeIds.includes(theme.id))
})

onMounted(() => {
  if (selectedType.value === "object" && availableThemes.value.length > 0) {
    showPopup.value = true; // timer starts after popup selection
  } else if (currentTheme.value) {
    startAutoRedirect(); // theme already known, start immediately
  }
});

function selectThemeFromPopup(themeId) {
  activeThemeId.value = themeId;
  showPopup.value = false;
  startAutoRedirect();
}


// Display text for the selected item
const selectionText = computed(() => {
  if (selectedType.value === "theme" && selectedName.value) {
    const prefix = props.language === "fr" ? "Thème" : "Theme";
    return `${prefix}: ${selectedName.value}`;
  }
  
  if (selectedType.value === "object" && selectedName.value) {
    const prefix = props.language === "fr" ? "Objet" : "Object";
    const themeName = currentTheme.value ? getThemeDisplay(currentTheme.value) : "";
    return `${selectedName.value} → ${themeName}`;
  }
  return "";
});

const textByLanguage = {
  en: {
    noThemeSelected: "No theme selected. Please choose a theme.",
    continue: "Continue",
    tryAgain: "Try again",
    list: "Choose from list",
    popupTitle: "{object} is connected to several themes",
    popupSubtitle: "Which one would you like to explore?",
    title: "Themes"
  },
  fr: {
    noThemeSelected: "Aucun thème sélectionné.",
    continue: "Continuer",
    tryAgain: "Réessayer",
    list: "Choisir dans la liste",
    popupTitle: "{object} est lié à plusieurs thèmes",
    popupSubtitle: "Lequel voulez-vous explorer ?",
    title: "Thèmes"
  }
};

const screenText = computed(() => (props.language === "fr" ? textByLanguage.fr : textByLanguage.en));

// Helper functions
function getThemeDisplay(theme) {
  return props.language === "fr" ? theme.fr : theme.en;
}



const objectsList = computed(() =>
  objects.map(o => ({
    id: o.id,
    name: props.language === "fr" ? o.fr : o.en,
    icon: o.icon,
  }))
);

const themesList = computed(() =>
  themes.map(t => ({
    id: t.id,
    name: props.language === "fr" ? t.fr : t.en,
    icon: t.icon,
  }))
);

function getObjectIcon(objectId) {
  const obj = objectsList.value.find(o => o.id === objectId);
  return obj?.icon || "";
}

onMounted(() => {
  if (selectedType.value === "object" && availableThemes.value.length > 0) {
    showPopup.value = true;
  }
});

function goToStory() {
  if (autoRedirectTimer) clearTimeout(autoRedirectTimer);
  const themeId = (currentTheme.value?.id || "").trim();

  const query = {};
  if (themeId) {
    query.themeId = themeId;
  } else if (selectedObjectId.value) {
    query.objectId = selectedObjectId.value;
  }

  router.push({ path: "/story", query });
}

function goToCapture() {
  router.push("/capture");
}

function goToList() {
  router.push("/list");
}
</script>

<style scoped>

.title {
  margin: 0;
  font-size: clamp(34px, 5.2vw, 64px);
  line-height: 1.04;
}

.body {
  margin: 14px auto 0 auto;
  max-width: 60ch;
  font-size: 14px;
  opacity: 0.92;
}

.pill {
  font-family: "Inter", sans-serif;
  font-size: 20px;
  font-weight: 700;
  padding: 12px 22px;
  border-radius: 22px;
  background: rgba(147, 197, 253, 0.25);
  color: #fdf6f0;
  box-shadow: 0 4px 14px rgba(0,0,0,0.35);
  text-transform: capitalize;
}

.pillTimer {
  position: relative;
  overflow: hidden;
  border: none;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.pillTimer:hover {
  transform: translateY(-2px);
}

.pillText {
  position: relative;
  z-index: 2;
}

.fillBar {
  position: absolute;
  inset: 0;
  width: 0;
  background: linear-gradient(90deg, rgba(167, 243, 208, 0.5), rgba(96, 165, 250, 0.5));
  z-index: 1;
  transition: none;
}

.pillTimer.filling .fillBar {
  animation: pillFill 5s linear forwards;
}

@keyframes pillFill {
  from { width: 0% }
  to   { width: 100% }
}

.contentArea {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}


.objectName {
  font-style: italic;
}

.popupOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 24px;
}

.popupCard {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border-radius: 24px;
  padding: 28px 24px 20px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
}

.popupEyebrow {
  margin: 0 0 6px 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #93c5fd;
}

.popupTitle {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
  color: #f1f5f9;
}

.popupOptions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.popupButton {
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 12px 16px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  color: #f1f5f9;
  text-align: left;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
}

.popupButton:hover {
  background: rgba(147, 197, 253, 0.12);
  border-color: rgba(147, 197, 253, 0.35);
  transform: translateY(-1px);
}

.popupThemeIcon {
  width: 36px;
  height: 36px;
  object-fit: contain;
  flex-shrink: 0;
}

.popupThemeName {
  flex: 1;
}

.popupCancel {
  border: none;
  background: transparent;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  transition: color 0.15s ease;
}

.popupCancel:hover {
  color: #94a3b8;
}

.selection {
  display: flex;
  align-items: center;      
  justify-content: center;  
  gap: 24px;                
  margin: 16px 0;
}

.selection .objectIcon,
.selection .themeIcon {
  width: 80px;
  height: 80px;
  object-fit: contain;
  transition: transform 0.2s ease, filter 0.2s ease;

}

.selection .objectIcon:hover,
.selection .themeIcon:hover {
  transform: scale(1.1);            
  filter: brightness(1.2);      
}

.selection.columnLayout {
  flex-direction: column;
}

</style>