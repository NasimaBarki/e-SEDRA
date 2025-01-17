<template>
<div id="infoMessagge" class="my-callout d-none"></div>

<div class="card w-100 ">
<!--con h-100 si allunga come quella dei commenti-->
<div class="card-header">
    <h4>
        Graduatoria
    </h4>
</div>

<div class="card-body">
    <!-- {{ chkVal }} -->
    <table id="tableSt" class="table table-responsive mb-3" name="tableStelle">
        <tr>
            <th><small>Stelle</small></th>
            <th><small>N</small></th>
            <th><small>di</small></th>
            <th><small>Max</small></th>
        </tr>
        <template v-for="i = 1 in 10">
            <tr v-bind:id="'r' + i" v-bind:class="getRowClass(i)">
            
            <td>
                <span>&nbsp;</span>
                <span  style='color:orange'>
                    <template v-for="j = 1 in i">&#x2605;</template></span>
            </td>
            <td v-bind:id="'s' + i">
                {{ chkVal[i][1] }}
            </td>
            <td>di</td>
            <td>
                <template v-if="grad">{{ chkVal[i][0] }}</template>
                <template v-else>&#8734;</template>
            </td>
        </tr>
        </template>
    </table>
</div>
<div class="card-footer">      
    <small class="text-muted text-end">           
    </small>
</div>
</div>
</template>

<script>

export default {
    props: ['grad', 'votbp', 'user', 'chkVal'],
    methods: {
        getRowClass (i) {
      let className = ''
      if (this.chkVal && this.chkVal[i]) {
        const [max, total] = this.chkVal[i]
        if (max == 0) {
          className = 'not-aval'
        } else if (max == total) {
          className = 'completed'
        }
      }
      return className
    }
    }
}
</script>