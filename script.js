/* =========================================================
   MS INFOTECH — script.js
   Vanilla JS only. No backend, no build step. GitHub Pages ready.
   ========================================================= */

// ---------------------------------------------------------
// CENTRAL WHATSAPP NUMBER — every WhatsApp button/link on the
// whole site is wired from this ONE variable. Change it here only.
// ---------------------------------------------------------
const WHATSAPP_NUMBER = "917300257678";

// =========================================================
// OLD LAPTOP STOCK DATA now lives in Firestore, managed from
// the admin panel (admin/panel.html -> Laptops tab). See
// firebase-stock.js for how it's loaded into laptopStock below.
// =========================================================

// =========================================================
// Placeholder image (used automatically if a laptop photo is
// missing or hasn't been uploaded yet, so the page never breaks)
// =========================================================
const LAPTOP_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250">' +
    '<rect width="400" height="250" fill="#142A4C"/>' +
    '<rect x="120" y="90" width="160" height="100" rx="6" fill="#0B1B33" stroke="#33507F" stroke-width="2"/>' +
    '<rect x="135" y="103" width="130" height="74" fill="#08152A"/>' +
    '<rect x="95" y="190" width="210" height="12" rx="4" fill="#E1263F"/>' +
    '<text x="200" y="230" fill="#A9B7D6" font-family="sans-serif" font-size="14" text-anchor="middle">Photo coming soon</text>' +
    "</svg>"
  );

// laptopStock / printerStock now load live from Firestore
// (see firebase-stock.js). They start empty here so the page
// never breaks before that data arrives.
var laptopStock = [];
var printerStock = [];

document.addEventListener("DOMContentLoaded", function () {
  wireMobileNav();
  wireWhatsappLinks();
  wireCallButtons();
  wireEnquiryForm();
  wireFooterYear();
  // initLaptopStockPage() / initPrinterStockPage() are now called
  // by firebase-stock.js once the live stock data has been fetched.
});

// =========================================================
// OLD PRINTER STOCK DATA now lives in Firestore, managed from
// the admin panel (admin/panel.html -> Printers tab).
// =========================================================

// Placeholder image for a printer photo that is missing/not uploaded yet
const PRINTER_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250">' +
    '<rect width="400" height="250" fill="#142A4C"/>' +
    '<rect x="120" y="90" width="160" height="100" rx="6" fill="#0B1B33" stroke="#33507F" stroke-width="2"/>' +
    '<rect x="135" y="103" width="130" height="74" fill="#08152A"/>' +
    '<rect x="95" y="190" width="210" height="12" rx="4" fill="#E1263F"/>' +
    '<text x="200" y="230" fill="#A9B7D6" font-family="sans-serif" font-size="14" text-anchor="middle">Photo coming soon</text>' +
    "</svg>"
  );

// ---------------------------------------------------------
// Mobile nav + dropdown toggle
// ---------------------------------------------------------
function wireMobileNav() {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  document.querySelectorAll(".has-dropdown > .dropdown-toggle").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var parent = btn.parentElement;
      var wasOpen = parent.classList.contains("is-open");
      document.querySelectorAll(".has-dropdown.is-open").forEach(function (el) {
        el.classList.remove("is-open");
      });
      if (!wasOpen) parent.classList.add("is-open");
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".has-dropdown")) {
      document.querySelectorAll(".has-dropdown.is-open").forEach(function (el) {
        el.classList.remove("is-open");
      });
    }
  });
}

