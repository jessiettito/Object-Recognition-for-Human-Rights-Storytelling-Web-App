<script setup>
import WelcomeScreen from "./presentation/screens/WelcomeScreen.vue";

function onWelcomeAction() {
  console.log("Welcome to the Human Rights Storytelling App!");
}
</script>

<template>
  <WelcomeScreen
    backgroundName="CMHR_exterior.jpg"
    @startScan="onWelcomeAction"
    @skipScan="onWelcomeAction"
  />
</template>
