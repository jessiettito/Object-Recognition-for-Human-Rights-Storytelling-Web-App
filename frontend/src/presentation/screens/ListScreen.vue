<template>
  <main class="page">
    <!-- Main title -->
    <header class="header">
      <h1 class="title">Explore Topics</h1>
    </header>

    <!-- Lists -->
    <div class="lists-wrapper">
      <!-- Objects list -->
      <div class="list-card">
        <h2 class="list-title">Objects</h2>
        <div class="scroll-list">
          <div v-for="item in objects" :key="item" class="item">
            {{ item.name }}
          </div>
        </div>
      </div>

      <!-- Topics list -->
      <div class="list-card">
        <h2 class="list-title">Topics</h2>
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
import { ref } from 'vue'

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
  padding: 40px 5vw;
  background: #05060a;
  color: white;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  margin-bottom: 40px;
  text-align: center;
}

.title {
  font-size: clamp(28px, 4vw, 52px);
  font-weight: 600;
  margin: 0;
}

.lists-wrapper {
  width: 100%;
  max-width: 1100px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
}

.list-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
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
