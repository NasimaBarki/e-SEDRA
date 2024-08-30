<script setup>
import TheMenu from './components/Menu.vue'
import TheFooter from './components/Footer.vue'
</script>

<template>
<TheMenu/>
<div id="contentPage" class="flex-shrink-0">  
    <router-view/>
</div>
<TheFooter />
</template>