// ---------------------------------------------------------
// WhatsApp links — every element with [data-wa] gets its href
// built from the single WHATSAPP_NUMBER variable above.
// Optional data-wa-msg sets the pre-filled message text.
// ---------------------------------------------------------
function wireWhatsappLinks() {
  var defaultMsg = "Hello MS INFOTECH, I would like to enquire about your service.";
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    var msg = el.getAttribute("data-wa-msg") || defaultMsg;
    el.setAttribute("href", "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
}

function wireCallButtons() {
  document.querySelectorAll("[data-call]").forEach(function (el) {
    el.setAttribute("href", "tel:+917300257678");
  });
}

function wireFooterYear() {
  var yearEl = document.querySelector("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ---------------------------------------------------------
// Enquiry form → validates, builds a message, opens WhatsApp
// ---------------------------------------------------------
function wireEnquiryForm() {
  var form = document.querySelector("#enquiry-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nameField = form.querySelector("#name");
    var mobileField = form.querySelector("#mobile");
    var serviceField = form.querySelector("#service");
    var messageField = form.querySelector("#message");

    var name = (nameField.value || "").trim();
    var mobile = (mobileField.value || "").trim().replace(/\s+/g, "");
    var service = serviceField.value;
    var message = (messageField.value || "").trim();

    var valid = true;

    toggleFieldError(nameField, name.length < 2);
    if (name.length < 2) valid = false;

    var mobileOk = /^[6-9]\d{9}$/.test(mobile.replace(/^(\+?91)/, ""));
    toggleFieldError(mobileField, !mobileOk);
    if (!mobileOk) valid = false;

    if (!valid) return;

    var text =
      "Hello MS INFOTECH,\n\n" +
      "I would like to enquire about your service.\n\n" +
      "Name: " + name + "\n" +
      "Mobile: " + mobile + "\n" +
      "Service: " + service + "\n" +
      "Message: " + (message || "-") + "\n\n" +
      "Please contact me.";

    var note = form.querySelector("#form-note");
    if (note) note.textContent = "Opening WhatsApp — please press Send inside WhatsApp to complete your enquiry.";

    // Also save the enquiry to Firestore so it shows up in the
    // admin panel's Enquiries tab. Best-effort: if Firebase isn't
    // configured/loaded on this page, this quietly does nothing —
    // the WhatsApp flow below still works either way.
    if (window.db) {
      window.db.collection("enquiries").add({
        name: name,
        mobile: mobile,
        service: service,
        message: message || "",
        status: "new",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).catch(function (err) {
        console.warn("Enquiry could not be saved to Firestore:", err);
      });
    }

    window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text), "_blank");
  });
}

function toggleFieldError(inputEl, hasError) {
  var wrapper = inputEl.closest(".form-field");
  if (!wrapper) return;
  wrapper.classList.toggle("has-error", hasError);
}

// =========================================================
// OLD LAPTOP STOCK PAGE — filters, search, sort, cards, modal
// =========================================================
function initLaptopStockPage() {
  var grid = document.querySelector("#laptop-stock-grid");
  if (!grid) return; // not on old-laptop.html

  var counterEl = document.querySelector("#stock-counter-num");
  if (counterEl) {
    counterEl.textContent = laptopStock.filter(function (l) { return l.status === "AVAILABLE"; }).length;
  }

  var brandSelect = document.querySelector("#filter-brand");
  var processorSelect = document.querySelector("#filter-processor");
  var ramSelect = document.querySelector("#filter-ram");
  var storageSelect = document.querySelector("#filter-storage");
  var conditionSelect = document.querySelector("#filter-condition");
  var availabilitySelect = document.querySelector("#filter-availability");
  var searchInput = document.querySelector("#search-laptop");
  var sortSelect = document.querySelector("#sort-laptops");
  var resetBtn = document.querySelector("#reset-filters");

  populateSelect(brandSelect, uniqueValues(laptopStock, "brand"));
  populateSelect(processorSelect, uniqueValues(laptopStock, "processor"));
  populateSelect(ramSelect, uniqueValues(laptopStock, "ram"));
  populateSelect(storageSelect, uniqueValues(laptopStock, "storage"));
  populateSelect(conditionSelect, uniqueValues(laptopStock, "condition"));

  [brandSelect, processorSelect, ramSelect, storageSelect, conditionSelect, availabilitySelect, sortSelect]
    .forEach(function (el) { if (el) el.addEventListener("change", renderStock); });
  if (searchInput) searchInput.addEventListener("input", renderStock);
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      [brandSelect, processorSelect, ramSelect, storageSelect, conditionSelect, availabilitySelect].forEach(function (el) {
        if (el) el.value = "";
      });
      if (searchInput) searchInput.value = "";
      if (sortSelect) sortSelect.value = "newest";
      renderStock();
    });
  }

  grid.addEventListener("click", function (e) {
    var enquireBtn = e.target.closest("[data-wa]");
    if (enquireBtn) return; // let the WhatsApp button work normally, don't open modal
    var card = e.target.closest(".laptop-card");
    if (card) openLaptopModal(Number(card.getAttribute("data-id")));
  });

  wireModal();
  renderStock();

  function uniqueValues(arr, key) {
    var values = arr.map(function (l) { return l[key]; }).filter(Boolean);
    return Array.from(new Set(values)).sort();
  }

  function populateSelect(selectEl, values) {
    if (!selectEl) return;
    values.forEach(function (v) {
      var opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      selectEl.appendChild(opt);
    });
  }

  function parsePrice(priceStr) {
    if (!priceStr) return Infinity;
    var digits = priceStr.replace(/[^\d]/g, "");
    return digits ? parseInt(digits, 10) : Infinity;
  }

  function renderStock() {
    var brand = brandSelect ? brandSelect.value : "";
    var processor = processorSelect ? processorSelect.value : "";
    var ram = ramSelect ? ramSelect.value : "";
    var storage = storageSelect ? storageSelect.value : "";
    var condition = conditionSelect ? conditionSelect.value : "";
    var availability = availabilitySelect ? availabilitySelect.value : "";
    var query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    var sortBy = sortSelect ? sortSelect.value : "newest";

    var filtered = laptopStock.filter(function (l) {
      if (brand && l.brand !== brand) return false;
      if (processor && l.processor !== processor) return false;
      if (ram && l.ram !== ram) return false;
      if (storage && l.storage !== storage) return false;
      if (condition && l.condition !== condition) return false;
      if (availability && l.status !== availability) return false;
      if (query) {
        var haystack = (l.brand + " " + l.model + " " + l.processor).toLowerCase();
        if (haystack.indexOf(query) === -1) return false;
      }
      return true;
    });

    filtered.sort(function (a, b) {
      if (sortBy === "price-low") return parsePrice(a.price) - parsePrice(b.price);
      if (sortBy === "price-high") return parsePrice(b.price) - parsePrice(a.price);
      if (sortBy === "brand-az") return (a.brand + a.model).localeCompare(b.brand + b.model);
      return b.id - a.id; // newest first
    });

    if (laptopStock.length === 0) {
      grid.innerHTML =
        '<div class="no-stock-msg"><h3>Currently no laptops are available in stock.</h3>' +
        '<p>Contact us on WhatsApp for upcoming stock.</p>' +
        '<a href="#" class="btn btn-blue" data-wa data-wa-msg="Hello MS INFOTECH, please let me know about upcoming old laptop stock.">WhatsApp Us</a></div>';
      return;
    }

    if (filtered.length === 0) {
      grid.innerHTML =
        '<div class="no-stock-msg"><h3>No laptops match your search/filters.</h3>' +
        '<p>Try adjusting your filters, or contact us directly on WhatsApp.</p>' +
        '<a href="#" class="btn btn-blue" data-wa data-wa-msg="Hello MS INFOTECH, I am looking for a used laptop.">WhatsApp Us</a></div>';
      wireWhatsappLinks();
      return;
    }

    grid.innerHTML = filtered.map(renderCard).join("");
    wireWhatsappLinks();
  }

  function renderCard(l) {
    var priceDisplay = l.price ? l.price : "Contact for Price";
    var waMsg =
      "Hello MS INFOTECH,\n\nI am interested in this laptop:\n\n" +
      "Brand: " + l.brand + "\n" +
      "Model: " + l.model + "\n" +
      "Processor: " + l.processor + "\n" +
      "RAM: " + l.ram + "\n" +
      "Storage: " + l.storage + "\n" +
      "Price: " + priceDisplay + "\n" +
      "Condition: " + l.condition + "\n\n" +
      "Please provide more details.";

    var actionHtml;
    if (l.status === "SOLD") {
      actionHtml = '<button type="button" class="btn btn-disabled btn-block" disabled>SOLD OUT</button>';
    } else if (l.status === "RESERVED") {
      actionHtml = '<button type="button" class="btn btn-disabled btn-block" disabled>RESERVED</button>';
    } else {
      actionHtml =
        '<a href="#" class="btn btn-red btn-block" data-wa data-wa-msg="' +
        escapeAttr(waMsg) +
        '">Enquire on WhatsApp</a>';
    }

    return (
      '<div class="laptop-card" data-id="' + l.id + '">' +
        '<div class="laptop-thumb">' +
          '<img src="' + l.image + '" alt="' + l.brand + ' ' + l.model + ' Used Laptop - MS INFOTECH Bhilwara" loading="lazy" onerror="this.onerror=null;this.src=\'' + LAPTOP_PLACEHOLDER + '\';">' +
          '<span class="status-badge ' + l.status + '">' + l.status + '</span>' +
          (l.demo ? '<span class="demo-badge">DEMO</span>' : '') +
        '</div>' +
        '<div class="laptop-body">' +
          '<h3>' + l.brand + ' ' + l.model + '</h3>' +
          '<div class="laptop-specline">' + l.processor + ' · ' + l.ram + ' RAM · ' + l.storage + '</div>' +
          '<span class="laptop-price">' + priceDisplay + '</span>' +
          '<ul class="spec-list">' +
            '<li><span class="spec-label">Display</span><span class="spec-value">' + l.display + '</span></li>' +
            '<li><span class="spec-label">Graphics</span><span class="spec-value">' + l.graphics + '</span></li>' +
            '<li><span class="spec-label">OS</span><span class="spec-value">' + l.os + '</span></li>' +
          '</ul>' +
          actionHtml +
        '</div>' +
      '</div>'
    );
  }
}

