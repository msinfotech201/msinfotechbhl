/* =========================================================
   MS INFOTECH — laptop-data.js
   =========================================================
   YEH FILE OLD LAPTOP STOCK KE LIYE HAI.
   Naya laptop add karna ho, price/status badalna ho, ya kisi
   laptop ko hatana ho — sab is EK file me hota hai.

   Photo ko "assets/laptops/" folder me daalein aur "image"
   field me uska path likhein.

   status EXACTLY ismein se ek hona chahiye:
     "AVAILABLE"   "RESERVED"   "SOLD"

   price: exact price likhein, jaise "₹24,999"
   — ya khali "" chhod dein to website khud "Contact for Price"
   dikha degi.
   ========================================================= */

// ==========================================
// ADD NEW LAPTOP HERE
// Copy the format below and add your laptop
// ==========================================
const laptopStock = [
  {
    id: 1,
    brand: "Dell",
    model: "Latitude 5490",
    processor: "Intel Core i5 8th Gen",
    ram: "8 GB",
    storage: "256 GB SSD",
    display: "14 inch",
    graphics: "Intel Graphics",
    os: "Windows 11",
    condition: "Good",
    price: "₹24,999",
    status: "AVAILABLE",
    image: "assets/laptops/dell-latitude-5490.jpg",
    demo: true // DEMO / SAMPLE laptop — remove this line once you replace it with real stock
  },
  {
    id: 2,
    brand: "HP",
    model: "ProBook 440 G5",
    processor: "Intel Core i5 7th Gen",
    ram: "8 GB",
    storage: "1 TB HDD",
    display: "14 inch",
    graphics: "Intel Graphics",
    os: "Windows 10",
    condition: "Very Good",
    price: "₹18,500",
    status: "RESERVED",
    image: "assets/laptops/hp-probook-440.jpg",
    demo: true // DEMO / SAMPLE laptop — remove this line once you replace it with real stock
  },
  {
    id: 3,
    brand: "Lenovo",
    model: "ThinkPad E480",
    processor: "Intel Core i5 8th Gen",
    ram: "8 GB",
    storage: "256 GB SSD + 500 GB HDD",
    display: "14 inch",
    graphics: "Intel UHD Graphics",
    os: "Windows 11",
    condition: "Excellent",
    price: "",
    status: "SOLD",
    image: "assets/laptops/lenovo-thinkpad-e480.jpg",
    demo: true // DEMO / SAMPLE laptop — remove this line once you replace it with real stock
  }
];
