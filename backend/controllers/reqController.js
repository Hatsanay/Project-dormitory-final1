const db = require("../config/db");
require("dotenv").config();
const multer = require("multer");
const path = require("path");

const getReqById = async (req, res) => {
  try {
    const userId = req.query.id;

    if (!userId) {
      return res.status(400).json({ error: "โปรดระบุ id" });
    }

    const query = `
    SELECT
    mainr_ID,
    CONCAT(users.user_Fname, ' ', users.user_Lname) AS fullname,
    room.room_Number AS roomNumber,
    mainr_ProblemTitle,
    mainr_ProblemDescription,
    mainr_Date,
    petitiontype.Type AS Type,
    stacase.StaCase_Name AS status,
    mainr_Stat_ID AS status_ID,
    CONCAT(
        MIN(schedulerepairs.Date), ' ', 
        MIN(schedulerepairs.startTime), ' - ', 
        MIN(schedulerepairs.endTime)
    ) AS scheduleTime,
    MIN(schedulerepairs.Date) AS Date,
    MIN(schedulerepairs.startTime) AS startTime,
    MIN(schedulerepairs.endTime) AS endTime
FROM 
    maintenancerequests
    INNER JOIN renting ON renting.renting_ID = maintenancerequests.mainr_renting_ID
    INNER JOIN users ON users.user_ID = renting.renting_user_ID
    INNER JOIN petitiontype ON petitiontype.ID = maintenancerequests.mainr_pattyp_ID
    INNER JOIN stacase ON stacase.StaCase_ID = maintenancerequests.mainr_Stat_ID
    INNER JOIN room ON room.room_ID = renting.renting_room_ID
    LEFT JOIN schedulerepairs ON schedulerepairs.sdr_mainr_ID = maintenancerequests.mainr_ID
WHERE
    users.user_ID = ?
    AND maintenancerequests.mainr_Stat_ID NOT IN ('STC000007', 'STC000006', 'STC000008')
GROUP BY
    mainr_ID
ORDER BY
    maintenancerequests.mainr_ID ASC;
    `;
    //STC000007 = ยกเลิกการแจ้งซ่อม
    //STC000006 = เสร็จสิ้น
    //STC000008 = เจ้าหน้าที่ปฎิเสธคำร้อง

    const [result] = await db.promise().query(query, [userId]);

    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลการแจ้งซ่อม" });
    }
    const formattedResult = result.map((item) => ({
      ...item,
      mainr_Date:
        new Date(item.mainr_Date).toLocaleDateString("th-TH", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) +
        " " +
        new Date(item.mainr_Date).toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        }),
    }));

    res.status(200).json(formattedResult);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const getHisReqById = async (req, res) => {
  try {
    const userId = req.query.id;

    if (!userId) {
      return res.status(400).json({ error: "โปรดระบุ id" });
    }

    const query = `
        SELECT
        mainr_ID,
        CONCAT(users.user_Fname, ' ', users.user_Lname) AS fullname,
        room.room_Number AS roomNumber,
        mainr_ProblemTitle,
        mainr_ProblemDescription,
        mainr_Date,
        petitiontype.Type AS Type,
        stacase.StaCase_Name AS status,
        maintenancerequests.mainr_SuccessDate AS SuccessDate
      FROM 
        maintenancerequests
          INNER JOIN renting on renting.renting_ID = maintenancerequests.mainr_renting_ID
          INNER JOIN users on users.user_ID = renting.renting_user_ID
          INNER JOIN petitiontype on petitiontype.ID = mainr_pattyp_ID
          INNER JOIN stacase ON stacase.StaCase_ID = maintenancerequests.mainr_Stat_ID
          INNER JOIN room on room.room_ID = renting.renting_room_ID
      WHERE
        users.user_ID = ?
        AND (maintenancerequests.mainr_Stat_ID = "STC000006"
        OR maintenancerequests.mainr_Stat_ID = "STC000007"
        OR maintenancerequests.mainr_Stat_ID = "STC000008")
      ORDER BY
        maintenancerequests.mainr_ID ASC
    `;
    //STC000007 = ยกเลิกการแจ้งซ่อม
    //STC000006 = เสร็จสิ้น
    //STC000008 = เจ้าหน้าที่ปฎิเสธคำร้อง

    const [result] = await db.promise().query(query, [userId]);

    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลการแจ้งซ่อม" });
    }

    const formattedResult = result.map((item) => ({
      ...item,
      mainr_Date:
        new Date(item.mainr_Date).toLocaleDateString("th-TH", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) +
        " " +
        new Date(item.mainr_Date).toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      SuccessDate: item.SuccessDate
        ? new Date(item.SuccessDate).toLocaleDateString("th-TH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }) +
          " " +
          new Date(item.SuccessDate).toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : null,
    }));

    res.status(200).json(formattedResult);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const getUserByIdfromReq = async (req, res) => {
  try {
    const userId = req.query.id;
    if (!userId) {
      return res.status(400).json({ error: "โปรดระบุ id" });
    }

    const query = `
      SELECT 
        user_ID, user_Fname, user_Lname, renting.renting_ID, room.room_ID, room_Number, 
        CONCAT(user_Fname, ' ', user_Lname) AS fullname
      FROM users
      INNER JOIN renting on renting.renting_user_ID = users.user_ID
      INNER JOIN room on room.room_ID = renting.renting_room_ID
      WHERE users.user_ID = ?
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

const getPetitiontype = async (req, res) => {
  try {
    const query = `
      SELECT ID, Type, petitionType_stat_ID
      FROM petitiontype
      WHERE petitionType_stat_ID = 'SUS000001'
    `;
    const [result] = await db.promise().query(query);
    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true);
  } else {
    cb(new Error("ประเภทไฟล์ไม่รองรับ"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const submitRepairRequest = async (req, res) => {
  const { rentingID, reqPetitiontype, titleRepair, reqDetail } = req.body;
  const files = req.files;

  if (!titleRepair || !reqDetail) {
    return res
      .status(400)
      .json({ error: "หัวข้อและรายละเอียดการแจ้งซ่อมไม่สามารถเป็นค่าว่างได้" });
  }

  try {
    const query =
      "SELECT mainr_ID FROM maintenancerequests ORDER BY mainr_ID DESC LIMIT 1";
    const [result] = await db.promise().query(query);
    let maxId;
    if (result.length === 0) {
      maxId = 0;
    } else {
      const lastMainrId = result[0].mainr_ID;
      maxId = parseInt(lastMainrId.slice(-6)) || 0;
    }
    const num = maxId + 1;
    const mainr_ID = "MNR" + String(num).padStart(6, "0");

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // เพิ่ม 1 ให้กับเดือน เพราะ getMonth() ให้ค่าเริ่มจาก 0
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const reqDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const maintenanceQuery = `
      INSERT INTO maintenancerequests 
      (mainr_ID, mainr_ProblemTitle, mainr_ProblemDescription, mainr_Date, mainr_renting_ID, mainr_pattyp_ID, mainr_Stat_ID)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await db
      .promise()
      .query(maintenanceQuery, [
        mainr_ID,
        titleRepair,
        reqDetail,
        reqDate,
        rentingID,
        reqPetitiontype,
        "STC000001",
      ]);

    //STC000001 = รอนิติบุคคลตรวจสอบ

    if (files && files.length > 0) {
      const imageQuery = `
        INSERT INTO imagerequests (imges_ID, imges_Path, image_mainr_ID)
        VALUES (?, ?, ?)
      `;
      const [imgesResult] = await db
        .promise()
        .query(
          "SELECT imges_ID FROM imagerequests ORDER BY imges_ID DESC LIMIT 1"
        );
      let imgMaxId = 0;

      if (imgesResult.length > 0) {
        const lastImageId = imgesResult[0].imges_ID;
        imgMaxId = parseInt(lastImageId.slice(-6)) || 0;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imges_ID = "IMG" + String(imgMaxId + i + 1).padStart(6, "0"); // สร้าง ID ที่ไม่ซ้ำ
        await db
          .promise()
          .query(imageQuery, [imges_ID, file.filename, mainr_ID]);
      }
    }

    res.status(201).json({ message: "บันทึกคำขอซ่อมบำรุงสำเร็จ" });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการบันทึกคำขอซ่อมบำรุง:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกคำขอซ่อมบำรุง" });
  }
};

const getImgById = async (req, res) => {
  try {
    const reqId = req.query.id;

    if (!reqId) {
      return res.status(400).json({ error: "โปรดระบุ id" });
    }

    const query = `
    SELECT 
      imges_ID,
      imges_Path,
      image_mainr_ID
    FROM 
      imagerequests
    WHERE
      image_mainr_ID = ?
    `;

    const [result] = await db.promise().query(query, [reqId]);

    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลรูปภาพ" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//////////////API//////////////
//////////cancelReq///////////
///////////////////////////////
const cancelReq = async (req, res) => {
  const { mainr_ID, mainrstatus_ID = "STC000007" } = req.body; //STC000007 = ยกเลิกการแจ้งซ่อม

  try {
    if (!mainr_ID) {
      return res.status(400).json({ error: "โปรดระบุ mainr_ID" });
    }

    const updateQuery = `
      UPDATE maintenancerequests SET
      mainr_Stat_ID = ?
      WHERE mainr_ID = ?
    `;

    await db.promise().query(updateQuery, [mainrstatus_ID, mainr_ID]);

    res.status(200).json({ message: "ยกเลิกการแจ้งซ่อมเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const successReq = async (req, res) => {
  const { mainr_ID, mainrstatus_ID = "STC000006" } = req.body; //STC000006 = เสร็จสิ้น

  try {
    if (!mainr_ID) {
      return res.status(400).json({ error: "โปรดระบุ mainr_ID" });
    }

    const updateQuery = `
      UPDATE maintenancerequests SET
      mainr_Stat_ID = ?,
      mainr_SuccessDate = NOW()  -- เพิ่มเวลาปัจจุบันลงในฟิลด์ mainr_SuccessDate
      WHERE mainr_ID = ?
    `;

    await db.promise().query(updateQuery, [mainrstatus_ID, mainr_ID]);

    res.status(200).json({ message: "เสร็จสิ้นการแจ้งซ่อมเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const getroomByID = async (req, res) => {
  try {
    const userID = req.query.id;

    if (!userID) {
      return res.status(400).json({ error: "โปรดระบุ id" });
    }

    const query = `
    SELECT 
      renting_ID ,
      room.room_Number AS roomNumber
    FROM
      renting
      INNER JOIN room on room.room_ID = renting.renting_room_ID
    WHERE
      renting_user_ID = ?
      AND renting_stat_ID = "SRT000001"
    `;
    //STA000009 = เช่า

    const [result] = await db.promise().query(query, [userID]);

    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลดารเช่าห้อง" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

module.exports = {
  getReqById,
  getHisReqById,
  submitRepairRequest,
  upload,
  getUserByIdfromReq,
  getPetitiontype,
  getImgById,
  cancelReq,
  getroomByID,
  successReq,
};
