const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // เพิ่มการนำเข้า cors
const authRoutes = require('./routes/auth');
const authenticateToken = require('./middleware/auth');
require('dotenv').config();
const path = require('path'); // นำเข้า path library

const app = express();
const PORT = process.env.PORT || 3030; //local
// const PORT = process.env.PORT || 3000; //hosting

app.use(cors()); // เพิ่มการใช้ cors middleware
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.get('/', (req, res) => {
//   res.send('Hello World!!!');
// });

app.get('/protected', authenticateToken, (req, res) => {
  res.send('This is a protected route.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


