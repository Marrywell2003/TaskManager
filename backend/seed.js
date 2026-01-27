const { faker } = require('@faker-js/faker');
const { db, admin } = require('./src/config/firebaseAdmin');

async function seedDatabase() {
  try {
    console.log('Starting seeding...');
    const users = [];
    const roles = ['Manager', 'Employee'];

    for (let i = 0; i < 6; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email().toLowerCase();
      const password = '123QWE'; 

      const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
        displayName: `${firstName} ${lastName}`,
      });

      const uid = userRecord.uid; 

      const userData = {
        uid,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email,
        role: i === 0 ? 'Manager' : 'Employee',
        createdAt: new Date().toISOString()
      };

      await db.collection('users').doc(uid).set(userData);
      users.push(userData);
      
      console.log(`Created: ${email} | Role: ${userData.role}`);
    }

    const managers = users.filter(u => u.role === 'Manager');
    const employees = users.filter(u => u.role === 'Employee');

    console.log('--- Generating tasks ---');

    for (let i = 0; i < 15; i++) {
      const randomManager = faker.helpers.arrayElement(managers);
      const randomEmployee = faker.helpers.arrayElement(employees);
      const dueDate = faker.date.future();

      const newTask = {
        title: faker.hacker.phrase(),
        description: faker.lorem.paragraph(),
        assignment: {
          userId: randomEmployee.uid,
          userName: randomEmployee.fullName
        },
        author: {
          id: randomManager.uid,
          name: randomManager.fullName,
          email: randomManager.email
        },
        status: faker.helpers.arrayElement(['todo', 'in-progress', 'done']),
        priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
        metadata: {
          createdAt: admin.firestore.Timestamp.now(),
          updatedAt: admin.firestore.Timestamp.now(),
          dueDate: admin.firestore.Timestamp.fromDate(dueDate)
        }
      };
      await db.collection('tasks').add(newTask);
    }
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}
seedDatabase();