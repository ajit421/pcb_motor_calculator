document.addEventListener('DOMContentLoaded', function () {
    // Get the new download button
    const downloadBtn = document.getElementById('downloadReportBtn');
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', function () {
        
        // 1. Check if a calculation has been run
        if (!window.motorResults || typeof getMotorInputs === 'undefined') {
            const originalText = downloadBtn.textContent;
            downloadBtn.textContent = 'Run Calculation First!';
            downloadBtn.disabled = true;
            
            // Reset the button after 3 seconds
            setTimeout(() => {
                downloadBtn.textContent = originalText;
                downloadBtn.disabled = false;
            }, 3000);
            return; // Stop and don't create PDF
        }

        // 2. Get the jsPDF objects (loaded from index.html)
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // 3. Get all inputs and results
        const inputs = getMotorInputs();
        const results = window.motorResults;

        // Helper function to format numbers, avoiding nulls
        const f = (val) => (val !== null && !isNaN(val)) ? val.toFixed(4) : "N/A";

        // 4. Set PDF Title
        doc.setFontSize(18);
        doc.text("PCB Motor Calculation Report", 14, 22);
        doc.setFontSize(10);
        doc.text(new Date().toLocaleString(), 14, 28);

        // 5. Create Input Parameter Table
        const inputData = [
            // PCB Dimensions
            ['PCB Stator OD', inputs.pcbStatorOD, 'mm'],
            ['PCB Stator ID', inputs.pcbStatorID, 'mm'],
            ['PCB Board Thickness', inputs.pcbBoardThickness, 'mm'],
            ['Trace Width at ID', inputs.traceWidthID, 'mm'],
            ['Trace Gap', inputs.traceGap, 'mm'],
            // Electrical
            ['Current', inputs.current, 'A'],
            ['Number of Cells', inputs.numCells, ''],
            ['Cell Charge Unit', inputs.cellChargeUnit, 'V'],
            // Rotor/Magnetic
            ['PM Rotor Height', inputs.pmRotorHeight, 'mm'],
            ['Air Gap', inputs.airGap, 'mm'],
            ['Remanence', inputs.remanence, 'T'],
            ['Motor Parallel Constant', inputs.motorParallelConstant, ''],
            // PCB Layers
            ['PCB Layer Oz', inputs.pcbLayerOz, 'oz/ft²'],
            ['Num PCB Layers', inputs.numPCBLayers, ''],
            ['Num Layers Series', inputs.numPCBLayersseries, ''],
            ['Num Layers Parallel', inputs.numPCBLayersParallel, ''],
        ];
        
        doc.setFontSize(12);
        doc.text("Input Parameters", 14, 38);
        doc.autoTable({
            startY: 40,
            head: [['Parameter', 'Value', 'Unit']],
            body: inputData,
            theme: 'grid',
            headStyles: { fillColor: [44, 137, 204] } // Blue header
        });

        // 6. Create Output Results Tables (in 4 sections)
        doc.text("Calculation Results", 14, doc.lastAutoTable.finalY + 12);
        
        // Table 1: PCB Dimensions
        const pcbDimData = [
            ['Number of PCB', f(results.numPCB), ''],
            ['Stackup Height', f(results.stackupHeight), 'mm'],
            ['Stator ID Circumference', f(results.statorIDCircumference), 'mm'],
            ['Trace Circumference at ID', f(results.traceCircumferenceID), 'mm'],
            ['Trace Radius ID', f(results.traceRadiusID), 'mm'],
            ['Trace Radius OD', f(results.traceRadiusOD), 'mm'],
            ['Trace Circumference at OD', f(results.traceCircumferenceOD), 'mm'],
            ['Trace Width OD', f(results.traceWidthOD), 'mm'],
            ['Average Trace Width', f(results.avgTraceWidth), 'mm'],
        ];
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 14,
            head: [['PCB Dimensions (Results)', 'Value', 'Unit']],
            body: pcbDimData,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] } // Lighter blue
        });

        // Table 2: Stator/Rotor Config
        const statorData = [
            ['Number of Stator Coil', f(results.numStatorCoil), ''],
            ['Magnet Poles', f(results.magnetPoles), ''],
            ['Number of Lines', f(results.numLines), ''],
            ['Trace Length Radial Line', f(results.traceLengthRadial), 'mm'],
            ['Current Conducting Radial Length', f(results.currentConductingRadial), 'mm'],
        ];
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 10,
            head: [['Stator & Rotor (Results)', 'Value', 'Unit']],
            body: statorData,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] }
        });

        // Table 3: Electrical Parameters
        const electricalData = [
            ['Total Conductor Length (3 phase)', f(results.conductorLengthAll3Phase), 'm'],
            ['On Conductor Length (2 phase)', f(results.conductorLength2Phase), 'm'],
            ['Average Torque Radius', f(results.avgTorqueRadius), 'mm'],
            ['Surface Magnetic Value', f(results.surfaceMagneticValue), 'T'],
            ['Force', f(results.force), 'N'],
            ['Voltage', f(results.voltage), 'V'],
            ['Power In', f(results.powerIn), 'kW'],
            ['Torque', f(results.torque), 'Nm'],
            ['RPM', f(results.rpm), ''],
            ['Power Out', f(results.powerOut), 'kW'],
            ['kV', f(results.kv), 'RPM/V'],
        ];
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 10,
            head: [['Electrical (Results)', 'Value', 'Unit']],
            body: electricalData,
            theme: 'grid',
            headStyles: { fillColor: [22, 160, 133] } // Green
        });

        // Table 4: Losses and Efficiency
        const lossData = [
            ['Actual Efficiency', f(results.actualEfficiency), '%'],
            ['Copper Loss', f(results.copperLoss), 'W'],
            ['Core Loss', f(results.coreLoss), 'W'],
            ['Mechanical Loss', f(results.mechanicalLoss), 'W'],
            ['Stray Loss', f(results.strayLoss), 'W'],
            ['Total Loss', f(results.totalLoss), 'W'],
        ];
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 10,
            head: [['Losses & Efficiency', 'Value', 'Unit']],
            body: lossData,
            theme: 'grid',
            headStyles: { fillColor: [211, 84, 0] } // Orange
        });

        // 7. Save the PDF
        doc.save('PCB_Motor_Report.pdf');
    });
});