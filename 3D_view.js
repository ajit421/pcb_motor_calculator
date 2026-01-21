/**
 * 3D Visualization Logic for PCB Motor Calculator
 * FIXED: Magnet Collision, Duplicate Geometries, Rotor Alignment
 */

// Global Variables
let scene, camera, renderer, controls;
let statorGroup, coilGroup, rotorSystem, helperGroup;
let clock = new THREE.Clock();
let isAnimating = false;

// Default Data (fallback)
let motorData = {
    pcbStatorOD: 109.5,
    pcbStatorID: 65,
    pcbBoardThickness: 1.6,
    numPCBLayers: 12,
    pmRotorHeight: 6,
    airGap: 1.0,
    traceWidthID: 1.77,
    traceGap: 0.5
};

// Magnet Thickness (Constant for now, or could be an input)
const MAGNET_HEIGHT = 2.0;

// ==========================================
// 1. INITIALIZATION
// ==========================================

function init() {
    // 1. Scene Setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a); // Dark professional background
    scene.fog = new THREE.Fog(0x1a1a1a, 50, 500);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(130, 100, 130);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // 4. Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 500;

    // 5. Lighting
    setupLights();

    // 6. Helpers
    setupHelpers();

    // 7. Group Initialization
    statorGroup = new THREE.Group();
    coilGroup = new THREE.Group();
    rotorSystem = new THREE.Group();

    scene.add(statorGroup);
    scene.add(coilGroup);
    scene.add(rotorSystem);

    // 8. Load Data & Build
    loadDataFromStorage();
    buildModel();

    // 9. Events
    window.addEventListener('resize', onWindowResize, false);
    setupUIListeners();

    // 10. Start Loop
    animate();
}

function setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(50, 100, 50);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // Blue Rim light for metallic definitions
    const backLight = new THREE.DirectionalLight(0x4455ff, 0.5);
    backLight.position.set(-50, -20, -50);
    scene.add(backLight);
}

function setupHelpers() {
    helperGroup = new THREE.Group();
    const gridHelper = new THREE.GridHelper(300, 30, 0x444444, 0x222222);
    helperGroup.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(30);
    helperGroup.add(axesHelper);

    scene.add(helperGroup);
}

// ==========================================
// 2. GEOMETRY GENERATION
// ==========================================

function buildModel() {
    // 1. CLEANUP (Recursively removes old meshes to fix ghosts)
    clearGroup(statorGroup);
    clearGroup(coilGroup);
    clearGroup(rotorSystem);

    // 2. Validation
    if (motorData.pcbStatorID >= motorData.pcbStatorOD) {
        showError("Error: Stator ID must be less than OD");
        return;
    }

    try {
        buildStator();
        buildTraces();
        buildRotorSystem();
        updateStats();
        hideError();
    } catch (e) {
        console.error("Build Failed:", e);
        showError("Rendering Error: " + e.message);
    }
}

/**
 * Builds FR4 PCB Layers
 */
function buildStator() {
    const { pcbStatorOD, pcbStatorID, pcbBoardThickness, numPCBLayers } = motorData;
    const explodeVal = parseFloat(document.getElementById('explodeSlider').value) || 0;

    const outerRadius = pcbStatorOD / 2;
    const innerRadius = pcbStatorID / 2;

    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: pcbBoardThickness,
        curveSegments: 64,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 1
    });

    // Center pivot vertically and rotate flat
    geometry.translate(0, 0, -pcbBoardThickness / 2);
    geometry.rotateX(Math.PI / 2);

    const material = new THREE.MeshPhysicalMaterial({
        color: 0x2e8b57, // PCB Green
        transparent: true,
        opacity: 0.9,
        roughness: 0.3,
        metalness: 0.1,
        side: THREE.DoubleSide
    });

    // Calculate start Y to center the stack (accounting for explode gaps)
    const stackHeight = (numPCBLayers * pcbBoardThickness) + ((numPCBLayers > 1 ? numPCBLayers - 1 : 0) * explodeVal);
    const startY = -(stackHeight / 2) + (pcbBoardThickness / 2);

    if (numPCBLayers > 0) {
        const mesh = new THREE.InstancedMesh(geometry, material, numPCBLayers);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const dummy = new THREE.Object3D();
        for (let i = 0; i < numPCBLayers; i++) {
            // Apply explode offset
            const yPos = startY + (i * pcbBoardThickness) + (i * explodeVal);
            dummy.position.set(0, yPos, 0);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
        statorGroup.add(mesh);
    }
}

