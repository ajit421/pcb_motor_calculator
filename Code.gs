// This is your Google Apps Script code (Code.gs)

function doPost(e) {
  try {
    // Find the sheet named "Sheet1", or just use the first sheet
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    }
    
    const data = JSON.parse(e.postData.contents);
    
    // Prepare headers if this is the first entry
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp', 'Name', 'Mobile', 'Email', 'User Agent',
        
        // Input headers
        'PCB Stator OD (mm)', 'PCB Stator ID (mm)', 'PCB Board Thickness (mm)', 
        'Trace Width ID (mm)', 'Trace Gap (mm)', 'PCB Layer Oz (oz/ft²)',
        'Num PCB Layers', 'Num PCB Layers Series', 'Num PCB Layers Parallel',
        'PM Rotor Height (mm)', 'Air Gap (mm)', 'Remanence (T)',
        'Current (A)', 'Num Cells', 'Cell Charge Unit (V)', 'Motor Parallel Constant',
        
        // Key result headers
        'Number of PCB', 'Stackup Height (mm)', 'Voltage (V)', 'Power In (kW)', 
        'Torque (Nm)', 'RPM', 'Power Out (kW)', 'Actual Efficiency (%)',
        'Total Loss (W)', 'Copper Loss (W)'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    // Add new row
    // We add the user info at the start
    const newRow = [
      data.timestamp,
      data.name,
      data.mobile,
      data.email,
      data.userAgent,
      
      // Input values
      data.inputs.pcbStatorOD,
      data.inputs.pcbStatorID,
      data.inputs.pcbBoardThickness,
      data.inputs.traceWidthID,
      data.inputs.traceGap,
      data.inputs.pcbLayerOz,
      data.inputs.numPCBLayers,
      data.inputs.numPCBLayersseries,
      data.inputs.numPCBLayersParallel,
      data.inputs.pmRotorHeight,
      data.inputs.airGap,
      data.inputs.remanence,
      data.inputs.current,
      data.inputs.numCells,
      data.inputs.cellChargeUnit,
      data.inputs.motorParallelConstant,
      
      // Key result values
      data.results.numPCB,
      data.results.stackupHeight,
      data.results.voltage,
      data.results.powerIn,
      data.results.torque,
      data.results.rpm,
      data.results.powerOut,
      data.results.actualEfficiency,
      data.results.totalLoss,
      data.results.copperLoss
    ];
    
    sheet.appendRow(newRow);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Data saved successfully'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// This is good for testing your deployment URL
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({message: 'PCB Calculator API is running'}))
    .setMimeType(ContentService.MimeType.JSON);
}