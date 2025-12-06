// --- Brand & Contact Constants ---
const companyName = "AirBuddy Aerospace";
const companyWebsite = "www.airbuddy.in";
const companyEmail = "bibhuti@airbuddy.in";
const companyPhone = "+917079142368";
// Logo (Optional): Agar aapke paas base64 logo hai to yahan daalein
const logoBase64 =
  "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";

// --- Theme Colors ---
const COLORS = {
  primary: [44, 62, 80], // Dark Blue
  secondary: [52, 152, 219], // Light Blue
  accent: [231, 76, 60], // Red (for highlights if needed)
  text: [60, 60, 60],
  lightGrey: [245, 245, 245],
  tableHeader: [41, 128, 185],
};

document.addEventListener("DOMContentLoaded", function () {
  const downloadBtn = document.getElementById("downloadReportBtn");
  if (!downloadBtn) return;

  downloadBtn.addEventListener("click", generateCombinedPDF);
});

/**
 * Main function to generate the PDF.
 */
function generateCombinedPDF() {
  if (!window.motorResults) {
    alert("No calculation results available. Please run a calculation first.");
    return;
  }

  console.log("Loading PDF...");

  setTimeout(() => {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      if (typeof doc.autoTable === "undefined") {
        alert("Error: jsPDF-autoTable plugin not loaded.");
        return;
      }

      generatePDFContent(doc);

      doc.save("PCB_Motor_Calculator_Report.pdf");
      console.log("PDF generated successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Error generating PDF: " + error.message);
    }
  }, 100);
}

/**
 * Orchestrates the PDF content drawing.
 */
function generatePDFContent(doc) {
  // 1. Draw Beautiful Header
  drawHeader(doc);

  let yPos = 55; // Start content below header

  // --- Get Data ---
  const motorInputs = getMotorInputs();
  const motorResults = window.motorResults;
  const traceInputs = getTraceInputs();
  const traceResults = getTraceResults();

  // 2. Motor Report Section
  if (motorResults) {
    yPos = addMotorSection(doc, yPos, motorInputs, motorResults);
  }

  // 3. Trace Report Section
  // Ensure we have enough space, else add page
  if (yPos > 240) {
    doc.addPage();
    yPos = 40;
  } else {
    yPos += 20; // Add spacing before next section
  }

  if (traceResults) {
    yPos = addTraceSection(doc, yPos, traceInputs, traceResults);
  }

  // 4. Draw Footer on all pages
  addFooter(doc);
}

/**
 * Draws a professional header with background color.
 */
function drawHeader(doc) {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Top Banner Background
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 40, "F"); // x, y, w, h

  // Company Name / Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("PCB Motor Calculation Report", 14, 20);

  // Date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(220, 220, 220);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

  // Logo (Right Aligned)
  if (logoBase64 && logoBase64.length > 100) {
    try {
      doc.addImage(logoBase64, "JPEG", pageWidth - 40, 10, 26, 20); // Adjust sizing
    } catch (e) {
      console.error("Error adding logo:", e);
    }
  } else {
    // Fallback text logo if no image
    doc.setFontSize(14);
    doc.text(companyName, pageWidth - 14, 20, { align: "right" });
  }
}

/**
 * Adds the Motor Calculator tables.
 */
