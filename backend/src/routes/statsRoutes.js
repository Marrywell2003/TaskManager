//preia datele pt dashboard, statistici simple

const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');

router.get('/summary', async (req, res) => {
    try {
    const snapshot = await db.collection('users').get();
    const userCount = snapshot.size;

    res.json({
      totalUsers:userCount,
      totalTasks: 0, //nu am tasks inca
      completedTasks: Math.floor(userCount / 2),
      efficiencyRate: 0,//userCount > 0 ? '75%' : '0%',
      lastUpdated: new Date().toLocaleTimeString()
    });
  } catch (error) {
    console.error("Error retrieving statistics:", error);
        res.status(500).json({ message: "I couldn't access the database" });
  }
});

router.get('/status', async (req, res) => {
    try {
        await db.collection('users').limit(1).get();
        
        res.json({ 
            status: 'Online',
            database: 'Connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'Error',
            database: 'Disconnected',
            message: error.message 
        });
    }
});

module.exports = router;