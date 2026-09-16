/*
 * site-chrome.js
 * En-tête et pied de page centralisés pour le site GEOM.
 * Modifier le menu, le logo, ou le footer se fait UNIQUEMENT ici,
 * et se répercute automatiquement sur toutes les pages qui chargent ce script.
 *
 * Utilisation dans chaque page HTML :
 *   1. Remplacer le bloc <header class="site-header">...</header> par :
 *        <div id="site-header"></div>
 *   2. Remplacer le bloc <footer class="site-footer">...</footer> et le
 *      lien <a class="chat-launcher">...</a> qui le suit par :
 *        <div id="site-footer"></div>
 *   3. Ajouter juste avant </body> (ou avant les autres scripts) :
 *        <script src="assets/js/site-chrome.js"></script>
 */
(function () {

  // ---- Menu principal (ordre affiché = ordre de cette liste) ----
  var NAV_LINKS = [
    { href: "missions.html",     label: "Missions" },
    { href: "equipe.html",       label: "Équipe" },
    { href: "publications.html", label: "Publications" },
    { href: "observatoire.html", label: "Observatoire" },
    { href: "recherche.html",    label: "Recherche" },
    { href: "adhesion.html",     label: "Adhésion" },
    { href: "contact.html",      label: "Contact" }
  ];

  // ---- Liens du pied de page ----
  var FOOTER_LINKS = [
    { href: "mentions-legales.html",  label: "Mentions légales & confidentialité" },
    { href: "adhesion.html",          label: "Soutenir GEOM" },
    { href: "contact.html",           label: "Boîte aux lettres" },
    { href: "chat.html",              label: "Assistant / FAQ" },
    { href: "mailto:contact@geom.ma", label: "contact@geom.ma" }
  ];

  function currentPage() {
    var file = window.location.pathname.split("/").pop();
    return file === "" ? "index.html" : file;
  }

  function buildHeader() {
    var page = currentPage();
    var links = NAV_LINKS.map(function (item) {
      var current = item.href === page ? ' aria-current="page"' : "";
      return '<a href="' + item.href + '"' + current + ">" + item.label + "</a>";
    }).join("\n      ");

    return (
      '<header class="site-header">\n' +
      '  <div class="wrap header-inner">\n' +
      '    <a class="wordmark" href="index.html">\n' +
      "      <strong>GEOM . Group of Economic Operators of Morocco</strong>\n" +
      '      <span class="wordmark-sub">Groupement des Opérateurs Économiques du Maroc</span>\n' +
      "    </a>\n" +
      '    <nav class="main-nav" aria-label="Navigation principale">\n' +
      "      " + links + "\n" +
      "    </nav>\n" +
      '    <div class="header-right">\n' +
      '      <a class="site-logo" href="index.html">\n' +
      '        <img src="assets/img/geom-logo.png" alt="GEOM — Group of Economic Operators of Morocco / Groupement des Opérateurs Économiques du Maroc">\n' +
      "      </a>\n" +
      "    </div>\n" +
      "  </div>\n" +
      "</header>"
    );
  }

  function buildFooter() {
    var links = FOOTER_LINKS.map(function (item) {
      return '<a href="' + item.href + '">' + item.label + "</a>";
    }).join("\n      ");

    return (
      '<footer class="site-footer">\n' +
      '  <div class="wrap footer-inner">\n' +
      "    <div>\n" +
      '      <p class="footer-brand">GEOM</p>\n' +
      '      <p class="footer-meta">Association à but non lucratif régie par le Dahir n° 1-58-376 portant réglementation du droit d\'association.</p>\n' +
      '      <a href="admin.html" class="footer-admin-link">Admin</a>\n' +
      "    </div>\n" +
      '    <nav class="footer-nav">\n' +
      "      " + links + "\n" +
      "    </nav>\n" +
      "  </div>\n" +
      "</footer>\n" +
      '<a class="chat-launcher" href="chat.html">Assistant GEOM →</a>'
    );
  }

  function inject() {
    var headerSlot = document.getElementById("site-header");
    if (headerSlot) headerSlot.outerHTML = buildHeader();

    var footerSlot = document.getElementById("site-footer");
    if (footerSlot) footerSlot.outerHTML = buildFooter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }

})();
