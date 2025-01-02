<template>
    <fieldset id="templateruoli" class="mb-3 border border-primary rounded px-3">
    <p class="col-form-label">{{ title }}</p>
    <!--TODO: <?php echo $title?> -->
    <!--<div class="col-md-1"></div>-->
    <div class="col-md-10">
        <!---->
        <div id="TR" class="mb-3" name="TR">
            <!--TR#-->
            <!--col-12-->
            <!-- <?php foreach($roles as $role)
                  {
                      $na='_'.$role['idRl'];
            ?> -->
            <!--</br>-->
            <template v-for="ruolo in ruoli">
                <div v-if="ruolo['primario'] == 1" class="form-check">                                                                    
                    <!--                                                                                                                                                                                                                                                <?php echo (($role['chk'])?'checked':'')?> -->
                    <input v-bind:data-nomeRuolo="ruolo['ruolo']" type="checkbox" class="form-check-input ruoliprimari" data-bs-toggle="collapse" v-bind:data-bs-target="'#dv_' + ruolo['idRl']" v-bind:data-lui="'_' + ruolo['idRl']" v-bind:name="'rp_' + ruolo['idRl']" v-bind:id="'rp_' + ruolo['idRl']" v-bind:value="ruolo['idRl']" :checked="ruolo.chk ? true : false"/>
                    <label class="form-check-label" v-bind:for="'rp_' + ruolo['idRl']">
                        {{ ruolo['ruolo'] }}
                    </label>
                </div>

                <div class="collapse container col-md-9 mb-3 " v-bind:id="'dv_' + ruolo['idRl']" v-bind:name="'dv_' + ruolo['idRl']">
                                <div v-for="sub in ruolo['sub']" class="form-check form-check-inline">                                    
                                    <!--                                                                                                                                                                         <?php if(isset($s['chk'])) echo (($s['chk'])?' checked':'')?> -->
                                    <input v-bind:data-nomeRuolo="sub['S']" type="checkbox" class="form-check-input ruolisec" v-bind:id="'rsec_' + ruolo['idRl'] + '_' + sub['idS']" v-bind:name="'rsec_' + ruolo['idRl'] + '_' + sub['idS']" v-bind:value="sub['idS']" :checked="sub.chk ? true : false"/>
                                    <label class="form-check-label" v-bind:for="'rsec_' + ruolo['idRl'] + '_' + sub['idS']">
                                        {{ sub['S'] }}
                                    </label>
                                </div>
                                <!-- <?php  -->
                            <!-- }  -->
                        <!-- } //sottoruoli?> -->
                </div>
            </template>

            <!-- <?php } //ruoli?> -->
        </div>
    </div>
</fieldset>
</template>

<script>

export default {
    props: ['title', 'ruoli']
}
</script>