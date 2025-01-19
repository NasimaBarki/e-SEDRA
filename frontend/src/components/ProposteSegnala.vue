<script setup>
import Templatedftproposta from './Templatedftproposta.vue';
</script>

<template>
    <section class="container mt-3" id="segnalaproposte">
        <h2>Inserimento Proposte</h2>
        <blockquote class="blockquote">
        <p class="alert alert-primary col-md-12 text-center" role="alert">
            <template v-if="Aproposte.proAct">
                Fase attiva dal {{ new Date(Aproposte.dtStart).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '') }} al {{ new Date(Aproposte.dtStart).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '') }} - Termina tra: <span id="demo">{{ Aproposte.ggscad }}</span><br/>
            </template>
            <template v-else>
                Fase non attiva
            </template>
            <template v-if="Aproposte.proAct && !Aproposte.IamAuthor">
                Il tuo ruolo non consente la partecipazione in questa fase
            </template>
        </p>
        <input type="hidden" id="scadenza" :value="Aproposte.dtStop" />
      </blockquote>
        <hr />
        <div class="row justify-content-evenly">  
    
            <!-- Only show button and content if the user is the author and the phase is active -->
            <div v-if="Aproposte.IamAuthor && Aproposte.proAct" class="col-md-12 mb-2">
                <a href="download/modulo.pdf" target="_blank" role="button" id="downpdf" class="btn btn-primary" name="downpdf">
                    <span class="bi bi-filetype-pdf"></span>&nbsp;Scheda Progettuale
                </a>
            </div>
    
            <Templatedftproposta :titleAcc="' Inserisci una nuova proposta'" :confirmButton="true" :revisionsect="false"></Templatedftproposta>
            <!-- Table for displaying proposals -->
            <div class="table-div mb-3 col-lg-8">
                <div v-if="Aproposte.proAct && Aproposte.IamAuthor">
                    <div id="infoMessaggedx" class="my-callout d-none"></div>
    
                    <input type="hidden" id="whatcont" value="personal" />
    
                    <table class="table table-responsive table-hover align-middle" id="Protable">
                        <thead>
                            <tr>
                                <th>N</th>
                                <th>Titolo</th>
                                <th>Proposta</th>
                                <th colspan="1"><small>Azioni</small></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="posts.length === 0">
                                <td colspan="4" class="alert alert-primary col-md-12 mt-3 text-center">
                                    Nessuna proposta da visualizzare
                                </td>
                            </tr>
                            <tr v-for="(post, index) in posts" :key="post.idPr">
                                <td>{{ index + 1 }}</td>
                                <td>
                                    <button type="button" class="linkstylebutton btn btn-outline-primary text-start" :data-idpro="post.idPr" :value="post.idPr">
                                        {{ post.titlePrp }}
                                    </button>
                                </td>
                                <td>
                                    <a :href="'uploadpdf/' + post.pdfalleg" target="_blank">{{ post.pdforigname }}</a>
                                </td>
                                <td>
                                    <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#myModalPro" title="Elimina" :data-idpro="post.idPr" :value="post.idPr" name="delete-post">
                                        <span class="bi-trash3"></span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>			
                </div>
            </div>
        </div>	
    </section>
    
    <!-- Modal for deleting a proposal -->
    <div id="myModalPro" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Attenzione</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>Premere conferma per eliminare la proposta selezionata.</p>
                    <p class="text-secondary">
                        <small>Operazione irreversibile!</small>
                    </p>
                </div>
                <form method="dialog">
                    <div class="modal-footer">
                        <button type="button" id="closeModalPro" class="btn btn-primary" data-bs-dismiss="modal">Annulla</button>
                        <button type="button" id="deletePro" value="default" class="btn btn-secondary">Conferma</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    </template>

<script>
export default {
    props: ['Aproposte', 'posts'],
    mounted() {
        import('../js/segnalaproposte.js')
    }
}
</script>