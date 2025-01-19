<template>
    <section class="container mt-3" id="discutiB">
      <h2>{{ Dbisogni.nome }}</h2>
  
      <!-- Blockquote with alert and active/inactive phase information -->
      <blockquote class="blockquote">
        <p class="alert alert-primary col-md-12 text-center" role="alert">
  
        <template v-if="Dbisogni.blogAct">
          Fase attiva dal
          {{ new Date(Dbisogni.dtStart).toLocaleString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }).replace(',', '') }}
          al
          {{ new Date(Dbisogni.dtStop).toLocaleString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }).replace(',', '') }}
          - Termina tra: <span id="demo">{{ Dbisogni.ggscad }}</span>
        </template>
  
        <template v-else>
          Fase non attiva
        </template>
    </p>
      </blockquote>
  
      <input type="hidden" id="scadenza" v-bind:value="Dbisogni['dtStop']" />
  
      <hr />
  
      <!-- Table Section -->
      <div class="row justify-content-evenly">
        <div class="col-md-12 mt-3">
          <div class="table-div mb-3">
            <!-- Info Message Area -->
            <div id="infoMessagge" class="my-callout d-none"></div>
  
            <!-- Data Table -->
            <table class="table align-middle" id="Disctable">
              <thead>
                <tr>
                  <th>N</th>
                  <th>Titolo</th>
                  <th>Testo</th>
                  <th>
                    <span class="bi bi-heart-fill"></span>
                  </th>
                </tr>
              </thead>
  
              <tbody>
                <!-- Loop through posts -->
                <tr v-for="(post, index) in Dposts" :key="post.idBs">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <input type="hidden" :id="'idBs' + post.idBs" :value="post.idBs" />
                    <button type="button" class="linkstylebutton btn btn-outline-primary text-start">
                      {{ post.titleBis }}
                    </button>
                  </td>
                  <td>
                    <span class="small">
                        <template v-if="post['textBis'].length > 150">
                            {{ post['textBis'].split(0, 150) }}...
                        </template>
                        <template v-else>
                            {{ post['textBis'] }}
                        </template>
                    </span>
                  </td>
                  <td>
                    <span v-if="post.nlike">{{ post.nlike }}</span>
                    <span v-else>-</span>
                  </td>
                </tr>
  
                <!-- No posts available message -->
                <tr v-if="Dposts.length === 0">
                  <td colspan="4" class="alert alert-primary col-md-12 mt-3 text-center">
                    Nessun bisogno da visualizzare
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    props: ['Dbisogni', 'Dposts'],
    mounted() {
        ready(function () {
            var defaultpage = 1;

            var disctable = document.querySelector('#Disctable');
            //console.log(disctable);
            disctable.addEventListener("click", (e) => {
                let elem = e.target;
                let span = null;
                if (elem.classList.contains("linkstylebutton")) {
                    //console.log('timer = ' + timer);

                    if (timer) {
                        clearInterval(timer);
                        //console.log('timer sospeso ' + timer);
                    }
                    //console.log('+ ' + elem.nodeName + ' ' + idBisogno + 'aut ' + auth + ' rev ' + rev);
                    refreshSinglePost(elem.dataset.idbis, defaultpage, 104)
                }
            });
            var fortimer = document.getElementById("scadenza");
            var dataFine = fortimer.value;
            dataFine = dataFine.replace(" ", "T");

            avviaContoAllaRovescia(dataFine, "demo");
            //console.log('timer avviato ' + timer);
        }); //end ready
    }
  }
  </script>
  