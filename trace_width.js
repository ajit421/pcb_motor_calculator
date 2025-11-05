// Conversion functions
function milToMm(mil) {
  return mil * 0.0254;
}

function milToUm(mil) {
  return mil * 25.4;
}

// Core calculation functions
function external(current, rise) {
  const k = 0.048;
  const b = 0.44;
  const c = 0.725;
  return Math.pow(current / (k * Math.pow(rise, b)), 1 / c);
}

function internal(current, rise) {
  const k = 0.024;
  const b = 0.44;
  const c = 0.725;
  return Math.pow(current / (k * Math.pow(rise, b)), 1 / c);
}

function calcTraceWidth(
  current,
  thickness,
  rise,
  ambient,
  trace,
  thicknessUnit,
  riseUnit,
  ambientUnit,
  traceUnit
) {
  try {
    // Convert Thickness to cm
    let thicknessCm = thickness;
    if (thicknessUnit === "oz/ft²") {
      thicknessCm *= 0.0035; // oz to mm, then to cm
    } else if (thicknessUnit === "mil") {
      thicknessCm *= 2.54e-3; // mil to cm
    } else if (thicknessUnit === "mm") {
      thicknessCm *= 0.1; // mm to cm
    } else if (thicknessUnit === "µm") {
      thicknessCm *= 1e-4; // µm to cm
    }

    // Convert Temperature Rise to °C
    let riseC = rise;
    if (riseUnit === "°F") {
      riseC = (rise * 5) / 9;
    }

    // Convert Ambient Temperature to °C
    let ambientC = ambient;
    if (ambientUnit === "°F") {
      ambientC = ((ambient - 32) * 5) / 9;
    }

    // Convert Trace Length to cm
    let traceCm = trace;
    if (traceUnit === "in") {
      traceCm = trace / 0.393701;
    } else if (traceUnit === "ft") {
      traceCm = trace / 0.032808;
    } else if (traceUnit === "mil") {
      traceCm = trace / 393.7008;
    } else if (traceUnit === "mm") {
      traceCm = trace / 10;
    } else if (traceUnit === "µm") {
      traceCm = trace / 10000;
    } else if (traceUnit === "m") {
      traceCm = trace / 0.01;
    }

    // Internal Layer Calculation
    const Ai = internal(current, riseC);
    const AiM2 = (Ai * 2.54 * 2.54) / 1e6; // Convert mil² to m²
    const internalWidth = AiM2 / thicknessCm;

    const internalWidthMil = internalWidth * 2.54e-3; // m to mil
    const internalWidthMm = milToMm(internalWidthMil);
    const internalWidthUm = milToUm(internalWidthMil);

    // Resistance Calculation
    const internalResistance =
      ((1.7e-6 * traceCm) / AiM2) * (1 + 3.9e-3 * (ambientC + riseC - 25));
    const internalVoltage = internalResistance * current;
    const internalPower = current * current * internalResistance;

    // External Layer Calculation
    const Ae = external(current, riseC);
    const AeM2 = (Ae * 2.54 * 2.54) / 1e6; // Convert mil² to m²
    const externalWidth = AeM2 / thicknessCm; // m

    const externalWidthMil = externalWidth * 2.54e-3; // m to mil
    const externalWidthMm = milToMm(externalWidthMil);
    const externalWidthUm = milToUm(externalWidthMil);

    const externalResistance =
      ((1.7e-6 * traceCm) / AeM2) * (1 + 3.9e-3 * (ambientC + riseC - 25));
    const externalVoltage = externalResistance * current;
    const externalPower = current * current * externalResistance;

    return {
      internalWidth: internalWidth,
      internalWidthMil: internalWidthMil,
      internalWidthMm: internalWidthMm,
      internalWidthUm: internalWidthUm,
      externalWidth: externalWidth,
      externalWidthMil: externalWidthMil,
      externalWidthMm: externalWidthMm,
      externalWidthUm: externalWidthUm,
      internalResistance: internalResistance,
      externalResistance: externalResistance,
      internalVoltage: internalVoltage,
      externalVoltage: externalVoltage,
      internalPower: internalPower,
      externalPower: externalPower,
    };
  } catch (error) {
    console.error("Calculation error:", error);
    return null;
  }
}

