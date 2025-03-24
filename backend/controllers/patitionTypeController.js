const db = require("../config/db");
require("dotenv").config();

//////////////API//////////////
/////////registerPetitionType////////
//////////////////////////////////////
const registerPetitionType = async (req, res) => {
  const { petitionTypeName } = req.body;

  try {
    ////////////Autoid/////////////
    const query = "SELECT ID FROM petitiontype ORDER BY ID DESC LIMIT 1";
    const [result] = await db.promise().query(query);
    let maxId;
    if (result.length === 0) {
      maxId = 0;
    } else {
      const lastPetitionTypeId = result[0].ID;
      maxId = parseInt(lastPetitionTypeId.slice(-6)) || 0;
    }
    const num = maxId + 1;
    const newPetitionTypeID = "PTT" + String(num).padStart(6, "0");
    const statusPetitionType = "SUS000001";

    ///////บันทึกลงฐานข้อมูล//////////
    const insertQuery = `
      INSERT INTO petitiontype
      (ID, Type, petitionType_stat_ID)
      VALUES (?, ?, ?)
    `;
    await db.promise().query(insertQuery, [newPetitionTypeID, petitionTypeName, statusPetitionType]);

    res.status(201).json({ message: "ลงทะเบียนประเภทคำร้องสำเร็จแล้ว!" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

///////////function/////////////
////////////////////////////////
async function checkPetitionType(petitionTypeName) {
  try {
    const query = "SELECT COUNT(*) as count FROM petitiontype WHERE Type = ?";
    const [rows] = await db.promise().query(query, [petitionTypeName]);
    return rows[0].count > 0;
  } catch (err) {
    console.error("ไม่สามารถตรวจสอบชื่อประเภทคำร้องได้:", err);
    throw err;
  }
}

//////////////API//////////////
///////////getAutotid///////////
////////////////////////////////
const getAutotidPetitionType = async (req, res) => {
  try {
    const query = "SELECT ID FROM petitiontype ORDER BY ID DESC LIMIT 1";
    const [result] = await db.promise().query(query);
    let maxId;
    if (result.length === 0) {
      maxId = 0;
    } else {
      const lastPetitionTypeId = result[0].ID;
      maxId = parseInt(lastPetitionTypeId.slice(-6)) || 0;
    }
    const num = maxId + 1;
    const ID = "PTT" + String(num).padStart(6, "0");
    res.status(200).json(ID);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
///////////getPetitionType///////////
////////////////////////////////
const getPetitionTypeForView = async (req, res) => {
  try {
    const query = `
    SELECT  
      ID, 
      Type ,
      stause.StaUse_Name AS stat_Name,
      petitiontype.petitionType_stat_ID
    FROM 
      petitiontype
    INNER JOIN stause ON stause.StaUse_ID = petitiontype.petitionType_stat_ID
    WHERE petitiontype.petitionType_stat_ID = 'SUS000001'
    `;
    const [result] = await db.promise().query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
///////getPetitionTypeByID//////
////////////////////////////////
const getPetitionTypeByID = async (req, res) => {
  try {
    const petitionTypeID = req.query.ID;
    if (!petitionTypeID) {
      return res.status(400).json({ error: "โปรดระบุID" });
    }
    const query = `
    SELECT 
      ID, 
      Type,
      petitionType_stat_ID 
    FROM 
      petitiontype 
    WHERE ID = ?
    `;
    const [result] = await db.promise().query(query, [petitionTypeID]);
    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลประเภทคำร้อง" });
    }
    res.status(200).json(result[0]);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
//////////updatePetitionType////////
////////////////////////////////
const updatePetitionType = async (req, res) => {
  const petitionTypeID = req.query.ID;
  const { petitionTypeName } = req.body;

  try {
    if (!petitionTypeID) {
      return res.status(400).json({ error: "โปรดระบุ ID" });
    }
    const [typeCheck] = await db.promise().query("SELECT * FROM petitiontype WHERE ID = ?", [petitionTypeID]);
    if (typeCheck.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลประเภทคำร้อง" });
    }
    const nameChecked = await checkPetitionType(petitionTypeName);
    if (nameChecked) {
      return res.status(400).json({ error: "มีประเภทคำร้องนี้อยู่แล้ว" });
    }
    const updateQuery = `
      UPDATE petitiontype SET
        Type = ?
      WHERE ID = ?
    `;
    await db.promise().query(updateQuery, [petitionTypeName, petitionTypeID]);
    res.status(200).json({ message: "อัปเดตข้อมูลประเภทคำร้องเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

// ฟังก์ชันสำหรับอัปเดตสถานะประเภทคำร้อง
const updateStatusPetitionType = async (req, res) => {
  const { ID, statusID } = req.body; 
  try {
    if (!ID || !statusID) {
      return res.status(400).json({ error: "กรุณาระบุ ID และ statusID" });
    }
    const [itemCheck] = await db.promise().query("SELECT * FROM petitiontype WHERE ID = ?", [ID]);
    if (itemCheck.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลประเภทคำร้องที่ต้องการอัปเดต" });
    }

    const updateQuery = "UPDATE petitiontype SET petitionType_stat_ID = ? WHERE ID = ?";
    await db.promise().query(updateQuery, [statusID, ID]);

    res.status(200).json({ message: "อัปเดตสถานะประเภทคำร้องเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะประเภทคำร้อง:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const getDeletablePetitionTypes = async (req, res) => {
  try {
    const query = 'SELECT * FROM status WHERE stat_StatTypID = "SUS000002"'; 
    const [result] = await db.promise().query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

module.exports = {
  registerPetitionType,
  getPetitionTypeForView,
  getPetitionTypeByID,
  getAutotidPetitionType,
  updatePetitionType,
  updateStatusPetitionType,
  getDeletablePetitionTypes
};
