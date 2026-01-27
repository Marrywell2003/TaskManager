//preia datele pt dashboard, statistici simple

const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');

router.get('/summary', async (req, res) => {
    try {
    const [usersSnapshot, tasksSnapshot] = await Promise.all([
      db.collection('users').get(),
      db.collection('tasks').get()
    ]);
    const totalUsers = usersSnapshot.size;
    const totalTasks = tasksSnapshot.size;
    
    const completedTasks = tasksSnapshot.docs.filter(doc => 
      doc.data().status?.toLowerCase() === 'done'
    ).length;

    const efficiency = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;

    res.json({
      totalUsers:totalUsers,
      totalTasks: totalTasks,
      completedTasks: completedTasks,
      efficiencyRate:`${efficiency}%`,
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