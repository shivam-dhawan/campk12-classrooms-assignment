<style scoped lang="scss" src="../assets/scss/App.scss"></style>

<template>
  <div class="student">
    <h1>Student Panel</h1>
    <h3 v-if="student">{{ student.email }}</h3>
    <div v-if="student" class="search-card">
      <SearchCard></SearchCard>
    </div>
    <div v-else class="login-form">
      <LoginForm :userType="USER_TYPE_STUDENT"></LoginForm>
    </div>
  </div>
</template>

<script>
import LoginForm from "../components/LoginForm/LoginForm.vue";
import SearchCard from "../components/SearchCard/SearchCard.vue";
import { USER_TYPE_STUDENT } from "../constants";

export default {
  name: "StudentPanel",
  components: {
    LoginForm,
    SearchCard,
  },
  props: {},
  data() {
    return {};
  },
  computed: {
    USER_TYPE_STUDENT() {
      return USER_TYPE_STUDENT;
    },
    student() {
      const user = this.$store.state.user.userProfile;
      if (user && user.userType === USER_TYPE_STUDENT) return user;
      return null;
    },
  },
  methods: {
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    },
  },
};
</script>
