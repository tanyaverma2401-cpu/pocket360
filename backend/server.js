const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Demo Users Data
let usersList = [
  { id: 1, name: "Rahul Sharma", balance: 500, status: "Active" },
  { id: 2, name: "Priya Singh", balance: 1200, status: "Active" }
];

// User API
app.get('/api/user/profile/1', (req, res) => {
  res.json({ success: true, user: usersList[0] });
});

// Admin API
app.get('/api/admin/users', (req, res) => {
  res.json({ success: true, users: usersList });
});

app.listen(PORT, () => {
  console.log(`Backend Server Running On: http://localhost:${PORT}`);
});
