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
                    <template v-for="j = 1 in i">
                        <span>&nbsp;</span>
                        <span style='color:orange'>&#x2605;</span>
                    </template>
                </td>
            </tr>
        </table>
    </div>
</fieldset>
</template>