const db = require("../config/db");
require("dotenv").config();
const multer = require("multer");
const path = require("path");

const AddLeaveRequest = async (req, res) => {
    const { user_id,startDate, endDate } = req.body;
    try {
      const query = "SELECT LeaveRequest_ID FROM leave_requests ORDER BY LeaveRequest_ID DESC LIMIT 1";
      const [result] = await db.promise().query(query);
      let maxId;
      if (result.length === 0) {
        maxId = 0;
      } else {
        const lastLeaveId = result[0].LeaveRequest_ID;
        maxId = parseInt(lastLeaveId.slice(-6)) || 0;
      }
      const num = maxId + 1;
      const leaveID = "LEV" + String(num).padStart(6, "0");
      const checkLeaveQuery = `
        SELECT * FROM leave_requests 
        WHERE User_ID = ? 
          AND ((start_date BETWEEN ? AND ?) OR (end_date BETWEEN ? AND ?))
          AND LeaveRequest_Sta = "SLR000001"
      `;
      const [leaveCheckResult] = await db
        .promise()
        .query(checkLeaveQuery, [user_id, startDate, endDate, startDate, endDate]);
      if (leaveCheckResult.length > 0) {
        return res.status(400).json({ error: "มีคำขอลาในช่วงเวลานี้แล้ว" });
      }
      // เพิ่มข้อมูลลงในฐานข้อมูล
      const LeaveRequest_Sta = 'SLR000001';
      const insertQuery = `
        INSERT INTO leave_requests 
        (LeaveRequest_ID, User_ID,start_date, end_date,LeaveRequest_Sta)
        VALUES (?, ?, ?, ?, ?)
      `;
      await db
        .promise()
        .query(insertQuery, [leaveID, user_id, startDate, endDate,LeaveRequest_Sta]);
      res.status(201).json({ message: "บันทึกวันลาเรียบร้อยเเล้ว"});
    } catch (err) {
      console.error("เกิดข้อผิดพลาด:", err);
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกวันลา" });
    }
  };

const getUserForLeaveRe = async (req, res) => {
    try {
        const query = `
        SELECT 
            user_ID,
            CONCAT(user_Fname, ' ', user_Lname) AS fullname,
            user_Role_ID,
            roles.role_Name
        FROM users
        JOIN roles ON roles.role_ID = users.user_Role_ID
        WHERE users.user_Role_ID != 'ROL000002';    
        `;    
          const [result] = await db.promise().query(query);
          res.status(200).json(result);
        } catch (err) {
          console.error("เกิดข้อผิดพลาด:", err);
          res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
        }
      };

    const getLeaveRe = async (req, res) => {
        try {
            const query = `
            SELECT 
                LeaveRequest_ID,
                leave_requests.User_ID,
                CONCAT(user_Fname, ' ', user_Lname) AS fullname,
                DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date, -- แสดงเฉพาะวันที่
                DATE_FORMAT(end_date, '%Y-%m-%d') AS end_date, -- แสดงเฉพาะวันที่
                LeaveRequest_Sta
            FROM leave_requests
            JOIN users ON users.user_ID = leave_requests.User_ID
            WHERE LeaveRequest_Sta = 'SLR000001'
            `;             
            const [result] = await db.promise().query(query);
            res.status(200).json(result);
        } catch (err) {
            console.error("เกิดข้อผิดพลาด:", err);
            res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
        }
    };

    const CancelLeave = async (req, res) => {
        const { leaveId } = req.query;  
        const LeaveRequest_Sta = "SLR000002";
    
        try {         
            const updateQuery = "UPDATE leave_requests SET LeaveRequest_Sta = ? WHERE LeaveRequest_ID = ?";
            const [result] = await db.promise().query(updateQuery, [LeaveRequest_Sta, leaveId]);
    
            if (result.affectedRows === 0) {
                return res.status(400).json({ error: "ไม่พบคำขอลานี้ หรือมีข้อผิดพลาดในการยกเลิก" });
            }
    
            res.status(200).json({ message: "ยกเลิกการลาสำเร็จ" }); 
        } catch (err) {
            console.error("เกิดข้อผิดพลาด:", err);
            res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
        }
    };  

  module.exports = {
    AddLeaveRequest,
    getUserForLeaveRe,
    getLeaveRe,
    CancelLeave
  };