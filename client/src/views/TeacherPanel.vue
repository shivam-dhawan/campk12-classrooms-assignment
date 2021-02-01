<style scoped lang="scss" src="../assets/scss/App.scss"></style>

<template>
  <div class="student">
    <h1>Teacher Panel</h1>
    <h3 v-if="teacher">{{ teacher.email }}</h3>
    <div v-if="teacher" class="search-card">
      <SearchCard :onSuccess="joinRoom" v-if="!roomId"></SearchCard>
      <div v-else class="flex col">
        <div class="flex row centered">
          <button @click="startClass">Start Class</button>
          <button @click="endClass">End Class</button>
        </div>
        <div class="flex row">
          <div class="w-50">
            Students:
            <div v-for="student in students" :key="student.id" class="mb-10">
              {{ student.email }}
            </div>
          </div>
          <div class="w-50">
            Teachers:
            <div v-for="teacher in teachers" :key="teacher.id" class="mb-10">
              {{ teacher.email }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="login-form">
      <LoginForm :userType="USER_TYPE_TEACHER"></LoginForm>
    </div>
  </div>
</template>

<script>
import LoginForm from "../components/LoginForm/LoginForm.vue";
import SearchCard from "../components/SearchCard/SearchCard.vue";
import getSocketInstance from "../utils/getSocketInstance.js";
import { USER_TYPE_TEACHER } from "../constants";

export default {
  name: "TeacherPanel",
  components: {
    LoginForm,
    SearchCard,
  },
  props: {},
  data() {
    return {
      socket: null,
      roomId: null,
    };
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
    teachers() {
      return this.$store.state.user.teachers;
    },
    students() {
      return this.$store.state.user.students;
    },
  },
  methods: {
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    },
    joinRoom({ classroom, students, teachers }) {
      this.roomId = classroom.roomId;
      this.$store.commit("setStudents", students);
      this.$store.commit("setTeachers", teachers);
      this.socket = getSocketInstance(this.roomId);
      this.bindEvents();
    },
    bindEvents() {
      this.socket.on("classEnded", () => {
        console.log("Class Ended");
      });
      this.socket.on("userConnected", (data) => {
        console.log("Connected: ", data);
        // Add this user to the list
      });
      this.socket.on("userDisconnected", (data) => {
        console.log("Disconnected: ", data);
        // Remove this user from the list
      });
    },
    startClass() {
      this.socket.emit("startClass");
    },
    endClass() {
      this.socket.emit("endClass");
    },
  },
};
</script>
