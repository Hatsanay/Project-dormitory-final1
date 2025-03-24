const db = require("../config/db");
require("dotenv").config();

//////////////API//////////////
//////////registerRoom/////////
///////////////////////////////
const registerRoom = async (req, res) => {
  const {
    roomnumber,roomfloor
  } = req.body;
  try {
    //////////// Autoid /////////////
    const query = "SELECT room_ID FROM room ORDER BY room_ID DESC LIMIT 1";
    const [result] = await db.promise().query(query);
    let maxId;
    if (result.length === 0) {
      maxId = 0;
    } else {
      const lastRoomId = result[0].room_ID;
      maxId = parseInt(lastRoomId.slice(-6)) || 0;
    }
    const num = maxId + 1;
    const roomID = "ROM" + String(num).padStart(6, "0");
    const query2 = "SELECT floor_name FROM floor WHERE floor_ID = ?";
    const [result2] = await db.promise().query(query2, [roomfloor]);
  
    if (result2.length === 0) {
      throw new Error("No floor found with the given ID");
    }
    const floor = result2[0].floor_name;
    const roomforcheck = `${floor}${roomnumber}`;
    const Roomchecked = await checkRoom(roomforcheck);
    if (Roomchecked) {
      return res.status(400).json({ error: "ชั้นนี้มีเลขห้องนี้อยู่แล้ว" });
    }
    const room_stat_ID = "STR000001";
    const room_status_ID = "SUS000001";

    /////// บันทึกลงฐานข้อมูล ///////
    const insertQuery = `
      INSERT INTO room
      (room_ID, room_floor, room_Number,room_stat_ID, room_status_ID)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.promise().query(insertQuery, [
      roomID,
      roomfloor,
      roomforcheck,
      room_stat_ID,
      room_status_ID
    ]);
    res.status(201).json({ message: "ลงทะเบียนห้องพักสำเร็จ" });
      
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

/////////// function checkRoom ///////////
async function checkRoom(roomforcheck) {
  try {
    const query = `
      SELECT COUNT(*) AS count 
      FROM room 
      JOIN floor ON room.room_floor = floor.floor_ID 
      WHERE room.room_Number = ?
    `;
    const [rows] = await db.promise().query(query, [roomforcheck]);
    return rows[0].count > 0;
  } catch (err) {
    console.error("ไม่สามารถตรวจสอบได้:", err);
    throw err;
  }
}

////////////// API: getAutotidRoom //////////////
const getAutotidRoom = async (req, res) => {
  try {
    const query = "SELECT room_ID FROM room ORDER BY room_ID DESC LIMIT 1";
    const [result] = await db.promise().query(query);
    let maxId;
    if (result.length === 0) {
      maxId = 0;
    } else {
      const lastRoomId = result[0].room_ID;
      maxId = parseInt(lastRoomId.slice(-6)) || 0;
    }
    const num = maxId + 1;
    const roomID = "ROM" + String(num).padStart(6, "0");
    res.status(200).json(roomID);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API/////////////
/////////getRoom//////////////
///////////////////////////////
const getRoom = async (req, res) => {
  try {
    const query = `SELECT
    room.room_ID, 
    room.room_Number, 
    room.room_Number AS room,
    floor.floor_name,
    room.room_floor,
    staroom.StaRoom_Name AS room_stat_Name,
    stause.StaUse_Name AS room_status_Name,
    room.room_status_ID
FROM
    room
INNER JOIN
    floor ON room.room_floor = floor.floor_ID
INNER JOIN
    staroom ON room.room_stat_ID = staroom.StaRoom_ID
INNER JOIN
    stause  ON room.room_status_ID = stause.StaUse_ID
WHERE room.room_status_ID = 'SUS000001';
    `;
    const [result] = await db.promise().query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
///////getRoomByNumber/////////
///////////////////////////////
const getRoomByNumber = async (req, res) => {
  try {
    const roomID = req.query.ID;
    if (!roomID) {
      return res.status(400).json({ error: "โปรดระบุเลข ID" });
    }
    const query = ` 
      SELECT
    room.room_ID, 
    room.room_Number, 
    room.room_Number AS room,
    floor.floor_name,
    room.room_floor,
    staroom.StaRoom_Name AS room_stat_Name,
    stause.StaUse_Name AS room_status_Name,
    room.room_status_ID
FROM
    room
INNER JOIN
    floor ON room.room_floor = floor.floor_ID
INNER JOIN
    staroom ON room.room_stat_ID = staroom.StaRoom_ID
INNER JOIN
    stause  ON room.room_status_ID = stause.StaUse_ID
      WHERE
        room.room_ID = ?
    `;
    const [result] = await db.promise().query(query, [roomID]);
    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลห้องพัก" });
    }
    res.status(200).json(result[0]);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
//////////updateRoom///////////
///////////////////////////////
const updateRoom = async (req, res) => {
  const roomID = req.query.ID;
  const { roomnumber,roomfloor} = req.body;

  try {
    if (!roomID) {
      return res.status(400).json({ error: "โปรดระบุ roomID" });
    }
    const [userCheck] = await db.promise().query("SELECT * FROM room WHERE room_ID = ?", [roomID]);
    if (userCheck.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลห้อง" });
    }
    const query2 = "SELECT floor_name FROM floor WHERE floor_ID = ?";
    const [result2] = await db.promise().query(query2, [roomfloor]);
    
    if (result2.length === 0) {
      throw new Error("No floor found with the given ID");
    }

    const floor = result2[0].floor_name;
    const roomforcheck = `${floor}${roomnumber}`;

    const updateQuery = `
      UPDATE room SET
        room_Number = ? 
      WHERE room_ID = ?
    `;
    await db.promise().query(updateQuery, [roomforcheck,roomID]);
    res.status(200).json({ message: "อัปเดตข้อมูลห้องพักเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
///////updateRoomStatus////////
///////////////////////////////
const updateRoomStatus = async (req, res) => {
  const { roomID, room_status_ID } = req.body;

  try {
    if (!roomID || !room_status_ID) {
      return res.status(400).json({ error: "กรุณาระบุ roomID และ room_stat_ID" });
    }
    const [userCheck] = await db.promise().query("SELECT * FROM room WHERE room_ID = ?", [roomID]);
    if (userCheck.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลห้องพัก" });
    }

    const updateQuery = "UPDATE room SET room_status_ID = ? WHERE room_ID = ?";
    await db.promise().query(updateQuery, [room_status_ID, roomID]);
  

    res.status(200).json({ message: "อัปเดตสถานะของห้องพักเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
//////////getStatusRoom////////
///////////////////////////////
const getStatusRoom = async (req, res) => {
  try {
    const query = 'SELECT StaRoom_ID as stat_ID ,StaRoom_Name as stat_Name FROM staroom ';
    const [result] = await db.promise().query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const getStatusRoomDelete = async (req, res) => {
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
  registerRoom,
  getAutotidRoom,
  getRoom,
  getRoomByNumber,
  updateRoom,
  updateRoomStatus,
  getStatusRoom,
  getStatusRoomDelete
};
