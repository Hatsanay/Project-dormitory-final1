const db = require("../config/db");
require("dotenv").config();

////////////////////USER///////////////////////////

const getInprogressCount = async (req, res) => {
  try {
    const userId = req.query.id;
    if (!userId) {
      return res.status(400).json({ error: "โปรดระบุ id" });
    }

    const query = `
    SELECT 
    COUNT(CASE WHEN maintenancerequests.mainr_Stat_ID IN ("STA000011","STA000012","STA000013","STA000014","STA000015") THEN 1 END) AS InprogressCount,
    COUNT(CASE WHEN maintenancerequests.mainr_Stat_ID IN ("STA000014","STA000015") THEN 1 END) AS ScheduledCount,
    COUNT(CASE WHEN maintenancerequests.mainr_Stat_ID = "STC000006" THEN 1 END) AS CompletedCount,
    COUNT(*) AS TotalCount
    FROM 
      maintenancerequests
    INNER JOIN renting ON renting.renting_ID = maintenancerequests.mainr_renting_ID
    WHERE 
      renting.renting_user_ID = ?
    `;

    const [result] = await db.promise().query(query, [userId]);

    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลผู้ใช้" });
    }

    const data = result[0];
    const { InprogressCount, ScheduledCount, CompletedCount, TotalCount } = data;

    const inprogressPercent = TotalCount ? (InprogressCount / TotalCount) * 100 : 0;
    const scheduledPercent = TotalCount ? (ScheduledCount / TotalCount) * 100 : 0;
    const completedPercent = TotalCount ? (CompletedCount / TotalCount) * 100 : 0;

    res.status(200).json({
      InprogressCount,
      ScheduledCount,
      CompletedCount,
      TotalCount,
      inprogressPercent: inprogressPercent.toFixed(2), // ให้เป็นทศนิยม 2 ตำแหน่ง
      scheduledPercent: scheduledPercent.toFixed(2),
      completedPercent: completedPercent.toFixed(2),
    });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};


const getreqTimeLine= async (req, res) => {
  try {
    const userId = req.query.id;
    if (!userId) {
      return res.status(400).json({ error: "โปรดระบุ id" });
    }

    const query = `
    SELECT 
    maintenancerequests.mainr_Date AS date
    FROM 
      maintenancerequests
    INNER JOIN renting ON renting.renting_ID = maintenancerequests.mainr_renting_ID
    WHERE 
      renting.renting_user_ID = ?
    `;

    const [result] = await db.promise().query(query, [userId]);
    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};


module.exports = { getInprogressCount, getreqTimeLine };
