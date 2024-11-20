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
                                    <!-- <?php echo $tot;?> -->
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
        <form method='POST' class="row g-3 text-end col-5" action='adminsez/admin/writelogs.php'>
            <!--<input type='submit' value='Export' name='Export' />-->
            <div class="col-md-6">
                <input type="submit" class="btn btn-primary" value="Esporta registrazioni" />
            </div>
            <div class="col-md-6">
                <button class="btn btn-primary" id="delLog">Elimina registrazioni</button>
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
                    </tbody>
                </table>
        </div>
       
</section>
</template>