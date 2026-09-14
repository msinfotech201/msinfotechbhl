/* =========================================================
   MS INFOTECH — printer-data.js
   =========================================================
   YEH FILE OLD PRINTER STOCK KE LIYE HAI.
   Naya printer add karna ho, price/status badalna ho, ya kisi
   printer ko hatana ho — sab is EK file me hota hai.

   Photo ko "assets/printers/" folder me daalein aur "image"
   field me uska path likhein.

   status EXACTLY ismein se ek hona chahiye:
     "AVAILABLE"   "RESERVED"   "SOLD"

   price: exact price likhein, jaise "₹3,499"
   — ya khali "" chhod dein to website khud "Contact for Price"
   dikha degi.

   Printer BIK (sell ho) jaane ke baad:
     - Agar hamesha ke liye hata dena hai → neeche uska poora
       { ... } block delete kar dein.
     - Agar thodi der "Sold Out" dikhana hai → sirf
       status: "SOLD" kar dein, block delete mat karein.
   ========================================================= */

// ==========================================
// ADD NEW PRINTER HERE
// Copy the format below and add your printer
// ==========================================
const printerStock = [
  {
    id: 1,
    brand: "HP",
    model: "LaserJet Pro M126nw",
    type: "Laser",
    function: "Print + Scan + Copy",
    connectivity: "USB + WiFi",
    condition: "Good",
    price: "",
    status: "AVAILABLE",
    image: "assets/printers/hp-laserjet-m126nw.jpg",
    demo: true // DEMO / SAMPLE printer — remove this line once you replace it with real stock
  },
  {
    id: 2,
    brand: "Canon",
    model: "PIXMA E477",
    type: "Inkjet",
    function: "Print + Scan + Copy",
    connectivity: "USB + WiFi",
    condition: "Very Good",
    price: "",
    status: "AVAILABLE",
    image: "assets/printers/canon-pixma-e477.jpg",
    demo: true // DEMO / SAMPLE printer — remove this line once you replace it with real stock
  },
  {
    id: 3,
    brand: "Epson",
    model: "LQ-310",
    type: "Dot Matrix",
    function: "Print Only",
    connectivity: "USB",
    condition: "Working Condition",
    price: "",
    status: "AVAILABLE",
    image: "assets/printers/epson-lq-310.jpg",
    demo: true // DEMO / SAMPLE printer — remove this line once you replace it with real stock
  }
];
