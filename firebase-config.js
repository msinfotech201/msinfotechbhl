/* =========================================================
   MS INFOTECH — firebase-config.js
   Shared Firebase setup for:
     - contact.html      (saves each enquiry to the database)
     - admin-login.html  (Google Sign-In, admin-only)
     - admin.html         (dashboard: enquiries, admin users, login history)

   Uses the Firebase "compat" SDK (plain <script> tags) so the rest of the
   site can stay pure HTML/CSS/vanilla JS with no build step, exactly like
   the rest of this project.
   ========================================================= */

var firebaseConfig = {
  apiKey: "AIzaSyCiAIjnkx_aLNo0mQmBBv9bAepUh-hEW3M",
  authDomain: "msinfotech-f0035.firebaseapp.com",
  projectId: "msinfotech-f0035",
  storageBucket: "msinfotech-f0035.firebasestorage.app",
  messagingSenderId: "221056338754",
  appId: "1:221056338754:web:ec176d199af1a8bac896db",
  measurementId: "G-85ND1N2WK0"
};

/* ---------------------------------------------------------
   ⚠️ REQUIRED — change this to the Gmail/Google account that
   should be the FIRST (super) admin, e.g. "msinfotechbhl@gmail.com".

   The very first time THIS exact Google account signs in at
   admin-login.html, it is automatically saved into the database as
   an admin. After that, you manage all other admins from inside the
   Admin Panel itself — you never need to edit this file again.

   You must set the SAME email (any letter case is fine) in Firestore rules —
   see ADMIN-SETUP.md, step 3, for the exact line to change.
   --------------------------------------------------------- */
var SUPER_ADMIN_EMAIL = "msinfotech.bhilwara@gmail.com";

firebase.initializeApp(firebaseConfig);

// auth-compat is only loaded on admin-login.html / admin.html (contact.html
// only needs Firestore to save enquiries, so it skips the heavier auth SDK).
var auth = firebase.auth ? firebase.auth() : null;
var db = firebase.firestore();
