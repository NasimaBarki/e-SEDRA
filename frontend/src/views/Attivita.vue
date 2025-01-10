<script setup>
import Ruoli from '../components/Ruoli.vue'
import Stelle from '../components/Stelle.vue'
</script>

<template>

<section class="container" id="activities">
    <h2 class="page-title mt-3">Configurazione attività</h2>
    <hr />
    <div class="row justify-content-evenly">
        <div class="col-md-4 mt-3">
            <div class="accordion" id="accordionAct">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="sezGestAct">
                        <!-- <?php if(isset($_SESSION['formacti'])) $facti=$_SESSION['formacti']; else $facti=NULL;?> -->
                        <button class="accordion-button" type="button" id="bottoneAccordion" aria-expanded="true" aria-controls="collapseAct">
                            <!--data-bs-toggle="collapse" data-bs-target="#collapseAct"-->
                            <span class="bi bi-gear"></span>
                        </button>
                    </h2>
                    <div id="collapseAct" class="accordion-collapse collapse" aria-labelledby="sezGestAct" data-bs-parent="#accordionAct">
                        <div class="accordion-body">

                            <!--<h4 class="mt-3" id="titoloAttivi">titolo</h4>-->
                            <form method="post" id="ACTform" action="" class="row g-3 align-items-center">
                                <fieldset id="allbuttonAct" class="row g-3 align-items-center">
                                    <input type="hidden" id="idAttCorrente" v-bind:value="facti.idAt" name="idAt" />
                                    <input type="hidden" id="idTLCorrente" v-bind:value="facti.dipendeda" name="idtl" />
                                    <div class="form-floating col-md-6">
                                        <input class="Dfrom form-control" id="dtStart" type="datetime-local" name="dtStart"
                                            required v-bind:value="facti.dtStart"/>
                                            <!-- <?php if (isset($facti['dtStart']) && $facti['dtStart']!="") {
                                            $value=str_replace(" ", "T", $facti['dtStart']);
                                             echo "value=".$value;
                                        }?>  -->

                                        <label class="" for="dtStart">Dal: </label>
                                    </div>
                                    <!--<div class="form-floating col-md-3">
                                        <button type="button" id="adesso" class="btn btn-primary" name="adesso">Adesso</button>
                                    </div>-->

                                    <div class="form-floating col-md-6">

                                        <input class="Dto form-control" id="dtStop" type="datetime-local" name="dtStop"
                                            required v-bind:value="facti.dtStop" :disabled="facti.dtStart == null || facti.dtStart == 0" v-bind:min="facti.dtStart != null"/>

                                            <!-- <?php if (!isset($facti['dtStart']) || $facti['dtStart']==0) echo "disabled"; else echo " min=". str_replace(" ", "T", $facti['dtStart']);?>  -->


                                        <label class="form-label" for="dtStop"> Al: </label>
                                    </div>
                                    <div class="form-floating col-md-12">
                                        
                                        <select class="form-select" id="revisore" name="revisore" required>
                                            <option disabled selected>Non attivato</option>
                                            <template v-for="row in roles">
                                                <option class="optionGroup" v-if="row.primario" v-bind:value='row.idRl' :selected="facti.revisore != null && row.idRl == facti.revisore">{{ row.ruolo }}</option>
                                                <option class="optionChild" v-else v-bind:value='row.idRl' :selected="facti.revisore != null && row.idRl == facti.revisore">{{ row.ruolo }}</option>
                                            </template>
                                        </select>
                                        <label class="form-label" for="revisore">Ruolo Revisore:</label>
                                    </div>
                                    <div class="form-floating col-6">
                                        <div id="attivablog" class="btn-group" role="group" aria-label="Attivazione Blog">
                                            <input type="checkbox" class="btn-check" name="btnattivablog" id="blogactive" autocomplete="off" value="0" :checked="facti.blog != null && facti.blog == 1"/>
                                            <!-- <?php if(isset($facti['blog']) && $facti['blog']==1) echo "checked";?> -->
                                            <label class="btn btn-outline-primary" for="blogactive">
                                                <template v-if="facti.blog == 1">
                                                    Discussione attivata
                                                </template>
                                                <template v-else>
                                                    Attiva discussione
                                                </template>
                                            </label>
                                            <!-- <?php if(isset($facti['blog']) && $facti['blog']==1) echo "Discussione Attivata"; else echo "Attiva Discussione";?> -->
                                        </div>
                                    </div>
                                    <div class="form-floating col-6">
                                        <div id="secondvot" class="btn-group" role="group" aria-label="Seconda Votazione">
                                            <input type="checkbox" class="btn-check" name="ballottaggio" id="ballottaggio" autocomplete="off" value="1" :checked="facti.ballottaggio == 1" />
                                            <!-- <?php if(isset($facti['ballottaggio']) && $facti['ballottaggio']==1) echo "checked";?> -->
                                            <label class="btn btn-outline-primary" for="ballottaggio">
                                                Seconda Votazione
                                            </label>
                                        </div>
                                    </div>
                                    <div id="doposettimane" class="form-floating col-7">
                                        <input class="form-control" id="altridati" type="number" name="altridati" min="0" v-bind:value="facti.altridati" />
                                        <label class="form-label" for="altridati">Elimina dopo settimane: </label>
                                    </div>
                                    <div id="giornipreavviso" class="form-floating col-12">
                                        <input class="form-control" id="giorninoti" type="number" name="giorninoti" min="0" v-bind:value="facti.giorninoti" />
                                        <label class="form-label" for="giorninoti">Giorni di preavviso notifica: </label>
                                    </div>
                                    <div class="form-floating col-12">
                                        <div id="tipovotazione" class="btn-group" role="group" aria-label="Scelta Votazione">
                                            <input type="radio" class="btn-check" name="btntipovotazione" id="vsemplice" autocomplete="off" value="0" checked />
                                            <label class="btn btn-outline-primary" for="vsemplice">Vot. semplice</label>

                                            <input type="radio" class="btn-check" name="btntipovotazione" id="vgraduatoria" autocomplete="off" value="1" />
                                            <label class="btn btn-outline-primary" for="vgraduatoria">Graduatoria</label>
                                        </div>
                                    </div>
                                    
                                    <Stelle />
                                    <hr class="mt-3" />
                                    <Ruoli :ruoli="ruoli"></Ruoli>
                                    <!-- <?php
                                            $_SESSION['template']['title']="Ruoli autorizzati:";

                                            include(ROOT_PATH . '/adminsez/includes/templateruoli.php');
                                    ?> -->
                                </fieldset>
                                <div class="col-12 text-md-end">
                                    <input type="submit" id="saveAct" class="btn btn-primary" name="save_activity" value="Salva Impostazioni" />
                                    <button type="reset" id="annullAct" class="btn btn-secondary" name="annulla">Annulla</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-8 mt-3">
            <div class="table-div mb-3">
                <!--<div class="col-md-12">-->

                <!-- Display notification message -->
                <div id="infoMessagge" class="my-callout d-none"></div>
                <div class="table-responsive">
                    <table class="table align-middle table-sm" id="actiTable">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Nome</th>
                                <th>Attiva</th>
                                <th>Anon.</th>
                                <!--<th>Stato</th>-->
                                <th>Data inizio</th>
                                <th>Data fine</th>
                                <th>Ruolo Revisore</th>
                                <th>Ruoli Autorizzati</th>
                                <th colspan="
                                    2"></th>

                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="ac in acti" v-bind:key = ac.idAt>
                                <tr v-bind:id="'riga' + ac['idAt']" v-bind:style="{ backgroundColor: ac.bg }">
                                            <td>
                                                <input type="hidden" v-bind:id="'tl' + ac['idAt']" v-bind:name="'tl' + ac['idAt']" v-bind:value="ac['dipendeda']"/>
                                                <button v-on:click="facti = ac; replaceDate()" type="button" class="btn icona" data-bs-toggle="tooltip" title="Configura" v-bind:data-idact="ac['idAt']" v-bind:id="'conf' + ac['idAt']" v-bind:value="ac['idAt']" name="config-act" >
                                                    <span class="bi bi-gear"></span>
                                                </button>

                                            </td>

                                            <td v-bind:id="'name' + ac['idAt']">
                                                {{ ac['nome']}}
                                            </td>
                                            <template v-if="ac.stato == 1">
                                                <td colspan=9>
                                                Attivit&agrave; in corso, solo modifiche autorizzate ...
                                                <input type="hidden" v-bind:id="'incorso' + ac['idAt']" v-bind:name="'incorso' + ac['idAt']" v-bind:value="ac['stato']" />
                                                <input type="hidden" v-bind:id="'From' + ac['idAt']" v-bind:value="ac['dtStart']"
                    
                                                           />


                                                <input type="hidden" v-bind:id="'hTo' + ac['idAt']" v-bind:value="ac['dtStop']"
                                                           /> 
                                                <input type="text" v-bind:id="'rev' + ac['idAt']"
                                                   readonly disabled hidden />
                                                <input type="text" v-bind:id="'raut' + ac['idAt']"
                                                         readonly disabled hidden />
                                            </td>
                                            </template>
                                            <template v-else>
                                                <td>
                                                <input type="hidden" v-bind:id="'incorso' + ac['idAt']" v-bind:name="'incorso' + ac['idAt']" v-bind:value="ac['stato']" />
                                                <input type="checkbox" v-bind:id="'actactive' + ac['idAt']" class="form-check-input" name="act-active" v-bind:value="ac['idAt']"  :checked="ac.active ? true : false"/>
                                    
                                            </td>
                                            <td>
                                                <input type="checkbox" class="form-check-input" v-bind:id="'actanonim' + ac['idAt']" name="act-anonim" v-bind:value="ac['idAt']" :checked="ac.anonima ? true : false" />
                                               </td>
                                            <td class="d-none" v-bind:id="'scad' + ac['idAt']">
                                                    </td>
                                            <td v-bind:id="'From' + ac['idAt']">
                                                <template v-if="ac.dtStart && ac.dtStart != ''">
                                                    {{ new Date(ac.dtStart).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '') }}
                                                </template>
                                            </td>

                                            <td v-bind:id="'To' + ac['idAt']">
                                               <input type="hidden" v-bind:id="'hTo' + ac['idAt']" v-bind:name="'hTo' + ac['idAt']" v-bind:value="ac['dtStop']" />
                                               <template v-if="ac.dtStop && ac.dtStop != ''">
                                                    {{ new Date(ac.dtStop).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '') }}
                                                </template>
                                            </td>

                                            <td v-bind:id="'rev' + ac['idAt']">
                                                <template v-if="ac.rev">
                                                    {{ ac.rev }}
                                                </template>
                                                <template v-else>--</template>
                                            </td>
                                            <td v-bind:id="'raut' + ac['idAt']">
                                                <template v-if="ac.raut">
                                                    {{ ac.raut }}
                                                </template>
                                                <template v-else>---</template>
                                            </td>
                                            <td class="not-aval">
                                                <button type="button" class="btn icona" data-bs-toggle='modal' data-bs-target='#myModalReset' title="Reset Impostazioni" v-bind:data-idact="ac['idAt']" v-bind:id="'azz' + ac['idAt']" v-bind:value="ac['idAt']" name="reset-act">
                                                    <span class="bi bi-arrow-counterclockwise"></span>
                                                </button>

                                            </td>
                                            <td class="not-aval">
                                                <button type="button" class="btn icona" data-bs-toggle='modal' data-bs-target='#myModalDelete' title="Elimina Risultati precedenti" v-bind:data-idact="ac['idAt']" v-bind:id="'elidata' + ac['idAt']" v-bind:value="ac['idAt']" name="deldata-act" >
                                                    <span class="bi bi-bag-x"></span>
                                                </button>
                                            </td>
                                            </template>
                                            
                                            <!-- <?php } //fine else?> -->
                                           
                                        </tr>

                            <!-- </tr> -->
                            </template>
                                        <!-- <?php endforeach ?> -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

        <!--<canvas id="myCanvas"></canvas>
        <legend for="myCanvas"></legend>
        <script type="text/javascript" src="adminsez/static/js/gantt.js"></script>-->
