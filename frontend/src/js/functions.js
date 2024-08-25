
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
//const defaultpage = 5;
var rootPATH;
var timer;
//var timerrefresh;

//per passare il ROOT_PATH in JS
async function call_ajax_rootpath() {

    let promo = fetch('ajax/getroot.php', {
        method: 'POST'
    }).then(successResponse => {
        if (successResponse.status != 200) {
            return null;
        } else {
            return successResponse.json();
        }
    },
        failResponse => {
            //console.log("promessa fallita con " + url);
            return null;
        }
    );
    //console.log('aspetto che la promessa risolva');

    let result = await promo;
    //console.log('OK ... promessa risolta ' + result);
    rootPATH = result;
}

function abilitaFS(fs, ab) {
    if (ab) {
        if (fs.disabled)
            fs.removeAttribute('disabled');
    }
    else {
        /*  if (!fs.disabled)*/
        fs.setAttribute('disabled', true);
    }
}

function vediPulsante(bot, vedi) {
    if (vedi) {
        if (bot.classList.contains("d-none"))
            bot.classList.remove("d-none");
    }
    else {
        if (!bot.classList.contains("d-none"))
            bot.classList.add("d-none");
    }
}

function resetHidden() {
    document.getElementById("hidden_post_id").value = 0;
}

function setHidden(bis) {
    document.getElementById("hidden_post_id").value = bis;
}

function getHidden() {
    return (document.getElementById("hidden_post_id").value);
}

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

function goActivityPage() {
    menu = document.getElementById("4");
    simulateClick(menu);
}

function stabilisciNumeroGrad(table, posg) {
    let totr = document.getElementById("nrigh").value;
    //alert(posg + " " + totr);
    var i;
    for (i = 0; i <= posg; i++) {
        let rx = document.getElementById("gd" + i);
        if (rx) {
            var btaf = rx.children;
            if (btaf) {
                if (btaf[0].classList.contains("bi-list")) {
                    btaf[0].classList.remove("bi-list");
                    btaf[0].classList.add("bi-check2-square")
                }
                call_ajax_set_II_vot(rx.value, 1, table);
            }
        }
    }
    var j;
    for (j = i; j < totr; j++) {
        let rx = document.getElementById("gd" + j);
        if (rx) {
            var btaf = rx.children;
            if (btaf) {
                if (btaf[0].classList.contains("bi-check2-square")) {
                    btaf[0].classList.remove("bi-check2-square");
                    btaf[0].classList.add("bi-list")
                }
                call_ajax_set_II_vot(rx.value, 0, table);
            }
        }
    }
}

async function call_ajax_set_II_vot(id, val, table) {
    var data = new FormData;
    data.append("id", id);
    data.append("val", val);
    data.append("table", table);
    let promo = fetch('ajax/update2vot.php', {
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
            //console.log("promessa fallita con updatepro2vot");
            return null;
        }
    );
    //console.log('aspetto che la promessa risolva');

    let result = await promo;
    //console.log('OK ... promessa risolta ' + result);
}

function toggleBtnPub() {
    var pb = document.getElementById("publish");
    var spp = document.getElementById("spp");
    if (pb.checked) {
        spp.classList.remove("bi-eye-slash");
        spp.classList.add("bi-display");
    }
    else {
        spp.classList.add("bi-eye-slash");
        spp.classList.remove("bi-display");
    }
}


function TogglePubblication(id, tab) {
    data = new FormData;
    data.append("id", id);
    data.append("table", tab);
    fetch('ajax/togglepublication.php', {
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
                var pub = JSON.parse(risp);
                return pub;
            });
        })
        .catch(function (err) {
            //console.log('Fetch Error :-S', err);
        });
}

function ToggleGradDef(id, tab) {
    data = new FormData;
    data.append("id", id);
    data.append("table", tab);
    fetch('ajax/togglegraddef.php', {
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
                var gr = JSON.parse(risp);
                return gr;
            });
        })
        .catch(function (err) {
            //console.log('Fetch Error :-S', err);
        });
}

function stampaFormData(data) {
    for (var pair of data.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
    }
}

//carica in modo asincrono la pagina 'url' passandogli 'data' nella sezione contentPage dell'index
//usando la funzione loadData presa da gitHub contenuta nel file fetch_loader.js
//async function call_ajax_viewPage(url, data) {

//    alert(url);
//    stampaFormData(data);