function addMotorSection(doc, yPos, inputs, results) {
  // Section Title
  addSectionTitle(doc, "1. PCB Motor Calculator", yPos);
  yPos += 15;

  // --- Input Table ---
  const motorInputsData = [
    ["Parameter", "Value", "Unit"],
    ["PCB Stator OD", fmt(inputs.pcbStatorOD, 1), "mm"],
    ["PCB Stator ID", fmt(inputs.pcbStatorID, 1), "mm"],
    ["PCB Board Thickness", fmt(inputs.pcbBoardThickness, 1), "mm"],
    ["Trace Width at ID", fmt(inputs.traceWidthID, 2), "mm"],
    ["Trace Gap", fmt(inputs.traceGap, 1), "mm"],
    ["PCB Layer Oz/Ft²", fmt(inputs.pcbLayerOz, 0), "oz/ft²"],
    ["Number of PCB Layers", fmt(inputs.numPCBLayers, 0), ""],
    ["PCB Layers Series", fmt(inputs.numPCBLayersseries, 0), ""],
    ["PCB Layers Parallel", fmt(inputs.numPCBLayersParallel, 0), ""],
    ["PM Rotor Height", fmt(inputs.pmRotorHeight, 1), "mm"],
    ["Air Gap", fmt(inputs.airGap, 1), "mm"],
    ["Remanence Br", fmt(inputs.remanence, 1), "T"],
    ["Current", fmt(inputs.current, 1), "A"],
    ["Number of Cells", fmt(inputs.numCells, 0), ""],
    ["Cell Charge Unit", fmt(inputs.cellChargeUnit, 1), "V"],
    ["Parallel Constant", fmt(inputs.motorParallelConstant, 1), ""],
  ];

  yPos = drawTable(doc, yPos, "Input Parameters", motorInputsData);

  // --- Output Results ---

  // 1. PCB Dimensions (Matched precision with main.js)
  const pcbDimData = [
    ["Parameter", "Value", "Unit"],
    ["Number of PCB", fmt(results.numPCB, 1), ""],
    ["Stackup Height", fmt(results.stackupHeight, 2), "mm"],
    ["Stator ID Circumference", fmt(results.statorIDCircumference, 8), "mm"],
    ["Trace Circumference at ID", fmt(results.traceCircumferenceID, 3), "mm"],
    ["Trace Radius ID", fmt(results.traceRadiusID, 8), "mm"],
    ["Radial Gap ID", fmt(results.radialGapID, 8), "mm"],
    ["Radial Gap OD", fmt(results.radialGapOD, 1), "mm"],
    ["Trace Radius OD", fmt(results.traceRadiusOD, 2), "mm"],
    ["Trace Circumference at OD", fmt(results.traceCircumferenceOD, 8), "mm"],
    ["Trace Width OD", fmt(results.traceWidthOD, 8), "mm"],
    ["Average Trace Width", fmt(results.avgTraceWidth, 8), "mm"],
  ];
  yPos = drawTable(doc, yPos, "PCB Dimensions", pcbDimData);

  // 2. Stator & Rotor
  const statorData = [
    ["Parameter", "Value", "Unit"],
    ["Number of Stator Coil", fmt(results.numStatorCoil, 1), ""],
    ["Magnet Poles", fmt(results.magnetPoles, 1), ""],
    ["Number of Phase", fmt(results.numPhase, 1), ""],
    ["Per Phase Coil", fmt(results.perPhaseCoil, 1), ""],
    ["Coil per Phase 180 Apart", fmt(results.coilPerPhase180, 1), ""],
    ["Number of Lines", fmt(results.numLines, 1), ""],
    ["Lines per Phase", fmt(results.numLinesPerPhase, 1), ""],
    ["Lines per Phase 180", fmt(results.numLinesPerPhase180, 1), ""],
    ["Trace Length Radial Line", fmt(results.traceLengthRadial, 6), "mm"],
    ["Curved Line Width", fmt(results.curvedLineWidth, 1), "mm"],
    [
      "Current Conducting Radial",
      fmt(results.currentConductingRadial, 6),
      "mm",
    ],
  ];
  yPos = drawTable(doc, yPos, "Stator & Rotor Configuration", statorData);

  // 3. Cost Section (Re-calculated here to ensure it appears in PDF)
  // Logic based on your main.js
  const costPCB = results.numPCB * 500;
  const costMagnet = (results.numPCB + 1) * results.height * 100;
  const costMisc = 100;
  const costTotal = costPCB + costMagnet + costMisc;

  const costData = [
    ["Parameter", "Value", "Unit"],
    ["Total PCB Cost", fmt(costPCB, 0), "INR"],
    ["Magnet Cost", fmt(costMagnet, 0), "INR"],
    ["Miscellaneous Cost", fmt(costMisc, 0), "INR"],
    ["Total Cost", fmt(costTotal, 0), "INR"],
  ];
  yPos = drawTable(doc, yPos, "Estimated Cost", costData);

  // 4. Electrical
  const electricalData = [
    ["Parameter", "Value", "Unit"],
    [
      "Total Conductor Length (3ph)",
      fmt(results.conductorLengthAll3Phase, 10),
      "m",
    ],
    ["On Conductor Length (2ph)", fmt(results.conductorLength2Phase, 10), "m"],
    ["2 Phase Switch On (series)", fmt(results.twoPhase, 10), "m"],
    ["All 3 Phase (series)", fmt(results.all3Phase, 10), "m"],
    ["Required Copper Thickness", fmt(results.reqCopperThickness, 1), "oz/ft²"],
    ["Non Magnet Area", fmt(results.nonMagnetArea, 8), "mm"],
    ["Radius OD", fmt(results.radiusOD, 2), "mm"],
    ["Avg Torque Radius", fmt(results.avgTorqueRadius, 8), "mm"],
    ["Surface Magnetic Value", fmt(results.surfaceMagneticValue, 6), "T"],
    ["Height (H)", fmt(results.height, 2), "mm"],
    ["Width (W) OD", fmt(results.widthOD, 6), "mm"],
    ["Width (w) ID", fmt(results.widthID, 6), "mm"],
    ["Length (L) ID to OD", fmt(results.lengthIDtoOD, 6), "mm"],
    ["Parallel Stacking Const", fmt(results.motorParallelConstant, 1), ""],
    ["Force", fmt(results.force, 6), "N"],
    ["Voltage", fmt(results.voltage, 2), "V"],
    ["Power In", fmt(results.powerIn, 4), "kW"],
    ["Torque", fmt(results.torque, 6), "Nm"],
    ["RPM", fmt(results.rpm, 10), ""],
    ["Power Out", fmt(results.powerOut, 4), "kW"],
    ["kV", fmt(results.kv, 10), "RPM/V"],
    ["Actual Efficiency", fmt(results.actualEfficiency, 2), "%"],
  ];
  yPos = drawTable(doc, yPos, "Electrical Parameters", electricalData);

  // 5. Losses
  const lossData = [
    ["Parameter", "Value", "Unit"],
    ["Copper Loss", fmt(results.copperLoss, 6), "W"],
    ["Core Loss", fmt(results.coreLoss, 6), "W"],
    ["Mechanical Loss", fmt(results.mechanicalLoss, 6), "W"],
    ["Stray Loss", fmt(results.strayLoss, 6), "W"],
    ["Total Loss", fmt(results.totalLoss, 6), "W"],
  ];
  yPos = drawTable(doc, yPos, "Losses & Efficiency", lossData);

  return yPos;
}

