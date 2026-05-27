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
        "PREBODA",
        "INTOLERANCIAS",
        "ACOMPANIANTE",
        "NUMERO_HIJOS",
        "NINIOS",
        "CANCION",
        "MENSAJE_NOVIOS"
      ]);
    }

    const data = JSON.parse(e.postData.contents);

    const nombreNuevo = String(data.invitado || "")
      .trim()
      .toLowerCase();

    if (!nombreNuevo) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: "El nombre del invitado es obligatorio."
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const lastRow = sheet.getLastRow();

    if (lastRow > 1) {
      const nombresExistentes = sheet
        .getRange(2, 3, lastRow - 1, 1)
        .getValues()
        .flat()
        .map(nombre => String(nombre || "").trim().toLowerCase());

      if (nombresExistentes.includes(nombreNuevo)) {
        return ContentService
          .createTextOutput(JSON.stringify({
            success: false,
            message: "Ya existe una respuesta registrada con ese nombre."
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    sheet.appendRow([
    new Date(),
    data.asistencia || "",
    data.invitado || "",
    data.autobus || "",
    data.preboda || "",
    data.intolerancias || "",
    data.acompanante || "",
    data.numeroHijos || 0,
    data.ninos || "",
    data.cancion || "",
    data.mensaje || ""
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