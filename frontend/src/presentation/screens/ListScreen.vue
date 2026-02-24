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
      <h1 class="title">{{ screenText.title }}</h1>
    </header>

    <!-- Lists -->
    <div class="lists-wrapper">
      <!-- Objects list -->
      <div class="list-card">
        <h2 class="list-title">{{ screenText.objects }}</h2>
        <div class="scroll-list">
          <div v-for="item in objects" :key="item" class="item">
            {{ item.name }}
          </div>
        </div>
      </div>

      <!-- Topics list -->
      <div class="list-card">
        <h2 class="list-title">{{ screenText.topics }}</h2>
        <div class="scroll-list"> 
          <div v-for="item in topics" :key="item" class="item">
            {{ item.name }}
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  language: { type: String, default: "en" }
})

const textByLanguage = {
  en: {
    title: "Explore Topics",
    objects: "Objects",
    topics: "Topics"
  },
  fr: {
    title: "Explorer les sujets",
    objects: "Objets",
    topics: "Sujets"
  }
};

const screenText = computed(() =>
  props.language === "fr" ? textByLanguage.fr : textByLanguage.en
)

/* Mock data */
const objects = ref(
  Array.from({ length: 50 }, (_, i) => ({
    id: i,
    name: `Object ${i + 1}`
  }))
)

const topics = ref(
  Array.from({ length: 50 }, (_, i) => ({
    id: i,
    name: `Topic ${i + 1}`
  }))
)
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

.title {
  margin: 0;
  font-size: clamp(32px, 5vw, 72px);
  line-height: 1.05;
  letter-spacing: -0.02em;
  text-shadow: 0 12px 34px rgba(0, 0, 0, 0.65);
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
  font-size: 1.3rem;
}

.scroll-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
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
