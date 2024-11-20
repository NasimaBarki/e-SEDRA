'use strict'

var apiBaseUrl = 'http://localhost:3000'

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


//GESTIONE TUTTI I RUOLI

document.querySelectorAll('.updRuoli').forEach(function (element) {
    element.addEventListener('click', function (e) {
        // Aggiorna tabelle RUOLI E SUBRUOLI
        let idButton = e.target.id;
        let data = {};

        // Preparazione dei dati in base all'ID del pulsante cliccato
        if (idButton == 'insRolePrim') { // Inserisce nuovo ruolo primario
            let newRolePrim = document.getElementById('newRolePrim').value;
            if (!newRolePrim) {
                alert('Errore: Non è stato inserito un nome per il ruolo primario!');
                document.getElementById('newRolePrim').focus();
                return false;
            }
            data = { idRl: 1, idRs: 0, val: newRolePrim };
        }
        else if (idButton == 'addRoleSec') { //Aggiunge un ruolo secondario a primario
            let laR = document.getElementById('listAllRoles');
            let laRv = laR.value;
            /* let laRv = document.getElementById('listAllRoles').value;*/
            if (!laRv) {
                alert('Errore: Non \u00E8 stato selezionato alcun ruolo primario!');
                return false;
            }
            // Ottieni l'elemento selezionato dalla lista dei ruoli
            var selectedOption = document.querySelector('#listAllRoles option:checked');

            // Verifica se l'opzione selezionata ha la classe 'optionChild'
            if (selectedOption && selectedOption.classList.contains('optionChild')) {
                alert('Errore: È stato selezionato un ruolo secondario!\nSelezionare un ruolo primario!');
                return false;
            }
            else {
                let lrSv = document.getElementById('listRolesSec').value;
                if (!lrSv) {
                    alert('Errore: Non \u00E8 stato selezionato il ruolo secondario da assegnare al ruolo "' + laR.options[laR.selectedIndex].text + '"!');
                    return false;
                }
                data = { idRl: laRv, idRs: lrSv, val: '' };
            }
        }
        else if (idButton == 'delRole') {
            let laR = document.getElementById('listAllRoles');
            let laRv = laR.value;
            if (!laRv) {
                alert('Errore: Non \u00E8 stato selezionato alcun ruolo da eliminare!');
                return false;
            }
            else {
                let roltxt = laR.options[laR.selectedIndex].text;
                if (!confirm('Eliminare il ruolo "' + roltxt + '"?')) return false;
            }
            data = { idRl: laRv, idRs: 0, val: '' };
        }
        else if (idButton == 'insRoleSec') {
            let newRoleSec = document.getElementById('newRoleSec').value;
            if (!newRoleSec) {
                alert('Errore: Non è stato inserito un nome per il ruolo secondario!');
                document.getElementById('newRoleSec').focus();
                return false;
            }
            let laRv = document.getElementById('listAllRoles').value;
            if (!laRv) {
                alert('Errore: Non \u00E8 stato selezionato alcun ruolo primario!');
                return false;
            }
            // Ottieni l'elemento selezionato dalla lista dei ruoli
            var selectedOption = document.querySelector('#listAllRoles option:checked');
            // Verifica se l'opzione selezionata ha la classe 'optionChild'
            if (selectedOption && selectedOption.classList.contains('optionChild')) {
                alert('Errore: È stato selezionato un ruolo secondario!\nSelezionare un ruolo primario!');
                return false;
            }
            data = { idRl: laRv, idRs: 1, val: newRoleSec };
        }
        // Invio dei dati con Fetch API
        fetch('adminsez/admin/ajax/updruoli.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(data)
        })
            .then(response => response.text())
            .then(result => {
                if (result.substring(0, 2) === '->') {
                    alert('Errore 000-20: ' + result);
                    logerror('-20', 'setActRuoli.php', result);
                } else {
                    // Aggiorna il contenuto delle liste dei ruoli
                    updateRoleLists();
                    //location.reload(); // Soluzione semplice per ricaricare e aggiornare le liste
                }
            })
            .catch(error => {
                let str = `Errore 000-21: ${error}`;
                //alert(str);
                logerror('-21', 'setActRuoli.php', str);
            });
    });
});

//l'endpoint getUpdatedRoles
function updateRoleLists() {
    fetch('/include/getupdatedroles.php')
        .then(response => response.json())
        .then(data => {
            // Supponiamo che 'data' sia un oggetto con due proprietà: 'allRoles' e 'secondaryRoles',
            // ognuna contenente l'HTML aggiornato per le rispettive liste.
            const allRolesHtml = data.allRoles;
            const secondaryRolesHtml = data.secondaryRoles;

            // Aggiorna il contenuto HTML delle liste.
            const allRolesList = document.getElementById('listAllRoles');
            const secondaryRolesList = document.getElementById('listRolesSec');

            if (allRolesList) {
                allRolesList.innerHTML = allRolesHtml;
            }
            if (secondaryRolesList) {
                secondaryRolesList.innerHTML = secondaryRolesHtml;
            }
            const rPrim = document.getElementById('newRolePrim');
            const rSec = document.getElementById('newRoleSec');
            if (rPrim) rPrim.value = '';
            if (rSec) rSec.value = '';
        })
        .catch(error => {
            console.error('Errore durante l\'aggiornamento delle liste dei ruoli:', error);
        });
}

// GESTIONE VALORI CONFIGURATI IN INI FILE

document.getElementById("scPsw").addEventListener("change", function () {
    var scPswValue = this.value; // `this` si riferisce a #scPsw
    var ggMsgPsw = document.getElementById("ggMsgPsw");
    console.log(scPswValue + '  ' + ggMsgPsw);
    if (scPswValue == 0) {
        ggMsgPsw.value = 0;
        postRequest("ajax/setconfigiteminifile.php", { item: 'ggMsgPsw', val: 0 });
        ggMsgPsw.setAttribute('disabled', true);
    } else {
        ggMsgPsw.removeAttribute('disabled');
    }
});

function postRequest(url, data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    var urlEncodedData = "";
    var urlEncodedDataPairs = [];
    var name;

    for (name in data) {
        urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }
    urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Gestire la risposta del server se necessario
            //console.log(xhr.responseText);
        }
    };

    xhr.send(urlEncodedData);
}

document.getElementById("emailNoRep").addEventListener("change", function () {
    var mail = '"' + this.value + '"'; // `this` si riferisce a #scPsw
    postRequest("ajax/setconfigiteminifile.php", { item: 'emailNoRep', val: mail });
});

document.querySelectorAll('.inputcfg').forEach(function (input) {
    input.addEventListener('change', function () {
        var item = this.id; // `this` si riferisce all'elemento .inputcfg che ha scatenato l'evento
        var value = this.value;
        postRequest("ajax/setconfigiteminifile.php", { item: item, val: value });
    });
});

