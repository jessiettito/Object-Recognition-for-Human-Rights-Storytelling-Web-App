<template>
  <main class="screen fullStoryScreen" role="main" aria-label="Full story screen">
    <section class="contentArea" aria-labelledby="title">
      <div class="storyWrapper">

        <!-- Header card -->
        <header class="storyHeader">
          <p v-if="category" class="categoryLabel">{{ category }}</p>

          <h1 id="title" class="screenTitle">{{ title }}</h1>

          <p v-if="author" class="storyAuthor">{{ screenText.by }} <em>{{ author }}</em></p>

          <div class="storyMetaRow">
            <span
              v-for="(theme, index) in themeLabels"
              :key="index"
              class="pill"
            >
              {{ theme }}
            </span>
            <span class="pill pillObject" v-if="objectLabel">{{ objectLabel }}</span>
          </div>

          <div class="headerRule"></div>
        </header>

        <!-- Story body -->
        <article class="storyBody" aria-label="Story text">
          <template v-if="fullType === 'url' && fullUrl">
            <div class="externalBox">
              <span class="externalIcon">↗</span>
              <div>
                <a class="externalLink" :href="fullUrl" target="_blank" rel="noopener noreferrer">
                  {{ props.language === "fr" ? "Ouvrir l'histoire complète" : "Read the full story" }}
                </a>
                <p class="hintText">
                  {{
                    props.language === "fr"
                      ? "Cette histoire s'ouvre dans un nouvel onglet."
                      : "This story opens in a new tab."
                  }}
                </p>
              </div>
            </div>
          </template>

          <template v-else>
            <!-- First paragraph gets lead treatment -->
            <p v-if="paragraphs[0]" class="storyParagraph leadParagraph">
              {{ paragraphs[0] }}
            </p>

            <p
              v-for="(para, idx) in paragraphs.slice(1)"
              :key="idx + 1"
              class="storyParagraph"
            >
              {{ para }}
            </p>
          </template>
        </article>

        <!-- Reference link -->
        <footer v-if="storyLink" class="storyReference">
          <span class="referenceLabel">{{ props.language === "fr" ? "Source" : "Reference" }}</span>
          <a
            class="referenceLink"
            :href="storyLink"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ props.language === "fr" ? "Lire l'histoire complète →" : "Read the full story →" }}
          </a>
        </footer>

        <div class="modalButtons">
          <button class="mainButton backButton" type="button" @click="goBack">
            ← {{ screenText.back }}
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
  en: { by: "By", back: "Back" },
  fr: { by: "Par", back: "Retour" },
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

const themeLabels = computed(() => {
  const ids = story.value?.theme || [];

  // remove duplicates
  const uniqueIds = [...new Set(ids)];

  return uniqueIds
    .map((id) => findLabel(themes, id))
    .filter(Boolean);
});

const objectLabel = computed(() => {
  const id = story.value?.objectIds?.[0];
  return id ? findLabel(objects, id) : "";
});

const storyLink = computed(() => {
  const link = story.value?.link;
  if (!link) return "";
  return props.language === "fr" ? (link.fr || link.en || "") : (link.en || link.fr || "");
});

const fullRaw = computed(() => story.value?.full || null);

const fullValue = computed(() => {
  // fullRaw is the object {type,en,fr} or {en,fr} or null
  return getStoryInfo(fullRaw.value);
});

const fullType = computed(() => {
  const t = fullRaw.value?.type;
  if (typeof t === "string" && t.toLowerCase() === "url") return "url";
  // Back-compat: if full is just a URL string in en/fr, treat as url
  const maybe = fullValue.value;
  return isProbablyUrl(maybe) ? "url" : "text";
});

const fullUrl = computed(() => {
  if (fullType.value !== "url") return "";
  return fullValue.value.trim();
});

const fullText = computed(() => {
  if (fullType.value !=="text") return "";
  const text = fullValue.value;
  return text || getStoryInfo(story.value?.full);
});

