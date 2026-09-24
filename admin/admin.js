/* =========================================================
   MS INFOTECH — admin/admin.js
   ========================================================= */

var currentUser = null;
var currentUserEmail = null;
var currentRole = null; // "admin" | "staff"

// ---------------------------------------------------------
// Auth guard — must be logged in AND present in "admins"
// ---------------------------------------------------------
auth.onAuthStateChanged(function (user) {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  var email = (user.email || "").toLowerCase();
  db.collection("admins").doc(email).get().then(function (doc) {
    if (!doc.exists) {
      auth.signOut().then(function () { window.location.href = "login.html"; });
      return;
    }
    currentUser = user;
    currentUserEmail = email;
    currentRole = doc.data().role || "staff";
    document.querySelector("#who-label").textContent =
      user.email + " (" + currentRole + ")";
    if (currentRole === "admin") {
      document.querySelector("#users-tab-btn").style.display = "";
    }
    loadLaptops();
    loadPrinters();
    loadEnquiries();
    if (currentRole === "admin") loadUsers();
  });
});

document.querySelector("#logout-btn").addEventListener("click", function () {
  auth.signOut().then(function () { window.location.href = "login.html"; });
});

// ---------------------------------------------------------
// Tabs
// ---------------------------------------------------------
document.querySelectorAll(".admin-tabs button[data-tab]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".admin-tabs button[data-tab]").forEach(function (b) {
      b.classList.remove("is-active");
    });
    btn.classList.add("is-active");
    document.querySelectorAll(".admin-tab-panel").forEach(function (p) {
      p.style.display = "none";
    });
    document.querySelector("#tab-" + btn.getAttribute("data-tab")).style.display = "";
  });
});

document.querySelectorAll("[data-close-modal]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelector("#" + btn.getAttribute("data-close-modal")).classList.remove("is-open");
  });
});

function fmtDate(ts) {
  if (!ts || !ts.toDate) return "-";
  return ts.toDate().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/* =========================================================
   LAPTOPS
   ========================================================= */
var editingLaptopId = null;

function loadLaptops() {
  db.collection("laptops").orderBy("id", "desc").get().then(function (snap) {
    var tbody = document.querySelector("#laptop-rows");
    document.querySelector("#laptop-count").textContent = snap.size + " laptop(s)";
    if (snap.empty) {
      tbody.innerHTML = '<tr><td colspan="5">Koi laptop add nahi kiya gaya hai.</td></tr>';
      return;
    }
    tbody.innerHTML = snap.docs.map(function (doc) {
      var l = doc.data();
      return (
        '<tr>' +
          '<td><strong>' + esc(l.brand) + ' ' + esc(l.model) + '</strong></td>' +
          '<td>' + esc(l.processor) + ' · ' + esc(l.ram) + ' · ' + esc(l.storage) + '</td>' +
          '<td>' + (l.price ? esc(l.price) : '<em>Contact</em>') + '</td>' +
          '<td><span class="badge ' + esc(l.status) + '">' + esc(l.status) + '</span></td>' +
          '<td class="row-actions">' +
            '<button class="admin-btn ghost small" data-edit="' + doc.id + '">Edit</button>' +
            '<button class="admin-btn danger small" data-delete="' + doc.id + '">Delete</button>' +
          '</td>' +
        '</tr>'
      );
    }).join("");

    tbody.querySelectorAll("[data-edit]").forEach(function (b) {
      b.addEventListener("click", function () { openLaptopModal(b.getAttribute("data-edit")); });
    });
    tbody.querySelectorAll("[data-delete]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (confirm("Yeh laptop hamesha ke liye delete karna hai?")) {
          db.collection("laptops").doc(b.getAttribute("data-delete")).delete().then(loadLaptops);
        }
      });
    });
  });
}

function openLaptopModal(docId) {
  editingLaptopId = docId || null;
  var form = document.querySelector("#laptop-form");
  form.reset();
  document.querySelector("#laptop-modal-title").textContent = docId ? "Edit Laptop" : "Add Laptop";

  if (docId) {
    db.collection("laptops").doc(docId).get().then(function (doc) {
      var l = doc.data();
      Object.keys(l).forEach(function (key) {
        var field = form.elements[key];
        if (field) field.value = l[key];
      });
      document.querySelector("#laptop-modal-overlay").classList.add("is-open");
    });
  } else {
    document.querySelector("#laptop-modal-overlay").classList.add("is-open");
  }
}

document.querySelector("#add-laptop-btn").addEventListener("click", function () { openLaptopModal(null); });

