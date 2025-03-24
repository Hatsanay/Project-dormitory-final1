// const db = require("../config/db");
// require("dotenv").config();

// //////////////API//////////////
// //////////registerAirconditioner////////
// ///////////////////////////////
// const registerAirconditioner = async (req, res) => {
//   const { model, warranty, serial } = req.body;

//   try {
//     ////////////Autoid/////////////
//     const query = "SELECT air_ID FROM airconditioner ORDER BY air_ID DESC LIMIT 1";
//     const [result] = await db.promise().query(query);
//     let maxId;
//     if (result.length === 0) {
//       maxId = 0;
//     } else {
//       const lastAirId = result[0].air_ID;
//       maxId = parseInt(lastAirId.slice(-6)) || 0;
//     }
//     const num = maxId + 1;
//     const newAirID = "AIR" + String(num).padStart(6, "0");

//     // Check if an air conditioner with the same serial already exists
//     const airChecked = await checkAirconditioner(serial);
//     if (airChecked) {
//       return res.status(400).json({ error: "มีเครื่องปรับอากาศที่มีหมายเลขซีเรียลนี้อยู่แล้ว" });
//     }
//     const statusAirconditioner = "STA000006";

//     ///////บันทึกลงฐานข้อมูล//////////
//     const insertQuery = `
//       INSERT INTO airconditioner
//       (air_ID, model, warranty, serial, status)
//       VALUES (?, ?, ?, ?, ?)
//     `;
//     await db.promise().query(insertQuery, [newAirID, model, warranty, serial, statusAirconditioner]);

//     res.status(201).json({ message: "ลงทะเบียนเครื่องปรับอากาศสำเร็จแล้ว!" });
//   } catch (err) {
//     console.error("เกิดข้อผิดพลาด:", err);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
//   }
// };

// ///////////function/////////////
// ////////////////////////////////
// async function checkAirconditioner(serial) {
//   try {
//     const query = "SELECT COUNT(*) as count FROM airconditioner WHERE serial = ?";
//     const [rows] = await db.promise().query(query, [serial]);
//     return rows[0].count > 0;
//   } catch (err) {
//     console.error("ไม่สามารถตรวจสอบหมายเลขซีเรียลได้:", err);
//     throw err;
//   }
// }

// //////////////API//////////////
// ///////////getAutotid///////////
// ///////////////////////////////
// const getAutotidAirconditioner = async (req, res) => {
//   try {
//     const query = "SELECT air_ID FROM airconditioner ORDER BY air_ID DESC LIMIT 1";
//     const [result] = await db.promise().query(query);
//     let maxId;
//     if (result.length === 0) {
//       maxId = 0;
//     } else {
//       const lastAirId = result[0].air_ID;
//       maxId = parseInt(lastAirId.slice(-6)) || 0;
//     }
//     const num = maxId + 1;
//     const ID = "AIR" + String(num).padStart(6, "0");
//     res.status(200).json(ID);
//   } catch (err) {
//     console.error("เกิดข้อผิดพลาด:", err);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
//   }
// };

// //////////////API//////////////
// ///////////getAirconditioner/////////////
// ///////////////////////////////
// const getAirconditioner = async (req, res) => {
//   const air_ID = req.query.air_ID; // Get air_ID from the query parameters
//   try {
//     const query = `
//       SELECT  
//         airconditioner.air_ID, 
//         CONCAT(m.Name, ' ', b.Name , ' ' , airconditioner.serial) AS BrandModel,
//         airconditioner.waranty,
//         airconditioner.serial,
//         status
//       FROM 
//         airconditioner
//       INNER JOIN model AS m ON airconditioner.model = m.ID
//       INNER JOIN Brand AS b ON m.Brand = b.ID
//       INNER JOIN status AS s ON airconditioner.status = s.stat_ID
//       WHERE status = "STA000026" OR airconditioner.air_ID = ?;
//     `;
    
