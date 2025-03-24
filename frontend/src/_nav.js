export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
    badge: {
      color: 'primary',
    },
    permission_index: 1,  
  },
  ///ระบบแจ้งปัญหา///
  {
    component: 'CNavTitle',
    name: 'แจ้งซ่อมบำรุงห้องพัก',
    permission_index: 6,  
  },
  {
    component: 'CNavItem',
    name: 'ส่งคำร้องแจ้งซ่อม',
    to: '/UserReqView',
    icon: 'cilSend',
    permission_index: 6, 
  },
  ///ระบบจัดการการแจ้งปัญหา///
  {
    component: 'CNavTitle',
    name: 'จัดการการแจ้งซ่อม',
    permission_index: [8, 9],
  },
  {
    component: 'CNavItem',
    name: 'คำร้องขอแจ้งซ่อม',
    to: '/StaffMgnReqView',
    icon: 'cilEnvelopeOpen',
    permission_index: 8,
  },
  {
    component: 'CNavItem',
    name: 'รับคำร้องขอแจ้งซ่อม',
    to: '/macMgnReqView',
    icon: 'cilDescription',
    permission_index: 9,
  },
  ///ระบบจัดการการเบิกวัสดุ///
  {
    component: 'CNavTitle',
    name: 'จัดการการเบิกวัสดุ',
    permission_index: 10,
  },
  {
    component: 'CNavItem',
    name: 'เบิกวัสดุ',
    to: '/starffWithdrawReqView',
    icon: 'cilBasket',
    permission_index: 10, 
  },
  ///ระบบนัดเวลาเข้าซ่อม///
  {
    component: 'CNavTitle',
    name: 'จัดการนัดเวลาเข้าซ่อม',
    permission_index: 11, 
  },
  {
    component: 'CNavItem',
    name: 'นัดเวลาเข้าซ่อม',
    to: '/starffTimeReqView',
    icon: 'cilClock',
    permission_index: 11,
  },

    ///ใบสั่งซื้อ///
    {
      component: 'CNavTitle',
      name: 'จัดการใบสั่งซื้อ',
      permission_index: [41,44,47], 
    },
    {
      component: 'CNavItem',
      name: 'ใบสั่งซื้อ',
      to: '/orderManageView',
      icon: 'cilCart',
      permission_index: 41,
    },
    {
      component: 'CNavItem',
      name: 'อนุมัติใบสั่งซื้อ',
      to: '/approveOrderView',
      icon: 'cilDescription',
      permission_index: 44,
    },

    {
      component: 'CNavItem',
      name: 'รับวัสดุเข้าคลัง',
      to: '/receiveStockView',
      icon: 'cilDescription',
      permission_index: 47,
    },
  
  ///จัดการค่าคงที่ผู้ใช้งาน///
  {
    component: 'CNavTitle',
    name: 'จัดการผู้ใช้งาน',
    permission_index: 12, 
  },
  {
    component: 'CNavItem',
    name: 'ผู้ใช้งาน',
    to: '/ViewResident',
    icon: 'cil-people',
    permission_index: 12, 
  },
  ///จัดการค่าคงที่ห้องพัก///
  {
    component: 'CNavTitle',
    name: 'จัดการห้องพักอาศัย',
    permission_index: 15, 
  },
  {
    component: 'CNavItem',
    name: 'ห้องพักอาศัย',
    to: '/ViewRoomView',
    icon: 'cilRoom',
    permission_index: 15,
  },
  {
    component: 'CNavTitle',
    name: 'จัดการตำแหน่งและสิทธิ์',
    permission_index: 33, 
  },
  {
    component: 'CNavItem',
    name: 'จัดการตำแหน่งและสิทธิ์',
    to: '/ViewRoleView',
    icon: 'cilPuzzle',
    permission_index: 33,
  },

  {
    component: 'CNavTitle',
    name: 'จัดการการเช่า',
    permission_index: 37, 
  },
  {
    component: 'CNavItem',
    name: 'จัดการการเช่า',
    to: '/ViewRentingView',
    icon: 'cilPuzzle',
    permission_index: 37,
  },
  {
    component: 'CNavTitle',
    name: 'จัดการวันหยุด',
    permission_index: [45,46], 
  },
  {
    component: 'CNavItem',
    name: 'จัดการวันหยุดพนักงาน',
    to: '/AddHolidayView',
    icon: 'cilPuzzle',
    permission_index: 45,
  },
  {
    component: 'CNavItem',
    name: 'จัดการวันลาพนักงาน',
    to: '/AddLeaveRequestView',
    icon: 'cilPuzzle',
    permission_index: 46,
  },
  ///ตั้งค่า///
  {
    component: 'CNavTitle',
    name: 'ตั้งค่าข้อมูลระบบ',
    permission_index: [18, 21, 30],
  },

  {
    component: 'CNavGroup',
    name: 'จัดการข้อมูลภายในระบบ',
    to: '#',
    icon: 'cil-notes',
    items: [
      {
        component: 'CNavItem',
        name: 'จัดการข้อมูลสต็อก',
        to: '/ViewStockView',
        permission_index: 18,
      },
      {
        component: 'CNavItem',
        name: 'จัดการข้อมูลประเภทสต็อก',
        to: '/ViewTypeStockView',
        permission_index: 21,
      },
      // {
      //   component: 'CNavItem',
      //   name: 'จัดการข้อมูลสถานะ',
      //   to: '/ViewStatusView',
      //   permission_index: 24,
      // },
      // {
      //   component: 'CNavItem',
      //   name: 'จัดการข้อมูลประเภทสถานะ',
      //   to: '/ViewTypeStatusView',
      //   permission_index: 27,
      // },
      {
        component: 'CNavItem',
        name: 'จัดการข้อมูลหน่วย',
        to: '/ViewUnitView',
        permission_index: 30,
      },
      {
        component: 'CNavItem',
        name: 'จัดการข้อมูลประเภทคำร้อง',
        to: '/ViewPetitionTypeView',
        permission_index: 39,
      },

    ],
  },
  {
    component: 'CNavTitle',
    name: 'ออกจากระบบ',
    permission_index: 0, 
  },
  {
    component: 'CNavItem',
    name: 'LOGOUT',
    to: '/login',
    icon: 'cilAccountLogout',
    permission_index: 0, 
  },
];
