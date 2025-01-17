<script setup>
import BisogniDiscutaVota from '@/components/BisogniDiscutiVota.vue';
import BisogniRevisione from '@/components/BisogniRevisione.vue';
import BisogniSegnala from '@/components/BisogniSegnala.vue';
</script>

<template>
    <template v-if="nat != 0">
        <template v-for="mom in moment">
            <BisogniSegnala v-if="mom.idAt == 101 && Abisogni.IamAuthor" :Abisogni = 'Abisogni' :posts = 'posts' :topics = 'topics' :user = 'user'/>
            <BisogniRevisione v-if="mom.idAt == 102 && Rbisogni.IamRev" :Rbisogni = 'Rbisogni' :Rposts = 'Rposts' :topics = 'topics' :user = 'user'/>
            <BisogniDiscutaVota v-if="((mom.idAt == 104 && !fasiID.includes(103)) || (mom.idAt == 103 && fasiID.includes(104))) && (VDbisogni.IamRev || VDbisogni.IamAuthor)" :VDbisogni = 'VDbisogni' :VDposts = 'VDposts' :user = 'user'/>
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
            Rposts: [],
            notable: false,
            topics: null,
            conta: 0,
            moment: null,
            nat: null,
            Abisogni: {},
            notable: true,
            Rbisogni: {},
            VDbisogni: {},
            fasiID: [],
            VDposts: [],
            Dbisogni: {}
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
        async populateBisogni() {
            for(let i in this.moment) {
                this.fasiID.push(this.moment[i].idAt)
            }

            // console.log('Moment ', this.moment)

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
                if(this.moment[i].idAt == 102) {
                    this.Rbisogni = this.moment[i]
                    this.Rbisogni.revBis = true
                    this.Rbisogni.IamRev = this.IamRevisor(this.Rbisogni.revisore, this.user.roles)
                    this.Rbisogni.author = false

                    if(!this.Rbisogni.IamRev)
                        this.notable = true
                    else {
                        let obj = {}
                        obj.table = 'bisogni'
                        obj.role = 'revisor'
                        obj.idUs = this.user.idUs

                        let res = await axios.post(this.apiBaseUrl + '/postsdatelimited', {data: JSON.stringify(obj)})
                        this.Rposts = res.data
                    }
                }
                if(this.moment[i].idAt == 103 && this.fasiID.includes(104)) {
                    for (const [key, value] of Object.entries(this.moment)) {
                        if(value.idAt == 104)
                            this.VDbisogni = value
                    }
                    // console.log('VDbisogni ', this.VDbisogni)
                    this.VDbisogni.from = 104
                    this.VDbisogni.votAct = true
                    this.VDbisogni.blogAct = true
                    let field = 'pubblicato'
                    if(this.VDbisogni.ballottaggio)
                        field = 'ingrad'
                    
                    this.VDbisogni.IamAuthor = this.compareRuoli(this.VDbisogni.author, this.user.roles)
                    this.VDbisogni.IamRev = this.IamRevisor(this.VDbisogni.revisore, this.user.roles)

                    if(this.VDbisogni.IamAuthor || this.VDbisogni.IamRev) {
                        let obj = {}
                        obj.anonym = true
                        obj.field = field
                        obj.userId = this.user.idUs

                        let res = await axios.post(this.apiBaseUrl + '/getAllPublishBisWithGrade', {data: JSON.stringify(obj)})
                        this.VDposts = res.data

                        // console.log('VDposts ', this.VDposts)
                        for(let po in this.VDposts) {
                            let like = await axios.post(this.apiBaseUrl + '/getMyLikeBAllPost', {data: JSON.stringify({idBs: this.VDposts[po].idBs, idUs: this.user.idUs, at: 104})})
                            if(like != null)
                                this.VDposts[po].nlike = 1
                        }
                    }
                    else {
                        notable = true
                    }
                }
                if(this.moment[i].idAt == 103 && !this.fasiID.includes(104)) {
                    this.Dbisogni = this.moment[i]
                    this.Dbisogni.from = 103
                    this.Dbisogni.votAct = true
                    this.Dbisogni.blogAct = true
                    let field = 'pubblicato'
                    if(this.VDbisogni.ballottaggio)
                        field = 'ingrad'
                    this.Dbisogni.IamAuthor = this.compareRuoli(this.Dbisogni.author, this.user.roles)
                    this.Dbisogni.IamRev = this.IamRevisor(this.Dbisogni.revisore, this.user.roles)

                }
                if(this.moment[i].idAt == 104 && !this.fasiID.includes(103)) {
                    this.VDbisogni = this.moment[i]
                    // console.log('VDbisogni ', this.moment[i])
                    this.VDbisogni.from = 104
                    this.VDbisogni.votAct = true
                    this.VDbisogni.blogAct = false
                    let field = 'pubblicato'
                    if(this.VDbisogni.ballottaggio)
                        field = 'ingrad'
                    this.VDbisogni.IamAuthor = this.compareRuoli(this.VDbisogni.author, this.user.roles)
                    this.VDbisogni.IamRev = this.IamRevisor(this.VDbisogni.revisore, this.user.roles)

                    if(this.VDbisogni.IamAuthor || this.VDbisogni.IamRev) {
                        let obj = {}
                        obj.anonym = true
                        obj.field = field
                        obj.userId = this.user.idUs

                        let res = await axios.post(this.apiBaseUrl + '/getAllPublishBisWithGrade', {data: JSON.stringify(obj)})
                        this.VDposts = res.data

                        // console.log('VDposts ', this.VDposts)
                        for(let po in this.VDposts) {
                            let like = await axios.post(this.apiBaseUrl + '/getMyLikeBAllPost', {data: JSON.stringify({idBs: this.VDposts[po].idBs, idUs: this.user.idUs, at: 104})})
                            if(like != null)
                                this.VDposts[po].nlike = 1
                        }
                    }
                    else {
                        notable = true
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