function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}

// ---------------------------------------------------------
// Laptop detail modal
// ---------------------------------------------------------
function wireModal() {
  var overlay = document.querySelector("#laptop-modal");
  if (!overlay) return;
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay || e.target.closest(".modal-close")) closeLaptopModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLaptopModal();
  });
}

function openLaptopModal(id) {
  var overlay = document.querySelector("#laptop-modal");
  if (!overlay) return;
  var l = laptopStock.find(function (item) { return item.id === id; });
  if (!l) return;

  var priceDisplay = l.price ? l.price : "Contact for Price";

  overlay.querySelector("#modal-photo-img").setAttribute("src", l.image);
  overlay.querySelector("#modal-photo-img").setAttribute(
    "alt",
    l.brand + " " + l.model + " Used Laptop - MS INFOTECH Bhilwara"
  );
  overlay.querySelector("#modal-photo-img").onerror = function () {
    this.onerror = null;
    this.src = LAPTOP_PLACEHOLDER;
  };
  overlay.querySelector("#modal-title").textContent = l.brand + " " + l.model;
  overlay.querySelector("#modal-status").textContent = l.status;
  overlay.querySelector("#modal-status").className = "status-badge " + l.status;
  overlay.querySelector("#modal-price").textContent = priceDisplay;

  var specsList = overlay.querySelector("#modal-specs");
  var specs = [
    ["Brand", l.brand], ["Model", l.model], ["Processor", l.processor], ["RAM", l.ram],
    ["Storage", l.storage], ["Display", l.display], ["Graphics", l.graphics],
    ["Operating System", l.os], ["Condition", l.condition]
  ];
  specsList.innerHTML = specs.map(function (s) {
    return '<li><span class="spec-label">' + s[0] + '</span><span class="spec-value">' + s[1] + '</span></li>';
  }).join("");

  var waMsg =
    "Hello MS INFOTECH,\n\nI am interested in this laptop:\n\n" +
    "Brand: " + l.brand + "\nModel: " + l.model + "\nProcessor: " + l.processor +
    "\nRAM: " + l.ram + "\nStorage: " + l.storage + "\nPrice: " + priceDisplay +
    "\nCondition: " + l.condition + "\n\nPlease provide more details.";

  var modalWaBtn = overlay.querySelector("#modal-wa-btn");
  if (l.status === "SOLD") {
    modalWaBtn.textContent = "SOLD OUT";
    modalWaBtn.className = "btn btn-disabled btn-block";
    modalWaBtn.removeAttribute("href");
  } else if (l.status === "RESERVED") {
    modalWaBtn.textContent = "RESERVED";
    modalWaBtn.className = "btn btn-disabled btn-block";
    modalWaBtn.removeAttribute("href");
  } else {
    modalWaBtn.textContent = "Enquire on WhatsApp";
    modalWaBtn.className = "btn btn-red btn-block";
    modalWaBtn.setAttribute("data-wa", "");
    modalWaBtn.setAttribute("data-wa-msg", waMsg);
    wireWhatsappLinks();
  }

  overlay.classList.add("is-open");
}

