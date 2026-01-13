// Global variables to hold chart instances
let masterChartInstance = null;
let lossChartInstance = null;
let traceDistChartInstance = null;
let torqueRpmChartInstance = null;
let powerChartInstance = null;

/**
 * Main function to update all dashboard charts
 * Called from main.js when calculations are done.
 */
function updateDashboard(inputs, currentResults) {
    if (!inputs || !currentResults) return;

    // 1. GENERATE DATA (With Auto-Step Logic)
    const rangeData = generateRangeData(inputs, currentResults);

    // 2. RENDER CHARTS
    renderMasterChart(rangeData);
    renderLossChart(currentResults);
    renderTraceDistChart();
    renderTorqueRpmChart(rangeData);
    renderPowerChart(rangeData);
}

/**
 * Helper: Calculate the best step size automatically
 * Suggestion: Keeps total points between 20-50 for best performance and look.
 */
function getAutoStepSize(maxCurrent) {
    if (maxCurrent <= 15) return 0.5;  // Very small current: Show decimals (0.5, 1.0...)
    if (maxCurrent <= 50) return 1;    // Medium current: Show integers (1, 2, 3...)
    if (maxCurrent <= 100) return 2;   // High current: Step by 2
    return 5;                          // Very high current: Step by 5
}

/**
 * Generates calculation data from 0 Amps up to (Current + 10A)
 */
function generateRangeData(originalInputs, originalResults) {
    const targetCurrent = originalInputs.current;

    // Range: Start from 0 up to Target + 10
    const startCurrent = 0;
    const appendCurrent = targetCurrent;
    const endCurrent = Math.ceil(targetCurrent + appendCurrent);

    // --- NEW: Auto Set Step Size ---
    const stepSize = getAutoStepSize(endCurrent);

    // Arrays to store data
    const labels = []; // Current (A)
    const torque = [];
    const rpm = [];
    const efficiency = [];
    const powerIn = [];
    const powerOut = [];
    const totalLoss = [];

    // Estimate Resistance for Copper Loss calculation (R = P / I^2)
    let estimatedR = 0.1;
    if (originalResults.copperLoss > 0 && targetCurrent > 0) {
        estimatedR = originalResults.copperLoss / (targetCurrent * targetCurrent);
    }

    // Save global state
    const savedSyncedLoss = window.syncedCopperLossFromTrace;

    // --- CALCULATION LOOP ---
    for (let i = startCurrent; i <= endCurrent; i += stepSize) {
        // Create temp inputs
        let tempInputs = { ...originalInputs };
        tempInputs.current = i;

        // Manually update global copper loss for this iteration
        if (i === 0) {
            window.syncedCopperLossFromTrace = 0;
        } else {
            window.syncedCopperLossFromTrace = (i * i) * estimatedR;
        }

        // Run calculation
        let res = performMotorCalculations(tempInputs);

        // Push data
        // Format label: Remove decimals if it's an integer (e.g. "10" instead of "10.0")
        labels.push(Number.isInteger(i) ? i.toString() : i.toFixed(1));

        torque.push(res.torque);
        rpm.push(res.rpm);

        // Cap efficiency at 100 for graph visual safety
        let eff = res.actualEfficiency;
        if (eff > 100) eff = 100;
        if (eff < 0) eff = 0;
        efficiency.push(eff);

        powerIn.push(res.powerIn);
        powerOut.push(res.powerOut);
        totalLoss.push(res.totalLoss);
    }

    // Restore global state
    window.syncedCopperLossFromTrace = savedSyncedLoss;

    return { labels, torque, rpm, efficiency, powerIn, powerOut, totalLoss };
}



// ---------------- CHART RENDER FUNCTIONS ---------------- //

