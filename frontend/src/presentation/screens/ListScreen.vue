<template>
   <!-- Main title -->
  <header>
    <h1 class="title">Explore Topics</h1>
  </header>

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
</template>

<script setup>
import { openBlock, ref } from 'vue'
const items = ref([])

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
  background: #f7f9fc;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  margin-bottom: 40px;
}

.title {
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
}

.lists-wrapper {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
  max-width: 1100px;
}

.list-card {
  background: white;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  height: 70vh;
}

.list-title {
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.3rem;

}


.scroll-list {
  flex: 1;
  overflow-y: auto;
  border-radius: 12px;
  padding-right: 6px;
}

.item {
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 8px;
  background: #f1f5fb;
  transition: all 0.2s ease;
  cursor: pointer;
}

.item:hover {
  transform: translateY(-2px);
  background: #e6eefc;
}
</style>
