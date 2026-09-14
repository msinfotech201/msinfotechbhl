# MS INFOTECH — Website (Bhilwara)

Production-ready. Pure HTML5 / CSS3 / Vanilla JavaScript — no PHP, no database, no build step. Works directly on **GitHub Pages** with the custom domain `msinfotechbhl.com`.

---

## A. Final folder structure

```
ms-infotech-site/
├── index.html
├── about.html
├── services.html
├── laptop-repair.html
├── desktop-repair.html
├── cctv.html
├── networking.html
├── data-recovery.html
├── old-laptop.html
├── old-printer.html
├── contact.html
├── 404.html
├── add-laptop.html      (owner-only tool — not linked in public nav, blocked in robots.txt)
├── add-printer.html     (owner-only tool — not linked in public nav, blocked in robots.txt)
├── style.css
├── script.js
├── laptop-data.js      (edit THIS file to add/change old laptop stock)
├── printer-data.js     (edit THIS file to add/change old printer stock)
├── robots.txt
├── sitemap.xml
├── CNAME
├── README.md
└── assets/
    ├── logo.png            (your real logo, background removed)
    ├── favicon-48.png       (browser tab icon)
    ├── favicon-180.png      (apple-touch-icon)
    ├── laptops/
    │   └── README.txt       (where to put old-laptop stock photos)
    └── printers/
        └── README.txt       (where to put old-printer stock photos)
```

## B. List of all files (25 total)

| File | Purpose |
|---|---|
| index.html | Home page |
| about.html | About MS INFOTECH |
| services.html | All services overview |
| laptop-repair.html | Laptop repair detail page |
| desktop-repair.html | Desktop repair detail page |
| cctv.html | CCTV installation & repair detail page |
| networking.html | Networking detail page |
| data-recovery.html | Data recovery detail page (with disclaimer) |
| old-laptop.html | Old laptop stock catalog (filters/search/sort/modal) |
| old-printer.html | Old printer stock catalog (filters/search/sort/modal) |
| contact.html | Contact info + WhatsApp enquiry form + map |
| 404.html | Custom not-found page |
| add-laptop.html | Owner tool — generates code for laptop-data.js |
| add-printer.html | Owner tool — generates code for printer-data.js |
| style.css | All styling (single file) |
| script.js | All site behaviour: nav, WhatsApp system, laptop + printer stock rendering/filters |
| laptop-data.js | **Old laptop stock list only** — edit this file to add/change/remove laptops |
| printer-data.js | **Old printer stock list only** — edit this file to add/change/remove printers |
| robots.txt | Crawler rules |
| sitemap.xml | 11 public pages listed (404, add-laptop, add-printer correctly excluded) |
| CNAME | Custom domain for GitHub Pages |
| assets/logo.png | Your real logo, background removed, compressed |
| assets/favicon-48.png / favicon-180.png | Favicon + Apple touch icon |
| assets/laptops/ | Put old-laptop photos here |
| assets/printers/ | Put old-printer photos here |

## C. Files you need to replace / edit yourself

1. **`assets/laptops/`** and **`assets/printers/`** — currently empty. Add real photos of the laptops/printers you have in stock.
2. **Easiest way to add stock:** open `add-laptop.html` (for laptops) or `add-printer.html` (for printers) in your browser (works even by double-clicking the file, or once the site is live at `msinfotechbhl.com/add-laptop.html` / `msinfotechbhl.com/add-printer.html`). Fill in the form, see a live preview, click **Generate Code**, copy it, and paste into `laptop-data.js` / `printer-data.js`. These pages are hidden from Google and not in the menu — they're just for you.
3. **`laptop-data.js`** / **`printer-data.js`** (manual editing, if you prefer not to use the tools above) — these are the ONE file each for old-laptop / old-printer stock (marked `ADD NEW LAPTOP HERE` / `ADD NEW PRINTER HERE`). Replace the 3 DEMO items in each with your real stock (brand, model, specs, price, status, photo path). Do not edit `script.js` for this — it only holds site behaviour, not the stock lists.
4. **To remove an item once it's sold** (so it disappears from the site completely), delete its whole `{ ... }` block from `laptop-data.js` / `printer-data.js`. If you'd rather keep it visible for a while as "Sold Out", just change its `status` to `"SOLD"` instead of deleting it.
5. **Nothing else needs editing** — logo, address, phone, hours and domain are already final throughout the site.

---

## D. Exact GitHub Pages upload instructions

