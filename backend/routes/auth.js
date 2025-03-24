const express = require("express");
const { login } = require("../controllers/authController");
const {
  registerUser,
  getAutotid,
  getRole,
  getUser,
  getUserById,
  updateUser,
  updateUserStatus,
} = require("../controllers/regiterController");
const {
  getProvince,
  getAmphures,
  getTambons,
  getZipcode,
} = require("../controllers/addressControler");

const {
  getStatus,
  getStatusUserDelete,
  registerStatus,
  getStatusForView,
  getStatusByID,
  getAutotidSta,
  updateStatus,
  updateStatusSta,
  getDeletableStatus,
} = require("../controllers/statusControler");

const {
  getReqById,
  getHisReqById,
  getUserByIdfromReq,
  getPetitiontype,
  submitRepairRequest,
  upload,
  getImgById,
  cancelReq,
  getroomByID,
  successReq,
} = require("../controllers/reqController");
const {
  getReq,
  getReqhistory,
  denyReq,
  sendtomacReq,
  getMacReq,
  sendAssessProblemReq,
  getMacReqById,
  getStock,
  submitRequisition,
  getSuccessReq,
  getStatusReq,
  updateStatusReq,
  updateStatusNotsuccess,
  updateStatusNotwith,
} = require("../controllers/manageRequetsControler");
const {
  getWithdrawReqlist,
  getWithdrawReq,
  putReqWithdraw,
  getWithdraw,
  putAcceptWithdraw,
  cancelWithdraw,
} = require("../controllers/WithdrawControler");
const {
  getreqtime,
  getMacForShc,
  getReqwaitForShc,
  assignWork,
  getTechnicianAppointments,
} = require("../controllers/TimeReqControler");

const {
  getInprogressCount,
  getreqTimeLine,
} = require("../controllers/DashboardControler");

const {
  registerRoom,
  getAutotidRoom,
  getRoom,
  getRoomByNumber,
  updateRoom,
  updateRoomStatus,
  getStatusRoom,
  getStatusRoomDelete,
} = require("../controllers/RoomController");

const {
  registerUnit,
  getAutotidUnit,
  getUnit,
  getUnitByID,
  updateUnit,
  updateStatusUnit,
  getDeletableUnits,
} = require("../controllers/unitController");

const {
  registerStock,
  getAutotidStock,
  getStockforstock,
  getStockByID,
  updateStock,
  updateStatusStock,
  getDeletableStock,
} = require("../controllers/stockController");

const {
  registerTypeStock,
  getAutotidTypeStock,
  getTypeStock,
  getTypeStockByID,
  updateTypeStock,
  updateStatusTypeStock,
  getDeletableTypeStock,
} = require("../controllers/stockTypeController");

const {
  registerStatusType,
  getStatusType,
  getStatusTypeByID,
  getAutotidStatusType,
  updateStatusType,
  getDeletableTypeStatus,
  updateStatusTypeStatus,
} = require("../controllers/statusTypeControler");

const {
  registerRole,
  getRolesForView,
  getRoleByID,
  getAutoRoleID,
  updateRole,
  getDeletableRole,
  updateStatusRole
} = require("../controllers/roleControler");

const {
  getRenting,
  getgetRentingByID,
  registerRenting,
  getAutoRentingID,
  getUserForRenting,
  getRoomForRenting,
  updateRoomStatusRenting,
  updateStatusRenting,
  getDeletableRenting,
  updateRoomStatusCancelRenting
} = require("../controllers/rentingController");

const {
  registerPetitionType,
  getPetitionTypeForView,
  getPetitionTypeByID,
  getAutotidPetitionType,
  updatePetitionType,
  updateStatusPetitionType,
  getDeletablePetitionTypes

} = require("../controllers/patitionTypeController");

//new-------------------------------------------------------------------
const {
  registerFloor,
  getFloor,
  getFloorByID,
  getAutotidFloor,
  updateFloor,
  updateStatusFloor,
  getDeletableFloors

} = require("../controllers/floorController");

