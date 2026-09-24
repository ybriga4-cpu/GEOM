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
 *
 * Bilingue FR / AR :
 *   - La langue est lue sur <html lang="..."> ("ar" => arabe, sinon français).
 *   - Le bouton de langue n'apparaît que sur les pages qui déclarent leur
 *     version dans l'autre langue, via une balise dans le <head> :
 *        <link rel="alternate" hreflang="ar" href="index-ar.html">   (page FR)
 *        <link rel="alternate" hreflang="fr" href="index.html">      (page AR)
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

  // ---- Menu principal — version arabe ----
  // (les pages intérieures arabes restent à créer : les liens pointent
  //  pour l'instant vers les pages françaises)
  var NAV_LINKS_AR = [
    { href: "missions-ar.html",     label: "المهام" },
    { href: "equipe-ar.html",       label: "الفريق" },
    { href: "publications-ar.html", label: "المنشورات" },
    { href: "observatoire-ar.html", label: "المرصد" },
    { href: "recherche-ar.html",    label: "البحث" },
    { href: "adhesion-ar.html",     label: "الانخراط" },
    { href: "contact-ar.html",      label: "اتصل بنا" }
  ];

  // ---- Liens du pied de page ----
  var FOOTER_LINKS = [
    { href: "mentions-legales-ar.html",  label: "Mentions légales & confidentialité" },
    { href: "adhesion-ar.html",          label: "Soutenir GEOM" },
    { href: "contact-ar.html",           label: "Boîte aux lettres" },
    { href: "chat-ar.html",              label: "Assistant / FAQ" },
    { href: "mailto:contact@geom.ma", label: "contact@geom.ma" }
  ];

  var FOOTER_LINKS_AR = [
    { href: "mentions-legales-ar.html",  label: "الإشعارات القانونية والسرية" },
    { href: "adhesion-ar.html",          label: "دعم GEOM" },
    { href: "contact-ar.html",           label: "صندوق الرسائل" },
    { href: "chat-ar.html",              label: "المساعد / الأسئلة الشائعة" },
    { href: "mailto:contact@geom.ma", label: "contact@geom.ma" }
  ];

  // ---- Textes fixes selon la langue ----
  var IS_AR = (document.documentElement.lang || "").toLowerCase().indexOf("ar") === 0;
  var T = IS_AR ? {
    home: "index-ar.html",
    title: "GEOM . تجمع الفاعلين الاقتصاديين بالمغرب",
    sub: "Group of Economic Operators of Morocco",
    navLabel: "التنقل الرئيسي",
    legal: "جمعية غير ربحية خاضعة للظهير الشريف رقم 1-58-376 المنظم لحق تأسيس الجمعيات.",
    chat: "مساعد GEOM ←",
    chatHref: "chat-ar.html",
    nav: NAV_LINKS_AR,
    footer: FOOTER_LINKS_AR
  } : {
    home: "index.html",
    title: "GEOM . Group of Economic Operators of Morocco",
    sub: "Groupement des Opérateurs Économiques du Maroc",
    navLabel: "Navigation principale",
    legal: "Association à but non lucratif régie par le Dahir n° 1-58-376 portant réglementation du droit d'association.",
    chat: "Assistant GEOM →",
    chatHref: "chat.html",
    nav: NAV_LINKS,
    footer: FOOTER_LINKS
  };

  // ---- Bouton de langue (seulement si la page déclare son équivalent) ----
  var LANG_LABELS = { ar: "العربية", fr: "Français" };
  function buildLangButton() {
    var current = IS_AR ? "ar" : "fr";
    var alt = document.querySelector('link[rel="alternate"][hreflang="' + (current === "ar" ? "fr" : "ar") + '"]');
    if (!alt) return "";
    var target = alt.getAttribute("hreflang");
    var title = target === "ar" ? "Version arabe du site" : "النسخة الفرنسية للموقع";
    return '      <a class="lang-btn" href="' + alt.getAttribute("href") + '" hreflang="' + target +
           '" lang="' + target + '" title="' + title + '">' + LANG_LABELS[target] + "</a>\n";
  }

  function currentPage() {
    var file = window.location.pathname.split("/").pop();
    return file === "" ? "index.html" : file;
  }

  function buildHeader() {
    var page = currentPage();
    var links = T.nav.map(function (item) {
      var current = item.href === page ? ' aria-current="page"' : "";
      return '<a href="' + item.href + '"' + current + ">" + item.label + "</a>";
    }).join("\n      ");

    return (
      '<header class="site-header">\n' +
      '  <div class="wrap header-inner">\n' +
      '    <a class="wordmark" href="' + T.home + '">\n' +
      "      <strong>" + T.title + "</strong>\n" +
      '      <span class="wordmark-sub" lang="' + (IS_AR ? "en" : "fr") + '">' + T.sub + "</span>\n" +
      "    </a>\n" +
      '    <nav class="main-nav" aria-label="' + T.navLabel + '">\n' +
      "      " + links + "\n" +
      "    </nav>\n" +
      '    <div class="header-right">\n' +
      buildLangButton() +
      '      <a class="site-logo" href="' + T.home + '">\n' +
      '        <img src="assets/img/geom-logo.png" alt="GEOM — Group of Economic Operators of Morocco / Groupement des Opérateurs Économiques du Maroc">\n' +
      "      </a>\n" +
      "    </div>\n" +
      "  </div>\n" +
      "</header>"
    );
  }

  function buildFooter() {
    var links = T.footer.map(function (item) {
      return '<a href="' + item.href + '">' + item.label + "</a>";
    }).join("\n      ");

    return (
      '<footer class="site-footer">\n' +
      '  <div class="wrap footer-inner">\n' +
      "    <div>\n" +
      '      <p class="footer-brand">GEOM</p>\n' +
      '      <p class="footer-meta">' + T.legal + "</p>\n" +
      '      <a href="admin.html" class="footer-admin-link">Admin</a>\n' +
      "    </div>\n" +
      '    <nav class="footer-nav">\n' +
      "      " + links + "\n" +
      "    </nav>\n" +
      "  </div>\n" +
      "</footer>\n" +
      '<a class="chat-launcher" href="' + T.chatHref + '">' + T.chat + "</a>"
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
