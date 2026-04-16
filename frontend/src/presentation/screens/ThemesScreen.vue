<!-- frontend/src/presentation/screens/ThemesScreen.vue -->
<template>
  <main class="screen themesScreen" role="main" aria-label="Themes screen">

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
            type="button"
            @click="selectThemeFromPopup(theme.id)"
          >
            <img
              v-if="theme.icon"
              :src="`/icons/${theme.icon}`"
              :alt="getThemeDisplay(theme)"
              class="popupThemeIcon"
            />
            <span>{{ getThemeDisplay(theme) }}</span>
          </button>
        </div>
        <button class="popupCancel" @click="goToStory">
          {{ screenText.showAllStories }}
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { themes } from "../../data/Themes.js";
import { objectThemeMap } from "../../data/ObjectThemeMap.js";

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

// Select theme from object. 
// Start timer after popup selection
function selectThemeFromPopup(themeId) {
  activeThemeId.value = themeId;
  showPopup.value = false;
  goToStory();
}

const textByLanguage = {
  en: {
    popupTitle: "{object} is connected to several themes",
    popupSubtitle: "Which one would you like to explore?",
    showAllStories: "Show all stories with this object",
  },
  fr: {
    popupTitle: "{object} est lié à plusieurs thèmes",
    popupSubtitle: "Lequel voulez-vous explorer ?",
    showAllStories: "Afficher toutes les histoires avec cet objet",
  }
};

const screenText = computed(() => (props.language === "fr" ? textByLanguage.fr : textByLanguage.en));

// Helper functions
function getThemeDisplay(theme) {
  return props.language === "fr" ? theme.fr : theme.en;
}

onMounted(() => {
  // If coming with a theme directly (no popup needed), start timer
  if (selectedType.value === "theme" && selectedThemeId.value) {
    goToStory();
    return;
  }
  
  // If object selected, show popup first
  if (selectedType.value === "object" && availableThemes.value.length > 0) {
    showPopup.value = true;
  }
});

function goToStory() {
  const themeId = (currentTheme.value?.id || "").trim();

  const query = {};
  if (selectedObjectId.value) query.objectId = selectedObjectId.value;
  if (themeId) query.themeId = themeId;

  router.push({ path: "/story", query });
}

</script>

<style scoped>

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
  display: flex;
  align-items: center;
  gap: 12px;
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 16px;
  cursor: pointer;
  background: #788dae;
  color: #ffffff;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.22);
  transition: all 0.15s ease;
  text-align: left;
}

.popupThemeIcon {
  width: 36px;
  height: 36px;
  object-fit: contain;
  flex-shrink: 0;
}

.popupButton:hover {
  background: #334155; 
  border-color: rgba(96, 165, 250, 0.45);      
  transform: translateY(-1px);
}

.popupCancel {
  margin-top: 12px;
  border: none;
  background: rgba(101, 215, 188, 0.06);
  font-size: 14px;
  color: #a0abbb;           
  cursor: pointer;
  padding: 10px 14px;
  border-radius: 12px;

  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.popupCancel:hover {
  opacity: 0.7;
}
</style>