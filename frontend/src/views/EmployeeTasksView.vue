<template>
  <div class="page-container">
    <h1>{{ pageTitle }}</h1>
    <p>Va urma</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const pageTitle = computed(() => route.name);
</script>

<style scoped>
.page-container { padding: 20px; }
</style>

//de completat