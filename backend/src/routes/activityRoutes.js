//istoric task uri

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    //de actualizat aici
    const activities = [
        { id: 1, user: 'Manager', action: 'Approved Task #102', time: '10 min ago' },
        { id: 2, user: 'User1', action: 'Completed "API Docs"', time: '2h ago' },
        { id: 3, user: 'User2', action: 'Added a new task', time: '5h ago' }
    ];
    res.json(activities);
});

module.exports = router;