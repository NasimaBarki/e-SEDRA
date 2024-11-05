'use strict'

export function loginScript(updateUserCallback) {
    var apiBaseUrl = 'http://localhost:3000'
    var user = undefined

    function updateUserData(newUserData) {
        user = newUserData
        if (typeof updateUserCallback === 'function') {
            updateUserCallback(newUserData); // Call the callback with the new user data
        }
    }

    function addKeyUpListener(ids, callback) {
        ids.forEach(id => {
            //console.log(id);
            const element = document.getElementById(id);
            if (element) element.addEventListener('keyup', callback);
        });
    }

    // Aggiunta degli event listener
    addKeyUpListener(['newPswR', 'rNewPswR', 'newPswE', 'rNewPswE'], checkPasswords);

    // Funzione per controllare le password
    function checkPasswords(event) {
        const newPswR = document.getElementById('newPswR');
        const rNewPswR = document.getElementById('rNewPswR');
        const newPswE = document.getElementById('newPswE');
        const rNewPswE = document.getElementById('rNewPswE');

        const target = event.target; // Elemento che ha scatenato l'evento
        let other; // L'altro campo da confrontare

        if (target.id === 'newPswR' || target.id === 'rNewPswR') {
            other = target.id === 'newPswR' ? rNewPswR : newPswR;
        } else if (target.id === 'newPswE' || target.id === 'rNewPswE') {
            other = target.id === 'newPswE' ? rNewPswE : newPswE;
        }

        if (target.value === other.value) {
            target.style.backgroundColor = "white";
            other.style.backgroundColor = "white";
        } else {
            target.style.backgroundColor = "#ffe6ff";
            other.style.backgroundColor = "#ffe6ff";
        }
    }

    function validate(form) {
        let result = true;
        //console.log("validate");
        if (form.id === 'register-form' && document.getElementById('newPswR').value !== document.getElementById('rNewPswR').value) {
            alert("I campi Password e Ripeti password devono contenere lo stesso valore");
            return false;
        } else if (form.id === 'expPsw-form' && document.getElementById('newPswE').value !== document.getElementById('rNewPswE').value) {
            alert("I campi Password e Ripeti password devono contenere lo stesso valore");
            return false;
        }

        const inputs = form.querySelectorAll('.login-input');
        inputs.forEach(input => {
            if (!input.value.trim()) {
                alert("Attenzione: compilare tutti i campi!");
                result = false;
                return false; // In un forEach, questo agisce come un 'continue' nel ciclo normale
            }
        });

        return result;
    }

    document.querySelectorAll('input').forEach(input => {
        //console.log(input);
        input.addEventListener('keypress', function (e) {
            if (e.key == " ") {
                alert("Lo spazio non � un carattere valido!");
                e.preventDefault();
            }
        });
    });


    // Trova tutti i form e aggiungi loro un event listener per la sottomissione
    document.querySelectorAll('form').forEach(form => {
        //console.log(form);
        form.addEventListener('submit', function (event) {
            //console.log(event + " submit");
            event.preventDefault();
            //alert("prima di validate");
            // Esegui la validazione del form qui. Assicurati che la funzione validate() ora accetti un elemento form HTML
            if (!validate(form)) return false;

            document.querySelectorAll('.login-button').forEach(button => {
                button.setAttribute('disabled', true);
            });

            let spinnerDiv = document.getElementById("spinner-div");
            if (spinnerDiv) spinnerDiv.classList.remove('d-none');

            let formId = form.getAttribute('id');
            let url = '';

            switch (formId) {
                case 'login-form':
                    url = '/login';
                    break;
                case 'register-form':
                    url = 'ajax/chktoken.php';
                    break;
                case 'token-form':
                    url = 'ajax/chkreqtoken.php';
                    break;
                case 'expPsw-form':
                    url = 'ajax/chkchgexppsw.php';
                    break;
            }
            // Prepara i dati da inviare
            let formData = new FormData(form);

            var object = {}
            for (var [key, value] of formData.entries()) {
                object[key] = value
            }

            //console.log(url);
            // Effettua la richiesta POST
            fetch(apiBaseUrl + url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(object)
            })
                .then(response => response.text())
                .then(result => {
                    // Qui gestisci la risposta come nel tuo codice jQuery
                    // Per esempio:
                    //alert("Result " + result);
                    if (result.substring(0, 2) === '->') {
                        alert('Errore 000-9: ' + result);
                        logerror('-9', url, result); // Assicurati di convertire anche logerror in vanilla JS se necessario
                    }
                    // Continua con le altre condizioni...
                    else {
                        result = JSON.parse(result)
                        //alert("form ID " + formId);
                        switch (formId) {
                            case 'login-form':
                                switch (result["R"]) {
                                    case 'K':
                                        fetch(apiBaseUrl + '/chkloglogin', {
                                            method: 'POST', // Metodo di invio dati al server
                                            headers: {
                                                'Content-Type': 'application/x-www-form-urlencoded', // Specifica il tipo di contenuto
                                            },
                                            body: 'X=X' // Dati inviati al server
                                        }).then(response => {
                                            if (response.ok) {
                                                //alert("Reindirizzo l'utente");
                                                // Se la richiesta � andata a buon fine, reindirizza l'utente
                                                window.location.href = '/';
                                                updateUserData(result)
                                            } else {
                                                // Gestisci eventuali errori di risposta
                                                console.error('Richiesta fallita', response);
                                            }
                                        }).catch(error => {
                                            // Gestisci eventuali errori di rete
                                            console.error('Errore di rete', error);
                                        });

                                        //$.post('ajax/chkloglogin.php', { X: 'X' });
                                        //$(window.location).attr('href', 'index.php');
                                        break;
                                    case 'X':
                                        alert("Username e/o Password Errati!");
                                        break;
                                    default:
                                        //console.log("sono nel default");
                                        fadeInAndGrowHeight(document.getElementById('expPsw-form'));
                                        fadeOutAndShrinkHeight(document.getElementById('login-form'));

                                        /*$('#login-form').animate({ height: "toggle", opacity: "toggle" }, "slow");*/
                                        //$('#expPsw-form').animate({ height: "toggle", opacity: "toggle" }, "slow");
                                        if (result < 0) document.getElementById('warning').style.display = 'none'; //$('#warning').hide();
                                        else {
                                            document.getElementById('ggScadPsw').innerHTML = result;
                                            document.getElementById('expired').style.display = 'none';
                                            //$('#ggScadPsw').html(result);
                                            // $('#expired').hide();
                                        }
                                }
                                break;
                            case 'register-form':
                                if (result == 0) alert("Errore: Token non valido o scaduto!");
                                else {
                                    alert("Password reimpostata correttamente!");
                                    fadeOutAndShrinkHeight(document.getElementById('register-form'));
                                    fadeInAndGrowHeight(document.getElementById('login-form'));
                                    //$('#register-form').animate({ height: "toggle", opacity: "toggle" }, "slow");
                                    //$('#login-form').animate({ height: "toggle", opacity: "toggle" }, "slow");
                                }
                                break;
                            case 'token-form':
                                let emailInputValue = document.querySelector('#token-form input[name="EMAIL"]').value;

                                switch (result) {
                                    case '-1': alert('Email non registrata nell\'applicazione!');
                                        break;
                                    case '-2': alert('Errore: invio Email non riuscito!');
                                        break;
                                    case '-3': alert('Attenzione: funzionalit\u00E0 non attiva! Contattare l\'amministratore dell\'applicazione.');
                                        break;
                                    case '0':
                                        alert('Un token \u00E8 stato inviato all\'indirizzo email: ' + emailInputValue);
                                        break;
                                    default: //dovrebbe essere >0
                                        alert('Un token con validit\u00E0 ' + result + ' ore \u00E8 stato inviato all\'indirizzo email: ' + emailInputValue);
                                }
                                fadeOutAndShrinkHeight(document.getElementById('token-form'));
                                fadeInAndGrowHeight(document.getElementById('register-form'));
                                //$('#token-form').animate({ height: "toggle", opacity: "toggle" }, "slow");
                                //$('#register-form').animate({ height: "toggle", opacity: "toggle" }, "slow");

                                break;
                            case 'expPsw-form':
                                if (result == 0) alert("Errore: Email o password non riconosciute!");
                                else {
                                    alert("Password reimpostata correttamente!");
                                    fadeOutAndShrinkHeight(document.getElementById('expPsw-form'));
                                    fadeInAndGrowHeight(document.getElementById('login-form'));
                                    //$('#expPsw-form').animate({ height: "toggle", opacity: "toggle" }, "slow");
                                    //$('#login-form').animate({ height: "toggle", opacity: "toggle" }, "slow");
                                }
                                break;
                        }
                    }
                })
                .catch(error => {
                    //console.error('Errore nella richiesta:', error);
                    alert(`Errore 000-10: ${error}`);
                    logerror('-10', url, `${error}`); // Converti anche questa se necessario
                })
                .finally(() => {
                    if (spinnerDiv) spinnerDiv.classList.add('d-none');
                    document.querySelectorAll('.login-button').forEach(button => {
                        button.removeAttribute('disabled');
                    });
                });
        });
    });

    // -------------------  FUNZIONALITA' DEL MODAL DIALOG

    document.querySelectorAll('a.login-link').forEach(link => {
        link.addEventListener('click', function () {
            let form = this.closest('form');
            //console.log(form.id +" OUT Login IN")
            fadeOutAndShrinkHeight(form);
            fadeInAndGrowHeight(document.getElementById('login-form'));

        });
    });

    document.querySelectorAll('a.token-link').forEach(link => {
        link.addEventListener('click', function () {
            let form = this.closest('form');
            //console.log(form.id + " OUT token IN")
            fadeOutAndShrinkHeight(form);
            fadeInAndGrowHeight(document.getElementById('token-form'));

        });
    });

    document.querySelectorAll('a.register-link').forEach(link => {
        link.addEventListener('click', function () {
            let form = this.closest('form');
            //console.log(form.id + " OUT register IN")
            fadeOutAndShrinkHeight(form);
            fadeInAndGrowHeight(document.getElementById('register-form'));
        });
    });

    // Assicurati di aggiungere CSS per le transizioni di opacit�.

    document.addEventListener('keyup', function (e) {
        if (e.key == 'Escape') { // keyCode per Esc
            let loginPage = document.getElementById("login-page");
            if (loginPage) loginPage.remove();
        }
    });

    document.querySelectorAll('#modal-close-button a').forEach(button => {
        button.addEventListener('click', function () {
            let loginPage = document.getElementById("login-page");
            if (loginPage) loginPage.remove();
        });
    });

    document.querySelectorAll('a.close-link').forEach(link => {
        link.addEventListener('click', function () {
            window.location.reload();
        });
    });



    // Funzione per ottenere l'altezza, modificata per restituire l'altezza memorizzata se disponibile
    function getVisibleHeight(element) {
        if (element.dataset.originalHeight) {
            return parseInt(element.dataset.originalHeight, 10);
        }

        // Memorizza lo stile corrente per ripristinarlo in seguito
        const originalStyle = {
            visibility: element.style.visibility,
            position: element.style.position,
            height: element.style.height,
            display: element.style.display
        };

        // Applica stili temporanei per il calcolo
        element.style.visibility = 'hidden';
        element.style.position = 'absolute';
        element.style.height = '';
        element.style.display = 'block';

        // Calcola l'altezza
        const height = element.offsetHeight;

        // Memorizza l'altezza per usi futuri
        element.dataset.originalHeight = height;

        // Ripristina gli stili originali
        Object.assign(element.style, originalStyle);

        return height;
    }

    function fadeInAndGrowHeight(element) {
        // Assicurati che l'elemento sia "calcolabile"
        const height = getVisibleHeight(element);
        //console.log("IN " + element.id + " " + height);
        // Imposta l'elemento per l'animazione
        element.style.overflow = 'hidden';
        element.style.height = '0px';
        element.style.display = 'block';

        const animation = element.animate([
            { height: '0px', opacity: 0 },
            { height: `${height}px`, opacity: 1 }
        ], {
            duration: 750,
            fill: 'forwards'
        });

        animation.onfinish = () => {
            element.style.height = ''; // Rimuovi l'altezza fissa per permettere un flusso di layout naturale
            element.style.opacity = '';
            element.style.overflow = '';
        };
    }

    function fadeOutAndShrinkHeight(element) {
        // Calcola l'altezza attuale per l'animazione e memorizzala
        const height = element.offsetHeight;
        element.dataset.originalHeight = height; // Memorizza l'altezza prima di nascondere

        const animation = element.animate([
            { height: `${height}px`, opacity: 1 },
            { height: '0px', opacity: 0 }
        ], {
            duration: 500,
            fill: 'forwards'
        });

        animation.onfinish = () => {
            // Nascondi completamente l'elemento alla fine dell'animazione
            element.style.display = 'none';
            // Pulisci le propriet� per evitare conflitti con il CSS dell'elemento
            element.style.height = '';
            element.style.opacity = '';
        };
    }
}