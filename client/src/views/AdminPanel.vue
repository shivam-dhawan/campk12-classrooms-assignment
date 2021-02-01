<style scoped lang="scss" src="../assets/scss/App.scss"></style>

<template>
  <div class="student">
    <h1>Admin Panel</h1>
    <h3 v-if="admin">{{ admin.email }}</h3>
    <div v-if="admin" class="search-card">
      <div class="search-component auth-form" v-if="!reports.length">
        <form @submit="getReports" novalidate="true">
          <div class="error" v-show="error.length">{{ error }}</div>
          <input
            type="text"
            name="roomId"
            placeholder="Classroom Id"
            v-model="roomId"
          />
          <button class="btn gradient-btn" type="submit">Get Report</button>
        </form>
      </div>
      <div v-else class="flex col">
        <div v-for="report in reports" :key="report.id" class="mb-10">
          {{ report.event }} - {{ getUserEmail(report.userId) }} -
          {{ new Date(report.createdAt).toISOString() }}
        </div>
      </div>
    </div>
    <div v-else class="login-form">
      <LoginForm :userType="USER_TYPE_ADMIN"></LoginForm>
    </div>
  </div>
</template>

<script>
import LoginForm from "../components/LoginForm/LoginForm.vue";
import SearchCard from "../components/SearchCard/SearchCard.vue";
import { USER_TYPE_ADMIN } from "../constants";

export default {
  name: "AdminPanel",
  components: {
    LoginForm,
    SearchCard,
  },
  props: {},
  data() {
    return {
      reports: [],
      roomId: null,
      error: "",
    };
  },
  computed: {
    USER_TYPE_ADMIN() {
      return USER_TYPE_ADMIN;
    },
    admin() {
      const user = this.$store.state.user.userProfile;
      if (user && user.userType === USER_TYPE_ADMIN) return user;
      return null;
    },
  },
  methods: {
    getUserEmail(user) {
      return user ? user.email : "";
    },
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    },
    async getReports(event) {
      event.preventDefault();
      try {
        const result = await this.$store.dispatch("GETREPORTS", {
          roomId: this.roomId,
        });
        this.reports = result.data.result;
        this.error = "";
      } catch (err) {
        if (typeof err === "object") err = err.message;
        this.error = err;
      }
    },
  },
};
</script>
