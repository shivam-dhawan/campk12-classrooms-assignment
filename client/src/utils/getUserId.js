import store from '../store';

const getUserId = () => {
  const userId = store.state.user.userProfile.id;
  return userId || null;
};

export default getUserId;
