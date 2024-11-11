function createVisitorsSheetIfNotExists() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let visitorsSheet = ss.getSheetByName('visitors');
  
  if (!visitorsSheet) {
    visitorsSheet = ss.insertSheet('visitors');
    visitorsSheet.appendRow([
      'Timestamp',
      'Side Selected',
      'IP Address',
      'Country',
      'City',
      'Browser',
      'Device',
      'Operating System',
      'Screen Resolution',
      'Language',
      'Time Spent (seconds)',
      'Pages Viewed'
    ]);
  }
  return visitorsSheet;
}

function doPost(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  try {
    Logger.log("Received request");
    Logger.log("Request parameters:", e.parameter);
    Logger.log("Request contents:", e.postData.contents);

    const data = JSON.parse(e.postData.contents);
    Logger.log("Parsed data:", data);
    
    if (data.type === 'rsvp') {
      Logger.log("Processing RSVP submission");
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      let rsvpSheet = ss.getSheetByName('Sheet1');
      
      if (!rsvpSheet) {
        Logger.log("Creating new RSVP sheet");
        rsvpSheet = ss.insertSheet('Sheet1');
        rsvpSheet.appendRow([
          'Timestamp',
          'Name',
          'Email',
          'Phone',
          'Guests',
          'Events',
          'Message',
          'Side'
        ]);
      }
      
      rsvpSheet.appendRow([
        new Date(),
        data.name,
        data.email,
        data.phone,
        data.guests,
        data.events.join(", "),
        data.message,
        data.side
      ]);
      Logger.log("RSVP data added successfully");
    }
    
    else if (data.type === 'visitor') {
      Logger.log("Processing visitor tracking");
      const visitorsSheet = createVisitorsSheetIfNotExists();
      visitorsSheet.appendRow([
        new Date(),
        data.side,
        data.ipAddress,
        data.country,
        data.city,
        data.browser,
        data.device,
        data.os,
        data.screenResolution,
        data.language,
        data.timeSpent,
        data.pagesViewed
      ]);
      Logger.log("Visitor data added successfully");
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success', 'data': data }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
      
  } catch(error) {
    Logger.log("Error occurred:", error);
    Logger.log("Error stack:", error.stack);
    return ContentService.createTextOutput(JSON.stringify({ 
      'result': 'error', 
      'error': error.toString(),
      'stack': error.stack 
    }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }
}

function doGet(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  return ContentService.createTextOutput("Service is running")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(headers);
}

function doOptions(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(headers);
}

function testSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Sheet1') || ss.insertSheet('Sheet1');
  sheet.appendRow(['Test', 'Data', new Date()]);
  Logger.log('Test data added to sheet');
} 