/**
 * Builds Copper Traces
 */
function buildTraces() {
    const { pcbStatorOD, pcbStatorID, traceWidthID, traceGap, numPCBLayers } = motorData;
    const explodeVal = parseFloat(document.getElementById('explodeSlider').value) || 0;

    const innerRadius = pcbStatorID / 2;
    const outerRadius = pcbStatorOD / 2;
    const circumference = 2 * Math.PI * innerRadius;
    const pitch = traceWidthID + traceGap;
    let numLines = Math.floor(circumference / pitch);

    // Safety cap
    if (numLines > 180) numLines = 180;
    if (numLines < 1) numLines = 1;

    // Simplified Trace Geometry (Box)
    const traceLen = outerRadius - innerRadius;
    const geometry = new THREE.BoxGeometry(traceLen, 0.04, traceWidthID); // Thin copper
    geometry.translate((innerRadius + traceLen / 2), 0, 0);

    const material = new THREE.MeshStandardMaterial({
        color: 0xb87333, // Copper
        roughness: 0.4,
        metalness: 1.0
    });

    const totalInstances = numLines * numPCBLayers;
    const mesh = new THREE.InstancedMesh(geometry, material, totalInstances);

    const dummy = new THREE.Object3D();
    // Calculate start Y to center the stack (accounting for explode gaps)
    const stackHeight = (numPCBLayers * motorData.pcbBoardThickness) + ((numPCBLayers > 1 ? numPCBLayers - 1 : 0) * explodeVal);
    const startY = -(stackHeight / 2) + (motorData.pcbBoardThickness / 2);

    let index = 0;
    for (let layer = 0; layer < numPCBLayers; layer++) {
        // Place slightly above PCB surface (0.03 offset)
        const yPos = startY + (layer * motorData.pcbBoardThickness) + (layer * explodeVal) + (motorData.pcbBoardThickness / 2) + 0.03;

        for (let line = 0; line < numLines; line++) {
            const angle = (line / numLines) * Math.PI * 2;

            dummy.position.set(0, yPos, 0);
            dummy.rotation.set(0, angle, 0);
            dummy.updateMatrix();
            mesh.setMatrixAt(index++, dummy.matrix);
        }
    }

    mesh.instanceMatrix.needsUpdate = true;
    coilGroup.add(mesh);
}

/**
 * Builds Rotor System (Top and Bottom)
 * Handles correct gap spacing and rotation.
 */
function buildRotorSystem() {
    const { pcbStatorOD, pcbStatorID, pmRotorHeight, airGap, numPCBLayers, pcbBoardThickness } = motorData;
    const explodeVal = parseFloat(document.getElementById('explodeSlider').value) || 0;

    // 1. Calculate Stator Height (Visual height including explode gaps)
    const statorStackHeight = (numPCBLayers * pcbBoardThickness) + ((numPCBLayers > 1 ? numPCBLayers - 1 : 0) * explodeVal);

    // 2. Calculate Rotor Center Position
    // We want the MAGNET SURFACE to be at (statorHeight/2 + airGap).
    // The Rotor Assembly Origin is at the interface between Magnet and Iron.
    // Magnets hang DOWN (-MAGNET_HEIGHT) from origin. Iron goes UP (+pmRotorHeight) from origin.
    // So, Origin Y = (statorHeight/2) + airGap + MAGNET_HEIGHT.
    const yOffset = (statorStackHeight / 2) + airGap + MAGNET_HEIGHT;

    // --- Template Group for One Rotor ---
    const rotorTemplate = new THREE.Group();

    // Back Iron (Cylinder)
    const rOuter = (pcbStatorOD / 2) + 1;
    const ironGeo = new THREE.CylinderGeometry(rOuter, rOuter, pmRotorHeight, 64);
    // Move up so bottom face is at Y=0
    ironGeo.translate(0, pmRotorHeight / 2, 0);

    const ironMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.2 });
    const ironMesh = new THREE.Mesh(ironGeo, ironMat);
    rotorTemplate.add(ironMesh);

    // Magnets (Boxes)
    const numPoles = 14;
    const magLen = (pcbStatorOD - pcbStatorID) / 2;
    const avgRadius = (pcbStatorOD + pcbStatorID) / 4;
    const magW = (2 * Math.PI * avgRadius) / numPoles * 0.7; // 70% fill factor

    const magGeo = new THREE.BoxGeometry(magLen, MAGNET_HEIGHT, magW);
    // Move down so top face is at Y=0, and move out to radius
    magGeo.translate((pcbStatorID / 2) + (magLen / 2), -MAGNET_HEIGHT / 2, 0);

    const matN = new THREE.MeshStandardMaterial({ color: 0xc0392b, metalness: 0.3, roughness: 0.2 }); // Red
    const matS = new THREE.MeshStandardMaterial({ color: 0x2980b9, metalness: 0.3, roughness: 0.2 }); // Blue

    for (let i = 0; i < numPoles; i++) {
        const angle = (i / numPoles) * Math.PI * 2;
        const mag = new THREE.Mesh(magGeo, (i % 2 === 0) ? matN : matS);
        mag.rotation.y = angle;
        rotorTemplate.add(mag);
    }

    // --- Top Rotor ---
    const topRotor = rotorTemplate.clone();
    topRotor.position.y = yOffset;
    rotorSystem.add(topRotor);

    // --- Bottom Rotor ---
    const botRotor = rotorTemplate.clone();
    // Rotate 180 deg around X so magnets face UP
    botRotor.rotation.x = Math.PI;
    // Position symmetric to top
    botRotor.position.y = -yOffset;

    rotorSystem.add(botRotor);
}

