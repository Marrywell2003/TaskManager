

const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');

router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('tasks')
            .orderBy('updatedAt', 'desc') 
            .limit(5)
            .get();
        const activities = snapshot.docs.map(doc => {
            const data = doc.data();
            const lastTime = data.updatedAt ? data.updatedAt.toDate() : new Date();
            return {
                id: doc.id,
                user: data.assignedToName || 'System',
                action: `Updated status to "${data.status}" for: ${data.title}`,
                time: lastTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
        });
        res.json(activities);
    } catch (error) {
        console.error("Error fetching activities:", error);
        res.status(500).json({ error: "Could not fetch recent activity" });
    }
});

module.exports = router;