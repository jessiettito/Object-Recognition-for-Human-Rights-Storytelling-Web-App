<template>
  <main class="screen fullStoryScreen" role="main" aria-label="Full story screen">
    <section class="contentArea" aria-labelledby="title">
      <div class="modalCard storyWrapper">
        <h1 id="title" class="screenTitle">{{ title }}</h1>

        <div class="storyMetaRow">
          <span class="pill">{{ category }}</span>
          <span class="pill" v-if="themeLabel">{{ themeLabel }}</span>
          <span class="pill" v-if="objectLabel">{{ objectLabel }}</span>
        </div>

        <p class="storyAuthor">{{ screenText.by }} {{ author }}</p>

        <article class="storyBody" aria-label="Story text">
          <p v-for="(para, idx) in paragraphs" :key="idx" class="storyParagraph">
            {{ para }}
          </p>
        </article>

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
import { useRoute, useRouter } from "vue-router";
import { sampleStories } from "../../data/stories/sampleStories";
import { themes } from "../../data/themes";
import { objects } from "../../data/objects";

const props = defineProps({
  language: { type: String, default: "en" },
});

const route = useRoute();
const router = useRouter();

const textByLanguage = {
  en: { by: "By", back: "Back", themes: "Back to themes" },
  fr: { by: "Par", back: "Retour", themes: "Retour aux thèmes" },
};

const screenText = computed(() => (props.language === "fr" ? textByLanguage.fr : textByLanguage.en));

const storyId = computed(() => String(route.params.storyId || ""));
const story = computed(() => sampleStories.find((s) => s.id === storyId.value));

function pickLocalized(localized) {
  if (!localized) return "";
  return props.language === "fr" ? localized.fr : localized.en;
}

function findLabel(list, id) {
  const item = list.find((x) => x.id === id);
  if (!item) return "";
  return props.language === "fr" ? item.fr : item.en;
}

const title = computed(() => pickLocalized(story.value?.title) || "Story");
const category = computed(() => pickLocalized(story.value?.category));
const author = computed(() => pickLocalized(story.value?.author));

const themeLabel = computed(() => {
  const id = story.value?.themeIds?.[0];
  return id ? findLabel(themes, id) : "";
});

const objectLabel = computed(() => {
  const id = story.value?.objectIds?.[0];
  return id ? findLabel(objects, id) : "";
});

const fullText = computed(() => pickLocalized(story.value?.full));
const paragraphs = computed(() =>
  fullText.value
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter(Boolean)
);

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
  width: min(900px, 96vw);
  text-align: left;
}

.storyMetaRow {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pill {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.storyAuthor {
  margin: 14px 0 0 0;
  opacity: 0.9;
}

.storyBody {
  margin-top: 18px;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 18px;
}

.storyParagraph {
  margin: 0 0 14px 0;
  line-height: 1.75;
  font-size: 17px;
}

.storyParagraph:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .contentArea {
    padding: 24px 12px;
  }
  .storyBody {
    padding: 16px;
  }
  .storyParagraph {
    font-size: 16px;
  }
}
</style>