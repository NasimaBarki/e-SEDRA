
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
                refreshSinglePost(elemb, 21, nt);  //1 per defaultpage non definito
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
    let promo = fetch('ajax/segnalacomment.php', {
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
    let promo = fetch('ajax/setlike.php', {
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
