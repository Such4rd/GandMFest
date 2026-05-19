const SHEET_NAME = "INVITADOS";

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "FECHA",
        "ASISTENCIA",
        "INVITADO",
        "AUTOBUS",
        "INTOLERANCIAS",
        "ACOMPANIANTE",
        "NUMERO_HIJOS",
        "NINIOS",
        "CANCION"
      ]);
    }

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
    new Date(),
    data.asistencia || "",
    data.invitado || "",
    data.autobus || "",
    data.intolerancias || "",
    data.acompanante || "",
    data.numeroHijos || 0,
    data.ninos || "",
    data.cancion || ""
  ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        message: "Respuesta guardada correctamente"
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: false,
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}