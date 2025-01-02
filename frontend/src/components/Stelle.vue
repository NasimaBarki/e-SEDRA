<template>
<fieldset id="tuttestelle" class="mb-3 border border-danger rounded">
    <legend class="col-form-label">Numero max di scelte:</legend>
    <!--<div class="col-md-1"></div>-->
    <div class="col-md-10">
        <!---->
        <table id="tableStelle" class="mb-3" name="tableStelle">
           
            <tr v-for="i = 1 in 10">
                <td>
                    <input type="number" class="form-control star" v-bind:id="'val' + i" v-bind:name="'val'+ i" value="1" min="0" />
                </td>
                <td>
                    <span>&nbsp;</span>
                    <span style='color:orange'>&#x2605;</span>
                </td>
            </tr>
        </table>
    </div>
</fieldset>
</template>

<script>
    function checkedstelle(star,campo)       
    {
       /* console.log(star);*/
        for (let j in star) {
           /* console.log("j " + j);*/
            var ind = 'val' + star[j]['idstar'];  
           /* console.log('ind '+ind);*/
            document.getElementById(ind).value = star[j][campo];
        }
    }
   
</script>