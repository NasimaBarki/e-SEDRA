<script setup>
import Templatedftbisogno from './Templatedftbisogno.vue';
</script>

<template>
<section class="container mt-3" id="segnalabisogni">
    <h2>Segnalazione Bisogni</h2>
    <blockquote class="blockquote">
        <p class="alert alert-primary col-md-12 text-center" role="alert">
            <template v-if="Abisogni.bisAct">
                Fase attiva dal {{ new Date(Abisogni.dtStart).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '') }} al {{ new Date(Abisogni.dtStop).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '') }} - Termina tra: <span id="demo">{{ Abisogni.ggscad }}</span>
            </template>
            <template v-else>
                Fase non attiva
            </template>
            <template v-if="!Abisogni.bisAct && Abisogni.IamAuthor">
                Il tuo ruolo non consente la partecipazione in questa fase
            </template>
        </p>
        <input type="hidden" id="scadenza" v-bind:value="Abisogni['dtStop']" />

    </blockquote>

    <hr />
    <div class="row justify-content-evenly">

        <Templatedftbisogno v-if="Abisogni.IamAuthor && Abisogni.bisAct && titleAcc && confirmButton && revisionsect != null && topics" :titleAcc='titleAcc' :confirmButton='confirmButton' :revisionsect='revisionsect' :topics='topics' />
        <div class="table-div mb-3 col-lg-8">
            <template v-if="Abisogni.bisAct && Abisogni.IamAuthor">
                <div id="infoMessaggedx" class="my-callout d-none"></div>
                <input type="hidden" id="whatcont" value="personal" />
                <table class="table table-responsive table-hover align-middle" id="Bistable">
                    <thead>
                        <tr>
                            <th>N</th>
                            <th>Titolo</th>
                            <!--<th>Autore</th>-->
                            <th colspan="1">
                                <small>Azioni</small>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <template v-for="(post, index) in posts" :key="post.idBs">
                            <tr>
                                <td>
                                    {{ index + 1 }}
                                </td>
                                <td>
                                    <button type="button" class="linkstylebutton btn btn-outline-primary text-start" data-idbis="<?php echo  $post['idBs']; ?>" value="<?php echo  $post['idBs'];?>">
                                        {{ post.titleBis }}
                                    </button>
                                </td>
                                <!--<td> io </td>-->
                                <td>
                                    <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#myModalBis" title="Elimina" v-bind:data-idbis="post['idBs']" v-bind:value="post['idBs']" name="delete-post">
                                        <span class="bi-trash3"></span>
                                    </button>
                                </td>
                            </tr>
                        </template>
                        <tr v-if="posts.length == 0">
                                {{ posts }}
                                <td colspan="3" class="alert alert-primary col-md-12 mt-3 text-center">Nessun bisogno da visualizzare</td>
                        </tr>
                    </tbody>
                </table>

            </template>
        </div>
        <!--</div>-->
    </div>
</section>

<div id="myModalBis" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Attenzione</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <p>Premere conferma per eliminare il bisogno selezionato.</p>
                <p class="text-secondary">
                    <small>Operazione irreversibile!</small>
                </p>
            </div>
            <form method="dialog">
                <div class="modal-footer">
                    <button type="button" id="closeModalBis" class="btn btn-primary" data-bs-dismiss="modal">Annulla</button>
                    <button type="button" id="deleteBis" value="default" class="btn btn-secondary">Conferma</button>
                </div>
            </form>
        </div>
    </div>
</div>
</template>

<script>

export default {
    props: ['Abisogni', 'posts', 'topics', 'user'],
    data() {
        return {
            titleAcc: null,
            confirmButton: null,
            revisionsect: null,
            tot: this.posts.length,
        }
    },
    mounted() {
        // import('../js/table.js')
        import('../js/segnalabisogni.js')

        window.currentUser = this.user

        if(this.Abisogni.IamAuthor && this.Abisogni.bisAct) {
            this.titleAcc = 'Segnala nuovo bisogno'
            this.confirmButton = true
            this.revisionsect = false
        }
    }
}
</script>
