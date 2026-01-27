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
      assignedUserName, 
      priority, 
      dueDate 
    } = req.body;

    const managerDoc = await db.collection('users').doc(req.user.uid).get();
    if (!managerDoc.exists || managerDoc.data().role !== 'Manager') {
      return res.status(403).json({ error: 'Access denied. Just managers can create a new task!!' });
    }
    const managerData = managerDoc.data();
    const newTask = {
      title,
      description,
      assignment: {
         userId: assignedTo,
         userName: assignedUserName
      },
      author: {
        id: req.user.uid,
        name: managerData.fullName || `${managerData.firstName} ${managerData.lastName}`,
        email: req.user.email

      },
      status: 'todo',
      priority: priority || 'medium',
      metadata: {
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
        dueDate: dueDate ? admin.firestore.Timestamp.fromDate(new Date(dueDate)) : null
      }
    };

    const docRef = await db.collection('tasks').add(newTask);
    
    res.status(201).json({ 
      id: docRef.id, 
      ...newTask,
      metadata: {
       ...newTask.metadata,
       createdAt: newTask.metadata.createdAt.toDate(),
       updatedAt: newTask.metadata.updatedAt.toDate(),
       dueDate: newTask.metadata.dueDate ? newTask.metadata.dueDate.toDate() : null
  }
    });
  } catch (error) {
    console.error("Task creation error:", error);
    res.status(500).json({ error: 'Error at creating a task!' });
  }
});
//afisare tasks
router.get('/all', async (req, res) => {
  try {
    const tasksSnapshot = await db.collection('tasks').orderBy('metadata.createdAt', 'desc').get();
    const tasks = tasksSnapshot.docs.map(doc => {
      const data=doc.data();
      return { 
        id: doc.id,
        ...doc.data(),
        metadata: {
          ...data.metadata,
          createdAt: data.metadata?.createdAt?.toDate() || null,
          updatedAt: data.metadata?.updatedAt?.toDate() || null,
          dueDate: data.metadata?.dueDate?.toDate() || null
        } 
      }   
    });
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
                             .where('author.id', '==', managerId)
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
                             .where('assignment.userId', '==', employeeId)
                             .get();
    
    const tasks = snapshot.docs.map(doc => {
       const taskData = doc.data();
      return {
        id: doc.id,
        ...taskData,
        metadata: {
          ...taskData.metadata,
          createdAt: taskData.metadata?.createdAt?.toDate?.() || taskData.metadata?.createdAt,
          updatedAt: taskData.metadata?.updatedAt?.toDate?.() || taskData.metadata?.updatedAt,
          dueDate: taskData.metadata?.dueDate?.toDate?.() || taskData.metadata?.dueDate
        }
      };
    });
    res.json(tasks);
  } catch (error) {
    console.error("Critic error backend:",error)
    res.status(500).json({ error: error.message });
  }
});
//update task
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, dueDate, assignedTo, assignedUserName } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (priority) updateData.priority = priority;
    if (status) updateData.status = status;
    if (assignedTo) {
      updateData['assignment.userId'] = assignedTo;
      updateData['assignment.userName'] = assignedUserName || 'Unassigned';
    }
    updateData['metadata.updatedAt'] = new Date().toISOString();

    if (dueDate) {
      updateData['metadata.dueDate'] = dueDate;
    }
    const taskRef = db.collection('tasks').doc(id);
    await taskRef.update(updateData);
    const updatedDoc = await taskRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });

    // await db.collection('tasks').doc(id).update(updateObj);
    // res.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});
//delete
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'Manager') {
      return res.status(403).json({ error: 'Access denied. Only managers can delete tasks!' });
    }
    const taskRef = db.collection('tasks').doc(id);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return res.status(404).json({ error: 'Task not found!' });
    }
    await taskRef.delete();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;