//este admin pt baza de date
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('✅ Firebase Admin configurat cu succes!');
} catch (error) {
  console.error('❌ Eroare la inițializarea Firebase Admin:', error);
}
//am acest try, ca sa ma ajute sa vad daca s a conectat sau nu

const db = admin.firestore();

module.exports = { db };