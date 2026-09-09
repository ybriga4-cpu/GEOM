/* GEOM — assistant FAQ côté client (sans serveur).
   Répond à partir d'une liste de questions/réponses prédéfinies.
   Pour toute demande hors-sujet, renvoie vers la boîte aux lettres (contact.html). */

const GEOM_FAQ = [
  {
    q: "Comment adhérer à GEOM ?",
    keywords: ["adher", "membre", "rejoindre", "inscri"],
    a: "L'adhésion à GEOM est gratuite, pour toutes les catégories de membres. Le formulaire se trouve sur la page Adhésion — vous recevrez un accusé de réception puis une confirmation du Bureau."
  },
  {
    q: "Faut-il payer une cotisation ?",
    keywords: ["cotisation", "payer", "prix", "abonnement", "gratuit"],
    a: "Non. GEOM ne demande aucune cotisation, ni initiale ni périodique, y compris pour les membres opérateurs. Le groupement fonctionne uniquement grâce aux dons, subventions et parrainages."
  },
  {
    q: "Qui peut adhérer à GEOM ?",
    keywords: ["qui peut", "operateur", "opérateur", "industriel", "immobilier", "touris", "college", "collège", "secteur"],
    a: "Tout opérateur économique marocain : industriels, promoteurs immobiliers, opérateurs touristiques, investisseurs, prestataires de services. GEOM est organisé en six collèges sectoriels — voir la page Missions & structure."
  },
  {
    q: "GEOM remplace-t-il les fédérations sectorielles ?",
    keywords: ["cgem", "amica", "fimme", "fenelec", "amith", "fenagri", "federation", "fédération", "remplace", "concurrenc"],
    a: "Non. GEOM se positionne en complément transversal des fédérations sectorielles existantes, pas en concurrent : un opérateur déjà membre d'une fédération peut aussi adhérer à GEOM."
  },
  {
    q: "Comment faire un don ?",
    keywords: ["don", "soutenir", "financ", "subvention", "parrain"],
    a: "Depuis la page Adhésion, section « Soutenir par un don ». Un membre du Bureau vous recontactera pour les modalités pratiques."
  },
  {
    q: "Où trouver les publications ?",
    keywords: ["publication", "etude", "étude", "rapport", "pdf", "article"],
    a: "Toutes les publications sont en accès libre, sans inscription, sur la page Publications — filtrables par axe de recherche."
  },
  {
    q: "Comment proposer une étude ou un partenariat ?",
    keywords: ["propos", "partenariat", "collabor", "chercheur", "conseil scientifique"],
    a: "Écrivez-nous via la boîte aux lettres (page Contact) en précisant l'objet de votre proposition — elle sera transmise au Bureau et, si pertinent, au Conseil Scientifique."
  }
];

function chatFindAnswer(text) {
  const t = text.toLowerCase();
  for (const item of GEOM_FAQ) {
    if (item.keywords.some((k) => t.includes(k))) return item.a;
  }
  return "Je n'ai pas de réponse toute prête pour cette question. Écrivez-nous directement via la boîte aux lettres — un membre du Bureau vous répondra personnellement.";
}

function chatAppend(log, text, who) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${who}`;
  bubble.textContent = text;
  log.appendChild(bubble);
  log.scrollTop = log.scrollHeight;
}

function initChat() {
  const log = document.querySelector("[data-chat-log]");
  const form = document.querySelector("[data-chat-form]");
  const input = document.querySelector("[data-chat-input]");
  const chipsWrap = document.querySelector("[data-chat-chips]");
  if (!log || !form || !input) return;

  chatAppend(log, "Bonjour, je suis l'assistant FAQ de GEOM. Posez une question ou choisissez un sujet ci-dessous.", "bot");

  if (chipsWrap) {
    GEOM_FAQ.forEach((item) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chat-chip";
      chip.textContent = item.q;
      chip.addEventListener("click", () => {
        chatAppend(log, item.q, "user");
        chatAppend(log, item.a, "bot");
      });
      chipsWrap.appendChild(chip);
    });
  }

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    chatAppend(log, text, "user");
    chatAppend(log, chatFindAnswer(text), "bot");
    input.value = "";
  });
}

document.addEventListener("DOMContentLoaded", initChat);
