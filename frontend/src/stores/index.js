// import { decodeJWTTH } from '@/path/to/your/utils';
// import { createStore } from 'vuex';
// import createPersistedState from 'vuex-persistedstate';

// export default createStore({
//   state: {
//     permissionsToken: '',
//     userID: '',
//   },
//   mutations: {
//     setPermissionsToken(state, token) {
//       state.permissionsToken = token;
//     },
//     setUserID(state, id) {
//       state.userID = id;
//     },
//   },
//   actions: {
//     async initializeAuth() {
//       const token = localStorage.getItem('token');
//       if (token) {
//         const decodedPayload = decodeJWTTH(token);
//         this.userID = decodedPayload.id || '';
//         console.log("userID from store:", this.userID);
//       }
//     },
//   },
//   getters: {
//     permissionsToken: (state) => state.permissionsToken,
//     userID: (state) => state.userID,
//   },
//   plugins: [createPersistedState()],
// });
