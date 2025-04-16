import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  readFileSync(path.join(__dirname, '../../serviceAccountKey.json'))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function listAllUsers(nextPageToken) {
  try {
    // List batch of users, 1000 at a time.
    const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
    
    console.log('Users:');
    listUsersResult.users.forEach((userRecord) => {
      console.log('User:', {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        emailVerified: userRecord.emailVerified,
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime
      });
    });

    // Get additional user data from Firestore
    console.log('\nDetailed User Info from Firestore:');
    for (const userRecord of listUsersResult.users) {
      const userDoc = await admin.firestore().collection('Users').doc(userRecord.uid).get();
      if (userDoc.exists) {
        console.log('Firestore Data for', userRecord.email, ':', userDoc.data());
      }
    }

    if (listUsersResult.pageToken) {
      // List next batch of users.
      await listAllUsers(listUsersResult.pageToken);
    }
  } catch (error) {
    console.log('Error listing users:', error);
  }
}

// Start listing users from the beginning, 1000 at a time.
listAllUsers(); 