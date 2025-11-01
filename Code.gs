
/** Google Apps Script — PodcastPWD Forms (Arabic-safe) */
const SPREADSHEET_ID = 'PUT_YOUR_SHEET_ID_HERE';
const SHEET_NAME = 'responses';
const NOTIFY_EMAIL = 'podcastpwd@talbiya.sa';
const SENDER_NAME = 'PodcastPWD Forms';

function doPost(e) {
  const p = e.parameter || {};
  const now = new Date();
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  const row = [now, p.category||'', p.name||'', p.email||'', p.phone||'', p.skill||'', p.profile||'', p.message||'', p._source_page||'', p._timestamp||''];
  sh.appendRow(row);

  const subject = `نموذج جديد — ${p.category || 'عام'} — ${p.name || 'بدون اسم'}`;
  const htmlBody = `
    <div dir="rtl" style="font-family:Tahoma,Arial">
      <h3>تم استلام نموذج جديد</h3>
      <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse">
        <tr><th>التاريخ</th><td>${now.toLocaleString('ar-SA')}</td></tr>
        <tr><th>الفئة</th><td>${safe(p.category)}</td></tr>
        <tr><th>الاسم</th><td>${safe(p.name)}</td></tr>
        <tr><th>البريد</th><td>${safe(p.email)}</td></tr>
        <tr><th>الهاتف</th><td>${safe(p.phone)}</td></tr>
        <tr><th>المهارة/التخصص</th><td>${safe(p.skill)}</td></tr>
        <tr><th>الحساب/الرابط</th><td>${safe(p.profile)}</td></tr>
        <tr><th>الرسالة</th><td>${safe(p.message).replace(/\\n/g,'<br>')}</td></tr>
        <tr><th>الصفحة</th><td>${safe(p._source_page)}</td></tr>
        <tr><th>الطابع الزمني</th><td>${safe(p._timestamp)}</td></tr>
      </table>
    </div>`;
  const opts = { name:SENDER_NAME, replyTo:(p.email||''), htmlBody:htmlBody };
  MailApp.sendEmail(NOTIFY_EMAIL, subject, "تم استلام نموذج جديد.", opts);

  return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
}
function safe(v){ return (v||'').toString().replace(/[<>]/g, s => ({'<':'&lt;','>':'&gt;'}[s])); }
