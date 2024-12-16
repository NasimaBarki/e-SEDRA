<script setup>
import Ruoli from '../components/Ruoli.vue'
</script>

<template>

<section class="container" id="userconf">
    <h2 class="page-title mt-3">Gestione Utenti</h2>
    <hr />

    <div class="row justify-content-evenly">

        <!--<div class="col-md-1"></div>-->
        <!-- Middle form - to create and edit  -->
        <div class="col-md-5 mt-3">
            <!--action sidebar-sticky position-sticky-->

            <div class="accordion" id="accordionUser">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="sezEditUser">
                        <button class="accordion-button" id="btnAccCreateUser" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            <span class="bi-person-plus-fill"></span>
                        </button>
                    </h2>
                    <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="sezEditUser" data-bs-parent="#accordionUser">
                        <div class="accordion-body">

                            <form method="post" id="AUform" action="" class="row g-3 align-items-center">
                                <!--row-cols-lg-autoclass="collapse"-->

                                <!-- validation errors for the form 
                             
					-->
                                <fieldset id="allElements" class="row g-3 align-items-center">
                                    <input type="hidden" id="IDModUser" name="user_id" v-bind:value="editU.idUs" />
                                    <!-- if editing user, the id is required to identify that user -->
                                    
                                    <div class="col-12">
                                       
                                        <div class="input-group">
                                            <div class="input-group-text">@</div>
                                            <input type="email" class="form-control" id="e-mail" name="email" value="" placeholder="* Email" required />
                                        </div>
                                        <!--<label for="email" class="form-label">Email</label>-->
                                    </div>
                                    <div class="form-floating col-md-6">
                                      
                                        <input type="text" class="form-control" id="nome" name="nome" value="" required />
                                        <label for="nome" class="form-label">* Nome</label>
                                    </div>
                                    <div class="form-floating col-md-6">
                                  
                                        <input type="text" class="form-control" id="cognome" name="cognome" value="" required />
                                        <label for="cognome" class="form-label">* Cognome</label>
                                    </div>

                                    <div class="form-floating col-md-6">
                                  
                                        <input type="tel" class="form-control" id="cell" name="cell" value=""  />
                                        <label for="cell" class="form-label">Telefono</label>
                                    </div>
                                    <div class="form-floating col-md-6">
                                    
                                        <input type="text" class="form-control hide" id="cod" name="cod" value=""  />
                                        <label for="cod" class="form-label">Codice</label>
                                    </div>
                                    <div class="form-floating col-md-6">
                                      
                                        <!--                                                                                                    <?php date_default_timezone_set('Europe/Rome');
                                    echo str_replace(" ", "T", date('Y-m-d H:i'));?>" -->
                                        <input type="datetime-local" class="form-control form-control-plaintext" id="dtPsw" name="dtPsw" v-model="dtNow"
                                            disabled />

                                        <label for="dtPsw" class="form-label">
                                            Data creazione password</label>
                                    </div>
                                    <div class="form-floating col-md-6">
                                        <input type="text" class="form-control form-control-plaintext" id="dtscPsw" name="dtscPsw" value="" disabled />
                                        <label for="dtscPsw" class="form-label">Giorni scadenza password</label>
                                    </div>
                                    <Ruoli :title="title" :ruoli="ruoli"></Ruoli>                     

                                </fieldset>
                                <!-- if editing user, display the update button instead of create button 
				-->
                                <div class="col-12 text-md-end">
                                    <input type="submit" id="saveAddUser" class="btn btn-primary" name="create_user" value="Salva Utente" />
                                    <button type="reset" id="annullAdd" class="btn btn-secondary" name="annulla">Annulla</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" id="sezImportUser">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            <span class="bi-person-lines-fill"></span>&nbsp;Importa Utenti
                        </button>
                    </h2>
                    <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="sezImportUser" data-bs-parent="#accordionUser">
                        <div class="accordion-body">
                            
                            <!--class="collapse"-->
                            <form enctype="multipart/form-data" id="IULform" name="IULform" method="POST" action="<?php echo $_SERVER['PHP_SELF']; ?>">
                                <div class="input-group col-12 row align-middle">
                                    <label class="form-control-label">Ruolo primario:</label>
                                    <div id="RuoliPrim" class="col-12 mb-3">
                                        <div class="btn-group" role="group" aria-label="Elenco Ruoli Primari">
                                            <template v-for="ruolo in ruoli">
                                                <input type="radio" class="btn-check p-2" name="Irprim" v-bind:id="'Irp' + ruolo['idRl']" v-bind:value="ruolo['idRl']" autocomplete="off" @change="bottonePrimarioChecked = true"/>
                                                <label class="btn btn-outline-primary p-2" v-bind:for="'Irp' + ruolo['idRl']">
                                                    <!-- <?php echo $rol['ruolo']?> -->
                                                     {{ ruolo['ruolo'] }}
                                                </label>
                                            </template>
                                        </div>
                                    </div>

                                    <div class="input-group col-md-6 mb-3">
                                        <input type="file" class="form-control" name="fileToUpload" id="fileToUpload" @click="checkIfFileSelected" :disabled="!bottonePrimarioChecked"/><!--style="opacity:0;"-->
                                    </div>
                                    
                                    <div class="col-12 text-md-end">
                                       
                                        <!--<input type="hidden" name="hidden_field" value="1" />--><!--per progress bar-->
                                        <!--<input type="submit" id="importUserList" name="importUserList" value="Importa Utenti" class="btn btn-primary" />-->
                                        <button type="reset" id="annullIul" class="btn btn-secondary" name="annulla">Annulla</button>

                                    </div>
                                    <div id="spinner-div" class="pt-2 pb-3 d-flex align-items-center justify-content-center d-none">
                                        <div class="spinner-border text-primary" role="status"></div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Display records from DB-->
        <div class="col-md-7 mt-3 justify-content-center">
            <div id="infoMessaggedx" class="my-callout d-none"></div>

 

            <form name="alphaform" method="POST" action="" class="mb-2 ">
                <nav class="alfa pagination btn-group justify-content-center" role="group" aria-label="Alfabeto per sottogruppi utenti">
                    <!--                                                                                         <?php if(isset($_SESSION['search']) && $_SESSION['search']==='%') echo 'checked';?> -->
                    <input :checked="search === '%'" type="radio" class="btn-check p-1" name="alfa" id="rall" value="%" autocomplete="off" />
                    <label class="btn btn-outline-primary p-1" for="rall">Tutti</label>
                    <input type="hidden" id="search" v-bind:value="search" />
                   
                     <template v-for="letter in alf">
                        <input :checked="search === letter + '%'" type="radio" class="btn-check p-1" name="alfa" v-bind:id="letter" v-bind:value="letter + '%'" autocomplete="off"/>
                        <label class="btn btn-outline-primary p-1" v-bind:for="letter">
                            <!-- <?php echo strtoupper($c); ?> -->
                            {{ letter.toUpperCase() }}
                        </label>
                     </template>
                    <!-- <?php
                            }
                    ?> -->
                </nav>
            </form>
            <!-- Display notification message -->
            <div id="infoMessagge" class="my-callout d-none"></div>

            <!--commenta
			
			fine commento-->
            <nav aria-label="Page navigation">
                <ul class="pagination justify-content-center">

                    <li class="page-item">
                        <button type="button" class="page-link" id="backP" aria-label="Previous">
                            <span aria-hidden="true" class="bi bi-arrow-left-square"></span>
                        </button>
                    </li>
                    <li class="page-item">
                        <a class="page-link disable" tabindex="-1">
                            Utenti: <span id="utenti_totali">--</span>
                            &nbsp;&nbsp;Pag. <span id="pagina_attuale">--</span> di <span id="pagine_totali">--</span>
                        </a>
                    </li>
                    <li class="page-item">
                        <button type="button" class="page-link" id="nextP" href="" aria-label="Next">
                            <span aria-hidden="true" class="bi bi-arrow-right-square"></span>
                        </button>
                    </li>
                </ul>
            </nav>

            <div class="table-responsive">
                <table id="Utable" class="table table-striped table-sm">
                    <!---->
                    <thead>
                        <tr>
                            <th scope="col">N</th>
                            <th scope="col">Nominativo</th>
                            <!--<th>Nome</th>-->
                            <th scope="col">Email</th>
                            <th scope="col">Ruoli</th>
                            <th scope="col" colspan="3">Azioni</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider "></tbody>
                </table>
                <!--commento fine commento-->
                <!--  -->
            </div>
            <!-- // Display records from DB -->
        </div>
    </div>
