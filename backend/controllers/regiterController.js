const db = require("../config/db");
const bcrypt = require("bcrypt");
require("dotenv").config();

//////////////API//////////////
//////////registerUser/////////
///////////////////////////////
const registerUser = async (req, res) => {
  const {
    userFname,
    userLname,
    userEmail,
    userPhone,
    userHnumber,
    userGroup,
    userAlley,
    userRoad,
    user_ProvincesID,
    user_AmphuresID,
    user_TambonsID,
    userPost,
    userBdate,
    userDateAdd = new Date().toISOString(),
    userDateEdit = new Date().toISOString(),
    userRole_ID,
    userStatus_ID,
    username,
    password,
  } = req.body; //เพิ่มตัวแปลรับข้อมูลที่กรอกเขามา
  try {
    ////////////Autoid/////////////
    const query = "SELECT user_ID FROM users ORDER BY user_ID DESC LIMIT 1"; //หาว่ารหัสแถวสุดท้ายคืออะไร
    const [result] = await db.promise().query(query); //Call กับฐานข้อมูล
    let maxId; //ตัวแปลใข้เก็บรหัสท้ายสุด
    if (result.length === 0) {
      //Check ข้อมูล
      maxId = 0; //maxId = 0
    } else {
      const lastUserId = result[0].user_ID; //รหัสแถวท้ายสุด
      maxId = parseInt(lastUserId.slice(-6)) || 0; //ตัดสตริงเอา 6 ตัวหลัง เช่น USE000001 จะเป็น 000001 เก็บใน maxId
    }
    const num = maxId + 1; // maxId มา บวก 1
    const userID = "USE" + String(num).padStart(6, "0"); // สร้าง user_ID ใหม่ เช่น USE000001, USE000002

    const usernamechecked = await checkUsername(username); //Call กับ function checkUsername เพื่อหา True False ว่ามี usename อยู่แลวไหม
    if (usernamechecked) {
      return res.status(400).json({ error: "มี Username นี้อยู่แล้ว" });
    }

    ///////บันทึกลงฐานข้อมล//////////
    const hashedPassword = await bcrypt.hash(password, 10); //เข้ารหัส
    const insertQuery = `
            INSERT INTO users
            (user_ID, user_Fname, user_Lname, user_Email, user_Phone, user_Name, user_Password,
            user_Hnumber, user_Group, user_Alley, user_Road, user_Tambons_ID, user_Bdate, user_DateAdd,
            user_DateEdit, user_Role_ID, user_Status_ID)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    await db.promise().query(insertQuery, [
      userID,
      userFname,
      userLname,
      userEmail,
      userPhone,
      username,
      hashedPassword,
      userHnumber,
      userGroup,
      userAlley,
      userRoad,
      user_TambonsID,
      // userPost,
      userBdate,
      userDateAdd,
      userDateEdit,
      userRole_ID,
      userStatus_ID,
    ]);

    res.status(201).json({ message: "ลงทะเบียนผู้ใช้เรียบร้อยแล้ว!" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

///////////function/////////////
////////checkUsername///////////
////////////////////////////////
async function checkUsername(username) {
  try {
    /////หาจำนวนของ username////////
    const query = "SELECT COUNT(*) as count FROM users WHERE user_Name = ?";
    const [rows] = await db.promise().query(query, [username]);
    return rows[0].count > 0; // username มี มากกว่า 0 หรือไม่ ถ้ามี ส่ง True
  } catch (err) {
    console.error("ไม่สามารถตรวจสอบ username ddddได้:", err);
    console.error("ไม่สามารถตรวจสอบ username ddddได้:", err);
    throw err;
  }
}

//////////////API//////////////
///////////getAutotid///////////
///////////////////////////////
const getAutotid = async (req, res) => {
  try {
    ////////////Autoid/////////////
    const query = "SELECT user_ID FROM users ORDER BY user_ID DESC LIMIT 1"; //หาว่ารหัสแถวสุดท้ายคืออะไร
    const [result] = await db.promise().query(query); //Call กับฐานข้อมูล
    let maxId; //ตัวแปลใข้เก็บรหัสท้ายสุด
    if (result.length === 0) {
      //Check ข้อมูล
      maxId = 0; //maxId = 0
    } else {
      const lastUserId = result[0].user_ID; //รหัสแถวท้ายสุด
      maxId = parseInt(lastUserId.slice(-6)) || 0; //ตัดสตริงเอา 6 ตัวหลัง เช่น USE000001 จะเป็น 000001 เก็บใน maxId
    }
    const num = maxId + 1; // maxId มา บวก 1
    const userID = "USE" + String(num).padStart(6, "0"); // สร้าง user_ID ใหม่ เช่น USE000001, USE000002
    res.status(200).json(userID);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const getRole = async (req, res) => {
  try {
    const query = "SELECT role_id,role_Name FROM roles";
    const [result] = await db.promise().query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const getUser = async (req, res) => {
  try {
    // const query = 'SELECT user_ID,user_Fname,user_Lname,user_Email,user_Phone,user_Name,user_Hnumber,user_Group,user_Alley,user_Road,user_Provinces_ID,user_Amphures_ID,user_Tambons_ID,user_Bdate,user_DateAdd,user_DateEdit,user_Role_ID,	user_Status_ID FROM users';
    const query = `SELECT
      user_ID,
      user_Fname,
      user_Lname,
      user_Email,
      user_Phone,
      user_Name,
      user_Hnumber,
      user_Group,
      user_Alley,
      user_Road,
      thai_tambons.name_th AS user_Tambons,
      thai_amphures.name_th AS user_Amphures,
      thai_provinces.name_th AS user_Provinces,
      thai_tambons.zip_code AS user_Zipcode,
      CONCAT(user_Hnumber, ' ม.', user_Group, ' ', user_Alley, ' ', user_Road, ' ', thai_tambons.name_th, ' ', thai_amphures.name_th, ' ', thai_provinces.name_th, ' ', thai_tambons.zip_code) AS address, 
      user_Bdate,
      user_DateAdd,
      user_DateEdit,
      user_Role_ID,
      roles.role_Name as roleName,
      user_Status_ID,
      stausers.staUsers_Name
  FROM
      users
  INNER JOIN
      thai_tambons ON users.user_Tambons_ID = thai_tambons.id
  INNER JOIN
      thai_amphures ON thai_amphures.id = thai_tambons.amphure_id
  INNER JOIN
      thai_provinces ON thai_provinces.id = thai_amphures.province_id
  INNER JOIN
     stausers on stausers.staUsers_ID = user_Status_ID
  INNER JOIN
      roles ON users.user_Role_ID = roles.role_ID
  WHERE stausers.staUsers_ID  = "STU000001"
  `;

    const [result] = await db.promise().query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.query.id;

    if (!userId) {
      return res.status(400).json({ error: "โปรดระบุ id" });
    }

    const query = `SELECT
    user_ID,
    user_Fname,
    user_Lname,
    user_Email,
    user_Phone,
    user_Name,
    user_Hnumber,
    user_Group,
    user_Alley,
    user_Road,
    thai_tambons.id AS user_Tambons_ID,
    thai_amphures.id AS  user_Amphures_ID,
    thai_provinces.id AS  user_Provinces_ID,
    thai_tambons.name_th AS user_Tambons,
    thai_amphures.name_th AS user_Amphures,
    thai_provinces.name_th AS user_Provinces,
    thai_tambons.zip_code AS user_Zipcode,
    CONCAT(user_Hnumber, ' ม.', user_Group, ' ', user_Alley, ' ', user_Road, ' ', thai_tambons.name_th, ' ', thai_amphures.name_th, ' ', thai_provinces.name_th, ' ', thai_tambons.zip_code) AS address, 
    user_Bdate,
    user_DateAdd,
    user_DateEdit,
    user_Role_ID,
    roles.role_Name as roleName,
    user_Status_ID,
    stausers.staUsers_Name
FROM
    users
INNER JOIN
    thai_tambons ON users.user_Tambons_ID = thai_tambons.id
INNER JOIN
    thai_amphures ON thai_amphures.id = thai_tambons.amphure_id
INNER JOIN
    thai_provinces ON thai_provinces.id = thai_amphures.province_id
INNER JOIN
   stausers on stausers.staUsers_ID = user_Status_ID
INNER JOIN
    roles ON users.user_Role_ID = roles.role_ID
      WHERE
        user_ID = ?
    `;

    const [result] = await db.promise().query(query, [userId]);

    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลผู้ใช้" });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};


//////////////API//////////////
//////////updateUser///////////
///////////////////////////////
const updateUser = async (req, res) => {
  const userID = req.query.userID;
  const {
    userFname,
    userLname,
    userEmail,
    userPhone,
    userHnumber,
    userGroup,
    userAlley,
    userRoad,
    user_ProvincesID,
    user_AmphuresID,
    user_TambonsID,
    userPost,
    userBdate,
    userDateEdit = new Date().toISOString(),
    userRole_ID,
    userStatus_ID,
    username,
    password
  } = req.body;

  try {
    if (!userID) {
      return res.status(400).json({ error: 'โปรดระบุ userID' });
    }

 
    const [userCheck] = await db.promise().query("SELECT * FROM users WHERE user_ID = ?", [userID]);
    if (userCheck.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลผู้ใช้" });
    }

    // ตรวจสอบว่า username ที่ส่งมาใหม่ซ้ำกับ user ไหม
    if (username && username !== userCheck[0].user_Name) { //ตรวจสอบว่า username เดิม ซ้ำกับ username ที่ส่งมาไหม
      //ดึงข้อมูล ผู้ใช้ที่มี username เหมือนกัน
      const [usernameCheck] = await db.promise().query("SELECT * FROM users WHERE user_Name = ?", [username]);
      if (usernameCheck.length > 0) {
        return res.status(400).json({ error: "มี Username นี้อยู่แล้ว" });
      }
    }

    let hashedPassword = userCheck[0].user_Password; // หากไม่ได้เปลี่ยน password จะคงค่าเดิมเอาไว้
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updateQuery = `
      UPDATE users SET 
        user_Fname = ?, 
        user_Lname = ?, 
        user_Email = ?, 
        user_Phone = ?, 
        user_Name = ?, 
        user_Password = ?, 
        user_Hnumber = ?, 
        user_Group = ?, 
        user_Alley = ?, 
        user_Road = ?, 
        user_Tambons_ID = ?, 
        user_Bdate = ?, 
        user_DateEdit = ?, 
        user_Role_ID = ?, 
        user_Status_ID = ? 
      WHERE user_ID = ?
    `;
    await db.promise().query(updateQuery, [
      userFname,
      userLname,
      userEmail,
      userPhone,
      username || userCheck[0].user_Name,
      hashedPassword,
      userHnumber,
      userGroup,
      userAlley,
      userRoad,
      // user_ProvincesID,
      // user_AmphuresID,
      user_TambonsID,
      userBdate,
      userDateEdit,
      userRole_ID,
      userStatus_ID,
      userID
    ]);
    res.status(200).json({ message: "อัปเดตข้อมูลผู้ใช้เรียบร้อยแล้ว" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};



//////////////API//////////////
////updateUserStatus///////////
///////////////////////////////
const updateUserStatus = async (req, res) => {
  const { userID, userStatus_ID } = req.body;

  try {
 
    if (!userID || !userStatus_ID) {
      return res.status(400).json({ error: "กรุณาระบุ userID และ userStatus_ID" });
    }
    const [userCheck] = await db.promise().query("SELECT * FROM users WHERE user_ID = ?", [userID]);
    if (userCheck.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลผู้ใช้" });
    }

    const updateQuery = "UPDATE users SET user_Status_ID = ?, user_DateEdit = ? WHERE user_ID = ?";
    const EditDate = new Date().toISOString();
    await db.promise().query(updateQuery, [userStatus_ID, EditDate, userID]);

    res.status(200).json({ message: "อัปเดตสถานะของผู้ใช้เรียบร้อยแล้ว" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};






// const getUser = async (req, res) => {
//     try {
//         // สร้างคำสั่ง SQL สำหรับดึงข้อมูลผู้ใช้ทั้งหมดจากตาราง users
//         const query = 'SELECT user_ID, user_Fname, user_Lname, user_Email, user_Phone, user_Name, user_Bdate, user_DateAdd, user_DateEdit, user_Role_ID, user_Status_ID FROM users';
//         const [rows] = await db.promise().query(query);  // เรียกใช้งานคำสั่ง SQL ผ่าน db

//         res.status(200).json(rows);  // ส่งผลลัพธ์กลับไปในรูปแบบ JSON
//     } catch (err) {
//         console.error('เกิดข้อผิดพลาด:', err);
//         res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' });
//     }
// };

module.exports = { registerUser, getAutotid, getRole, getUser, getUserById, updateUser, updateUserStatus };
