<template>
  <main class="page" role="main" aria-label="Explore topics screen">

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
          <button v-for="item in objects" :key="item.id" class="item" type="button" @click="selectObject(item)">
            <span class = "listItemText">{{ item.name }}</span>
            <span class="chev" aria-hidden="true">›</span>
          </button>
        </div>
      </section>

      <!-- Topics list -->
      <section class="list-card">
        <h2 class="list-title">{{ screenText.topics }}</h2>
        <div class="scroll-list" role = "list"> 
          <button v-for="item in topics" :key="item.id" class="item" type ="button" @click = "selectTopic(item)">
            <span class = "listItemText">{{ item.name }}</span>
            <span class="chev" aria-hidden="true">›</span>
          </button>
        </div>
      </section>

    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {objects as objectsData} from '../../data/Objects.js'
import {themes as themesData} from '../../data/Themes.js'

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

const objects = computed(() =>
  objectsData.map((o) => ({
    id: o.id,
    name: props.language === "fr" ? o.fr : o.en,
  }))
);

const topics = computed(() =>
  themesData.map((t) => ({
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

</script>

<style scoped>
.page {
  height: 100%;
  min-height: 0;
  overflow: hidden;
  padding: clamp(16px, 2.5vw, 40px);
  display: flex;
  flex-direction: column;
  align-items: center;
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
  min-height: 0;     
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
  height: 100%;      
  min-height: 0;     
}

.list-title {
  text-align: center;
  margin-bottom: 18px;
  font-size: 2.0rem;
}

.scroll-list {
  flex: 1;
  min-height: 0;     
  overflow-y: auto;
  padding-right: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.listItemText {
  font-size: 20px;        
  font-weight: 700;
  line-height: 1.2;
}

.item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.95);

  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.chev {
  opacity: 0.75;
  font-size: 22px;
}

.item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.12);
}
</style>
