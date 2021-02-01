<style scoped lang="scss" src="../assets/scss/App.scss"></style>

<template>
  <div class="student">
    <h1>Teacher Panel</h1>
    <h3 v-if="teacher">{{ teacher.email }}</h3>
    <div v-if="teacher" class="search-card">
      <SearchCard></SearchCard>
    </div>
    <div v-else class="login-form">
      <LoginForm :userType="USER_TYPE_TEACHER"></LoginForm>
    </div>
  </div>
</template>

<script>
import LoginForm from "../components/LoginForm/LoginForm.vue";
import SearchCard from "../components/SearchCard/SearchCard.vue";
import { USER_TYPE_TEACHER } from "../constants";

export default {
  name: "TeacherPanel",
  components: {
    LoginForm,
    SearchCard,
  },
  props: {},
  data() {
    return {};
  },
  computed: {
    USER_TYPE_TEACHER() {
      return USER_TYPE_TEACHER;
    },
    teacher() {
      const user = this.$store.state.user.userProfile;
      if (user && user.userType === USER_TYPE_TEACHER) return user;
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