//new โครงการ 2 -------------------------------------------------------------------ดิ๊กเขียน
const {
  createOrder,
  getPendingOrders,
  createOrderPDF,
  getUserByIdfromOrder,
  editOrder,
  selectOrderbyID,
  getPendingOrdersForApprove,
  approveOrder,
  notApproveOrder,
  setOrderWait,
  selectOrderByReq_ID,
  getOrdersForReceive,
} = require("../controllers/orderControler");

// const {
//   registerRoomType,
//   getRoomType,
//   getRoomTypeByID,
//   getAutotidRoomType,
//   updateRoomType,
//   updateStatusRoomType,
//   getDeletableRoomTypes
// } = require("../controllers/roomtypeController");

// const {
//   registerAirconditioner,
//   getAirconditioner,
//   getAirconditionerByID,
//   getAutotidAirconditioner,
//   updateAirconditioner,
//   updateStatusAirconditioner,
//   getDeletableAirconditioners
// } = require("../controllers/AirController");




const {
  AddLeaveRequest,
  getUserForLeaveRe,
  getLeaveRe,
  CancelLeave
} = require("../controllers/leaverequestControler");

const {
  setWeeklyHoliday,
  getWeeklyHolidays,
  getUserForHoliday
} = require("../controllers/HolidayControler");

// getUserByIdfromReq
// const { registerRoom } = require('../controllers/RoomController');
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.post("/login", login);
router.post("/registerUser", authenticateToken, registerUser);

router.post("/assignWork", authenticateToken, assignWork);

router.post(
  "/submitRepairRequest",
  authenticateToken,
  upload.array("images"),
  submitRepairRequest
);

router.post("/sendAssessProblemReq", authenticateToken, sendAssessProblemReq);
router.post("/submitRequisition", authenticateToken, submitRequisition);

router.get("/getAutotid", authenticateToken, getAutotid);
router.get("/getRole", authenticateToken, getRole);
router.get("/getUser", authenticateToken, getUser);
router.get("/getUserById", authenticateToken, getUserById);
router.get("/getProvince", authenticateToken, getProvince);
router.get("/getAmphures", authenticateToken, getAmphures);
router.get("/getTambons", authenticateToken, getTambons);
router.get("/getZipcode", authenticateToken, getZipcode);
router.get("/getStatus", authenticateToken, getStatus);
router.get("/getStatusUserDelete", authenticateToken, getStatusUserDelete);

router.get("/getReqById", authenticateToken, getReqById);
router.get("/getHisReqById", authenticateToken, getHisReqById);
router.get("/getUserByIdfromReq", authenticateToken, getUserByIdfromReq);
router.get("/getPetitiontype", authenticateToken, getPetitiontype);
router.get("/getImgById", authenticateToken, getImgById);
router.get("/getroomByID", authenticateToken, getroomByID);

router.get("/getReq", authenticateToken, getReq);
router.get("/getReqhistory", authenticateToken, getReqhistory);
router.get("/getMacReq", authenticateToken, getMacReq);
router.get("/getMacReqById", authenticateToken, getMacReqById);
router.get("/getStock", authenticateToken, getStock);
router.get("/getSuccessReq", authenticateToken, getSuccessReq);
router.get("/getStatusReq", authenticateToken, getStatusReq);

router.get("/getWithdrawReq", authenticateToken, getWithdrawReq);
router.get("/getWithdrawReqlist", authenticateToken, getWithdrawReqlist);
router.get("/getWithdraw", authenticateToken, getWithdraw);

router.get("/getInprogressCount", authenticateToken, getInprogressCount);
router.get("/getreqTimeLine", authenticateToken, getreqTimeLine);

router.get("/getreqtime", authenticateToken, getreqtime);
router.get("/getMacForShc", authenticateToken, getMacForShc);
router.get("/getReqwaitForShc", authenticateToken, getReqwaitForShc);
router.get("/getTechnicianAppointments", authenticateToken, getTechnicianAppointments);

router.put("/updateUser", authenticateToken, updateUser);
router.put("/updateUserStatus", authenticateToken, updateUserStatus);

