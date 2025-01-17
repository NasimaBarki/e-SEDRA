<template>
<section class="container mt-3" id="singlepostb">
    <h2 >
        <template v-if="VDbisogni.blogAct">
            Discussione Bisogni
        </template>
        <template v-else>
            Discussione Bisogni non attivata
        </template>
    </h2>
    <hr />
    <div class="m-auto sticky-bottom">
        <a href="#" @click="$router.go(-1)" id="backPage" class="btn btn-primary">
            <span class="bi bi-chevron-left"></span>
        </a>
    </div>
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-2 justify-content-evenly mb-3">
      
        <div class="col-sm-6 mb-3">
            <div class="card w-100 ">
                <!--con h-100 si allunga come quella dei commenti-->
                <div class="card-header">
                    <h4>
                        {{ post.ambitoName }}
                    </h4>
                </div>
                <div class="card-body">
                    <h5 class="card-title">
                        {{ post.titleBis }}
                    </h5>
                    <h6 class="card-subtitle mb-2 text-muted">
                        {{ autore.fullName }}
                    </h6>
                    <p class="card-text">
                        {{ post.textBis }}
                    </p>
                </div>
                <ul class="list-group list-group-flush">
                    <template v-if="VDbisogni.IamAuthor">
                        <li v-if="VDbisogni.blogAct" class="list-group-item text-center">
                                <button type="button" class="btn icona" data-bs-toggle="tooltip" title="LIKE" id="btnlike" v-bind:value="lk" name="btnlike">
                                    <span v-if="lk < 2" class="bi bi-heart-fill"></span>
                                    <span v-else class="bi bi-heart"></span>
                                </button>
                            </li>
                            <li v-if="VDbisogni.votAct" class="list-group-item text-center">
                            <input type="hidden" class="provafunz" v-bind:id="'idBs' + post['idBs']" v-bind:value="post['idBs']" />
                            <my-rating class="rating" max-value="10" v-bind:value="post['grade']"></my-rating>
                        </li>
                    </template>
                   
                    <li class="list-group-item text-start">
                        <form id="formCommento" action="" method="POST">
                            <input type="hidden" id="idOrigin" name="idOrigin" v-bind:value="post['idBs']" />
                            <template v-if="VDbisogni.IamAuthor && VDbisogni.blogAct">
                                <input type="checkbox" class="btn-check" id="btnCom" name="btnCom" autocomplete="off" data-bs-toggle="collapse" data-bs-target="#collapseRispondi" />
                            <label class="btn btn-outline-primary" for="btnCom">
                                <span class="bi bi-person-rolodex"></span>&nbsp;Aggiungi un commento ...
                            </label>

                            <div class="collapse mb-3 text-end" id="collapseRispondi">
                                <div class="form-floating col-12">
                                    <input type="text" class="form-control mb-2 mt-2" name="testoCommento" id="testoCommento" />
                                    <label for="testoCommento" class="form-label">Commento</label>
                                </div>
                                <input type="submit" id="pubblicaComm" class="btn btn-primary btn-sm" name="pubblicaComm" value="Pubblica"  />
                            </div>
                            </template>
                        </form>
                    </li>

                </ul>
                
            </div>
            <div id="infoMessagge" class="my-callout d-none"></div>
            <!--sposto qui gli altri bisogni nello stesso ambito-->

                </div> <div class='col-sm-6 mb-3'>
                


        </div>

        <template v-if="comments">
            <div class="col-sm-6 mb-3">
            <div class="card w-100 h-100">
                <!--contenitore con la card dei commenti-->
                <div class="card-header">
                    <h4>
                        Commenti:&nbsp;{{ totalCom }}
                    </h4>
                </div>
                <div class="card-body scrollable h-100" id="cardCommenti">
                    <fieldset id="tutticomm" :disabled="!VDbisogni.IamAuthor">
                        <template v-for="cmn in comments">
                        <div v-bind:class="'card w-100 ' + segnComRiabi(cmn)" v-bind:id="'Commento' + cmn['idBl']">
                            <!--card commento principale-->
                            <div class="card-header">
                                <h6 class="card-subtitle text-end">
                                    {{ cmn.acognome }} {{ cmn.anome }}
                                    <span class="text-muted text-end small">
                                        &nbsp;&nbsp;
                                        {{ new Date(cmn.dtIns).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '') }}
                                    </span>
                                </h6>

                            </div>
                            <div :class="['card-body ', cmn.nobutton ? 'my-blog' : '']" v-bind:id="'bodycard' + cmn['idBl']">
                 
                                <div class="col-sm-12 justify-content-start">
                                    {{ cmn.content }}
                                </div>
                                <div class="col-sm-12 mt-0" :id="'accordionRispCom' + cmn['idBl']">
                                    <div :class="'row ' + dNone(cmn.nobutton)">
                                        <div class="col-12 mb-0 text-md-end">
                                            <input type="checkbox" class="btn-check" title="Rispondi" :id="'toggleRisp' + cmn['idBl']" autocomplete="off" data-bs-toggle="collapse" v-bind:data-bs-target="'#collapseInsCom' + cmn['idBl']"  />
                                            <label class="btn btn-outline-primary" :for="'toggleRisp'+ cmn['idBl']">
                                                <span class="bi bi-reply"></span>
                                            </label>
                                                <input type="checkbox" class="btn-check signalBtn " data-bs-toggle="tooltip" title="Segnala" :id="'btnSegnala' + cmn['idBl']" autocomplete="off" />
                                                <label class="btn btn-outline-primary" :for="'btnSegnala' + cmn['idBl']">
                                                    <span v-if="cmn.stato == 1" class='bi bi-hand-thumbs-down-fill'></span>
                                                    <span v-else class='bi bi-hand-thumbs-down'></span><!--bi bi-hand-thumbs-down-->
                                                </label>
                                            </div>
                                        <!--</div>-->
                                    </div>

                                    <div :id="'collapseInsCom' + cmn['idBl']" class="collapse container mt-1" aria-labelledby="">
                                        <form :id="'formRisposta' + cmn['idBl']" action="" method="POST">
                                            <input type="hidden" :id="'idBl' + cmn['idBl']" name="idBl" value="<?php echo $cmn['idBl'];?>" />
                                            <input type="hidden" name="idOrigin" v-bind:value="post['idBs']" />
                                            <div class="row justify-content-evenly">
                                                <div class="form-floating col-10 mb-0">
                                                    <input type="text" class="form-control mb-1" name="testoCommento" id="testoRisposta<?php echo $cmn['idBl'];?>" />
                                                    <label for="testoRisposta<?php echo $cmn['idBl'];?>" class="form-label">Risposta</label>
                                                </div>
                                                <div class="form-floating col-2 text-md-end">
                                                    <input type="submit" id="rispostaCommento<?php echo $cmn['idBl'];?>" data-idpadre="<?php echo $cmn['bisogno'];?>" class="btn btn-primary btn-sm mb-3 publicBtn" name="rispostaCommento" value="Pubblica" />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div class="container">
                                <template v-for="risp in cmn.answ">

                                <div :class="'card w-100 h-100 ' + segnComRiabi(risp)" id="Risposta<?php echo $risp['idBl'];?>">
                                    <div class="card-header">
                                        <h6 class="card-subtitle ">
                                            {{ risp.anome }} {{ risp.acognome }}
                                            <span class="text-muted text-start small">
                                                &nbsp;&nbsp;
                                                
                                            </span>
                                        </h6>

                                    </div>
                                    <div :class="'row card-body ', cmn.nobutton ? 'my-blog' : ''" id="bodycard<?php echo $risp['idBl'];?>">

                                        <div class="col-sm-2 <?php if($risp['nobutton'] || $riabiR) echo ' d-none';?>">
                                            <input type="checkbox" class="btn-check signalBtn" data-bs-toggle="tooltip" title="Segnala" id="btnSegnala<?php echo $risp['idBl'];?>" autocomplete="off" />
                                            <label class="btn btn-outline-primary" for="btnSegnala<?php echo $risp['idBl'];?>">
                                                <span class='bi bi-hand-thumbs-down-fill'></span><span class='bi bi-hand-thumbs-down'></span><!--bi bi-hand-thumbs-down-->
                                            </label>
                                        </div>
                                        <div class="col-sm-10 justify-content-start">
                                            
                                        </div>

                                    </div>
                                </div><!--card risposta-->
                                </template>
                            </div>
                        </div>
                    </template>
                    </fieldset>
                </div>
            </div>
        </div>
        </template>
        
        <!--</div>-->
    </div>