function closeLaptopModal() {
  var overlay = document.querySelector("#laptop-modal");
  if (overlay) overlay.classList.remove("is-open");
}

// =========================================================
// OLD PRINTER STOCK PAGE — filters, search, sort, cards, modal
// =========================================================
function initPrinterStockPage() {
  var grid = document.querySelector("#printer-stock-grid");
  if (!grid) return; // not on old-printer.html

  var counterEl = document.querySelector("#printer-stock-counter-num");
  if (counterEl) {
    counterEl.textContent = printerStock.filter(function (p) { return p.status === "AVAILABLE"; }).length;
  }

  var brandSelect = document.querySelector("#filter-printer-brand");
  var typeSelect = document.querySelector("#filter-printer-type");
  var functionSelect = document.querySelector("#filter-printer-function");
  var connectivitySelect = document.querySelector("#filter-printer-connectivity");
  var conditionSelect = document.querySelector("#filter-printer-condition");
  var availabilitySelect = document.querySelector("#filter-printer-availability");
  var searchInput = document.querySelector("#search-printer");
  var sortSelect = document.querySelector("#sort-printers");
  var resetBtn = document.querySelector("#reset-printer-filters");

  populateSelect(brandSelect, uniqueValues(printerStock, "brand"));
  populateSelect(typeSelect, uniqueValues(printerStock, "type"));
  populateSelect(functionSelect, uniqueValues(printerStock, "function"));
  populateSelect(connectivitySelect, uniqueValues(printerStock, "connectivity"));
  populateSelect(conditionSelect, uniqueValues(printerStock, "condition"));

  [brandSelect, typeSelect, functionSelect, connectivitySelect, conditionSelect, availabilitySelect, sortSelect]
    .forEach(function (el) { if (el) el.addEventListener("change", renderStock); });
  if (searchInput) searchInput.addEventListener("input", renderStock);
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      [brandSelect, typeSelect, functionSelect, connectivitySelect, conditionSelect, availabilitySelect].forEach(function (el) {
        if (el) el.value = "";
      });
      if (searchInput) searchInput.value = "";
      if (sortSelect) sortSelect.value = "newest";
      renderStock();
    });
  }

  grid.addEventListener("click", function (e) {
    var enquireBtn = e.target.closest("[data-wa]");
    if (enquireBtn) return; // let the WhatsApp button work normally, don't open modal
    var card = e.target.closest(".laptop-card");
    if (card) openPrinterModal(Number(card.getAttribute("data-id")));
  });

  wirePrinterModal();
  renderStock();

  function uniqueValues(arr, key) {
    var values = arr.map(function (p) { return p[key]; }).filter(Boolean);
    return Array.from(new Set(values)).sort();
  }

  function populateSelect(selectEl, values) {
    if (!selectEl) return;
    values.forEach(function (v) {
      var opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      selectEl.appendChild(opt);
    });
  }

  function parsePrice(priceStr) {
    if (!priceStr) return Infinity;
    var digits = priceStr.replace(/[^\d]/g, "");
    return digits ? parseInt(digits, 10) : Infinity;
  }

  function renderStock() {
    var brand = brandSelect ? brandSelect.value : "";
    var type = typeSelect ? typeSelect.value : "";
    var func = functionSelect ? functionSelect.value : "";
    var connectivity = connectivitySelect ? connectivitySelect.value : "";
    var condition = conditionSelect ? conditionSelect.value : "";
    var availability = availabilitySelect ? availabilitySelect.value : "";
    var query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    var sortBy = sortSelect ? sortSelect.value : "newest";

    var filtered = printerStock.filter(function (p) {
      if (brand && p.brand !== brand) return false;
      if (type && p.type !== type) return false;
      if (func && p.function !== func) return false;
      if (connectivity && p.connectivity !== connectivity) return false;
      if (condition && p.condition !== condition) return false;
      if (availability && p.status !== availability) return false;
      if (query) {
        var haystack = (p.brand + " " + p.model + " " + p.type).toLowerCase();
        if (haystack.indexOf(query) === -1) return false;
      }
      return true;
    });

    filtered.sort(function (a, b) {
      if (sortBy === "price-low") return parsePrice(a.price) - parsePrice(b.price);
      if (sortBy === "price-high") return parsePrice(b.price) - parsePrice(a.price);
      if (sortBy === "brand-az") return (a.brand + a.model).localeCompare(b.brand + b.model);
      return b.id - a.id; // newest first
    });

    if (printerStock.length === 0) {
      grid.innerHTML =
        '<div class="no-stock-msg"><h3>Currently no printers are available in stock.</h3>' +
        '<p>Contact us on WhatsApp for upcoming stock.</p>' +
        '<a href="#" class="btn btn-blue" data-wa data-wa-msg="Hello MS INFOTECH, please let me know about upcoming old printer stock.">WhatsApp Us</a></div>';
      return;
    }

    if (filtered.length === 0) {
      grid.innerHTML =
        '<div class="no-stock-msg"><h3>No printers match your search/filters.</h3>' +
        '<p>Try adjusting your filters, or contact us directly on WhatsApp.</p>' +
        '<a href="#" class="btn btn-blue" data-wa data-wa-msg="Hello MS INFOTECH, I am looking for a used printer.">WhatsApp Us</a></div>';
      wireWhatsappLinks();
      return;
    }

    grid.innerHTML = filtered.map(renderCard).join("");
    wireWhatsappLinks();
  }

  function renderCard(p) {
    var priceDisplay = p.price ? p.price : "Contact for Price";
    var waMsg =
      "Hello MS INFOTECH,\n\nI am interested in this printer:\n\n" +
      "Brand: " + p.brand + "\n" +
      "Model: " + p.model + "\n" +
      "Type: " + p.type + "\n" +
      "Function: " + p.function + "\n" +
      "Connectivity: " + p.connectivity + "\n" +
      "Price: " + priceDisplay + "\n" +
      "Condition: " + p.condition + "\n\n" +
      "Please provide more details.";

    var actionHtml;
    if (p.status === "SOLD") {
      actionHtml = '<button type="button" class="btn btn-disabled btn-block" disabled>SOLD OUT</button>';
    } else if (p.status === "RESERVED") {
      actionHtml = '<button type="button" class="btn btn-disabled btn-block" disabled>RESERVED</button>';
    } else {
      actionHtml =
        '<a href="#" class="btn btn-red btn-block" data-wa data-wa-msg="' +
        escapeAttr(waMsg) +
        '">Enquire on WhatsApp</a>';
    }

    return (
      '<div class="laptop-card" data-id="' + p.id + '">' +
        '<div class="laptop-thumb">' +
          '<img src="' + p.image + '" alt="' + p.brand + ' ' + p.model + ' Used Printer - MS INFOTECH Bhilwara" loading="lazy" onerror="this.onerror=null;this.src=\'' + PRINTER_PLACEHOLDER + '\';">' +
          '<span class="status-badge ' + p.status + '">' + p.status + '</span>' +
          (p.demo ? '<span class="demo-badge">DEMO</span>' : '') +
        '</div>' +
        '<div class="laptop-body">' +
          '<h3>' + p.brand + ' ' + p.model + '</h3>' +
          '<div class="laptop-specline">' + p.type + ' · ' + p.function + '</div>' +
          '<span class="laptop-price">' + priceDisplay + '</span>' +
          '<ul class="spec-list">' +
            '<li><span class="spec-label">Connectivity</span><span class="spec-value">' + p.connectivity + '</span></li>' +
            '<li><span class="spec-label">Condition</span><span class="spec-value">' + p.condition + '</span></li>' +
          '</ul>' +
          actionHtml +
        '</div>' +
      '</div>'
    );
  }
}

