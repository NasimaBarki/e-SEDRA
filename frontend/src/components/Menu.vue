<template>
    <header id="header" class="fixed-top  bg-primary">
    <div class="container d-flex align-items-center">

        <a class="logo me-auto">
            <img id="appText" src="../assets/images/esedratext1.png" title="logoEsedra" />
            <!--<a href="index.html">e-SEDRA</a>-->
        </a>
        <a class="logo me-auto">
            <img src="../assets/images/logo.png" alt="" class="img-fluid" />
        </a>

        <nav id="navbar" class="navbar order-last order-lg-0">
            <!--<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu" aria-controls="navbarMenu" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>-->
            <!--<div class="mainMenu" id="navbarMenu">-->
            <ul>
                <!-- <?php if(isset($_SESSION['user'])) { 
                          $mact=$_SESSION['user']['menuAct'];
                          // myfunctiontest();?> -->
                <li>
                    <router-link to='/' text-decoration-none>Home</router-link>
                    <!-- <a class="<?php if($mact == 0) echo 'active'; ?> text-decoration-none" href="pages/home.php" id="0">Home</a> -->
                </li>
                <li>
                    <a class="<?php if($mact == 1) echo 'active'; ?> text-decoration-none" href="pages/bisognibase.php" id="1">Bisogni</a>
                </li>
                <li>
                    <a class="<?php if($mact == 2) echo 'active'; ?> text-decoration-none" href="pages/propostebase.php" id="2">Proposte</a>
                </li>
                <!-- <?php 
                if(array_key_exists(1, $_SESSION['user']['roles'])) { //utente è amministratore
                ?> -->
                <li class="dropdown">
                    <a href="javascript:void(0);" class="no_link text-decoration-none">
                        <span>Configurazione</span><i class="bi bi-chevron-down"></i>
                    </a>
                    <ul>
                        <li>
                            <a class="<?php if($mact == 3) echo 'active'; ?> text-decoration-none" href="adminsez/admin/admconfgen.php" id="3">Generale</a>
                        </li>
                        <li>
                            <a class="<?php if($mact == 4) echo 'active'; ?> text-decoration-none" href="adminsez/admin/admconfact.php" id="4">Attivit&agrave;</a>
                        </li>
                        <li>
                            <router-link to='/topic' text-decoration-none>Ambiti</router-link>
                            <!-- <a class="<?php if($mact == 5) echo 'active'; ?> text-decoration-none" href="adminsez/admin/topics.php" id="5">Ambiti</a> -->
                        </li>
                        <li>
                            <a class="<?php if($mact == 6) echo 'active'; ?> text-decoration-none" href="adminsez/admin/users.php" id="6">Utenti</a>
                        </li>
                        <li>
                            <a class="<?php if($mact == 7) echo 'active'; ?> text-decoration-none" href="adminsez/admin/admlogs.php" id="7">LogFile</a>
                        </li>
                    </ul>
                </li>
                <!-- <?php } 
                      }?>

                <?php if(isset($_SESSION['user'])) {?> -->

                <li class="dropdown">
                    <a href="javascript:void(0);" class="no_link text-decoration-none">
                        <i class="bi bi-person-fill"></i>
                        <span>
                            <!-- &nbsp;<?php echo $_SESSION['user']['nome'].' '.$_SESSION['user']['cognome'];?> -->
                        </span>
                    </a>
                    <ul>
                        <!--<li>
                            <a class="text-decoration-none" href="pages/revisore.php" id="8">Revisione</a>
                        </li>-->
                        <li>
                            <a class="<?php if($mact == 8) echo 'active'; ?> text-decoration-none" href="pages/profile.php" id="8">Profilo</a>
                        </li>
                        <li>
                            <a class="text-decoration-none" href="include/logout.php" id="m_logout">Esci</a>
                        </li>
                    </ul>
                </li>
            </ul>
            <i class="bi bi-list mobile-nav-toggle" id="mobileMenu"></i>
            <!-- <?php } ?> -->
        </nav><!--.navbar-->
        <!-- <?php if(!isset($_SESSION['user'])) {?>   
            <a href="" id="logButton" class="text-decoration-none"><span class="bi bi-box-arrow-in-right"></span>&nbsp;Accedi</a>
        <?php }?>-->
  
    </div>
</header>
</template>