document.querySelector("#laptop-form").addEventListener("submit", function (e) {
  e.preventDefault();
  var form = e.target;
  var data = {
    brand: form.brand.value.trim(),
    model: form.model.value.trim(),
    processor: form.processor.value.trim(),
    ram: form.ram.value.trim(),
    storage: form.storage.value.trim(),
    display: form.display.value.trim(),
    graphics: form.graphics.value.trim(),
    os: form.os.value.trim(),
    condition: form.condition.value.trim(),
    price: form.price.value.trim(),
    status: form.status.value,
    image: form.image.value.trim()
  };

  var btn = document.querySelector("#laptop-save-btn");
  btn.disabled = true;

  var promise;
  if (editingLaptopId) {
    promise = db.collection("laptops").doc(editingLaptopId).update(data);
  } else {
    data.id = Date.now();
    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    promise = db.collection("laptops").add(data);
  }

  promise.then(function () {
    document.querySelector("#laptop-modal-overlay").classList.remove("is-open");
    loadLaptops();
  }).catch(function (err) {
    alert("Save nahi ho paya: " + err.message);
  }).finally(function () {
    btn.disabled = false;
  });
});

/* =========================================================
   PRINTERS
   ========================================================= */
var editingPrinterId = null;

function loadPrinters() {
  db.collection("printers").orderBy("id", "desc").get().then(function (snap) {
    var tbody = document.querySelector("#printer-rows");
    document.querySelector("#printer-count").textContent = snap.size + " printer(s)";
    if (snap.empty) {
      tbody.innerHTML = '<tr><td colspan="5">Koi printer add nahi kiya gaya hai.</td></tr>';
      return;
    }
    tbody.innerHTML = snap.docs.map(function (doc) {
      var p = doc.data();
      return (
        '<tr>' +
          '<td><strong>' + esc(p.brand) + ' ' + esc(p.model) + '</strong></td>' +
          '<td>' + esc(p.type) + ' · ' + esc(p.connectivity) + '</td>' +
          '<td>' + (p.price ? esc(p.price) : '<em>Contact</em>') + '</td>' +
          '<td><span class="badge ' + esc(p.status) + '">' + esc(p.status) + '</span></td>' +
          '<td class="row-actions">' +
            '<button class="admin-btn ghost small" data-edit="' + doc.id + '">Edit</button>' +
            '<button class="admin-btn danger small" data-delete="' + doc.id + '">Delete</button>' +
          '</td>' +
        '</tr>'
      );
    }).join("");

    tbody.querySelectorAll("[data-edit]").forEach(function (b) {
      b.addEventListener("click", function () { openPrinterModal(b.getAttribute("data-edit")); });
    });
    tbody.querySelectorAll("[data-delete]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (confirm("Yeh printer hamesha ke liye delete karna hai?")) {
          db.collection("printers").doc(b.getAttribute("data-delete")).delete().then(loadPrinters);
        }
      });
    });
  });
}

function openPrinterModal(docId) {
  editingPrinterId = docId || null;
  var form = document.querySelector("#printer-form");
  form.reset();
  document.querySelector("#printer-modal-title").textContent = docId ? "Edit Printer" : "Add Printer";

  if (docId) {
    db.collection("printers").doc(docId).get().then(function (doc) {
      var p = doc.data();
      Object.keys(p).forEach(function (key) {
        var field = form.elements[key];
        if (field) field.value = p[key];
      });
      document.querySelector("#printer-modal-overlay").classList.add("is-open");
    });
  } else {
    document.querySelector("#printer-modal-overlay").classList.add("is-open");
  }
}

document.querySelector("#add-printer-btn").addEventListener("click", function () { openPrinterModal(null); });

document.querySelector("#printer-form").addEventListener("submit", function (e) {
  e.preventDefault();
  var form = e.target;
  var data = {
    brand: form.brand.value.trim(),
    model: form.model.value.trim(),
    type: form.type.value.trim(),
    "function": form.elements["function"].value.trim(),
    connectivity: form.connectivity.value.trim(),
    condition: form.condition.value.trim(),
    price: form.price.value.trim(),
    status: form.status.value,
    image: form.image.value.trim()
  };

  var btn = document.querySelector("#printer-save-btn");
  btn.disabled = true;

  var promise;
  if (editingPrinterId) {
    promise = db.collection("printers").doc(editingPrinterId).update(data);
  } else {
    data.id = Date.now();
    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    promise = db.collection("printers").add(data);
  }

  promise.then(function () {
    document.querySelector("#printer-modal-overlay").classList.remove("is-open");
    loadPrinters();
  }).catch(function (err) {
    alert("Save nahi ho paya: " + err.message);
  }).finally(function () {
    btn.disabled = false;
  });
});

/* =========================================================
   ENQUIRIES
   ========================================================= */
