[1mdiff --git a/frontend/src/_nav.js b/frontend/src/_nav.js[m
[1mindex 303563e..f0b9b05 100644[m
[1m--- a/frontend/src/_nav.js[m
[1m+++ b/frontend/src/_nav.js[m
[36m@@ -32,7 +32,7 @@[m [mexport default [[m
       {[m
         component: 'CNavItem',[m
         name: 'ตั้งค่าโปรไฟล์',[m
[31m-        to: '#',[m
[32m+[m[32m        to: '/UserSetView',[m
       },[m
     ],[m
   },[m
[1mdiff --git a/frontend/src/components/AppSidebar.vue b/frontend/src/components/AppSidebar.vue[m
[1mindex eeac3e1..6497fc1 100644[m
[1m--- a/frontend/src/components/AppSidebar.vue[m
[1m+++ b/frontend/src/components/AppSidebar.vue[m
[36m@@ -1,8 +1,8 @@[m
 <script setup>[m
[31m-import { RouterLink } from 'vue-router'[m
[32m+[m[32mimport { RouterLink } from 'vue-router';[m
 [m
[31m-import { AppSidebarNav } from '@/components/AppSidebarNav.js'[m
[31m-import { useSidebarStore } from '@/stores/sidebar.js'[m
[32m+[m[32mimport { AppSidebarNav } from '@/components/AppSidebarNav.js';[m
[32m+[m[32mimport { useSidebarStore } from '@/stores/sidebar.js';[m
 [m
 const sidebar = useSidebarStore()[m
 </script>[m
[1mdiff --git a/frontend/src/router/index.js b/frontend/src/router/index.js[m
[1mindex 83ae047..d145de1 100644[m
[1m--- a/frontend/src/router/index.js[m
[1m+++ b/frontend/src/router/index.js[m
[36m@@ -18,6 +18,11 @@[m [mconst routes = [[m
         name: 'แจ้งซ่อมบำรุง',[m
         component: () => import('../views/user/UserReqView.vue'),[m
       },[m
[32m+[m[32m      {[m
[32m+[m[32m        path: '/UserSetView',[m
[32m+[m[32m        name: 'ตั้งค่า',[m
[32m+[m[32m        component: () => import('../views/user/UserSetView.vue'),[m
[32m+[m[32m      },[m
     ],[m
   },[m
   {[m
