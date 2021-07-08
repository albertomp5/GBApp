<template>
  <div>
    <!--TOCAR CSS Y ESTA TEMPLATE-->
    <div v-if="progressInfos">
      <div
        class="mb-2"
        v-for="(progressInfo, index) in progressInfos"
        :key="index"
      >
        <span>{{ progressInfo.fileName }}</span>
        <div class="progress">
          <div
            class="progress-bar progress-bar-info"
            role="progressbar"
            :aria-valuenow="progressInfo.percentage"
            aria-valuemin="0"
            aria-valuemax="100"
            :style="{ width: progressInfo.percentage + '%' }"
          >
            {{ progressInfo.percentage }}%
          </div>
        </div>
      </div>
    </div>

    <label class="btn btn-default">
      <input type="file" multiple @change="selectFile" />
    </label>

    <v-btn class="primary" :disabled="!selectedFiles" @click="uploadFiles">
      Upload
    </v-btn>

    <div v-if="message" class="alert alert-light" role="alert">
      <ul>
        <li v-for="(ms, i) in message.split('\n')" :key="i">
          {{ ms }}
        </li>
      </ul>
    </div>
    <div class="card">
      <div class="card-header">Imágenes:</div>
      <div v-if="fileInfos.length===0">No hay imágenes.</div>
      <v-carousel v-if="fileInfos.length>0" cycle show-arrows-on-hover>
        <v-carousel-item
          v-for="(file, index) in fileInfos"
          :key="index"
          :src="'https://gbapp.ddns.net/static/usuarios/' + file.name"
          contain
          reverse-transition="fade-transition"
          transition="fade-transition"
        >
          <v-btn class="error" @click="deleteFile(file.name)">
            Borrar imagen
          </v-btn>
        </v-carousel-item>
      </v-carousel>
    </div>
  </div>
</template>

<script>
import UserService from "../services/user.service";

export default {
  name: "upload-files",
  data() {
    return {
      selectedFiles: undefined,
      progressInfos: [],
      message: "",

      fileInfos: [],
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    UserService.getFiles(this.currentUser.id).then((response) => {
      this.fileInfos = response.data;
    });
  },
  methods: {
    selectFile() {
      this.progressInfos = [];
      this.selectedFiles = event.target.files;
    },
    upload(idx, file) {
      this.progressInfos[idx] = { percentage: 0, fileName: file.name };

      UserService.upload(file, this.currentUser.id, (event) => {
        this.progressInfos[idx].percentage = Math.round(
          (100 * event.loaded) / event.total
        );
      })
        .then((response) => {
          let prevMessage = this.message ? this.message + "\n" : "";
          this.message = prevMessage + response.data.message;

          return UserService.getFiles(this.currentUser.id);
        })
        .then((files) => {
          this.fileInfos = files.data;
        })
        .catch(() => {
          this.progressInfos[idx].percentage = 0;
          this.message = "Could not upload the file:" + file.name;
        });
    },
    uploadFiles() {
      this.message = "";

      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    },
    deleteFile(filename) {
      UserService.deleteFile(filename, this.currentUser.id).then((response) => {
        console.log(response);
        UserService.getFiles(this.currentUser.id).then((response) => {
          this.fileInfos = response.data;
        });
      });
    },
    downloadFile(filename) {
      UserService.downloadFile(filename).then((response) => {
        console.log(response);
        this.imageBytes = response.data;
        console.log(this.imageBytes);
      });
    },
  },
};
</script>
