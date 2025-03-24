const db = require("../config/db");
require("dotenv").config();

//////////////API//////////////
//////////registerStock/////////
///////////////////////////////
const registerStock = async (req, res) => {
  const { name, quantity, stock_unit_id, stock_type_stock_ID } = req.body;

  // Validate required fields
  if (!name || !quantity || !stock_unit_id || !stock_type_stock_ID) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }); // "Please fill in all fields"
  }

  try {
    //////////// Auto ID Generation ///////////
    const query = "SELECT ID FROM stock ORDER BY ID DESC LIMIT 1";
    const [result] = await db.promise().query(query);
    let maxId;
    if (result.length === 0) {
      maxId = 0;
    } else {
      const lastStockId = result[0].ID; // Ensure this is referencing the right field
      maxId = parseInt(lastStockId.slice(-6)) || 0; // Adjust slicing based on your ID format
    }
    const newStockID = "STK" + String(maxId + 1).padStart(6, "0");

    // Check if the stock already exists
    const stockChecked = await checkStock(name);
    if (stockChecked) {
      return res.status(400).json({ error: "มีชื่อวัสดุนี้อยู่แล้ว" }); // "This material name already exists"
    }

    const stock_statID = "SUS000001";
    /////// Insert into Database ///////
    const insertQuery = `
      INSERT INTO stock
      (ID, name, quantity, stock_unit_id, stock_type_stock_ID, stock_statID)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.promise().query(insertQuery, [newStockID, name, quantity, stock_unit_id, stock_type_stock_ID, stock_statID]);

    res.status(201).json({ message: "ลงทะเบียนวัสดุเรียบร้อยแล้ว!" }); // "Material registered successfully!"
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" }); // "An error occurred in the process"
  }
};


///////////function/////////////
////////////////////////////////
async function checkStock(name) {
  try {
    const query = "SELECT COUNT(*) as count FROM stock WHERE name = ?";
    const [rows] = await db.promise().query(query, [name]);
    return rows[0].count > 0;
  } catch (err) {
    console.error("ไม่สามารถตรวจสอบชื่อวัสดุได้:", err);
    throw err;
  }
}

//////////////API//////////////
///////////getAutotid///////////
///////////////////////////////
const getAutotidStock = async (req, res) => {
  try {
    const query = "SELECT ID FROM stock ORDER BY ID DESC LIMIT 1";
    const [result] = await db.promise().query(query);
    
    let maxId;
    if (result.length === 0) {
      maxId = 0;  // No records in the table, start at 0
    } else {
      const lastStockId = result[0].ID;  // Access the 'ID' directly
      maxId = parseInt(lastStockId.slice(-6)) || 0;  // Extract last 6 digits from ID and convert to number
    }
    
    const stockID = "STK" + String(maxId + 1).padStart(6, "0");  // Increment the max ID and pad with zeros
    res.status(200).json(stockID);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};


//////////////API//////////////
///////////getStock/////////////
///////////////////////////////
const getStockforstock = async (req, res) => {
  try {
    const query = `
    SELECT 
      stock.ID, 
      stock.name, 
      stock.quantity, 
      type_stock.name AS Type, 
      unit.name AS unit,
      stause.StaUse_Name as stat_Name,
      stock.stock_statID
    FROM 
      stock
    INNER JOIN type_stock ON stock.stock_type_stock_ID = type_stock.ID 
    INNER JOIN unit ON unit.ID = stock_unit_ID
    INNER JOIN stause ON stause.StaUse_ID = stock.stock_statID
    WHERE stock_statID = "SUS000001" `;
    
    const [result] = await db.promise().query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
///////getStockByID///////////
///////////////////////////////
const getStockByID = async (req, res) => {
  try {
    const ID = req.query.ID;
    if (!ID) {
      return res.status(400).json({ error: "โปรดระบุ ID วัสดุ" });
    }
    const query = `
      SELECT 
        ID, 
        name, 
        quantity, 
        stock_unit_id, 
        stock_type_stock_ID,
        stock_statID
      FROM 
        stock 
      WHERE ID = ?
    `;
    const [result] = await db.promise().query(query, [ID]);
    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลวัสดุ" });
    }
    res.status(200).json(result[0]);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
//////////updateStock///////////
///////////////////////////////
const updateStock = async (req, res) => {
  const ID = req.query.ID;
  const { newName, quantity, stock_unit_id, stock_type_stock_ID, } = req.body;

  try {
    if (!ID) {
      return res.status(400).json({ error: "โปรดระบุชื่อวัสดุ" });
    }
    const [stockCheck] = await db.promise().query("SELECT * FROM stock WHERE ID = ?", [ID]);
    if (stockCheck.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลวัสดุ" });
    }
    const updateQuery = `
      UPDATE stock SET
        name = ?, 
        quantity = ?, 
        stock_unit_id = ?, 
        stock_type_stock_ID = ?
      WHERE 
        ID = ?
    `;
    await db.promise().query(updateQuery, [newName , quantity, stock_unit_id, stock_type_stock_ID, ID]);
    res.status(200).json({ message: "อัปเดตข้อมูลวัสดุเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const updateStatusStock = async (req, res) => {
  const { ID, stock_statID } = req.body; 
  try {
    if (!ID || !stock_statID) {
      return res.status(400).json({ error: "กรุณาระบุ ID และ ID" });
    }
    const [itemCheck] = await db.promise().query("SELECT * FROM stock WHERE ID = ?", [ID]);
    if (itemCheck.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลวัสดุที่ต้องการอัปเดต" });
    }
    const updateQuery = "UPDATE stock SET stock_StatID = ? WHERE ID = ?";
    await db.promise().query(updateQuery, [stock_statID, ID]);

    res.status(200).json({ message: "อัปเดตข้อมูลวัสดุสำเร็จ" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตวัสดุ:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const getDeletableStock = async (req, res) => {
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
  registerStock,
  getStockforstock,
  getStockByID,
  getAutotidStock,
  updateStock,
  updateStatusStock,
  getDeletableStock
};
