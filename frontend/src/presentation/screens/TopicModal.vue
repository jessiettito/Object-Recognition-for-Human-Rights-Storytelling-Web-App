<template>
  <div class="modalOverlay" @click.self="close">
    <div class="modalCard">
      <h2>{{ modalTitle }}</h2>

      <ul>
        <li v-for="topic in topics" :key="topic">
          <button @click="selectTopic(topic)">
            {{ translateTopic(topic) }}
          </button>
        </li>
      </ul>

      <button @click="close">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  topics: Array,
  language: { type: String, default: "en" }
});

const emit = defineEmits(["close","select"]);

const modalTitle =
  props.language === "fr" ? "Choisir un sujet" : "Choose a Topic";

function selectTopic(topic) {
  emit("select", topic);
}

function close() {
  emit("close");
}
</script>