/* =========================================================
   MS INFOTECH — firebase-init.js
   =========================================================
   Initializes the ONE Firebase app used across the whole site
   (public pages + admin panel). Include this AFTER the Firebase
   compat SDK <script> tags and firebase-config.js, and BEFORE
   any other firebase-*.js file on a page.
   ========================================================= */

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

window.auth = auth;
window.db = db;
