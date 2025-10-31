
/*! forms.js - PodcastPWD AJAX forms (v1) */
const ENDPOINT_URL = "PASTE_YOUR_DEPLOYED_APPS_SCRIPT_URL_HERE";

function showToast(msg, isError=false){
  const t = document.getElementById('toast');
  if(!t) return alert(msg);
  t.textContent = msg;
  t.classList.toggle('error', !!isError);
  t.style.display = 'block';
  setTimeout(()=>{ t.style.display='none'; }, 3500);
}

async function submitAjaxForm(ev){
  ev.preventDefault();
  const form = ev.target;
  if(!ENDPOINT_URL || ENDPOINT_URL.includes("PASTE_YOUR_DEPLOYED")) {
    showToast("لم يتم إعداد نقطة الإرسال بعد. يرجى تهيئة الرابط في forms.js", true);
    return;
  }
  // Honeypot
  const hp = form.querySelector('input[name="website"], input[name="hp"]');
  if(hp && hp.value.trim() !== ""){
    showToast("تم رفض الإرسال (spambot).", true);
    return;
  }
  const formData = new FormData(form);
  // Include form name/source for Google Sheets
  formData.append("_source_page", location.pathname.replace(/^.*\\//,''));
  formData.append("_timestamp", new Date().toISOString());
  try {
    const res = await fetch(ENDPOINT_URL, {
      method: "POST",
      mode: "no-cors", // Apps Script allows no-cors; we still show success tentatively
      body: formData
    });
    // Optimistic success (no-cors)
    showToast("تم استلام النموذج بنجاح. شكرًا لك!");
    form.reset();
  } catch (e){
    console.error(e);
    showToast("تعذّر الإرسال، حاول لاحقًا.", true);
  }
}

function attachAjaxToForms(){
  document.querySelectorAll('form.js-ajax-form').forEach(f=>{
    f.addEventListener('submit', submitAjaxForm);
  });
}
document.addEventListener('DOMContentLoaded', attachAjaxToForms);