function renderMasterChart(data) {
    const ctx = document.getElementById('masterChart').getContext('2d');

    if (masterChartInstance) masterChartInstance.destroy();

    masterChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                // --- LEFT AXIS DATASETS ---
                {
                    label: 'Torque (N.m)',
                    data: data.torque,
                    borderColor: '#000000', // Black
                    backgroundColor: '#000000',
                    borderWidth: 2,
                    yAxisID: 'y_torque',
                    tension: 0.4,
                    pointRadius: 0,
                    hoverRadius: 6
                },
                {
                    label: 'RPM (r/min)',
                    data: data.rpm,
                    borderColor: '#8A2BE2', // Purple
                    backgroundColor: '#8A2BE2',
                    borderWidth: 2,
                    yAxisID: 'y_rpm',
                    tension: 0.4,
                    pointRadius: 0,
                    hoverRadius: 6
                },
                {
                    label: 'Total Loss (W)',
                    data: data.totalLoss,
                    borderColor: '#FF8C00', // Orange
                    backgroundColor: '#FF8C00',
                    borderWidth: 2,
                    yAxisID: 'y_loss',
                    tension: 0.4,
                    pointRadius: 0,
                    hoverRadius: 6
                },

                // --- RIGHT AXIS DATASETS ---
                {
                    label: 'Efficiency (%)',
                    data: data.efficiency,
                    borderColor: '#00B050', // Green
                    backgroundColor: '#00B050',
                    borderWidth: 2,
                    yAxisID: 'y_eff',
                    tension: 0.4,
                    pointRadius: 0,
                    hoverRadius: 6
                },
                {
                    label: 'Power Out (W)',
                    data: data.powerOut.map(p => p * 1000), // Convert kW to W
                    borderColor: '#FF1493', // Pink
                    backgroundColor: '#FF1493',
                    borderWidth: 2,
                    yAxisID: 'y_powerout',
                    tension: 0.4,
                    pointRadius: 0,
                    hoverRadius: 6
                },
                {
                    label: 'Power In (W)',
                    data: data.powerIn.map(p => p * 1000), // Convert kW to W
                    borderColor: '#FFD700', // Yellow
                    backgroundColor: '#FFD700',
                    borderWidth: 2,
                    yAxisID: 'y_powerin',
                    tension: 0.4,
                    pointRadius: 0,
                    hoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Performance Master Graph',
                    font: { size: 16, weight: 'bold' },
                    color: '#333'
                },
                legend: {
                    position: 'top',
                    labels: { usePointStyle: true, boxWidth: 20 }
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#333',
                    bodyColor: '#333',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                            }
                            return label;
                        }
                    }
                }
            },


            scales: {
                x: {
                    title: { display: true, text: 'Current (A)', color: '#666', font: { weight: 'bold' } },
                    // grid: { display: false },
                    grid: { color: '#e0e0e0' },
                    ticks: {
                        maxRotation: 0, // Keep labels horizontal
                        autoSkip: true,
                        maxTicksLimit: 12 // Ensure "not show multiple steps" (avoids crowding)
                    }
                },


                // --- LEFT AXES ---
                y_torque: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    min: 0,
                    title: { display: true, text: 'Torque (N.m)', color: '#000000' },
                    ticks: { color: '#000000' },
                    grid: { color: '#e0e0e0' }
                },
                y_rpm: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    min: 0,
                    // max: 10000,
                    grid: { drawOnChartArea: false },
                    title: { display: true, text: 'RPM', color: '#8A2BE2' },
                    ticks: { color: '#8A2BE2' }
                },
                y_loss: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    min: 0,
                    grid: { drawOnChartArea: false },
                    title: { display: true, text: 'Loss (W)', color: '#FF8C00' },
                    ticks: { color: '#FF8C00' }
                },

                // --- RIGHT AXES ---
                y_eff: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    min: 0,
                    max: 100,
                    grid: { drawOnChartArea: false },
                    title: { display: true, text: 'Efficiency (%)', color: '#00B050' },
                    ticks: { color: '#00B050' }
                },
                y_powerout: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    min: 0,
                    grid: { drawOnChartArea: false },
                    title: { display: true, text: 'Power Out (W)', color: '#FF1493' },
                    ticks: { color: '#FF1493' }
                },
                y_powerin: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    min: 0,
                    grid: { drawOnChartArea: false },
                    title: { display: true, text: 'Power In (W)', color: '#FFD700' },
                    ticks: { color: '#FFD700' }
                }
            }
        }
    });
}



