
/*! forms.js - PodcastPWD AJAX forms (v3: REQUIRED validation + redirect) */
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

/* Add/normalize basic constraints where missing */
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
    // يسمح بأرقام ومسافات وعلامات - مع + اختيارية في البداية وطول إجمالي ≥ 7
    el.setAttribute('pattern','\\+?\\d[\\d\\s\\-]{6,}');
  });

  const messageFields = form.querySelectorAll('textarea[name="message"],textarea[name="notes"],textarea[name="msg"]');
  messageFields.forEach(el=> el.setAttribute('required',''));
}

/* Validate using HTML5 validity + extra checks if needed */
function validateForm(form){
  normalizeConstraints(form);
  // Built-in check
  if(!form.checkValidity()){
    // Highlight and show native messages
    form.reportValidity();
    showToast("رجاءً أكمل الحقول المطلوبة بصيغة صحيحة.", true);
    return false;
  }
  // Optional extra: simple email sanity check
  const email = form.querySelector('[name="email"]');
  if(email && email.value){
    const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value);
    if(!ok){
      email.focus();
      showToast("صيغة البريد الإلكتروني غير صحيحة.", true);
      return false;
    }
  }
  return true;
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

  // Disable submit button while sending
  const btn = form.querySelector('button[type="submit"], input[type="submit"]');
  const originalText = btn ? (btn.innerText || btn.value) : null;
  if(btn){ btn.disabled = true; if(btn.innerText){ btn.innerText = "جارٍ الإرسال…"; } else if(btn.value){ btn.value = "جارٍ الإرسال…"; } }

  try{
    const fd = new FormData(form);
    fd.append("_source_page", location.pathname.replace(/^.*\//,''));
    fd.append("_timestamp", new Date().toISOString());

    await fetch(ENDPOINT_URL, { method:"POST", mode:"no-cors", body: fd });
    // Success (optimistic no-cors)
    showToast("تم استلام النموذج بنجاح. شكرًا لك!");
    form.reset();
    setTimeout(()=>{ window.location.href = "thankyou.html"; }, 900);
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
  // التفعيل لكل النماذج حتى لو نُسيَت class="js-ajax-form"
  document.querySelectorAll('form').forEach(f=>{
    if(!f.classList.contains('js-ajax-form')) f.classList.add('js-ajax-form');
    f.addEventListener('submit', submitAjaxForm);
  });
}

document.addEventListener('DOMContentLoaded', attachAjaxToForms);
