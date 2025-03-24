// const db = require("../config/db");
// require("dotenv").config();

// //////////////API//////////////
// ////////registerRoomType////////
// ///////////////////////////////
// const registerRoomType = async (req, res) => {
//   const { roomTypeName } = req.body;

//   try {
//     ////////////Autoid/////////////
//     const query = "SELECT roomType_ID FROM roomType ORDER BY roomType_ID DESC LIMIT 1";
//     const [result] = await db.promise().query(query);
//     let maxId;
//     if (result.length === 0) {
//       maxId = 0;
//     } else {
//       const lastRoomTypeId = result[0].roomType_ID;
//       maxId = parseInt(lastRoomTypeId.slice(-6)) || 0;
//     }
//     const num = maxId + 1;
//     const newRoomTypeID = "RTY" + String(num).padStart(6, "0");

//     const roomTypeChecked = await checkRoomType(roomTypeName);
//     if (roomTypeChecked) {
//       return res.status(400).json({ error: "มีประเภทห้องนี้อยู่แล้ว" });
//     }
//     const statusRoomType = "STA000006";

//     ///////บันทึกลงฐานข้อมูล//////////
//     const insertQuery = `
//       INSERT INTO roomType
//       (roomType_ID, roomType_name)
//       VALUES (?, ?, ?)
//     `;
//     await db.promise().query(insertQuery, [newRoomTypeID, roomTypeName, statusRoomType]);

//     res.status(201).json({ message: "ลงทะเบียนประเภทห้องสำเร็จแล้ว!" });
//   } catch (err) {
//     console.error("เกิดข้อผิดพลาด:", err);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
//   }
// };

// ///////////function/////////////
// ////////////////////////////////
// async function checkRoomType(roomTypeName) {
//   try {
//     const query = "SELECT COUNT(*) as count FROM roomType WHERE roomType_name = ?";
//     const [rows] = await db.promise().query(query, [roomTypeName]);
//     return rows[0].count > 0;
//   } catch (err) {
//     console.error("ไม่สามารถตรวจสอบชื่อประเภทห้องได้:", err);
//     throw err;
//   }
// }

// //////////////API//////////////
// /////////getAutoidRoomType//////
// ///////////////////////////////
// const getAutotidRoomType = async (req, res) => {
//   try {
//     const query = "SELECT roomType_ID FROM roomType ORDER BY roomType_ID DESC LIMIT 1";
//     const [result] = await db.promise().query(query);
//     let maxId;
//     if (result.length === 0) {
//       maxId = 0;
//     } else {
//       const lastRoomTypeId = result[0].roomType_ID;
//       maxId = parseInt(lastRoomTypeId.slice(-6)) || 0;
//     }
//     const num = maxId + 1;
//     const ID = "RTY" + String(num).padStart(6, "0");
//     res.status(200).json(ID);
//   } catch (err) {
//     console.error("เกิดข้อผิดพลาด:", err);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
//   }
// };

// //////////////API//////////////
// //////////getRoomType///////////
// ///////////////////////////////
// const getRoomType = async (req, res) => {
//   try {
//     const query = `
//     SELECT  
//       roomType_ID, 
//       roomType_name
//     FROM 
//       roomType
//     `;
//     const [result] = await db.promise().query(query);
//     res.status(200).json(result);
//   } catch (err) {
//     console.error("เกิดข้อผิดพลาด:", err);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
//   }
// };

// //////////////API//////////////
// //////getRoomTypeByID//////////
// ///////////////////////////////
// const getRoomTypeByID = async (req, res) => {
//   try {
//     const roomTypeID = req.query.ID;
//     if (!roomTypeID) {
//       return res.status(400).json({ error: "โปรดระบุ ID" });
//     }
//     const query = `
//     SELECT 
//       roomType_ID, 
//       roomType_name,
//       status
//     FROM 
//       roomType 
//     WHERE roomType_ID = ?
//     `;
//     const [result] = await db.promise().query(query, [roomTypeID]);
//     if (result.length === 0) {
//       return res.status(404).json({ error: "ไม่พบข้อมูลประเภทห้อง" });
//     }
//     res.status(200).json(result[0]);
//   } catch (err) {
//     console.error("เกิดข้อผิดพลาด:", err);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
//   }
// };

// //////////////API//////////////
// //////////updateRoomType////////
// ///////////////////////////////
// const updateRoomType = async (req, res) => {
//   const roomTypeID = req.query.ID;
//   const { roomTypeName } = req.body;

//   try {
//     if (!roomTypeID) {
//       return res.status(400).json({ error: "โปรดระบุ ID" });
//     }
//     const [roomTypeCheck] = await db.promise().query("SELECT * FROM roomType WHERE roomType_ID = ?", [roomTypeID]);
//     if (roomTypeCheck.length === 0) {
//       return res.status(404).json({ error: "ไม่พบข้อมูลประเภทห้อง" });
//     }
//     const roomTypeNameChecked = await checkRoomType(roomTypeName);
//     if (roomTypeNameChecked) {
//       return res.status(400).json({ error: "มีประเภทห้องนี้อยู่แล้ว" });
//     }
//     const updateQuery = `
//       UPDATE roomType SET
//         roomType_name = ?
//       WHERE roomType_ID = ?
//     `;
//     await db.promise().query(updateQuery, [roomTypeName, roomTypeID]);
//     res.status(200).json({ message: "อัปเดตข้อมูลประเภทห้องเรียบร้อยแล้ว" });
//   } catch (err) {
//     console.error("เกิดข้อผิดพลาด:", err);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
//   }
// };

// // ฟังก์ชันสำหรับอัปเดตสถานะประเภทห้อง
// const updateStatusRoomType = async (req, res) => {
//   const { ID, statusID } = req.body; 
//   try {
//     if (!ID || !statusID) {
//       return res.status(400).json({ error: "กรุณาระบุ ID และ statusID" });
//     }
//     const [roomTypeCheck] = await db.promise().query("SELECT * FROM roomType WHERE roomType_ID = ?", [ID]);
//     if (roomTypeCheck.length === 0) {
//       return res.status(404).json({ error: "ไม่พบข้อมูลประเภทห้องที่ต้องการอัปเดต" });
//     }

//     const updateQuery = "UPDATE roomType SET status = ? WHERE roomType_ID = ?";
//     await db.promise().query(updateQuery, [statusID, ID]);

//     res.status(200).json({ message: "อัปเดตสถานะประเภทห้องเรียบร้อยแล้ว" });
//   } catch (err) {
//     console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะประเภทห้อง:", err);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
//   }
// };

// const getDeletableRoomTypes = async (req, res) => {
//   try {
//     const query = 'SELECT * FROM status WHERE stat_StatTypID = "STT000002"'; 
//     const [result] = await db.promise().query(query);
//     res.status(200).json(result);
//   } catch (err) {
//     console.error("เกิดข้อผิดพลาด:", err);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
//   }
// };

// module.exports = {
//   registerRoomType,
//   getRoomType,
//   getRoomTypeByID,
//   getAutotidRoomType,
//   updateRoomType,
//   updateStatusRoomType,
//   getDeletableRoomTypes
// };
