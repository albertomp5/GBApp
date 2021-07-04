<template>
  <div>
    <!-- Cambiar img src -->
    <article class="actividad-item" id="actividad-template">
      <div class="image-wrap">
        <img
          :src="require('../assets/gbapp1.png')"
          alt="Tipo1"
          width="128"
          height="166"
        />
      </div>
      <h2>Matrícula tipo 1</h2>
      <h6>Gym: 3/semana</h6>
      <h6>Actividades: 2 actividades/mes</h6>
      <span class="date"> <strong>19,99€/mes</strong></span>
      <div class="clearfix"></div>
    </article>
    <article class="actividad-item" id="actividad-template">
      <div class="image-wrap">
        <img
          :src="require('../assets/gbapp1.png')"
          alt="Tipo2"
          width="128"
          height="166"
        />
      </div>
      <h2>Matrícula tipo 2</h2>
      <h6>Gym: 4/semana</h6>
      <h6>Actividades: 3 actividades/mes</h6>
      <span class="date"> <strong>29,99€/mes</strong></span>
      <div class="clearfix"></div>
    </article>
    <article class="actividad-item" id="actividad-template">
      <div class="image-wrap">
        <img
          :src="require('../assets/gbapp1.png')"
          alt="Tipo3"
          width="128"
          height="166"
        />
      </div>
      <h2>Matrícula tipo 3</h2>
      <h6>Lo que quiera siempre que se respete el aforo</h6>
      <span class="date"> <strong>39,99€/mes</strong></span>
      <div class="clearfix"></div>
    </article>
    <!-- <v-container class="my-5">
      <v-layout row >
        <v-flex xs12 md6 >
          <v-btn outlined block color="primary">word</v-btn>
        </v-flex>
      </v-layout>
    </v-container> -->
  </div>
</template>

<script>
export default {
  name: "Matriculas",
};
</script>

<style>
.actividad-item{
    width: 100%;
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
    padding-top: 20px;
    text-align: left;
}

.actividad-item .image-wrap {
    width: 130px;
    height: 130px;
    overflow:hidden;
    float:left;
    margin-right: 15px;
    border: 1px solid #ccc;
}

.actividad-item .image-wrap img{
    height: 100%;
    text-align: center;
}

.actividad-item h2{
    display: block;
    width:100%;
    padding: 0px;
    margin: 0px;
    margin-bottom: 7px;
}

.actividad-item .date{
    display: block;
    width: 100%;
    color: rgb(122, 122, 122);
}

.actividad-item a{
    display: block;
    color: #444;
    text-decoration: none;
    margin-top: 10px;
}

.actividad-item a:hover{
    text-decoration: underline;
}

.clearfix{
    clear:both;
    float:none;
}
</style>
