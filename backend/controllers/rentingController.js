const db = require("../config/db");
require("dotenv").config();

//////////////API//////////////
//////////registerPermission/////////
////////////////////////////////////
const registerRenting = async (req, res) => {
  const { renting_user_ID, renting_room_ID} = req.body;

  try {
    const query = "SELECT renting_ID FROM renting ORDER BY renting_ID DESC LIMIT 1";
    const [result] = await db.promise().query(query);
    let maxId;
    if (result.length === 0) {
      maxId = 0;
    } else {
      const lastRentingId = result[0].renting_ID;
      maxId = parseInt(lastRentingId.slice(-6)) || 0;
    }
    const num = maxId + 1;
    const newRentingID = "REN" + String(num).padStart(6, "0");
    const renting_stat_ID = "SRT000001"
    const insertQuery = `
      INSERT INTO renting
      ( renting_ID, renting_user_ID,renting_room_ID,renting_stat_ID)
      VALUES (?, ?, ?, ?)
    `;
    await db.promise().query(insertQuery, [newRentingID, renting_user_ID,renting_room_ID,renting_stat_ID]);

    res.status(201).json({ message: "ลงทะเบียนการเช่าสำเร็จแล้ว!" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
///////////getAutotid///////////
///////////////////////////////
const getAutoRentingID = async (req, res) => {
  try {
    const query = "SELECT renting_ID FROM renting ORDER BY renting_ID DESC LIMIT 1";
    const [result] = await db.promise().query(query);
    let maxId;
    if (result.length === 0) {
      maxId = 0;
    } else {
      const lastRentingId = result[0].renting_ID;
      maxId = parseInt(lastRentingId.slice(-6)) || 0;
    }
    const num = maxId + 1;
    const newRentingID = "REN" + String(num).padStart(6, "0");
    res.status(200).json(newRentingID);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
///////////getRenting/////////////
///////////////////////////////
const getRenting = async (req, res) => {
  try {
    const query = `
    SELECT 
      renting_ID, 
      CONCAT(users.user_Fname,' ', users.user_Lname) AS userName,
      room.room_Number,
      starenting.staren_name as stat_Name,
      renting_user_ID,
      renting_room_ID,
      renting_stat_ID
    FROM 
      renting
    INNER JOIN users on users.user_ID = renting.renting_user_ID
    INNER JOIN room on room.room_ID = renting.renting_room_ID
    INNER JOIN starenting on starenting.staren_ID = renting.renting_stat_ID
    WHERE 
      renting_stat_ID = "SRT000001"
    `;
    const [result] = await db.promise().query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
///////getgetRentingByID/////////////
///////////////////////////////
const getgetRentingByID = async (req, res) => {
  try {
    const renting_ID = req.query.ID;
    if (!renting_ID) {
      return res.status(400).json({ error: "โปรดระบุ ID การเช่า" });
    }
    const query = `
      SELECT 
      renting_ID, 
      CONCAT(users.user_Fname,' ', users.user_Lname) AS userName,
      room.room_Number,
      status.stat_Name,
      renting_user_ID,
      renting_room_ID,
      renting_stat_ID
    FROM 
      renting
    INNER JOIN users on users.user_ID = renting.renting_user_ID
    INNER JOIN room on room.room_ID = renting.renting_room_ID
    INNER JOIN status on status.stat_ID = renting.renting_stat_ID
    WHERE 
      renting_ID = ?
    `;
    const [result] = await db.promise().query(query, [renting_ID]);
    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลการเช่า" });
    }
    res.status(200).json(result[0]);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const getUserForRenting = async (req, res) => {
  try {
    const query = `
    SELECT 
      user_ID,
      CONCAT(users.user_Fname,' ', users.user_Lname) AS userName
    FROM 
      users
      INNER JOIN roles on roles.role_ID = users.user_Role_ID
    WHERE user_status_ID = "STU000001" AND roles.role_ID = "ROL000002"
    `;
    const [result] = await db.promise().query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const getRoomForRenting = async (req, res) => {
  try {
    const query = `SELECT
      room_ID, 
      room_Number
    FROM
      room
    WHERE room_Status_ID = "SUS000001" and room_stat_ID = "STR000001";
    `;
    const [result] = await db.promise().query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const updateRoomStatusRenting = async (req, res) => {
  const { roomID } = req.body;
  const room_stat_ID = "STR000002";
  try {
    if (!roomID) {
      return res.status(400).json({ error: "กรุณาระบุ roomID " });
    }
    const [userCheck] = await db.promise().query("SELECT * FROM room WHERE room_ID = ?", [roomID]);
    if (userCheck.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลห้องพัก" });
    }
    const updateQuery = "UPDATE room SET room_stat_ID = ? WHERE room_ID = ?";
    await db.promise().query(updateQuery, [room_stat_ID, roomID]);

    res.status(200).json({ message: "อัปเดตสถานะของห้องพักเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const updateRoomStatusCancelRenting = async (req, res) => {
  const { roomID } = req.body;
  const room_stat_ID = "STR000001";
  try {
    if (!roomID) {
      return res.status(400).json({ error: "กรุณาระบุ roomID " });
    }
    const [userCheck] = await db.promise().query("SELECT * FROM room WHERE room_ID = ?", [roomID]);
    if (userCheck.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลห้องพัก" });
    }
    const updateQuery = "UPDATE room SET room_stat_ID = ? WHERE room_ID = ?";
    await db.promise().query(updateQuery, [room_stat_ID, roomID]);

    res.status(200).json({ message: "อัปเดตสถานะของห้องพักเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const updateStatusRenting = async (req, res) => {
  const { ID, statusID } = req.body; 
  try {
    if (!ID || !statusID) {
      return res.status(400).json({ error: "กรุณาระบุ ID และ statusID" });
    }
    const [itemCheck] = await db.promise().query("SELECT * FROM renting WHERE renting_ID = ?", [ID]);
    if (itemCheck.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลสถานะที่ต้องการอัปเดต" });
    }
    const updateQuery = "UPDATE renting SET renting_stat_ID = ? WHERE renting_ID = ?";
    await db.promise().query(updateQuery, [statusID, ID]);

    res.status(200).json({ message: "อัปเดตสถานะการเช่าเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะการเช่า:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};


const getDeletableRenting = async (req, res) => {
  try {
    const query = 'SELECT * FROM starenting'; 
    const [result] = await db.promise().query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

module.exports = {
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
};
