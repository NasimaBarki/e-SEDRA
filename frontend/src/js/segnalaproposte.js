
/** This file is part of e-Sedra.
 *
 *   e-Sedra is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   e-Sedra is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *   along with e-Sedra.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @copyright Copyright 2023 e-Sedra. All Rights Reserved.
 *
 */

var divmoreinfo;
var formPro;
var myMdT
var collapsablePro;
var personalpro = {
    "ncol": 3,
    "c": [
        {
            "type": "button",
            "class": ["linkstylebutton", "btn", "btn-outline-primary", "text-start"],
            "exdata": { "idpro": [1, "idPr"] },
            "value": "idPr",
            "text": [1, "titlePrp"]       //1 nome di variabile  0 dato costante
        },
        {
            "type": "link",
            "title": [1, "pdforigname"],
            "link": [1, "pdfalleg"],
        },
        {
            "type": "button",
            "class": ["btn", "icona"],
            "exdata": { "idpro": [1, "idPr"] },
            "value": "idPr",
            "text": [0, "<span class='bi-trash3'></span>"],
            "other": " data-bs-toggle='modal' data-bs-target='#myModalPro' title='Elimina' name='delete-post'"
        }]
}


ready(function () {

    var id_proposta_selezionata;
    //var defaultpage = 1;

    formPro = document.getElementById("formInputPro");

    //Riabilito i campi disabilitati di default dal template
    var btnacc = document.getElementById("btnAccPro");
    if (btnacc) {
        btnacc.removeAttribute('disabled');
        btnacc.addEventListener("click", function () {
            formPro.reset();
            document.getElementById("divallegaPdf").classList.remove("d-none");
            document.getElementById("nomefile").innerHTML = "";
        });
    }

    var fieldsetPro = document.getElementById("fsForm");
    if (fieldsetPro) {
        fieldsetPro.removeAttribute('disabled');
    }

    var modulopdf = document.getElementsByName("PDFToUpload")[0];
    //modulopdf.setAttribute('disabled', true);

    var downmodulo = document.getElementById("downpdf");
    //downmodulo.addEventListener("click", function () {
    //    if (modulopdf.disabled) {
    //        modulopdf.removeAttribute('disabled');
    //        confirm.removeAttribute('disabled');
    //    }
    //});

    var mmt = document.getElementById('myModalPro');
    if (mmt) {
        /* alert("prepare modal");*/
        myMdT = new bootstrap.Modal(mmt, {
            keyboard: false
        })
    }

    let sezB = document.getElementById("collapsePro");
    if (sezB) {
        collapsablePro = new bootstrap.Collapse(sezB, { toggle: false });
    }

    //htip = document.getElementById("Hidden_topic_id");
    var delProOK = document.getElementById("deletePro");
    delProOK.addEventListener("click", function () {
        //non passare true,false perchè il JSON li trasforma in testo
        call_ajax_delete_pro(id_proposta_selezionata, 0);   //eliminazione logica, false fa eliminazione fisica sono il proprietario
        call_ajax_dati_table('proposte', 'Protable', personalpro, 'ajax/getallposts.php');
    });


    var canc = document.getElementById("annullPro");        //chiude il form senza salvare
    if (canc) {
        canc.addEventListener("click", function () {
            //console.log('click su annulla');
            resetAccordion(collapsablePro, "btnAccPro", formPro, " Inserisci nuova proposta");
        });
    }

    //settaTitleAccordion("btnAccPro", "Inserisci nuova proposta");

    var confirm = document.getElementById("confirmPro");
    if (confirm) {
        //confirm.setAttribute('disabled', true);
        confirm.addEventListener("click", (e) => {
            var id = document.getElementById("hidden_post_id").value;
            e.preventDefault();
            if (validateDataForm())
                call_ajax_upcre_proposte();
        });
    }


    var link = document.querySelectorAll('.linkstylebutton');
    for (let i = 0; i < link.length; i++) {
        link[i].addEventListener("mouseover", (e) => { e.target.style.cursor = 'pointer'; });
        // se lascio questi ricreando le righe della tabella perdo gli ascoltatori finchè non faccio reload della pagina
        //link[i].addEventListener("click", (e) => {
        //    call_ajax_edit_pro(e.target.dataset.idpro, true, collapsablePro);
        //    actualCrud = e.target.dataset.crud;  });
    }

    var protable = document.querySelector('#Protable');
    if (protable) {
        protable.addEventListener("click", (e) => {
            if (e.target.nodeName != 'BUTTON' && e.target.nodeName != 'SPAN') { /*console.log('- '+e.target);*/  return; }
            //let edt = e.target.closest('.spedit');
            //console.log(edt.dataset.idtpc);
            let elem = e.target;
            let span = null;
            if (elem.classList.contains("linkstylebutton")) {
                /*  let idBisogno = elem.dataset.idbis;*/
                //console.log('+ ' + elem.nodeName + ' ' + idBisogno);
                call_ajax_edit_pro(e.target.dataset.idpro, 'U');
                actualCrud = elem.dataset.crud;
            }
            else {
                if (e.target.nodeName == 'SPAN') {
                    elem = e.target.parentNode;
                    span = e.target;
                }

                if (elem.name == "delete-post") {
                    //console.log('DELETE ' + elem.dataset.idpro);
                    id_proposta_selezionata = elem.dataset.idpro;
                    //chiama la modal per conferma cancellazione
                    //window.location.href = window.location.href;
                    /* refresh_table_bisogni();*/
                }
            }
        });
    }
}) //end ready

