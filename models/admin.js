// const express = require('express');
// const router = express.Router();
// const AdminController = require('./AdminController');

// router.post('/create-admin', AdminController.createAdmin);

// module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/create-admin', async (req, res) => {
  const { name, email, country, mobile, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send({ message: 'Email already exists' });
  }

  const adminUser = new User({
    name,
    email,
    password,
    isAdmin: true,
    type: 'admin',
  });

  try {
    await adminUser.save();
    res.send({ message: 'Admin user created successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error creating admin user' });
  }
});

module.exports = router;