
/**
 * Google Apps Script backend for PodcastPWD forms — WITH EMAIL SUBJECT BY FORM TYPE.
 * - Saves submissions to Google Sheet ("Submissions").
 * - Sends a notification email to podcastpwd@talbiya.sa with a subject based on form type.
 */

function doPost(e) {
  var notifyEmail = "podcastpwd@talbiya.sa"; // عنوان البريد المستلم
  var sheetName = "Submissions";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["timestamp","source_page","name","email","phone","organization","message","category","extra","_raw"]);
  }

  var p = e.parameter || {};
  var ts = new Date();
  var source = (p._source_page || "").toLowerCase();

  // 🔹 تحديد نوع النموذج لتخصيص العنوان
  var subject;
  if (source.indexOf("apply-sponsorship") > -1) {
    subject = "📢 طلب رعاية – بودكاست ذوي الإعاقة";
  } else if (source.indexOf("partners-logos") > -1 || source.indexOf("partners") > -1) {
    subject = "🤝 طلب شراكة – بودكاست ذوي الإعاقة";
  } else if (source.indexOf("contact") > -1) {
    subject = "📬 تواصل – بودكاست ذوي الإعاقة";
  } else if (source.indexOf("team") > -1) {
    subject = "👥 طلب انضمام للفريق – بودكاست ذوي الإعاقة";
  } else {
    subject = "📝 نموذج جديد – بودكاست ذوي الإعاقة";
  }

  // 🔹 حفظ البيانات في Google Sheet
  var row = [
    ts,
    p._source_page || "",
    p.name || p.fullname || "",
    p.email || "",
    p.phone || p.mobile || "",
    p.organization || p.org || "",
    p.message || p.msg || p.notes || "",
    p.category || p.type || "",
    p.extra || "",
    JSON.stringify(p)
  ];
  sheet.appendRow(row);

  // 🔹 بناء الرسالة البريدية بتفاصيل النموذج
  var htmlBody = ""
    + "<div style='font-family:Tahoma,Arial,sans-serif;line-height:1.6'>"
    + "<h3>" + subject + "</h3>"
    + "<table border='0' cellpadding='6' style='border-collapse:collapse'>"
    + tr_("التاريخ/الوقت", ts)
    + tr_("مصدر الصفحة", p._source_page || "")
    + tr_("الاسم", p.name || p.fullname || "")
    + tr_("البريد", p.email || "")
    + tr_("الهاتف", p.phone || p.mobile || "")
    + tr_("الجهة", p.organization || p.org || "")
    + tr_("التصنيف", p.category || p.type || "")
    + tr_("الرسالة", (p.message || p.msg || p.notes || ""))
    + "</table>"
    + "<p style='margin-top:16px'>— نظام النماذج | بودكاست ذوي الإعاقة</p>"
    + "</div>";

  MailApp.sendEmail({
    to: notifyEmail,
    subject: subject,
    htmlBody: htmlBody
  });

  return ContentService
    .createTextOutput(JSON.stringify({ok:true}))
    .setMimeType(ContentService.MimeType.JSON);
}

function tr_(k, v) {
  return "<tr><td style='min-width:120px;color:#555'><b>" + esc(k) + "</b></td><td>" + esc(v) + "</td></tr>";
}
function esc(x) {
  if (x === null || x === undefined) return "";
  return String(x).replace(/[&<>]/g, function (c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];
  });
}
