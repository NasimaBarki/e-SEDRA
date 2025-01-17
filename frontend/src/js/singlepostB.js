
import { config } from "../../config"

var apiBaseUrl = config.$api_url


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

function updateHearth(btn) {
    var ch = btn.children;
    ch[0].classList.remove("bi-heart");
    ch[0].classList.add("bi-heart-fill");
    btn.disabled = 'disabled';
}

function goPersonalPost(itable) {
    var data = new FormData;
    data.append("page", 1);
    // if(itable=='B')
    //     call_ajax_viewPage('pages/bisognibase.php', data);
    // else 
    //     call_ajax_viewPage('pages/propostebase.php', data);
}

function call_ajax_set_comment(formNome, risp, master, elemb, itable) {
    var formd = document.getElementById(formNome);
    var data = new FormData(formd);
    //l'id del bisogno viene recuperato dal campo nascosto idOrigin nel form'
    /* alert("target dentro funz" + elemb);*/
    //if(!data['idBs'])
    //    data.append('idBs', idBs);
    data.append('risp', risp);
    data.append('master', master);
    data.append('itable', itable);
    data.append("us", window.currentUser?.idUs)
    stampaFormData(data);
    fetch(apiBaseUrl + '/setcomment', {
        method: 'POST',
        body: data
    }).then(
        function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }
            // Examine the text in the response
            response.text().then(function (risp) {
                //trasformo ilJSON in oggetto JS
                var bis = JSON.parse(risp);
                /* alert("set_comment bis " + bis + " elemb " + elemb);*/
                var nt = 104;
                if (itable == 'P') nt = 204;
                window.location.reload()
                // refreshSinglePost(elemb, 21, nt);  //1 per defaultpage non definito
            });
        })
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}


async function call_ajax_segnala_commento(idBl, itable) {
    var data = new FormData();
    data.append('idBl', idBl);
    data.append('itable', itable);
    data.append('userId', window.currentUser?.idUs)

    // console.log('eao')
    let promo = fetch(apiBaseUrl + '/segnalacomment', {
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
            //console.log("promessa fallita segnalaComment");
            return null;
        }
    );
    //console.log('aspetto che la promessa risolva');

    let result = await promo;
    //console.log('OK..promessa risolta ');
    if (result) {
        /* refreshComment(defaultpage);*/
        //console.log('commento segnalato');
    }
}

async function call_ajax_set_like(idB, itable) {

    var data = new FormData;
    data.append("campo", idB);
    data.append("itable", itable);
    let promo = fetch(apiBaseUrl + '/setlike', {
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
            //console.log("promessa fallita setlike");
            return null;
        }
    );
    //console.log('aspetto che la promessa risolva');

    let result = await promo;
    //console.log('OK..promessa risolta ');
    if (result) {
        //console.log('setlike ok');
    }
}


function refreshstelle(nri, nval, ori, oval) {
    var nrig = document.getElementById("s" + nri);
    nrig.innerHTML = nval;
    if (ori != 0) {
        var orig = document.getElementById("s" + ori);
        orig.innerHTML = oval;
    }
    var tb = document.getElementById("tableSt");
    var c1n = tb.rows[nri].cells[1].innerHTML.trim();
    var c2n = tb.rows[nri].cells[3].innerHTML.trim();

    if (c1n == c2n && !tb.rows[nri].classList.contains('completed')) {
        /* alert("metto completed a 1 "+c1n+" "+c2n);*/
        tb.rows[nri].classList.add('completed');
    }
    if (c1n != c2n && tb.rows[nri].classList.contains('completed')) {
        /* alert("tolgo completed a 1"+c1n+" "+c2n);*/
        tb.rows[nri].classList.remove('completed');
    }
    if (ori != 0) {
        var c1o = tb.rows[ori].cells[1].innerHTML.trim();
        var c2o = tb.rows[ori].cells[3].innerHTML.trim();
        /* alert(c1n + " "+ c2n +" "+ c1o+" "+c2o);*/
        if (c1o == c2o && !tb.rows[ori].classList.contains('completed')) {
            /* alert("metto completed a 1"+c1o+" "+c2o);*/
            tb.rows[ori].classList.add('completed');
        }
        if (c1o != c2o && tb.rows[ori].classList.contains('completed')) {
            /*  alert("tolgo completed a 1"+c1o+" "+c2o);*/
            tb.rows[ori].classList.remove('completed');
        }
    }
}

