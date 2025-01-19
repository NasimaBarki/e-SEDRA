<script setup>
import Templatetablebis from './Templatebischeck.vue';
</script>

<template>
    <div class="col-lg-4 mb-3 mt-3">
        <div id="infoMessagge" class="my-callout d-none"></div>
    
        <!-- Left side accordion -->
        <div class="accordion" id="accordionPro">
            <div class="accordion-item">
                <h2 class="accordion-header" id="sezEditPro">
                    <button class="accordion-button" id="btnAccPro" type="button" disabled data-bs-toggle="collapse" data-bs-target="#collapsePro" aria-expanded="true" aria-controls="collapsePro">
                        <span class="bi bi-briefcase">&nbsp;{{ titleAcc || 'Vedi Proposta' }}</span>
                    </button>
                </h2>
                <div id="collapsePro" class="accordion-collapse collapse" aria-labelledby="sezEditPro" data-bs-parent="#accordionPro">
                    <div class="accordion-body">
                        <form id="formInputPro" method="post" enctype="multipart/form-data" class="row g-3 align-items-center">
                            <!-- validation errors for the form -->
                            
                            <!-- Hidden post id for editing -->
                            <input type="hidden" id="hidden_post_id" name="hidden_post_id" :value="postId" />
    
                            <fieldset id="fsForm">
                                <!-- Proponent Fields -->
                                <div class="form-floating col-md-12 mb-2">
                                    <input class="form-control" type="text" id="perconto" name="perconto" required />
                                    <label for="perconto" class="form-label"><span>*</span>Proponente</label>
                                </div>
                                <div class="row mb-2 g-2">
                                    <div class="form-floating col-6">
                                        <input class="form-control" type="email" id="propmail" name="propmail" />
                                        <label for="propmail" class="form-label">Recapito mail</label>
                                    </div>
                                    <div class="form-floating col-6">
                                        <input class="form-control" type="tel" id="propcell" name="propcell"/>
                                        <label for="propcell" class="form-label">Recapito Telefonico</label>
                                    </div>
                                </div>
    
                                <!-- Proposal Title -->
                                <div class="form-floating mb-2 col-md-12">
                                    <input class="form-control" type="text" id="proTitle" name="proTitle" maxlength="60" required />
                                    <label for="proTitle" class="form-label"><span>*</span>Titolo (max 60 caratteri)</label>
                                </div>
    
                                <!-- Proposal Body -->
                                <div class="col-md-12 mb-2">
                                    <textarea maxlength="2048" class="form-control" name="proBody" id="proBody" cols="30" rows="10" placeholder="*Testo (max 2000 caratteri)" required></textarea>
                                </div>
    
                                <Templatetablebis/>
                                <!-- Additional Information -->
                                <div class="form-floating col-12 mb-2">
                                    <input class="form-control" type="text" id="altreinfo" name="altreinfo" />
                                    <label for="altreinfo" class="form-label">Riferimento generico</label>
                                </div>
    
                                <!-- Attach PDF -->
                                <div class="input-group col-md-12 form-floating mb-2" id="divallegaPdf">
                                    <input type="file" class="form-control col-md-6 mt-2" name="PDFToUpload" id="PDFToUpload" required />
                                    <label class="form-label" for="PDFToUpload" id="lblpdf">Allega Scheda Progettuale</label>
                                </div>
                                <span>
                                    Allegato:&nbsp;<label class="small" id="nomefile">{{ fileName }}</label>
                                </span>
                                <hr />
    
                                <!-- Revision Section (Optional) -->
                                <fieldset v-if="revisionsect" id="fsRev">
                                    <div id="revisioning" class="row g-1">
                                        <div class="form-floating mb-3 col-md-7">
                                            <input class="form-control" type="text" id="NdR" name="NdR" />
                                            <label class="form-label" for="NdR">Note del revisore</label>
                                        </div>
                                        <div class="form-check mb-3 col-md-5 text-md-end">
                                            <input class="btn-check" type="checkbox" value="1" id="publish" name="publish" />
                                            <label class="btn btn-outline-primary" id="lblp" for="publish">
                                                <span id="spp" class="bi bi-display"></span>&nbsp;Pubblicato
                                            </label>
                                        </div>
                                    </div>
                                </fieldset>
    
                                <!-- Submit/Confirm Button -->
                                <div class="col-sm-12 mb-3 text-sm-end inputrevisor">
                                    <input type="reset" class="btn btn-secondary" name="annulla" value="Chiudi" />
                                    <input type="submit" id="confirmPro" class="btn btn-primary" v-if="confirmButton" name="confirmPro" value="Conferma Dati" />
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </template>
    

