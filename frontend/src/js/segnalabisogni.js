import { config } from "../../config"
var apiBaseUrl = config.$api_url
var myMdT;
var td;
var tr;
var actualCrud;

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
    else {
        if (!document.getElementById("divmoreinfo").classList.contains('invisible')) {
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
        if (pb.disabled) pb.removeAttribute('disabled');
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

async function call_ajax_edit_bis(bis, crud) {
    //console.log(bis);
    setHidden(bis);
    var pub = 0;
    var data = new FormData;
    data.append("idBis", bis);
    data.append("pub", pub);  //ZERO PER TUTTI I BISOGNI PUBBLICATI E NON
    let promo = fetch(apiBaseUrl + '/getsinglebisogno', {
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

function creaContenutoCella(ele, riga) {
    var st = "";
    //console.log(ele);
    //console.log(riga);
    if (ele.type == "button") { // creo button
        st = "<button type='" + ele.type + "'";
        if (ele.hasOwnProperty("class")) {
            st += setClass(ele.class);
        }
        if (ele.hasOwnProperty("exdata")) {
            st += getComplexData(ele.exdata, riga);

        }
        if (ele.hasOwnProperty("value")) {
            st += ' value=' + riga[ele.value];
        }
        if (ele.hasOwnProperty('other')) {
            st += ele.other;
        }
        if (ele.hasOwnProperty('disable')) {
            if (ele.disable.hasOwnProperty('field')) {
                if (riga[ele.disable.field] == 1)
                    st += " disabled";
            }
        }
        st += '>';
        if (ele.hasOwnProperty('text')) {
            st += setText(ele.text, riga);
        }
        if (ele.hasOwnProperty('textobj')) {
            var ob = ele.textobj;
            if (ob.hasOwnProperty('span')) {
                st += "<span class = 'bi ";
                if (ob.span.hasOwnProperty('field')) {
                    var ico;
                    //console.log("-- " + ob.span.field+" "+riga[ob.span.field] + " " + ob.span.value);
                    if (riga[ob.span.field] == ob.span.value) {
                        ico = ob.span.icon;
                    }
                    else ico = ob.span.deficon;
                    //console.log(ico);
                    st += ico;// 'bi-trash3'
                }
                st += "'></span >";
            }
        }
        st += '</button >';
    }
    if (ele.type == "text") { //creo testo semplice
        st += setText(ele.text, riga);
    }
    if (ele.type == "spantxt") { //creo span con testo di classe small
        st += '<span ';
        if (ele.hasOwnProperty("class")) {
            st += setClass(ele.class);
        }
        st += '>';
        if (ele.hasOwnProperty("number")) {
            st += setText(ele.text[0], riga);
            for (i = 1; i < ele.number; i++) {
                st += ' ';
                st += setText(ele.text[i], riga);
            }
        }
        else
            st += setText(ele.text, riga);
        st += '</span>';
    }
    if (ele.type == "textdouble") { //creo testo multiplo     
        st += setText(ele.text[0], riga);
        st += '';
        st += setText(ele.text[1], riga);
    }
    if (ele.type == "link") { //creo link
        st += "<a href= uploadpdf/";
        st += setText(ele.link, riga) + " target='_blank'>";
        st += setText(ele.title, riga) + "</a>";
    }
    if (ele.type == "spanico") {
        st += "<span class = 'bi ";
        if (ele.hasOwnProperty('field')) {
            var ico;
            //console.log("-- " + ob.span.field+" "+riga[ob.span.field] + " " + ob.span.value);
            if (riga[ele.field] == ele.value) {
                ico = ele.icon;
            }
            else ico = ele.deficon;
            //console.log(ico);
            st += ico;// 'bi-trash3'
        }

        st += "'></span >";
    }
    if (ele.type == "composite") { //creo cella contenuto multiplo     
        st += creaContenutoCella(ele.elem[0], riga);
        st += '<br>';
        st += creaContenutoCella(ele.elem[1], riga);
    }
    return st;
}

function setClass(elem) {
    let a = " class= '";
    for (let x = 0; x < elem.length; x++)
        a += " " + elem[x];
    a += "'";
    return a;
}
function getComplexData(elem, riga) {
    var att = Object.keys(elem);
    var st = "";
    for (let k = 0; k < att.length; k++) {
        //console.log(elem[att[k]]);
        st += ' data-' + att[k] + "=" + setText(elem[att[k]], riga);
        //    + riga[ele.exdata[k + 1]];
    }
    return st;
}

function setText(elem, riga) {
    if (elem[0] == 0)
        return elem[1];
    else if (elem[0] == 1)
        return riga[elem[1]];
}

function refreshTable(tableid, righe, job, number) {
    var tab = document.getElementById(tableid);
    var oldtb = tab.getElementsByTagName("tbody");

    var tbn = document.createElement("tbody");
    let i;
    for (i = 0; i < righe.length; i++) {
        tr = document.createElement("tr");
        if (number) {
            td = document.createElement("td");
            td.innerHTML = (i + 1);
            tr.appendChild(td);
        }

        for (let j = 0; j < job.ncol; j++) {
            td = document.createElement("td");
            td.innerHTML = creaContenutoCella(job.c[j], righe[i]);
            tr.appendChild(td);
        }
        tbn.appendChild(tr);
    }
    for (let i = 0; i < oldtb.length; i++) {
        if (oldtb[i] != null)
            oldtb[i].remove();
    }
    tab.appendChild(tbn);
}

var personalbis = {
    "ncol": 2,
    "c": [
        {
            "type": "button",
            "class": ["linkstylebutton", "btn", "btn-outline-primary", "text-start"],
            "exdata": { "idbis": [1, "idBs"] },
            "value": "idBs",
            "text": [1, "titleBis"]       //1 nome di variabile  0 dato costante
        },
        {
            "type": "button",
            "class": ["btn", "icona"],
            "exdata": { "idbis": [1, "idBs"] },
            "value": "idBs",
            "text": [0, "<span class='bi-trash3'></span>"],
            "other": " data-bs-toggle='modal' data-bs-target='#myModalBis' title='Elimina' name='delete-post'"
        }]
}

var formBis;
var collapsableBis;

async function call_ajax_dati_table(table, viewtab, obj, url, number) {
    var data = new FormData();
    var role = document.getElementById("whatcont").value;
    //console.log(role);
    data.append('table', table);
    data.append('role', role);
    data.append('idUs', window.currentUser?.idUs)
    console.log(url)
    let promo1 = await fetch(url, {
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
            //console.log("promessa fallita in select dati per " + table);
            return null;
        });
    //console.log('aspetto che la promessa risolva');
    let result = await promo1;
    //console.log('OK.. ' + result);
    if (result) {
        //alert("dati tabella pronti");
        refreshTable(viewtab, result, obj, number);

    }//finestra per messaggio errore è quella un po' più in basso
    else showMessagge(result['errors'], "my-callout-danger", "infoMessagge2");
}

ready(function () {

    var id_bisogno_selezionato;
    /* var infomes;*/
    var defaultpage = 1;

    formBis = document.getElementById("formInputBis");

    //Riabilito i campi disabilitati di default dal template
    var btnacc = document.getElementById("btnAccBis");
    if (btnacc) {
        btnacc.removeAttribute('disabled');
        btnacc.addEventListener("click", resetHidden());
    }

    var fieldsetBis = document.getElementById("fsForm");
    if (fieldsetBis) {
        fieldsetBis.removeAttribute('disabled');
    }

    var mmt = document.getElementById('myModalBis');
    if (mmt) {
        /* alert("prepare modal");*/
        myMdT = new bootstrap.Modal(mmt, {
            keyboard: false
        })
    }
    let sezB = document.getElementById("collapseBis");
    if (sezB) {
        collapsableBis = new bootstrap.Collapse(sezB, { toggle: false });
    }

    var delBisOK = document.getElementById("deleteBis");
    delBisOK.addEventListener("click", function () {
        call_ajax_delete_bis(id_bisogno_selezionato, 0);    //0 false fa eliminazione fisica => è un mio bisogno
        call_ajax_dati_table('bisogni', 'Bistable', personalbis, apiBaseUrl + '/getallposts');
    });


    var canc = document.getElementById("annullBis");        //chiude il form senza salvare
    if (canc) {
        canc.addEventListener("click", function () {
            //console.log('click su annulla');
            resetAccordion(collapsableBis, "btnAccBis", formBis, " Segnala nuovo bisogno");
        });
    }


    var suBis = document.getElementById("confirmBis");
    if (suBis) {
        suBis.addEventListener("click", (e) => {
            e.preventDefault();
            call_ajax_upcre_bisogni();
        });
    } /*else alert("suBis nullo");*/

    var link = document.querySelectorAll('.linkstylebutton');
    for (let i = 0; i < link.length; i++) {
        link[i].addEventListener("mouseover", (e) => { e.target.style.cursor = 'pointer'; });
    }
    var bistable = document.querySelector('#Bistable');
    if (bistable) {
        bistable.addEventListener("click", (e) => {
            if (e.target.nodeName != 'BUTTON' && e.target.nodeName != 'SPAN') { /*console.log('- '+e.target);*/  return; }
            let elem = e.target;
            let span = null;
            if (elem.classList.contains("linkstylebutton")) {
                //let idBisogno = elem.dataset.idbis;
                //console.log('+ ' + elem.nodeName + ' ' + idBisogno);
                call_ajax_edit_bis(elem.dataset.idbis, 'U');      //false disabilita i campi
                actualCrud = elem.dataset.crud;
            }
            else {
                if (e.target.nodeName == 'SPAN') {
                    elem = e.target.parentNode;
                    span = e.target;
                }
                /*    let param = elem.dataset.idbis;*/

                if (elem.name == "delete-post") {
                    //console.log('DELETE ' + param);
                    id_bisogno_selezionato = elem.dataset.idbis;
                }
            }
        });
    }
    var fortimer = document.getElementById("scadenza");
    var dataFine = fortimer.value;
    dataFine = dataFine.replace(" ", "T");
    avviaContoAllaRovescia(dataFine, "demo");

}); //end ready


function resetHidden() {
    document.getElementById("hidden_post_id").value = 0;
}

function setHidden(bis) {
    document.getElementById("hidden_post_id").value = bis;
}

function getHidden() {
    return (document.getElementById("hidden_post_id").value);
}

//ok per cancellazione
async function call_ajax_delete_bis(idcanc, clogic) {
    var data = new FormData;
    data.append("bis_id", idcanc);
    data.append("clogic", clogic);
    let promo = fetch(apiBaseUrl + '/deletebisogni', {
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
            //console.log("promessa fallita delete bisogni");
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
        call_ajax_dati_table('bisogni', 'Bistable', personalbis, apiBaseUrl + '/getallposts');
        //window.location.href = window.location.href;
    }
}


async function call_ajax_upcre_bisogni() {
    // e.preventDefault();
    //alert("sono nel salva");
    var data = new FormData(formBis);
    data.append('user_id', window.currentUser?.idUs)
    //vedere cosa carica e poi aggiungere o togliere
    let promo1 = await fetch(apiBaseUrl + '/createbisogni', {
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
            //console.log("promessa fallita in update create bisogni");
            return null;
        });
    //console.log('aspetto che la promessa risolva');
    let result = await promo1;
    //console.log('OK.. ' + result);
    if (result['success']) {
        resetAccordion(collapsableBis, "btnAccBis", formBis, "Segnala nuovo bisogno");
        formBis.reset();
        showMessagge(result['success'], "my-callout-info", "infoMessagge");
        call_ajax_dati_table('bisogni', 'Bistable', personalbis, apiBaseUrl + '/getallposts');
    }
    else showMessagge(result['errors'], "my-callout-danger", "infoMessagge");
}
