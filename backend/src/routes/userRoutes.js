const express = require('express');
const router = express.Router();
// Importăm configurația admin (pe care o vom face la pasul următor)
const { db } = require('../firebaseAdmin'); 

// RUTA: GET /api/users/profile/:uid
router.get('/profile/:uid', async (req, res) => {
  try {
    const uid = req.params.uid;
    
    // Serverul tău interoghează Firestore
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userDoc.data();

    // Aici poți face PRELUCRAREA datelor (cum ai dorit)
    // De exemplu, poți adăuga un câmp calculat sau să loghezi accesul
    console.log(`Profile accessed for: ${userData.fullName}`);

    res.json(userData); // Trimitem datele către Vue
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
