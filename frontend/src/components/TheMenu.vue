<style>
@import url('../assets/css/menu.css');
</style>

<script setup>
import Login from './Login.vue'
</script>

<template>
<header id="header" class="fixed-top  bg-primary">
    <div class="container d-flex align-items-center">

        <a class="logo me-auto">
            <img id="appText" src="../assets/esedratext1.png" title="logoEsedra" />
        </a>
        <a class="logo me-auto">
            <img src="../assets/logo.png" alt="" class="img-fluid" />
        </a>

        <nav v-show="user" id="navbar" class="navbar order-last order-lg-0">
            <ul>
                <!-- TODO: <?php if(isset($_SESSION['user'])) {
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
                <!-- TODO: <?php
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
                            <router-link to='/ambiti' text-decoration-none>Ambiti</router-link>
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
                <!-- TODO: <?php }
                      }?> -->

                <!-- TODO: <?php if(isset($_SESSION['user'])) {?> -->

                <li v-if="user" class="dropdown">
                    <a href="javascript:void(0);" class="no_link text-decoration-none">
                        <i class="bi bi-person-fill"></i>
                        <span>
                            &nbsp;
                            {{ user.email }}
                            <!-- {{ user.nome }} {{ user.cognome }} -->
                            <!-- TODO: <?php echo $_SESSION['user']['nome'].' '.$_SESSION['user']['cognome'];?> -->
                        </span>
                    </a>
                    <ul>
                        <li>
                            <!-- <a class="<?php if($mact == 8) echo 'active'; ?> text-decoration-none" href="pages/profile.php" id="8">Profilo</a> -->
                            <router-link to='/profilo' id="8" text-decoration-none>Profilo</router-link>
                        </li>
                        <li>
                            <!--                             href="include/logout.php" -->
                            <a class="text-decoration-none" @click="logout" id="m_logout">Esci</a>
                        </li>
                    </ul>
                </li>
            </ul>
            <i class="bi bi-list mobile-nav-toggle" id="mobileMenu"></i>
            <!-- TODO: <?php } ?> -->
        </nav>
        <!-- TODO: <?php if(!isset($_SESSION['user'])) {?>   -->
            <a v-if="!user" href="#" id="logButton" class="text-decoration-none" @click="showHideLoginModal()"><span class="bi bi-box-arrow-in-right"></span>&nbsp;Accedi</a>
        <!-- TODO: <?php }?> -->
        <Login v-show="modal" :show-hide-login-modal = "showHideLoginModal"></Login>
    </div>
</header>
</template>

<script>
import { menuScript } from '../js/menu.js'
import { loginScript } from '../js/login.js'

import axios from 'axios'

export default {
    props: ['user'],

    data() {
        return {
            modal: false
        }
    },
    mounted() {
        document.onreadystatechange = () => {
        if (document.readyState == "complete") {
            console.log('menu.js e login.js caricati')
            menuScript()
            loginScript(this.updateUser)
        }}
    },
    methods:
    {
        showHideLoginModal()
        {
            this.modal = !this.modal
        },
        updateUser(newUser) {
            localStorage.setItem('user', JSON.stringify(newUser))
            this.$router.go()
        },
        logout() {
            console.log('logout')
            localStorage.removeItem('user')
            
            this.$router.push({ name: 'Home' }).then(() => {this.$router.go(0)})
        }
    }
}
</script>