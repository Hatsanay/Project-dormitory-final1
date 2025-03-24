const db = require('../config/db');
const bcrypt = require('bcrypt');
require('dotenv').config();


//////////////API//////////////
//////////registerStatus/////////
///////////////////////////////
const registerStatus = async (req, res) => {
  const { stat_Name, stat_StatTypID} = req.body;

  try {
    ////////////Autoid/////////////
    const query = "SELECT stat_ID FROM status ORDER BY stat_ID DESC LIMIT 1";
    const [result] = await db.promise().query(query);
    let maxId;
    if (result.length === 0) {
      maxId = 0;
    } else {
      const lastStatId = result[0].stat_ID;
      maxId = parseInt(lastStatId.slice(-6)) || 0;
    }
    const num = maxId + 1;
    const newStatID = "STA" + String(num).padStart(6, "0");
    const statusChecked = await checkStatus(stat_Name);
    if (statusChecked) {
      return res.status(400).json({ error: "มีชื่อสถานะนี้อยู่แล้ว" });
    }
    stat_stat_ID = "STA000006";
    ///////บันทึกลงฐานข้อมูล//////////
    const insertQuery = `
      INSERT INTO status
      (stat_ID, stat_Name, stat_StatTypID, stat_stat_ID)
      VALUES (?, ?, ?, ?)
    `;
    await db.promise().query(insertQuery, [newStatID, stat_Name, stat_StatTypID, stat_stat_ID]);

    res.status(201).json({ message: "ลงทะเบียนสถานะสำเร็จแล้ว!" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

///////////function/////////////
////////////////////////////////
async function checkStatus(stat_Name) {
  try {
    const query = "SELECT COUNT(*) as count FROM status WHERE stat_Name = ?";
    const [rows] = await db.promise().query(query, [stat_Name]);
    return rows[0].count > 0;
  } catch (err) {
    console.error("ไม่สามารถตรวจสอบ stat_Name ได้:", err);
    throw err;
  }
};

const getAutotidSta = async (req, res) => {
  try {
    const query = "SELECT stat_ID FROM status ORDER BY stat_ID DESC LIMIT 1";
    const [result] = await db.promise().query(query);
    let maxId;
    if (result.length === 0) {
      maxId = 0;
    } else {
      const lastStatId = result[0].stat_ID;
      maxId = parseInt(lastStatId.slice(-6)) || 0;
    }
    const num = maxId + 1;
    const newStatID = "STA" + String(num).padStart(6, "0");
    res.status(200).json(newStatID);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const getStatusByID = async (req, res) => {
  try {
    const statusID = req.query.ID;
    if (!statusID) {
      return res.status(400).json({ error: "โปรดระบุชื่อสถานะ" });
    }
    const query = `
    SELECT 
      stat_ID, 
      stat_name,
      stat_stat_ID,
      stat_StatTypID
    FROM 
	  status
    WHERE stat_ID = ?
    `;
    const [result] = await db.promise().query(query, [statusID]);
    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลสถานะ" });
    }
    res.status(200).json(result[0]);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};


const getStatusForView = async (req, res) => {
  try {
    const query = `
    SELECT 
      status.stat_ID,
      status.stat_Name AS Name,
      statustype.stat_Name AS sta_name,
      Sta.stat_Name AS stat,
      status.stat_stat_ID
    FROM  
      status
    INNER JOIN statustype on statustype.statTyp_ID = status.stat_StatTypID
    INNER JOIN status Sta on Sta.stat_ID = status.stat_stat_ID
    WHERE status.stat_stat_ID = "STA000006"
    `;
    const [result] = await db.promise().query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};


const getStatus = async (req, res) => {
    try {
      const query = "SELECT * FROM status ";
      const [result] = await db.promise().query(query);
      res.status(200).json(result);
    } catch (err) {
      console.error("เกิดข้อผิดพลาด:", err);
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
    }
  };

const getStatusUserDelete = async (req, res) => {
    try {
      const query = 'SELECT stausers.staUsers_ID AS stat_ID, stausers.staUsers_Name AS stat_Name FROM stausers';
      const [result] = await db.promise().query(query);
      res.status(200).json(result);
    } catch (err) {
      console.error("เกิดข้อผิดพลาด:", err);
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
    }
  };

  const updateStatus = async (req, res) => {
    const ID = req.query.ID;
    const { newName, stat_StatTypID,  } = req.body;
  
    try {
      if (!ID) {
        return res.status(400).json({ error: "โปรดระบุIDวัสดุ" });
      }
      const [stockCheck] = await db.promise().query("SELECT * FROM status WHERE stat_ID = ?", [ID]);
      if (stockCheck.length === 0) {
        return res.status(404).json({ error: "ไม่พบข้อมูลสถานะ" });
      }
      const updateQuery = `
        UPDATE status SET
          stat_Name = ?, 
          stat_StatTypID = ?
        WHERE 
          stat_ID = ?
      `;
      await db.promise().query(updateQuery, [newName , stat_StatTypID, ID]);
      res.status(200).json({ message: "อัปเดตข้อมูลวัสดุเรียบร้อยแล้ว" });
    } catch (err) {
      console.error("เกิดข้อผิดพลาด:", err);
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
    }
  };

  const updateStatusSta = async (req, res) => {
    const { ID, statusID } = req.body; 
    try {
      if (!ID || !statusID) {
        return res.status(400).json({ error: "กรุณาระบุ ID และ statusID" });
      }
      const [itemCheck] = await db.promise().query("SELECT * FROM status WHERE stat_ID = ?", [ID]);
      if (itemCheck.length === 0) {
        return res.status(404).json({ error: "ไม่พบข้อมูลรายการที่ต้องการอัปเดต" });
      }
      const updateQuery = "UPDATE status SET stat_stat_ID = ? WHERE stat_ID = ?";
      await db.promise().query(updateQuery, [statusID, ID]);
      res.status(200).json({ message: "อัปเดตสถานะเรียบร้อยแล้ว" });
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ:", err);
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
    }
  };
  const getDeletableStatus = async (req, res) => {
    try {
      const query = 'SELECT * FROM status WHERE stat_StatTypID = "STT000002"'; 
      const [result] = await db.promise().query(query);
      res.status(200).json(result);
    } catch (err) {
      console.error("เกิดข้อผิดพลาด:", err);
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
    }
  };
  
  
module.exports = {
  registerStatus,
  getStatus,
  getStatusUserDelete,
  getStatusForView,
  getStatusByID,
  getAutotidSta,
  updateStatus,
  updateStatusSta,
  getDeletableStatus};