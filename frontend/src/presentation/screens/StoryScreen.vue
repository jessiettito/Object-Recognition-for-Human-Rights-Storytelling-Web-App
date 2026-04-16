<template>
  <main class="screen storySummaryScreen" role="main" aria-label="Story summary screen">
    <section class="contentArea" aria-labelledby="title">
      <div class="modalCard storyWrapper">
        <h1 id="title" class="screenTitle">
          <span class="titlePrefix">{{ screenText.title }}:</span>
          <span v-if="contextLabel" class="titleContext"> {{ contextLabel }}</span>
        </h1>

        <div class="storiesGrid">
          <article
            v-for="story in stories"
            :key="story.id"
            class="storyCard"
          >
            <div class="storyOverlay">
              <div class="storyMeta">
                <span class="meta">{{ screenText.storyLabel }}</span>
                <span class="divider">|</span>
                <span class="meta">{{ getStoryInfo(story.category) }}</span>
              </div>

              <h2 class="storyTitle">{{ getStoryInfo(story.title) }}</h2>
              
              <p class="storySummary">{{ getStoryInfo(story.summary) }}</p>

              <div class="cardActions">
                <button
                  class="mainButton exploreButton"
                  type="button"
                  @click="openStory(story.id)"
                >
                  {{ screenText.explore }}
                </button>
              </div>
            </div>
          </article>
        </div>

        <!-- Explore other themes (when browsing by theme only, no object) -->
        <div v-if="!selectedObjectId && selectedTheme && otherThemes.length" class="relatedSection">
          <h2 class="relatedTitle">{{ screenText.exploreOtherThemes }}</h2>
          <div class="relatedList" role="list" aria-label="Explore other themes">
            <button
              v-for="theme in otherThemes"
              :key="theme.id"
              class="relatedBtn"
              type="button"
              @click="goToTheme(theme)"
            >
              <img
                v-if="theme.icon"
                :src="`/icons/${theme.icon}`"
                :alt="props.language === 'fr' ? theme.fr : theme.en"
                class="relatedBtnIcon"
              />
              {{ props.language === "fr" ? theme.fr : theme.en }}
            </button>
          </div>
        </div>

        <!-- Explore other objects (when object is in context) -->
        <div v-else-if="selectedObjectId && otherObjects.length" class="relatedSection">
          <h2 class="relatedTitle">{{ screenText.exploreOthers }}</h2>
          <div class="relatedList" role="list" aria-label="Explore other objects">
            <button
              v-for="obj in otherObjects"
              :key="obj.id"
              class="relatedBtn"
              type="button"
              @click="goToRelatedObject(obj)"
            >
              <img
                v-if="obj.icon"
                :src="`/icons/${obj.icon}`"
                :alt="obj.en"
                class="relatedBtnIcon"
              />
              {{ obj.en }}
            </button>
          </div>
        </div>

        <div class="modalButtons">

          <button class="mainButton startButton" type="button" @click="goToList">
            {{ screenText.list }}
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { sampleStories } from "../../data/SampleStories";
import { objectThemeMap } from "../../data/ObjectThemeMap.js";
import { objects } from "../../data/Objects.js";
import { themes } from "../../data/Themes.js";

const props = defineProps({
  language: { type: String, default: "en" },
});

const route = useRoute();
const router = useRouter();

const textByLanguage = {
  en: {
    title: "Stories",
    storyLabel: "Story",
    by: "By",
    explore: "Explore Story",
    list: "Back to List",
    exploreOthers: "Explore other objects",
    exploreOtherThemes: "Explore other themes",
  },
  fr: {
    title: "Histoires",
    storyLabel: "Histoire",
    by: "Par",
    explore: "Explorer l'histoire",
    list: "Retour à la liste",
    exploreOthers: "Explorer d'autres objets",
    exploreOtherThemes: "Explorer d'autres thèmes",
  },
};

const screenText = computed(() =>
  props.language === "fr" ? textByLanguage.fr : textByLanguage.en
);

const selectedTheme = computed(() => String(route.query.themeId || "").trim());
const selectedObjectId = computed(() => String(route.query.objectId || "").trim());