1. Go to [github.com](https://github.com) → **New repository** (any name, e.g. `ms-infotech-website`). Public repo, no README/gitignore needed (you already have one).
2. On your computer, unzip this project, then either:
   - **Web UI:** open the new repo → "uploading an existing file" → drag every file/folder in (keep `assets/` as a folder) → Commit.
   - **Git CLI:**
     ```
     git init
     git add .
     git commit -m "MS INFOTECH website — initial upload"
     git branch -M main
     git remote add origin https://github.com/<your-username>/<repo-name>.git
     git push -u origin main
     ```
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Branch = `main`, folder = **`/ (root)`** → **Save**.
6. GitHub will show a live URL like `https://<your-username>.github.io/<repo-name>/` within a minute or two — confirm the site loads there first.

## E. Exact custom-domain setup for msinfotechbhl.com

1. Still in **Settings → Pages**, scroll to **Custom domain**.
2. Type `msinfotechbhl.com` → **Save**. (The `CNAME` file in your repo already contains this, so GitHub also picks it up automatically from the file itself — either way works, this just confirms it in the UI.)
3. GitHub will show "DNS check unsuccessful" until you add the DNS records below — that's expected at this stage.

## F. DNS records required

At your domain registrar (GoDaddy, Hostinger, BigRock, etc. — wherever `msinfotechbhl.com` is registered), open DNS management and add:

**For the root domain (`msinfotechbhl.com`) — add 4 A records:**
| Type | Host/Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

**For `www.msinfotechbhl.com` (recommended, so both work) — add 1 CNAME record:**
| Type | Host/Name | Value |
|---|---|---|
| CNAME | www | `<your-username>.github.io` |

Remove/replace any existing conflicting A or CNAME records on the same host first. DNS changes can take anywhere from a few minutes to ~24–48 hours to fully propagate.

## G. HTTPS setup instructions

1. Once DNS propagates and GitHub's "DNS check" passes (refresh **Settings → Pages** to confirm), a checkbox called **"Enforce HTTPS"** becomes available.
2. Tick **Enforce HTTPS**. GitHub automatically issues and renews a free SSL certificate for `msinfotechbhl.com` — no extra steps, no cost, nothing to buy.
3. If the checkbox is greyed out, wait — it usually activates within a few hours of the DNS check passing. No action needed beyond waiting and re-checking.
4. Once enabled, `http://msinfotechbhl.com` automatically redirects to `https://msinfotechbhl.com`.

---

## H. Final testing checklist

Run through this after the domain goes live:

- [ ] `https://msinfotechbhl.com/` loads (Home)
- [ ] All 11 nav destinations load with no 404s: About, Services, Laptop Repair, Desktop Repair, CCTV, Networking, Data Recovery, Old Laptop Stock, Old Printer Stock, Contact
- [ ] Mobile menu (hamburger icon) opens/closes correctly on a phone-width screen
- [ ] "Services" dropdown opens on hover (desktop) and tap (mobile)
- [ ] Every **WhatsApp** button opens `wa.me/917300257678` with a pre-filled message
- [ ] Every **Call Now** button dials `+91 73002 57678`
- [ ] Contact form: submitting with a valid name + 10-digit mobile opens WhatsApp with Name/Mobile/Service/Message filled in
- [ ] Contact form: leaving name blank or entering an invalid mobile shows the red validation message and does **not** open WhatsApp
- [ ] Old Laptop Stock page: filters, search, sort, and "Available Laptops" counter all update correctly; clicking a card opens the detail popup
- [ ] Old Printer Stock page: filters, search, sort, and "Available Printers" counter all update correctly; clicking a card opens the detail popup
- [ ] Visiting a made-up URL (e.g. `/xyz.html`) shows the custom 404 page
- [ ] Logo displays correctly in the header and footer on every page, with no broken-image icon
- [ ] Browser tab shows the MS INFOTECH favicon
- [ ] No horizontal scrolling on a mobile-width screen on any page
- [ ] Padlock/HTTPS shows in the browser address bar (after Section G is complete)
- [ ] `https://msinfotechbhl.com/sitemap.xml` and `https://msinfotechbhl.com/robots.txt` both load correctly

---

## Notes on content honesty
No years of experience, customer counts, ratings, reviews, or awards are invented anywhere on the site or in the SEO schema. The 3 sample laptops on the Old Laptop Stock page and the 3 sample printers on the Old Printer Stock page are clearly labeled **DEMO** (badge on the card) and are not presented as real available stock — replace them with your actual inventory using `laptop-data.js` / `printer-data.js` as described above.
