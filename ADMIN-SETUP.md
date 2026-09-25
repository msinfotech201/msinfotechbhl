# MS INFOTECH — Admin Panel Setup Guide

Your site now has:
- **`contact.html`** — every enquiry submitted is saved to a database (in addition to opening WhatsApp, exactly as before).
- **`admin-login.html`** — sign-in page, **Google Sign-In only** (no separate username/password).
- **`admin.html`** — the admin dashboard: enquiries, admin user management, and admin login history.

This uses **Firebase** (Google's backend service) for the database (Firestore) and login (Authentication). It is free for a small business site like this one — you will not need a paid plan. It is still a plain static site (no server, still works on GitHub Pages) — Firebase runs entirely from the browser.

Follow these 6 steps once, before you upload the site.

---

## Step 1 — Enable Firestore Database

1. Go to the [Firebase Console](https://console.firebase.google.com/) → open your project **`msinfotech-f0035`** (this project already matches the config in `firebase-config.js`).
2. In the left menu, click **Build → Firestore Database → Create database**.
3. Choose a location close to you (e.g. `asia-south1 (Mumbai)`), start in **Production mode**, click **Create**.

## Step 2 — Enable Google Sign-In

1. Left menu → **Build → Authentication → Get started**.
2. Under the **Sign-in method** tab, click **Google**, toggle it **Enable**, pick a support email, **Save**.

## Step 3 — Set your admin email (2 places)

Open **`firebase-config.js`** and change this line to the exact Gmail address you (the owner) will sign in with:

```js
var SUPER_ADMIN_EMAIL = "owner@gmail.com";
```

Then open **`firestore.rules`** and change the matching line to the **same email, in lowercase**:

```js
function isBootstrapSuperAdmin() {
  return isSignedIn() && request.auth.token.email == "owner@gmail.com";
}
```

> This is the account that becomes admin automatically the first time it signs in. After that first login, you add/remove every other admin directly from the Admin Panel's "Admin Users" tab — you will never need to edit these files again.

## Step 4 — Publish the security rules

1. In Firebase Console → **Firestore Database → Rules** tab.
2. Delete the default text and paste in the **entire contents of `firestore.rules`** from this project (with your email already edited in, from Step 3).
3. Click **Publish**.

These rules make sure: anyone can submit the contact form, but only your approved admin accounts can read enquiries, see who else is an admin, or view login history.

## Step 5 — Add your live domain to Authorized Domains

1. Authentication → **Settings** tab → **Authorized domains**.
2. Add `msinfotechbhl.com` (and `www.msinfotechbhl.com` if you use it). `localhost` is already listed, which is useful for testing.

## Step 6 — Upload and test

1. Upload the whole project (including the new `firebase-config.js`, `admin.css`, `admin-login.html`, `admin.html`, `firestore.rules`) to GitHub exactly as before.
2. Visit `https://msinfotechbhl.com/admin-login.html`, click **Sign in with Google**, and sign in with the email from Step 3. You should land on the dashboard.
3. Submit a test enquiry from `https://msinfotechbhl.com/contact.html` and confirm it appears under the **Inquiries** tab within a few seconds.
4. To give a second person admin access, sign in as yourself, open the **Admin Users** tab, and add their Gmail address — they can then sign in the same way.

---

## What the admin panel shows

- **Inquiries** — every enquiry submitted through the Contact page form: name, mobile, service, message, date/time, and a status (New / Contacted / Done) you can update or delete. A WhatsApp button lets you reply directly.
- **Admin Users** — every Google account allowed into the admin panel, who added them, and when. You can add or remove access here (the original super admin account cannot be removed, so you can never lock yourself out).
- **Login History** — a record of every time an admin signed in: who, and when.

## Notes

- `admin-login.html` and `admin.html` are excluded from search engines (`robots.txt` and `noindex`), but they are not secret URLs — the real protection is the Google Sign-In + admin allowlist, enforced both in the page and in the database rules.
- If someone who is *not* on your admin list tries to sign in, they see "not authorized" and are signed out immediately — they never see any data.
- Firestore's free tier (50,000 reads / 20,000 writes per day) is far more than a small business site like this will ever use.