// Loss Chart - Fixed Text Size & Thinner Ring
function renderLossChart(results) {
    const ctx = document.getElementById('lossChart').getContext('2d');
    if (lossChartInstance) lossChartInstance.destroy();

    // Custom Plugin to draw text in the center
    const centerTextPlugin = {
        id: 'centerText',
        beforeDraw: function (chart) {
            const width = chart.width,
                height = chart.height,
                ctx = chart.ctx;

            ctx.restore();

            // --- 1. Label: "Total Loss" (Small & Grey) ---
            // Isko chota karne ke liye maine divisor badha diya (height / 200)
            const fontSizeLabel = (height / 200).toFixed(2);
            ctx.font = "bold " + fontSizeLabel + "em sans-serif";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#95a5a6"; // Light Grey color

            const text1 = "Total Loss";
            const textX1 = Math.round((width - ctx.measureText(text1).width) / 2);
            // Height adjustment: Thoda upar rakhenge
            const textY1 = height / 2 - (height * 0.12);
            ctx.fillText(text1, textX1, textY1);

            // --- 2. Value: "413.6 W" (Bold & Dark) ---
            // Isko bhi adjust kiya taaki hole mein fit ho jaye (height / 130)
            const fontSizeValue = (height / 200).toFixed(2);
            ctx.font = "bold " + fontSizeValue + "em sans-serif";
            ctx.fillStyle = "#2c3e50"; // Dark Blue-Grey color

            const text2 = results.totalLoss.toFixed(1) + " W";
            const textX2 = Math.round((width - ctx.measureText(text2).width) / 2);
            // Height adjustment: Thoda neeche rakhenge
            const textY2 = height / 2 + (height * 0.08);
            ctx.fillText(text2, textX2, textY2);

            ctx.save();
        }
    };

    lossChartInstance = new Chart(ctx, {
        type: 'doughnut',
        plugins: [centerTextPlugin],
        data: {
            labels: ['Copper Loss', 'Core Loss', 'Mech Loss', 'Stray Loss'],
            datasets: [{
                data: [
                    results.copperLoss,
                    results.coreLoss,
                    results.mechanicalLoss,
                    results.strayLoss
                ],
                backgroundColor: [
                    '#e74c3c', // Red
                    '#3498db', // Blue
                    '#f1c40f', // Yellow
                    '#9b59b6'  // Purple
                ],
                hoverBackgroundColor: [
                    '#c0392b',
                    '#2980b9',
                    '#f39c12',
                    '#8e44ad'
                ],
                borderWidth: 4,
                borderColor: '#ffffff',
                hoverOffset: 15,

                // ⬇️ YEH IMPORTANT HAI:
                // Isko 85% karne se ring patli ho jayegi aur beech me jagah banegi
                cutout: '65%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: 15
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 11, // Legend font thoda chota kiya
                            weight: '500'
                        }
                    }
                },
                title: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#333',
                    bodyColor: '#333',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    callbacks: {
                        label: function (context) {
                            let label = context.label || '';
                            if (label) { label += ': '; }
                            let value = context.parsed;
                            let total = context.chart._metasets[context.datasetIndex].total;
                            let percentage = ((value / total) * 100).toFixed(1) + "%";
                            return label + value.toFixed(2) + " W (" + percentage + ")";
                        }
                    }
                }
            }
        }
    });
}