async function chkVal(currentAct) {
    const data = new FormData();
    data.append("idAct", currentAct);
    data.append("idUs", window.currentUser?.idUs)
    try {
        const response = await fetch(apiBaseUrl + '/chkvalut', {
            method: 'POST',
            body: data
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.status);
        }

        const risp = await response.text();
        const chkVoti = JSON.parse(risp);

        //console.log("in chval " + risp);
        // console.log("in chval " + chkVoti);
        return chkVoti;
    } catch (error) {
        console.error('Fetch Error :-S in chVal ', error);
    }
}


async function valGraduatoriaLU(elem, page, act) {
    /* alert(elem.value);*/
    //------------ MODIFICHE LUISA -------------
    /*  alert(chkVoti.length);*/
    /* alert(chkVoti[elem.value][0] + " " + chkVoti[elem.value][1])*/
    try {

        const chkVoti = await chkVal(act);
        // console.log("Risultato di chkVal:", chkVoti);
        // Puoi fare altre operazioni qui con il risultato di chkVal

        if (chkVoti.length === 0 || chkVoti[elem.value][0] > chkVoti[elem.value][1]) {
            //------------- FINE MODIFICHE LUISA ----------
            var data = new FormData;
            data.append("idUs", window.currentUser?.idUs)

            if (act == 104) {
                data.append("idBis", elem.previousElementSibling.value);    //valore del campo nascosto con id bisogno
                data.append("val", elem.value);
                call_ajax_single_promise(apiBaseUrl + '/updvalbis', data);
            }
            else {
                data.append("idPro", elem.previousElementSibling.value);    //valore del campo nascosto con id bisogno
                data.append("val", elem.value);
                call_ajax_single_promise('ajax/updvalpro.php', data);
            }
            //chkVoti = eseguiChkVal(act);
            //console.log("chkVoti in valGraduatoria dopo eseguichkVal" + chkVoti)
            /* chkVal(act); */// per non fare il reload della pagina 
            if (page == 1) {
                //if (chkVoti[elem.value][0] != 1024)   //graduatoria in pagina principale con template
                //{
                var old = elem.getAttribute("old-value");
                if (old == 'null')
                    refreshstelle(elem.value, (chkVoti[elem.value][1]) + 1, 0, 0);
                else {
                    // console.log('chkVoti ', chkVoti[elem.value][1])
                    // console.log('elemValue ', elem.value)
                    refreshstelle(elem.value, (chkVoti[elem.value][1]) + 1, old, (chkVoti[old][1]) - 1);
                }
                //}
                //else {      //votazione semlice in pagina principale
                //    refreshsingola(elem.value, chkVoti[elem.value][1] + 1);
                //}
            }

            //location.reload();
            /*  call_ajax_updateBisogni(idb, elem.value);*/
            /*                $.post('/ajax/updvalbis.php', { idBis: $(this).attr('id'), val: $target.val() };*/
            //------------ MODIFICHE LUISA -------------
        }
        else {
            if (page == 1) {
                showMessagge("Voto non assegnabile vedi tabella", "my-callout-danger", "infoMessagge");
            } else { showMessagge("Voto non assegnabile vedi tabella pagina precedente", "my-callout-danger", "infoMessagge"); }

            /* alert("Voto non possibile - puoi assegnare al massino " + chkVoti[elem.value][0] + " volte " + elem.value + " stelle");*/
            //alert(elem.getAttribute("value") + ' ' + elem.getAttribute("old-value"));
            //alert($target.attr("value") + ' ' + $target.attr("old-value"));
            //alert("vecchio "+elem.getAttribute("old-value"));

            elem.setAttribute("value", elem.getAttribute("old-value"));
            //alert("nuovo "+elem.getAttribute("value"));
            //location.reload();

            /*  $target.attr("value", $target.attr("old-value"));*/
        }


        /* return risultatoChkVal;*/
    } catch (error) {
        console.error("Errore durante l'esecuzione di chkVal:", error);
    }
}