</section>
<!-- Modal HTML -->
<div id="myModalAttention" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Attenzione</h5>
                <!--<button type="button" class="btn-close" data-bs-dismiss="modal"></button>-->
            </div>
            <div class="modal-body">
                <p>Le attivit&agrave; in corso non dovrebbero essere modificate.<br />Procedere comunque con la configurazione? </p>
                <p class="text-secondary">
                    <small></small>
                </p>
            </div>
            <div class="modal-footer">
                <button type="button" id="closeModalAttention" class="btn btn-primary" data-bs-dismiss="modal">Annulla</button>
                <button type="button" id="confermAttention" class="btn btn-secondary">Conferma</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal HTML -->
<div id="myModalReset" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Attenzione</h5>
                <!--<button type="button" class="btn-close" data-bs-dismiss="modal"></button>-->
            </div>
            <div class="modal-body">
                <p>L'attivit&agrave; verr&agrave; riportata alle impostazioni di default.<br />Vuoi procedere? </p>
                <p class="text-secondary">
                    <small></small>
                </p>
            </div>
            <div class="modal-footer">
                <button type="button" id="closeModalReset" class="btn btn-primary" data-bs-dismiss="modal">Annulla</button>
                <button type="button" id="confermReset" class="btn btn-secondary">Conferma</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal HTML -->
