<template>
  <main class="screen storySummaryScreen" role="main" aria-label="Story summary screen">
    <section class="contentArea" aria-labelledby="title">
      <div class="modalCard storyWrapper">

        <!-- Breadcrumb -->
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <button class="breadcrumbLink" type="button" @click="goToList">{{ screenText.browse }}</button>
          <span class="breadcrumbSep">›</span>
          <span v-if="objectLabel" class="breadcrumbLink" @click="goToObjectStories">{{ objectLabel }}</span>
          <template v-if="objectLabel && themeLabel">
            <span class="breadcrumbSep">›</span>
            <span class="breadcrumbCurrent">{{ themeLabel }}</span>
          </template>
          <span v-else-if="themeLabel" class="breadcrumbCurrent">{{ themeLabel }}</span>
          <span v-else-if="objectLabel" class="breadcrumbCurrent"></span>
          <span v-else class="breadcrumbCurrent">{{ screenText.title }}</span>
        </nav>

        <h1 id="title" class="screenTitle">{{ screenText.title }}</h1>

        <!-- Stories grid -->
        <div v-if="stories.length" class="storiesGrid">
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

        <!-- Empty state -->
        <div v-else class="emptyState">
          <p class="emptyIcon">📭</p>
          <p class="emptyTitle">{{ screenText.emptyTitle }}</p>
          <p class="emptySubtext">{{ screenText.emptySubtext }}</p>
          <button class="mainButton" type="button" @click="goToList">{{ screenText.list }}</button>
        </div>

        <div v-if="stories.length" class="modalButtons">
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
    browse: "Browse",
    emptyTitle: "No stories found",
    emptySubtext: "Try exploring a different object or theme.",
  },
  fr: {
    title: "Histoires",
    storyLabel: "Histoire",
    by: "Par",
    explore: "Explorer l'histoire",
    list: "Retour à la liste",
    browse: "Parcourir",
    emptyTitle: "Aucune histoire trouvée",
    emptySubtext: "Essayez un autre objet ou thème.",
  },
};

const screenText = computed(() =>
  props.language === "fr" ? textByLanguage.fr : textByLanguage.en
);

const selectedTheme = computed(() => String(route.query.themeId || "").trim());
const selectedObjectId = computed(() => String(route.query.objectId || "").trim());

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

const objectLabel = computed(() => {
  if (!selectedObjectId.value) return "";
  const obj = objects.find((o) => o.id === selectedObjectId.value);
  return obj ? (props.language === "fr" ? obj.fr : obj.en) : "";
});

const themeLabel = computed(() => {
  if (!selectedTheme.value) return "";
  const theme = themes.find((t) => t.id === selectedTheme.value);
  return theme ? (props.language === "fr" ? theme.fr : theme.en) : "";
});

function openStory(storyId) {
  const query = {};
  if (selectedObjectId.value) query.objectId = selectedObjectId.value;
  if (selectedTheme.value) query.themeId = selectedTheme.value;
  router.push({ path: `/stories/${storyId}`, query });
}

function goToList() {
  router.push("/list");
}

function goToObjectStories() {
  if (selectedObjectId.value) router.push({ path: "/story", query: { objectId: selectedObjectId.value } });
}
</script>

<style scoped>
.storySummaryScreen {
  overflow-y: auto;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  font-size: 13px;
  flex-wrap: wrap;
}

.breadcrumbLink {
  background: none;
  border: none;
  padding: 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  cursor: pointer;
  transition: color 0.15s;
}

.breadcrumbLink:hover {
  color: rgba(255, 255, 255, 0.85);
}

.breadcrumbSep {
  color: rgba(255, 255, 255, 0.25);
}

.breadcrumbCurrent {
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
}

.screenTitle {
  margin: 0;
  font-size: clamp(34px, 5.2vw, 64px);
  line-height: 1.04;
}

.emptyState {
  padding: 60px 20px;
  text-align: center;
}

.emptyIcon {
  font-size: 48px;
  margin: 0 0 12px;
}

.emptyTitle {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 8px;
}

.emptySubtext {
  font-size: 15px;
  opacity: 0.6;
  margin: 0 0 24px;
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