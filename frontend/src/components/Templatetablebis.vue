<template>
    <table class="table align-middle" id="Bistable">
      <thead>
        <tr>
          <th>N</th>
          <th>Titolo</th>
          <!--<th>Ambito</th>-->
          <th>Voti</th>
          <th>
            <i class="bi bi-heart-fill"></i>
          </th>
          <th>Data Revisione</th>
          <th>Note Revisore</th>
          <th>Stato</th>
        </tr>
      </thead>
  
      <tbody>
        <!-- If posts are available -->
        <tr v-if="posts.length > 0" v-for="(post, index) in posts" :key="post.idBs">
          <td>{{ index + 1 }}</td>
          <td>
            <button 
              type="button" 
              class="linkstylebutton btn btn-outline-primary text-start" 
              :data-idbis="post.idBs"
              :value="post.idBs"
            >
              {{ post.titleBis }}
            </button>
          </td>
          <!--<td>
            {{ post.ambito ? post.ambito : '--' }}
          </td>-->
          <td>
            {{ post.grade != null ? post.grade : '--' }}
          </td>
          <td>
            {{ post.nlike != null ? post.nlike : '-' }}
          </td>
          <td>
            {{ post.dtRev ? new Date(post.dtRev).toLocaleString('it-IT') : 'NR' }}
          </td>
          <td>
            {{ post.rev || '--' }}
          </td>
          <td>
            <i :class="{
              'bi bi-check-square': post.pubblicato,
              'bi bi-trash3': post.deleted === 1,
              'bi bi-x-circle-fill': !post.pubblicato && post.deleted !== 1
            }"></i>
          </td>
        </tr>
        <!-- If no posts available -->
        <tr v-else>
          <td colspan="7" class="alert alert-primary col-md-12 mt-3 text-center">
            Nessun bisogno da visualizzare
          </td>
        </tr>
      </tbody>
    </table>
  </template>
  
  <script>
  export default {
    props: ['posts'],
    mounted() {
        console.log(this.posts)
    }
  };
  </script>
  