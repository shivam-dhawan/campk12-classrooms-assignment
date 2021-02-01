import { Api } from './config/request';

export const userLogin = ({ user, userType }) => {
  return Api.postRequest('auth/', {
    user,
    userType
  });
};

export const logoutUser = () => {
  return Api.postRequest('auth/logout', { });
};

export const joinRoom = roomId => {
  return Api.postRequest(`classroom/${roomId}/join/`, {});
}

export const User = {
  userLogin,
  logoutUser,
  joinRoom,
};
