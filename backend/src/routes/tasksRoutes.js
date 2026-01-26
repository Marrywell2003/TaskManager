//date din baza de date pt tasks 

const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebaseAdmin'); 
const verifyToken = require('../middleware/authMiddleware');

router.post('/create', verifyToken, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      assignedTo, 
      assignedToName, 
      priority, 
      dueDate 
    } = req.body;

    const managerDoc = await db.collection('users').doc(req.user.uid).get();
    const managerData = managerDoc.data();
    if (!managerDoc.exists || managerDoc.data().role !== 'Manager') {
      return res.status(403).json({ error: 'Acces interzis. Doar managerii pot crea sarcini.' });
    }

    const newTask = {
      title,
      description,
      assignedTo,      
      assignedToName,  
      createdBy: req.user.uid, 
      createdByName: managerData.fullName || `${managerData.firstName} ${managerData.lastName}`,
      status: 'todo',  
      priority: priority || 'medium',
      dueDate: dueDate ? admin.firestore.Timestamp.fromDate(new Date(dueDate)) : null,
      createdAt: admin.firestore.Timestamp.now() 
    };

    const docRef = await db.collection('tasks').add(newTask);
    
    res.status(201).json({ 
      id: docRef.id, 
      ...newTask,
      createdAt: newTask.createdAt.toDate(),
      dueDate: newTask.dueDate ? newTask.dueDate.toDate() : null
    });
  } catch (error) {
    console.error("Task Creation Error:", error);
    res.status(500).json({ error: 'Eroare la crearea task-ului.' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const tasksSnapshot = await db.collection('tasks').orderBy('createdAt', 'desc').get();
    const tasks = tasksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dueDate: doc.data().dueDate ? doc.data().dueDate.toDate() : null 
    }));
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;