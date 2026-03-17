<template>
  <main class="screen storySummaryScreen" role="main" aria-label="Story summary screen">
    <section class="contentArea" aria-labelledby="title">
      <div class="modalCard storyWrapper">
        <h1 id="title" class="screenTitle">{{ screenText.title }}</h1>

        <div class="storiesGrid">
          <article
            v-for="story in sampleStories"
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
              <p class="storyAuthor">{{ screenText.by }} {{ getStoryInfo(story.author) }}</p>
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

        <div class="modalButtons">
          <button class="mainButton startButton" type="button" @click="goBack">
            {{ screenText.back }}
          </button>

          <button class="mainButton secondaryButton" type="button" @click="goToThemes">
            {{ screenText.themes }}
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { sampleStories } from "../../data/SampleStories";

const props = defineProps({
  language: { type: String, default: "en" },
});

const router = useRouter();

const textByLanguage = {
  en: {
    title: "Stories",
    storyLabel: "Story",
    by: "By",
    explore: "Explore Story",
    back: "Back",
    themes: "Back to themes",
  },
  fr: {
    title: "Histoires",
    storyLabel: "Histoire",
    by: "Par",
    explore: "Explorer l'histoire",
    back: "Retour",
    themes: "Retour aux thèmes",
  },
};

const screenText = computed(() =>
  props.language === "fr" ? textByLanguage.fr : textByLanguage.en
);

const stories = computed(() => sampleStories);

function getStoryInfo(storyCategory) {
  return props.language === "fr" ? storyCategory.fr : storyCategory.en;
}

function openStory(storyId) {
  router.push(`/stories/${storyId}`);
}

function goBack() {
  router.back();
}

function goToThemes() {
  router.push("/themes");
}
</script>

<style scoped>
.screenTitle {
  margin: 0;
  font-size: clamp(34px, 5.2vw, 64px);
  line-height: 1.04;
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