function validateDataForm() {
    var id = document.getElementById("hidden_post_id").value;
    var num = document.getElementById("propcell").value;
    if (num != "" && !num.match(/3\d{2}[\. ]??\d{6,7}$/)) {
        showMessagge("Numero di cellulare non valido", "my-callout-danger", "infoMessagge2");
        return false;
    }
    if (document.getElementById("perconto").value == "") {
        showMessagge("Proponente obbligatorio", "my-callout-danger", "infoMessagge2");
        return false;
    }
    if (document.getElementById("proTitle").value == "") {
        showMessagge("Titolo della proposta obbligatorio", "my-callout-danger", "infoMessagge2");
        return false;
    }
    if (document.getElementById("proBody").value == "") {
        showMessagge("Corpo della proposta non può essere vuoto", "my-callout-danger", "infoMessagge2");
        return false;
    }
    if (id == 0) {
        let modulopdf = document.getElementsByName("PDFToUpload")[0];
        if (!controlloFile(modulopdf.files[0])) {
            showMessagge("L'allegato è obbligatorio", "my-callout-danger", "infoMessagge2");
            return false;
        }
    }
    return true;
}

function controlloFile(file) {
    if (file) {
        if (!['application/pdf'].includes(file.type)) {
            //alert("no pdf");
            showMessagge("Formato file non compatibile", "my-callout-danger", "infoMessagge");
            modulopdf.value = '';
            return false;
        }
        if (file.size > 2 * 1024 * 1024)  //2MB sul server vedere impostazioni
        {
            //alert("2MB");
            showMessagge("Dimensione massima del file 2MB", "my-callout-danger", "infoMessagge");
            modulopdf.value = '';
            return false;
        }
        return true;
    } else return false;
}


//ok per cancellazione
async function call_ajax_delete_pro(idcanc, logicanc) {
    var data = new FormData;
    data.append("pro_id", idcanc);
    data.append("clogic", logicanc);
    let promo = fetch('ajax/deleteproposte.php', {
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
            //console.log("promessa fallita delete proposta");
            return null;
        }
    );
    //console.log('aspetto che la promessa risolva');

    let result = await promo;
    //console.log('OK..promessa risolta ' + result);
    if (result['success']) {
        //console.log(result['success']);
        myMdT.hide();
        showMessagge(result['success'], "my-callout-warning");
        call_ajax_dati_table('proposte', 'Protable', personalpro, 'ajax/getallposts.php');
        //window.location.href = window.location.href;
    }
}


async function call_ajax_upcre_proposte() {
    var selected = getBisogniFromCheck();
    var data = new FormData(formPro);
    data.append('bis', selected);
    let promo1 = await fetch('ajax/createproposta.php', {
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
            //console.log("promessa fallita in update create proposte");
            return null;
        });
    //console.log('aspetto che la promessa risolva');
    let result = await promo1;
    //console.log('OK.. ' + result);
    if (result['success']) {
        resetAccordion(collapsablePro, "btnAccPro", formPro, " Inserisci nuova proposta");
        formPro.reset();
        // alert(result['success']);
        showMessagge(result['success'], "my-callout-info", "infoMessagge");
        call_ajax_dati_table('proposte', 'Protable', personalpro, 'ajax/getallposts.php');

    }//finestra per messaggio errore è quella un po' più in basso
    else showMessagge(result['errors'], "my-callout-danger", "infoMessagge2");
}