//    let promo = fetch(url, {
//        method: 'POST',
//        body: data
//   }).then(function (successResponse) {
//        return successResponse.text();
//    })
//        .then(function (html) {
//           /* console.info('content has been fetched from data.html');*/
//            loadData(html, '#contentPage').then(function (html) {
//                /*console.info('I\'m a callback');*/
//            })
//        }).catch((error) => { console.log(error); });
//}

function insertAndExecuteScripts(containerSelector, html) {
    const container = document.querySelector(containerSelector);
    container.innerHTML = html;

    const scripts = container.querySelectorAll('script');
    scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        if (oldScript.src) {
            // Per gli script esterni, imposta l'attributo src
            newScript.src = oldScript.src;
        } else {
            // Per gli script inline, copia il testo
            newScript.textContent = oldScript.textContent;
        }

        // Copia eventuali attributi aggiuntivi che potrebbero essere importanti
        Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
        });

        // Sostituisci lo script originale con il nuovo
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}


//async function call_ajax_viewPage(url, data) {

//    //alert(url);
//    //stampaFormData(data);

//    let promo=fetch(url, {
//        method: 'POST',
//        //headers: {
//        //    'Content-Type': 'application/x-www-form-urlencoded',
//        //},
//        body: data
//    })
//        .then(response => response.text())
//        .then(html => {
//            /*loadAlsoScript(html);*/
//            insertAndExecuteScripts('#contentPage', html);
//            //        document.querySelector('#contentPage').innerHTML = html;
//            /*})*/
//        }).catch((error) => { console.log(error); });
//}

async function call_ajax_viewPage(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: data
        });

        const html = await response.text();
        insertAndExecuteScripts('#contentPage', html);
    } catch (error) {
        console.log(error);
    }
}


function refreshSinglePost(idb, dfpage, act, n = 0) {
    var data = new FormData;
    data.append("page", dfpage);
    //alert("id " + idb+ " defaultp "+dfpage+" act "+act);
    if (act == 104) {
        data.append("idBis", idb);
        call_ajax_viewPage("pages/bisognisinglepost.php", data);
        /*call_ajax_viewPage("pages/home.php", data);*/
    }
    else {
        data.append("idPro", idb);
        /* data.append("n", n);*/
        call_ajax_viewPage("pages/propostesinglepost.php", data);
    }
}




async function call_ajax_single_promise(url, data) {
    let promo = fetch(url, {
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
            console.log("promessa fallita con " + url);
            return null;
        }
    );
    //console.log('aspetto che la promessa risolva');

    let result = await promo;
    //console.log('OK ... promessa risolta ' + result);
    return result;
}

function topFunction() {
    document.body.scrollTop = 100;
    document.documentElement.scrollTop = 100;
}


function getTitleAccordion(id) {
    var el = document.getElementById(id);
    if (el) {
        var btaf = el.children;
        if (btaf) {
            //for (let i = 0; i < btaf.length; i++) {
            //    alert(btaf.length+'  '+btaf[i].innerText); // Text, DIV, Text, UL, ..., SCRIPT
            //}
            //console.log("innerHTML " + btaf);
            return (btaf[0].innerText);
        }
    }
    else return "";
}

function settaTitleAccordion(id, nomeA) {
    var el = document.getElementById(id);
    if (el) {
        var btaf = el.children;
        if (btaf)
            btaf[0].innerHTML = "<span>&nbsp;" + nomeA + "</span>";
        /* console.log('FFF' + btaf[0].innerHTML);*/
    }
}

function resetAccordion(acc, idbtn, form, title = "") {
    form.reset();
    if (title != "")
        settaTitleAccordion(idbtn, title);
    acc.hide(); //chiude l'accordion'
}

function divMessage(el, cla, text, before) {
    let div = document.createElement("div");
    div.className = cla;
    div.innerHTML = text;
    if (before)
        el.before(div);
    else
        el.after(div);
    setTimeout(function () { removeMessagge(div) }, 6000);
}

function removeMessagge(div) {
    div.remove();
}



//visualizza messaggi nella div infoMessagge
function showMessagge(text, cla, divM = "infoMessagge") {
    var div = document.getElementById(divM);
    if (div) {
        div.classList.add(cla);
        if (div.classList.contains("d-none"))
            div.classList.remove("d-none");
        div.classList.add("d-block");
        div.innerHTML = text;
        setTimeout(function () { hideMessagge(cla, divM) }, 6000);
    }
}

