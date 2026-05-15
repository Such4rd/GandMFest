/**
 * Endpoint Google Apps Script para la nueva estructura del formulario.
 * Crea una fila por cada persona: invitado/a, acompañante e hijos/as.
 * Columnas recomendadas en Google Sheets:
 * FECHA_ENVIO | ID_INVITACION | INVITADO_PRINCIPAL | TIPO | NOMBRE | INVITADO_DE | EMAIL | ASISTENCIA | ALERGIAS | CANCION
 */
const SHEET_NAME = 'Respuestas';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    ensureHeader_(sheet);

    const fecha = new Date();
    const lineas = Array.isArray(data.lineas) && data.lineas.length > 0
      ? data.lineas
      : buildFallbackLines_(data);

    const rows = lineas.map(linea => [
      fecha,
      data.id || '',
      data.invitado || '',
      linea.tipo || '',
      linea.nombre || '',
      linea.invitadoDe || data.invitadoDe || '',
      linea.email || data.email || '',
      linea.asistencia || data.asistencia || '',
      linea.alergias || '',
      linea.cancion || ''
    ]);

    if (rows.length > 0) {
      sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function ensureHeader_(sheet) {
  const headers = [
    'FECHA_ENVIO',
    'ID_INVITACION',
    'INVITADO_PRINCIPAL',
    'TIPO',
    'NOMBRE',
    'INVITADO_DE',
    'EMAIL',
    'ASISTENCIA',
    'ALERGIAS',
    'CANCION'
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    return;
  }

  const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  if (current.join('|') !== headers.join('|')) {
    sheet.insertRowBefore(1);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function buildFallbackLines_(data) {
  return [{
    tipo: 'INVITADO/A',
    nombre: data.invitado || '',
    invitadoDe: data.invitadoDe || '',
    email: data.email || '',
    asistencia: data.asistencia || '',
    alergias: data.intolerancias || '',
    cancion: data.cancion || ''
  }];
}