function isProbablyUrl(s) {
  return /^https?:\/\/\S+$/i.test((s || "").trim());
}

const paragraphs = computed(() =>
  (fullText.value || "")
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter(Boolean)
);

function goBack() {
  router.back();
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500&display=swap');

.fullStoryScreen {
  overflow-y: auto;
}

.contentArea {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 48px 16px 64px;
}

.storyWrapper {
  width: min(760px, 96vw);
  text-align: left;
}

/* ── Header ── */
.storyHeader {
  margin-bottom: 32px;
}

.categoryLabel {
  margin: 0 0 14px 0;
  font-family: "Inter", "Roboto", sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #93c5fd;
  opacity: 0.9;
}

.screenTitle {
  margin: 0 0 16px 0;
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(32px, 5.5vw, 60px);
  font-weight: 900;
  line-height: 1.08;
  color: #f8fafc;
  letter-spacing: -0.01em;
}

.storyAuthor {
  margin: 0 0 14px 0;
  font-family: "Lora", Georgia, serif;
  font-size: 14px;
  font-style: italic;
  color: #94a3b8;
}

.storyMetaRow {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.headerRule {
  height: 1px;
  background: linear-gradient(90deg, rgba(147, 197, 253, 0.4), transparent);
  margin-bottom: 0;
}

/* ── Pills ── */
.pill {
  font-family: "Inter", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(147, 197, 253, 0.15);
  border: 1px solid rgba(147, 197, 253, 0.3);
  color: #93c5fd;
}

.pillObject {
  background: rgba(253, 230, 138, 0.12);
  border-color: rgba(253, 230, 138, 0.3);
  color: #fde68a;
}

/* ── Story body ── */
.storyBody {
  margin-bottom: 40px;
}

/* Lead / first paragraph — bold hook */
.leadParagraph {
  font-family: "DM Sans", "Inter", sans-serif;
  font-size: clamp(17px, 2vw, 20px);
  font-weight: 500;
  line-height: 1.7;
  color: #f1f5f9;
  margin: 0 0 28px 0;
  padding: 0 0 28px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.storyParagraph {
  font-family: "DM Sans", "Inter", sans-serif;
  font-size: clamp(15px, 1.7vw, 17px);
  font-weight: 400;
  line-height: 1.85;
  color: #cbd5e1;
  margin: 0 0 22px 0;
}

.storyParagraph:last-child {
  margin-bottom: 0;
}

/* ── External link box ── */
.externalBox {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  background: rgba(147, 197, 253, 0.07);
  border: 1px solid rgba(147, 197, 253, 0.2);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
}

.externalIcon {
  font-size: 28px;
  color: #93c5fd;
  line-height: 1;
  flex-shrink: 0;
}

.externalLink {
  display: inline-block;
  font-family: "Inter", sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: #93c5fd;
  text-decoration: underline;
  text-underline-offset: 3px;
  margin-bottom: 6px;
}

.externalLink:hover {
  color: #bfdbfe;
}

.hintText {
  margin: 0;
  font-family: "Inter", sans-serif;
  font-size: 13px;
  color: #64748b;
}

/* ── Reference ── */
.storyReference {
  margin-top: 32px;
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.referenceLabel {
  font-family: "DM Sans", "Inter", sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #64748b;
  flex-shrink: 0;
}

.referenceLink {
  font-family: "DM Sans", "Inter", sans-serif;
  font-size: 14px;
  color: #93c5fd;
  text-decoration: underline;
  text-underline-offset: 3px;
  word-break: break-all;
}

.referenceLink:hover {
  color: #bfdbfe;
}

/* ── Back button ── */
.backButton {
  font-family: "Inter", sans-serif;
  font-size: 14px;
  letter-spacing: 0.04em;
}

@media (max-width: 768px) {
  .contentArea {
    padding: 32px 12px 48px;
  }

  .screenTitle {
    font-size: clamp(28px, 7vw, 40px);
  }

}
</style>
