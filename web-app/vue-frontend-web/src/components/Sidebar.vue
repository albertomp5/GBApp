<template>
  <div>
    <v-form>
      <v-text-field
        v-model="searchString"
        append-icon="search"
        label="Search user"
        single-line
        hide-details
        @keydown.enter="goSearch()"
        @click:append="goSearch()"
      ></v-text-field>
    </v-form>
    <hr />
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      searchString: null,
    };
  },
  methods: {
    goSearch() {
      this.$router.push("/redirect-user/" + this.searchString);
    },
  },
};
</script>

<style>
#sidebar {
  width: 25%;
  float: left;
}

.sidebar-item {
  background: #f7f7f7;
  padding: 20px;
  margin-top: 30px;
}
</style>