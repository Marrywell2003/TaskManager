//tot ce e legat de oameni

const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin'); 

router.get('/profile/:uid', async (req, res) => {
  try {
    const uid = req.params.uid;
    
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userDoc.data();

    console.log(`[AUTH] User: ${userData.email} | Role: ${userData.role}`);

    res.json({
        uid: uid,
        fullName: userData.fullName || `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        role: userData.role 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
