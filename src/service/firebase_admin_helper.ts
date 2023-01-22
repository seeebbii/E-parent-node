import * as FirebaseAdminHelper from 'firebase-admin';

var serviceAccount = require("../../serviceAccountKey.json");

// ! Initializing Firebase Admin Service Account For Push Notification
FirebaseAdminHelper.initializeApp({
  credential: FirebaseAdminHelper.credential.cert(serviceAccount),
})

export default FirebaseAdminHelper