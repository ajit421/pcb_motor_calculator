// --- Brand & Contact Constants ---
const companyName = ' AirBuddy Aerospace '; // <-- Footer mein istemaal hoga
const companyWebsite = 'https://www.airbuddy.in';
const companyEmail = 'bibhuti@airbuddy.in';
const companyPhone = '+917079142368';
const logoBase64 = 'data:image/jpeg;base64,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'; // <-- Yahan apna Base64 logo paste karein

// --- PDF Generation System (Aapka Code, Refined) ---

document.addEventListener('DOMContentLoaded', function () {
    const downloadBtn = document.getElementById('downloadReportBtn');
    if (!downloadBtn) return;
    
    // Attach the main PDF generation function to the click event
    downloadBtn.addEventListener('click', generateCombinedPDF);
});

/**
 * Main function to generate the PDF.
 * (Aapke code jaisa)
 */
function generateCombinedPDF() {
  // 1. Check if calculation has run (Refined for your project)
  if (!window.motorResults) {
    alert("No calculation results available. Please run a calculation first.");
    return;
  }

  console.log("Loading PDF..."); // Replaced showLoading()

  setTimeout(() => {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Check for autoTable
      if (typeof doc.autoTable === 'undefined') {
          alert('Error: jsPDF-autoTable plugin not loaded.');
          return;
      }

      generatePDFContent(doc);

      doc.save("PCB_Motor_Calculator_Report.pdf");
      console.log("Full PDF report generated successfully!"); // Replaced showToast()

    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Error generating PDF: " + error.message); // Replaced showToast()
    } finally {
      console.log("Finished PDF generation."); // Replaced hideLoading()
    }
  }, 100);
}

/**
 * Main function to orchestrate the drawing of all PDF sections.
 * (Aapke code jaisa)
 */
function generatePDFContent(doc) {
  // Title
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text("PCB Motor Calculation Report", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 28, {
    align: "center",
  });
  
  // --- Yahan Header Add Karein ---
  if (logoBase64 && logoBase64.length > 100) {
      try {
        doc.addImage(logoBase64, 'JPEG', 14, 12, 30, 10);
      } catch(e) { console.error("Error adding logo:", e); }
  }
  // --- End Header ---

  let yPos = 40;

  // --- Get all data at the start ---
  const motorInputs = getMotorInputs();
  const motorResults = window.motorResults;
  const traceInputs = getTraceInputs();
  const traceResults = getTraceResults();

  // === MOTOR REPORT ===
  if (motorResults) {
    yPos = addMotorSection(doc, yPos, motorInputs, motorResults);
    yPos += 10;
  }

  // === TRACE REPORT ===
  if (traceResults) {
    yPos = addTraceSection(doc, yPos, traceInputs, traceResults);
    yPos += 10;
  }

  // Footer
  addFooter(doc);
}

/**
 * Motor Section (Refined to use your data)
 */
