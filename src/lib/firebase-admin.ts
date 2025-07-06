import admin from 'firebase-admin';

// This function ensures Firebase Admin is initialized only once.
function getFirebaseAdmin() {
  if (admin.apps.length) {
    return admin;
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    const missingVars = [
      !projectId && 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      !clientEmail && 'FIREBASE_CLIENT_EMAIL',
      !privateKey && 'FIREBASE_PRIVATE_KEY'
    ].filter(Boolean).join(', ');
    
    throw new Error(
      `Firebase initialization failed. The following environment variables are missing in your .env file: ${missingVars}. Please copy them from your Firebase project settings.`
    );
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error: any) {
    console.error("Firebase Admin Initialization Error:", error);
    // This often happens if the private key format is wrong in the .env file
    throw new Error(
      'Firebase initialization failed. There is an issue with your Firebase Admin credentials. Please ensure the FIREBASE_PRIVATE_KEY in your .env file is correctly formatted (it should start with "-----BEGIN PRIVATE KEY-----" and be enclosed in double quotes).'
    );
  }

  return admin;
}

export { getFirebaseAdmin };
