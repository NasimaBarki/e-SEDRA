<template>
<div class="col-lg-4 mb-3 mt-3">
			
            <div id="infoMessagge" class="my-callout d-none"></div>

		<!-- Left side accordion -->
        <div class="accordion" id="accordionBis">
            <div class="accordion-item">
                <h2 class="accordion-header" id="accordionBisHead"> <!--sezEditBis">-->
                    <button class="accordion-button" id="btnAccBis" type="button" disabled data-bs-toggle="collapse" data-bs-target="#collapseBis" aria-expanded="true" aria-controls="collapseBis">
                        <span class="bi bi-pencil-fill">
                            <template v-if="titleAcc">
                                {{ titleAcc }}
                            </template>
                            <template v-else>
                                Vedi bisogno
                            </template>
                        </span>
                    </button>
                </h2>
                <div id="collapseBis" class="accordion-collapse collapse" aria-labelledby="vedi " data-bs-parent="#accordionBis">
                    <div class="accordion-body">
                        
				<form id="formInputBis" method="post" enctype="multipart/form-data" class="row g-3 align-items-center" action="" >
				<!-- validation errors for the form -->		

				<!-- if editing post, the id is required to identify that post -->
               
						<input type="hidden" id="hidden_post_id" name="hidden_post_id" v-bind:value="hi">
					 <fieldset id="fsForm" disabled>
                         <div class="form-floating col-md-12 mb-3">                                    
							<input class="form-control" type="text" id="titleBis" name="titleBis" value="" maxlength="60" required>
							<label for="titleBis" class="form-label">*Titolo (max 60 caratteri)</label>
						</div>
				
						<!--<label style="float: left; margin: 5px auto 5px;">Featured image</label>
						<input type="file" id="featured_image" name="featured_image" >-->
						<div class="col-md-12 mb-3">    <!--form-floating--> 
							<textarea maxlength="1024" class="form-control" name="textBis" id="textBis" cols="30" rows="10" placeholder="*Testo (max 1000 caratteri)" required></textarea>
							<!--<label for="bisBody" class="form-label">Testo</label>-->
						</div>
						<div class="row">
							<div class="form-floating col-sm-6 mb-3">    
								<select name="topic_id" id="topic_id" required>
								<option value="" selected disabled>Seleziona Ambito</option>
                                <template v-for="topic in topics">
                                    <option v-bind:value="topic['idAm']" v-bind:data-moreinfo="topic['moreinfo']">
										{{ topic.ambito }}
									</option>
                                </template>
							</select>
								</div>
								 <!--<label for="topic_id" class="form-label">Ambito</label>-->
							<div class="form-floating col-sm-6 mb-3" id="divmoreinfo">                                    
								<input class="form-control" type="text" id="moreambito" name="moreambito" maxlength="30" required>
								<label for="moreambito" class="form-label">Specificare</label>
							</div>
						</div>
				    </fieldset>
						<hr />
						<!-- Only admin users o revisor can view publish input field -->
						<!-- display checkbox according to whether post has been published or not -->
                    <fieldset id="fsRev">
						<div id="revisioning" v-bind:class="'row g-1 ' + revisionsectClass">					
							<div class="form-floating mb-3 col-sm-7">
								<input class="form-control" type="text" value="" id="NdR" name="NdR" />
								<label class="form-label" for="NdR">Note del revisore</label>	
							</div>
							<div class="form-check mb-3 col-sm-5 text-sm-end">
								  <input class="btn-check" type="checkbox" value="1" id="publish" name="publish" />	
								  <label class="btn btn-outline-primary" id="lblp" for="publish"><span id="spp" class="bi bi-display"></span>&nbsp;Pubblicato</label>	
							</div>	
						</div>
					</fieldset>
				<div>
					<div class="col-sm-12 mb-3 text-sm-end inputrevisor">                 
						<input type="reset" class="btn btn-secondary" name="annulla" value="Chiudi"/>
						<input type="button" id="confirmBis" v-bind:class="'btn btn-primary ' + confirmButtonClass" name="confirmBis" value="Conferma Dati" />
					</div>
				</div>
					</form>                           
                    </div>
                </div>
            </div>
        </div>
</div>

</template>