const contextLabel = computed(() => {
  const obj = selectedObjectId.value ? objects.find((o) => o.id === selectedObjectId.value) : null;
  const theme = selectedTheme.value ? themes.find((t) => t.id === selectedTheme.value) : null;

  const objName = obj ? (props.language === "fr" ? obj.fr : obj.en) : "";
  const themeName = theme ? (props.language === "fr" ? theme.fr : theme.en) : "";

  if (objName && themeName) return `${objName} (${themeName})`;
  if (objName) return objName;
  if (themeName) return themeName;
  return "";
});

function getStoryThemeIds(story) {
  return Array.isArray(story.theme) ? story.theme : [];
}

const stories = computed(() => {
  if (selectedTheme.value) {
    return sampleStories.filter((story) =>
      getStoryThemeIds(story).includes(selectedTheme.value)
    );
  }
  if (selectedObjectId.value) {
    const themeIds = objectThemeMap[selectedObjectId.value] || [];
    return sampleStories.filter((story) =>
      getStoryThemeIds(story).some((id) => themeIds.includes(id))
    );
  }
  return sampleStories;
});

function getStoryInfo(field) {
  if (!field) return "";
  return props.language === "fr" ? field.fr : field.en;
}

function openStory(storyId) {
  const query = {};
  if (selectedObjectId.value) query.objectId = selectedObjectId.value;
  if (selectedTheme.value) query.themeId = selectedTheme.value;
  router.push({ path: `/stories/${storyId}`, query });
}

function goToList() {
  router.push("/list");
}

const otherObjects = computed(() => {
  const filtered = objects.filter((o) => o.id !== selectedObjectId.value);
  return filtered
    .map((o) => ({ o, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .slice(0, 5)
    .map(({ o }) => o);
});

const otherThemes = computed(() => {
  const filtered = themes.filter((t) => t.id !== selectedTheme.value);
  return filtered
    .map((t) => ({ t, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .slice(0, 5)
    .map(({ t }) => t);
});

function goToRelatedObject(obj) {
  router.push({ path: "/story", query: { objectId: obj.id } });
}

function goToTheme(theme) {
  router.push({ path: "/story", query: { themeId: theme.id } });
}
</script>

<style scoped>
.storySummaryScreen {
  overflow-y: auto;
}

.screenTitle {
  margin: 0;
  font-size: clamp(34px, 5.2vw, 64px);
  line-height: 1.04;
}

.titleContext {
  opacity: 0.6;
}

.contentArea {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 32px 16px;
}

.storyWrapper {
  width: min(1180px, 96vw);
  text-align: left;
}

.storiesGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 22px;
  align-items: start;
}

.storyCard {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 20px;
  background: #0f172a;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
}

.storyOverlay {
  margin: 0;
  padding: 18px;
  background: rgba(23, 23, 23, 0.96);
  min-height: 260px;
  display: flex;
  flex-direction: column;
}

.storyMeta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  color: #f4bf38;
  font-size: 15px;
  font-weight: 600;
}

.divider {
  opacity: 0.9;
}

.storyTitle {
  margin: 0 0 10px 0;
  font-size: 28px;
  line-height: 1.2;
}

.storyAuthor {
  margin: 0 0 12px 0;
  font-size: 15px;
}

.storySummary {
  margin: 0;
  max-width: 68ch;
  font-size: 17px;
  line-height: 1.7;
}

.cardActions {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 18px;
}

.exploreButton {
  min-width: 190px;
  background: linear-gradient(90deg, #fde68a, #93c5fd);
}

.relatedSection {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.relatedTitle {
  margin: 0 0 16px;
  font-size: clamp(18px, 2.4vw, 26px);
  font-weight: 700;
  opacity: 0.85;
}

.relatedList {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.relatedBtn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.88);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
}

.relatedBtnIcon {
  width: 22px;
  height: 22px;
  object-fit: contain;
  flex-shrink: 0;
}

.relatedBtn:hover {
  background: rgba(255, 255, 255, 0.13);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .contentArea {
    padding: 24px 12px;
  }

  .storyOverlay {
    padding: 20px;
  }

  .storySummary {
    font-size: 16px;
  }

  .cardActions {
    justify-content: stretch;
  }

  .exploreButton {
    width: 100%;
  }
}
</style>