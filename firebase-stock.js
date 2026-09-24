/* =========================================================
   MS INFOTECH — firebase-stock.js
   =========================================================
   Loads Old Laptop Stock / Old Printer Stock live from Firestore
   (collections "laptops" and "printers", managed from the admin
   panel) and feeds them into the existing render code in script.js.

   Include this AFTER script.js on old-laptop.html and old-printer.html.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector("#laptop-stock-grid")) {
    db.collection("laptops").get().then(function (snap) {
      laptopStock = snap.docs.map(docToItem);
      initLaptopStockPage();
    }).catch(function (err) {
      console.error("Could not load laptop stock:", err);
      initLaptopStockPage();
    });
  }

  if (document.querySelector("#printer-stock-grid")) {
    db.collection("printers").get().then(function (snap) {
      printerStock = snap.docs.map(docToItem);
      initPrinterStockPage();
    }).catch(function (err) {
      console.error("Could not load printer stock:", err);
      initPrinterStockPage();
    });
  }

  function docToItem(doc) {
    var data = doc.data();
    data._docId = doc.id;
    if (typeof data.id !== "number") data.id = 0;
    return data;
  }
});
