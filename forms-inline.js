
/* forms-inline.js — unify submit for all forms (Apps Script endpoint) */
(function () {
  var ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbxCRxg1L5S3BAzHwyC8dZJ6o9ocg0ZVrBiqsBJy58N_qIS7qHoGB2LJ3iN-lWXihgVb8g/exec";

  function initForms() {
    document.querySelectorAll("form").forEach(function (f) {
      f.setAttribute("accept-charset", "UTF-8");
      f.setAttribute("method", "post");
      f.setAttribute("action", "#");
      if (!f.querySelector('[name="_honey"],[name="website"],[name="hp"]')) {
        var hp = document.createElement("input");
        hp.type = "text"; hp.name = "_honey";
        hp.style.display = "none"; hp.tabIndex = -1; hp.autocomplete = "off";
        f.appendChild(hp);
      }
      if (!f.querySelector('[name="_next"]')) {
        var nx = document.createElement("input");
        nx.type = "hidden"; nx.name = "_next"; nx.value = "thankyou.html";
        f.appendChild(nx);
      }
      if (!f.querySelector('[name="_captcha"]')) {
        var cp = document.createElement("input");
        cp.type = "hidden"; cp.name = "_captcha"; cp.value = "false";
        f.appendChild(cp);
      }
      if (!f.querySelector('[name="_template"]')) {
        var tp = document.createElement("input");
        tp.type = "hidden"; tp.name = "_template"; tp.value = "table";
        f.appendChild(tp);
      }
    });
  }

  function toast(msg, isError) {
    var t = document.getElementById("toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      t.style.cssText =
        "position:fixed;inset-inline-start:50%;transform:translateX(-50%);bottom:18px;" +
        "background:" + (isError ? "#b3261e" : "linear-gradient(to left,#714984,#523663)") +
        ";color:#fff;padding:12px 16px;border-radius:12px;box-shadow:0 10px 24px rgba(0,0,0,.18);z-index:9999;font-family:'Cairo',sans-serif";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.display = "block";
    setTimeout(function(){ t.style.display = "none"; }, 2400);
  }

  function thanksURL() { return "thankyou.html"; }

  document.addEventListener("submit", function (ev) {
    var form = ev.target.closest("form");
    if (!form) return;
    ev.preventDefault();

    if (form.checkValidity && !form.checkValidity()) {
      form.reportValidity && form.reportValidity();
      toast("رجاءً أكمل الحقول المطلوبة.", true);
      return;
    }

    var hp = form.querySelector('input[name="_honey"], input[name="website"], input[name="hp"]');
    if (hp && hp.value.trim() !== "") {
      toast("تم رفض الإرسال (spambot).", true);
      return;
    }

    var email = form.querySelector('[name="email"]');
    if (email && email.value && !form.querySelector('[name="_replyto"]')) {
      var rp = document.createElement("input");
      rp.type = "hidden"; rp.name = "_replyto"; rp.value = email.value;
      form.appendChild(rp);
    }

    var fd = new FormData(form);
    fd.append("_source_page", location.pathname.replace(/^.*\//, ""));
    fd.append("_timestamp", new Date().toISOString());

    var btn = form.querySelector('button[type="submit"], input[type="submit"]');
    var original = btn ? (btn.innerText || btn.value) : null;
    if (btn) { btn.disabled = true; if (btn.innerText !== undefined) btn.innerText = "جارٍ الإرسال…"; else btn.value = "جارٍ الإرسال…"; }

    fetch(ENDPOINT_URL, { method: "POST", body: fd, mode: "no-cors" })
      .then(function () {
        toast("تم الإرسال بنجاح");
        form.reset();
        setTimeout(function(){ location.href = thanksURL(); }, 700);
      })
      .catch(function () {
        toast("تعذر الإرسال، حاول لاحقًا.", true);
      })
      .finally(function () {
        if (btn) { btn.disabled = false; if (original !== null) { if (btn.innerText !== undefined) btn.innerText = original; else btn.value = original; } }
      });

    return false;
  }, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initForms);
  } else {
    initForms();
  }
})();
