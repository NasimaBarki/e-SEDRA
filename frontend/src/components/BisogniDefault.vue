<script setup>
import Templatedftbisogno from './Templatedftbisogno.vue';
import Templateaccgradbis from './Templateaccgradbis.vue';
import Templatetablebis from './Templatetablebis.vue';
</script>

<template>
<section class="container mt-3" id="defaultbisogni">
    <h2>{{ h2 }}</h2>
    <blockquote class="blockquote">
        <p class="alert alert-primary col-md-12 text-center" role="alert">
            {{ titlePage }}
        </p>
    </blockquote>
    <hr />
    <div class="row justify-content-evenly">
        <Templatedftbisogno  :titleAcc='titleAcc' :confirmButton='false' :revisionsect='true' :topics='topics' />
        <div class="table-div col-lg-8 mb-3 mt-3">
            <div id="infoMessaggedx" class="my-callout d-none"></div>
                <Templateaccgradbis v-if="config.BallottaggioBis == 2" />
                <Templateaccgradbis v-if="config.gradDefBisogni == 1" />
                <Templatetablebis :posts="posts"/>
        </div>
    </div>
</section>	
</template>

<script>
import axios from 'axios'

export default {
    props: ['posts', 'titlePage', 'h2', 'conambito', 'topics'],
    data() {
        return {
            config: {},
            titleAcc: 'Vedi bisogno'
        }
    },
    async mounted() {
        await this.getConfigData(),

        ready(function () {
        var collapsableBis;

        async function call_ajax_edit_bis(bis, crud) {
            //console.log(bis);
            setHidden(bis);
            var pub = 0;
            var data = new FormData;
            data.append("idBis", bis);
            data.append("pub", pub);  //ZERO PER TUTTI I BISOGNI PUBBLICATI E NON
            let promo = fetch(apiBaseUrl + '/getsinglebisogno', {
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
                    //console.log("promessa fallita view bisogni");
                    return null;
                }
            );
            //console.log('aspetto che la promessa risolva');

            let result = await promo;
            if (result) {
                //console.log(result);
                showBisogno(result, crud);
                //accord.show();
            }
        }

        function showBisogno(bis, crud) {
    document.getElementById("hidden_post_id").value = bis['idBs'];
    /*  console.log("valore di hidden ", bis['idBs']);*/
    document.getElementById("titleBis").value = bis['titleBis'];
    document.getElementById("textBis").value = bis['textBis'];
    document.getElementById("topic_id").value = bis['ambito'];
    if (bis['moreambito'] != "") {
        document.getElementById("moreambito").value = bis['moreambito'];
        if (document.getElementById("divmoreinfo").classList.contains('invisible')) {
            //alert('ero invisibile');
            document.getElementById("divmoreinfo").classList.remove('invisible');
            //document.getElementById("divmoreinfo").classList.add('visible');
            //alert('ora divento visibile perch� ce more');
        }
    }
    else {
        if (!document.getElementById("divmoreinfo").classList.contains('invisible')) {
            //document.getElementById("divmoreinfo").classList.remove('visible');
            document.getElementById("divmoreinfo").classList.add('invisible');
        }
    }
    var ndr = document.getElementById("NdR");
    if (ndr)
        ndr.value = bis['rev'];
    var pb = document.getElementById("publish");
    if (pb) {
        pb.checked = bis['pubblicato'];
        toggleBtnPub();
    }
    var fsForm = document.getElementById("fsForm");
    /*     var fsDatiPro = document.getElementById("fsDatiPro");*/
    var fsRev = document.getElementById("fsRev");
    let cp = document.getElementById("confirmBis");

    if (crud == 'U') {
        abilitaFS(fsForm, true);
        vediPulsante(cp, true);
        if (pb.disabled) pb.removeAttribute('disabled');
        cp.value = "Conferma Dati";
        settaTitleAccordion("btnAccBis", "Modifica Bisogno");
    }
    if (crud == 'D') {
        abilitaFS(fsForm, false);
        abilitaFS(fsRev, true);
        pb.setAttribute('disabled', true);
        cp.value = "Cancella";
        vediPulsante(cp, true);
        settaTitleAccordion("btnAccBis", "Cancella Bisogno");
    }
    if (crud == 'R') {
        abilitaFS(fsForm, true);
        abilitaFS(fsRev, true);
        cp.value = "Conferma Dati";
        vediPulsante(cp, true);
        if (pb.disabled) pb.removeAttribute('disabled');
        settaTitleAccordion("btnAccBis", "Revisiona Bisogno");
    }
    if (crud == 'V' || bis['deleted'] == 1) {
        abilitaFS(fsForm, false);
        abilitaFS(fsRev, false);
        vediPulsante(cp, false);
        settaTitleAccordion("btnAccBis", "Vedi Bisogno");
    }

    collapsableBis.show();
    //var fieldsetBis = document.getElementById("fsForm");
    //if (!mod || bis['deleted'] == 1) {
    //    fieldsetBis.disabled = 'disabled';
    //    //    if(revBis)
    //    //        revBis.style.display = 'none';
    //}
    //else fieldsetBis.removeAttribute('disabled');
}

        let sezB = document.getElementById("collapseBis");
        if (sezB) {
            collapsableBis = new bootstrap.Collapse(sezB, { toggle: false });
        }

        var lsb = document.querySelectorAll('.linkstylebutton');
        if (lsb) {
            for (let i = 0; i < lsb.length; i++) {
                lsb[i].addEventListener("mouseover", (e) => { e.target.style.cursor = 'pointer'; });
                lsb[i].addEventListener("click", (e) => { call_ajax_edit_bis(e.target.dataset.idbis, 'V'); });     //false disabilita i campi });
            }
        }
    })
    },
    methods: {
        async getConfigData() {
            let res = await axios.get(this.apiBaseUrl + '/config')
            this.config = JSON.parse(res.data)
        },
    }
}
</script>