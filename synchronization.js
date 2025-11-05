// synchronization.js

// This global flag prevents infinite update loops
// (e.g., motor updates trace, which updates motor, which updates trace...)
window.isSyncing = false;

document.addEventListener('DOMContentLoaded', function () {
    const motorCurrent = document.getElementById('current');
    const traceCurrent = document.getElementById('tw_current');

    // --- 1. Sync "Current" (2-Way) ---

    // Listen for changes in the MOTOR calculator
    motorCurrent.addEventListener('input', () => {
        if (window.isSyncing) return; // Stop loop
        window.isSyncing = true;

        // 1. Update the trace calculator's value
        traceCurrent.value = motorCurrent.value;
        
        // 2. Manually trigger the trace calculator to re-run
        if (typeof updateTraceResults === 'function') {
            updateTraceResults();
        }
        
        window.isSyncing = false;
    });

    // Listen for changes in the TRACE calculator
    traceCurrent.addEventListener('input', () => {
        if (window.isSyncing) return; // Stop loop
        window.isSyncing = true;
        
        // 1. Update the motor calculator's value
        motorCurrent.value = traceCurrent.value;

        // 2. Manually trigger the motor calculator to re-run
        if (typeof calculateMotorParameters === 'function') {
            calculateMotorParameters();
        }
        
        window.isSyncing = false;
    });
});

// --- 2. Sync Motor Results -> Trace Inputs (1-Way) ---
// This function will be CALLED BY main.js
function syncMotorToTrace(motorResults) {
    if (window.isSyncing) return;
    window.isSyncing = true;

    // 1. Update Trace Thickness from Motor's Required Thickness
    const traceThickness = document.getElementById('tw_thickness');
    if (motorResults && motorResults.reqCopperThickness !== null) {
        traceThickness.value = motorResults.reqCopperThickness;
    }

    // 2. Update Trace Length from Motor's 2-Phase Conductor Length
    const traceLength = document.getElementById('tw_trace');
    if (motorResults && motorResults.twoPhase !== null) {
        // Motor 'twoPhase' is in meters. Convert to 'cm' for the trace calc default
        const lengthInCm = motorResults.twoPhase * 100;
        traceLength.value = lengthInCm.toFixed(4);
        
        // Also set the unit dropdown to 'm' or 'cm'
        // For simplicity, we'll set it to 'cm' as it's the default
        document.getElementById('tw_traceUnit').value = 'cm';
    }

    // 3. Manually trigger the trace calculator to re-run
    if (typeof updateTraceResults === 'function') {
        updateTraceResults();
    }
    
    window.isSyncing = false;
}

// --- 3. Sync Trace Results -> Motor Inputs (1-Way) ---
// This function will be CALLED BY trace_width.js
function syncTraceToMotor(traceResults) {
    if (window.isSyncing) return;
    window.isSyncing = true;

    // 1. Update the global "Copper Loss" variable
    if (traceResults && traceResults.internalPower !== null) {
        // This 'window' variable is read by main.js
        window.syncedCopperLossFromTrace = traceResults.internalPower;
    }

    // 2. Manually trigger the motor calculator to re-run
    if (typeof calculateMotorParameters === 'function') {
        calculateMotorParameters();
    }
    
    window.isSyncing = false;
}