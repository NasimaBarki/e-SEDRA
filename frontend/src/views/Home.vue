<script setup>
import Banner from '../components/Banner.vue'
</script>

<template>

<Banner></Banner>
<section class="container-fluid">

<div class="content-wrapper m-3">
    <!-- Gallery -->
    <div class="row mb-3">
        <div id="accantologhi" class="col-md-6 d-flex align-items-center text-end">
            <h2>Partner del progetto:</h2>
        </div>
        <div id="loghi" class="col-md-6">
            <!-- Carosello con controlli Bootstrap -->
            <div id="carouseloghi" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img class="img-responsive d-block h-100" src="../assets/loghisponsor/logosanpaolo.webp" title="logoSanPaolo" />
                    </div>
                    <div class="carousel-item">
                        <img class="img-responsive d-block h-100" src="../assets/loghisponsor/logoitaca.webp" title="logoItaca" />
                    </div>
                    <div class="carousel-item">
                        <img class="img-responsive d-block h-100" src="../assets/loghisponsor/logovc.webp" title="logoVc" />
                    </div>
                    <div class="carousel-item">
                        <img class="img-responsive d-block h-100" src="../assets/loghisponsor/logoantidisc.webp" title="logoAntiDisc" />
                    </div>
                    <div class="carousel-item">
                        <img class="img-responsive d-block h-100" src="../assets/loghisponsor/logofcr.webp" title="logofcr" />
                    </div>
                    <div class="carousel-item">
                        <img class="img-responsive d-block h-100" src="../assets/loghisponsor/bancaitalia.webp" title="logoBancadItalia" />
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
<!--</div>-->
</section>
</template>

<script>
export default {
    inheritAttrs: false
}
</script>