router.put("/cancelReq", authenticateToken, cancelReq);
router.put("/successReq", authenticateToken, successReq);

router.put("/denyReq", authenticateToken, denyReq);
router.put("/sendtomacReq", authenticateToken, sendtomacReq);
router.put("/updateStatusReq", authenticateToken, updateStatusReq);
router.put("/updateStatusNotsuccess", authenticateToken, updateStatusNotsuccess);
router.put("/updateStatusNotwith", authenticateToken, updateStatusNotwith);

router.put("/putReqWithdraw", authenticateToken, putReqWithdraw);
router.put("/putAcceptWithdraw", authenticateToken, putAcceptWithdraw);
router.put("/cancelWithdraw", authenticateToken, cancelWithdraw);

// router.post('/registerRoom', authenticateToken, registerRoom);

router.post("/registerRoom", authenticateToken, registerRoom);
router.post("/registerUnit", authenticateToken, registerUnit);
router.post("/registerStatus", authenticateToken, registerStatus);
router.post("/registerStatusType", authenticateToken, registerStatusType);
router.post("/registerStock", authenticateToken, registerStock);
router.post("/registerTypeStock", authenticateToken, registerTypeStock);
router.post("/registerRole", authenticateToken, registerRole); //
router.post("/registerRenting", authenticateToken, registerRenting); //
router.post("/registerPetitionType", authenticateToken, registerPetitionType); //
router.post("/registerFloor", authenticateToken, registerFloor); //new

router.get("/getAutotidRoom", authenticateToken, getAutotidRoom);
router.get("/getRoom", authenticateToken, getRoom);
router.get("/getRoomByNumber", authenticateToken, getRoomByNumber);
router.get("/getStatusRoom", authenticateToken, getStatusRoom);
router.get("/getStatusRoomDelete", authenticateToken, getStatusRoomDelete); //

router.get("/getAutotidUnit", authenticateToken, getAutotidUnit);
router.get("/getUnit", authenticateToken, getUnit);
router.get("/getUnitByID", authenticateToken, getUnitByID); //
router.get("/getDeletableUnits", authenticateToken, getDeletableUnits); //

router.get("/getAutotidStock", authenticateToken, getAutotidStock);
router.get("/getStockforstock", authenticateToken, getStockforstock);
router.get("/getStockByID", authenticateToken, getStockByID);
router.get("/getDeletableStock", authenticateToken, getDeletableStock); //

router.get("/getAutotidTypeStock", authenticateToken, getAutotidTypeStock);
router.get("/getTypeStock", authenticateToken, getTypeStock);
router.get("/getTypeStockByID", authenticateToken, getTypeStockByID); //
router.get("/getDeletableTypeStock", authenticateToken, getDeletableTypeStock); //

router.get("/getAutotidStatusType", authenticateToken, getAutotidStatusType);
router.get("/getStatusType", authenticateToken, getStatusType);
router.get("/getStatusTypeByID", authenticateToken, getStatusTypeByID); //
router.get(
  "/getDeletableTypeStatus",
  authenticateToken,
  getDeletableTypeStatus
); //

router.get("/getStatusForView", authenticateToken, getStatusForView); //
router.get("/getStatusByID", authenticateToken, getStatusByID); //
router.get("/getAutotidSta", authenticateToken, getAutotidSta); //
router.get("/getDeletableStatus", authenticateToken, getDeletableStatus); //

router.get("/getRolesForView", authenticateToken, getRolesForView); //
router.get("/getRoleByID", authenticateToken, getRoleByID); //
router.get("/getAutoRoleID", authenticateToken, getAutoRoleID); //
router.get("/getDeletableRole", authenticateToken, getDeletableRole); //

router.get("/getRenting", authenticateToken, getRenting); //new
router.get("/getgetRentingByID", authenticateToken, getgetRentingByID); //new
router.get("/getAutoRentingID", authenticateToken, getAutoRentingID); //new
router.get("/getUserForRenting", authenticateToken, getUserForRenting); //new
router.get("/getRoomForRenting", authenticateToken, getRoomForRenting); //new
router.get("/getDeletableRenting", authenticateToken, getDeletableRenting); //new

