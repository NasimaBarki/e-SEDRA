<script setup>
import router from '@/router';
import VotGraduatoria from './VotGraduatoria.vue';
</script>

<template>
<section class="container mt-3" id="discutivotaB">
    <h2 v-if="VDbisogni.blogAct">{{ VDbisogni.nome }} con discussione</h2>
    <h2 v-else >{{ VDbisogni.nome }}</h2>
	<blockquote class="blockquote">
    <p class="alert alert-primary col-md-12 text-center" role="alert">
        <template v-if="VDbisogni.votAct">
                Fase attiva dal {{ new Date(VDbisogni.dtStart).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '') }} al {{ new Date(VDbisogni.dtStop).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '') }} - Termina tra: <span id="demo">{{ VDbisogni.ggscad }}</span>
            </template>
            <template v-else>
                Fase non attiva
            </template>
        </p>
        <input type="hidden" id="scadenza" v-bind:value="VDbisogni['dtStop']" />

  </blockquote>
    <hr />
    <div class="row justify-content-evenly">     

<!--<hr />-->
		<!-- Display records from DB-->
         <template v-if="VDbisogni.votAct">
            <div class="col-md-3 mt-3">
                <VotGraduatoria v-if="chkVal" :grad = 'grad' :votbp = 'votbp' :user = 'user' :chkVal = 'chkVal' />
            </div>
        <div class="col-md-9 mt-3">
            <!--colonna per table-->
            <div class="table-div mb-3">
                <div id="infoMessagge" class="my-callout d-none"></div>

                <table class="table align-middle" id="Disctable">
                    <thead>
                        <tr>
                            <th>N</th>
                            <th>Titolo</th>
                            <!--<th>Autore</th>-->
                            <th v-if="VDbisogni.blogAct">
                                <span class="bi bi-heart-fill"></span>
                            </th>
                            
                            <template v-if="VDbisogni.IamAuthor">
                                <th colspan="2">
                                <small>Votazione</small>
                            </th>
                            <th></th>
                            </template>
                            
                        </tr>
                    </thead>

                    <tbody>
                        <!-- <tr v-if="VDposts.length == 0">
                                <td colspan="3" class="alert alert-primary col-md-12 mt-3 text-center">Nessun bisogno da visualizzare</td>
                        </tr> -->
                    <template v-for="(post, index) in VDposts" :key="post.idBs">

                        <tr>
                            <td> {{ index + 1 }}
                            </td>
                            <td>
                                <input type="hidden" v-bind:id="'idBs' + post['idBs']" v-bind:value="post['idBs']" />
                                <button @click="redirectSingle(post.idBs)" type="button" class="linkstylebutton btn btn-outline-primary text-start" >
                                {{ post.titleBis }}
                                </button><br>
                                <span class="small">
                                    {{ formatPostText(post) }}
                                </span>
                            </td>
                                <template v-if="VDbisogni.blogAct && VDbisogni.IamAuthor">
                                    <td v-if="post.nlike">{{ post.nlike }}</td>
                                    <td v-else>-</td>
                                </template>
                                <template v-if="VDbisogni.IamAuthor">
                                    <td>
                                
                                <input type="hidden" class="provafunz" v-bind:id="'idBs' + post['idBs']" v-bind:value="post['idBs']" />
                                <my-rating class="rating" max-value="10" v-bind:value="post['grade']"></my-rating>                              
                            </td>
                            <td>
                                <button type="button" class="btn icona" data-bs-toggle="tooltip" title="Cancella Voto" v-bind:data-idbis="post['idBs']" data-crud="D" v-bind:value="post['idBs']" name="cancella-voto" >
                                    <span class="bi bi-trash"></span>
                            </button>
                                  
                            </td>
                                </template>
                        </tr>
                    </template>
                    <tr v-if="VDposts.length == 0">
                                <td colspan="3" class="alert alert-primary col-md-12 mt-3 text-center">Nessun bisogno da visualizzare</td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
         </template>
        
    </div>

</section>	

</template>

<script>
import axios from 'axios'

export default {
    props: ['VDbisogni', 'VDposts', 'user'],
    data() {
        return {
            grad: this.VDbisogni.altridati,
            votbp: 104,
            chkVal: null
        }
    },
    mounted() {
        window.currentUser = this.user

        this.chkValut()
        import('../assets/js/functions')
        import('../js/funzioniValLU')
        import('../js/discubisogni')
    },
    methods: {
        async chkValut() {
            let obj = {}
            obj.idAct = this.votbp
            obj.idUs = this.user.idUs

            let res = await axios.post(this.apiBaseUrl + '/chkValut', {data: JSON.stringify(obj)})
            this.chkVal = res.data

        },
        formatPostText(post) {

      // Handle textBis truncation
      const truncatedText = post.textBis.length > 80 ? post.textBis.substring(0, 80) + ' ...' : post.textBis;

      return `${truncatedText}`;
    },
    redirectSingle(id) {
        localStorage.setItem('VDbisogni', JSON.stringify(this.VDbisogni))
        this.$router.push({path: 'bisognisinglepost', name: 'bisogniSinglePost', params: { id: id}})
    }
    }
    
}
</script>