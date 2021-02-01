import store from '../store/index.js';

export default function(text, timeout=5000, isError=true) {
  store.commit('openInfoPopup', { text: text, isError: isError, timeout: timeout });
}