const db = require("../config/db");
require("dotenv").config();

//////////////API//////////////
//////////registerTypeStock/////////
///////////////////////////////
const registerTypeStock = async (req, res) => {
  const { name } = req.body;

  try {
    ////////////Autoid/////////////
    const query = "SELECT ID FROM type_stock ORDER BY ID DESC LIMIT 1";
    const [result] = await db.promise().query(query);
    let maxId;
    if (result.length === 0) {
      maxId = 0;
    } else {
      const lastTypeStockId = result[0].ID;
      maxId = parseInt(lastTypeStockId.slice(-6)) || 0;
    }
    const num = maxId + 1;
    const newTypeStockID = "TSK" + String(num).padStart(6, "0");

    const typeStockChecked = await checkTypeStock(name);
    if (typeStockChecked) {
      return res.status(400).json({ error: "มีชื่อประเภทวัสดุนี้อยู่แล้ว" });
    }
    const status = "SUS000001";
    ///////บันทึกลงฐานข้อมูล//////////
    const insertQuery = `
      INSERT INTO type_stock
      (ID, name ,status)
      VALUES (?, ?,?)
    `;
    await db.promise().query(insertQuery, [newTypeStockID, name,status]);

    res.status(201).json({ message: "ลงทะเบียนประเภทวัสดุสำเร็จแล้ว!" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

///////////function/////////////
////////////////////////////////
async function checkTypeStock(name) {
  try {
    const query = "SELECT COUNT(*) as count FROM type_stock WHERE name = ?";
    const [rows] = await db.promise().query(query, [name]);
    return rows[0].count > 0;
  } catch (err) {
    console.error("ไม่สามารถตรวจสอบชื่อประเภทวัสดุได้:", err);
    throw err;
  }
}

//////////////API//////////////
///////////getAutotid///////////
///////////////////////////////
const getAutotidTypeStock = async (req, res) => {
  try {
    const query = "SELECT ID FROM type_stock ORDER BY ID DESC LIMIT 1";
    const [result] = await db.promise().query(query);
    let maxId;
    if (result.length === 0) {
      maxId = 0;
    } else {
      const lastTypeStockId = result[0].ID;
      maxId = parseInt(lastTypeStockId.slice(-6)) || 0;
    }
    const typeStockID = "TSK" + String(maxId + 1).padStart(6, "0");
    res.status(200).json(typeStockID);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
///////////getTypeStock/////////////
///////////////////////////////
const getTypeStock = async (req, res) => {
  try {
    const query = `
    SELECT 
      ID, 
      name,
      stause.StaUse_Name as stat_Name,
      type_stock.status
    FROM 
      type_stock
    INNER JOIN stause ON stause.StaUse_ID = type_stock.status
    WHERE type_stock.status = 'SUS000001'`;
    const [result] = await db.promise().query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
///////getTypeStockByID/////////////
///////////////////////////////
const getTypeStockByID = async (req, res) => {
  try {
    const ID = req.query.ID;
    if (!ID) {
      return res.status(400).json({ error: "โปรดระบุ ID ประเภทวัสดุ" });
    }
    const query = `
      SELECT 
        ID, 
        name 
      FROM 
        type_stock 
      WHERE ID = ?
    `;
    const [result] = await db.promise().query(query, [ID]);
    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลประเภทวัสดุ" });
    }
    res.status(200).json(result[0]);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
//////////updateTypeStock///////////
///////////////////////////////
const updateTypeStock = async (req, res) => {
  const ID = req.query.ID;
  const { newName } = req.body;

  try {
    if (!ID) {
      return res.status(400).json({ error: "โปรดระบุชื่อประเภทวัสดุ" });
    }
    const [typeStockCheck] = await db.promise().query("SELECT * FROM type_stock WHERE ID = ?", [ID]);
    if (typeStockCheck.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลประเภทวัสดุ" });
    }

    const updateQuery = `
      UPDATE type_stock SET
        name = ?
      WHERE ID = ?
    `;
    await db.promise().query(updateQuery, [newName , ID]);
    res.status(200).json({ message: "อัปเดตข้อมูลประเภทวัสดุเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const updateStatusTypeStock = async (req, res) => {
  const { ID, status } = req.body; 
  try {
    if (!ID || !status) {
      return res.status(400).json({ error: "กรุณาระบุ ID และ status" });
    }
    const [itemCheck] = await db.promise().query("SELECT * FROM type_stock WHERE ID = ?", [ID]);
    if (itemCheck.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลประเภทวัสดุที่ต้องการอัปเดต" });
    }
    const updateQuery = "UPDATE type_stock SET status = ? WHERE ID = ?";
    await db.promise().query(updateQuery, [status, ID]);

    res.status(200).json({ message: "อัปเดตข้อมูลประเภทวัสดุสำเร็จ" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูลประเภทวัสดุ:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};


const getDeletableTypeStock = async (req, res) => {
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
  registerTypeStock,
  getTypeStock,
  getTypeStockByID,
  getAutotidTypeStock,
  updateTypeStock,
  updateStatusTypeStock,
  getDeletableTypeStock
};