<script>
export default {
    props: ['titleAcc', 'confirmButton', 'revisionsect'],
    data() {
        return {
            postId: 0,
            fileName: ''
        }
    },
    mounted() {
    var collapsablePro;

    ready(function () {


    let sezB = document.getElementById("collapsePro");
    if (sezB) {
        collapsablePro = new bootstrap.Collapse(sezB, { toggle: false });
		}

	var formPro = document.getElementById("formInputPro");

    //per attivare e disattivare pubblicazione
    var pbu = document.getElementById("publish");
        if (pbu) pbu.addEventListener("click", function () { toggleBtnPub(); /*location.reload();*/ });

	 var canc = document.querySelector("input[type=reset]");        //chiude il form senza salvare
    if (canc) {
        canc.addEventListener("click", function () {
            //console.log('click su annulla');
            resetAccordion(collapsablePro, "btnAccPro", formPro,);
        });
    }
        }) //end ready

//ok per revisione - per pubblicazione 
    function showProposta(res, crud) {
       var pro = res['rec'];
        var recbis = res['bis'];
        //alert(recbis[0]['bisogno']);
        var bis = [];
        for (let i = 0; i < recbis.length; i++) {
            bis.push(recbis[i]['bisogno']);
            //alert(bis[i]);
        }
    document.getElementById("hidden_post_id").value = pro['idPr'];
    document.getElementById("proTitle").value = pro['titlePrp'];
    document.getElementById("proBody").value = pro['textPrp'];
        document.getElementById("perconto").value = pro['proponente'];
        document.getElementById("propmail").value = pro['email'];
        document.getElementById("propcell").value = pro['tel'];
        document.getElementById("altreinfo").value = pro['rifbisgenerico'];
        setBisogniCheck(bis);  
    //AGGIUNGERE CAMPI MANCANTI

    
        var lb = document.getElementById("nomefile");
        lb.classList.add("smalleprimary");
        lb.innerHTML = pro['pdforigname'];
        document.getElementById("divallegaPdf").classList.add("d-none");

        var ndr = document.getElementById("NdR");
        if (ndr)
            ndr.value = pro['rev'];
        var pb = document.getElementById("publish");
        if (pb) {
            pb.checked = pro['pubblicato'];
            toggleBtnPub();
        }
        var fsForm = document.getElementById("fsForm");
        var fsDatiPro = document.getElementById("fsDatiPro");
        var fsRev = document.getElementById("fsRev");
        let cp = document.getElementById("confirmPro");
       
        if (crud == 'U') {
            abilitaFS(fsForm, true);
            abilitaFS(fsDatiPro, true);
            vediPulsante(cp, true);
        }
        if (crud == 'D') {
            abilitaFS(fsForm, false);
            abilitaFS(fsRev, true);
            vediPulsante(cp, true);
        }
        if (crud == 'R') {
            abilitaFS(fsForm, true);
            abilitaFS(fsDatiPro,false);
            abilitaFS(fsRev, true);
            vediPulsante(cp, true);
        }
        if (crud == 'V' || pro['deleted'] == 1) {
            abilitaFS(fsForm, false);
            abilitaFS(fsRev, false);
            vediPulsante(cp, false);
        }

        //if (!mod || pro['deleted'] == 1) {
        //        fsForm.disabled = 'disabled';
        //   if(!cp.classList.contains("d-none"))
        //        cp.classList.add("d-none");
        //}

        collapsablePro.show();
}


//ok per revisione in pub rimane uguale
async function call_ajax_edit_pro(pro, crud) {
    //console.log(pro);
    var pub = 0;
    var data = new FormData;
    data.append("idPr", pro);
    data.append("pub", pub);  //pub 0 PER TUTTE LE PROPOSTE  1 SOLO QUELLI PUBBLICATI
    let promo = fetch('ajax/getsingleproposta.php', {
        method: 'POST',
        body: data
    }).then(successResponse => {
        if (successResponse.status != 200) {
            return null;
        } else {
            return successResponse.json();
        }
    },
        failResponse => {
            //console.log("promessa fallita view proposta");
            return null;
        }
    );
    //console.log('aspetto che la promessa risolva');

    let result = await promo;
    if (result) {
       // alert("promessa risolta");
       // console.log(result);
        showProposta(result, crud);
        //accord.show();
    }
}


    }
}
</script>