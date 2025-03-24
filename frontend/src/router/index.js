import DefaultLayout from '@/layouts/DefaultLayout';
import { createRouter, createWebHashHistory } from 'vue-router';
import userDasboard from '../views/dashboard/Dashboard.vue';
import AddReqView from '../views/Request/UserAddReqView.vue';
import ReqView from '../views/Request/UserReqView.vue';
import EditResView from '../views/staticUsers/EditResView.vue';
import RegisResView from '../views/staticUsers/RegisResView.vue';
import ViewResView from '../views/staticUsers/ViewResView.vue';

import macMgnReqView from '../views/ManageRequets/macMgnReqView.vue';
import StaffMgnReqView from '../views/ManageRequets/StaffMgnReqView.vue';
import starffTimeReqView from '../views/ManageRequets/starffTimeReqView.vue';
import starffWithdrawReqView from '../views/ManageRequets/starffWithdrawReqView.vue';



import EditRoomView from '../views/staticRoom/EditRoomView.vue';
import RegisRoom from '../views/staticRoom/RegisRoom.vue';
import ViewRoomView from '../views/staticRoom/ViewRoomView.vue';

import EditUnitView from '../views/staticUnit/EditUnitView.vue';
import RegisUnit from '../views/staticUnit/RegisUnit.vue';
import ViewUnitView from '../views/staticUnit/ViewUnitView.vue';

import EditStockView from '../views/staticStock/EditStockView.vue';
import RegisStock from '../views/staticStock/RegisStock.vue';
import ViewStockView from '../views/staticStock/ViewStockView.vue';

import EditTypeStockView from '../views/staticTypeStock/EditTypeStockView.vue';
import RegisTypeStock from '../views/staticTypeStock/RegisTypeStock.vue';
import ViewTypeStockView from '../views/staticTypeStock/ViewTypeStockView.vue';

import EditTypeStatusView from '../views/staticTypeStatus/EditTypeStatusView.vue';
import RegisTypeStatus from '../views/staticTypeStatus/RegisTypeStatus.vue';
import ViewTypeStatusView from '../views/staticTypeStatus/ViewTypeStatusView.vue';

import EditStatusView from '../views/staticStatus/EditStatusView.vue';
import RegisStatus from '../views/staticStatus/RegisStatus.vue';
import ViewStatusView from '../views/staticStatus/ViewStatusView.vue';

import EditRoleView from '../views/staticRole/EditRoleView.vue';
import RegisRole from '../views/staticRole/RegisRole.vue';
import ViewRoleView from '../views/staticRole/ViewRoleView.vue';

import RegisRenting from '../views/staticRenting/RegisRenting.vue';
import ViewRentingView from '../views/staticRenting/ViewRentingView.vue';


import EditPetitionTypeView from '../views/staticPetitionType/EditPetitionTypeView.vue';
import RegisPetitionType from '../views/staticPetitionType/RegisPetitionType.vue';
import ViewPetitionTypeView from '../views/staticPetitionType/ViewPetitionTypeView.vue';


import addReceiveStockView from '../views/Order/addReceiveStockView.vue';
import approveOrderView from '../views/Order/approveOrderView.vue';
import orderCreate from '../views/Order/orderCreate.vue';
import orderEdit from '../views/Order/orderEdit.vue';
import orderView from '../views/Order/orderView.vue';
import receiveStockView from '../views/Order/receiveStockView.vue';


import AddHolidayView from '../views/Holiday/HolidayView.vue';
import AddLeaveRequestView from '../views/LeaveRequest/AddLeaveRequestView.vue';

