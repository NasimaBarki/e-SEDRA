<script setup>
import axios from 'axios';

import TheMenu from "./components/Menu.vue"
import Topic from './components/pages/Topic.vue'
import TheFooter from './components/Footer.vue'
</script>

<template>
    <TheMenu/>
  <div id="contentPage" class="flex-shrink-0">
    <Topic />
  </div>
  <TheFooter />
</template>