<style>
@import url('../assets/css/setup.css');
</style>

<script setup>
import TheFooterSetup from '../components/TheFooterSetup.vue'
</script>

<template>
<div class="myheader d-flex align-items-center mb-3">
        <div class="flex-shrink-0">
            <img id="appLogo" src="../assets/logo.png" title="logo esedra compatto" />
           
        </div>
        <div class="flex-grow-1 ms-3 row align-items-center">
        <img id="appText" src="../assets/esedratext2.png" title="scritta esedra" />
            </div>
        <div class="flex-grow-1 ms-3 row align-items-end">
       <h2 class="col-md-3">Configurazione</h2> 
        </div>
    </div>

<div class="flex-shrink-0">   
 
 <div id="main" class="container">  
      
    <form id="formsetup" name="form" class="row">
        <fieldset class="row align-items-end" form="formsetup">   
            <legend class="col-md-2">Database</legend>
            <div class="col-md-5">
                <label  class="form-label" for="dbms"><span>* </span>DBMS: </label>
                <select class="form-select" id="dbms" name='DBMS'>
                    <option disabled selected hidden >Seleziona il DBMS </option>     
                    <option value="My SQL">My SQL</option>
                    <option value="SQL Server">SQL Server</option>
                    <!-- <option value="SQL Server Express LocalDB">SQL Server Express LocalDB</option> -->
                </select>
            </div>
            
            <div class="col-md-5">
                <label class="form-label" for="host"><span>* </span>Server database: </label>
                <input  class="form-control" id="host" name="HOST" type="text" placeholder="servername | IP">
            </div>
         </fieldset>
         <fieldset class="row align-items-end mt-4" form="formsetup">  
               <legend class="col-md-2">
                        
                    </legend>
                   
                <div class="col-md-4">
                    <label  class="form-label" for="db"><span>* </span>Nome del database: </label>
                    <input  class="form-control"id="db" name="DB" type="text">
                </div>
             
             <div class="col-md-3">
                <label class="form-label"  for="usn"><span>* </span>Username: </label>
                <input  class="form-control"id="usn" name="USN" type="text">
                  </div>
             <div class="col-md-3">
                <label  class="form-label" for="psw"><span>* </span>Password: </label>
                <input class="form-control" id="psw" name="PSW" type="password">
             </div>
            <div class="msg col-md-2">
                    * campi obbligatori
                </div>
              
             <div class="col-md-5 ">
               
                    <input  type="checkbox" class="form-check-input" id="dbEx" name="DBEX">
                        <label class="form-label" for="dbEx">Database gi&agrave; esistente</label>
                </div>
        </fieldset >

       <div class="mb-2"><hr /></div>
        <fieldset class="row align-items-end" form="formsetup">
            <legend class="col-md-2">Account admin</legend>
             <div class="col-md-4">
                <label class="form-label" for="mailAdm"><span>* </span>E-mail: </label>
                <input class="form-control" id="mailAdm" name="MAILAD" type="email" required>
             </div>
             <div class="col-md-3">
                <label class="form-label" for="pswAdm"><span>* </span>Password: </label>
                <input class="form-control" id="pswAdm" name="PSWAD" type="password" required>
             </div>
             <div class="col-md-3">
                <label class="form-label" for="rpswAdm"><span>* </span>Conferma password: </label>
                <input class="form-control" id="rpswAdm" type="password" required>
             </div>
        </fieldset>
         <div class="mb-2"><hr /></div>
        <fieldset class="row align-items-end" form="formsetup">
            <legend   class="col-md-2">Personalizzazione</legend>
             <div class="col-md-4">
                   <div title="E-mail" data-bs-toggle="tooltip" data-bs-placement="top"  class="input-group">
                <div class="input-group-text"><span  class="fa fa-envelope"/></div>
                <input  class="form-control" id="emailLink" name="emailLink" type="text" placeholder="*Indirizzo e-Mail">
                </div>
             </div>
             <div class="col-md-3">
                <div title="Social" data-bs-toggle="tooltip" data-bs-placement="top"  class="input-group">
                <div  class="input-group-text"><span class="fa fa-users"></span></div>
                <input  class="form-control" id="socialLink" name="socialLink" type="text" placeholder="*Link Social Network">
                </div>
             </div>
             <div class="col-md-3">
                 <div title="Sito Web" data-bs-toggle="tooltip" data-bs-placement="top"  class="input-group">
               <div class="input-group-text"><span class="fa fa-globe"></span></div>
                     <input  class="form-control" id="webLink" name="webLink" type="text" placeholder="*Indirizzo Sito Web"/>
                 </div>
             </div>
        </fieldset>
        <div class="mb-2"><hr /></div>
            <fieldset class="row align-items-end" form="formsetup">
                <legend class="col-md-2">Percorso</legend>
                <div class="col-md-4">             
                    <!-- TODO: <?php if(strlen($dir)==1 && $dir[0]=='/') echo 'checked';?> -->
                    <input  type="checkbox" class="form-check-input" id="domRoot" name="domRoot" disabled>
                    <label class="form-label" for="domRoot">Dominio/sottodominio</label>
                </div>
                <div class="col-md-6">
                <label class="form-label" for="cartRoot">Cartella:</label>
                    <input class="form-control" id="cartRoot" name="cartRoot" type="text" value="<?php echo $dir;?>" disabled/> 
                    <input type="hidden" id="myRoot" name="myRoot" value="<?php echo ROOT_PATH;?>" disabled />
                </div>
            </fieldset>
        <!-- PROGRESS BAR -->
        <div class="progress  col-md-12 mt-3">
             <div id="myBar" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-label="Avanzamento creazione tabelle db"  aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
         </div>  
        <div id="msgProgress">Inizializzazione...</div>
       
        <!-- FINE PROGRESS BAR -->
          <!--<div class="d-grid d-md-flex justify-content-md-end mb-3">-->
        <div class="row align-items-end mb-3">
         <div class="col-md-10"></div>
        <input class="btn btn-primary col-md-2" id="installa" name="install" type="submit" value="Installa"/>
        <input class="btn btn-primary col-md-2" id="login" type="button" value="Avvia Applicazione"/>
    </div>
    </form>
     </div>
    
