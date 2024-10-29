'use strict'

export function topicScript() {
    var apiBaseUrl = 'http://localhost:3000'

    // topics.js
    var myMdT;
    var collapsableTopic;
    var delOK;
    var tid;
    var tname;
    var tval;
    var tcheck;
    var htip;
    var suTpc;
    var tptable;
    var formTOPIC;
    var dataTopic;
    var topicToDelete;

    function call_close_form() {
        collapsableTopic.hide(); //chiude il formAU
        settaTitleAccordion("btnAccTopic", "Crea Nuovo Ambito");
        htip.value = 0;
    }

    ready(function () {
        formTOPIC = document.getElementById('formTOPIC');
        var mmt = document.getElementById('myModalTopic');
        if (mmt) {
            /* alert("prepare modal");*/
            myMdT = new bootstrap.Modal(mmt, {
                keyboard: false
            })
        }
        let sezTopic = document.getElementById("collapseTopic");
        if (sezTopic) {
            /*alert("si sezcreate");*/
            collapsableTopic = new bootstrap.Collapse(sezTopic, { toggle: false });
        }

        htip = document.getElementById("idAm");

        delOK = document.getElementById("cancelTpc");
        //                                                                                  call_ajax_refresh_topic_table();
        delOK.addEventListener("click", function () { call_ajax_delete_topic(topicToDelete); });

        var canc = document.getElementById("annullTpc");
        canc.addEventListener("click", function () { resetAccordion(collapsableTopic, "btnAccTopic", formTOPIC, "Crea nuovo ambito"); suTpc.value = "Salva Ambito"; htip.value = 0; });

        settaTitleAccordion("btnAccTopic", "Crea nuovo ambito");
        suTpc = document.getElementById("saveUpdTpc");
        suTpc.value = "Salva Ambito";
        //                                                                                     call_ajax_refresh_topic_table();
        suTpc.addEventListener("click", (e) => { call_ajax_upcre_topic(); e.preventDefault(); });

        /*  tid=document.getElementById('topic_id');*/
        tname = document.getElementById('ambito');
        tval = document.getElementById('valenza');
        tcheck = document.getElementById('moreinfo');

        tptable = document.querySelector('#topicTable');
        //console.log(tptable);
        tptable.addEventListener("click", (e) => {
            if (e.target.nodeName != 'BUTTON' && e.target.nodeName != 'SPAN') { /*//console.log('- '+e.target);*/  return; }
            //let edt = e.target.closest('.spedit');
            let elem = e.target;
            if (e.target.nodeName == 'SPAN')
                elem = e.target.parentNode;
            let param = elem.dataset.idtpc;
            console.log('param: ', elem.dataset.idtpc)
            if (elem.name == "edit-topic") {
                //console.log('EDIT ' + param);
                call_ajax_edit_topic(param);
            }
            else if (elem.name == "delete-topic") {
                //console.log('DELETE ' + param);
                topicToDelete = param;
                //myMdT.show();
                //delOK = addEventListener("click", function () { call_ajax_delete_topic(param); });
            }
        });
    });

    async function call_ajax_delete_topic(idcanc) {
        var data = new FormData;
        data.append("idAm", idcanc);

        var object = {}
        for (var [key, value] of data.entries()) {
            object[key] = value
        }

        let promo = fetch(apiBaseUrl + '/ambiti', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
        }).then(successResponse => {
            if (successResponse.status != 200) {
                return null;
            } else {
                return successResponse.json();
            }
        },
            failResponse => {
                //console.log("promessa fallita delete ambiti");
                return null;
            }
        );
        //console.log('aspetto che la promessa risolva');

        let result = await promo;
        //console.log('OK..promessa risolta ' + result);

        if (result['success']) {
            //console.log(result['success']);
            htip.value = 0;
            myMdT.hide();
            showMessagge(result['success'], "my-callout-warning");
            call_ajax_refresh_topic_table();
        }
    }

    async function call_ajax_refresh_topic_table() {
        //var data = new FormData;
        //data.append("idAm", idcanc);
        let promo = fetch(apiBaseUrl + '/ambiti', {
            method: 'GET',
            /* body: data*/
        }).then(successResponse => {
            if (successResponse.status != 200) {
                return null;
            } else {
                return successResponse.json();
            }
        },
            failResponse => {
                //console.log("promessa fallita recupera ambiti tutti");
                return null;
            }
        );
        //console.log('aspetto che la promessa risolva');

        let result = await promo;
        //console.log('OK..promessa risolta recupera ambiti' + result);
        if (result) {
            //console.log(result)
            showTopicsTable(result);
            //window.location.reload()
            // if (result['success']) {
            //console.log(result[0]);
            //myMdT.hide();
            //showMessagge(result['success'], "my-callout-warning");
            //refresh table??
        }
    }


    function showTopicsTable(righe) {
        //let n = result.length;
        //console.log(n);
        //var tabella = document.getElementById("topicTable");
        var tr;
        var td;
        let righeLength = righe.length

        var tb = tptable.getElementsByTagName("tbody");
        //console.log('tb: ', tb)
        for (let i = 0; i < tb.length; i++) {
            if (tb[i] != null)
                tb[i].remove();
        }
        tb = document.createElement("tbody");
        // let righe = result;
        let i;
        for (i = 0; i < Object.keys(righe).length; i++) {
            tr = document.createElement("tr");
            /* td = document.createElement("td");
                td.innerHTML = (i + 1) + outPag.perPagina * (outPag.paginaCorrente - 1);
                tr.appendChild(td);
                td = document.createElement("td");
                td.innerHTML = "<button type='button' class='btn text-start' data-bs-toggle='tooltip' title='Vedi' value='" + righe[i].idUs + "' name='view-user'>" + righe[i].cognome + ' ' + righe[i].nome + "</button>";
            */ /*   td.innerHTML = righe[i].cognome + ' ' + righe[i].nome;*/
            //tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = righe[i].ambito;
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = righe[i].valenza;
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = "<button type='button' class='btn' data-bs-toggle='tooltip' title='Modifica' data-idtpc='" + righe[i].idAm + "' value='" + righe[i].idAm + "' name='edit-topic' @click=\"editTopic(topic)\"><span class='bi-pencil-square spedit'></span></button>";
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = "<button type='button' class='btn' data-bs-toggle='modal' data-bs-target='#myModalTopic' data-idtpc=" + righe[i].idAm + "  title='Elimina' value='" + righe[i].idAm + "' name='delete-topic'><span class='bi-trash3'></span></button>";
            tr.appendChild(td);
            //td = document.createElement("td");
            //td.innerHTML = "<button type='button' class='btn vedi' data-bs-toggle='tooltip' title='Vedi' value='" + righe[i].idUs + "' name='view-user'><span class='bi-eye'></span></button>";
            ////    "<a name='view-user' href='users.php?view-user=" + righe[i].idUs + "'><i class='bi bi-eye'></i></a>";
            //tr.appendChild(td);
            tb.appendChild(tr);
        }
        tptable.appendChild(tb);
    }


    async function call_ajax_edit_topic(ided) {
        settaTitleAccordion("btnAccTopic", "Modifica Ambito");
        var data = new FormData;
        data.append("idAm", ided);

        var object = {}
        for (var [key, value] of data.entries()) {
            object[key] = value
        }

        let promo = fetch(apiBaseUrl + '/ambiti/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
        }).then(successResponse => {
            if (successResponse.status != 200) {
                return null;
            } else {
                return successResponse.json();
            }
        },
            failResponse => {
                //console.log("promessa fallita edit topic");
                return null;
            }
        );
        //console.log('aspetto che la promessa risolva');

        let tpc = await promo;
        //console.log('OK ... promessa risolta ' + tpc);
        if (tpc) {
            //console.log(tpc['idAm'] + ' ' + tpc['ambito'])
            // //mettere i dati nel form
            htip.value = tpc['idAm'];
            tname.value = tpc['ambito'];
            tval.value = tpc['valenza'];
            if (tpc['moreinfo'] == 1) tcheck.checked = 'checked';
            ////cambio la label al bottone
            suTpc.value = "Aggiorna Ambito";
            collapsableTopic.show(); //apre il form
        }
    }

    async function call_ajax_upcre_topic() {
        dataTopic = new FormData(formTOPIC);

        if (htip.value != 0) {
            //console.log('update');//update
            dataTopic.append('crud', 'U');
        }
        else {
            //console.log('create');
            dataTopic.append('crud', 'C');
            htip.value = 0;
            //create 
        }
        if (tcheck.checked) dataTopic.set('moreinfo', '1');     //set sostituisce l'eventuale valore già presente
        else dataTopic.set('moreinfo', '0');

        var object = {}
        for (var [key, value] of dataTopic.entries()) {
            object[key] = value
        }

        //console.log(object)

        let promo = fetch(apiBaseUrl + '/ambiti/crud', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
        }).then(successResponse => {
            if (successResponse.status != 200) {
                return null;
            } else {
                return successResponse.json();
            }
        },
            failResponse => {
                //console.log("promessa fallita edit topic");
                return null;
            }
        );
        //console.log('aspetto che la promessa risolva');

        let result = await promo;
        //console.log('OK ... promessa risolta ' + result);
        //console.log(result)
        if (result.errors) {
            //console.log(result.errors);
            showMessagge(result['errors'], "my-callout-danger");
        } else if (result.success) {
            //console.log(result.success);
            htip.value = 0;
            showMessagge(result['success'], "my-callout-warning");
            resetAccordion(collapsableTopic, "btnAccTopic", formTOPIC, "Crea nuovo ambito");
            suTpc.value = "Salva Ambito";
            call_ajax_refresh_topic_table()
            /* collapsableTopic.hide();*/
        }
    }
}