<script>
export default {
    props: ['titleAcc', 'confirmButton', 'revisionsect', 'hiddenPostId', 'topics'],
    data() {
        return {
            hi: 0,
            revisionsectClass: '',
            confirmButtonClass: ''
        }
    },
    mounted() {
        if(this.hiddenPostId !=  null)
            hi = this.hiddenPostId
        if(this.revisionsect != null || this.revisionsect != 1)
            this.revisionsectClass = 'd-none'
        if(!this.confirmButton || this.confirmButton != 1)
            this.confirmButtonClass = 'd-none'

        // console.log('conferma: ', this.confirmButton)
        
        var collapsableBis;
	ready(function () {

    let sezB = document.getElementById("collapseBis");
    if (sezB) {
        collapsableBis = new bootstrap.Collapse(sezB, { toggle: false });
		}

	var formBis = document.getElementById("formInputBis");

    var divmoreinfo = document.getElementById("divmoreinfo");
    if (divmoreinfo)
       divmoreinfo.classList.add('invisible');

    //per attivare e disattivare pubblicazione
    var pbu = document.getElementById("publish");
        if (pbu) pbu.addEventListener("click", function () { toggleBtnPub(); /*location.reload();*/ });

	 var canc = document.querySelector("input[type=reset]");        //chiude il form senza salvare
    if (canc) {
        canc.addEventListener("click", function () {
            //console.log('click su annulla');
            resetAccordion(collapsableBis, "btnAccBis", formBis," Segnala nuovo Bisogno");
            resetHidden();
        });
    }


    var topic = document.getElementById("topic_id");
		if (topic)
			topic.addEventListener("change", function () {
			var x = this.selectedIndex;
			var y = this.options;
			var tipo = y[x].getAttribute("data-moreinfo");      
			if (tipo == 1) {
				if (divmoreinfo.classList.contains('invisible')) {           				
					divmoreinfo.classList.remove('invisible');
					//divmoreinfo.classList.add('visible');
				}
			}
			else { 
				if (!divmoreinfo.classList.contains('invisible')) {           				
					//divmoreinfo.classList.remove('visible');
					divmoreinfo.classList.add('invisible');
				}
			}  
    });



}) //end ready




//ok per revisione - per pubblicazione cambiato tolto il settaggio del titolo
    function showBisogno(bis, crud) {
    document.getElementById("hidden_post_id").value = bis['idBs'];
  /*  console.log("valore di hidden ", bis['idBs']);*/
    document.getElementById("titleBis").value = bis['titleBis'];
    document.getElementById("textBis").value = bis['textBis'];
    document.getElementById("topic_id").value = bis['ambito'];
    if (bis['moreambito'] != "") {
        document.getElementById("moreambito").value = bis['moreambito'];
        if (document.getElementById("divmoreinfo").classList.contains('invisible')) { 
            //alert('ero invisibile');
            document.getElementById("divmoreinfo").classList.remove('invisible');
            //document.getElementById("divmoreinfo").classList.add('visible');
            //alert('ora divento visibile perch� ce more');
        }
    }
    else
    {
        if (! document.getElementById("divmoreinfo").classList.contains('invisible')) {           
            //document.getElementById("divmoreinfo").classList.remove('visible');
            document.getElementById("divmoreinfo").classList.add('invisible');
        }
    }
    var ndr = document.getElementById("NdR");
    if (ndr)
        ndr.value = bis['rev'];
    var pb = document.getElementById("publish");
    if (pb) {
        pb.checked = bis['pubblicato'];
        toggleBtnPub();
    }
         var fsForm = document.getElementById("fsForm");
   /*     var fsDatiPro = document.getElementById("fsDatiPro");*/
        var fsRev = document.getElementById("fsRev");
        let cp = document.getElementById("confirmBis");

     if (crud == 'U') {
            abilitaFS(fsForm, true);
         vediPulsante(cp, true);
         if (pb.disabled) pb.removeAttribute('disabled');
             cp.value = "Conferma Dati";
            settaTitleAccordion("btnAccBis", "Modifica Bisogno");
        }
        if (crud == 'D') {
            abilitaFS(fsForm, false);
            abilitaFS(fsRev, true);
            pb.setAttribute('disabled', true);
            cp.value = "Cancella";
            vediPulsante(cp, true);
            settaTitleAccordion("btnAccBis", "Cancella Bisogno");
        }
        if (crud == 'R') {
            abilitaFS(fsForm, true);
            abilitaFS(fsRev, true);
            cp.value = "Conferma Dati";
            vediPulsante(cp, true);
            if(pb.disabled) pb.removeAttribute('disabled');
            settaTitleAccordion("btnAccBis", "Revisiona Bisogno");
        }
        if (crud == 'V' || bis['deleted'] == 1) {
            abilitaFS(fsForm, false);
            abilitaFS(fsRev, false);
            vediPulsante(cp, false);
            settaTitleAccordion("btnAccBis", "Vedi Bisogno");
    }

     collapsableBis.show();
    //var fieldsetBis = document.getElementById("fsForm");
    //if (!mod || bis['deleted'] == 1) {
    //    fieldsetBis.disabled = 'disabled';
    //    //    if(revBis)
    //    //        revBis.style.display = 'none';
    //}
    //else fieldsetBis.removeAttribute('disabled');
}


//ok per revisione in pub rimane uguale
async function call_ajax_edit_bis(bis, crud) {
    //console.log(bis);
    setHidden(bis);
    var pub = 0;
    var data = new FormData;
    data.append("idBis", bis);
    data.append("pub", pub);  //ZERO PER TUTTI I BISOGNI PUBBLICATI E NON
    let promo = fetch('ajax/getsinglebisogno.php', {
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
            //console.log("promessa fallita view bisogni");
            return null;
        }
    );
    //console.log('aspetto che la promessa risolva');

    let result = await promo;
    if (result) {
        //console.log(result);
        showBisogno(result, crud);
        //accord.show();
    }
}


    }
}
</script>