function addMotorSection(doc, yPos, inputs, results) {
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text("1. PCB Motor Calculator", 14, yPos);
  yPos += 10;

  // Input Parameters
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Input Parameters", 14, yPos);
  yPos += 8;

  const motorInputsData = [
    ["Parameter", "Value", "Unit"],
    ["PCB Stator OD", formatVal(inputs.pcbStatorOD), "mm"],
    ["PCB Stator ID", formatVal(inputs.pcbStatorID), "mm"],
    ["PCB Board Thickness", formatVal(inputs.pcbBoardThickness), "mm"],
    ["Trace Width at ID", formatVal(inputs.traceWidthID), "mm"],
    ["Trace Gap", formatVal(inputs.traceGap), "mm"],
    ["PCB Layer Oz/Ft²", formatVal(inputs.pcbLayerOz), "oz/ft²"],
    ["Number of PCB Layers", formatVal(inputs.numPCBLayers), ""],
    ["PCB Layers in Series", formatVal(inputs.numPCBLayersseries), ""],
    ["PCB Layers in Parallel", formatVal(inputs.numPCBLayersParallel), ""],
    ["PM Rotor Height", formatVal(inputs.pmRotorHeight), "mm"],
    ["Air Gap", formatVal(inputs.airGap), "mm"],
    ["Remanence Br", formatVal(inputs.remanence), "T"],
    ["Current", formatVal(inputs.current), "A"],
    ["Number of Cells", formatVal(inputs.numCells), ""],
    ["Cell Charge Unit", formatVal(inputs.cellChargeUnit), "V"],
    ["Parallel Stacking Constant", formatVal(inputs.motorParallelConstant), ""],
  ];

  doc.autoTable({
    startY: yPos,
    head: [motorInputsData[0]],
    body: motorInputsData.slice(1),
    theme: "grid",
    styles: {
      fontSize: 9, cellPadding: 3, lineColor: [200, 200, 200], lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [52, 152, 219], textColor: [255, 255, 255], fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 14, right: 14 },
  });

  yPos = doc.lastAutoTable.finalY + 10;

  // --- Output Parameters (COMPLETE) ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Output Results", 14, yPos);
  yPos += 8;

  // Table 1: PCB Dimensions
  const pcbDimData = [
    ["Parameter", "Value", "Unit"],
    ['Number of PCB', formatVal(results.numPCB), ''],
    ['Stackup Height', formatVal(results.stackupHeight), 'mm'],
    ['Stator ID Circumference', formatVal(results.statorIDCircumference), 'mm'],
    ['Trace Circumference at ID', formatVal(results.traceCircumferenceID), 'mm'],
    ['Trace Radius ID', formatVal(results.traceRadiusID), 'mm'],
    ['Radial Gap ID', formatVal(results.radialGapID), 'mm'],
    ['Radial Gap OD', formatVal(results.radialGapOD), 'mm'],
    ['Trace Radius OD', formatVal(results.traceRadiusOD), 'mm'],
    ['Trace Circumference at OD', formatVal(results.traceCircumferenceOD), 'mm'],
    ['Trace Width OD', formatVal(results.traceWidthOD), 'mm'],
    ['Average Trace Width', formatVal(results.avgTraceWidth), 'mm'],
  ];
  
  doc.autoTable({
    startY: yPos,
    head: [['PCB Dimensions', '', '']],
    body: pcbDimData,
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 3, lineColor: [200, 200, 200], lineWidth: 0.1 },
    headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontStyle: "bold" }, // Blue
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 14, right: 14 },
  });
  yPos = doc.lastAutoTable.finalY + 5;

  // Table 2: Stator/Rotor
  const statorData = [
    ["Parameter", "Value", "Unit"],
    ['Number of Stator Coil', formatVal(results.numStatorCoil), ''],
    ['Magnet Poles', formatVal(results.magnetPoles), ''],
    ['Number of Phase', formatVal(results.numPhase), ''],
    ['Per Phase Coil', formatVal(results.perPhaseCoil), ''],
    ['Coil per Phase 180 Apart', formatVal(results.coilPerPhase180), ''],
    ['Number of Lines', formatVal(results.numLines), ''],
    ['Number of Lines per Phase', formatVal(results.numLinesPerPhase), ''],
    ['Number of Lines per Phase 180 Apart', formatVal(results.numLinesPerPhase180), ''],
    ['Trace Length Radial Line', formatVal(results.traceLengthRadial), 'mm'],
    ['Curved Line Width', formatVal(results.curvedLineWidth), 'mm'],
    ['Current Conducting Radial Length', formatVal(results.currentConductingRadial), 'mm'],
  ];

  doc.autoTable({
    startY: yPos,
    head: [['Stator & Rotor Config', '', '']],
    body: statorData,
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 3, lineColor: [200, 200, 200], lineWidth: 0.1 },
    headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontStyle: "bold" }, // Blue
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 14, right: 14 },
  });
  yPos = doc.lastAutoTable.finalY + 5;

  // Table 3: Electrical
  const electricalData = [
    ["Parameter", "Value", "Unit"],
    ['Total Conductor Length (3 phase)', formatVal(results.conductorLengthAll3Phase), 'm'],
    ['On Conductor Length (2 phase)', formatVal(results.conductorLength2Phase), 'm'],
    ['2 Phase Switch On (series)', formatVal(results.twoPhase), 'm'],
    ['All 3 Phase (series)', formatVal(results.all3Phase), 'm'],
    ['Required Copper Thickness', formatVal(results.reqCopperThickness), 'oz/ft²'],
    ['Non Magnet Area', formatVal(results.nonMagnetArea), 'mm'],
    ['Radius OD', formatVal(results.radiusOD), 'mm'],
    ['Average Torque Radius', formatVal(results.avgTorqueRadius), 'mm'],
    ['Surface Magnetic Value', formatVal(results.surfaceMagneticValue), 'T'],
    ['Height (H)', formatVal(results.height), 'mm'],
    ['Width (W) OD', formatVal(results.widthOD), 'mm'],
    ['Width (w) ID', formatVal(results.widthID), 'mm'],
    ['Length (L) from ID to OD', formatVal(results.lengthIDtoOD), 'mm'],
    ['Force', formatVal(results.force), 'N'],
    ['Voltage', formatVal(results.voltage), 'V'],
    ['Power In', formatVal(results.powerIn), 'kW'],
    ['Torque', formatVal(results.torque), 'Nm'],
    ['RPM', formatVal(results.rpm), ''],
    ['Power Out', formatVal(results.powerOut), 'kW'],
    ['kV', formatVal(results.kv), 'RPM/V'],
  ];

  doc.autoTable({
    startY: yPos,
    head: [['Electrical Parameters', '', '']],
    body: electricalData,
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 3, lineColor: [200, 200, 200], lineWidth: 0.1 },
    headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255], fontStyle: "bold" }, // Green
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 14, right: 14 },
  });
  yPos = doc.lastAutoTable.finalY + 5;

  // Table 4: Losses
  const lossData = [
    ["Parameter", "Value", "Unit"],
    ['Actual Efficiency', formatVal(results.actualEfficiency), '%'],
    ['Copper Loss', formatVal(results.copperLoss), 'W'],
    ['Core Loss', formatVal(results.coreLoss), 'W'],
    ['Mechanical Loss', formatVal(results.mechanicalLoss), 'W'],
    ['Stray Loss', formatVal(results.strayLoss), 'W'],
    ['Total Loss', formatVal(results.totalLoss), 'W'],
  ];

  doc.autoTable({
    startY: yPos,
    head: [['Losses & Efficiency', '', '']],
    body: lossData,
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 3, lineColor: [200, 200, 200], lineWidth: 0.1 },
    headStyles: { fillColor: [211, 84, 0], textColor: [255, 255, 255], fontStyle: "bold" }, // Orange
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 14, right: 14 },
  });

  return doc.lastAutoTable.finalY + 10;
}

