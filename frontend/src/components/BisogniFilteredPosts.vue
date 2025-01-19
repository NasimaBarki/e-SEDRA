<template>
<h5 class="mt-3">
        {{ fambito }}
    </h5>
    <hr />
    <!--<div class="container">-->
        <!-- content -->
        <!--<div class="content">-->        
            <div class="row card_container mb-3"><!--row-cols-1 row-cols-md-3 g-4--> 
                    <template v-for="spost in similposts">
                    <div v-if="spost" class="col-6 mb-2">
                        
                            <div class="card w-100 h-100 ">
                                    <div class="card-body bisassociati">

                                        <h6 class="card-title">
                                            {{ spost.titleBis }}
                                        </h6>
                                        <p class="card-text">
                                            <a href="" class="linkstylebutton text-decoration-none stretched-link" data-idbis="<?php echo $spost['idBs'];?>">
                                                <template v-if="spost['textBis'].length > 80">
                                                    {{ spost['textBis'].split(0, 80) }}...
                                                </template>
                                                <template v-else>
                                                    {{ spost['textBis'] }}
                                                </template>
                                            </a>
                                        </p>
                                    </div>
                            
                                <!--<div class="card-footer">
                                    <small class="text-muted">
                                        <?php 
                                        //echo date("d-m-Y H:i", strtotime($spost["dtIns"])); ?>
                                    </small>
                                </div>-->
                            </div>
                       
                    </div>                   
                </template>
            </div>
</template>

<script>
import axios from 'axios'

export default {
    props: ['ambitoName', 'ambito', 'idB', 'field'],
    data() {
        return {
            topic_id: {},
            similposts: [],
            fambito: ''
        }
    },
    mounted() {
        this.setup()
    },
    methods: {
        async setup() {
            if(this.ambito) {
                this.topic_id = this.ambito
                let obj = {}
                obj.am_id = this.topic_id
                obj.field = this.field || 'pubblicato'
                
                let res = await axios.post(this.apiBaseUrl + '/getPublishedPostsByTopic', {data: JSON.stringify(obj)})
                this.similposts = res.data

                let savek
                for(let sp in this.similposts) {
                    if(this.similposts[sp].idBs == this.idB)
                        savek = sp
                }

                delete this.similposts[savek]

                if(this.similposts.length != 0)
                    this.fambito = 'Altri in: ' + this.ambitoName
            }
        }
    }
}
</script>