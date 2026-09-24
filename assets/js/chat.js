/* GEOM — assistant FAQ côté client (sans serveur).
   Répond à partir d'une liste de questions/réponses prédéfinies.
   Pour toute demande hors-sujet, renvoie vers la boîte aux lettres (contact.html). */

const CHAT_AR = (document.documentElement.lang || "").toLowerCase().startsWith("ar");

const GEOM_FAQ_FR = [
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

// Version arabe : mêmes questions, mots-clés en arabe (et quelques mots latins utiles).
const GEOM_FAQ_AR = [
  {
    q: "كيف أنخرط في GEOM؟",
    keywords: ["انخرط", "انخراط", "عضو", "عضوية", "انضم", "انضمام", "تسجيل", "سجل"],
    a: "الانخراط في GEOM مجاني لجميع فئات الأعضاء. يوجد النموذج في صفحة «الانخراط» — وستتوصلون بإشعار بالتوصل ثم بتأكيد من المكتب."
  },
  {
    q: "هل يجب أداء اشتراك؟",
    keywords: ["اشتراك", "أداء", "اداء", "دفع", "ثمن", "سعر", "مجان", "رسوم", "واجب"],
    a: "لا. لا يطلب GEOM أي اشتراك، لا عند الانخراط ولا بشكل دوري، بما في ذلك بالنسبة للأعضاء الفاعلين. ويعمل التجمّع فقط بفضل الهبات والإعانات والرعاية."
  },
  {
    q: "من يمكنه الانخراط في GEOM؟",
    keywords: ["من يمكن", "فاعل", "صناع", "عقار", "سياح", "هيئة", "هيئات", "قطاع", "مقاول"],
    a: "كل فاعل اقتصادي مغربي: الصناعيون، والمنعشون العقاريون، والفاعلون السياحيون، والمستثمرون، ومقدّمو الخدمات. وينتظم GEOM في ست هيئات قطاعية — انظر صفحة «المهام والهيكلة»."
  },
  {
    q: "هل يعوّض GEOM الجامعات القطاعية؟",
    keywords: ["cgem", "amica", "fimme", "fenelec", "amith", "fenagri", "جامعة", "جامعات", "كونفدرالية", "يعوض", "يعوّض", "منافس"],
    a: "لا. يتموقع GEOM بوصفه مكمّلاً أفقياً للجامعات القطاعية القائمة وليس منافساً لها: إذ يمكن لفاعل منخرط أصلاً في جامعة ما أن ينخرط أيضاً في GEOM."
  },
  {
    q: "كيف أقدّم هبة؟",
    keywords: ["هبة", "تبرع", "دعم", "تمويل", "إعانة", "اعانة", "رعاية"],
    a: "من صفحة «الانخراط»، في قسم «الدعم بهبة». وسيتصل بكم أحد أعضاء المكتب لتحديد الكيفيات العملية."
  },
  {
    q: "أين أجد المنشورات؟",
    keywords: ["منشور", "منشورات", "دراسة", "دراسات", "تقرير", "مقال", "pdf"],
    a: "جميع المنشورات متاحة مجاناً ودون تسجيل في صفحة «المنشورات» — ويمكن تصفيتها حسب محور البحث."
  },
  {
    q: "كيف أقترح دراسة أو شراكة؟",
    keywords: ["اقتراح", "أقترح", "اقترح", "شراكة", "تعاون", "باحث", "المجلس العلمي"],
    a: "راسلونا عبر صندوق الرسائل (صفحة «اتصل بنا») مع تحديد موضوع اقتراحكم — وسيُحال على المكتب، وعند الاقتضاء على المجلس العلمي."
  }
];

const GEOM_FAQ = CHAT_AR ? GEOM_FAQ_AR : GEOM_FAQ_FR;
const CHAT_TXT = CHAT_AR ? {
  fallback: "ليس لدي جواب جاهز عن هذا السؤال. راسلونا مباشرة عبر صندوق الرسائل — وسيجيبكم أحد أعضاء المكتب شخصياً.",
  hello: "مرحباً، أنا مساعد الأسئلة الشائعة لـ GEOM. اطرحوا سؤالاً أو اختاروا موضوعاً أدناه."
} : {
  fallback: "Je n'ai pas de réponse toute prête pour cette question. Écrivez-nous directement via la boîte aux lettres — un membre du Bureau vous répondra personnellement.",
  hello: "Bonjour, je suis l'assistant FAQ de GEOM. Posez une question ou choisissez un sujet ci-dessous."
};

function chatFindAnswer(text) {
  const t = text.toLowerCase();
  for (const item of GEOM_FAQ) {
    if (item.keywords.some((k) => t.includes(k))) return item.a;
  }
  return CHAT_TXT.fallback;
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

  chatAppend(log, CHAT_TXT.hello, "bot");

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
