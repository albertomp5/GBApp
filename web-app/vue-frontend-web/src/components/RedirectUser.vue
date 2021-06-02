<template>
  <h1>Cargando...</h1>
</template>

<script>
export default {
  name: "RedirectUser",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    currentUserIsAdmin() {
      if (this.currentUser.roles.includes("ROLE_ADMIN")) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    if (!this.currentUserIsAdmin) {
      this.$router.push("/profile");
    }
    var searchString = this.$route.params.searchString;
    this.$router.push("/buscador-usuarios/" + searchString);
  },
};
</script>