function hideMessagge(cla, divM) {
    var div = document.getElementById(divM);
    if (div) {
        if (div.classList.contains(cla))
            div.classList.remove(cla);
        if (div.classList.contains("d-block"))
            div.classList.remove("d-block");
        div.classList.add("d-none");
    }
}

//scrive parametri errore in logerrors.txt.php
//function logerror(num, file, error) {
//    $.ajax({
//        method: "POST",
//        data: 'num=' + num + '&file=' + file + '&err=' + error,
//        url: "ajax/logerror.php",
//    }).done(function (result) {
//        if (result.substr(0, 2) === '->') {
//            alert('Errore 000-5: ' + result);
//        }
//    }).fail(function (xhr, ajaxOptions, thrownError) {
//        alert("Errore 000-6: " + xhr.status + " " + thrownError);
//    })
//} //fine logerror()

function logerror(num, file, error) {
    // Prepariamo i dati da inviare
    const formData = new URLSearchParams();
    formData.append('num', num);
    formData.append('file', file);
    formData.append('err', error);

    // Utilizziamo fetch per inviare la richiesta
    fetch('ajax/logerror.php', {
        method: 'POST',
        body: formData, // Usiamo formData per inviare i dati come 'application/x-www-form-urlencoded'
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Qui assumiamo che la risposta sia testuale
        })
        .then(result => {
            if (result.substring(0, 2) === '->') {
                alert('Errore 000-5: ' + result);
            }
        })
        .catch(error => {
            // Gestiamo errori di rete o se la promessa è stata rifiutata
            alert("Errore 000-6: " + error.message);
        });
}




//function waitIcon($tag) {
//    $($tag).append('<img src="images/load3.gif" id="__wtIcn" style="z-index:500;position:fixed;width:30vw;top:50%;left:50%;transform:translate(-50%,-50%);"/>');
//}

//function removeWaitIcon() {
//    $("#__wtIcn").remove();
//}

function ready(fn) {
    if (document.readyState != 'loading') {
        //alert("ready not loading");
        fn();
    } else if (document.addEventListener) {
        //alert("ready domevent");
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        document.attachEvent('onreadystatechange', function () {
            //alert("ready state");
            if (document.readyState != 'loading') {
                //alert("ready ultimo");
                fn();
            }
            //else alert("ready none");
        });
    }
}

//simulare evento onclick
var simulateClick = function (elem) {
    // Opzioni
    var evt = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    // Se cancellato non triggiamo l'evento
    var canceled = !elem.dispatchEvent(evt);
};

document.addEventListener("DOMContentLoaded", function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (element) {
        return new bootstrap.Tooltip(element);
    });
});

// --------
// Tooltips
// --------
// Instantiate all tooltips in a docs or StackBlitz page
//document.querySelectorAll('[data-bs-toggle="tooltip"]')
//    .forEach(tooltip => {
//        new bootstrap.Tooltip(tooltip)
//    })


function avviaContoAllaRovescia(dataFine, elementoId) {
    // Converte dataFine in un timestamp
    var dataFineTimestamp = new Date(dataFine).getTime();

    // Aggiorna il conto alla rovescia ogni 1 secondo
    timer = setInterval(function () {
        // Ottieni la data e l'ora attuali
        var oraAttuale = new Date().getTime();

        // Trova la distanza tra ora e la data di fine
        var distanza = dataFineTimestamp - oraAttuale;

        // Calcoli per giorni, ore, minuti e secondi
        var giorni = Math.floor(distanza / (1000 * 60 * 60 * 24));
        var ore = Math.floor((distanza % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minuti = Math.floor((distanza % (1000 * 60 * 60)) / (1000 * 60));
        var secondi = Math.floor((distanza % (1000 * 60)) / 1000);

        // Mostra il risultato nell'elemento specificato
        document.getElementById(elementoId).innerHTML = giorni + "g " + ore + "h " + minuti + "m " + secondi + "s ";

        // Se il conto alla rovescia finisce, scrivi del testo
        if (distanza < 0) {
            clearInterval(timer);
            document.getElementById(elementoId).innerHTML = "TERMINATA";
            window.location.reload(); // Aggiunge il refresh della pagina qui
            //if (timerrefresh)
            //    clearInterval(timerrefresh);
        }
    }, 1000);
}

function avviaTimerRefresh(idb, dfpage, act) {
    timerrefresh = setInterval(function () {
        console.log("refresh " + idb);
        refreshSinglePost(idb, dfpage, act);
    }, 20000);
}


