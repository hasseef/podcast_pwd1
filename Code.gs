
/** Google Apps Script — PodcastPWD Forms (Arabic-safe, category subjects) */
const SPREADSHEET_ID = 'PUT_YOUR_SHEET_ID_HERE';   // ضع معرف Google Sheet
const SHEET_NAME     = 'responses';                // اسم الورقة
const NOTIFY_EMAIL   = 'podcastpwd@talbiya.sa';    // بريد الاستقبال
const SENDER_NAME    = 'PodcastPWD Forms';         // اسم المُرسل

/** خريطة عناوين البريد حسب نوع النموذج (category) */
const SUBJECT_MAP = {
  'sponsorship-request':       'طلب رعاية — بودكاست ذوي الإعاقة',
  'partnership-request':       'طلب شراكة — بودكاست ذوي الإعاقة',
  'guest-or-topic-suggestion': 'اقتراح ضيف/محور — بودكاست ذوي الإعاقة',
  'general-contact':           'تواصل عام — بودكاست ذوي الإعاقة',
  'team-join-request':         'طلب انضمام إلى الفريق — بودكاست ذوي الإعاقة'
};

/** وسم افتراضي إذا لم تُعرف الفئة */
const DEFAULT_SUBJECT = 'نموذج جديد — بودكاست ذوي الإعاقة';

/** أداة أمان للنص */
function safe(v){ return (v || '').toString().replace(/[<>]/g, s => ({'<':'&lt;','>':'&gt;'}[s])); }

function doPost(e) {
  const p = e.parameter || {};
  const now = new Date();

  // فتح الشيت
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  // حفظ الصف
  const row = [
    now,
    p.category || '',
    p.name || '',
    p.email || '',
    p.phone || '',
    p.skill || '',
    p.profile || '',
    p.message || '',
    p._source_page || '',
    p._timestamp || ''
  ];
  sh.appendRow(row);

  // تحديد عنوان البريد حسب category
  const subjectBase = SUBJECT_MAP[p.category] || DEFAULT_SUBJECT;
  const subject = p.name ? `${subjectBase} — ${p.name}` : subjectBase;

  // إنشاء جسم الرسالة HTML (اتجاه عربي)
  const htmlBody = `
    <div dir="rtl" style="font-family:Tahoma,Arial">
      <h3 style="margin:0 0 10px">استمارة جديدة</h3>
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

  const opts = {
    name: SENDER_NAME,
    replyTo: p.email || '',
    htmlBody: htmlBody
  };

  MailApp.sendEmail(NOTIFY_EMAIL, subject, 'تم استلام نموذج جديد.', opts);
  return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
}
