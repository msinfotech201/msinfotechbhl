# MS INFOTECH — Admin Panel + Firebase Setup Guide

Yeh guide aapko step-by-step batayegi ki naya Admin Panel Firebase ke
saath kaise chalu karein. Login **Google Sign-In** se hota hai — koi
alag password banane/yaad rakhne ki zaroorat nahi.

## Kya naya add hua hai

- **/admin/login.html** — "Sign in with Google" button
- **/admin/panel.html** — Admin dashboard: Laptops, Printers, Enquiries, Users
- Har page ke header me ab ek **Admin** button hai (top-right, services ke
  bagal me), jo `admin/login.html` par le jaata hai.
- Old Laptop Stock aur Old Printer Stock ab **Firestore database** se live
  load hoti hai — admin panel se add/edit/delete karte hi website par turant
  dikhega. `laptop-data.js` aur `printer-data.js` ab **use nahi ho rahi**
  (sirf reference ke liye rakhi hain).
- Contact form (`contact.html`) ki har enquiry ab WhatsApp ke saath-saath
  **admin panel ke "Enquiries" tab me bhi save hoti hai**.
- **Users tab** (sirf "admin" role ko dikhta hai) — yahan se naya Gmail
  address daal kar access dete hain (unka password nahi banana padta,
  wo apne Google account se hi login kar lenge).

---

## STEP 1 — Firebase project banayein

1. https://console.firebase.google.com kholein → **Add project** →
   naam dein (jaise `msinfotechbhl`) → project bana lein.

## STEP 2 — Google Sign-In on karein

1. Left menu me **Build → Authentication** → **Get started**
2. **Sign-in method** tab → **Google** → Enable karein
3. **Project support email** select karke **Save** kar dein

## STEP 3 — Firestore Database banayein

1. Left menu me **Build → Firestore Database** → **Create database**
2. **Production mode** select karein → apna region choose karein (jaise
   `asia-south1` — Mumbai) → Enable

## STEP 4 — Security Rules laga dein (bahut zaroori)

1. Firestore Database → **Rules** tab kholein
2. Is ZIP ki `firestore.rules` file ka poora content copy karein aur
   console ke rules box me paste karke **Publish** kar dein.
3. Yehi rule ensure karta hai ki **koi aur website ka data change na kar
   paaye, aur enquiries ka data koi bahar wala na dekh paaye** — sirf
   aapke admin/staff users hi kar sakte hain.

## STEP 5 — Web app add karke config copy karein

1. Project Settings (⚙️ icon) → **Your apps** → Web (`</>`) icon → app
   register karein (naam kuch bhi)
2. Jo `firebaseConfig = { ... }` object dikhega, use copy karein
3. Is ZIP ki root me `firebase-config.js` file kholein aur apna config
   waha paste kar dein (jahan `YOUR_API_KEY` waghera likha hai)

## STEP 6 — Pehla Admin banayein (sirf ek baar, manually)

Google Sign-In me password nahi banta, isliye pehla admin ko sirf
**allowlist** karna hai — koi account banana nahi padta:

1. Firestore Database → **Data** tab → **Start collection** →
   Collection ID: `admins`
2. **Document ID**: bilkul yeh type karein (auto-ID mat lena):
   ```
   ronakcomputerbhl@gmail.com
   ```
3. Fields add karein:
   - `email` (string) → `ronakcomputerbhl@gmail.com`
   - `role` (string) → `admin`
4. **Save**

Bas — ab `admin/login.html` par jaakar **"Sign in with Google"** dabayein
aur wahi Google account select karein — turant panel khul jaayega. Isi
Users tab se aage aur log add kiye ja sakte hain (unhe sirf apna Gmail
select karke login karna hoga, kuch aur setup nahi karna padega).

## STEP 7 — Firebase Hosting par deploy karein

Terminal/CMD kholein, is project folder me jaayein, phir:

```
npm install -g firebase-tools
firebase login
firebase deploy
```

(Is ZIP me `firebase.json` aur `.firebaserc` pehle se hain — bas
`.firebaserc` me `YOUR_FIREBASE_PROJECT_ID` ko apne asli Project ID se
badal dein, jo Project Settings me milega.)

Deploy hone ke baad Firebase ek live URL dega
(jaise `https://msinfotechbhl.web.app`) — yeh domain Google Sign-In ke
liye Firebase khud-ba-khud authorize kar deta hai. Agar aap apna khud ka
domain (jaise `msinfotechbhl.com`) use karte hain, to use bhi add karna
hoga: **Authentication → Settings → Authorized domains → Add domain**.

---

## Security kaise kaam karti hai (short me)

- `firebase-config.js` ki keys "secret" nahi hoti — Firebase khud inhe
  public rakhna normal maanta hai.
- Asli security **Firestore Rules** se hoti hai: koi bhi apne Google
  account se login kar sakta hai, par jab tak uska Gmail address
  `admins` collection me na ho, use admin panel me **kuch dikhega nahi
  aur kuch edit nahi kar payega** — turant sign-out ho jaayega.
- Naye log sirf ek maujooda "admin" hi Users tab se add kar sakta hai.
- Isliye "koi aur website open/change na kar paaye" wali requirement
  Firestore Rules se guaranteed hai, na ki chhupane se.

## Purane files ka kya karna hai

- `laptop-data.js`, `printer-data.js` — ab load nahi hoti, safely ignore
  kar sakte hain (delete bhi kar sakte hain agar chahein).
- `add-laptop.html`, `add-printer.html` — yeh purana "code generate karke
  copy-paste karo" wala tool tha, ab zaroorat nahi (admin panel isko
  replace kar chuka hai), par file waise hi rakhi hai, koi nuksan nahi.
