<script setup>
import TheMenu from './components/TheMenu.vue'
import TheFooter from './components/TheFooter.vue'
import Setup from './views/Setup.vue'
</script>

<template>
<Setup v-if="setup"></Setup>

<div v-else>
    <TheMenu></TheMenu>
    <div id="contentPage" class="flex-shrink-0">  
        <router-view/>
    </div>
    <TheFooter></TheFooter>
</div>
</template>

<script>

import axios from 'axios'

export default {
    data() {
        return {
            setup: false
        }
    },
    mounted() {
        this.isSetup()
    },
    methods:
    {
        async isSetup()
        {
            let res = await axios.get(this.apiBaseUrl + '/setup')
                .then((result) => {
                    if(result.data.message != 'true') {
                        this.$router.push({ path: '/setup' })
                        this.setup = true
                    } else {
                        this.$router.push({ name: this.$route.name })
                        this.setup = false
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }
}
</script>