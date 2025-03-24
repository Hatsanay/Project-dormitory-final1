// // stores/user.js
// import { defineStore } from 'pinia';
// import { decodeJWTTH } from '../router/auth';

export const useUserStore = defineStore('user', {
  state: () => ({
    userID: '',
  }),
  actions: {
    async initializeAuth() {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedPayload = decodeJWTTH(token);
        this.userID = decodedPayload.id || '';
        console.log("userID from store:", this.userID); // ตรวจสอบว่ามีการตั้งค่า userID ถูกต้อง
        return this.userID;
      }
    },
  },
});
