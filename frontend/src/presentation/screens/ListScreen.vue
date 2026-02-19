<template>
   <!-- Main title -->
  <header>
    <h1 class="title">Explore Topics</h1>
  </header>

  <!-- Objects list -->
  <div class="list-container left">
    <h2 class="list-title">Objects</h2>
    <div class="scroll-list">
      <div v-for="item in items" :key="item" class="item">
        {{ item }}
      </div>
    </div>
  </div>

  <!-- Topics list -->
  <div class="list-container right">
    <h2 class="list-title">Topics</h2>
    <div class="scroll-list">
      <div v-for="item in items" :key="item" class="item">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const items = ref([])

// Fill with 50 items just for demo
for (let i = 1; i <= 50; i++) {
  items.value.push(`Item ${i}`)
}
</script>


<style scoped>
header {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
}

.title {
  margin: 0;
}

.list-title {
  text-align: center;
  margin: 0 0 10px 0;  /* some spacing below title */
  flex-shrink: 0;     /* don’t shrink title */

}

.list-container {
  position: absolute;
  top: 100px;      /* distance from top */
  height: 200px;   /* fixed height */
  width: 300px;    /* fixed width */
  display: flex;
  flex-direction: column; /* stack title + list vertically */
}

.list-container.left {
  left: 50px;      /* left side */
}

.list-container.right {
  right: 50px;     /* right side */
}

.scroll-list {
  height: 160px;       /* slightly smaller than container to leave space for title */
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
}

.item {
  padding: 8px;
  border-bottom: 1px solid #eee;
}
</style>
