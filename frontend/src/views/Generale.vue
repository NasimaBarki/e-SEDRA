<template>
<section class="container" id="settings">
<h2 class="page-title mt-3">Configurazione generale</h2>
<hr />


<!--<section class="page" id="settings">-->
<!--<div class="spanAll flexWrap">-->
    <div class="row justify-content-evenly">
        <div class="form-floating col-md-4">           
            <select class="form-select inputcfg" id="scPsw" name='scPsw'>
                <option value="0" :selected="config.scPsw == 0" @click="postConfig">Mai</option>
                <option value="3" :selected="config.scPsw == 3" @click="postConfig">3 mesi</option>
                <option value="6" :selected="config.scPsw == 6" @click="postConfig">6 mesi</option>
                <option value="9" :selected="config.scPsw == 9" @click="postConfig">9 mesi</option>
                <option value="12" :selected="config.scPsw == 12" @click="postConfig">12 mesi</option>
                <option value="18" :selected="config.scPsw == 18" @click="postConfig">18 mesi</option>
                <option value="24" :selected="config.scPsw == 24" @click="postConfig">24 mesi</option>
            </select>
             <label class="form-label" for="scPsw">Scadenza password</label>
        </div>
   
       <div class="form-floating col-md-4">

           <!--                                                               <?php if($_SESSION['ini']['scPsw']==0) echo ' disabled';?>  -->
            <select class="form-select inputcfg" id="ggMsgPsw" name="ggMsgPsw" >
                <option value="0" :selected="config.ggMsgPsw == 0">Non avvisare</option>
                <option value="5" :selected="config.ggMsgPsw == 5">5 giorni</option>
                <option value="10" :selected="config.ggMsgPsw == 10">10 giorni</option>
                <option value="15" :selected="config.ggMsgPsw == 15">15 giorni</option>
                <option value="20" :selected="config.ggMsgPsw == 20">20 giorni</option>
                <option value="25" :selected="config.ggMsgPsw == 25">25 giorni</option>
                <option value="30" :selected="config.ggMsgPsw == 30">30 giorni</option>
                <option value="35" :selected="config.ggMsgPsw == 35">35 giorni</option> 
            </select>
            <label class="form-label" for="ggMsgPsw">Preavviso scadenza password</label>
         </div>
    
      <div class="form-floating col-md-4">
       
        <select class="form-select inputcfg" id="scTkn" name="scTkn">
            <option value="0" :selected="config.scTkn == 0">Nessuna scadenza</option>
            <option value="1" :selected="config.scTkn == 1">1 ora</option>
            <option value="2" :selected="config.scTkn == 2">2 ore</option>
            <option value="3" :selected="config.scTkn == 3">3 ore</option>
            <option value="6" :selected="config.scTkn == 6">6 ore</option>
            <option value="12" :selected="config.scTkn == 12">12 ore</option>
            <option value="24" :selected="config.scTkn == 24">24 ore</option>
            <option value="48" :selected="config.scTkn == 48">48 ore</option>
        </select>
           <label class="form-label" for="scTkn">Validita' token</label>
    </div>
</div>
<hr />
<div class="row justify-content-evenly">
    
    <!--<div class="col-md-1"></div>-->
    <!-- Middle form - to create and edit  -->
 <!--<div class="row col-md-6 mt-3">-->

<!--<div class="spanAll flexWrap">-->
     <div class="form-floating col-md-6">      
        <input class="form-control" id="emailNoRep" type="email" name="emailNoRep" v-model="config.emailNoRep" />
     <label class="form-label" for="emailNoRep">Email no-reply (no-reply@dominio.it)</label>
     </div>
  <div class="form-floating col-md-6">    
        <select class="form-select inputcfg" id="delLog" name='delLog'>
            <option value="0" :selected="config.delLog == 0">Non mantenere</option>
            <option value="3" :selected="config.delLog == 3">3 mesi</option>
            <option value="6" :selected="config.delLog == 6">6 mesi</option>
            <option value="12" :selected="config.delLog == 12">12 mesi</option>
            <option value="18" :selected="config.delLog == 18">18 mesi</option>
            <option value="24" :selected="config.delLog == 24">2 anni</option>
            <option value="36" :selected="config.delLog == 36">3 anni</option>
            <option value="60" :selected="config.delLog == 60">5 anni</option>
        </select>
        <label class="form-label" for="delLog">Mantieni registrazioni di log</label>
    </div>  
</div>
    <hr />
 <!-- -------- GESTIONE RUOLI  -------- -->    