/**
 * Adds the Trace Calculator section.
 */
function addTraceSection(doc, yPos, inputs, results) {
  addSectionTitle(doc, "2. Trace Width Calculator (IPC-2221)", yPos);
  yPos += 20;

  // Trace Inputs
  const traceInputData = [
    ["Parameter", "Value"],
    ["Current", inputs.current],
    ["Temperature Rise", inputs.rise],
    ["Ambient Temperature", inputs.ambient],
    ["Copper Thickness", inputs.thickness],
    ["Trace Length", inputs.trace],
  ];
  yPos = drawTable(doc, yPos, "Trace Inputs", traceInputData);

  // Internal & External Results
  const internalData = [
    ["Parameter", "Value"],
    ["Required Width", results.internalWidth],
    ["Resistance", results.internalResistance],
    ["Voltage Drop", results.internalVoltage],
    ["Power Loss", results.internalPower],
  ];

  const externalData = [
    ["Parameter", "Value"],
    ["Required Width", results.externalWidth],
    ["Resistance", results.externalResistance],
    ["Voltage Drop", results.externalVoltage],
    ["Power Loss", results.externalPower],
  ];

  // Draw side-by-side if possible, else stacked
  yPos = drawTable(doc, yPos, "Internal Layer Results", internalData);
  yPos = drawTable(doc, yPos, "External Layer Results", externalData);

  return yPos;
}

