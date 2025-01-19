<script setup>
import BisogniDiscutaVota from '@/components/BisogniDiscutiVota.vue';
import BisogniRevisione from '@/components/BisogniRevisione.vue';
import BisogniSegnala from '@/components/BisogniSegnala.vue';
import BisogniDiscuti from '@/components/BisogniDiscuti.vue';
import BisogniDefault from '@/components/BisogniDefault.vue';
</script>

<template>
    <template v-if="nat != 0">
        <template v-for="mom in moment">
            <BisogniSegnala v-if="mom.idAt == 101 && Abisogni.IamAuthor" :Abisogni = 'Abisogni' :posts = 'posts' :topics = 'topics' :user = 'user'/>
            <BisogniRevisione v-if="mom.idAt == 102 && Rbisogni.IamRev" :Rbisogni = 'Rbisogni' :Rposts = 'Rposts' :topics = 'topics' :user = 'user'/>
            <BisogniDiscutaVota v-if="((mom.idAt == 104 && !fasiID.includes(103)) || (mom.idAt == 103 && fasiID.includes(104))) && (VDbisogni.IamRev || VDbisogni.IamAuthor)" :VDbisogni = 'VDbisogni' :VDposts = 'VDposts' :user = 'user'/>
            <BisogniDiscuti v-if="mom.idAt == 103 && !fasiID.includes(104)" :Dbisogni="Dbisogni" :Dposts="Dposts"/>
        </template>
        <BisogniDefault v-if="(conta == 0 || notable == true) && defaultPosts && topics" 
        :posts="defaultPosts" 
        :titlePage="'Nessuna fase attiva riguardante i bisogni, oppure il tuo ruolo non consente la partecipazione alla fase attiva'"
        :h2 = "'I miei Bisogni'"
        :conambito = "false"
        :topics = 'topics'
        />
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
            Dbisogni: {},
            Dposts: [],
            Pbisogni: {},
            field: '',
            gradDefBisogni: 0,
            Pposts: [],
            defaultPosts: null
        }
    },
    mounted() {
        this.fetchTopics()
        this.fetchMoment()
        this.getAllPosts()
    },
    methods:
    {
        async getAllPosts() {
            let obj = {}
            obj.table = 'bisogni'
            obj.role = 'personal'
            obj.idUs = this.user.idUs
            let res = await axios.post(this.apiBaseUrl + '/postsdatelimited', {data: JSON.stringify(obj)})
            this.defaultPosts = res.data
        },
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

                    if(this.Dbisogni.IamAuthor || this.Dbisogni.IamRev) {
                        let obj = {}
                        obj.anonym = true
                        obj.field = field
                        obj.userId = this.user.idUs

                        let res = await axios.post(this.apiBaseUrl + '/getAllPublishBisWithoutGrade', {data: JSON.stringify(obj)})
                        this.Dposts = res.data
                    }
                    else {
                        notable = true
                    }
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
                if(this.moment[i].idAt == 105) {
                    this.Pbisogni = this.moment[i]
                    this.Pbisogni.pubBis = true
                    this.Pbisogni.IamRev = this.IamRevisor(this.Pbisogni.revisore, this.user.roles)
                    this.Pbisogni.IamAuthor = false

                    let obj = {}
                    obj.idAt = 104

                    let res = await axios.post(this.apiBaseUrl + '/getLastPollType', {data: JSON.stringify(obj)})
                    let ballot = res.data

                    if(ballot != null) {
                        if(ballot.ballottaggio == 0) {
                            let field = 'pubblicato'
                            this.field = field
                            if(this.Pbisogni.IamRev) {
                                if(this.gradDefBisogni == 0) {
                                    obj = {}
                                    obj.role = 'revisore'
                                    obj.savegrad = 1
                                    obj.field = field
                                    obj.user_id = this.user.idUs
                                    let res = await axios.post(this.apiBaseUrl + '/getBisResultPolling', {data: JSON.stringify(obj)})
                                    this.Pposts = res.data
                                }
                                if(this.gradDefBisogni == 1) {
                                    obj.check = 1
                                    obj.news = 1
                                }
                                else if(this.gradDefBisogni == 2) {
                                    obj.check = 0
                                    obj.news = 0
                                }
                            }
                        }
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