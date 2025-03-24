import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import { iconsSet as icons } from '@/assets/icons'
import DocsExample from '@/components/DocsExample'
import CIcon from '@coreui/icons-vue'
import CoreuiVue from '@coreui/vue'



import axios from 'axios'


axios.defaults.baseURL = 'http://localhost:3030'  //local
// axios.defaults.baseURL = 'https://backendManage.dktimeh.com'  //hosting


const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  // const decodedPayload = decodeJWTTH(token);
  // app.config.globalProperties.$permissionsToken = decodedPayload.permissions || '';
  // app.config.globalProperties.$userID = decodedPayload.id || '';
}

// const decodeJWTTH = (token) => {
//   const base64Url = token.split('.')[1]
//   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
//   var payload = decodeURIComponent(
//     atob(base64)
//       .split('')
//       .map(function (c) {
//         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
//       })
//       .join(''),
//   )
//   return JSON.parse(payload)
// }
//   // const token = localStorage.getItem('token')
//   let permissionsToken = ''
//   let localUserID = ''
//   if (token) {
//     const decodedPayload = decodeJWTTH(token)
//     permissionsToken = decodedPayload.permissions
//     localUserID = decodedPayload.id
//     localStorage.setItem('localUserid', localUserID)
//     console.log("permissions:", permissionsToken);
//     // console.log('localUserID:', localUserID)
//   } else {
//     console.log('Token not found')
//   }
// // console.log(permissionsToken);


const app = createApp(App)
app.use(createPinia())

app.use(router)


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; 
    if (Date.now() >= exp) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      return next('/login');
    }
  }
  next();
});

app.use(CoreuiVue)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsExample', DocsExample)
app.mount('#app')
app.config.globalProperties.$axios = axios