//     // Execute query with parameter
//     const [result] = await db.promise().query(query, [air_ID]); // Pass air_ID safely in an array

//     res.status(200).json(result); // Return the result as JSON
//   } catch (err) {
//     console.error("เกิดข้อผิดพลาด:", err);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" }); // Handle error
//   }
// };


// //////////////API//////////////
// ///////getAirconditionerByID/////////
// ///////////////////////////////
// const getAirconditionerByID = async (req, res) => {
//   try {
//     const airID = req.query.ID;
//     if (!airID) {
//       return res.status(400).json({ error: "โปรดระบุ ID" });
//     }
//     const query = `
//     SELECT 
//       air_ID, 
//       model,
//       waranty,
//       serial,
//       status
//     FROM 
//       airconditioner 
//     WHERE air_ID = ?
//     `;
//     const [result] = await db.promise().query(query, [airID]);
//     if (result.length === 0) {
//       return res.status(404).json({ error: "ไม่พบข้อมูลเครื่องปรับอากาศ" });
//     }
//     res.status(200).json(result[0]);
//   } catch (err) {
//     console.error("เกิดข้อผิดพลาด:", err);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
//   }
// };

// //////////////API//////////////
// //////////updateAirconditioner///////////
// ///////////////////////////////
// const updateAirconditioner = async (req, res) => {
//   const airID = req.query.ID;
//   const { model, warranty, serial } = req.body;

//   try {
//     if (!airID) {
//       return res.status(400).json({ error: "โปรดระบุ ID" });
//     }
//     const [airCheck] = await db.promise().query("SELECT * FROM airconditioner WHERE air_ID = ?", [airID]);
//     if (airCheck.length === 0) {
//       return res.status(404).json({ error: "ไม่พบข้อมูลเครื่องปรับอากาศ" });
//     }
//     const serialChecked = await checkAirconditioner(serial);
//     if (serialChecked) {
//       return res.status(400).json({ error: "มีเครื่องปรับอากาศที่มีหมายเลขซีเรียลนี้อยู่แล้ว" });
//     }
//     const updateQuery = `
//       UPDATE airconditioner SET
//         model = ?,
//         warranty = ?,
//         serial = ?
//       WHERE air_ID = ?
//     `;
//     await db.promise().query(updateQuery, [model, warranty, serial, airID]);
//     res.status(200).json({ message: "อัปเดตข้อมูลเครื่องปรับอากาศเรียบร้อยแล้ว" });
//   } catch (err) {
//     console.error("เกิดข้อผิดพลาด:", err);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
//   }
// };

// // ฟังก์ชันสำหรับอัปเดตสถานะเครื่องปรับอากาศ
// const updateStatusAirconditioner = async (req, res) => {
//   const { ID, statusID } = req.body; 
//   try {
//     if (!ID || !statusID) {
//       return res.status(400).json({ error: "กรุณาระบุ ID และ statusID" });
//     }
//     const [airCheck] = await db.promise().query("SELECT * FROM airconditioner WHERE air_ID = ?", [ID]);
//     if (airCheck.length === 0) {
//       return res.status(404).json({ error: "ไม่พบข้อมูลเครื่องปรับอากาศที่ต้องการอัปเดต" });
//     }

//     const updateQuery = "UPDATE airconditioner SET status = ? WHERE air_ID = ?";
//     await db.promise().query(updateQuery, [statusID, ID]);

//     res.status(200).json({ message: "อัปเดตสถานะเครื่องปรับอากาศเรียบร้อยแล้ว" });
//   } catch (err) {
//     console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะเครื่องปรับอากาศ:", err);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
//   }
// };

// const getDeletableAirconditioners = async (req, res) => {
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
//   registerAirconditioner,
//   getAirconditioner,
//   getAirconditionerByID,
//   getAutotidAirconditioner,
//   updateAirconditioner,
//   updateStatusAirconditioner,
//   getDeletableAirconditioners
// };
