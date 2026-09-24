/* GEOM — comportements partagés
   Lit les fichiers JSON dans assets/data/ (chacun au format {"items":[...]})
   pour générer axes, publications, annonces et vidéos. Ces fichiers sont
   éditables sans coder — directement, ou via le backoffice /admin. */

async function loadItems(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error("Impossible de charger " + path);
  const data = await res.json();
  return data.items || [];
}

function axisStampMarkup(item) {
  return `
    <a class="fiche" href="${UI.research}#${item.id}">
      <span class="fiche-stamp">${item.stamp}</span>
      <h3>${tr(item, "title")}</h3>
      <p>${tr(item, "summary")}</p>
      <span class="fiche-meta">${tr(item, "expert")}</span>
    </a>`;
}

// Langue de la page (<html lang="ar"> => arabe). Les champs *_ar des JSON
// sont utilisés s'ils existent, sinon on retombe sur le texte français.
const IS_AR = (document.documentElement.lang || "").toLowerCase().startsWith("ar");
const tr = (item, key) => (IS_AR && item[key + "_ar"]) || item[key];
const UI = IS_AR
  ? { consult: "اطّلع ←", noPubAxis: "لا توجد منشورات في هذا المحور حالياً.", noPub: "المنشورات غير متاحة حالياً.",
      noAxes: "محاور البحث غير متاحة حالياً.", announce: "إعلان", noAnn: "لا توجد إعلانات حالياً.", annErr: "الإعلانات غير متاحة حالياً.",
      noVid: "لا توجد فيديوهات حالياً.", vidErr: "الفيديوهات غير متاحة حالياً.", research: "recherche-ar.html" }
  : { consult: "Consulter →", noPubAxis: "Aucune publication dans cet axe pour le moment.", noPub: "Publications indisponibles pour le moment.",
      noAxes: "Axes de recherche indisponibles pour le moment.", announce: "Annonce", noAnn: "Aucune annonce pour le moment.", annErr: "Annonces indisponibles pour le moment.",
      noVid: "Aucune vidéo pour le moment.", vidErr: "Vidéos indisponibles pour le moment.", research: "recherche.html" };

function monthLabel(dateStr) {
  const [year, month] = dateStr.split("-");
  const months = IS_AR
    ? ["", "يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", "يوليوز", "غشت", "شتنبر", "أكتوبر", "نونبر", "دجنبر"]
    : ["", "jan.", "fév.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  return `${months[parseInt(month, 10)] || ""} ${year}`;
}

function pubRowMarkup(pub) {
  return `
    <div class="pub-row" data-axis="${pub.axis}">
      <div class="pub-date">${monthLabel(pub.date)}</div>
      <div>
        <span class="pub-tag">${tr(pub, "type")} — ${tr(pub, "axisLabel")}</span>
        <h3 class="pub-title">${tr(pub, "title")}</h3>
        <p class="pub-desc">${tr(pub, "excerpt")}</p>
      </div>
      <a class="pub-dl" href="${pub.file}">${UI.consult}</a>
    </div>`;
}

function announcementMarkup(item) {
  return `
    <div class="pub-row">
      <div class="pub-date">${monthLabel(item.date)}</div>
      <div>
        <span class="pub-tag">${UI.announce}</span>
        <h3 class="pub-title">${tr(item, "title")}</h3>
        <p class="pub-desc">${tr(item, "body")}</p>
      </div>
      <span></span>
    </div>`;
}

function videoMarkup(item) {
  const isFile = /\.(mp4|webm|mov)$/i.test(item.url || "");
  const frame = isFile
    ? `<video src="${item.url}" controls preload="metadata"></video>`
    : `<iframe src="${item.url}" title="${tr(item, "title")}" allowfullscreen loading="lazy"></iframe>`;
  return `
    <div class="video-card">
      <div class="video-frame">${frame}</div>
      <div class="video-body">
        <h3>${tr(item, "title")}</h3>
        <p>${tr(item, "description") || ""}</p>
      </div>
    </div>`;
}

async function renderAxes(selector, limit) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    let axes = await loadItems("assets/data/axes.json");
    if (limit) axes = axes.slice(0, limit);
    el.innerHTML = axes.map(axisStampMarkup).join("");
  } catch (e) {
    el.innerHTML = `<p class="empty-state">${UI.noAxes}</p>`;
  }
}

async function renderPublications(selector, opts = {}) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    let pubs = await loadItems("assets/data/publications.json");
    pubs.sort((a, b) => (a.date < b.date ? 1 : -1));
    if (opts.limit) pubs = pubs.slice(0, opts.limit);

    const draw = (filter) => {
      const filtered = filter && filter !== "all" ? pubs.filter((p) => p.axis === filter) : pubs;
      el.innerHTML = filtered.length
        ? filtered.map(pubRowMarkup).join("")
        : `<p class="empty-state">${UI.noPubAxis}</p>`;
    };
    draw();

    if (opts.filterGroup) {
      const group = document.querySelector(opts.filterGroup);
      if (group) {
        group.addEventListener("click", (ev) => {
          const btn = ev.target.closest("[data-filter]");
          if (!btn) return;
          group.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("is-active"));
          btn.classList.add("is-active");
          draw(btn.dataset.filter);
        });
      }
    }
  } catch (e) {
    el.innerHTML = `<p class="empty-state">${UI.noPub}</p>`;
  }
}

async function renderAnnouncements(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const items = await loadItems("assets/data/announcements.json");
    items.sort((a, b) => (a.date < b.date ? 1 : -1));
    el.innerHTML = items.length
      ? items.map(announcementMarkup).join("")
      : `<p class="empty-state">${UI.noAnn}</p>`;
  } catch (e) {
    el.innerHTML = `<p class="empty-state">${UI.annErr}</p>`;
  }
}

async function renderVideos(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const items = await loadItems("assets/data/videos.json");
    items.sort((a, b) => (a.date < b.date ? 1 : -1));
    el.innerHTML = items.length
      ? items.map(videoMarkup).join("")
      : `<p class="empty-state">${UI.noVid}</p>`;
  } catch (e) {
    el.innerHTML = `<p class="empty-state">${UI.vidErr}</p>`;
  }
}

function initTabs(selector) {
  const wrap = document.querySelector(selector);
  if (!wrap) return;
  const tabs = wrap.querySelectorAll(".tab-btn");
  const panels = wrap.querySelectorAll(".tab-panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      panels.forEach((p) => p.classList.remove("is-active"));
      tab.classList.add("is-active");
      const target = wrap.querySelector(`#${tab.dataset.tab}`);
      if (target) target.classList.add("is-active");
    });
  });
}

function setActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach((a) => {
    if (a.getAttribute("href") === path) a.setAttribute("aria-current", "page");
  });
}

document.addEventListener("DOMContentLoaded", setActiveNav);
