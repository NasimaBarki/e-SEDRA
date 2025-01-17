
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
import { config } from "../../config"
var apiBaseUrl = config.$api_url

var tr
var td
var i

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

function setText(elem, riga) {
    if (elem[0] == 0)
        return elem[1];
    else if (elem[0] == 1)
        return riga[elem[1]];
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

var revisorbis = {
    "ncol": 7,
    "c": [
        {
            "type": "text",
            "text": [1, "idBs"]
        },
        {
            "type": "composite",
            "elem": [{
                "type": "button",
                "class": ["linkstylebutton", "btn", "btn-outline-primary", "text-start"],
                "exdata": { "idbis": [1, "idBs"], "crud": [0, "R"] },
                "value": "idBs",
                "text": [1, "titleBis"]       //1 nome di variabile  0 dato costante
            },
            {
                "type": "spantxt",
                "class": ["small"],
                "text": [1, "textBis"]
            }
            ]
        },
        {
            "type": "text",
            "text": [1, "ambito"]
        },
        {
            "type": "spantxt",
            "class": ["small"],
            "number": 2,
            "text": [[1, "cognome"], [1, "nome"]]
        },
        {

            "type": "spanico",
            "field": "dtRev",
            "value": null,
            "icon": "bi-pencil-square",
            "deficon": "bi-pencil-fill"
        },
        {
            "type": "button",
            "class": ["btn", "icona"],
            "exdata": { "idbis": [1, "idBs"], "crud": [1, "idBs"] },
            "value": "idBs",
            "other": " data-bs-toggle='tooltip' title='Pubblica/Revoca' name='publishun-post'",
            "textobj": {
                "span": {
                    "field": "pubblicato",
                    "value": 1,
                    "icon": "bi-display",
                    "deficon": "bi-eye-slash"
                }
            },
            "disable": { "field": "deleted" }
        },
        {
            "type": "button",
            "class": ["btn", "icona"],
            "exdata": { "idbis": [1, "idBs"], "crud": [0, "D"] },
            "value": "idBs",
            "other": " data-bs-toggle='tooltip' title='Cancella' name='cancella-post'",
            "textobj": {
                "span": {
                    "field": "deleted",
                    "value": 1,
                    "icon": "bi-shield-fill-x",
                    "deficon": "bi-shield-x"
                }
            },
            "disable": { "field": "deleted" }
        }]
}


//var divmoreinfo;
//var fieldsetBis;
var formBis;
var actualCrud = '';
var defaultTit;
var defaultBtn;
var collapsableBis;

ready(function () {

    formBis = document.getElementById("formInputBis");

    let sezB = document.getElementById("collapseBis");
    if (sezB) {
        collapsableBis = new bootstrap.Collapse(sezB, { toggle: false });
    }

    var lvwb = document.querySelectorAll('.linkstylebutton');
    if (lvwb) {
        for (let i = 0; i < lvwb.length; i++) {
            lvwb[i].addEventListener("mouseover", (e) => { e.target.style.cursor = 'pointer'; });
        }
    }


    var revBis = document.getElementById("confirmBis");
    if (revBis) {
        //defaultTit = getTitleAccordion("btnAccBis");
        //defaultBtn = revBis.value;
        revBis.addEventListener("click", (e) => {
            e.preventDefault();
            call_ajax_rev_bisogno(actualCrud);
        });
    }

    var bistable = document.querySelector('#Bistable');
    if (bistable) {
        bistable.addEventListener("click", (e) => {
            if (e.target.nodeName != 'BUTTON' && e.target.nodeName != 'SPAN') { return; }

            let elem = e.target;
            let span = null;
            if (elem.classList.contains("linkstylebutton")) {
                call_ajax_edit_bis(elem.dataset.idbis, 'R');      //false disabilita i campi
                actualCrud = elem.dataset.crud;
            }
            else {
                if (e.target.nodeName == 'SPAN') {
                    elem = e.target.parentNode;
                    span = e.target;
                }
                let param = elem.dataset.idbis;
                if (elem.name == "publishun-post") {
                    //console.log('REVOCA/PUBBLICA ' + param);
                    var pub = TogglePubblication(param, "bisogni");
                    btnPubUnpub(pub, elem, span);
                    window.location.reload();
                    //window.location.href = window.location.href;
                }
                //else if (elem.name == "revision-post") {
                //    actualCrud = elem.dataset.crud;
                //    //console.log('REVISION ' + param);
                //    //oldTit = getTitleAccordion("btnAccBis");
                //    //if (oldTit != defaultTit)
                //    //    settaTitleAccordion("btnAccBis", defaultTit);
                //    call_ajax_edit_bis(param, 'R' );
                //    //call_ajax_revision_bis(param);
                //}
                else if (elem.name == "cancella-post") {
                    actualCrud = elem.dataset.crud;
                    //console.log('CANCEL ' + param);
                    //settaTitleAccordion("btnAccBis", "Cancellazione Bisogno");
                    //revBis.value = "Cancella";
                    call_ajax_edit_bis(param, 'D');
                    // fieldsetBis.disabled = 'disabled';    dovrebbe essere disabilitato di default
                    //call_ajax_cancella_bis(param);
                }
            }
        });
    }
    var fortimer = document.getElementById("scadenza");
    var dataFine = fortimer.value;
    dataFine = dataFine.replace(" ", "T");
    //console.log(dataFine);
    avviaContoAllaRovescia(dataFine, "demo");
});//ready


//ok per revisione in pub rimane uguale
function btnPubUnpub(pub, elem, span) {
    if (pub) {
        elem.title = "Revoca";
        if (span != null) {
            span.classList.remove("bi-eye-slash");
            span.classList.add("bi-display");
        }
    }
    else {
        elem.title = "Pubblica";
        if (span != null) {
            span.classList.add("bi-eye-slash");
            span.classList.remove("bi-display");
        }
    }
}

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

//ok per revisione
async function call_ajax_rev_bisogno(crud) {
    //e.preventDefault();    
    var data = new FormData(document.getElementById('formInputBis'));
    data.append('crud', crud);
    if (crud == 'D') {

    }
    data.append('user_id', window.currentUser?.idUs)
    let promo1 = await fetch(apiBaseUrl + '/revisionabisogno', {
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
            //console.log("promessa fallita in revisiona bisogno");
            return null;
        });
    //console.log('aspetto che la promessa risolva');
    let result = await promo1;
    //console.log('OK.. ' + result);
    if (result['success']) {
        showMessagge(result['success'], "my-callout-info", "infoMessagge");
        call_ajax_dati_table('bisogni', 'Bistable', revisorbis, apiBaseUrl + '/getallposts', false);
        resetAccordion(collapsableBis, "btnAccBis", formBis, "Revisione bisogno");
        //window.location.href = window.location.href;
    }
    else {
        showMessagge(result['errors'], "my-callout-danger", "infoMessagge");
    }
}
