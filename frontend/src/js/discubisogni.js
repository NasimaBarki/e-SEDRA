

import { config } from "../../config"

var apiBaseUrl = config.$api_url

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


var $svVoto;


ready(function () {

    //Quando pagina pronta chiamo funzione per conteggio voti assegnati che riempie array chkVoti
    //alert("ready prima di chkVal");
    //var chkVoti=chkVal(104);
    //alert("chkVoti dopp chkVal " + chkVoti);
    //const chkVoti=eseguiChkVal(104);
    //console.log('chkVoti ' + chkVoti);
    //--------- FINE MODIFICHE LUISA --------------

    var defaultpage = 1;

    var disctable = document.querySelector('#Disctable');
    //console.log(disctable);
    disctable.addEventListener("click", (e) => {
        //if (e.target.nodeName != 'BUTTON' && e.target.nodeName != 'SPAN') { /*console.log('- '+e.target);*/  return; }
        //let edt = e.target.closest('.spedit');
        //console.log(edt.dataset.idtpc);
        let elem = e.target;
        let span = null;
        if (elem.classList.contains("linkstylebutton")) {
            //console.log('timer = ' + timer);

            if (timer) {
                clearInterval(timer);
                //console.log('timer sospeso ' + timer);
            }
            //console.log('+ ' + elem.nodeName + ' ' + idBisogno + 'aut ' + auth + ' rev ' + rev);
            refreshSinglePost(elem.dataset.idbis, defaultpage, 104)
        }
        if (elem.classList.contains("rating")) {
            valGraduatoriaLU(elem, defaultpage, 104);
        }
        if (elem.nodeName == 'SPAN') {
            elem = elem.parentNode;
            //span = e.target;
        }
        let param = elem.dataset.idbis;
        if (elem.name == "cancella-voto") {
            console.log('cancella ' + param);
            deleteVotoB(param);
            // btnPubUnpub(pub, elem, span);
            window.location.reload();
        }
    });
    var fortimer = document.getElementById("scadenza");
    var dataFine = fortimer.value;
    dataFine = dataFine.replace(" ", "T");

    avviaContoAllaRovescia(dataFine, "demo");
    //console.log('timer avviato ' + timer);
}); //end ready

async function deleteVotoB(id) {
    console.log('eao')
    try {
        var data = new FormData;
        data.append("idBis", id);    //valore del campo nascosto con id bisogno
        /*  data.append("val", 0);*/
        data.append("idUs", window.currentUser?.idUs)
        call_ajax_single_promise(apiBaseUrl + '/deletevalbis', data);

    } catch (error) {
        console.error("Errore durante l'esecuzione di deleteVotoB:", error);
    }
}