// --- TRACE DISTRIBUTION CHART (Ultra-Professional Look) ---
function renderTraceDistChart() {
    const intW = parseFloat(document.getElementById('tw_internalWidth').innerText) || 0;
    const extW = parseFloat(document.getElementById('tw_externalWidth').innerText) || 0;

    const intP = parseFloat(document.getElementById('tw_internalPower').innerText) || 0;
    const extP = parseFloat(document.getElementById('tw_externalPower').innerText) || 0;

    const ctx = document.getElementById('traceDistChart').getContext('2d');

    if (traceDistChartInstance) traceDistChartInstance.destroy();

    // --- 1. Create Premium Gradients ---

    // Gradient A: Width (Cool Cyan-Blue)
    let gradientWidth = ctx.createLinearGradient(0, 0, 0, 400);
    gradientWidth.addColorStop(0, '#4FACFE');  // Cyan Top
    gradientWidth.addColorStop(1, '#00F2FE');  // Light Cyan Bottom

    // Gradient B: Power (Hot Red-Orange)
    let gradientPower = ctx.createLinearGradient(0, 0, 0, 400);
    gradientPower.addColorStop(0, '#FF0844');  // Deep Red Top
    gradientPower.addColorStop(1, '#FFB199');  // Soft Pink Bottom

    traceDistChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Internal Layer', 'External Layer'],
            datasets: [
                {
                    label: 'Required Width',
                    data: [intW, extW],
                    backgroundColor: gradientWidth,
                    borderColor: '#4FACFE',
                    borderWidth: 1,
                    // Sirf upar se round karne ke liye:
                    borderRadius: { topLeft: 10, topRight: 10 },
                    barPercentage: 0.5,
                    categoryPercentage: 0.8,
                    yAxisID: 'y'
                },
                {
                    label: 'Power Loss',
                    data: [intP, extP],
                    backgroundColor: gradientPower,
                    borderColor: '#FF0844',
                    borderWidth: 1,
                    borderRadius: { topLeft: 10, topRight: 10 },
                    barPercentage: 0.5,
                    categoryPercentage: 0.8,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end', // Legend ko right side shift kiya
                    labels: {
                        usePointStyle: true,
                        boxWidth: 8,
                        font: { size: 12, weight: '600' },
                        color: '#555'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 30, 30, 0.9)', // Dark tooltip
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            let value = context.parsed.y;
                            // Tooltip me Unit dikhane ke liye
                            let unit = label.includes('Width') ? ' mil' : ' W';
                            return " " + label + ": " + value.toFixed(2) + unit;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { size: 13, weight: 'bold' },
                        color: '#444'
                    }
                },
                // Left Axis (Width)
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: { display: true, text: 'Width (mil)', color: '#4FACFE', font: { weight: 'bold' } },
                    grid: { color: '#f3f3f3', borderDash: [5, 5] },
                    ticks: {
                        color: '#4FACFE',
                        callback: function (value) { return value + ' mil'; } // Axis par unit
                    }
                },
                // Right Axis (Power)
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: { display: true, text: 'Power Loss (W)', color: '#FF0844', font: { weight: 'bold' } },
                    grid: { drawOnChartArea: false },
                    ticks: {
                        color: '#FF0844',
                        callback: function (value) { return value + ' W'; } // Axis par unit
                    }
                }
            }
        }
    });
}


// --- TORQUE VS RPM CHART (Premium Gradient Look) ---
function renderTorqueRpmChart(data) {
    const ctx = document.getElementById('torqueRpmChart').getContext('2d');

    // Purana chart delete karein taaki glitch na ho
    if (torqueRpmChartInstance) torqueRpmChartInstance.destroy();

    // --- 1. Create Electric Gradient ---
    // Upar Dark Purple, Neeche Fade White
    let gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
    gradientFill.addColorStop(0, 'rgba(142, 68, 173, 0.6)'); // Dark Purple (Top)
    gradientFill.addColorStop(1, 'rgba(142, 68, 173, 0.0)'); // Transparent (Bottom)

    // Data points set karna
    const points = data.rpm.map((r, i) => ({ x: r, y: data.torque[i] }));

    torqueRpmChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Torque Curve',
                data: points,
                borderColor: '#8e44ad',  // Solid Purple Line
                borderWidth: 3,          // Line thodi moti (bold)
                backgroundColor: gradientFill, // Gradient Fill
                fill: true,              // Area fill on
                tension: 0.4,            // Smooth Curves (Curvy Line)
                pointRadius: 0,          // Points hide karein (clean look)
                pointHoverRadius: 8,     // Hover karne par bada point dikhega
                pointHoverBackgroundColor: '#fff', // White point on hover
                pointHoverBorderColor: '#8e44ad',  // Purple border on hover
                pointHoverBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            plugins: {
                legend: {
                    display: false // Title hata diya (Clean look ke liye)
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark Tooltip
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        title: function (context) {
                            return 'RPM: ' + context[0].parsed.x.toFixed(4);
                        },
                        label: function (context) {
                            return 'Torque: ' + context.parsed.y.toFixed(4) + ' N.m';
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    grid: {
                        display: false, // Vertical lines hata di (Cleaner)
                        drawBorder: false
                    },
                    title: {
                        display: true,
                        text: 'Speed (RPM)',
                        color: '#555',
                        font: { weight: 'bold' }
                    }
                },
                y: {
                    grid: {
                        color: '#f0f0f0', // Light horizontal lines
                        borderDash: [5, 5] // Dashed lines
                    },
                    title: {
                        display: true,
                        text: 'Torque (N.m)',
                        color: '#8e44ad',
                        font: { weight: 'bold' }
                    },
                    beginAtZero: true
                }
            }
        }
    });
}