router.get("/getPetitionTypeForView", authenticateToken, getPetitionTypeForView); //new
router.get("/getPetitionTypeByID", authenticateToken, getPetitionTypeByID); //new
router.get("/getAutotidPetitionType", authenticateToken, getAutotidPetitionType); //new
router.get("/getDeletablePetitionTypes", authenticateToken, getDeletablePetitionTypes); //new

router.get("/getFloor", authenticateToken, getFloor); //new
router.get("/getFloorByID", authenticateToken, getFloorByID); //new

// router.get("/getRoomType", authenticateToken, getRoomType); //new
// router.get("/getRoomTypeByID", authenticateToken, getRoomTypeByID); //new

// router.get("/getAirconditioner", authenticateToken, getAirconditioner); //new
// router.get("/getAirconditionerByID", authenticateToken, getAirconditionerByID); //new


router.put("/updateRoom", authenticateToken, updateRoom);
router.put("/updateRoomStatus", authenticateToken, updateRoomStatus);

router.put("/updateUnit", authenticateToken, updateUnit);
router.put("/updateStatusUnit", authenticateToken, updateStatusUnit); //

router.put("/updateStock", authenticateToken, updateStock);
router.put("/updateStatusStock", authenticateToken, updateStatusStock); //

router.put("/updateTypeStock", authenticateToken, updateTypeStock);
router.put("/updateStatusTypeStock", authenticateToken, updateStatusTypeStock); //

router.put("/updateStatusType", authenticateToken, updateStatusType);
router.put(
  "/updateStatusTypeStatus",
  authenticateToken,
  updateStatusTypeStatus
); //

router.put("/updateStatus", authenticateToken, updateStatus); 
router.put("/updateStatusSta", authenticateToken, updateStatusSta); 

router.put("/updateRole", authenticateToken, updateRole); 
router.put("/updateStatusRole", authenticateToken, updateStatusRole);

router.put("/updateRoomStatusRenting", authenticateToken, updateRoomStatusRenting);
router.put("/updateRoomStatusCancelRenting", authenticateToken, updateRoomStatusCancelRenting);
router.put("/updateStatusRenting", authenticateToken, updateStatusRenting);

router.put("/updatePetitionType", authenticateToken, updatePetitionType);
router.put("/updateStatusPetitionType", authenticateToken, updateStatusPetitionType);


//new โครงการ 2 -------------------------------------------------------------------ดิ๊กเขียน
router.post("/createOrder", authenticateToken, createOrder);
router.get("/getPendingOrders", authenticateToken, getPendingOrders);
router.get("/orders/:order_ID/pdf", authenticateToken, createOrderPDF);
router.get("/getUserByIdfromOrder", authenticateToken, getUserByIdfromOrder);
router.get("/selectOrderbyID", authenticateToken, selectOrderbyID);
router.put("/editOrder", authenticateToken, editOrder);
router.get("/getPendingOrdersForApprove", authenticateToken, getPendingOrdersForApprove);
router.put("/approveOrder", authenticateToken, approveOrder);
router.put("/notApproveOrder", authenticateToken, notApproveOrder);
router.put("/setOrderWait", authenticateToken, setOrderWait);
router.get("/selectOrderByReq_ID", authenticateToken, selectOrderByReq_ID);
router.get("/getOrdersForReceive", authenticateToken, getOrdersForReceive);


//============== การเพิ่มวันลาเเละวันหยุด ======================
router.post("/AddLeaveRequest", authenticateToken, AddLeaveRequest);
router.get("/getUserForLeaveRe", authenticateToken, getUserForLeaveRe);
router.get("/getLeaveRe", authenticateToken, getLeaveRe);
router.put("/CancelLeave", authenticateToken, CancelLeave);

router.post("/setWeeklyHoliday", authenticateToken, setWeeklyHoliday);
router.get("/getWeeklyHolidays", authenticateToken, getWeeklyHolidays);
router.get("/getUserForHoliday", authenticateToken, getUserForHoliday);



module.exports = router;
