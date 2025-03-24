const db = require("../config/db");
require("dotenv").config();
const multer = require("multer");
const path = require("path");

const setWeeklyHoliday = async (req, res) => {
  const { user_ID, days_off } = req.body;
  
  try {
    await db.promise().query(
      `INSERT INTO weekly_holidays (user_ID, days_off) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE days_off = ?`,
      [user_ID, JSON.stringify(days_off), JSON.stringify(days_off)]
    );

    res.json({ message: "บันทึกวันหยุดสำเร็จ" });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึก" });
  }
};

const getWeeklyHolidays = async (req, res) => {
    try {
        const query = `
        SELECT 
            weekly_holidays.user_ID,
            CONCAT(user_Fname, ' ', user_Lname) AS fullname,
            days_off 
        FROM weekly_holidays
        JOIN users ON users.user_ID = weekly_holidays.user_ID;
        `;    
          const [result] = await db.promise().query(query);
          res.status(200).json(result);
        } catch (err) {
          console.error("เกิดข้อผิดพลาด:", err);
          res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
        }
      };

      const getUserForHoliday = async (req, res) => {
        try {
            const query = `
            SELECT 
                user_ID,
                CONCAT(user_Fname, ' ', user_Lname) AS fullname,
                user_Role_ID
            FROM users
            JOIN roles ON roles.role_ID = users.user_Role_ID
            WHERE users.user_Status_ID = 'STU000001' and users.user_Role_ID != 'ROL000002';  
            `;    
              const [result] = await db.promise().query(query);
              res.status(200).json(result);
            } catch (err) {
              console.error("เกิดข้อผิดพลาด:", err);
              res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
            }
          };

  module.exports = {
    setWeeklyHoliday,
    getWeeklyHolidays,
    getUserForHoliday
  };