<div id="myModalDelete" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Attenzione</h5>
                <!--<button type="button" class="btn-close" data-bs-dismiss="modal"></button>-->
            </div>
            <div class="modal-body">
                <p>
                    Tutti i dati relativi all'ultima esecuzione dell'attivit&agrave; saranno eliminati in modo definitivo.<br />Vuoi procedere?
                </p>
                <p class="text-secondary">
                    <small>Eliminazione definitiva</small>
                </p>
            </div>
            <div class="modal-footer">
                <button type="button" id="closeModaldelete" class="btn btn-primary" data-bs-dismiss="modal">Annulla</button>
                <button type="button" id="confermDelete" class="btn btn-secondary">Conferma</button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
    props: ['user'],
    data() {
        return {
            acti: undefined,
            ruoli: [],
            roles: undefined,
            facti: {}
        }
    },
    async mounted() {
        import('../js/confactscript')

        await this.associaRuoliAttivita()
        this.selectPrimaryRoles()
        this.getRuoli()
        // console.log(this.acti)
    },
    methods:
    {
        async getRuoli() {
            let res = await axios.get(this.apiBaseUrl + '/getRuoliAll')
            this.roles = JSON.parse(res.data)
            // console.log('ALL RUOLI:\n', this.roles)
        },
        async associaRuoliAttivita() {
            let res = await axios.get(this.apiBaseUrl + '/ruoliAttivita')
            //console.log(res.data)
            this.acti = res.data
            this.associaBgAttivita()
        },
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
        associaBgAttivita() {
            for(let i = 0; i < this.acti.length; i++) {
                if(this.acti[i].active == false)
                    this.acti[i].bg = 'var(--bs-light)'
                else if(this.acti[i].stato == 1)
                    this.acti[i].bg = 'var(--bs-danger)'
                else if(this.acti[i].stato == 2)
                    this.acti[i].bg = 'var(--bs-warning)'
                else
                    this.acti[i].bg = ''
            }
        },
        replaceDate() {
            if(this.facti.dtStart != null)
                this.facti.dtStart = this.facti.dtStart.replace('T', ' ').slice(0, this.facti.dtStart.length - 5) 
            if(this.facti.dtStop != null)
                this.facti.dtStop = this.facti.dtStop.replace('T', ' ').slice(0, this.facti.dtStop.length - 5)

            // console.log(this.facti.dtStart)
        }
    }
}
</script>