</div>

<TheFooterSetup></TheFooterSetup>
</template>

<script>

export default {
    inheritAttrs: false,
    mounted() {
        var apiBaseUrl = this.apiBaseUrl
        
        var count = 0;
        var arrayFiles = [];
        var totFiles;
        var resume = 0;

        var errore;
        var dati;
        var str;

        ready(function () {
        const dbms = document.getElementById('dbms');
        const inst = document.getElementById('installa')
        dbms.addEventListener('change', function () {
            let host = document.getElementById('host');
            let usn = document.getElementById('usn');
            let psw = document.getElementById('psw');
            let dbex = document.getElementById('dbEx');
            if (dbms.value == "SQL Server Express LocalDB") {
                host.value = "";
                host.setAttribute('disabled', true);
                usn.value = "";
                usn.setAttribute('disabled', true);
                psw.value = "";
                psw.setAttribute('disabled', true);
                dbex.setAttribute('disabled', true);
            }
            else {
                host.removeAttribute('disabled');
                usn.removeAttribute('disabled');
                psw.removeAttribute('disabled');
                dbex.removeAttribute('disabled');
            }
        });
        

        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('keypress', function (e) {
                if (e.key == " ") {
                    alert("Lo spazio non \u00E8 un carattere valido!");
                    e.preventDefault();
                }
            });
        });

        function addKeyUpListener(ids, callback) {
            ids.forEach(id => {
                //console.log(id);
                const element = document.getElementById(id);
                if (element) element.addEventListener('keyup', callback);
            });
        }

        // Aggiunta degli event listener
        addKeyUpListener(['pswAdm', 'rpswAdm'], checkPassword);

        // Funzione per controllare se le password sono uguali
        function checkPassword(event) {
            const newPswR = document.getElementById('pswAdm');
            const rNewPswR = document.getElementById('rpswAdm');
            
            const target = event.target; // Elemento che ha scatenato l'evento
            let other; // L'altro campo da confrontare
            console.log(target.id);
            if (target.id === 'pswAdm') {
                other = rNewPswR;
            }
            else other = newPswR;
            console.log(target.value +'  '+other.value);
            if (target.value === other.value) {
                target.style.backgroundColor = "rgba(var(--bs-success-rgb),0.35";
                other.style.backgroundColor = "rgba(var(--bs-success-rgb),0.35";
            } else {
                target.style.backgroundColor = "rgba(var(--bs-danger-rgb),0.35)";
                other.style.backgroundColor = "rgba(var(--bs-danger-rgb),0.35)";
            }
        }

        document.getElementById('login').addEventListener('click', function () {
            const email = document.getElementById("mailAdm").value;
            const password = document.getElementById("pswAdm").value;

            fetch(apiBaseUrl + "/chklogin", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },  
                body: `EMAIL=${encodeURIComponent(email)}&PSW=${encodeURIComponent(password)}`
            })
                .then(response => response.text())
                .then(result => {
                    if (result === 'K') {
                        window.location.href = '/';
                    } else if (result.substring(0, 2) === '->') {
                        alert('Errore 000-9: ' + result);
                        logerror('-9', 'chklogin.php', result);
                    } else {
                        document.getElementById("msg").textContent = "Username o Password Errati!";
                    }
                })
                .catch(error => {
                    let str = "Errore 000-10: " + error.status + " " + error;
                    alert(str);
                    logerror('-10', 'chklogin.php', str);
                });
        });

    document.querySelectorAll('form').forEach(form => {    
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                errore = false;
                //alert("prima di validate");
                // Esegui la validazione del form qui. Assicurati che la funzione validate() ora accetti un elemento form HTML
                document.querySelectorAll('select, input').forEach(tb => {
                    tb.value = tb.value.trim();
                    if (!tb.value && !tb.disabled) {
                        if(!errore)
                            alert("Inserire tutti i dati richiesti");
                        errore = true; return false;
                    }
                });
                if (!errore && document.getElementById('pswAdm').value !== document.getElementById('rpswAdm').value) {
                    alert("I campi Password e Ripeti password dell'Account Amministratore devono contenere lo stesso valore");
                    errore = true; return false;
                }
                if (errore) return false;

                //SE la validazione form è OK
            
                if(inst)
                    inst.setAttribute('disabled', true);
                document.getElementsByClassName('progress')[0].style.visibility = 'visible';
                document.getElementById('msgProgress').style.visibility = 'visible';
                if (inst.value == 'Installa' || !count) start();
                else if (resume == 1) progress();
                else if (resume == -2) finish();
                else alert("Errore non identificato!\n");
            });

        async function start() {
            dati = new FormData(document.getElementById('formsetup'));
            //aggiumgo i campi non abilitati
            dati.append('SubDROOT', document.getElementById('myRoot').value);
            dati.append('resume', resume);
            let dbe = document.getElementById('dbEx');
            dati.append('DBEX', dbe.checked);

            var object = {}
            for (var [key, value] of dati.entries()) { 
                object[key] = value
            }

            console.log(JSON.stringify(object))

            //dati = 'DBMS=' + dbv + '&HOST=' + hostv + '&DB=' + dbv + '&DBEX=' + $('#dbEx').is(':checked') + '&USN=' + usnv + '&PSW=' + pswv + '&resume=' + resume + '&SubDROOT=' + myrv +
            //    '&MAIL=' + $('#emailLink').val() + '&SOCIAL=' + $('#socialLink').val() + '&WEB=' + $('#webLink').val();
            let promo1 = await fetch(apiBaseUrl + '/setup/start', {
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
                inst.value = 'Riprova';
                inst.removeAttribute('disabled');
                resume = -1;
                logerror('-2', 'start.php', str);
                return null;
                });

            //console.log('aspetto che la promessa risolva');
            let result = await promo1;
            if (result != null) { 
            //console.log('promessa risolta ');
            let str = JSON.stringify(result);
            //console.log(str);
            if (str.substring(0, 2) === '->') { //se errore in start.php
                alert('Errore 000-1: ' + str);
                inst.value = 'Riprova';
                inst.removeAttribute('disabled');
                resume = -1;
                logerror('-1', 'start.php', str);
            }
            else {
                resume = 0; //Eventuale errore nel file php è stato corretto
                arrayFiles = [...result];       //operatore ... spread copia il vettore result in arrayFiles
                totFiles = arrayFiles.length;
                document.getElementById('msgProgress').value="Inizializzazione completata...";
                progress();
                }
            }
        }  //fine start()


        function progress() {
            let dati;
            if (count == 1) {
                dati = 'MAILAD=' + document.getElementById('mailAdm').value + '&PSWAD=' + document.getElementById('pswAdm').value + '&resume=' + resume;
            } else {
                dati = 'resume=' + resume;
            }

            fetch(apiBaseUrl + '/' + arrayFiles[count], {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: dati
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(result => {
                    if (result.substring(0, 2) === '->') {
                        let str = 'Errore ' + arrayFiles[count].substring(7, 11) + ": " + result;
                        alert(str);
                        document.getElementById('installa').removeAttribute('disabled');
                        document.getElementById('installa').value = "Riprova";
                        resume = 1;
                        logerror(count, arrayFiles[count], str);
                    } else {
                        let percent = Math.round(((++count) / totFiles * 100.0)) + "%";
                        document.getElementById('myBar').style.width = percent;
                        document.getElementById('myBar').innerHTML = percent;
                        document.getElementById('msgProgress').textContent = result;
                        if (count == 1) document.getElementById('dbEx').setAttribute('disabled', true); // dopo creazione prima tabella DB non si può più cambiare
                        resume = 0; // Eventuale errore nel file php è stato corretto
                        if (count < totFiles) progress();
                        else finish();
                    }
                })
                .catch(error => {
                    let str = 'Errore ' + arrayFiles[count].substring(7, 11) + ': ' + error.message;
                    alert(str);
                    document.getElementById('installa').removeAttribute('disabled');
                    document.getElementById('installa').value = "Riprova";
                    resume = 1;
                    logerror(count, arrayFiles[count], str);
                });
        } //fine progress()

        //// scrive setup = 1 (installazione completata) nel file config.ini.php
        function finish() {
            fetch(apiBaseUrl + "/setup/finish", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: "resume=" + resume
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(result => {
                    if (result.substring(0, 2) === '->') {
                        let str = 'Errore 000-3: ' + result;
                        alert(str);
                        document.getElementById('installa').removeAttribute('disabled');
                        document.getElementById('installa').value = "Riprova";
                        resume = -2;
                        logerror('', 'finish.php', str);
                    } else {
                        document.getElementById('login').style.display = "block";
                        document.getElementById('installa').style.display = "none";
                        document.getElementById('msgProgress').textContent = "Installazione completata.";
                    }
                })
                .catch(error => {
                    let str = 'Errore 000-4: ' + error.message;
                    alert(str);
                    document.getElementById('installa').removeAttribute('disabled');
                    document.getElementById('installa').value = "Riprova";
                    resume = -2;
                    logerror('', 'finish.php', str);
                });
        } //fine finish()
    }); // fine $("form").submit
    });
    }
}



</script>