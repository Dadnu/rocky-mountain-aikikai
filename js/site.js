// Rocky Mountain Aikikai — site script
// 1) mobile menu  2) announcements from data/announcements.json  3) gallery lightbox

(function () {
  // ---------- Mobile menu ----------
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
  }

  // ---------- Announcements ----------
  const toDate = (s) => {
    const [y, m, d] = String(s).split("-").map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  };
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fmt = (s) =>
    toDate(s).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const escapeHtml = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Body text: blank line = new paragraph; [text](https://link) = link
  const renderBody = (s) =>
    escapeHtml(s)
      .split(/\n\s*\n/)
      .map((p) => "<p>" + p.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>').replace(/\n/g, "<br>") + "</p>")
      .join("");

  const list = document.querySelector("[data-announcements]");
  const bar = document.querySelector("[data-notice-bar]");

  if (list || bar) {
    const base = document.documentElement.dataset.base || "";
    fetch(base + "data/announcements.json", { cache: "no-cache" })
      .then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then((items) => {
        const active = (Array.isArray(items) ? items : [])
          .filter((a) => a && a.title && a.date)
          .filter((a) => !a.expires || toDate(a.expires) >= today)
          .sort((a, b) => (b.pinned === true) - (a.pinned === true) || toDate(b.date) - toDate(a.date));

        // Red bar at the top of every page: the newest pinned announcement
        const pinned = active.find((a) => a.pinned === true);
        if (bar && pinned) {
          bar.querySelector("[data-notice-text]").textContent = pinned.title;
          bar.hidden = false;
        }

        if (list) {
          const limit = Number(list.dataset.limit) || active.length;
          const shown = active.slice(0, limit);
          if (!shown.length) {
            list.innerHTML = '<li><span class="empty">No announcements right now. Regular classes are on as scheduled.</span></li>';
            return;
          }
          list.innerHTML = shown
            .map(
              (a) => `<li class="${a.pinned ? "pinned" : ""}">
                <time datetime="${escapeHtml(a.date)}">${fmt(a.date)}</time>
                <div><h3>${escapeHtml(a.title)}</h3>${renderBody(a.body)}</div>
              </li>`
            )
            .join("");
        }
      })
      .catch((err) => {
        console.error("Announcements failed to load:", err);
        if (list) list.innerHTML = '<li><span class="empty">Announcements could not be loaded. Regular classes are on as scheduled.</span></li>';
      });
  }

  // ---------- Gallery lightbox ----------
  const dialog = document.querySelector(".lightbox");
  if (dialog && typeof dialog.showModal === "function") {
    const big = dialog.querySelector("img");
    const cap = dialog.querySelector("p");
    document.querySelectorAll(".gallery button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const img = btn.querySelector("img");
        big.src = img.src;
        big.alt = img.alt;
        cap.textContent = btn.dataset.caption || "";
        dialog.showModal();
      });
    });
    dialog.querySelector(".close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  }
})();
