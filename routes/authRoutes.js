const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controller/userController')

router.post('/register', registerUser);
router.get('/login',loginUser);


module.exports = router;