</section>
</template>

<script>
import axios from 'axios'

export default {
    props: ['id'],
    data() {
        return {
            VDbisogni: {},
            field: 'pubblicato',
            anonim: true,
            lk: 0,
            post: {},
            autore: {},
            comments: null,
            contComm: 0,
            answers: {},
            totalCom: 0
        }
    },
    mounted() {
//         var old = alert;

// alert = function() {
//   console.log(new Error().stack);
//   old.apply(window, arguments);
// };
document.onreadystatechange = () => {
        if (document.readyState == "complete") {
            import('../js/singlepostB')
            import('../assets/js/functions')
        }}
        
        window.currentUser = JSON.parse(localStorage.getItem('user'))
        this.setup()
    },
    methods: {
        dNone(value) {
            if(value)
                return 'd-none'
            else
                return ''
        },
        segnComRiabi(cm) {
            if(cm) {
                if (cm.stato == 1)
                return 'signal-warning'
            else if(cm.stato == 2)
                return 'signal-riabi'
            }
            return ''
        },
        async setup() {
            this.VDbisogni = JSON.parse(localStorage.getItem('VDbisogni'))
            if(this.VDbisogni.ballottaggio)
                field = 'ingrad'

            let obj = {}
            obj.idB = this.id
            obj.field = this.field
            obj.anonim = this.anonim
            obj.userId = JSON.parse(localStorage.getItem('user')).idUs

            let res = await axios.post(this.apiBaseUrl + '/getOnePublishBisWithGrade', {data: JSON.stringify(obj)})
            this.post = res.data

            delete obj.field
            delete obj.anonim
            obj.idUs = obj.userId
            delete obj.userId
            obj.at = this.VDbisogni.from
            res = await axios.post(this.apiBaseUrl + '/getMyLikeB', {data: JSON.stringify(obj)})
            if(res.data.length > 0)
                this.like = 1
            else
                this.like = 2

            if(this.anonim) {
                delete obj.at
                res = await axios.post(this.apiBaseUrl + '/getAutore', {data: JSON.stringify(obj)})
                this.autore = res.data
            }

            if(this.VDbisogni.blogAct) {
                obj = {}
                obj.ib = this.id
                obj.table = 'blogB'
                obj.campo = 'bisogno'
                res = await axios.post(this.apiBaseUrl + '/getAllCommentsNotCanceled', {data: JSON.stringify(obj)})
                this.comments = res.data
                this.contComm = this.comments.length

                res = await axios.post(this.apiBaseUrl + '/getAllAnswersNotCanceled', {data: JSON.stringify(obj)})
                this.answers = res.data
                this.totalCom = this.contComm + this.answers.length

                for(let cm in this.comments) {
                    if(this.comments[cm].autore == JSON.parse(localStorage.getItem('user')).idUs)
                        this.comments[cm].nobutton = true
                    else 
                        this.comments[cm].nobutton = false
                    this.comments[cm].answ = []
                }
            }
        }
    }
}
</script>