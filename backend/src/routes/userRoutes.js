//tot ce e legat de oameni

const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin'); 
const verifyToken = require('../middleware/authMiddleware');

router.post('/register', async (req, res) => {
  try {
    const { uid, firstName, lastName, email, role } = req.body;

    await db.collection('users').doc(uid).set({
      uid,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email,
      role,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ message: "User profile created in database" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Failed to save user profile" });
  }
});

router.get('/profile/:uid',verifyToken, async (req, res) => {
  try {
    const uid = req.params.uid;

    if (req.user.uid !== uid) {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }
    
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

router.get('/employees', verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection('users').where('role', '==', 'Employee').get();
    
    const employees = snapshot.docs.map(doc => ({
      uid: doc.id,
      fullName: doc.data().fullName || `${doc.data().firstName} ${doc.data().lastName}`
    }));

    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Eroare la preluarea listei de angajați" });
  }
});





module.exports = router;
