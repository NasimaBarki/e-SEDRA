<template>
<section class="container" id="logs">
    <h2 class="page-title mt-3">Registro accessi</h2>
    <hr />

    <div class="row justify-content-evenly">
 
     <!--<div class="col-md-6 mt-3">-->
        
         <!--</div>-->
           
            <div class="col-3 text-start">
                <nav aria-label="Page navigation">
                    <ul class="pagination justify-content-center">
                        <li class="page-item">
                            <button type="button" class="page-link" id="backP" aria-label="Previous">
                                <span aria-hidden="true" class="bi bi-arrow-left-square"></span>
                            </button>
                        </li>
                        <li class="page-item">
                            <a class="page-link disable" tabindex="-1">
                                Accessi: <span id="utenti_totali">
                                    {{tot}}
                                </span>
                            </a>
                        </li>
                        <li class="page-item">
                            <button type="button" class="page-link" id="nextP" href="" aria-label="Next">
                                <span aria-hidden="true" class="bi bi-arrow-right-square"></span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        <div class="col-4"></div>
<!-- TODO:                                              action='adminsez/admin/writelogs.php' -->
        <form method='POST' class="row g-3 text-end col-5">
            <!--<input type='submit' value='Export' name='Export' />-->
            <div class="col-md-6">
                <input @click="callWriteLogs" class="btn btn-primary" value="Esporta registrazioni" />
            </div>
            <div class="col-md-6">
                <input @click="callDeleteLogs" class="btn btn-primary" id="delLog" value="Elimina registrazioni">
            </div>
        </form>
</div>
    <hr />
            <div class="table-responsive mt-3 mb-3">
                <table id="Utable" class="table table-striped table-sm">
                    <!---->
                    <thead>
                        <tr>
                            <!--<th scope="col">id</th>-->
                            <th scope="col">Utente</th>
                            <th scope="col">Ruolo</th>
                            <th scope="col">e-mail</th>
                            <th scope="col">Data Login</th>
                            <th scope="col">Data Logout</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider ">
                        <!-- <?php
                        foreach($result as $row) {
                            $dfi = $row["dtE"];
                            if ($row["dtE"] == "")
                                $dfi = "...";
                            echo "<tr><td>" . $row["cognome"] . " " . $row["nome"] . "</td><td>" . $row["ruolo"] . "</td><td>" . $row["email"] . "</td><td>". $row["dtS"] . "</td><td>" . $dfi . "</td></tr>";
                        }
                        ?> -->
                        <template v-for="accesso in accessi">
                            <tr>
                                <td>{{ accesso.cognome }} {{ accesso.nome }}</td>
                                <td>{{ accesso.ruolo }}</td>
                                <td>{{ accesso.email }}</td>
                                <td>{{ accesso.dtS }}</td>
                                <td v-if="accesso.dtE">{{ accesso.dtE }}</td>
                                <td v-else>...</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
        </div>
       
</section>
</template>

<script>
import axios from 'axios'

import { config } from '../../config'

export default {
    data() {
        return {
            tot: 0,
            accessi: undefined
        }
    },
    mounted()
    {
        this.fetchLogs()
    },
    methods:
    {
        async fetchLogs() {
            let res = await axios.get(this.apiBaseUrl + '/getLogData')
            this.tot = Object.keys(res.data).length
            this.accessi = res.data
            
            return this.apiBaseUrl
        },
        callWriteLogs() {

            axios.get(this.apiBaseUrl + '/writelogs')
            .then(
                response => {
                    let blob = new Blob([response.data], { type: 'application/pdf' })
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)

                    let filename = response.headers['content-disposition'].split('filename=')[1].split(';')[0]
                    link.download = filename.substring(1, filename.length-1)
                    link.click()
                }
            )
        },
        async callDeleteLogs() {
            let res = await axios.post(this.apiBaseUrl + '/deletelogs')
            window.location.reload()
        }
    }
}
</script>