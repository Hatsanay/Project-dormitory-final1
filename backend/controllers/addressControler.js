const db = require('../config/db');
const bcrypt = require('bcrypt');
require('dotenv').config();

const getProvince = async (req, res) => {
    try {
        const query = 'SELECT id,name_th FROM thai_provinces';
        const [result] = await db.promise().query(query);
        res.status(200).json(result);
    } catch (err) {
        console.error('เกิดข้อผิดพลาด:', err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดำเนินการ' });
    }
}

const getAmphures = async (req, res) => {
    try {
        const { provinceId } = req.query;

        if (!provinceId) {
            return res.status(400).json({ error: 'โปรดระบุ provinceId' });
        }

        const query = 'SELECT id, name_th FROM thai_amphures WHERE province_id = ?';
        const [result] = await db.promise().query(query, [provinceId]);

        res.status(200).json(result);
    } catch (err) {
        console.error('เกิดข้อผิดพลาด:', err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดำเนินการ' });
    }
};


const getTambons = async (req, res) => {
    try {
        const { amphureId } = req.query;

        if (!amphureId) {
            return res.status(400).json({ error: 'โปรดระบุ amphureId' });
        }

        const query = 'SELECT id, name_th, zip_code FROM thai_tambons WHERE amphure_id = ?';
        const [result] = await db.promise().query(query, [amphureId]);

        res.status(200).json(result);
    } catch (err) {
        console.error('เกิดข้อผิดพลาด:', err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดำเนินการ' });
    }
};


const getZipcode = async (req, res) => {
    try {
        const { tambonId } = req.query;

        if (!tambonId) {
            return res.status(400).json({ error: 'โปรดระบุ tambonId' });
        }

        const query = 'SELECT zip_code FROM thai_tambons WHERE id = ?';
        const [results] = await db.promise().query(query, [tambonId]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'ไม่พบรหัสไปรษณีย์สำหรับ tambonId นี้' });
        }
        const { zip_code } = results[0];
        res.status(200).json({ zip_code });
    } catch (err) {
        console.error('เกิดข้อผิดพลาด:', err);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดำเนินการ' });
    }
};


module.exports = {getProvince,getAmphures,getTambons,getZipcode};