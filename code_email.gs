
/**
 * Google Apps Script backend for PodcastPWD forms WITH EMAIL NOTIFICATION.
 * - Logs every submission to Sheet "Submissions".
 * - Sends an email notification to podcastpwd@talbiya.sa with the submission details.
 *
 * Deployment:
 * 1) Open your Google Sheet -> Extensions -> Apps Script.
 * 2) Paste this code, Deploy -> Web App (Execute as: Me; Who has access: Anyone with the link).
 * 3) Copy the Web App URL and set it in forms.js as ENDPOINT_URL.
 * 4) On first submission, Apps Script will request permissions for Sheets and Mail (approve).
 */

function doPost(e) {
  var notifyEmail = "podcastpwd@talbiya.sa"; // notification recipient

  var sheetName = "Submissions";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);

  // Build header if empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["timestamp","source_page","name","email","phone","organization","message","category","extra","_raw"]);
  }

  var p = e.parameter || {};
  var ts = new Date();
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

  // Build email content (HTML)
  var subject = "نموذج جديد - " + (p._source_page || "PodcastPWD");
  var htmlBody = ""
    + "<div style='font-family:Tahoma,Arial,sans-serif;line-height:1.6'>"
    + "<h3>تم استلام نموذج جديد</h3>"
    + "<table border='0' cellpadding='6' style='border-collapse:collapse'>"
    + tr_("التاريخ/الوقت", ts)
    + tr_("مصدر الصفحة", p._source_page || "")
    + tr_("الاسم", p.name || p.fullname || "")
    + tr_("البريد", p.email || "")
    + tr_("الهاتف", p.phone || p.mobile || "")
    + tr_("الجهة", p.organization || p.org || "")
    + tr_("التصنيف", p.category || p.type || "")
    + tr_("الرسالة", (p.message || p.msg || p.notes || ""))
    + tr_("_raw", JSON.stringify(p))
    + "</table>"
    + "<p style='margin-top:16px'>— نظام نماذج بودكاست ذوي الإعاقة</p>"
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

// helper for table rows
function tr_(k, v){
  return "<tr><td style='min-width:120px;color:#555'><b>"+esc(k)+"</b></td><td>"+esc(v)+"</td></tr>";
}
function esc(x){
  if (x===null || x===undefined) return "";
  return String(x).replace(/[&<>]/g, function (c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];
  });
}