var defaultpage = 21;
var datipost = new FormData();
var bis = document.getElementById("idOrigin").value;

ready(function () {
    /*alert("ready in singlepostB.js "+chkVoti);*/
    var bisa = document.getElementsByClassName("bisassociati");
    if (bisa) {
        //alert("lungh " + bisa.length);
        for (let i = 0; i < bisa.length; i++)
            bisa[i].addEventListener("mouseover", function (e) {
                e.target.style.cursor = "pointer";
                //e.preventDefault();
            });
    }

    var rat = document.getElementsByClassName("rating");
    if (rat.length != 0) {
        // alert("rating trovato "+rat[0]+" "+this);
        rat[0].addEventListener("click", (e) => { valGraduatoriaLU(e.target, defaultpage, 104); })
    }

    var linkbis = document.getElementsByClassName("linkstylebutton");
    for (let i = 0; i < linkbis.length; i++)
        linkbis[i].addEventListener("click", function (e) {
            e.preventDefault();
            refreshSinglePost(e.target.dataset.idbis, defaultpage, 104, 0);
            //if (timerrefresh) {
            //    clearInterval(timerrefresh);
            //    avviaTimerRefresh(e.target.dataset.idbis, defaultpage, 104);
            //}
        });

    var likebtn = document.getElementById("btnlike");
    if (likebtn) {
        likebtn.style.color = "var(--bs-primary)";
        likebtn.addEventListener("click", function (e) {
            e.preventDefault();
            //messo globale
            //var bis = document.getElementById("idOrigin").value;
            call_ajax_set_like(bis, 'B');
            updateHearth(likebtn);
        });
    }
    var bback = document.getElementById("backPage");
    if (bback) {
        bback.addEventListener("click", function () {
            /* alert("cliccato bback page");*/
            //if (timerrefresh) 
            //    clearInterval(timerrefresh);
            console.log('redirect')
            // goPersonalPost('B');
        });
    } else console.log("bback nullo");

    var btnpubCom = document.getElementById("pubblicaComm");
    if (btnpubCom) {
        btnpubCom.addEventListener("click", function (e) {
            e.preventDefault();
            var savelem = e.target;
            /* alert("clic su pubblicaComm ");*/
            call_ajax_set_comment("formCommento", 0, null, savelem.dataset.idbis, 'B');
        });
    }
    var sig = document.querySelectorAll(".signalBtn");
    console.log(sig)
    if (sig) {

        for (let i = 0; i < sig.length; i++)
            sig[i].addEventListener("click", function () {

                var id = this.getAttribute("id");
                this.setAttribute('disabled', true);
                var nome = "btnSegnala";
                var idBl = id.substr(nome.length, id.length);
                //console.log(idBl);
                var bri = document.getElementById("toggleRisp" + idBl);
                /*  alert('bri ' + bri);*/
                if (bri) bri.setAttribute('disabled', true);
                console.log('a')
                call_ajax_segnala_commento(idBl, 'B');
                var card = document.getElementById("Commento" + idBl);
                /* alert("cerco commento n " + idBl);*/
                if (!card) {
                    /*alert("cerco risposta n " + idBl);*/
                    card = document.getElementById("Risposta" + idBl);
                }
                card.classList.add("signal-warning");
            });
    }
    var btnpub = document.querySelectorAll(".publicBtn");
    if (btnpub) {
        for (let i = 0; i < btnpub.length; i++)
            btnpub[i].addEventListener("click", function (e) {
                e.preventDefault();
                var id = this.getAttribute("id");
                /* alert("clic su pubblica risposta");*/
                var nome = "rispostaCommento";
                var idBl = id.substr(nome.length, id.length);
                call_ajax_set_comment("formRisposta" + idBl, 1, idBl, e.target.dataset.idbis, 'B');
            });
    }

    //avviaTimerRefresh(bis, defaultpage, 104);
});
