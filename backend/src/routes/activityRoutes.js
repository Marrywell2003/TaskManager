

const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');

router.get('/', async (req, res) => {
    try {
        console.log("ACtivities...");
        const snapshot = await db.collection('tasks')
            .orderBy('metadata.updatedAt', 'desc')
            .limit(5)
            .get();

        if (snapshot.empty) {
            console.log("empty collection");
            return res.json([]);
        }
        const activities = snapshot.docs.map(doc => {
        const data = doc.data();
        let timeString = 'Now';
        const up = data.metadata?.updatedAt;
        if (up && typeof up.toDate === 'function') {
           timeString = up.toDate().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
        } 
         return {
          id: doc.id,
          user: data.assignment?.userName || 'Manager',
          action:`${data.title} was modified`,
          time: timeString
        };
    });
        res.json(activities);
    } catch (error) {
        console.error("ERror -activity", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;