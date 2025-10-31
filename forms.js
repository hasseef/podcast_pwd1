
/*! forms.js - PodcastPWD AJAX forms (v3 REQUIRED + robust redirect) */
const ENDPOINT_URL = "PASTE_YOUR_DEPLOYED_APPS_SCRIPT_URL_HERE"; // ضع رابط Web App هنا

function showToast(msg, isError=false){
  let t = document.getElementById('toast');
  if(!t){
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = "position:fixed;inset-inline-start:50%;transform:translateX(-50%);bottom:18px;background:linear-gradient(to left,#714984,#523663);color:#fff;padding:12px 16px;border-radius:12px;box-shadow:0 10px 24px rgba(0,0,0,.18);display:none;z-index:9999;font-family:'Cairo',sans-serif";
    document.body.appendChild(t);
  }
  t.style.background = isError ? '#b3261e' : 'linear-gradient(to left,#714984,#523663)';
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(()=>{ t.style.display='none'; }, 2800);
}

/* Required-only constraints */
function normalizeConstraints(form){
  const nameFields = form.querySelectorAll('[name="name"],[name="fullname"]');
  nameFields.forEach(el=> el.setAttribute('required',''));

  const emailFields = form.querySelectorAll('input[name="email"]');
  emailFields.forEach(el=>{
    el.setAttribute('type','email');
    el.setAttribute('inputmode','email');
  });

  const phoneFields = form.querySelectorAll('input[name="phone"],input[name="mobile"],input[type="tel"]');
  phoneFields.forEach(el=>{
    el.setAttribute('type','tel');
    el.setAttribute('pattern','\\+?\\d[\\d\\s\\-]{6,}');
  });

  const messageFields = form.querySelectorAll('textarea[name="message"],textarea[name="notes"],textarea[name="msg"]');
  messageFields.forEach(el=> el.setAttribute('required',''));
}

function validateForm(form){
  normalizeConstraints(form);
  if(!form.checkValidity()){
    form.reportValidity();
    showToast("رجاءً أكمل الحقول المطلوبة بصيغة صحيحة.", true);
    return false;
  }
  const email = form.querySelector('[name="email"]');
  if(email && email.value){
    const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value);
    if(!ok){ email.focus(); showToast("صيغة البريد الإلكتروني غير صحيحة.", true); return false; }
  }
  return true;
}

function getThankYouUrl(){
  // يحسب المسار الصحيح حتى داخل مسار فرعي مثل /podcast_pwd1/
  const {origin, pathname} = window.location;
  const parts = pathname.split('/').filter(Boolean);
  // احذف اسم الصفحة الحالية
  parts.pop();
  const base = '/' + parts.join('/') + '/';
  return origin + base + 'thankyou.html';
}

async function submitAjaxForm(ev){
  ev.preventDefault();
  const form = ev.target;

  if(!validateForm(form)) return;

  if(!ENDPOINT_URL || ENDPOINT_URL.includes("PASTE_YOUR_DEPLOYED")){
    showToast("لم يتم إعداد نقطة الإرسال بعد. يرجى تهيئة الرابط في forms.js", true);
    return;
  }

  // Honeypot
  const hp = form.querySelector('input[name="website"], input[name="hp"]');
  if(hp && hp.value.trim() !== ""){
    showToast("تم رفض الإرسال (spambot).", true);
    return;
  }

  const btn = form.querySelector('button[type="submit"], input[type="submit"]');
  const originalText = btn ? (btn.innerText || btn.value) : null;
  if(btn){ btn.disabled = true; if(btn.innerText){ btn.innerText = "جارٍ الإرسال…"; } else if(btn.value){ btn.value = "جارٍ الإرسال…"; } }

  try{
    const fd = new FormData(form);
    fd.append("_source_page", location.pathname.replace(/^.*\//,''));
    fd.append("_timestamp", new Date().toISOString());

    await fetch(ENDPOINT_URL, { method:"POST", mode:"no-cors", body: fd });

    showToast("تم استلام النموذج بنجاح. شكرًا لك!");
    form.reset();

    // ✅ تحويل صريح بدون أي علامة استفهام أو معاملات
    const ty = getThankYouUrl();
    setTimeout(()=>{ window.location.replace(ty); }, 900);

  }catch(err){
    console.error(err);
    showToast("تعذّر الإرسال، حاول لاحقًا.", true);
  }finally{
    if(btn){
      btn.disabled = false;
      if(originalText!==null){
        if(btn.innerText!==undefined){ btn.innerText = originalText; } else { btn.value = originalText; }
      }
    }
  }
}

function attachAjaxToForms(){
  document.querySelectorAll('form').forEach(f=>{
    if(!f.classList.contains('js-ajax-form')) f.classList.add('js-ajax-form');
    f.addEventListener('submit', submitAjaxForm);
  });
}
document.addEventListener('DOMContentLoaded', attachAjaxToForms);
