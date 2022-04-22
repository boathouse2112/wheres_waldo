import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

// usage:
// http://localhost:5001/where-s-waldo-46cdf/us-central1/setStartTime?id={USER_ID}
export const setStartTime = functions.https.onRequest((request, response) => {
  const id = request.query.id;

  if (typeof id === 'string') {
    const currentTime = admin.firestore.FieldValue.serverTimestamp();
    const doc = admin.firestore().collection('timestamps').doc(id);

    doc.set({
      startTime: currentTime,
      endTimes: [],
    });
  }
});