// ---------------------------------------------------------
// Printer detail modal
// ---------------------------------------------------------
function wirePrinterModal() {
  var overlay = document.querySelector("#printer-modal");
  if (!overlay) return;
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay || e.target.closest(".modal-close")) closePrinterModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closePrinterModal();
  });
}

function openPrinterModal(id) {
  var overlay = document.querySelector("#printer-modal");
  if (!overlay) return;
  var p = printerStock.find(function (item) { return item.id === id; });
  if (!p) return;

  var priceDisplay = p.price ? p.price : "Contact for Price";

  overlay.querySelector("#printer-modal-photo-img").setAttribute("src", p.image);
  overlay.querySelector("#printer-modal-photo-img").setAttribute(
    "alt",
    p.brand + " " + p.model + " Used Printer - MS INFOTECH Bhilwara"
  );
  overlay.querySelector("#printer-modal-photo-img").onerror = function () {
    this.onerror = null;
    this.src = PRINTER_PLACEHOLDER;
  };
  overlay.querySelector("#printer-modal-title").textContent = p.brand + " " + p.model;
  overlay.querySelector("#printer-modal-status").textContent = p.status;
  overlay.querySelector("#printer-modal-status").className = "status-badge " + p.status;
  overlay.querySelector("#printer-modal-price").textContent = priceDisplay;

  var specsList = overlay.querySelector("#printer-modal-specs");
  var specs = [
    ["Brand", p.brand], ["Model", p.model], ["Type", p.type], ["Function", p.function],
    ["Connectivity", p.connectivity], ["Condition", p.condition]
  ];
  specsList.innerHTML = specs.map(function (s) {
    return '<li><span class="spec-label">' + s[0] + '</span><span class="spec-value">' + s[1] + '</span></li>';
  }).join("");

  var waMsg =
    "Hello MS INFOTECH,\n\nI am interested in this printer:\n\n" +
    "Brand: " + p.brand + "\nModel: " + p.model + "\nType: " + p.type +
    "\nFunction: " + p.function + "\nConnectivity: " + p.connectivity + "\nPrice: " + priceDisplay +
    "\nCondition: " + p.condition + "\n\nPlease provide more details.";

  var modalWaBtn = overlay.querySelector("#printer-modal-wa-btn");
  if (p.status === "SOLD") {
    modalWaBtn.textContent = "SOLD OUT";
    modalWaBtn.className = "btn btn-disabled btn-block";
    modalWaBtn.removeAttribute("href");
  } else if (p.status === "RESERVED") {
    modalWaBtn.textContent = "RESERVED";
    modalWaBtn.className = "btn btn-disabled btn-block";
    modalWaBtn.removeAttribute("href");
  } else {
    modalWaBtn.textContent = "Enquire on WhatsApp";
    modalWaBtn.className = "btn btn-red btn-block";
    modalWaBtn.setAttribute("data-wa", "");
    modalWaBtn.setAttribute("data-wa-msg", waMsg);
    wireWhatsappLinks();
  }

  overlay.classList.add("is-open");
}

function closePrinterModal() {
  var overlay = document.querySelector("#printer-modal");
  if (overlay) overlay.classList.remove("is-open");
}
