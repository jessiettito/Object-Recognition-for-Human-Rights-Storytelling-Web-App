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
          <template v-if="fullType === 'url' && fullUrl">
          <a class="externalLink" :href="fullUrl" target="_blank" rel="noopener noreferrer">
            {{ props.language === "fr" ? "Ouvrir l’histoire" : "Open story" }}
          </a>

          <iframe class="storyFrame" :src="fullUrl" title="Story content"></iframe>
          </template>

          <template v-else>
            <p v-for="(para, idx) in paragraphs" :key="idx" class="storyParagraph">
              {{ para }}
            </p>
          </template>
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
import { sampleStories } from "../../data/SampleStories";
import { themes } from "../../data/Themes";
import { objects } from "../../data/Objects";

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

function getStoryInfo(storyField) {
  if (!storyField) return "";
  return props.language === "fr" ? storyField.fr : storyField.en;
}

function findLabel(list, id) {
  const item = list.find((x) => x.id === id);
  if (!item) return "";
  return props.language === "fr" ? item.fr : item.en;
}

const title = computed(() => getStoryInfo(story.value?.title) || "Story");
const category = computed(() => getStoryInfo(story.value?.category));
const author = computed(() => getStoryInfo(story.value?.author));

const themeLabel = computed(() => {
  const id = story.value?.themeIds?.[0];
  return id ? findLabel(themes, id) : "";
});

const objectLabel = computed(() => {
  const id = story.value?.objectIds?.[0];
  return id ? findLabel(objects, id) : "";
});

const fullRaw = computed(() => getStoryInfo(story.value?.full) || null);

const fullType = computed(() => {
  const t = fullRaw.value?.type;
  if (typeof t === "string" && t.toLowerCase() === "url") return "url";
  // Back-compat: if full is just a URL string in en/fr, treat as url
  const maybe = getStoryInfo(fullRaw.value);
  return isProbablyUrl(maybe) ? "url" : "text";
});

const fullUrl = computed(() => {
  if (fullType.value !== "url") return "";
  return getStoryInfo(fullRaw.value);
});

const fullText = computed(() => {
  if (fullType.value !=="text") return "";
  const text = getStoryInfo(fullRaw.value);
  return text || getStoryInfo(story.value?.full);
});

function isProbablyUrl(s) {
  return /^https?:\/\/\S+$/i.test((s || "").trim());
}

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

.storyFrame {
  width: 100%;
  height: min(70vh, 820px);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px;
  background: rgba(0,0,0,0.25);
}

.externalLink {
  display: inline-block;
  margin-bottom: 12px;
  font-weight: 700;
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