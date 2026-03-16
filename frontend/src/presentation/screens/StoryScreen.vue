<template>
  <main class="screen storySummaryScreen" role="main" aria-label="Story summary screen">
    <section class="contentArea" aria-labelledby="title">
      <div class="modalCard storyWrapper">
        <h1 id="title" class="title">{{ screenText.title }}</h1>
        <p class="body introText">{{ screenText.subtitle }}</p>

        <div class="storiesGrid">
          <article
            v-for="story in sampleStories"
            :key="story.id"
            class="storyCard"
          >
            <div
              class="storyImage"
              :style="{ backgroundImage: `url(${story.image})` }"
              aria-hidden="true"
            />

            <div class="storyOverlay">
              <div class="storyMeta">
                <span class="metaLink">{{ screenText.storyLabel }}</span>
                <span class="divider">|</span>
                <span class="metaLink">{{ getStoryCategory(story) }}</span>
              </div>

              <h2 class="storyTitle">{{ getStoryTitle(story) }}</h2>
              <p class="storyAuthor">{{ screenText.by }} {{ getStoryAuthor(story) }}</p>
              <p class="storySummary">{{ getStorySummary(story) }}</p>

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

const props = defineProps({
  language: { type: String, default: "en" },
});

const router = useRouter();

const sampleStories = [
  {
    id: "story-1",
    category: {
      en: "Economic and social rights",
      fr: "Droits économiques et sociaux",
    },
    title: {
      en: "Freedom from want",
      fr: "À l'abri du besoin",
    },
    author: {
      en: "Leslie Vryenhoek",
      fr: "Leslie Vryenhoek",
    },
    summary: {
      en: "A reflection on hunger, dignity, and access to support systems during times of uncertainty.",
      fr: "Une réflexion sur la faim, la dignité et l'accès aux systèmes de soutien en période d'incertitude.",
    },
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "story-2",
    category: {
      en: "Migration and belonging",
      fr: "Migration et appartenance",
    },
    title: {
      en: "The suitcase I never unpacked",
      fr: "La valise que je n'ai jamais défaite",
    },
    author: {
      en: "Sample Author",
      fr: "Auteur exemple",
    },
    summary: {
      en: "A personal object becomes a symbol of movement, memory, and the search for home.",
      fr: "Un objet personnel devient un symbole de déplacement, de mémoire et de recherche d'un foyer.",
    },
    image:
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "story-3",
    category: {
      en: "Identity and expression",
      fr: "Identité et expression",
    },
    title: {
      en: "Threads of identity",
      fr: "Les fils de l'identité",
    },
    author: {
      en: "Sample Author",
      fr: "Auteur exemple",
    },
    summary: {
      en: "Clothing, culture, and self-expression reveal how rights and identity intersect in daily life.",
      fr: "Les vêtements, la culture et l'expression de soi montrent comment les droits et l'identité se croisent dans la vie quotidienne.",
    },
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
  },
];

const textByLanguage = {
  en: {
    title: "Stories",
    subtitle:
      "Explore sample story summaries and test the Explore Story button flow before connecting live CMHR story URLs.",
    storyLabel: "Story",
    by: "By",
    explore: "Explore Story",
    back: "Back",
    themes: "Back to themes",
  },
  fr: {
    title: "Histoires",
    subtitle:
      "Explorez des résumés d'histoires d'exemple et testez le parcours du bouton Explorer l'histoire avant de connecter les vraies URL du CMHR.",
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

function getStoryCategory(story) {
  return props.language === "fr" ? story.category.fr : story.category.en;
}

function getStoryTitle(story) {
  return props.language === "fr" ? story.title.fr : story.title.en;
}

function getStoryAuthor(story) {
  return props.language === "fr" ? story.author.fr : story.author.en;
}

function getStorySummary(story) {
  return props.language === "fr" ? story.summary.fr : story.summary.en;
}

function openStory(storyId) {
  router.push({
    path: `/stories/${storyId}`,
  });
}

function goBack() {
  router.back();
}

function goToThemes() {
  router.push("/themes");
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
  max-width: 70ch;
  font-size: 14px;
  opacity: 0.92;
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

.introText {
  margin-bottom: 26px;
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

.storyImage {
  height: 180px;
  background-size: cover;
  background-position: center;
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

.metaLink {
  display: inline-block;
  padding-bottom: 2px;
  border-bottom: 1px solid #f4bf38;
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
  background: #f4bf38;
  color: #111111;
}

.exploreButton:hover {
  background: #e6b02f;
}

.modalButtons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 26px;
}

@media (max-width: 768px) {
  .contentArea {
    padding: 24px 12px;
  }

  .storyImage {
    min-height: 220px;
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