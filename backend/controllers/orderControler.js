const db = require("../config/db");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const getUserByIdfromOrder = async (req, res) => {
  try {
    const userId = req.query.id;
    if (!userId) {
      return res.status(400).json({ error: "โปรดระบุ id" });
    }

    const query = `
      SELECT 
        user_ID, user_Fname, user_Lname,
        CONCAT(user_Fname, ' ', user_Lname) AS fullname
      FROM users
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

// ฟังก์ชันในการอัปเดต max_id ในตาราง maxid
const updateMaxID = async (tableName, newMaxID) => {
  try {
    const query = `
      UPDATE maxid
      SET max_id = ?
      WHERE max_table = ?
    `;
    await db.promise().query(query, [newMaxID, tableName]);
  } catch (err) {
    console.error(`เกิดข้อผิดพลาดในการอัปเดต max_id สำหรับ ${tableName}:`, err);
    throw new Error(`ไม่สามารถอัปเดต max_id สำหรับ ${tableName}`);
  }
};

// ฟังก์ชันในการสร้าง Auto ID สำหรับ Order
const AutoIDorder = async () => {
  try {
    const query = 'CALL GenerateAutoID("orders")';
    const [result] = await db.promise().query(query);
    return result; // ส่งค่าไปที่ createOrder แทน
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    throw new Error("เกิดข้อผิดพลาดในการดำเนินการ"); // ส่ง error กลับไปที่ createOrder
  }
};

const createOrder = async (req, res) => {
  try {
    const { order_user_ID, date, total, items } = req.body;

    // พิมพ์ข้อมูลที่ส่งมาจาก frontend เพื่อให้ตรวจสอบ
    console.log("Received Order Data:", req.body);
    console.log("Items:", items);

    // เรียกใช้ AutoIDorder เพื่อดึง Order ID
    let orderIDResponse = await AutoIDorder();
    let orderID = orderIDResponse[0][0].AutoID;
    console.log("Generated Order ID:", orderID);

    // ตรวจสอบว่า order_ID ซ้ำกับที่มีอยู่ในฐานข้อมูลหรือไม่
    const checkOrderIDQuery =
      "SELECT COUNT(*) AS count FROM orders WHERE order_ID = ?";
    const [checkResult] = await db
      .promise()
      .query(checkOrderIDQuery, [orderID]);

    if (checkResult[0].count > 0) {
      orderIDResponse = await AutoIDorder();
      orderID = orderIDResponse[0][0].AutoID;
    }

    // บันทึกข้อมูลในตาราง orders
    const orderQuery = `
      INSERT INTO orders (order_ID, order_user_ID, date, order_stat_ID, total)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db
      .promise()
      .query(orderQuery, [
        orderID,
        order_user_ID,
        date,
        "SOD000002", // default status
        total,
      ]);

    await updateMaxID("orders", orderID);

    let countnumber = 1;
    // บันทึกรายการสินค้าในตาราง orderlist
    for (const item of items) {
      let orderlist_stock_ID = item.orderlist_stock_ID || null;

      // ตรวจสอบว่า unit เป็น NULL หรือไม่
      const unit = item.unit && item.unit.trim() !== "" ? item.unit : ""; // ถ้า unitname เป็น null หรือว่างให้เป็น ""

      // การใช้ค่าที่กรอกไปในฟอร์ม ถ้าผู้ใช้กรอกค่าใน orderlist_type_stock
      const orderlist_type_stock = item.orderlist_type_stock && item.orderlist_type_stock.trim() !== "" 
        ? item.orderlist_type_stock 
        : ""; // ไม่กำหนดค่าเริ่มต้น เพราะผู้ใช้กรอกไปแล้ว


      // บันทึกข้อมูลในตาราง orderlist
      const orderlistQuery = `
        INSERT INTO orderlist (number, orderlist_orders_ID, orderlist_stock_ID, stockname, quantity, unit, price, totalprice, status, orderlist_type_stock)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await db.promise().query(orderlistQuery, [
        countnumber,
        orderID,
        orderlist_stock_ID,
        item.stockname,
        item.quantity,
        unit,
        item.price,
        item.totalprice,
        "SOD000007",  // สถานะ
        orderlist_type_stock, // บันทึกค่าที่กรอกไป
      ]);

      countnumber++;
    }

    res.status(201).json({
      message: "ใบสั่งซื้อถูกสร้างขึ้นเรียบร้อยแล้ว",
      orderID: orderID,
    });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการสร้างใบสั่งซื้อ:", err);
    res.status(500).json({ error: err.message });
  }
};




// ฟังก์ชัน GenerateAutoID ที่จะสร้าง AutoID ใหม่

const GenerateAutoID = async (table_name) => {
  try {
    // กำหนด prefix วันที่เป็น ddmmyy
    const todayPrefix = new Date()
      .toLocaleDateString("en-GB")
      .replace(/\//g, "")
      .slice(0, 6);

    // ดึงค่า max_id ล่าสุดจากตาราง maxid ที่ตรงกับ table_name
    const [lastIdResult] = await db
      .promise()
      .query(
        "SELECT max_id FROM maxid WHERE max_table = ? ORDER BY max_id DESC LIMIT 1",
        [table_name]
      );

    let nextNumber = "001"; // เริ่มต้นที่ 001
    if (lastIdResult.length > 0) {
      const lastId = lastIdResult[0].max_id;

      // ตรวจสอบว่า last_id เป็นของวันเดียวกันหรือไม่
      if (lastId.startsWith(todayPrefix)) {
        // ถ้าใช่ให้เพิ่มหมายเลขถัดไป
        const lastNumber = parseInt(lastId.slice(6), 10);
        nextNumber = (lastNumber + 1).toString().padStart(3, "0");
      }
    }

    // สร้าง new_id ใหม่
    const newId = todayPrefix + nextNumber;
    return newId;
  } catch (err) {
    console.error("Error generating AutoID:", err);
    throw err;
  }
};

// // ฟังก์ชันในการสร้างใบสั่งซื้อ
// const createOrder = async (req, res) => {
//   try {
//     // ดึงข้อมูลจาก request body
//     const { order_user_ID, date, total, items } = req.body;

//     // เรียกใช้ GenerateAutoID เพื่อดึง Order ID
//     let orderID = await GenerateAutoID('orders');
//     console.log("Generated Order ID:", orderID); // ตรวจสอบข้อมูลที่ได้รับ

//     // ตรวจสอบว่า order_ID ซ้ำกับที่มีอยู่ในฐานข้อมูลหรือไม่
//     const checkOrderIDQuery =
//       "SELECT COUNT(*) AS count FROM orders WHERE order_ID = ?";
//     const [checkResult] = await db
//       .promise()
//       .query(checkOrderIDQuery, [orderID]);

//     if (checkResult[0].count > 0) {
//       // หาก order_ID ซ้ำ ให้เรียก GenerateAutoID ใหม่เพื่อสร้าง ID ใหม่
//       console.log("Order ID ซ้ำ! กำลังสร้าง Order ID ใหม่...");
//       orderID = await GenerateAutoID('orders');
//     }

//     // บันทึกข้อมูลในตาราง orders
//     const orderQuery = `
//         INSERT INTO orders (order_ID, order_user_ID, date, order_stat_ID, total)
//         VALUES (?, ?, ?, ?, ?)
//       `;
//     await db
//       .promise()
//       .query(orderQuery, [
//         orderID,
//         order_user_ID,
//         date,
//         (order_stat_ID = "SOD000002"),
//         total,
//       ]);

//     // อัปเดต max_id สำหรับ orders
//     await updateMaxID("orders", orderID);

//     let countnumber = 1;
//     // บันทึกรายการสินค้าในตาราง orderlist
//     for (const item of items) {
//       // บันทึกข้อมูลในตาราง orderlist
//       const orderlistQuery = `
//   INSERT INTO orderlist (number, orderlist_orders_ID, orderlist_stock_ID, stockname, quantity, unit, price, totalprice)
//   VALUES (?, ?, ?, ?, ?, ?, ?, ?)
// `;
//       await db
//         .promise()
//         .query(orderlistQuery, [
//           countnumber,
//           orderID,
//           item.orderlist_stock_ID,
//           item.stockname,
//           item.quantity,
//           item.unit,
//           item.price,
//           item.totalprice,
//         ]);

//       countnumber++;
//     }

//     // ส่งคำตอบกลับไปที่ฟรอนต์เอนด์
//     res.status(201).json({
//       message: "ใบสั่งซื้อถูกสร้างขึ้นเรียบร้อยแล้ว",
//       orderID: orderID, // ส่ง Order ID ที่สร้างใหม่กลับไป
//     });
//   } catch (err) {
//     console.error("เกิดข้อผิดพลาดในการสร้างใบสั่งซื้อ:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

const generateInvoicePDF = async (order, res) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  // กำหนดให้ PDF ส่งกลับไปยัง response
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");

  doc.pipe(res); // ส่งข้อมูล PDF ไปที่ Response

  // โหลดฟอนต์ที่รองรับภาษาไทย
  doc.registerFont("th-sarabun", "./fonts/THSarabunNew.ttf"); // ใช้ฟอนต์ที่รองรับไทย

  // ใส่ข้อความ "ใบสั่งซื้อ" ด้านบน
  doc
    .font("th-sarabun")
    .fontSize(28)
    .fillColor("#1d3557")
    .text("ใบสั่งซื้อ", { align: "center" });
  doc.moveDown(0.5);

  // ข้อมูลบริษัท
  doc
    .font("th-sarabun")
    .fontSize(12)
    .fillColor("#333")
    .text("บริษัท: ", { align: "left" });
  doc.text("ที่อยู่: ", { align: "left" });
  doc.text("โทรศัพท์: ", { align: "left" });
  doc.text("อีเมล: ", { align: "left" });
  doc.text("เว็บไซต์: ", { align: "left" });

  doc.moveDown(1);

  // ข้อมูลใบสั่งซื้อ
  doc
    .font("th-sarabun")
    .fontSize(12)
    .fillColor("#333")
    .text(`เลขที่ใบสั่งซื้อ: ${order.order_ID}`, { align: "left" });
  doc.text(`วันที่: ${order.date}`, { align: "left" });
  doc.text(`สถานะ: ${order.status}`, { align: "left" });

  doc.moveDown(1);

  // เส้นขอบ
  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .strokeColor("#e1e1e1")
    .lineWidth(1)
    .stroke(); // เส้นขอบด้านบนของรายการสินค้า

  // รายการสินค้า
  doc
    .font("th-sarabun")
    .fontSize(14)
    .fillColor("#1d3557")
    .text("รายการสินค้า:", { align: "left", underline: true });
  doc.moveDown(0.5);

  // สร้างหัวตาราง
  const tableTop = doc.y;
  const rowHeight = 20;
  const columnWidths = [50, 100, 180, 70, 100]; // กำหนดความกว้างของแต่ละคอลัมน์
  const columns = ["#", "สินค้า", "ราคา", "จำนวน", "รวม"];

  let currentY = tableTop;

  // วาดเส้นหัวตาราง
  columns.forEach((col, idx) => {
    doc
      .font("th-sarabun")
      .fontSize(12)
      .fillColor("#333")
      .text(col, columnWidths[idx] * idx + 50, currentY);
  });

  // วาดเส้นขอบหัวตาราง
  doc
    .moveTo(50, currentY + rowHeight)
    .lineTo(550, currentY + rowHeight)
    .strokeColor("#e1e1e1")
    .lineWidth(1)
    .stroke();

  // วาดเส้นและรายการสินค้า
  order.items.forEach((item, index) => {
    currentY += rowHeight;

    // วาดข้อมูลในแต่ละแถว
    doc
      .font("th-sarabun")
      .fontSize(12)
      .fillColor("#333")
      .text(index + 1, 50, currentY);
    doc.text(item.stockname, 100 + columnWidths[0], currentY);
    doc.text(
      `${item.quantity} ${item.unit}`,
      110 + columnWidths[0] + columnWidths[1],
      currentY
    );
    doc.text(
      item.price,
      80 + columnWidths[0] + columnWidths[1] + columnWidths[2],
      currentY
    );
    doc.text(
      item.totalprice,
      60 +
        columnWidths[0] +
        columnWidths[1] +
        columnWidths[2] +
        columnWidths[3],
      currentY
    );

    // วาดเส้นขอบรายการสินค้า
    if (index !== order.items.length - 1) {
      doc
        .moveTo(50, currentY + rowHeight)
        .lineTo(550, currentY + rowHeight)
        .strokeColor("#e1e1e1")
        .lineWidth(1)
        .stroke();
    }
  });

  // วาดเส้นขอบล่างสุด
  doc
    .moveTo(50, currentY + rowHeight)
    .lineTo(550, currentY + rowHeight)
    .strokeColor("#e1e1e1")
    .lineWidth(1)
    .stroke();

  doc.moveDown();

  // เส้นขอบ
  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .strokeColor("#e1e1e1")
    .lineWidth(1)
    .stroke(); // เส้นขอบด้านล่างของรายการสินค้า

  // สรุปยอดรวม
  doc
    .font("th-sarabun")
    .fontSize(14)
    .fillColor("#1d3557")
    .text(`ราคารวม: ${order.total} บาท`, { align: "left", bold: true });
  doc.moveDown(0.5);

  // ข้อมูลการชำระเงิน
  // doc.text(`ยอดที่ต้องชำระ: ${order.total} บาท`, { align: "left", bold: true });
  doc.moveDown(1);

  const approvedBy = order.approvedBy
    ? order.approvedBy
    : "......................";
  const approvedDate = order.approve_date
    ? order.approve_date
    : "......................";
  // โลโก้และข้อมูลวันและผู้อนุมัติ (ด้านล่าง)
  doc.moveDown(2);
  doc.text(`ผู้จัดทำ: ${order.fullname}`, { align: "right" });
  doc.moveDown(0);
  doc.text(`วันที่: ${order.date}`, { align: "right" });

  doc.moveDown(1);
  doc.text(`ผู้อนุมัติ: ${approvedBy}`, { align: "right" });
  doc.moveDown(0);
  doc.text(`สถานะ: ${order.status}`, { align: "right" });
  doc.moveDown(0);
  doc.text(`วันที่: ${approvedDate}`, { align: "right" });

  // ปิดเอกสาร
  doc.end();
};

const getPendingOrders = async (req, res) => {
  const { limit, offset, search } = req.query;

  // สร้างเงื่อนไขสำหรับการค้นหาข้อมูล
  const searchCondition = search
    ? `AND (order_ID LIKE ? OR order_user_ID LIKE ? OR date LIKE ? OR CONCAT(users.user_Fname, ' ', users.user_Lname) LIKE ? OR staorder.StaOrder_Name LIKE ?)`
    : "";
  const searchValue = search
    ? [
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
      ]
    : [];

  try {
    const query = `
      SELECT order_ID, order_user_ID, CONCAT(users.user_Fname, ' ', users.user_Lname) AS fullname, date, staorder.StaOrder_Name AS status, total
      FROM orders
      INNER JOIN users on users.user_ID = orders.order_user_ID
      INNER JOIN staorder on staorder.StaOrder_ID = orders.order_stat_ID
      WHERE order_stat_ID IN ('SOD000002','SOD000003','SOD000005','SOD000004') ${searchCondition}
      ORDER BY 
        CASE 
          WHEN orders.order_stat_ID = 'SOD000002' THEN 1 
          WHEN orders.order_stat_ID = 'SOD000003' THEN 2
          WHEN orders.order_stat_ID = 'SOD000005' THEN 3
          WHEN orders.order_stat_ID = 'SOD000004' THEN 4
          ELSE 5
        END,
        order_stat_ID
      LIMIT ? OFFSET ?;
    `;

    const [result] = await db
      .promise()
      .query(query, [...searchValue, parseInt(limit), parseInt(offset)]);

    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลการแจ้งซ่อม" });
    }

    // ฟอร์แมตวันที่ในผลลัพธ์
    const formattedResult = result.map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    }));

    // ดึงข้อมูลของรายการสินค้าที่เกี่ยวข้องกับใบสั่งซื้อ
    const orderDetails = await Promise.all(
      formattedResult.map(async (order) => {
        const itemsQuery =
          "SELECT * FROM orderlist WHERE orderlist_orders_ID = ?";
        const [items] = await db.promise().query(itemsQuery, [order.order_ID]);
        order.items = items;
        return order;
      })
    );

    // ส่งผลลัพธ์กลับไปที่ frontend
    res.status(200).json(orderDetails);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const createOrderPDF = async (req, res) => {
  const { order_ID } = req.params; // รับค่า order_ID จาก URL parameters

  try {
    // ดึงข้อมูลใบสั่งซื้อจากฐานข้อมูล
    const query = `
      SELECT order_ID, order_user_ID, date, order_stat_ID, CONCAT(users.user_Fname, ' ', users.user_Lname) AS fullname, 
             staorder.StaOrder_Name AS status, total, orders.approve_userID, approve_date
      FROM orders
      INNER JOIN users on users.user_ID = orders.order_user_ID
      INNER JOIN staorder on staorder.StaOrder_ID = orders.order_stat_ID
      WHERE order_ID = ?;
    `;
    const [order] = await db.promise().query(query, [order_ID]);

    if (order.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลใบสั่งซื้อ" });
    }

    // ฟอร์แมตวันที่ให้เป็นแบบวัน/เดือน/ปี พร้อมเวลา
    const formattedDate = new Date(order[0].date).toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    // อัพเดทข้อมูลวันที่ที่ฟอร์แมตแล้ว
    order[0].date = formattedDate;

    // ตรวจสอบว่า approve_date เป็น null หรือไม่ ถ้าเป็น null ให้ใช้ค่า fallback
    let formattedapprove_dateDate = "......................"; // กำหนดค่า fallback
    if (order[0].approve_date) {
      const approveDate = new Date(order[0].approve_date);
      // ตรวจสอบว่า approve_date เป็นวันที่ที่ถูกต้องหรือไม่
      if (!isNaN(approveDate.getTime())) {
        formattedapprove_dateDate = approveDate.toLocaleDateString("th-TH", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
    }
    order[0].approve_date = formattedapprove_dateDate;

    // ถ้าสถานะเป็น "กำลังสั่งซื้อ", เปลี่ยนเป็น "อนุมัติแล้ว"
    if (order[0].status === "กำลังสั่งซื้อ") {
      order[0].status = "อนุมัติแล้ว";
    }

    // ดึงข้อมูลผู้อนุมัติจากฐานข้อมูล
    const approveQuery = `
      SELECT CONCAT(users.user_Fname, ' ', users.user_Lname) AS approvedBy
      FROM users
      WHERE user_ID = ?;
    `;
    const [approvedUser] = await db
      .promise()
      .query(approveQuery, [order[0].approve_userID]);

    // ตรวจสอบว่า approvedBy เป็น null หรือไม่ ถ้าเป็น null ให้ใช้ค่า fallback
    order[0].approvedBy =
      approvedUser.length > 0
        ? approvedUser[0].approvedBy
        : "......................";

    // ดึงรายการสินค้า
    const itemsQuery = "SELECT * FROM orderlist WHERE orderlist_orders_ID = ?";
    const [items] = await db.promise().query(itemsQuery, [order[0].order_ID]);

    // เพิ่มรายการสินค้าในข้อมูลใบสั่งซื้อ
    order[0].items = items;

    // สร้าง PDF ใบสั่งซื้อ
    generateInvoicePDF(order[0], res);
  } catch (err) {
    console.error("Error creating PDF:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการสร้าง PDF" });
  }
};

//......................

const orderdata = async (req, res) => {
  try {
    const query = `
        `;
    const [result] = await db.promise().query(query);
    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลการแจ้งซ่อม" });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const listByOrder = async (req, res) => {
  const { order_user_ID } = req.body;
  try {
    const query = `
        `;
    const [result] = await db.promise().query(query);
    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลการแจ้งซ่อม" });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const selectOrderbyID = async (req, res) => {
  try {
    const { order_ID } = req.query;

    if (!order_ID) {
      return res.status(400).json({ error: "โปรดระบุ order ID" });
    }

    const orderQuery = `
      SELECT order_ID, order_user_ID, date, order_stat_ID, CONCAT(users.user_Fname, ' ', users.user_Lname) AS fullname, 
             staorder.StaOrder_Name AS status, total
      FROM orders
      INNER JOIN users ON users.user_ID = orders.order_user_ID
      INNER JOIN staorder ON staorder.StaOrder_ID = orders.order_stat_ID
      WHERE order_ID = ?
    `;
    const [orderResult] = await db.promise().query(orderQuery, [order_ID]);

    if (orderResult.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลใบสั่งซื้อ" });
    }

    const itemsQuery = `
    SELECT 
      number,
      orderlist_orders_ID ,
      orderlist_stock_ID ,
      orderlist_type_stock,
      stockname,
      quantity,
      unit,
      price,
      totalprice,
      orderlist_type_stock,
      status
    FROM orderlist 
    WHERE orderlist_orders_ID = ?
    `;
    const [itemsResult] = await db.promise().query(itemsQuery, [order_ID]);

    const orderDetails = {
      ...orderResult[0],
      items: itemsResult,
    };

    res.status(200).json(orderDetails);
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลใบสั่งซื้อ:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const editOrder = async (req, res) => {
  try {
    const { order_ID, order_user_ID, date, total, items } = req.body;

    // อัปเดตข้อมูลในตาราง orders
    const orderQuery = `
      UPDATE orders
      SET order_user_ID = ?, date = ?, total = ?
      WHERE order_ID = ?
    `;
    await db.promise().query(orderQuery, [order_user_ID, date, total, order_ID]);

    // ลบรายการสินค้าก่อนที่จะทำการเพิ่มใหม่
    const deleteItemsQuery = `
      DELETE FROM orderlist WHERE orderlist_orders_ID = ?
    `;
    await db.promise().query(deleteItemsQuery, [order_ID]);

    let countnumber = 1;
    for (const item of items) {
      const orderlist_type_stock = item.orderlist_type_stock || "ไม่ระบุ"; // กำหนดค่าเริ่มต้นเป็น "ไม่ระบุ" ถ้าไม่มีค่า

      const orderlistQuery = `
        INSERT INTO orderlist (number, orderlist_orders_ID, orderlist_stock_ID, stockname, quantity, unit, price, totalprice, status, orderlist_type_stock)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await db.promise().query(orderlistQuery, [
        countnumber,
        order_ID,
        item.orderlist_stock_ID,
        item.stockname,
        item.quantity,
        item.unit, // หน่วยสินค้า
        item.price,
        item.totalprice,
        "SOD000007",  // สถานะ
        orderlist_type_stock, // ประเภทสินค้า
      ]);
      countnumber++;
    }

    res.status(200).json({ message: "ใบสั่งซื้อถูกแก้ไขแล้ว" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการแก้ไขใบสั่งซื้อ:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};





const getPendingOrdersForApprove = async (req, res) => {
  const { limit, offset, search } = req.query;

  // สร้างเงื่อนไขสำหรับการค้นหาข้อมูล
  const searchCondition = search
    ? `AND (order_ID LIKE ? OR order_user_ID LIKE ? OR date LIKE ? OR CONCAT(users.user_Fname, ' ', users.user_Lname) LIKE ? OR staorder.StaOrder_Name LIKE ?)`
    : "";
  const searchValue = search
    ? [
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
      ]
    : [];

  try {
    const query = `
      SELECT order_ID, order_user_ID, CONCAT(users.user_Fname, ' ', users.user_Lname) AS fullname, date, staorder.StaOrder_Name AS status, total
      FROM orders
      INNER JOIN users on users.user_ID = orders.order_user_ID
      INNER JOIN staorder on staorder.StaOrder_ID = orders.order_stat_ID
      WHERE order_stat_ID IN ('SOD000002','SOD000003','SOD000005','SOD000004') ${searchCondition}
      ORDER BY 
        CASE 
          WHEN orders.order_stat_ID = 'SOD000002' THEN 1 
          WHEN orders.order_stat_ID = 'SOD000003' THEN 2
          WHEN orders.order_stat_ID = 'SOD000005' THEN 3
          WHEN orders.order_stat_ID = 'SOD000004' THEN 4
          ELSE 5
        END,
        order_stat_ID
      LIMIT ? OFFSET ?;
    `;

    const [result] = await db
      .promise()
      .query(query, [...searchValue, parseInt(limit), parseInt(offset)]);

    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลการแจ้งซ่อม" });
    }

    // ฟอร์แมตวันที่ในผลลัพธ์
    const formattedResult = result.map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    }));

    // ดึงข้อมูลของรายการสินค้าที่เกี่ยวข้องกับใบสั่งซื้อ
    const orderDetails = await Promise.all(
      formattedResult.map(async (order) => {
        const itemsQuery =
          "SELECT * FROM orderlist WHERE orderlist_orders_ID = ?";
        const [items] = await db.promise().query(itemsQuery, [order.order_ID]);
        order.items = items;
        return order;
      })
    );

    // ส่งผลลัพธ์กลับไปที่ frontend
    res.status(200).json(orderDetails);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

const approveOrder = async (req, res) => {
  const { orderID, userId } = req.body;
  const now = new Date();
  const approveDate = now.toISOString().slice(0, 19).replace("T", " ");
  try {
    const updateQuery = `
    UPDATE orders
            SET  order_stat_ID  = ?,
            approve_date = ?,
            approve_userID = ?
            WHERE order_ID  = ?
        `;
    await db
      .promise()
      .query(updateQuery, ["SOD000003", approveDate, userId, orderID]);

    res.status(201).json({ message: "เรียบร้อยแล้ว!" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const notApproveOrder = async (req, res) => {
  const { orderID, userId } = req.body;
  const now = new Date();
  const approveDate = now.toISOString().slice(0, 19).replace("T", " ");
  try {
    const updateQuery = `
    UPDATE orders
            SET  order_stat_ID  = ?,
            approve_date = ?,
            approve_userID = ?
            WHERE order_ID  = ?
        `;
    await db
      .promise()
      .query(updateQuery, ["SOD000004", approveDate, userId, orderID]);

    res.status(201).json({ message: "เรียบร้อยแล้ว!" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const setOrderWait = async (req, res) => {
  const { orderID } = req.body;
  const now = new Date();
  const approveDate = now.toISOString().slice(0, 19).replace("T", " ");
  try {
    const updateQuery = `
    UPDATE orders
            SET  order_stat_ID  = ?
            WHERE order_ID  = ?
        `;
    await db.promise().query(updateQuery, ["SOD000005", orderID]);

    res.status(201).json({ message: "เรียบร้อยแล้ว!" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

// API function to fetch stock details based on Req_ID
const selectOrderByReq_ID = async (req, res) => {
  try {
    const { Req_ID } = req.query;

    if (!Req_ID) {
      return res.status(400).json({ error: "โปรดระบุ Req_ID" });
    }

    const query = `
    SELECT r.reqlist_stock_ID AS reqlist_stock_ID, r.quantity - s.quantity AS remaining_quantity, u.name AS unitname, 0 AS price, type_stock.name AS orderlist_type_stock
    FROM requisition_list r
    JOIN stock s ON r.reqlist_stock_ID = s.ID
    JOIN unit u ON s.stock_unit_ID = u.ID
    JOIN type_stock ON s.stock_type_stock_ID = type_stock.ID
    WHERE r.reqlist_requisition_ID = ?
    AND r.reqlist_stat_ID = "SOD000001"
    `;
    const [reqlistResult] = await db.promise().query(query, [Req_ID]);

    if (reqlistResult.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลรายการสินค้า" });
    }

    const stockIDs = reqlistResult.map((item) => item.reqlist_stock_ID);
    const stockQuery = `
      SELECT * FROM stock
      WHERE ID IN (?)
    `;
    const [stockResult] = await db.promise().query(stockQuery, [stockIDs]);

    if (stockResult.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลสินค้า" });
    }

    // Merging stockResult and reqlistResult into items
    const items = reqlistResult.map((reqlistItem) => {
      const stockItem = stockResult.find(
        (item) => item.ID === reqlistItem.reqlist_stock_ID
      );
      return {
        ...reqlistItem,
        ...stockItem,
        remaining_quantity: reqlistItem.remaining_quantity, // Keep remaining_quantity from reqlistResult
      };
    });

    // Sending the merged result as response
    res.status(200).json({ items });
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

const getOrdersForReceive = async (req, res) => {
  const { limit, offset, search } = req.query;

  // สร้างเงื่อนไขสำหรับการค้นหาข้อมูล
  const searchCondition = search
    ? `AND (order_ID LIKE ? OR order_user_ID LIKE ? OR date LIKE ? OR CONCAT(users.user_Fname, ' ', users.user_Lname) LIKE ? OR staorder.StaOrder_Name LIKE ?)`
    : "";
  const searchValue = search
    ? [
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
      ]
    : [];

  try {
    const query = `
      SELECT order_ID, order_user_ID, CONCAT(users.user_Fname, ' ', users.user_Lname) AS fullname, date, staorder.StaOrder_Name AS status, total
      FROM orders
      INNER JOIN users on users.user_ID = orders.order_user_ID
      INNER JOIN staorder on staorder.StaOrder_ID = orders.order_stat_ID
      WHERE order_stat_ID IN ('SOD000005','SOD000006') ${searchCondition}
      ORDER BY 
        CASE 
          WHEN orders.order_stat_ID = 'SOD000005' THEN 1 
          WHEN orders.order_stat_ID = 'SOD000006' THEN 2
          ELSE 3
        END,
        order_stat_ID
      LIMIT ? OFFSET ?;
    `;

    const [result] = await db
      .promise()
      .query(query, [...searchValue, parseInt(limit), parseInt(offset)]);

    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลการแจ้งซ่อม" });
    }

    // ฟอร์แมตวันที่ในผลลัพธ์
    const formattedResult = result.map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    }));

    // ดึงข้อมูลของรายการสินค้าที่เกี่ยวข้องกับใบสั่งซื้อ
    const orderDetails = await Promise.all(
      formattedResult.map(async (order) => {
        const itemsQuery =
          "SELECT * FROM orderlist WHERE orderlist_orders_ID = ?";
        const [items] = await db.promise().query(itemsQuery, [order.order_ID]);
        order.items = items;
        return order;
      })
    );

    // ส่งผลลัพธ์กลับไปที่ frontend
    res.status(200).json(orderDetails);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Error fetching orders" });
  }
};
const getOrdersForSelectForReceive = async (req, res) => {
  try {
    const OrderID = req.query.OrderID;  // Access OrderID correctly from req.query

    if (!OrderID) {
      return res.status(400).json({ error: "โปรดระบุ Order_ID" });
    }

    const query = `
    SELECT 
      number,
      orderlist_orders_ID,
      orderlist_stock_ID,
      stockname,
      quantity,
      unit,
      price,
      totalprice,
      status AS statusID,
      staorder.StaOrder_Name AS statusName
    FROM orderlist
    INNER JOIN staorder on staorder.StaOrder_ID = orderlist.status
    WHERE orderlist.orderlist_orders_ID = ?;
    `;

    const [result] = await db.promise().query(query, [OrderID]);

    if (result.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลการแจ้งซ่อม" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};


module.exports = {
  createOrder,
  getPendingOrders,
  createOrderPDF,
  getUserByIdfromOrder,
  editOrder,
  selectOrderbyID,
  getPendingOrdersForApprove,
  approveOrder,
  notApproveOrder,
  setOrderWait,
  selectOrderByReq_ID,
  getOrdersForReceive,
  getOrdersForSelectForReceive,
  
};