function formatNumber(num, precision = 11) {
  if (num === null || num === undefined || isNaN(num)) return "Error";
  if (num === 0) return "0";

  if (Math.abs(num) < 1e-6) {
    return num.toExponential(3);
  }

  return num.toFixed(precision);
}

function updateTraceResults() {
  // ----------------------------------------------------------------
  // 1. ADD THIS GUARD to prevent infinite loops from synchronization.js
  if (window.isSyncing) return;
  // ----------------------------------------------------------------

  // Use new "tw_" prefixed IDs
  const current = parseFloat(document.getElementById("tw_current").value) || 0;
  const ambient = parseFloat(document.getElementById("tw_ambient").value) || 0;
  const thickness =
    parseFloat(document.getElementById("tw_thickness").value) || 0;
  const trace = parseFloat(document.getElementById("tw_trace").value) || 0;
  const rise = parseFloat(document.getElementById("tw_rise").value) || 0;

  const ambientUnit = document.getElementById("tw_ambientUnit").value;
  const thicknessUnit = document.getElementById("tw_thicknessUnit").value;
  const traceUnit = document.getElementById("tw_traceUnit").value;
  const riseUnit = document.getElementById("tw_riseUnit").value;

  const errorMsg = "Please enter valid values";
  const internalWidthEl = document.getElementById("tw_internalWidth");
  const externalWidthEl = document.getElementById("tw_externalWidth");

  if (current <= 0 || thickness <= 0 || trace <= 0 || rise <= 0) {
    internalWidthEl.textContent = errorMsg;
    externalWidthEl.textContent = errorMsg;
    // Clear global sync variable if inputs are bad
    window.syncedCopperLossFromTrace = 0;
    return;
  }

  const result = calcTraceWidth(
    current,
    thickness,
    rise,
    ambient,
    trace,
    thicknessUnit,
    riseUnit,
    ambientUnit,
    traceUnit
  );

  if (!result) {
    internalWidthEl.textContent = "Calculation Error";
    externalWidthEl.textContent = "Calculation Error";
    return;
  }

  // Update internal layer results
  document.getElementById("tw_internalWidth").innerHTML = `
        Width: ${formatNumber(result.internalWidthMil)} mil<br>
        ${formatNumber(result.internalWidthMm)} mm | ${formatNumber(
    result.internalWidthUm
  )} µm
    `;
  document.getElementById("tw_internalResistance").textContent =
    formatNumber(result.internalResistance) + " Ω";
  document.getElementById("tw_internalVoltage").textContent =
    formatNumber(result.internalVoltage) + " V";
  document.getElementById("tw_internalPower").textContent =
    formatNumber(result.internalPower) + " W";

  // Update external layer results
  document.getElementById("tw_externalWidth").innerHTML = `
        Width: ${formatNumber(result.externalWidthMil)} mil<br>
        ${formatNumber(result.externalWidthMm)} mm | ${formatNumber(
    result.externalWidthUm
  )} µm`;
  document.getElementById("tw_externalResistance").textContent =
    formatNumber(result.externalResistance) + " Ω";
  document.getElementById("tw_externalVoltage").textContent =
    formatNumber(result.externalVoltage) + " V";
  document.getElementById("tw_externalPower").textContent =
    formatNumber(result.externalPower) + " W";

  // Add pulse animation to results
  document.querySelectorAll(".tw-result-card").forEach((card) => {
    card.classList.add("pulse");
    setTimeout(() => card.classList.remove("pulse"), 1000);
  });
  if (typeof syncTraceToMotor === "function") {
    syncTraceToMotor(result);
  }
}

// Add event listeners for real-time updates
document.addEventListener("DOMContentLoaded", function () {
  // Select only inputs within the trace-width-calculator
  const inputs = document.querySelectorAll(
    ".trace-width-calculator input, .trace-width-calculator select"
  );
  inputs.forEach((input) => {
    input.addEventListener("input", updateTraceResults);
    input.addEventListener("change", updateTraceResults);
  });

  // Initial calculation
  updateTraceResults();
});
