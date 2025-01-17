
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

async function chkVal(currentAct) {
    const data = new FormData();
    data.append("Act", currentAct);

    try {
        const response = await fetch('ajax/chkvalut.php', {
            method: 'POST',
            body: data
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.status);
        }

        const risp = await response.text();
        const chkVoti = JSON.parse(risp);
        //console.log("in chval " + risp);
        //console.log("in chval " + chkVoti);
        return chkVoti;
    } catch (error) {
        console.error('Fetch Error :-S in chVal ', error);
    }
}

//async function eseguiChkVal(currentAct) {
//    try {
//         // Assicurati di sostituire questa stringa con il valore effettivo che vuoi passare
//        const risultatoChkVal = await chkVal(currentAct);
//        console.log("Risultato di chkVal:", risultatoChkVal);
//        // Puoi fare altre operazioni qui con il risultato di chkVal



//        return risultatoChkVal;
//    } catch (error) {
//        console.error("Errore durante l'esecuzione di chkVal:", error);
//    }
//}


//function chkVal(currentAct) {
//    var data = new FormData;
//    data.append("Act", currentAct);
//    fetch('ajax/chkvalut.php', {
//        method: 'POST',
//        body: data
//    })
//        .then(
//            function (response) {
//                if (response.status !== 200) {
//                    console.log('Looks like there was a problem. Status Code: ' +
//                        response.status);
//                    return;
//                }
//                // Examine the text in the response
//                response.text().then(function (risp) {
//                    //trasformo ilJSON in oggetto JS
//                    //alert(risp);
//                    chkVoti = JSON.parse(risp);
//                    alert("in chval " + risp);
//                    alert("in chval " + chkVoti);
//                    return chkVoti;
//                    //alert(chkVoti);
//                 });
//            })
//        .catch(function (err) {
//            //console.log('Fetch Error :-S', err);
//        });
//}

async function valGraduatoriaLU(elem,page,act) {
    /* alert(elem.value);*/
    //------------ MODIFICHE LUISA -------------
    /*  alert(chkVoti.length);*/
    /* alert(chkVoti[elem.value][0] + " " + chkVoti[elem.value][1])*/

    try {
       
        const chkVoti = await chkVal(act);
        console.log("Risultato di chkVal:", chkVoti);
        // Puoi fare altre operazioni qui con il risultato di chkVal

        if (chkVoti.length === 0 || chkVoti[elem.value][0] > chkVoti[elem.value][1]) {
            //------------- FINE MODIFICHE LUISA ----------
            var data = new FormData;
            if (act == 104) {
                data.append("idBis", elem.previousElementSibling.value);    //valore del campo nascosto con id bisogno
                data.append("val", elem.value);
                call_ajax_single_promise('ajax/updvalbis.php', data);
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
                if (!old)
                    refreshstelle(elem.value, (chkVoti[elem.value][1]) + 1, 0, 0);
                else
                    refreshstelle(elem.value, (chkVoti[elem.value][1]) + 1, old, (chkVoti[old][1]) - 1);
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
    //const chkVoti = eseguiChkVal(act);
    //console.log("chkVoti in valGraduatoria " + chkVoti);
    //if (chkVoti.length === 0 || chkVoti[elem.value][0] > chkVoti[elem.value][1]) {
    //    //------------- FINE MODIFICHE LUISA ----------
    //    var data = new FormData;
    //    if (act == 104) {
    //        data.append("idBis", elem.previousElementSibling.value);    //valore del campo nascosto con id bisogno
    //        data.append("val", elem.value);
    //        call_ajax_single_promise('ajax/updvalbis.php', data);
    //    }
    //    else {
    //        data.append("idPro", elem.previousElementSibling.value);    //valore del campo nascosto con id bisogno
    //        data.append("val", elem.value);
    //        call_ajax_single_promise('ajax/updvalpro.php', data);
    //    }
    //    chkVoti = eseguiChkVal(act);
    //    console.log("chkVoti in valGraduatoria dopo eseguichkVal" + chkVoti)
    //   /* chkVal(act); */// per non fare il reload della pagina 
    //    if (page == 1) {
    //        //if (chkVoti[elem.value][0] != 1024)   //graduatoria in pagina principale con template
    //        //{
    //            var old = elem.getAttribute("old-value");
    //            if (!old)
    //                refreshstelle(elem.value, (chkVoti[elem.value][1]) + 1, 0, 0);
    //            else
    //                refreshstelle(elem.value, (chkVoti[elem.value][1]) + 1, old, (chkVoti[old][1]) - 1);
    //        //}
    //        //else {      //votazione semlice in pagina principale
    //        //    refreshsingola(elem.value, chkVoti[elem.value][1] + 1);
    //        //}
    //    }
            
    //    //location.reload();
    //    /*  call_ajax_updateBisogni(idb, elem.value);*/
    //    /*                $.post('/ajax/updvalbis.php', { idBis: $(this).attr('id'), val: $target.val() };*/
    //    //------------ MODIFICHE LUISA -------------
    //}
    //else {
    //    if (page == 1) {
    //        showMessagge("Voto non assegnabile vedi tabella", "my-callout-danger", "infoMessagge");
    //    } else { showMessagge("Voto non assegnabile vedi tabella pagina precedente", "my-callout-danger", "infoMessagge"); }

    //   /* alert("Voto non possibile - puoi assegnare al massino " + chkVoti[elem.value][0] + " volte " + elem.value + " stelle");*/
    //    //alert(elem.getAttribute("value") + ' ' + elem.getAttribute("old-value"));
    //    //alert($target.attr("value") + ' ' + $target.attr("old-value"));
    //    //alert("vecchio "+elem.getAttribute("old-value"));

    //    elem.setAttribute("value", elem.getAttribute("old-value"));
    //    //alert("nuovo "+elem.getAttribute("value"));
    //    //location.reload();

    //    /*  $target.attr("value", $target.attr("old-value"));*/
    //}
            //------------- FINE MODIFICHE LUISA ----------
}