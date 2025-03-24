const db = require("../config/db");
require("dotenv").config();


//////////////API//////////////
//////////registerUnit/////////
///////////////////////////////
const registerUnit = async (req, res) => {
  const { unitName } = req.body;

  try {
    ////////////Autoid/////////////
    const query = "SELECT ID FROM unit ORDER BY ID DESC LIMIT 1";
    const [result] = await db.promise().query(query);
    let maxId;
    if (result.length === 0) {
      maxId = 0;
    } else {
      const lastUnitId = result[0].ID;
      maxId = parseInt(lastUnitId.slice(-6)) || 0;
    }
    const num = maxId + 1;
    const newUnitID = "UNT" + String(num).padStart(6, "0");

    const unitChecked = await checkUnit(unitName);
    if (unitChecked) {
      return res.status(400).json({ error: "มีชื่อหน่วยนี้อยู่แล้ว" });
    }
    const statusUnit = "SUS000001";

    ///////บันทึกลงฐานข้อมูล//////////
    const insertQuery = `
      INSERT INTO unit
      (ID, Name ,status)
      VALUES (?, ?, ?)
    `;
    await db.promise().query(insertQuery, [newUnitID, unitName,statusUnit]);

    res.status(201).json({ message: "ลงทะเบียนหน่วยสำเร็จแล้ว!" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

///////////function/////////////
////////////////////////////////
async function checkUnit(unitID) {
  try {
    const query = "SELECT COUNT(*) as count FROM unit WHERE ID = ?";
    const [rows] = await db.promise().query(query, [unitID]);
    return rows[0].count > 0;
  } catch (err) {
    console.error("ไม่สามารถตรวจสอบรหัสหน่วยได้:", err);
    throw err;
  }
}

//////////////API//////////////
///////////getAutotid///////////
///////////////////////////////
const getAutotidUnit = async (req, res) => {
  try {
    const query = "SELECT ID FROM unit ORDER BY ID DESC LIMIT 1";
    const [result] = await db.promise().query(query);
    let maxId;
    if (result.length === 0) {
      maxId = 0;
    } else {
      const lastUnitId = result[0].ID;
      maxId = parseInt(lastUnitId.slice(-6)) || 0;
    }
    const num = maxId + 1;
    const ID = "UNT" + String(num).padStart(6, "0");
    res.status(200).json(ID);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};



//////////////API//////////////
///////////getUnit/////////////
///////////////////////////////
const getUnit = async (req, res) => {
  try {
    const query = `
    SELECT  
      ID, 
	  Name ,
	  stause.StaUse_Name as stat_Name,
      unit.status
    FROM 
      unit
    INNER JOIN stause ON stause.StaUse_ID = unit.status
    WHERE unit.status = 'SUS000001'
    `;
    const [result] = await db.promise().query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
///////getUnitByID/////////////
///////////////////////////////
const getUnitByID = async (req, res) => {
  try {
    const unitID = req.query.ID;
    if (!unitID) {
      return res.status(400).json({ error: "โปรดระบุID" });
    }
    const query = `
    SELECT 
      ID, 
      name,
      status 
    FROM 
      unit 
    WHERE ID = ?
    `;
    const [result] = await db.promise().query(query, [unitID]);
    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลหน่วย" });
    }
    res.status(200).json(result[0]);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
//////////updateUnit///////////
///////////////////////////////
const updateUnit = async (req, res) => {
  const unitID = req.query.ID;
  const { unitname } = req.body;

  try {
    if (!unitID) {
      return res.status(400).json({ error: "โปรดระบุ ID" });
    }
    const [userCheck] = await db.promise().query("SELECT * FROM unit WHERE ID = ?", [unitID]);
    if (userCheck.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลหน่วย" });
    }
    const Roomchecked = await checkUnit(unitname);
    if (Roomchecked) {
      return res.status(400).json({ error: "มีหน่วยนี้อยู่แล้ว" });
    }
    const updateQuery = `
      UPDATE unit SET
        Name = ?
      WHERE ID = ?
    `;
    await db.promise().query(updateQuery, [unitname,unitID]);
    res.status(200).json({ message: "อัปเดตข้อมูลหน่วยพักเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

// ฟังก์ชันสำหรับอัปเดตสถานะหน่วย
const updateStatusUnit = async (req, res) => {
  const { ID, statusID } = req.body; 
  try {
    if (!ID || !statusID) {
      return res.status(400).json({ error: "กรุณาระบุ ID และ statusID" });
    }
    const [itemCheck] = await db.promise().query("SELECT * FROM unit WHERE ID = ?", [ID]);
    if (itemCheck.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลหน่วยที่ต้องการอัปเดต" });
    }

    const updateQuery = "UPDATE unit SET status = ? WHERE ID = ?";
    await db.promise().query(updateQuery, [statusID, ID]);

    res.status(200).json({ message: "อัปเดตสถานะหน่วยเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะหน่วย:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};
const getDeletableUnits = async (req, res) => {
  try {
    const query = 'SELECT * FROM stause '; 
    const [result] = await db.promise().query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};


module.exports = {
  registerUnit,
  getUnit,
  getUnitByID,
  getAutotidUnit,
  updateUnit,
  updateStatusUnit,
  getDeletableUnits
};
