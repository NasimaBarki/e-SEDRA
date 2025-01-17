<script setup>
import Templatedftbisogno from './Templatedftbisogno.vue';
</script>

<template>
<section class="container mt-3" id="revisionebisogni">
    <h2>Revisione Bisogni</h2>
	<blockquote class="blockquote">
    <p class="alert alert-primary col-md-12 text-center" role="alert">
        <template v-if="Rbisogni.revBis">
            Fase attiva dal {{ new Date(Rbisogni.dtStart).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '') }} al {{ new Date(Rbisogni.dtStop).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '') }} - Termina tra: <span id="demo">{{ Rbisogni.ggscad }}</span><br /> {{ Rposts.length }} Bisogni segnalati
        </template>
        <template v-else>
            Fase non attiva
        </template>
        <template v-if="!Rbisogni.bisAct && Rbisogni.IamAuthor">
            Il tuo ruolo non consente la partecipazione in questa fase
        </template>
    </p>
    <input type="hidden" id="scadenza" v-bind:value="Rbisogni['dtStop']" />

  </blockquote>
    <hr />
    <div class="row justify-content-evenly">  
    <Templatedftbisogno  :titleAcc='titleAcc' :confirmButton='confirmButton' :revisionsect='revisionsect' :topics='topics' />
	

<!--<hr />-->

    <div class="table-div mb-3 col-lg-8">
        <div id="infoMessaggedx" class="my-callout d-none"></div>
        <input type="hidden" id="whatcont" value="revisor" />
        <table class="table align-middle table-responsive" id="Bistable">
            <thead>
                <tr>
                    <!--<th>N</th>-->
                    <th>Id</th>
                    <th>Titolo</th>
                    <th>Amb.</th>

                    <th>Autore</th>
                    <th>
                        <small>Rev.</small>
                    </th>
                    <th>
                        <small>Pubb.</small>
                    </th>
                    <th>
                        <small>Canc.</small>
                    </th>

                </tr>
            </thead>

            <tbody>
                <template v-for="(post, index) in Rposts" :key="post.idBs">
                <tr>
                    <!--<td>
                        <?php //echo $key + 1; ?>
                     </td>-->
                    <td>
                        {{ post.idBs }}
                    </td>

                    <td>
                        <button type="button" class="linkstylebutton btn btn-outline-primary text-start" v-bind:data-idbis="post['idBs']" data-crud="R" v-bind:value="post['idBs']">
                            {{ post.titleBis }}
                        </button>
                          <br>
                                        <span class="small"></span>
                    </td>
                    <td>
                        {{ post.ambito }}
                    </td>

                    <td>
                        <span class="small">{{ post.cognome }} {{ post.nome }}</span>
                    </td>
                    <!--<td>
                        <?php //echo $post['nome']; ?>
                    </td>-->
                    <td>
                              
                            <!--<button type="button" disabled class="btn icona" data-bs-toggle="tooltip" title="<?php echo $tool;?>" data-idbis="<?php echo $post['idBs']; ?>" data-crud="R" value="<?php echo $post['idBs']; ?>" name="revision-post">-->
                                <span v-if="!post.dtRev" class="bi bi-pencil-square"></span>
                                <span v-else class="bi bi-pencil-fill"></span>
                        <!--</button>-->
                    </td>

                    <td>
                        <button type="button" class="btn icona" data-bs-toggle="tooltip" v-bind:title="post.pubblicato ? 'Revoca' : 'Pubblica'" v-bind:data-idbis="post['idBs']" v-bind:data-crud="post['idBs']" name="publishun-post" >
                            <span v-if="post.pubblicato" class="bi bi-display"></span>
                            <span v-else class="bi bi-eye-slash"></span>
                        </button>
                    </td>
                   
                    <td>
                        <button type="button" class="btn icona" data-bs-toggle="tooltip" title="Cancella" v-bind:data-idbis="post['idBs']" data-crud="D" value="<?php echo $post['idBs'];?>" name="cancella-post" >
                            <span v-if="post.deleted != 1" class="bi bi-shield-x"></span>
                            <span v-else class="bi bi-shield-fill-x"></span>
                        </button>
                    </td>
                </tr>
                <tr v-if="Rposts.length == 0">
                                <td colspan="3" class="alert alert-primary col-md-12 mt-3 text-center">Nessun bisogno da visualizzare</td>
                        </tr>
                </template>
            </tbody>
        </table>

    </div>
	</div>
</section>	
</template>

<script>
export default {
    props: ['Rbisogni', 'Rposts', 'topics', 'user'],
    data() {
        return {
            titleAcc: 'Revisiona bisogno',
            confirmButton: true,
            revisionsect: true,
            tot: this.Rposts.length,
            rev: false
        }
    },
    mounted() {
        window.currentUser = this.user

        import('../js/revbisogni')
    }
}
</script>