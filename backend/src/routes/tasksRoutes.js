//date din baza de date pt tasks 

const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebaseAdmin'); 
const verifyToken = require('../middleware/authMiddleware');
//creare new task
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
      return res.status(403).json({ error: 'Access denied. Just managers can create a new task!!' });
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
    console.error("Task creation error:", error);
    res.status(500).json({ error: 'Error at creating a task!' });
  }
});
//afisare tasks
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
//pt afisarea task urilor pe fiecare manager
router.get('/manager/:managerId', async (req, res) => {
  try {
    const { managerId } = req.params;
    const snapshot = await db.collection('tasks')
                             .where('createdBy', '==', managerId)
                             .get();
   
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//afisare task uri pt fiecare employee in parte
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const snapshot = await db.collection('tasks')
                             .where('assignedTo', '==', employeeId)
                             .get();
    
    const tasks = snapshot.docs.map(doc => {
       const taskData = doc.data();
      return {
        id: doc.id,
        ...taskData,
        dueDate: (taskData.dueDate && typeof taskData.dueDate.toDate === 'function') 
                 ? taskData.dueDate.toDate() 
                 : taskData.dueDate, 
        createdAt: (taskData.createdAt && typeof taskData.createdAt.toDate === 'function') 
                   ? taskData.createdAt.toDate() 
                   : taskData.createdAt
      };
    });
    res.json(tasks);
  } catch (error) {
    console.error("Critic error backend:",error)
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;