</section>

<!-- Modal HTML -->
<div id="myModalCancel" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Attenzione</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>Premi conferma se vuoi eliminare l'utente.</p>	
                    <p class="text-secondary"><small>Operazione irreversibile!</small></p>
                </div>
                <div class="modal-footer">
                    <button type="button" id="closeModalCancel" class="btn btn-primary" data-bs-dismiss="modal">Annulla</button>
                    <button type="button" id="cancelUser" class="btn btn-secondary">Conferma</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    inheritAttrs: false,
    data() {
        return {
            alf: 'abcdefghijklmnopqrstuvwxyz'.split(''),
            search: 'a%',
            editU: 0,
            title: 'Ruoli utente (* &egrave; richiesto almeno UN ruolo primario)',
            ruoli: [],
            bottonePrimarioChecked: false,
            dtNow: new Date().toISOString().slice(0, 16)  
        }
    },
    beforeMount() {
        import('../js/ruoliscript.js')
        import('../js/users.js')
    },
    mounted() {
        this.selectPrimaryRoles()
    },
    methods: {
        async selectPrimaryRoles() {
            let res = await axios.get(this.apiBaseUrl + '/getRuoliAll')
            res = JSON.parse(res.data)

            this.ruoli = Object.keys(res)
            .map(key => ({idRl: res[key].idRl, ruolo: res[key].ruolo, primario: res[key].primario}))

            // aggiunta dei ruoli secondari collegati al primario
            for(let i = 0; i < this.ruoli.length; i++) {
                if(this.ruoli[i].primario == 1)
                    this.selectSecondaryRoles(i)
            }

            // rimozione dei ruoli secondari dall'array
            this.ruoli = this.ruoli.filter(obj => {
                return obj.primario == 1
            })
        },
        async selectSecondaryRoles(index) {
            let res = await axios.post(this.apiBaseUrl + '/getRuoliSec', {
                data: JSON.stringify(this.ruoli[index])
            })
            
            if(res.data[0].idS) {
                this.ruoli[index].sub = res.data
            }
        },
        checkIfFileSelected(event) {
            var samplefile = document.getElementsByName("fileToUpload")[0];

            if(!this.bottonePrimarioChecked) {
                divMessage(samplefile, "col-12 alert alert-danger mt-2", "Scegliere un ruolo!", true);
            }                
        }
    }
}
</script>