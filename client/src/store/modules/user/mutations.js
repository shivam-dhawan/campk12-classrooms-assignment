export default {
  setUserProfile (state, { userProfile, userType }) {
    state.userProfile = { ...userProfile, userType };
  },
  setUserAuthToken (state, { authToken, userId }) {
    state.authToken = authToken;
    state.userProfile.id = userId;
  },
  unsetUserProfile (state) {
    state.userProfile = {
      fullName: '',
      email: '',
      id: null,
      userType: null
    };
  },
  unsetUserAuthToken (state) {
    state.authToken = null;
  },
  setStudents (state, students) {
    state.students = students;
  },
  setTeachers (state, teachers) {
    state.teachers = teachers;
  },
  unsetStudents (state) {
    state.students = [];
  },
  unsetTeachers (state) {
    state.teachers = [];
  },
  addStudent(state, student) {
    const oldState = state.students;
    if(!oldState.some(user => user.id === student.id))
      oldState.push(student);
    state.students = oldState;
  },
  removeStudent(state, student) {
    const index = state.students.findIndex(function(user){ return user.id === student.id; });
    if(index >= 0)
      state.students.splice(index, 1);
  },
  addTeacher(state, teacher) {
    const oldState = state.teachers;
    if(!oldState.some(user => user.id === teacher.id))
      oldState.push(teacher);
    state.teachers = oldState;
  },
};
