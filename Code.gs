function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Add CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    
    sheet.appendRow([
      new Date(),
      data.name,
      data.email,
      data.phone,
      data.guests,
      data.events.join(", "),
      data.message,
      data.side
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success', 'data': data }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Service is running")
    .setMimeType(ContentService.MimeType.TEXT);
}

// Add this new function
function doOptions(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(headers);
} 