/**
 * Trace Section (Refined for your project)
 */
function addTraceSection(doc, yPos, inputs, results) {
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text("2. Trace Width Calculator (IPC-2221)", 14, yPos);
  yPos += 10;

  // Input Parameters
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Input Parameters", 14, yPos);
  yPos += 8;

  let traceInputData = [
    ["Parameter", "Value"],
    ["Current", inputs.current],
    ["Temperature Rise", inputs.rise],
    ["Ambient Temperature", inputs.ambient],
    ["Copper Thickness", inputs.thickness],
    ["Trace Length", inputs.trace],
  ];

  doc.autoTable({
    startY: yPos,
    head: [traceInputData[0]],
    body: traceInputData.slice(1),
    theme: "grid",
    styles: {
      fontSize: 9, cellPadding: 3, lineColor: [200, 200, 200], lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [52, 152, 219], textColor: [255, 255, 255], fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 14, right: 14 },
  });

  yPos = doc.lastAutoTable.finalY + 10;

  // Output Parameters
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Output Results", 14, yPos);
  yPos += 8;

  // Internal Layer Results
  let traceDataInternal = [
    ["Internal Layer", "Value"],
    ["Required Width", results.internalWidth],
    ["Resistance", results.internalResistance],
    ["Voltage Drop", results.internalVoltage],
    ["Power Loss", results.internalPower],
  ];
  
  doc.autoTable({
    startY: yPos,
    head: [traceDataInternal[0]],
    body: traceDataInternal.slice(1),
    theme: "grid",
    styles: {
      fontSize: 8, cellPadding: 2, lineColor: [200, 200, 200], lineWidth: 0.1,
      // Multi-line text ko handle karne ke liye cell padding
      cellPadding: {top: 2, right: 2, bottom: 2, left: 2},
    },
    headStyles: {
      fillColor: [46, 204, 113], textColor: [255, 255, 255], fontStyle: "bold", // Green
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 14, right: 14 },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 126 }, // Bada column width
    },
  });
  
  yPos = doc.lastAutoTable.finalY + 5;

  // External Layer Results
  let traceDataExternal = [
    ["External Layer", "Value"],
    ["Required Width", results.externalWidth],
    ["Resistance", results.externalResistance],
    ["Voltage Drop", results.externalVoltage],
    ["Power Loss", results.externalPower],
  ];

  doc.autoTable({
    startY: yPos,
    head: [traceDataExternal[0]],
    body: traceDataExternal.slice(1),
    theme: "grid",
    styles: {
      fontSize: 8, cellPadding: 2, lineColor: [200, 200, 200], lineWidth: 0.1,
      cellPadding: {top: 2, right: 2, bottom: 2, left: 2},
    },
    headStyles: {
      fillColor: [52, 152, 219], textColor: [255, 255, 255], fontStyle: "bold", // Blue
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: 14, right: 14 },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 126 },
    },
  });

  return doc.lastAutoTable.finalY + 10;
}

