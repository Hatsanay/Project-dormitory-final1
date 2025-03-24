const db = require('../config/db');
require('dotenv').config();

/////////// API ///////////
//////// registerRole ///////
////////////////////////////
const registerRole = async (req, res) => {
  const { role_Name ,permission_name} = req.body;
  try {
    const roleChecked = await checkRole(role_Name);
    if (roleChecked) {
      return res.status(400).json({ error: "มีชื่อบทบาทนี้อยู่แล้ว" });
    }
    const query2 = "SELECT role_ID FROM roles ORDER BY role_ID DESC LIMIT 1";
    const [result2] = await db.promise().query(query2);
    let maxId2;
    if (result2.length === 0) {
      maxId2 = 0;
    } else {
      const lastRoleId = result2[0].role_ID;
      maxId2 = parseInt(lastRoleId.slice(-6)) || 0;
    }
    const num2 = maxId2 + 1;
    const newRoleID = "ROL" + String(num2).padStart(6, "0");
    const role_Status_ID = "SUS000001"
    const insertQuery2 = `
      INSERT INTO roles
      (role_ID, role_Name, role_permissions, role_Status_ID)
      VALUES (?, ?, ?, ?)
    `;
    await db.promise().query(insertQuery2, [newRoleID, role_Name, permission_name, role_Status_ID]);

    res.status(201).json({ message: "ลงทะเบียนบทบาทสำเร็จแล้ว!" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};


async function checkRole(role_Name) {
  try {
    const query = "SELECT COUNT(*) as count FROM roles WHERE role_Name = ?";
    const [rows] = await db.promise().query(query, [role_Name]);
    return rows[0].count > 0;
  } catch (err) {
    console.error("ไม่สามารถตรวจสอบ role_Name ได้:", err);
    throw err;
  }
}

const getAutoRoleID = async (req, res) => {
  try {
    const query = "SELECT role_ID FROM roles ORDER BY role_ID DESC LIMIT 1";
    const [result] = await db.promise().query(query);
    let maxId;
    if (result.length === 0) {
      maxId = 0;
    } else {
      const lastRoleId = result[0].role_ID;
      maxId = parseInt(lastRoleId.slice(-6)) || 0;
    }
    const num = maxId + 1;
    const newRoleID = "ROL" + String(num).padStart(6, "0");
    res.status(200).json(newRoleID);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

// const getAutoPermissionID = async (req, res) => {
//   try {
//     const query = "SELECT permission_ID FROM permissions ORDER BY permission_ID DESC LIMIT 1";
//     const [result] = await db.promise().query(query);
//     let maxId;
//     if (result.length === 0) {
//       maxId = 0;
//     } else {
//       const lastPermissionId = result[0].permission_ID;
//       maxId = parseInt(lastPermissionId.slice(-6)) || 0;
//     }
//     const permissionID = "PER" + String(maxId + 1).padStart(6, "0");
//     res.status(200).json(permissionID);
//   } catch (err) {
//     console.error("เกิดข้อผิดพลาด:", err);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
//   }
// };


const getRoleByID = async (req, res) => {
  try {
    const roleID = req.query.ID;
    if (!roleID) {
      return res.status(400).json({ error: "โปรดระบุชื่อบทบาท" });
    }
    const query = `
  SELECT 
    role_ID,
    role_Name,
    role_permissions as permission_name,
    role_Status_ID
  FROM roles
    WHERE role_ID = ?
    `;
    const [result] = await db.promise().query(query, [roleID]);
    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลบทบาท" });
    }
    res.status(200).json(result[0]);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

/////// Get All Roles for View ////////
const getRolesForView = async (req, res) => {
  try {
    const query = `
  SELECT 
	role_ID,
    role_Name,
    role_permissions as permission_name,
    stause.StaUse_Name as stat_Name,
    role_Status_ID
  FROM roles
  INNER JOIN
      stause ON roles.role_Status_ID = stause.StaUse_ID
  WHERE role_Status_ID = 'SUS000001';
    `;
    const [result] = await db.promise().query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};
//////////////API//////////////
//////////updateRole////////////
///////////////////////////////
const updateRole = async (req, res) => {
  const role_ID = req.query.role_ID;
  const { role_name, permission_name,  } = req.body;
  try {
    const [roleCheck] = await db.promise().query("SELECT * FROM roles WHERE role_ID = ?", [role_ID]);
    if (roleCheck.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลบทบาท (Role)" });
    }
    const updateQuery = `
      UPDATE roles SET
        role_name = ?,
        role_permissions = ?
      WHERE role_ID = ?
    `;
    await db.promise().query(updateQuery, [
      role_name ,permission_name,role_ID 
    ]);
    res.status(200).json({ message: "อัปเดตข้อมูลบทบาทเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const updateStatusRole = async (req, res) => {
  const { role_ID, role_stat_ID } = req.body; 
  try {
    if (!role_ID || !role_stat_ID) {
      return res.status(400).json({ error: "กรุณาระบุ ID และ ID ของบทบาท" });
    }
    const [roleCheck] = await db.promise().query("SELECT * FROM roles WHERE role_ID = ?", [role_ID]);
    if (roleCheck.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลบทบาทที่ต้องการอัปเดต" });
    }
    const updateQuery = "UPDATE roles SET role_Status_ID = ? WHERE role_ID = ?";
    await db.promise().query(updateQuery, [role_stat_ID, role_ID]);

    res.status(200).json({ message: "อัปเดตข้อมูลบทบาทสำเร็จ" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตบทบาท:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};


const getDeletableRole = async (req, res) => {
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
  registerRole, 
  getRolesForView, 
  getRoleByID, 
  getAutoRoleID,
  updateRole,
  getDeletableRole,
  updateStatusRole
};