import { clearToken, hasPermission, isAuthenticated } from './auth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
    redirect: '/login',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        meta: { permission: 'home', requiresAuth: true },
        component: userDasboard,
      },

      ///ระบบแจ้งปัญหา///
        {
          path: '/UserReqView',
          name: 'ส่งคำร้องแจ้งซ่อม',
          meta: { permission: 'view_reques', requiresAuth: true },
          component: ReqView,
        },

        {
          path: '/UserAddReqView',
          name: 'แจ้งซ่อมบำรุง',
          meta: { permission: 'add_reques', requiresAuth: true },
          component: AddReqView,
        },
      
      ///ระบบจัดการการแจ้งปัญหา///
      {
          path: '/StaffMgnReqView',
          name: 'คำร้องขอแจ้งซ่อม', //เจ้าหน้าที่
          meta: { permission: 'view_manage_reques', requiresAuth: true },
          component: StaffMgnReqView,
        },
        {
          path: '/macMgnReqView',
          name: 'รับคำร้องขอแจ้งซ่อม', //เจ้าหน้าที่ซ่อมบำรุง
          meta: { permission: 'view_macmanage_reques', requiresAuth: true },
          component: macMgnReqView,
        },

        ///ระบบจัดการการเบิกวัสดุ///
        {
          path: '/starffWithdrawReqView',
          name: 'เบิกวัสดุ', //เจ้าหน้าที่
          meta: { permission: 'view_WithdrawReq', requiresAuth: true },
          component: starffWithdrawReqView,
        },

        ///ระบบนัดเวลาเข้าซ่อม///
        {
          path: '/starffTimeReqView',
          name: 'นัดเวลาเข้าซ่อม', //เจ้าหน้าที่
          meta: { permission: 'view_TimeReq', requiresAuth: true },
          component: starffTimeReqView,
        },
      
      ///จัดการค่าคงที่ผู้ใช้งาน///
      {
        path: '/ViewResident',
        name: 'จัดการผู้ใช้งาน',
        meta: { permission: 'view_RegisResident', requiresAuth: true },
        component: ViewResView,
      },
      {
        path: '/RegisResident',
        name: 'เพิ่มผู้ใช้งาน',
        meta: { permission: 'add_RegisResident', requiresAuth: true },
        component: RegisResView,
      },
      {
        path: '/EditResView',
        name: 'แก้ไขข้อมูลผู้ใช้งาน',
        meta: { permission: 'edit_Resident', requiresAuth: true },
        component: EditResView,
      },

      ///จัดการค่าคงที่ห้องพัก///
      {
        path: '/ViewRoomView',
        name: 'จัดการห้องพัก',
        meta: { permission: 'view_Room', requiresAuth: true },
        component: ViewRoomView,
      },
      {
        path: '/RegisRoom',
        name: 'เพิ่มห้องพัก',
        meta: { permission: 'add_RegisRoom', requiresAuth: true },
        component: RegisRoom,
      },
      {
        path: '/EditRoomView',
        name: 'เเก้ไขห้องพัก',
        meta: { permission: 'Edit_Room', requiresAuth: true },
        component: EditRoomView,
      },

      ///จัดการค่าคงที่หน่วย///
      {
        path: '/ViewUnitView',
        name: 'จัดการหน่วยสต็อก',
        meta: { permission: 'View_Unit', requiresAuth: true },
        component: ViewUnitView,
      },
      {
        path: '/RegisUnit',
        name: 'เพิ่มหน่วยสต็อก',
        meta: { permission: 'add_Unit', requiresAuth: true },
        component: RegisUnit,
      },
      {
        path: '/EditUnitView',
        name: 'ตั้งค่าหน่วยสต็อก',
        meta: { permission: 'edit_Unit', requiresAuth: true },
        component: EditUnitView,
      },

      ///จัดการค่าคงที่ประเภทสต็อก///
      {
        path: '/ViewTypeStockView',
        name: 'จัดการข้อมูลประเภทสต็อก',
        meta: { permission: 'View_TypeStock', requiresAuth: true },
        component: ViewTypeStockView,
      },
      {
        path: '/RegisTypeStock',
        name: 'เพิ่มข้อมูลประเภทสต็อก',
        meta: { permission: 'add_TypeStock', requiresAuth: true },
        component: RegisTypeStock,
      },
      {
        path: '/EditTypeStockView',
        name: 'แก้ไขข้อมูลประเภทสต็อก',
        meta: { permission: 'edit_TypeStock', requiresAuth: true },
        component: EditTypeStockView,
      },

      ///จัดการค่าคงที่สต็อก///
      {
        path: '/ViewStockView',
        name: 'จัดการข้อมูลสต็อก',
        meta: { permission: 'View_Stock', requiresAuth: true },
        component: ViewStockView,
      },
      {
        path: '/RegisStock',
        name: 'เพิ่มข้อมูลสต็อก',
        meta: { permission: 'add_Stock', requiresAuth: true },
        component: RegisStock,
      },
      
      {
        path: '/EditStockView',
        name: 'แก้ไขข้อมูลสต็อก',
        meta: { permission: 'edit_Stock', requiresAuth: true },
        component: EditStockView,
      },

      ///จัดการค่าคงที่ประเภทสถานะ///
      {
        path: '/ViewTypeStatusView',
        name: 'จัดการข้อมูลประเภทสถานะ',
        meta: { permission: 'View_TypeStatus', requiresAuth: true },
        component: ViewTypeStatusView,
      },
      {
        path: '/RegisTypeStatus',
        name: 'เพิ่มข้อมูลประเภทสถานะ',
        meta: { permission: 'add_TypeStatus', requiresAuth: true },
        component: RegisTypeStatus,
      },
      {
        path: '/EditTypeStatusView',
        name: 'แก้ไขข้อมูลประเภทสถานะ',
        meta: { permission: 'edit_TypeStatus', requiresAuth: true },
        component: EditTypeStatusView,
      },

      ///จัดการค่าคงที่สถานะ///
      {
        path: '/ViewStatusView',
        name: 'จัดการข้อมูลสถานะ',
        meta: { permission: 'View_Status', requiresAuth: true },
        component: ViewStatusView,
      },
      {
        path: '/RegisStatus',
        name: 'เพิ่มข้อมูลสถานะ',
        meta: { permission: 'add_Status', requiresAuth: true },
        component: RegisStatus,
      },
      {
        path: '/EditStatusView',
        name: 'แก้ไขข้อมูลสถานะ',
        meta: { permission: 'edit_Status', requiresAuth: true },
        component: EditStatusView,
      },

      ///จัดการค่าคงที่ตำแหน่ง///
      {
        path: '/ViewRoleView',
        name: 'จัดการข้อมูลตำแหน่ง',
        meta: { permission: 'View_Role', requiresAuth: true },
        component: ViewRoleView,
      },
      {
        path: '/RegisRole',
        name: 'เพิ่มข้อมูลตำแหน่ง',
        meta: { permission: 'add_Role', requiresAuth: true },
        component: RegisRole,
      },
      {
        path: '/EditRoleView',
        name: 'แก้ไขข้อมูลตำแหน่ง',
        meta: { permission: 'edit_Role', requiresAuth: true },
        component: EditRoleView,
      },

      {
        path: '/ViewRentingView',
        name: 'จัดการข้อมูลการเช่า',
        meta: { permission: 'View_Renting', requiresAuth: true },
        component: ViewRentingView,
      },
      {
        path: '/RegisRenting',
        name: 'เพิ่มข้อมูลการเช่า',
        meta: { permission: 'add_Renting', requiresAuth: true },
        component: RegisRenting,
      },
      {
        path: '/ViewPetitionTypeView',
        name: 'จัดการข้อมูลประเภทคำร้อง',
        meta: { permission: 'View_PetitionType', requiresAuth: true },
        component: ViewPetitionTypeView,
      },
      {
        path: '/RegisPetitionType',
        name: 'เพิ่มข้อมูลประเภทคำร้อง',
        meta: { permission: 'add_PetitionType', requiresAuth: true },
        component: RegisPetitionType,
      },
      {
        path: '/EditPetitionTypeView',
        name: 'แก้ไขข้อมูลประเภทคำร้อง',
        meta: { permission: 'edit_PetitionType', requiresAuth: true },
        component: EditPetitionTypeView,
      },

      //ใบสั่งซื้อ
      {
        path: '/orderManageView',
        name: 'ใบสั่งซื้อ',
        meta: { permission: 'View_OrderManage', requiresAuth: true },
        component: orderView,
      },

      {
        path: '/orderCreate',
        name: 'สร้างใบสั่งซื้อ',
        meta: { permission: 'create_OrderManage', requiresAuth: true },
        component: orderCreate,
      },

      {
        path: '/orderEdit',
        name: 'แก้ไขใบสั่งซื้อ',
        meta: { permission: 'edit_OrderManage', requiresAuth: true },
        component: orderEdit,
      },


       //ใบสั่งซื้อ
       {
        path: '/approveOrderView',
        name: 'อนุมัติใบสั่งซื้อ',
        meta: { permission: 'Approve_OrderView', requiresAuth: true },
        component: approveOrderView,
      },
      
      {
        path: '/receiveStockView',
        name: 'ใบสั่งซื้อรับวัสดุเข้าคลัง',
        meta: { permission: 'view_receiveStock', requiresAuth: true },
        component: receiveStockView,
      },
      
      {
        path: '/addReceiveStockView',
        name: 'รับวัสดุเข้าคลัง',
        meta: { permission: 'add_receiveStock', requiresAuth: true },
        component: addReceiveStockView,
      },


      //----------------- วันลาเเละวันหยุด -------------------------
      {
        path: '/AddLeaveRequestView',
        name: 'เพิ่มวันลา',
        meta: { permission: 'add_LeaveRequestView', requiresAuth: true },
        component: AddLeaveRequestView,
      },
      {
        path: '/AddHolidayView',
        name: 'จัดการวันหยุด',
        meta: { permission: 'add_HolidayView', requiresAuth: true },
        component: AddHolidayView,
      },

      
      ///ตั้งค่า///
      {
        path: '/UserSetView',
        name: 'ตั้งค่า',
        meta: { permission: 'view_users_Setting', requiresAuth: true },
        component: () => import('../views/staticSetting/UserSetView.vue'),
      },
      


    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login/Login.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    clearToken();
  }

  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login');
  } else if (to.meta.permission && isAuthenticated()) {
    if (hasPermission(to.meta.permission)) {
      next();
    } else {
      next('/login');
    }
  } else {
    next();
  }
});

export default router;
