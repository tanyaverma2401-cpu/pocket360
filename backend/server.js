const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

let usersList = [
  { id: 1, name: "Rahul Sharma", balance: 500 },
  { id: 2, name: "Priya Verma", balance: 1200 }
];

// GET: Fetch all users
app.get('/api/users', (req, res) => {
  res.json({ success: true, data: usersList });
});

// POST: Add new user
app.post('/api/users', (req, res) => {
  const { name, balance } = req.body;
  const newUser = {
    id: usersList.length > 0 ? usersList[usersList.length - 1].id + 1 : 1,
    name,
    balance: Number(balance)
  };
  usersList.push(newUser);
  res.json({ success: true, message: "User added successfully", data: newUser });
});

// PUT: Update user
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, balance } = req.body;
  
  const user = usersList.find(u => u.id === userId);
  if (user) {
    user.name = name;
    user.balance = Number(balance);
    res.json({ success: true, message: "User updated successfully", data: user });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
});

// DELETE: Remove user
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  usersList = usersList.filter(u => u.id !== userId);
  res.json({ success: true, message: "User deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});