<!--<hr class="spanAll"/>-->

 <div class="row mt-3 "><!--justify-content-evenly-->
    <div class="col-md-4 mb-3">
       <!--<div class="mb-3">-->    
            <!-- <?php 
                //include_once ROOT_PATH.'/include/getruolitree.php';
            include_once ROOT_PATH . '/include/getruolitree.php';

            ?> -->
         <select id="listAllRoles" class="form-select" v-bind:size="resultSize">

            <template v-for="row in result">
                <option v-if="row.R"class='optionGroup' v-bind:value="row.idR">{{row.R}}</option>
                <template v-for="subrow in row.sub">
                    <option v-if="subrow.S" class='optionChild' v-bind:value="subrow.idS">{{subrow.S}}</option>
                </template>
            </template>
            <!-- <?php
            $ruolo = 1;
                foreach($result as $row){ 
                    if($ruolo != $row['idR']){
                        $ruolo = $row['idR'];
                        echo "<option class='optionGroup' value='{$row['idR']}'>{$row['R']}</option>";
                    }
                    if($row['S']) echo "<option class='optionChild' value='{$row['idS']}'>{$row['S']}</option>";
                }
            ?> -->
        </select>
         <!--</div>-->
    </div>
    <div class="col-md-2 mb-3">
            <button class="btn btn-primary updRuoli" id="delRole">Elimina Ruolo</button>
        </div>
    <div class="col-md-6">
       <div class="row">
        <!--<label class="form-label">Gestione Ruoli:</label>-->
        <div class="form-floating col-md-6">
            <input class="form-control" id="newRolePrim" type="text" />
             <label for="newRolePrim" class="form-label">Nuovo ruolo primario</label>
        </div>
        <div class="col-md-6">
            <button class="btn btn-primary updRuoli" id="insRolePrim">Crea Primario</button>
        </div>
        </div>
            <hr/>
        <div class="row">
        <div class="form-floating col-md-6 mb-3">
            <select id="listRolesSec" class="form-select">
            <!-- <?php 
                include_once ROOT_PATH.'/include/getruoliall.php'; 
                //echo '<option disabled selected style="color:gray;">Ruoli secondari</option>';
                foreach($resAllRoles as $row){ 
                    if(!$row['primario']){
                        echo "<option value='{$row['idRl']}'>{$row['ruolo']}</option>";
                    }
                }
            ?> -->
            <template v-for="row in roles">
                <option v-if="!row.primario" v-bind:value='row.idRl'>{{ row.ruolo }}</option>
            </template>

            </select>
             <label for="listRolesSec" class="form-label">Ruoli secondari</label>
        </div>
             
       <div class="col-md-6 mb-3">
             <button class="btn btn-primary updRuoli" id="addRoleSec">Assegna Secondario</button>
       </div>
       </div>
       <div class="row">
           <div class="form-floating col-md-6 mb-3">
                <input class="form-control" id="newRoleSec" type="text" />
                 <label for="newRoleSec" class="form-label">Nuovo ruolo secondario</label>
            </div>
           <div class="col-md-6 mb-3">
               <button class="btn btn-primary updRuoli" id="insRoleSec">Crea e Assegna Secondario</button>
           </div>
       </div>
      
        </div>
</div>
</section>
</template>

<script>
import axios from 'axios'
import { generaleScript } from '../js/confgenscript'
export default {
    data() {
        return {
            config: {},
            roles: undefined,
            result: undefined,
            resultSize: undefined,
            ruolo: undefined,
            updatedResult: undefined
        }
    },
    mounted() {
        document.onreadystatechange = () => {
        if (document.readyState == "complete") {
            console.log('confgenscript.js caricato')
            generaleScript(this.updateResult)
        }}

        this.getConfigData()
        this.getRuoli()
        this.getRuoliTree()
    },
    methods:
    {
        async getConfigData() {
            let res = await axios.get(this.apiBaseUrl + '/config')
            this.config = JSON.parse(res.data)
            // console.log(this.config)
        },
        async getRuoli() {
            let res = await axios.get(this.apiBaseUrl + '/getRuoliAll')
            this.roles = JSON.parse(res.data)
            // console.log('ALL RUOLI:\n', this.roles)
        },
        async getRuoliTree() {
            let res = await axios.get(this.apiBaseUrl + '/getRuoliTree')
            // this.result = JSON.parse(res.data)
            // this.resultSize = Object.keys(this.result).length
            // console.log(JSON.parse(res.data))

            let vett = []
            let sub = []
            let i = 0
            let j = 0
            let roleCount = 0
            for(const [key, value] of Object.entries(JSON.parse(res.data))) {
                let idR = value['idR']
                let R = value['R']

                if(this.ruolo != idR) {
                    this.ruolo = idR
                    vett[j] = {'idR': idR, 'R': R, 'sub': null}
                    
                    if(sub.length > 0) {
                        vett[j-1].sub = sub
                        sub = []
                    }
                    i = 0 
                    j++
                }
                if(value['S'] != null) {
                        let idS = value['idS']
                        let S = value['S']
                        sub[i] = {'idS': idS, 'S': S}
                        i++
                        roleCount++
                }
            }
            vett[j-1].sub = sub
            roleCount++

            // console.log('VETT\n', vett)
            this.result = vett
            console.log('Result: ', this.result)
            this.resultSize = roleCount
        },
        updateRuolo(nuovoRuolo) {
            this.ruolo = nuovoRuolo
        },
        postConfig(url, newData) {
            axios.post(this.apiBaseUrl + '/config/' + url, {data: newData})
        },
        updateResult(newResult) {
            this.roles = []
            for(const [key, value] of Object.entries(JSON.parse(newResult))) {
                this.roles.push(value)
            }

            this.getRuoliTree()
            console.log(this.roles)
            // TODO: modificare la lunghezza
        }
    }
}
</script>