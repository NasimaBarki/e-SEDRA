<script setup>
import BisogniSegnala from '@/components/BisogniSegnala.vue';
</script>

<template>
    <template v-if="nat != 0">
        <template v-for="mom in moment">
            <BisogniSegnala v-if="mom.idAt == 101 && Abisogni.IamAuthor" :Abisogni = 'Abisogni' :posts = 'posts' :topics = 'topics' :user = 'user'/>
        </template>
    </template>
</template>

<script>
import axios from 'axios'

export default {
    props: ['user'],
    data() {
        return{
            posts: [],
            notable: false,
            topics: null,
            conta: 0,
            moment: null,
            nat: null,
            Abisogni: null,
            notable: true
        }
    },
    mounted() {
        this.fetchTopics()
        this.fetchMoment()
    },
    methods:
    {
        async fetchTopics() {
            let res = await axios.get(this.apiBaseUrl + '/ambiti')
            //console.log(res.data)
            this.topics = res.data
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
            // console.log(sezau)
            // console.log(ruser)

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
        async populateBisogni() {
            for(let i in this.moment) {
                if(this.moment[i].idAt == 101) {
                    this.Abisogni = this.moment[i]
                    this.Abisogni.bisAct = true
                    this.Abisogni.IamAuthor = this.compareRuoli(this.Abisogni.author, this.user.roles)
                    this.Abisogni.IamRev = this.IamRevisor(this.Abisogni.revisore, this.user.roles)

                    if(!this.Abisogni.IamAuthor) {
                        this.notable = true
                    } else {
                        let obj = {}
                        obj.table = 'bisogni'
                        obj.role = 'personal'
                        obj.idUs = this.user.idUs

                        let res = await axios.post(this.apiBaseUrl + '/postsdatelimited', {data: JSON.stringify(obj)})
                        this.posts = res.data
                    }
                }
            }
        },
        async fetchMoment() {
            let res = await axios.get(this.apiBaseUrl + '/getMoment')
            // console.log(res.data)
            this.moment = res.data
            this.nat = this.moment.length

            this.populateBisogni()
        }
    }
}
</script>