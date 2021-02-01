import store from '../store';

const isAuthenticated = () => {
  const userId = store.state.user.authToken;
  return userId !== null;
};

export default isAuthenticated;
