export const decodeJWTTH = (token) => {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        throw new Error('Invalid token format');
      }
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );
      return JSON.parse(payload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };
  
  export const getPermissions = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedPayload = decodeJWTTH(token);
      return decodedPayload?.permissions || '';
    }
    console.log('Token not found');
    return '';
  };
  
  export const getUserID = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedPayload = decodeJWTTH(token);
      return decodedPayload?.id || '';
    }
    console.log('Token not found');
    return '';
  };
  
  export const hasPermission = (permission) => {
    const permissionsMap = [
      'logout',                   //0
      'home',                     //1
      'userdashboard',            //2
      'addmindashboard',          //3
      'macdashboard',             //4
      'managerdashboard',         //5
      ///ระบบแจ้งปัญหา///
      'view_reques',              //6
      'add_reques',               //7
      ///ระบบจัดการการแจ้งปัญหา///
      'view_manage_reques',       //8
      'view_macmanage_reques',    //9
      ///ระบบจัดการการเบิกวัสดุ///
      'view_WithdrawReq',         //10
      ///ระบบนัดเวลาเข้าซ่อม///
      'view_TimeReq',             //11
      ///จัดการค่าคงที่ผู้ใช้งาน///
      'view_RegisResident',       //12
      'add_RegisResident',        //13
      'edit_Resident',            //14
      ///จัดการค่าคงที่ผู้ใช้งาน///
      'view_Room',                //15
      'add_RegisRoom',            //16
      'Edit_Room',                //17

      'View_Stock',               //18
      'add_Stock',                //19
      'edit_Stock',               //20

      'View_TypeStock',           //21
      'add_TypeStock',            //22
      'edit_TypeStock',           //23

      'View_Status',              //24
      'add_Status',               //25
      'edit_Status',              //26

      'View_TypeStatus',          //27
      'add_TypeStatus',           //28
      'edit_TypeStatus',          //29

      'View_Unit',                //30
      'add_Unit',                 //31
      'edit_Unit',                //32

      'View_Role',                //33
      'add_Role',                 //34
      'edit_Role',                //35

      'View_Renting',             //36
      'add_Renting',              //37

      'View_PetitionType',        //38
      'add_PetitionType',         //39
      'edit_PetitionType',        //40

      'View_OrderManage',            //41
      'create_OrderManage',             //42
      'edit_OrderManage',            //43

      'Approve_OrderView',           //44
      'add_LeaveRequestView',        //45
      'add_HolidayView',              //46

      'view_receiveStock',//47
      'add_receiveStock',//48
    ];
    
    const permissionsToken = getPermissions();
    localStorage.setItem("permissions", permissionsToken);
    const UserID = getUserID();
    localStorage.setItem("userID", UserID);
    let lUserId = localStorage.getItem('userID');
    console.log("userID "+lUserId)
  
    if (!permissionsToken) {
      console.error('Permissions token not found');
      return false;
    }
  
    const permissions = permissionsToken.split('').map((bit) => bit === '1');
    const index = permissionsMap.indexOf(permission);
    if (index === -1) {
      console.error('Permission not found:', permission);
      return false;
    }
    return permissions[index] === true;
  };
  
  export const isAuthenticated = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
    // return !!localStorage.getItem('token') || !!sessionStorage.getItem('token');
  };
  
  export const clearToken = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('userID');
    sessionStorage.removeItem('userID');
    // localStorage.removeItem('localUserid');
    // sessionStorage.removeItem('localUserid');
  };
  