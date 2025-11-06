// This is your updated Google Apps Script code (Code.gs)
// It now logs ALL parameters AND sends email notifications.

function doPost(e) {
  
  // --- ⬇️ SET YOUR ADMIN EMAIL HERE ⬇️ ---
  const NOTIFICATION_EMAIL = "ajit.info999@gmail.com"; 
  // --- ⬆️ SET YOUR ADMIN EMAIL HERE ⬆️ ---

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
        // User Info
        'Timestamp', 'Name', 'Mobile', 'Email', 'User Agent',
        
        // Motor Input Headers
        'PCB Stator OD (mm)', 'PCB Stator ID (mm)', 'PCB Board Thickness (mm)', 
        'Trace Width ID (mm)', 'Trace Gap (mm)', 'PCB Layer Oz (oz/ft²)',
        'Num PCB Layers', 'Num PCB Layers Series', 'Num PCB Layers Parallel',
        'PM Rotor Height (mm)', 'Air Gap (mm)', 'Remanence (T)',
        'Current (A)', 'Num Cells', 'Cell Charge Unit (V)', 'Motor Parallel Constant',
        
        // Trace Calculator Headers
        'TW Current', 'TW Temp Rise', 'TW Ambient Temp', 'TW Copper Thickness', 'TW Trace Length',
        'TW Internal Width', 'TW Internal Resistance', 'TW Internal Voltage', 'TW Internal Power',
        'TW External Width', 'TW External Resistance', 'TW External Voltage', 'TW External Power',

        // Motor Result Headers
        'Number of PCB', 'Stackup Height (mm)', 'Stator ID Circumference (mm)',
        'Trace Circumference at ID (mm)', 'Trace Radius ID (mm)', 'Radial Gap ID (mm)',
        'Radial Gap OD (mm)', 'Trace Radius OD (mm)', 'Trace Circumference at OD (mm)',
        'Trace Width OD (mm)', 'Average Trace Width (mm)',
        
        'Number of Stator Coil', 'Magnet Poles', 'Number of Phase',
        'Per Phase Coil', 'Coil per Phase 180 Apart', 'Number of Lines',
        'Number of Lines per Phase', 'Number of Lines per Phase 180 Apart',
        'Trace Length Radial Line (mm)', 'Curved Line Width (mm)',
        'Current Conducting Radial Length (mm)',
        
        'Total Conductor Length all 3 phases (m)', 'On Conductor Length (2 phases) (m)',
        '2 Phase Switch On with series layers (m)', 'All 3 Phase with series layers (m)',
        'Required Copper Thickness (oz/ft²)', 'Non Magnet Area (mm)', 'Radius OD (mm)',
        'Average Torque Radius (mm)', 'Surface Magnetic Value (T)', 'Height (H) (mm)',
        'Width (W) OD (mm)', 'Width (w) ID (mm)', 'Length (L) from ID to OD (mm)',
        'Force (N)', 'Voltage (V)', 'Power In (kW)', 'Torque (Nm)', 'RPM',
        'Power Out (kW)', 'kV (RPM/V)',
        
        'Actual Efficiency (%)', 'Copper Loss (W)', 'Core Loss (W)',
        'Mechanical Loss (W)', 'Stray Loss (W)', 'Total Loss (W)'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    // --- ALL DATA FOR THE NEW ROW ---
    const newRow = [
      // User Info
      data.timestamp,
      data.name,
      data.mobile,
      data.email,
      data.userAgent,
      
      // Motor Input values
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

      // Trace Calculator Data
      data.traceInputs.current,
      data.traceInputs.rise,
      data.traceInputs.ambient,
      data.traceInputs.thickness,
      data.traceInputs.trace,
      data.traceResults.internalWidth,
      data.traceResults.internalResistance,
      data.traceResults.internalVoltage,
      data.traceResults.internalPower,
      data.traceResults.externalWidth,
      data.traceResults.externalResistance,
      data.traceResults.externalVoltage,
      data.traceResults.externalPower,
      
      // Motor Result values
      data.results.numPCB,
      data.results.stackupHeight,
      data.results.statorIDCircumference,
      data.results.traceCircumferenceID,
      data.results.traceRadiusID,
      data.results.radialGapID,
      data.results.radialGapOD,
      data.results.traceRadiusOD,
      data.results.traceCircumferenceOD,
      data.results.traceWidthOD,
      data.results.avgTraceWidth,
      
      data.results.numStatorCoil,
      data.results.magnetPoles,
      data.results.numPhase,
      data.results.perPhaseCoil,
      data.results.coilPerPhase180,
      data.results.numLines,
      data.results.numLinesPerPhase,
      data.results.numLinesPerPhase180,
      data.results.traceLengthRadial,
      data.results.curvedLineWidth,
      data.results.currentConductingRadial,
      
      data.results.conductorLengthAll3Phase,
      data.results.conductorLength2Phase,
      data.results.twoPhase,
      data.results.all3Phase,
      data.results.reqCopperThickness,
      data.results.nonMagnetArea,
      data.results.radiusOD,
      data.results.avgTorqueRadius,
      data.results.surfaceMagneticValue,
      data.results.height,
      data.results.widthOD,
      data.results.widthID,
      data.results.lengthIDtoOD,
      
      data.results.force,
      data.results.voltage,
      data.results.powerIn,
      data.results.torque,
      data.results.rpm,
      data.results.powerOut,
      data.results.kv,

      data.results.actualEfficiency,
      data.results.copperLoss,
      data.results.coreLoss,
      data.results.mechanicalLoss,
      data.results.strayLoss,
      data.results.totalLoss
    ];

    sheet.appendRow(newRow);
    
    // --- ⬇️ NEW: Send Email Notifications ⬇️ ---
    
    // 1. Send notification to admin
    try {
      if (NOTIFICATION_EMAIL && NOTIFICATION_EMAIL !== "ajit.info999@gmail.com") {
        const adminSubject = "New PCB Calculator Submission Received";
        const adminBody = `A new submission was received from: ${data.name || 'N/A'} (${data.email || 'N/A'}).\n\nData has been saved to the spreadsheet.`;
        GmailApp.sendEmail(NOTIFICATION_EMAIL, adminSubject, adminBody);
      }
    } catch (emailError) {
      Logger.log(`Failed to send admin notification: ${emailError.toString()}`);
    }

    // 2. Send confirmation to the user
    try {
      if (data.email) { // Only send if an email was provided
        const userSubject = "Your PCB Calculator Submission";
        const userBody = `Hi ${data.name || 'there'},\n\nThank you for your submission. We have received your calculator data.\n\nBest regards,\nYour Team`;
        GmailApp.sendEmail(data.email, userSubject, userBody);
      }
    } catch (emailError) {
      Logger.log(`Failed to send user confirmation email to ${data.email}: ${emailError.toString()}`);
    }
    
    // --- ⬆️ End Email Notifications ⬆️ ---

    
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