const db = require("../config/db");
require("dotenv").config();

//////////////API//////////////
//////////registerFloor////////
///////////////////////////////
const registerFloor = async (req, res) => {
  const { floorName } = req.body;

  try {
    ////////////Autoid/////////////
    const query = "SELECT floor_ID FROM floor ORDER BY floor_ID DESC LIMIT 1";
    const [result] = await db.promise().query(query);
    let maxId;
    if (result.length === 0) {
      maxId = 0;
    } else {
      const lastFloorId = result[0].floor_ID;
      maxId = parseInt(lastFloorId.slice(-6)) || 0;
    }
    const num = maxId + 1;
    const newFloorID = "FLO" + String(num).padStart(6, "0");

    const floorChecked = await checkFloor(floorName);
    if (floorChecked) {
      return res.status(400).json({ error: "มีชื่อชั้นนี้อยู่แล้ว" });
    }

    ///////บันทึกลงฐานข้อมูล//////////
    const insertQuery = `
      INSERT INTO floor
      (floor_ID, floor_name)
      VALUES (?, ?)
    `;
    await db.promise().query(insertQuery, [newFloorID, floorName]);

    res.status(201).json({ message: "ลงทะเบียนชั้นสำเร็จแล้ว!" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

///////////function/////////////
////////////////////////////////
async function checkFloor(floorName) {
  try {
    const query = "SELECT COUNT(*) as count FROM floor WHERE floor_name = ?";
    const [rows] = await db.promise().query(query, [floorName]);
    return rows[0].count > 0;
  } catch (err) {
    console.error("ไม่สามารถตรวจสอบชื่อชั้นได้:", err);
    throw err;
  }
}

//////////////API//////////////
///////////getAutotid///////////
///////////////////////////////
const getAutotidFloor = async (req, res) => {
  try {
    const query = "SELECT floor_ID FROM floor ORDER BY floor_ID DESC LIMIT 1";
    const [result] = await db.promise().query(query);
    let maxId;
    if (result.length === 0) {
      maxId = 0;
    } else {
      const lastFloorId = result[0].floor_ID;
      maxId = parseInt(lastFloorId.slice(-6)) || 0;
    }
    const num = maxId + 1;
    const ID = "FLO" + String(num).padStart(6, "0");
    res.status(200).json(ID);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
///////////getFloor/////////////
///////////////////////////////
const getFloor = async (req, res) => {
  try {
    const query = `
    SELECT  
      floor_ID, 
      floor_name
    FROM 
      floor
    `;
    const [result] = await db.promise().query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
///////getFloorByID////////////
///////////////////////////////
const getFloorByID = async (req, res) => {
  try {
    const floorID = req.query.ID;
    if (!floorID) {
      return res.status(400).json({ error: "โปรดระบุ ID" });
    }
    const query = `
    SELECT 
      floor_ID, 
      floor_name,
    FROM 
      floor 
    WHERE floor_ID = ?
    `;
    const [result] = await db.promise().query(query, [floorID]);
    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลชั้น" });
    }
    res.status(200).json(result[0]);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
//////////updateFloor///////////
///////////////////////////////
const updateFloor = async (req, res) => {
  const floorID = req.query.ID;
  const { floorName } = req.body;

  try {
    if (!floorID) {
      return res.status(400).json({ error: "โปรดระบุ ID" });
    }
    const [floorCheck] = await db.promise().query("SELECT * FROM floor WHERE floor_ID = ?", [floorID]);
    if (floorCheck.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลชั้น" });
    }
    const floorNameChecked = await checkFloor(floorName);
    if (floorNameChecked) {
      return res.status(400).json({ error: "มีชั้นนี้อยู่แล้ว" });
    }
    const updateQuery = `
      UPDATE floor SET
        floor_name = ?
      WHERE floor_ID = ?
    `;
    await db.promise().query(updateQuery, [floorName, floorID]);
    res.status(200).json({ message: "อัปเดตข้อมูลชั้นเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

// ฟังก์ชันสำหรับอัปเดตสถานะชั้น
const updateStatusFloor = async (req, res) => {
  const { ID, statusID } = req.body; 
  try {
    if (!ID || !statusID) {
      return res.status(400).json({ error: "กรุณาระบุ ID และ statusID" });
    }
    const [floorCheck] = await db.promise().query("SELECT * FROM floor WHERE floor_ID = ?", [ID]);
    if (floorCheck.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลชั้นที่ต้องการอัปเดต" });
    }

    const updateQuery = "UPDATE floor SET status = ? WHERE floor_ID = ?";
    await db.promise().query(updateQuery, [statusID, ID]);

    res.status(200).json({ message: "อัปเดตสถานะชั้นเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะชั้น:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const getDeletableFloors = async (req, res) => {
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
  registerFloor,
  getFloor,
  getFloorByID,
  getAutotidFloor,
  updateFloor,
  updateStatusFloor,
  getDeletableFloors
};