function loadEnquiries() {
  db.collection("enquiries").orderBy("createdAt", "desc").get().then(function (snap) {
    var tbody = document.querySelector("#enquiry-rows");
    if (snap.empty) {
      tbody.innerHTML = '<tr><td colspan="6">Abhi tak koi enquiry nahi aayi.</td></tr>';
      return;
    }
    tbody.innerHTML = snap.docs.map(function (doc) {
      var q = doc.data();
      return (
        '<tr>' +
          '<td><strong>' + esc(q.name) + '</strong><br>' + esc(q.mobile) + '</td>' +
          '<td>' + esc(q.service || "-") + '</td>' +
          '<td>' + esc(q.message || "-") + '</td>' +
          '<td>' + fmtDate(q.createdAt) + '</td>' +
          '<td>' +
            '<select class="status-select" data-id="' + doc.id + '">' +
              ['new', 'contacted', 'closed'].map(function (s) {
                return '<option value="' + s + '"' + (q.status === s ? ' selected' : '') + '>' + s + '</option>';
              }).join("") +
            '</select>' +
          '</td>' +
          '<td class="row-actions">' +
            '<a href="https://wa.me/91' + esc((q.mobile || '').replace(/\D/g, '').slice(-10)) + '" target="_blank" rel="noopener" class="admin-btn ghost small">WhatsApp</a>' +
            '<button class="admin-btn danger small" data-delete="' + doc.id + '">Delete</button>' +
          '</td>' +
        '</tr>'
      );
    }).join("");

    tbody.querySelectorAll(".status-select").forEach(function (sel) {
      sel.addEventListener("change", function () {
        db.collection("enquiries").doc(sel.getAttribute("data-id")).update({ status: sel.value });
      });
    });
    tbody.querySelectorAll("[data-delete]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (confirm("Yeh enquiry delete karni hai?")) {
          db.collection("enquiries").doc(b.getAttribute("data-delete")).delete().then(loadEnquiries);
        }
      });
    });
  });
}

/* =========================================================
   USERS (admin role only)
   ========================================================= */
function loadUsers() {
  db.collection("admins").get().then(function (snap) {
    var tbody = document.querySelector("#user-rows");
    tbody.innerHTML = snap.docs.map(function (doc) {
      var u = doc.data();
      var isSelf = doc.id === currentUserEmail;
      return (
        '<tr>' +
          '<td>' + esc(u.email) + (isSelf ? ' <em>(aap)</em>' : '') + '</td>' +
          '<td>' +
            '<select class="role-select" data-id="' + doc.id + '"' + (isSelf ? ' disabled' : '') + '>' +
              '<option value="staff"' + (u.role === 'staff' ? ' selected' : '') + '>Staff</option>' +
              '<option value="admin"' + (u.role === 'admin' ? ' selected' : '') + '>Admin</option>' +
            '</select>' +
          '</td>' +
          '<td>' + fmtDate(u.addedAt) + '</td>' +
          '<td class="row-actions">' +
            (isSelf ? '' : '<button class="admin-btn danger small" data-remove="' + doc.id + '">Remove Access</button>') +
          '</td>' +
        '</tr>'
      );
    }).join("");

    tbody.querySelectorAll(".role-select").forEach(function (sel) {
      sel.addEventListener("change", function () {
        db.collection("admins").doc(sel.getAttribute("data-id")).update({ role: sel.value });
      });
    });
    tbody.querySelectorAll("[data-remove]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (confirm("Is user ka admin panel access hata dein? (Unka login account nahi hataya jaayega, sirf panel ka access band hoga.)")) {
          db.collection("admins").doc(b.getAttribute("data-remove")).delete().then(loadUsers);
        }
      });
    });
  });
}

document.querySelector("#add-user-btn").addEventListener("click", function () {
  document.querySelector("#user-form").reset();
  document.querySelector("#user-form-msg").textContent = "";
  document.querySelector("#user-modal-overlay").classList.add("is-open");
});

document.querySelector("#user-form").addEventListener("submit", function (e) {
  e.preventDefault();
  var form = e.target;
  var email = form.email.value.trim().toLowerCase();
  var role = form.role.value;
  var msg = document.querySelector("#user-form-msg");
  var btn = document.querySelector("#user-save-btn");

  btn.disabled = true;
  msg.className = "admin-msg";
  msg.textContent = "Saving...";

  // Google Sign-In means there's no password to create — we just
  // allowlist this Gmail address. The person can log in the moment
  // they click "Sign in with Google" and pick this exact account.
  db.collection("admins").doc(email).set({
    email: email,
    role: role,
    addedAt: firebase.firestore.FieldValue.serverTimestamp(),
    addedBy: currentUser.email
  })
    .then(function () {
      document.querySelector("#user-modal-overlay").classList.remove("is-open");
      loadUsers();
    })
    .catch(function (err) {
      msg.className = "admin-msg error";
      msg.textContent = "User add nahi ho paya: " + err.message;
    })
    .finally(function () {
      btn.disabled = false;
    });
});

function esc(str) {
  return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
