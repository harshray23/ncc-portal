import admin from 'firebase-admin';

if (!admin.apps.length) {
  // Let the caller (the server action) handle the initialization error.
  // This provides a more specific error message if seeding fails due to
  // missing or incorrect environment variables.
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // The private key must be formatted correctly.
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export default admin;
