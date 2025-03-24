const db = require("../config/db");
require("dotenv").config();

//////////////API//////////////
//////////registerStatusType/////////
///////////////////////////////
const registerStatusType = async (req, res) => {
  const { stat_Name } = req.body;

  try {
    ////////////Autoid/////////////
    const query = "SELECT statTyp_ID FROM statustype ORDER BY statTyp_ID DESC LIMIT 1";
    const [result] = await db.promise().query(query);
    let maxId;
    if (result.length === 0) {
      maxId = 0;
    } else {
      const lastStatusTypeId = result[0].statTyp_ID;
      maxId = parseInt(lastStatusTypeId.slice(-6)) || 0;
    }
    const num = maxId + 1;
    const newStatusTypeID = "STT" + String(num).padStart(6, "0");

    const statusTypeChecked = await checkStatusType(stat_Name);
    if (statusTypeChecked) {
      return res.status(400).json({ error: "มีชื่อประเภทสถานะนี้อยู่แล้ว" });
    }
    const statTyp_stat_ID = "STA000006";


    ///////บันทึกลงฐานข้อมูล//////////
    const insertQuery = `
      INSERT INTO statustype
      (statTyp_ID, stat_Name,statTyp_stat_ID)
      VALUES (?, ?, ?)
    `;
    await db.promise().query(insertQuery, [newStatusTypeID, stat_Name,statTyp_stat_ID 
    ]);

    res.status(201).json({ message: "ลงทะเบียนประเภทสถานะสำเร็จแล้ว!" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

///////////function/////////////
////////////////////////////////
async function checkStatusType(stat_Name) {
  try {
    const query = "SELECT COUNT(*) as count FROM statustype WHERE stat_Name = ?";
    const [rows] = await db.promise().query(query, [stat_Name]);
    return rows[0].count > 0;
  } catch (err) {
    console.error("ไม่สามารถตรวจสอบชื่อประเภทสถานะได้:", err);
    throw err;
  }
}

//////////////API//////////////
///////////getAutotid///////////
///////////////////////////////
const getAutotidStatusType = async (req, res) => {
  try {
    const query = "SELECT statTyp_ID FROM statustype ORDER BY statTyp_ID DESC LIMIT 1";
    const [result] = await db.promise().query(query);
    let maxId;
    if (result.length === 0) {
      maxId = 0;
    } else {
      const lastStatusTypeId = result[0].statTyp_ID;
      maxId = parseInt(lastStatusTypeId.slice(-6)) || 0;
    }
    const statusTypeID = "STT" + String(maxId + 1).padStart(6, "0");
    res.status(200).json(statusTypeID);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
///////////getStatusType/////////////
///////////////////////////////
const getStatusType = async (req, res) => {
  try {
    const query = `
    SELECT 
      statTyp_ID, 
      statustype.stat_Name AS Name,
      status.stat_Name,
      statustype.statTyp_stat_ID
    FROM 
      statustype
      INNER JOIN status ON status.stat_ID = statustype.statTyp_stat_ID
      WHERE statustype.statTyp_stat_ID = "STA000006"
      `;
    const [result] = await db.promise().query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
///////getStatusTypeByName/////////////
///////////////////////////////
const getStatusTypeByID = async (req, res) => {
  try {
    const statTyp_ID = req.query.ID;
    if (!statTyp_ID) {
      return res.status(400).json({ error: "โปรดระบุIDประเภทสถานะ" });
    }
    const query = `
      SELECT 
        statTyp_ID, 
        statustype.stat_Name AS Name,
        statTyp_stat_ID
      FROM 
        statustype 
      WHERE statTyp_ID = ?
    `;
    const [result] = await db.promise().query(query, [statTyp_ID]);
    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลประเภทสถานะ" });
    }
    res.status(200).json(result[0]);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
//////////updateStatusType///////////
///////////////////////////////
const updateStatusType = async (req, res) => {
  const statTyp_ID = req.query.ID;
  const { newStatName } = req.body;

  try {
    if (!statTyp_ID) {
      return res.status(400).json({ error: "โปรดระบุ ID ประเภทสถานะ" });
    }
    const [statusTypeCheck] = await db.promise().query("SELECT * FROM statustype WHERE statTyp_ID = ?", [statTyp_ID]);
    if (statusTypeCheck.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลประเภทสถานะ" });
    }

    const updateQuery = `
      UPDATE statustype SET
        stat_Name = ?
      WHERE statTyp_ID = ?
    `;
    await db.promise().query(updateQuery, [newStatName || stat_Name, statTyp_ID]);
    res.status(200).json({ message: "อัปเดตข้อมูลประเภทสถานะเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const updateStatusTypeStatus = async (req, res) => {
  const { statTyp_ID, statTyp_stat_ID } = req.body; 
  try {
    if (!statTyp_ID || !statTyp_stat_ID) {
      return res.status(400).json({ error: "กรุณาระบุ statTyp_ID และ status" });
    }
    const [itemCheck] = await db.promise().query("SELECT * FROM statustype WHERE statTyp_ID = ?", [statTyp_ID]);
    if (itemCheck.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลวัสดุที่ต้องการอัปเดต" });
    }
    const updateQuery = "UPDATE statustype SET statTyp_stat_ID = ? WHERE statTyp_ID = ?";
    await db.promise().query(updateQuery, [statTyp_stat_ID, statTyp_ID]);

    res.status(200).json({ message: "อัปเดตข้อมูลประเภทสถานะสำเร็จ" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูลประเภทสถานะ:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const getDeletableTypeStatus = async (req, res) => {
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
  registerStatusType,
  getStatusType,
  getStatusTypeByID,
  getAutotidStatusType,
  updateStatusType,
  getDeletableTypeStatus,
  updateStatusTypeStatus
};
