const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

//////////////API//////////////
/////////////login/////////////
///////////////////////////////
const login = async (req, res) => {
  const { username, password, logsID, logsDatein, logsDateout, logsUser_ID } = req.body;

  const query =
    "SELECT * FROM users INNER JOIN roles on users.user_Role_ID = roles.role_ID WHERE user_Name  = ?"; //หาว่ามี username ไหม
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error("ข้อผิดพลาดในการสืบค้นฐานข้อมูล:", err);
      return res.status(500).json({ error: "ข้อผิดพลาดในการสืบค้นฐานข้อมูล" });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: "ไม่มีข้อมูลชื่อผู้ใข้นี้อยู่ในระบบ" });
    }

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.user_Password);
    if (!validPassword) {
      return res.status(401).json({ error: "โปรดกรอกรหัสผ่านใหม่อีกครั้ง" });
    }

    ///////////สร้าง JWT token/////////////
    const token = jwt.sign(
      { id: user.user_ID, username: user.user_Name,permissions: user.role_permissions, },
      process.env.JWT_SECRET,
      { expiresIn: "12h", algorithm: "HS256" }
    );

    ///////////Respons/////////////
    res.status(200).json({
      // id: user.user_ID,
      // username: user.user_Name,
      // roles: user.role_Name,
      // permissions: user.permission_name,
      token,
    });

    ///////////เก็บ Log/////////////
    // logs(logsID, logsDatein, logsDateout, logsUser_ID, user.user_ID);
  });
};

///////////Function Logs/////////////
// const logs = (logsID, logsDatein, logsDateout, logsUser_ID, userID) => {
//   const logQuery = "INSERT INTO logs (logsID, logsDatein, logsDateout, logsUser_ID, userID) VALUES (?, ?, ?, ?, ?)";
//   db.query(logQuery, [logsID, logsDatein, logsDateout, logsUser_ID, userID], (err, result) => {
//     if (err) {
//       console.error("Log insertion error:", err);
//     } else {
//       console.log("Log inserted successfully");
//     }
//   });
// };

module.exports = { login };