// ==========================================
// 3. UTILITIES
// ==========================================

function clearGroup(group) {
    // Traverse backwards to safely remove children
    while (group.children.length > 0) {
        const child = group.children[0];

        // Recursive clear for complex objects
        if (child.children.length > 0) {
            clearGroup(child);
        }

        if (child.geometry) child.geometry.dispose();

        if (child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach(m => m.dispose());
            } else {
                child.material.dispose();
            }
        }
        group.remove(child);
    }
}

function updateStats() {
    const triangles = renderer.info.render.triangles;
    const el = document.getElementById('poly-counter');
    if (el) el.innerText = `Triangles: ${triangles.toLocaleString()}`;
}

function loadDataFromStorage() {
    const stored = localStorage.getItem('pcb_motor_data');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            Object.keys(motorData).forEach(key => {
                if (parsed[key] !== undefined && !isNaN(parseFloat(parsed[key]))) {
                    motorData[key] = parseFloat(parsed[key]);
                }
            });
            updateUIInputs();
        } catch (e) { console.warn("Data load error", e); }
    }
}

function updateUIInputs() {
    Object.keys(motorData).forEach(key => {
        const el = document.getElementById(`v_${key}`);
        if (el) el.value = motorData[key];
    });
}

function showError(msg) {
    const el = document.getElementById('error-msg');
    if (el) {
        el.innerText = msg;
        el.style.display = 'block';
    }
}

function hideError() {
    const el = document.getElementById('error-msg');
    if (el) el.style.display = 'none';
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function setupUIListeners() {
    const syncBtn = document.getElementById('syncBtn');
    if (syncBtn) syncBtn.addEventListener('click', () => {
        loadDataFromStorage();
        buildModel();
    });

    document.querySelectorAll('#controls-panel input[type="number"]').forEach(input => {
        input.addEventListener('input', (e) => {
            const key = e.target.id.replace('v_', '');
            const val = parseFloat(e.target.value);
            if (!isNaN(val)) {
                motorData[key] = val;
                buildModel();
            }
        });
    });

    const slider = document.getElementById('explodeSlider');
    if (slider) slider.addEventListener('input', buildModel);

    const toggle = (id, obj) => {
        const el = document.getElementById(id);
        if (el && obj) el.addEventListener('change', e => obj.visible = e.target.checked);
    };

    toggle('showStator', statorGroup);
    toggle('showTraces', coilGroup);
    toggle('showRotor', rotorSystem);
    toggle('showAxes', helperGroup);

    const animCheck = document.getElementById('animateRotor');
    if (animCheck) animCheck.addEventListener('change', e => isAnimating = e.target.checked);

    document.getElementById('resetViewBtn').addEventListener('click', () => {
        controls.reset();
        camera.position.set(130, 100, 130);
    });

    document.getElementById('exportObjBtn').addEventListener('click', () => {
        const exporter = new THREE.OBJExporter();
        const result = exporter.parse(scene);
        const blob = new Blob([result], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'pcb_motor.obj';
        link.click();
    });
}

function animate() {
    requestAnimationFrame(animate);

    if (isAnimating) {
        rotorSystem.rotation.y += 2 * clock.getDelta();
    }

    controls.update();
    renderer.render(scene, camera);
}

// Start
init();