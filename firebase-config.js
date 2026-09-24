/* =========================================================
   MS INFOTECH — firebase-config.js
   =========================================================
   YAHAN APNA FIREBASE PROJECT CONFIG DAALEIN.

   Kahan se milega:
   1) https://console.firebase.google.com kholein
   2) Apna project banayein (ya select karein)
   3) Project Settings (gear icon) -> "Your apps" -> Web app (</>) add karein
   4) Wahan se yeh poora object copy karke neeche paste kar dein

   NOTE: Yeh keys "secret" nahi hoti — Firebase inhe public rakhna
   normal maanta hai. Asli security "firestore.rules" file se hoti
   hai (isi ZIP me di gayi hai), na ki is config ko chhupane se.
   ========================================================= */

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
