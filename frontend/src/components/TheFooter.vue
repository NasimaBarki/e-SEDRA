<template>
<footer class="footer mt-auto text-center text-white bg-primary">          
    <div class="container pt-2"> 
        <section class="mb-2">
            <!-- mail to -->
            <!-- TODO: href='<?php echo "mailto:". $_SESSION['ini']['posta']; ?>' -->
            <a class="btn btn-outline-light btn-floating m-1" role="button">
                <i class="fa fa-envelope"></i>
            </a>

            <!-- Instagram -->     
            <!-- TODO: href='<?php echo $_SESSION['ini']['social']; ?>'                                 attenzione a cosa mettere di prefisso -->
            <a class="btn btn-outline-light btn-floating m-1" role="button">
                <i class="fab fa-instagram"></i>
            </a>

            <!-- Instagram -->
            <!-- TODO: href='<?php echo "https://". $_SESSION['ini']['web']; ?>' -->
            <a class="btn btn-outline-light btn-floating m-1" role="button">
                <i class="fas fa-globe"></i>
            </a>
            <a class="btn btn-outline-light btn-floating m-1" href="http://itacavercelli.it/omnicrazia" role="button">
                <i class="fab fa-github"></i>
            </a>
        </section>
    </div>
    <!-- Grid container -->

    <!-- Copyright  -->
    <div class="footercopy text-center  p-3">
        Sviluppato da:
        Dipartimento di Informatica - IIS LOMBARDI <a class="text-white text-decoration-none" href="http://nuke.itisvc.it/"> (sede ITI Faccio) Vercelli</a>
        <br />Ultimo aggiornamento: Febbraio 2024
    </div>
    <!-- Copyright -->
</footer>
</template>