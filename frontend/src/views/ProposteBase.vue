<script setup>
import ProposteSegnala from '@/components/ProposteSegnala.vue';
</script>

<template>
    <template v-if="nat != 0">
        <template v-for="mom in moment">
            <ProposteSegnala v-if="mom.idAt == 201" :Aproposte="Aproposte" :posts="posts"/>
        </template>
    </template>
</template>

<script>
import axios from 'axios'

export default {
    props: ['user'],
    data() {
        return {
            moment: null,
            nat: 0,
            posts: [],
            conta: 0,
            fasiID: [],
            Aproposte: {}
        }
    },
    async mounted() {
        await this.fetchTopics()
        await this.fetchMoment()
        this.setup()
    },
    methods: {
        async fetchTopics() {
            let res = await axios.get(this.apiBaseUrl + '/ambiti')
            //console.log(res.data)
            this.topics = res.data
        },
        async fetchMoment() {
            let res = await axios.get(this.apiBaseUrl + '/getMoment')
            // console.log(res.data)
            this.moment = res.data
            this.nat = this.moment.length
        },
        IamRevisor(ruol, ruser) {
            // console.log(ruser)
            let k = Object.keys(ruser)
            // console.log(k)

            if(ruser.hasOwnProperty(1))
                return true
                if(ruser.hasOwnProperty(ruol))
                return true
            else {
                for(let j in k) {
                    if(ruser[k[j]].hasOwnProperty(ruol))
                        return true
                }
            }
        },
        compareRuoli(sezau, ruser) {
            // console.log('Sezau ', sezau)
            // console.log('Ruser ', ruser)

            let k = Object.keys(ruser)
            
            for(let i = 0; i < Object.keys(sezau).length; i += 2) {
                for(let j = 0; j < k.length; j++) {
                    // console.log(k[j])
                    // console.log(sezau[i])
                    if(k[j] == sezau[i]) {
                        let sub = sezau[i + 1]
                        // console.log('sub: ', sub)
                        if(sub == 0)
                            return true
                        else {
                            if(ruser[k[j]].hasOwnProperty(sub))
                                return true
                        }
                    }
                }
            }
            return false
        },
        async setup() {
            for(let i in this.moment) {
                this.fasiID.push(this.moment[i].idAt)
            }
            

            for(let i in this.moment) {
                if(this.moment[i].idAt == 201) {
                    this.Aproposte = this.moment[i]
                    this.Aproposte.proAct = true
                    this.Aproposte.IamAuthor = this.compareRuoli(this.Aproposte.author, this.user.roles)
                    this.Aproposte.IamRev = this.IamRevisor(this.Aproposte.revisore, this.user.roles)

                    if(this.Aproposte.IamAuthor) {
                        let obj = {}
                        obj.table = 'proposte'
                        obj.role = 'personal'
                        obj.idUs = this.user.idUs

                        let res = await axios.post(this.apiBaseUrl + '/postsdatelimited', {data: JSON.stringify(obj)})
                        this.posts = res.data
                    }

                    this.conta++
                }
            }
        }
    }
}
</script>