/**
 * Helper to draw a standardized table.
 */
function drawTable(doc, startY, title, data) {
  // Check for page overflow before drawing
  if (startY > 270) {
    doc.addPage();
    startY = 30;
  }

  // Draw Mini Header for Table
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.secondary);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, startY);
  startY += 2;

  doc.autoTable({
    startY: startY,
    head: [data[0]],
    body: data.slice(1),
    theme: "striped",
    styles: {
      fontSize: 9,
      cellPadding: 3,
      lineColor: [220, 220, 220],
      lineWidth: 0.1,
      textColor: COLORS.text,
    },
    headStyles: {
      fillColor: COLORS.tableHeader,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "left",
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 90 }, // Parameter name
      1: { halign: "right" }, // Values
      2: { halign: "left", cellWidth: 30 }, // Units
    },
    margin: { left: 14, right: 14 },
  });

  return doc.lastAutoTable.finalY + 10;
}

/**
 * Adds a stylized section title.
 */
function addSectionTitle(doc, text, y) {
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text(text, 14, y);
  // Underline
  doc.setDrawColor(...COLORS.secondary);
  doc.setLineWidth(0.5);
  doc.line(14, y + 2, 196, y + 2);
}

/**
 * Footer on every page.
 */
function addFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Line Separator
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    doc.line(14, pageHeight - 18, pageWidth - 14, pageHeight - 18);

    doc.setFontSize(9);
    doc.setTextColor(120);

    // Left: Email & Phone
    doc.text(companyEmail, 14, pageHeight - 10);
    doc.text(`  ${companyPhone}`, 50, pageHeight - 10);

    // Center: Page No
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, {
      align: "center",
    });

    // Right: Website
    doc.setTextColor(...COLORS.secondary);
    doc.textWithLink(companyWebsite, pageWidth - 14, pageHeight - 10, {
      url: companyWebsite,
      align: "right",
    });
  }
}

// --- Utility Functions ---

function getTraceInputs() {
  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value : "";
  };
  return {
    current: getVal("tw_current") + " A",
    rise: getVal("tw_rise") + " " + getVal("tw_riseUnit"),
    ambient: getVal("tw_ambient") + " " + getVal("tw_ambientUnit"),
    thickness: getVal("tw_thickness") + " " + getVal("tw_thicknessUnit"),
    trace: getVal("tw_trace") + " " + getVal("tw_traceUnit"),
  };
}

function getTraceResults() {
  const getElemText = (id) => {
    const elem = document.getElementById(id);
    return elem ? elem.innerText.replace(/\n/g, " ") : "Error: N/A";
  };
  return {
    internalWidth: getElemText("tw_internalWidth"),
    internalResistance: getElemText("tw_internalResistance"),
    internalVoltage: getElemText("tw_internalVoltage"),
    internalPower: getElemText("tw_internalPower"),
    externalWidth: getElemText("tw_externalWidth"),
    externalResistance: getElemText("tw_externalResistance"),
    externalVoltage: getElemText("tw_externalVoltage"),
    externalPower: getElemText("tw_externalPower"),
  };
}

/**
 * Improved formatting helper.
 * Handles precision like "toFixed" but safely.
 */
function fmt(val, decimals = 4) {
  if (val === null || val === undefined || val === "" || isNaN(val))
    return "N/A";

  const num = parseFloat(val);
  if (!isFinite(num)) return "N/A";

  // If decimals is 0, don't show decimal point
  return num.toFixed(decimals);
}
