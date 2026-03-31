<!-- frontend/src/presentation/screens/ThemesScreen.vue -->
<template>
  <main class="screen themesScreen" role="main" aria-label="Themes screen">

    <section class="contentArea" aria-labelledby="title">
      <div class="modalCard">
        <h1 id="title" class="title">{{ screenText.title }}</h1>

        <!-- Show selected object/theme information -->
        <!-- THEME ONLY -->
        <div v-if="!selectedObjectId && currentTheme" class="selection columnLayout">
          <img
            :src="`/icons/${currentTheme.icon}`"
            :alt="currentTheme.name"
            class="themeIcon"
          />

          <span class="pill">{{ selectionText }}</span>
        </div>

        <!-- OBJECT + THEME -->
        <div v-else-if="selectedObjectId && currentTheme" class="selection">
          <img
            :src="`/icons/${getObjectIcon(selectedObjectId)}`"
            :alt="selectedName"
            class="objectIcon"
          />

          <span class="pill">{{ selectionText }}</span>

          <img
            :src="`/icons/${currentTheme.icon}`"
            :alt="currentTheme.name"
            class="themeIcon"
          />
        </div>
 
        <!-- Display theme and reflective prompt -->
        <div v-if="currentTheme" class="themeContent">
          <div class="promptSection">
            <h3 class="promptLabel">{{ screenText.reflectivePrompt }}</h3>
            <p class="prompt">{{ getReflectivePrompt(currentTheme.id) }}</p>
          </div>
        </div>

        <!-- Fallback when no theme is selected -->
        <p v-else class="body">
          {{ screenText.noThemeSelected }}
        </p>

        <div class="modalButtons">
          <button
            class="mainButton startButton"
            type="button"
            @click="goToStory"
          >
            {{ screenText.continue }}
          </button>
        </div>
      </div>
    </section>

      <!-- Pop up screen -->
    <div v-if="showPopup" class="popupOverlay">
      <div class="modalCard popupCard">
        <h2 class="popupTitle">
          {{ screenText.popupTitle.replace("{object}", selectedName) }}
        </h2>
        <p class="popupSubtitle">
          {{ screenText.popupSubtitle }}
        </p>

        <div class="popupOptions">
          <button
            v-for="theme in availableThemes"
            :key="theme.id"
            class="popupButton"
            @click="selectThemeFromPopup(theme.id)"
          >
            {{ getThemeDisplay(theme) }}
          </button>
        </div>
        <button class="popupCancel" @click="goToStory">
          Continue without selecting
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { themes } from "../../data/Themes.js";
import { objects } from "../../data/Objects.js";
import { objectThemeMap } from "../../data/ObjectThemeMap.js";
import { promptsByThemes } from "../../data/PromptsByThemes.js";

const props = defineProps({
  language: { type: String, default: "en" },
});

const router = useRouter();
const showPopup = ref(false)
const activeThemeId = ref("")

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
  console.log("Navigation state:", navigationState.value);
  console.log("selectedType:", selectedType.value);
  console.log("selectedObjectId:", selectedObjectId.value);
  console.log("availableThemes:", availableThemes.value);

  if (selectedType.value === "object" && availableThemes.value.length > 0) {
    showPopup.value = true;
    console.log("Popup shown!");
  }
});

function selectThemeFromPopup(themeId) {
  activeThemeId.value = themeId;
  showPopup.value = false;
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
    reflectivePrompt: "Reflective Prompt",
    title: "Themes"    
  },
  fr: {
    noThemeSelected: "Aucun thème sélectionné.",
    continue: "Continuer",
    tryAgain: "Réessayer",
    list: "Choisir dans la liste",
    popupTitle: "{object} est lié à plusieurs thèmes",
    popupSubtitle: "Lequel voulez-vous explorer ?",
     reflectivePrompt: "Question de réflexion",
    title: "Thèmes"
  }
};

const screenText = computed(() => (props.language === "fr" ? textByLanguage.fr : textByLanguage.en));

// Helper functions
function getThemeDisplay(theme) {
  return props.language === "fr" ? theme.fr : theme.en;
}


function getReflectivePrompt(themeId) {
  const promptsForTheme = promptsByThemes[themeId];
  if (!promptsForTheme) {
    return props.language === "fr"
      ? "Parlez-nous de votre lien avec ce thème."
      : "Tell us about your connection to this theme.";
  }

  const languagePrompts = promptsForTheme[props.language] || promptsForTheme.en || [];

  if (!languagePrompts.length) {
    return props.language === "fr"
      ? "Parlez-nous de votre lien avec ce thème."
      : "Tell us about your connection to this theme.";
  }

  const randomIndex = Math.floor(Math.random() * languagePrompts.length);
  return languagePrompts[randomIndex];
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

.selection .pill {
  font-family: "Inter", sans-serif;
  font-size: 20px;         
  font-weight: 700;        
  padding: 12px 22px;
  border-radius: 22px;
  background: rgba(147, 197, 253, 0.25); 
  color: #fdf6f0;
  box-shadow: 0 4px 14px rgba(0,0,0,0.35);
  text-transform: capitalize;
  transition: transform 0.15s ease, background 0.15s ease;
}

.selection .pill:hover {
  transform: translateY(-2px);
  background: rgba(147, 197, 253, 0.4);
}

.contentArea {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.promptSection {
  font-family: "Inter", "Roboto", sans-serif;
  font-size: 18px;         
  line-height: 1.6;        
  font-weight: 500;
  color: #fdf6f0;         
  background: rgba(23, 33, 61, 0.35); 
  padding: 16px 20px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3); 
  margin-top: 16px;
  text-align: left;
}

.objectName {
  font-style: italic;
}

.popupOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.25);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popupCard {
  background: #0f172a; 
  color: #ffffff;      
  border-radius: 20px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); 
}

.popupTitle {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
}

.popupSubtitle {
  margin-top: 6px;
  font-size: 18px;
  opacity: 0.85;
}

.popupOptions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popupButton {
  border: none;
  border-radius: 12px;
  padding: 12px;
  font-size: 16px;          
  cursor: pointer;
  background: #1e293b;     
  color: #ffffff;
  transition: all 0.15s ease;
}

.popupButton:hover {
  background: #334155;       
  transform: translateY(-1px);
}

.popupCancel {
  margin-top: 6px;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #94a3b8;           
  cursor: pointer;
}

.popupCancel:hover {
  opacity: 0.7;
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