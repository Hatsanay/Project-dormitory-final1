
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // console.log('Authorization Header:', authHeader);
  let token;
  if (authHeader) {
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      token = authHeader;
    }
  }
  // console.log('Extracted Token:', token);
  if (!token) {
    return res.status(401).json({ error: 'คุณไม่มี token' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // console.error('Token Verification Error:', err);
      return res.status(403).json({ error: 'โทเค็นไม่ถูกต้องหรือหมดอายุ' });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;



// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const authenticateToken = (req, res, next) => {
//   const token = req.headers['authorization'];
//   if (!token) return res.status(401).json({ error: 'คุณไม่มี token' });

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ error: 'โทเค็นไม่ถูกต้องหรือหมดอายุ' });
//     req.user = user;
//     next();
//   });
// };

// module.exports = authenticateToken;
