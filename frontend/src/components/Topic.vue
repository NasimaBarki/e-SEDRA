<template>
    <section class="container" id="topicconf">

<h2 class="page-title mt-3">Gestione Ambiti</h2>
 <hr />
<div class="row justify-content-evenly">

    <div class="col-md-6 mt-3">
        <div class="accordion" id="accordionTopic">
            <div class="accordion-item">
                <h2 class="accordion-header" id="sezEditTopic">
                    <button class="accordion-button" id="btnAccTopic" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTopic" aria-expanded="true" aria-controls="collapseTopic">
                        <span class="bi bi-tags"></span>
                    </button>
                </h2>
                <div id="collapseTopic" class="accordion-collapse collapse" aria-labelledby="sezEditTopic" data-bs-parent="#accordionTopic">
                    <div class="accordion-body">
                        <form method="post" action="" id="formTOPIC" class="row g-3 align-items-center">
                            <!-- validation errors for the form -->
       
                            <!-- if editing topic, the id is required to identify that topic -->
                            <!-- TODO: <?php if (isset($_SESSION['isEditingTopic']) && !$_SESSION['isEditingTopic'])  $_POST['idAm']=0;?> -->
                            <input type="hidden" id="idAm" name="idAm" value="<?php if (isset($_POST['idAm'])) echo $_POST['idAm']; ?>" />

                            <div class="col-md-6">
                                <label for="ambito" class="form-label">Ambito</label>
                                <input type="text" class="form-control" id="ambito" name="ambito" value="<?php if (isset($_POST['ambito'])) echo $_POST['ambito']; ?>" placeholder="Ambito" required />
                            </div>
                            <div class="col-md-6">
                                <label for="valenza" class="form-label">Valenza</label>
                                <input type="number" class="form-control" id="valenza" name="valenza" value="<?php if (isset($_POST['valenza'])) echo $_POST['valenza']; ?>" placeholder="Valenza" required />
                            </div>
                            <div class="form-check mb-3">
                                <label class="form-label" for="moreinfo">Richiede informazioni aggiuntive</label>
                                <input type="checkbox" class="form-check-input" name="moreinfo" id="moreinfo"> />
                            </div>
                         
                            <!-- if editing topic, display the update button instead of create button -->
                            <div class="col-12 text-md-end" >
                                <!-- <?php if (isset($_SESSION['isEditingTopic']) && $_SESSION['isEditingTopic']) $tit="Aggiorna Ambito"; else $tit="Salva Ambito"?> -->
                                <input type="submit" id="saveUpdTpc" class="btn btn-primary" name="create_update_topic" value=""/> 
                                <button type="reset" id="annullTpc" class="btn btn-secondary" name="annulla">Annulla</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
<!------------------------->
       
<!---------------------------->
        </div>
        <!-- // Middle form - to create and edit -->
    <div class="col-md-6 mt-3">
        <!-- Display records from DB-->
        <div id="infoMessagge" class="my-callout d-none"></div>
         <!-- Display notification message --> 
        <div class="table-div mb-3">
            <h1 v-if="!topics.length">Ambiti non ancora memorizzati.</h1>
            <table v-else class="table table-striped table-sm align-middle" id="topicTable">
                <thead>
                    <tr>
                        <!--<th>N</th>-->
                        <th>Ambito</th>
                        <th>Valenza</th>
                        <th colspan="2">Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="topic in topics" :key = topic.idAm>
                        <!-- TODO: a cosa serve? <td>
                            <?php echo $key + 1; ?>
                        </td>-->
                        <td>
                            {{ topic.ambito }}
                        </td>
                        <td>
                            {{ topic.valenza }}
                        </td>
                        <td>
                            <button type="button" class="btn" data-bs-toggle="tooltip" title="Modifica" data-idtpc="<?php echo $topic['idAm']; ?>" value="<?php echo $topic['idAm'];?>" name="edit-topic">
                                <span class="bi-pencil-square spedit"></span>
                            </button>

                        </td>
                        <td>
                            <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#myModalTopic" title="Elimina" v:bind:data-idtpc="topic.idAm" v:bind:value="topic.idAm" name="delete-topic">
                                <span class="bi-trash3"></span>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- <?php endif ?> -->
        </div>
        <!-- // Display records from DB -->
    </div>
</div>
</section>

<div id="myModalTopic" class="modal fade" tabindex="-1">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Attenzione</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <p>Premi conferma se vuoi eliminare l'ambito selezionato.</p>
            <p class="text-secondary">
                <small>Operazione irreversibile!</small>
            </p>
        </div>
        <div class="modal-footer">
            <button type="button" id="closeModalTopic" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
            <button type="button" id="cancelTpc" class="btn btn-primary">Conferma</button>
        </div>
    </div>
</div>
</div>

</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            topics:[]
        }
    },

    async mounted() {
        // ottieni topics
        let res = await axios.get("http://localhost:3000/topics");
        this.topics = res.data;
    }
}
</script>