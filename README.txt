PodcastPWD — Forms Backend (Google Apps Script) — 2025-10-31T14:19:28.215576

ما الذي في هذا المجلد؟
- forms.js           : ملف جافاسكربت يرسل نماذج الموقع إلى Google Apps Script (Google Sheet).
- code.gs            : كود Google Apps Script لاستقبال البيانات وتخزينها في ورقة "Submissions".
- success.html       : صفحة شكر اختيارية.
- *_patched.html     : نسخ من صفحاتك المعدلة لعمل الإرسال الخلفي (Ajax) بدلاً من mailto.

كيف أفعّل الاستقبال على Google Sheets؟
1) أنشئ Google Sheet جديدة (مثلاً: PodcastPWD Forms Submissions).
2) من الشيت: Extensions > Apps Script وافتح المحرّر.
3) الصق محتوى 'code.gs' بالكامل.
4) من زر Deploy (أعلى يمين) اختر 'New Deployment'، نوع 'Web app'.
   - Execute as: Me
   - Who has access: Anyone with the link
   - اضغط Deploy وانسخ رابط الويب (Web App URL).
5) افتح 'forms.js' واستبدل النص:
     PASTE_YOUR_DEPLOYED_APPS_SCRIPT_URL_HERE
   بالرابط الذي نسخته من خطوة 4.
6) ارفع 'forms.js' بجانب ملفات موقعك (نفس المجلد).
7) ارفع الصفحات *_patched.html مكان صفحاتك الأصلية (أو انسخ الفروقات منها).
8) اختبر نموذجاً: أرسل تعبئة، وافتح الشيت سترى صفاً جديداً في ورقة 'Submissions'.

ملاحظات:
- هناك حقل 'honeypot' لإيقاف السبام. لا تعبّئه.
- في forms.js الوضع no-cors لملاءمة Apps Script. تُعرض رسالة نجاح متفائلة.
- يمكنك تخصيص أسماء الحقول في code.gs أو إضافة أعمدة جديدة حسب حاجتك.
