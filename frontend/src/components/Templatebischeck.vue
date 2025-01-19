<template>
    <fieldset id="templatebis" class="mb-3 border border-secondary rounded px-3">
      <legend class="col-form-label">Bisogni correlati alla proposta:</legend>
      <div class="col-md-10">
        <div 
          v-for="bis in bisogni" 
          :key="bis.idBs" 
          class="overflow-auto mb-2" 
          style="max-width: 350px; max-height: 200px;">
          <div class="form-check">
            <!-- Dynamically bind to the checkbox with v-model -->
            <input 
              type="checkbox" 
              class="form-check-input chkbis" 
              :name="'b' + bis.idBs" 
              :value="bis.idBs" />
            <label class="form-check-label" :for="'b' + bis.idBs">
              {{ bis.titleBis }}
            </label>
          </div>
        </div>
      </div>
    </fieldset>
  </template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            fieldb: 'pubblicato',
            bisogni: null
        }
    },
    async mounted() {
        await this.setup()
    },
    methods: {
        async setup() {
            let obj = {}
            obj.field = this.fieldb

            let res = await axios.post(this.apiBaseUrl + '/getSummaryBis', {data: JSON.stringify(obj)})
            this.bisogni = res.data
        }
    }
}
</script>