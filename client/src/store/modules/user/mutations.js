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
  }
};