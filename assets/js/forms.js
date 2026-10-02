/* =====================================================================
   GEOM — envoi des formulaires (adhésion, don, contact) vers Google Sheets
   ---------------------------------------------------------------------
   Les réponses sont enregistrées dans une Google Sheet via un script
   Google Apps Script (voir google-apps-script/Code.gs dans le README).
   Collez ci-dessous l'URL de déploiement qui se termine par /exec.
   ===================================================================== */

window.GEOM_FORMS_ENDPOINT = "https://script.google.com/macros/s/AKfycbyB7W2wrGEk-I-dJHPpNFLAH_zBZMWTjwL5j76JX6YwpFL1RfrobV2JFNTIeQAy7M7_/exec";

(function () {
  const ENDPOINT = window.GEOM_FORMS_ENDPOINT;
  const isAr = (document.documentElement.lang || "").toLowerCase().startsWith("ar");

  const T = isAr
    ? {
        sending: "جارٍ الإرسال…",
        ok: "شكراً، تم تسجيل طلبكم بنجاح. سيتواصل معكم المكتب المسيّر.",
        err: "تعذّر الإرسال. تحقّقوا من الاتصال وأعيدوا المحاولة، أو راسلونا عبر contact@geom.ma.",
      }
    : {
        sending: "Envoi en cours…",
        ok: "Merci, votre envoi est bien enregistré. Le Bureau Dirigeant vous recontactera.",
        err: "L'envoi a échoué. Vérifiez votre connexion et réessayez, ou écrivez à contact@geom.ma.",
      };

  document.querySelectorAll("form[data-geom-form]").forEach((form) => {
    const status = document.createElement("p");
    status.className = "form-status";
    status.setAttribute("role", "status");
    form.appendChild(status);

    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const btn = form.querySelector('button[type="submit"]');

      if (!ENDPOINT || ENDPOINT.indexOf("/exec") === -1) {
        console.warn("GEOM : l'URL du script Google n'est pas configurée dans assets/js/forms.js");
        show(T.err, "err");
        return;
      }

      const data = new FormData(form);
      data.set("form", form.dataset.geomForm);
      data.set("langue", isAr ? "ar" : "fr");
      data.set("page", location.pathname);

      btn.disabled = true;
      show(T.sending, "busy");
      try {
        await fetch(ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          body: new URLSearchParams(data),
        });
        show(T.ok, "ok");
        form.reset();
      } catch (e) {
        show(T.err, "err");
      } finally {
        btn.disabled = false;
      }
    });

    function show(msg, kind) {
      status.textContent = msg;
      status.className = "form-status show " + kind;
    }
  });
})();