// --- POWER CHART (Premium Gradient & Smart Analysis) ---
function renderPowerChart(data) {
    const ctx = document.getElementById('powerChart').getContext('2d');

    // Purana chart destroy karo
    if (powerChartInstance) powerChartInstance.destroy();

    // 1. CREATE GRADIENTS (Jadu yahan hai!)

    // Gradient for Power IN (Gold/Amber - Energy Source)
    let gradientIn = ctx.createLinearGradient(0, 0, 0, 400);
    gradientIn.addColorStop(0, 'rgba(255, 193, 7, 0.5)'); // Top (Visible)
    gradientIn.addColorStop(1, 'rgba(255, 193, 7, 0.0)'); // Bottom (Fade out)

    // Gradient for Power OUT (Neon Pink - Output)
    let gradientOut = ctx.createLinearGradient(0, 0, 0, 400);
    gradientOut.addColorStop(0, 'rgba(255, 20, 147, 0.6)'); // Top (Darker)
    gradientOut.addColorStop(1, 'rgba(255, 20, 147, 0.0)'); // Bottom (Fade out)

    powerChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Power In (Input)',
                    data: data.powerIn,
                    borderColor: '#FFC107', // Bright Amber Border
                    borderWidth: 3,
                    backgroundColor: gradientIn,
                    fill: true,
                    tension: 0.4, // Smooth Curve
                    pointRadius: 0, // Clean look (points hidden)
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#FFC107',
                    order: 2 // Isko peeche rakhenge
                },
                {
                    label: 'Power Out (Output)',
                    data: data.powerOut,
                    borderColor: '#FF1493', // Deep Pink Border
                    borderWidth: 3,
                    backgroundColor: gradientOut,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#FF1493',
                    order: 1 // Isko upar rakhenge taaki dark pink clearly dikhe
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 8,
                        font: { size: 12, weight: 'bold' },
                        color: '#555'
                    }
                },
                title: {
                    display: false // Title hata diya clean look ke liye
                },
                tooltip: {
                    // --- SMART TOOLTIP SETTINGS ---
                    backgroundColor: 'rgba(30, 30, 30, 0.9)', // Dark background
                    titleColor: '#fff',
                    bodyColor: '#ecf0f1',
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            let value = context.parsed.y;
                            return ' ' + label + ': ' + value.toFixed(3) + ' kW';
                        },
                        // Yahan hum Magic karenge: Footer me Loss aur Efficiency dikhayenge
                        afterBody: function (tooltipItems) {
                            // Data fetch karo
                            let pIn = 0;
                            let pOut = 0;

                            tooltipItems.forEach(item => {
                                if (item.datasetIndex === 0) pIn = item.parsed.y;
                                if (item.datasetIndex === 1) pOut = item.parsed.y;
                            });

                            if (pIn > 0) {
                                let loss = (pIn - pOut).toFixed(3);
                                let eff = ((pOut / pIn) * 100).toFixed(2);
                                return '-------------------------------------------\n' +
                                    '⚠ Power Loss: ' + loss + ' kW\n' +
                                    '⚡ Efficiency:  ' + eff + '%';
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false, // Vertical lines hata di (Cleaner Look)
                    },
                    ticks: {
                        font: { weight: 'bold' },
                        color: '#666'
                    },
                    title: { display: true, text: 'Current (A)', font: { weight: 'bold' }, color: '#444' }
                },
                y: {
                    grid: {
                        color: '#f0f0f0',
                        borderDash: [5, 5] // Dashed horizontal lines
                    },
                    ticks: {
                        color: '#666'
                    },
                    title: { display: true, text: 'Power (kW)', font: { weight: 'bold' }, color: '#444' },
                    beginAtZero: true
                }
            }
        }
    });
}