
const express = require('express');
const router = express.Router();
const User = require('../Schemas/AccessSchema');


router.post('/api/user/login', async (req, res) => {
    const {userEmail}=req.body;
    try {
        const user = await User.findOne({email:userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json({ role: user.role });
    } catch (err) {
        return res.status(400).json({ message: 'Bad request' });
    }
});

module.exports = router;
