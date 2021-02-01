import axios from 'axios';
import store from '../../store';
import { API_URL } from './apiUrl';
import logout from '../../utils/logout';
import openInfoPopup from '../../utils/openInfoPopup';

axios.interceptors.response.use(
  res => res,
  err => {
    if(!err.response) {
      openInfoPopup("Something broke. Let us fix it real soon!")
    }
    else if (err.response.status === 401) {
      logout();
    }
    else if (err.response.status >= 500) {
      openInfoPopup("Something broke. Let us fix it real soon!")
    }
    return err;
  }
);

const _authorizationHeaders = () => {
  return {
    Authorization: store.state.user.authToken
      ? store.state.user.authToken
      : '',
    'Content-Type': 'application/json'
  };
};

const handleError = err => {
  console.log('Api call error in services -> request.js : ', err);
  if (err.status)
    // logout if unauthorized
    if (err.status === 401)
      logout();
};

export const getRequest = async (url, headers = _authorizationHeaders()) => {
  try {
    let res = await axios.get(API_URL + url, {
        headers: Object.assign({}, headers)
      });
    if(res.status === 200)
      return res.data.result ? res.data.result : res.data;
    else if(res.response)
      throw new Error(res.response.data.message);
    else
      throw new Error("Something Broke.");
  } catch (err) {
    handleError(err);
    return null;
  }
};

export const getListRequest = async (
  url,
  headers = _authorizationHeaders()
) => {
  try {
    let res = await axios
      .get(API_URL + url, {
        headers: Object.assign({}, headers)
      });
    if(res.status === 200)
      return res.data.result ? res.data.result : res.data;
    else if(res.response)
      throw new Error(res.response.data.message);
    else
      throw new Error("Something Broke.");
  } catch (err) {
    handleError(err);
    return null;
  }
};

export const postRequest = async (
  url,
  data = {},
  headers = _authorizationHeaders()
) => {
  try {
    let res = await axios({
      url: API_URL + url,
      method: 'POST',
      headers: Object.assign({}, headers),
      data
    });
    if(res.status === 200)
      return res.data.result ? res.data.result : res.data;
    else if(res.response)
      throw new Error(res.response.data.message);
    else
      throw new Error("Something Broke.");
  } catch (err) {
    return Promise.reject(err.message);
  }
};

export const putRequest = async (
  url,
  data = {},
  headers = _authorizationHeaders()
) => {
  try {
    let res = await axios({
      url: API_URL + url,
      method: 'PUT',
      headers: Object.assign({}, headers),
      data
    });
    if(res.status === 200)
      return res.data.result ? res.data.result : res.data;
    else if(res.response)
      throw new Error(res.response.data.message);
    else
      throw new Error("Something Broke.");
  } catch (err) {
    return Promise.reject(err.message);
  }
};

export const patchRequest = async (
  url,
  data = {},
  headers = _authorizationHeaders()
) => {
  try {
    let res = await axios({
      url: API_URL + url,
      method: 'PATCH',
      headers: Object.assign({}, headers),
      body: JSON.stringify(data)
    });
    if(res.status === 200)
      return res.data.result ? res.data.result : res.data;
    else if(res.response)
      throw new Error(res.response.data.message);
    else
      throw new Error("Something Broke.");
  } catch (err) {
    return Promise.reject(err.message);
  }
};

export const deleteRequest = async (url, headers = _authorizationHeaders()) => {
  try {
    let res = await axios({
      url: API_URL + url,
      method: 'DELETE',
      headers: Object.assign({}, headers)
    });
    if(res.status === 200)
      return res.data.result ? res.data.result : res.data;
    else
      throw new Error(res.message);
  } catch (err) {
    return Promise.reject(err.message);
  }
};

export const Api = {
  deleteRequest,
  getListRequest,
  getRequest,
  postRequest,
  putRequest,
  patchRequest
};
