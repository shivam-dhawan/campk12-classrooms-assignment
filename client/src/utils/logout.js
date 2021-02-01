import store from "../store";

const logout = () => {
  // clears localStorage data
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
 
  store.commit('unsetUserProfile');
  store.commit('unsetUserAuthToken');

  if (window.location.pathname !== '/login')
    window.location = '/login';
};

export default logout;