/**
 * Footer (Aapka code, refined)
 * Yeh har page ke end mein footer add karega.
 */
function addFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages(); // Sahi tareeka page count lene ka
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(120);
    
    // Page number (Centered)
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 15, { align: "center" });
    
    // Company name (Centered)
    doc.text(`${companyName} - PCB Calculator`, pageWidth / 2, pageHeight - 10, {
      align: "center",
    });
    
    // Contact Info (Left)
    doc.text(companyEmail, 14, pageHeight - 15);
    doc.text(companyPhone, 14, pageHeight - 10);
    
    // Website (Right)
    doc.setTextColor(52, 152, 219); // Blue
    doc.textWithLink(companyWebsite, pageWidth - 14, pageHeight - 10, {
        url: companyWebsite,
        align: "right"
    });
    
    doc.setTextColor(0);
  }
}

// --- Utility Functions ---

/**
 * Gets all input values from the Trace Width calculator.
 * (Aapke project ke liye naya helper function)
 */
function getTraceInputs() {
    return {
        current: document.getElementById('tw_current').value + ' A',
        rise: document.getElementById('tw_rise').value + ' ' + document.getElementById('tw_riseUnit').value,
        ambient: document.getElementById('tw_ambient').value + ' ' + document.getElementById('tw_ambientUnit').value,
        thickness: document.getElementById('tw_thickness').value + ' ' + document.getElementById('tw_thicknessUnit').value,
        trace: document.getElementById('tw_trace').value + ' ' + document.getElementById('tw_traceUnit').value,
    };
}

/**
 * Gets all result values from the Trace Width calculator.
 * (Aapke project ke liye naya helper function)
 */
function getTraceResults() {
    const getElemText = (id) => {
        const elem = document.getElementById(id);
        // .innerText se multiline text (jaise width) mil jaata hai
        return elem ? elem.innerText : 'Error: N/A';
    };
    
    return {
        internalWidth: getElemText('tw_internalWidth'),
        internalResistance: getElemText('tw_internalResistance'),
        internalVoltage: getElemText('tw_internalVoltage'),
        internalPower: getElemText('tw_internalPower'),
        externalWidth: getElemText('tw_externalWidth'),
        externalResistance: getElemText('tw_externalResistance'),
        externalVoltage: getElemText('tw_externalVoltage'),
        externalPower: getElemText('tw_externalPower'),
    };
}

/**
 * Formats a value for the PDF table.
 * (Aapke example se liya gaya)
 */
function formatVal(val, unit = "") {
  if (val == null || val === "N/A" || !isFinite(val)) return "N/A";
  const num = parseFloat(val);
  if (unit === "%" || unit === "kW") {
    return `${num.toFixed(2)} ${unit}`;
  } else {
    // Sabhi numbers ke liye 4 decimal places use karein, jaisa aapke example mein hai
    return `${num.toFixed(4)} ${unit}`.trim();
  }
}