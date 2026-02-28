<template>
  <main class="page" role="main" aria-label="Explore topics screen">

    <!-- Background layers -->
    <div class="backgroundLayers" aria-hidden="true">
      <div class="backgroundPhoto" :style="backgroundStyle"></div>
      <div class="backgroundPhotoBlur" :style="backgroundStyle"></div>
      <div class="backgroundDarkenOverlay"></div>
    </div>

    <!-- Main title -->
    <header class="header">
      <div class = "headerTop">
        <h1 class="title">{{ screenText.title }}</h1>
        <div class="navButtons" aria-label="Navigation buttons">
          <button class="mainButton secondaryButton" type="button" @click="goToCapture">
            {{ screenText.capture }}
          </button>
          <button class="mainButton homeButton" type="button" @click="goHome">
            {{ screenText.home }}
          </button>
        </div>
      </div>
    </header>

    <!-- Lists -->
    <div class="lists-wrapper">
      <!-- Objects list -->
      <section class="list-card">
        <h2 class="list-title">{{ screenText.objects }}</h2>
        <div class="scroll-list" role = "list">
          <button v-for="item in objects" :key="item" class="item" type="button" @click="selectObject(item)">
            <span class = "listItemText">{{ item.name }}</span>
            <span class="chev" aria-hidden="true">›</span>
          </button>
        </div>
      </section>

      <!-- Topics list -->
      <section class="list-card">
        <h2 class="list-title">{{ screenText.topics }}</h2>
        <div class="scroll-list" role = "list"> 
          <button v-for="item in topics" :key="item" class="item" type ="button" @click = "selectTopic(item)">
            <span class = "listItemText">{{ item.name }}</span>
            <span class="chev" aria-hidden="true">›</span>
          </button>
        </div>
      </section>

    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  language: { type: String, default: "en" }
})
const router = useRouter();

const textByLanguage = {
  en: {
    title: "Explore Topics",
    objects: "Objects",
    topics: "Topics",
    home: "Home",
    capture: "Capture",
  },
  fr: {
    title: "Explorer les sujets",
    objects: "Objets",
    topics: "Sujets",
    home: "Accueil",
    capture: "Caméra",
  }
};

const screenText = computed(() =>
  props.language === "fr" ? textByLanguage.fr : textByLanguage.en
)


const DATA = {
  objects: [
    { id: "passport_id", en: "Passport / ID card", fr: "Passeport / Carte d’identité" },
    { id: "suitcase", en: "Suitcase", fr: "Valise" },
    { id: "letter", en: "Letter", fr: "Lettre" },
    { id: "photograph", en: "Photograph", fr: "Photographie" },
    { id: "newspaper", en: "Newspaper", fr: "Journal" },
    { id: "poster", en: "Protest poster", fr: "Affiche de protestation" },
    { id: "radio", en: "Radio", fr: "Radio" },
    { id: "book", en: "Book", fr: "Livre" },
    { id: "badge", en: "Badge / armband", fr: "Insigne / brassard" },
    { id: "shoe", en: "Shoe", fr: "Chaussure" },
    { id: "blanket", en: "Blanket", fr: "Couverture" },
    { id: "phone", en: "Phone", fr: "Téléphone" },
  ],
  topics: [
    { id: "culture_identity", en: "Culture/Identity", fr: "Culture/Identité" },
    { id: "deportation", en: "Deportation", fr: "Déportation" },
    { id: "discrimination", en: "Discrimination", fr: "Discrimination" },
    { id: "disability", en: "Disability", fr: "Personnes handicapées" },
    { id: "indigenous", en: "Indigenous", fr: "Autochtones" },
    { id: "children", en: "Children", fr: "Enfants" },
    { id: "labour", en: "Labour", fr: "Travail" },
    { id: "political", en: "Political", fr: "Politique" },
    { id: "refugee", en: "Refugee", fr: "Personnes réfugiées" },
    { id: "women", en: "Women", fr: "Femmes" },
    { id: "sexual_orientation", en: "Sexual Orientation", fr: "Orientation sexuelle" },
    { id: "gender_identity", en: "Gender Identity", fr: "Identité sexuelle" },
    { id: "religion", en: "Religion", fr: "Religion" },
    { id: "education", en: "Education", fr: "Éducation" },
    { id: "migrant", en: "Migrant", fr: "Travailleurs migrants" },
    { id: "health", en: "Health", fr: "Santé" },
    { id: "shelter", en: "Shelter", fr: "Logement" },
    { id: "standard_of_living", en: "Standard of Living", fr: "Niveau de vie" },
  ],
};

const objects = computed(() =>
  DATA.objects.map((o) => ({
    id: o.id,
    name: props.language === "fr" ? o.fr : o.en,
  }))
);

const topics = computed(() =>
  DATA.topics.map((t) => ({
    id: t.id,
    name: props.language === "fr" ? t.fr : t.en,
  }))
);

function goHome() {
  router.push("/");
}

function goToCapture() {
  router.push("/capture");
}

function selectObject(item) {
  router.push({
    path: "/themes",
    state: { source: "list", type: "object", id: item.id, name: item.name },
  });
}

function selectTopic(item) {
  router.push({
    path: "/themes",
    state: { source: "list", type: "topic", id: item.id, name: item.name },
  });
}

/* Mock data */

</script>

<style scoped>
.page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  padding: clamp(20px, 3vw, 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #07070a;
  color: rgba(255, 255, 255, 0.92);
}

.header {
  margin-bottom: clamp(24px, 4vw, 40px);
  text-align: center;
  position: relative;
  z-index: 2;
}

.headerTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.title {
  margin: 0;
  font-size: clamp(32px, 5vw, 72px);
  line-height: 1.05;
  letter-spacing: -0.02em;
  text-shadow: 0 12px 34px rgba(0, 0, 0, 0.65);
}

.navButtons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.lists-wrapper {
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
  display: grid;
  gap: 50px;
  grid-template-columns: 1fr;
  flex: 1;
  align-items: stretch;
}
/* Side-by-side on tablets and up */
@media (min-width: 700px) {
  .lists-wrapper {
    grid-template-columns: 1fr 1fr;
  }
}

.list-card {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 22px;
  padding: 24px;
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  height: 70vh;
}

.list-title {
  text-align: center;
  margin-bottom: 18px;
  font-size: 2.0rem;
}

.scroll-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.listRow {
  display: block;             
  width: 100%;                
  padding: 16px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.95);
  font-size: 24px;
  font-weight: 750;
  text-align: left;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}

.listItemText {
  font-size: 20px;        /* try 20–24 */
  font-weight: 700;
  line-height: 1.2;
}

.listRow:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.22);
}

.listRow:active {
  transform: translateY(0px);
}

/* Inner layout */
.rowText {
  display: inline-block;
  max-width: 92%;
  line-height: 1.2;
}

.rowChevron {
  float: right;
  opacity: 0.75;
  font-size: 22px;
  margin-left: 12px;
}

/* Optional scrollbar visibility */
.scroll-list::-webkit-scrollbar {
  width: 10px;
}
.scroll-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.18);
  border-radius: 999px;
}
.scroll-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
}

.item {
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.06);
  transition: all 0.2s ease;
  cursor: pointer;
}

.item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.12);
}
</style>
