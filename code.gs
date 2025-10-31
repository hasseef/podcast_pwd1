
/**
 * Google Apps Script backend for PodcastPWD forms.
 * Steps:
 * 1) Create a new Google Sheet (e.g., "PodcastPWD Forms Submissions").
 * 2) Tools -> Script editor -> paste this code.
 * 3) Deploy -> New Deployment -> type: Web app -> Execute as: Me, Who has access: Anyone with the link.
 * 4) Copy the web app URL and paste it into forms.js as ENDPOINT_URL.
 */
function doPost(e) {
  var sheetName = "Submissions";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  // Build header if empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["timestamp","source_page","name","email","phone","organization","message","category","extra","_raw"]);
  }
  var params = e.parameter || {};
  var ts = new Date();
  var row = [
    ts,
    params._source_page || "",
    params.name || params.fullname || "",
    params.email || "",
    params.phone || params.mobile || "",
    params.organization || params.org || "",
    params.message || params.msg || params.notes || "",
    params.category || params.type || "",
    params.extra || "",
    JSON.stringify(params)
  ];
  sheet.appendRow(row);
  return ContentService.createTextOutput(JSON.stringify({ok:true}))
    .setMimeType(ContentService.MimeType.JSON);
}
