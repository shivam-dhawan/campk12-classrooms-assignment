import { User } from '../../../services/user';

const handleError = err => {
  console.log('Error in Login action : ', err);
  if (err && err.error)
    console.log('error', err.error.message ? err.error.message : 'Oops something went wrong');
  else
    console.log('error', 'Oops something went wrong');
};

export default {

  LOGINUSER: async ({ commit }, payload) => {
    try {
      const result = await User.userLogin(payload);
      if (result) {
        commit('setUserAuthToken', { authToken: result.authToken, userId: result.data.id });
        commit('setUserProfile', { userProfile: result.data, userType: payload.userType });
        if (result.authToken) {
          window.localStorage.setItem('authToken', result.authToken);
          window.localStorage.setItem('userId', result.data.id);
        }
        return result;
      }
    } catch (error) {
      throw error;
    }
  },

  LOGOUTUSER: async ({ commit }, payload) => {
    try {
      const result = await User.logoutUser(payload);
    } catch (error) {
    }
    finally {
      commit('unsetUserProfile');
      commit('unsetUserAuthToken');
      // TODO: Remove other details
      window.localStorage.removeItem('authToken');
      window.localStorage.removeItem('userId');
      return true;
    }
  },

  JOINROOM: async ({ commit }, roomId) => {
    try {
      const result = await User.joinRoom(roomId);
      return result;
    } catch (error) {
      throw error;
    }
  },

  CHECKAUTH: async ({ commit }) => {
    try {
      const authToken = window.localStorage.getItem('authToken');
      const userId = window.localStorage.getItem('userId');
      if (!authToken) return false;
      commit('setUserAuthToken', { authToken, userId });
      return true;
    } catch (error) {
      throw error;
    }
  }
};
