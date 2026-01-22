/**
 * 3D Visualization Logic for PCB Motor Calculator
 * UPDATED: Added Mobile Drawer Logic & Responsive Resize
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

const MAGNET_HEIGHT = 2.0;

// ==========================================
// 1. INITIALIZATION
// ==========================================

function init() {
    // 1. Scene Setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f1012); // Matched CSS var(--bg-dark)
    scene.fog = new THREE.Fog(0x0f1012, 50, 600);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(130, 100, 130);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const container = document.getElementById('canvas-container');
    
    // Initial Size Calculation
    updateRendererSize();
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for mobile performance
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; 
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 500;
    controls.target.set(0, 0, 0);

    // 5. Setup
    setupLights();
    setupHelpers();
    
    // Groups
    statorGroup = new THREE.Group();
    coilGroup = new THREE.Group();
    rotorSystem = new THREE.Group();
    scene.add(statorGroup);
    scene.add(coilGroup);
    scene.add(rotorSystem);

    // 6. Build
    loadDataFromStorage();
    buildModel();

    // 7. Listeners
    window.addEventListener('resize', onWindowResize, false);
    setupUIListeners();
    setupMobileInterface(); // New Mobile Logic

    // 8. Start Loop
    animate();
}

/**
 * Handles Canvas Sizing Logic considering Desktop Sidebar
 */
function updateRendererSize() {
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

function setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(50, 100, 50);
    dirLight.castShadow = true;
    // Optimize shadow map for mobile
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0x6c5ce7, 0.5); // Primary color tint
    backLight.position.set(-50, -20, -50);
    scene.add(backLight);
}

function setupHelpers() {
    helperGroup = new THREE.Group();
    const gridHelper = new THREE.GridHelper(300, 30, 0x333333, 0x1a1a1a);
    helperGroup.add(gridHelper);
    const axesHelper = new THREE.AxesHelper(30);
    helperGroup.add(axesHelper);
    scene.add(helperGroup);
}

// ==========================================
// 2. GEOMETRY GENERATION
// ==========================================

function buildModel() {
    // Cleanup
    clearGroup(statorGroup);
    clearGroup(coilGroup);
    clearGroup(rotorSystem);

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
        showError("Build Error: " + e.message);
    }
}

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
        curveSegments: 48, // Reduced for mobile perf
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 1
    });

    geometry.translate(0, 0, -pcbBoardThickness / 2);
    geometry.rotateX(Math.PI / 2);

    const material = new THREE.MeshPhysicalMaterial({
        color: 0x27ae60, // Tech Green
        transparent: true,
        opacity: 0.85,
        roughness: 0.3,
        metalness: 0.1,
        side: THREE.DoubleSide
    });

    const stackHeight = (numPCBLayers * pcbBoardThickness) + ((numPCBLayers > 1 ? numPCBLayers - 1 : 0) * explodeVal);
    const startY = -(stackHeight / 2) + (pcbBoardThickness / 2);

    if (numPCBLayers > 0) {
        const mesh = new THREE.InstancedMesh(geometry, material, numPCBLayers);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const dummy = new THREE.Object3D();
        for (let i = 0; i < numPCBLayers; i++) {
            const yPos = startY + (i * pcbBoardThickness) + (i * explodeVal);
            dummy.position.set(0, yPos, 0);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
        statorGroup.add(mesh);
    }
}

function buildTraces() {
    const { pcbStatorOD, pcbStatorID, traceWidthID, traceGap, numPCBLayers } = motorData;
    const explodeVal = parseFloat(document.getElementById('explodeSlider').value) || 0;

    const innerRadius = pcbStatorID / 2;
    const outerRadius = pcbStatorOD / 2;
    const circumference = 2 * Math.PI * innerRadius;
    const pitch = traceWidthID + traceGap;
    let numLines = Math.floor(circumference / pitch);

    if (numLines > 180) numLines = 180;
    if (numLines < 1) numLines = 1;

    const traceLen = outerRadius - innerRadius;
    const geometry = new THREE.BoxGeometry(traceLen, 0.04, traceWidthID); 
    geometry.translate((innerRadius + traceLen / 2), 0, 0);

    const material = new THREE.MeshStandardMaterial({
        color: 0xe17055, // Copper
        roughness: 0.3,
        metalness: 0.9
    });

    const totalInstances = numLines * numPCBLayers;
    const mesh = new THREE.InstancedMesh(geometry, material, totalInstances);

    const dummy = new THREE.Object3D();
    const stackHeight = (numPCBLayers * motorData.pcbBoardThickness) + ((numPCBLayers > 1 ? numPCBLayers - 1 : 0) * explodeVal);
    const startY = -(stackHeight / 2) + (motorData.pcbBoardThickness / 2);

    let index = 0;
    for (let layer = 0; layer < numPCBLayers; layer++) {
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

function buildRotorSystem() {
    const { pcbStatorOD, pcbStatorID, pmRotorHeight, airGap, numPCBLayers, pcbBoardThickness } = motorData;
    const explodeVal = parseFloat(document.getElementById('explodeSlider').value) || 0;

    const statorStackHeight = (numPCBLayers * pcbBoardThickness) + ((numPCBLayers > 1 ? numPCBLayers - 1 : 0) * explodeVal);
    const yOffset = (statorStackHeight / 2) + airGap + MAGNET_HEIGHT;

    const rotorTemplate = new THREE.Group();

    // Iron Back plate
    const rOuter = (pcbStatorOD / 2) + 1;
    const ironGeo = new THREE.CylinderGeometry(rOuter, rOuter, pmRotorHeight, 64);
    ironGeo.translate(0, pmRotorHeight / 2, 0);
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x2d3436, metalness: 0.8, roughness: 0.2 });
    rotorTemplate.add(new THREE.Mesh(ironGeo, ironMat));

    // Magnets
    const numPoles = 14;
    const magLen = (pcbStatorOD - pcbStatorID) / 2;
    const avgRadius = (pcbStatorOD + pcbStatorID) / 4;
    const magW = (2 * Math.PI * avgRadius) / numPoles * 0.7;

    const magGeo = new THREE.BoxGeometry(magLen, MAGNET_HEIGHT, magW);
    magGeo.translate((pcbStatorID / 2) + (magLen / 2), -MAGNET_HEIGHT / 2, 0);

    const matN = new THREE.MeshStandardMaterial({ color: 0xd63031, metalness: 0.3, roughness: 0.2 }); // Red
    const matS = new THREE.MeshStandardMaterial({ color: 0x0984e3, metalness: 0.3, roughness: 0.2 }); // Blue

    for (let i = 0; i < numPoles; i++) {
        const angle = (i / numPoles) * Math.PI * 2;
        const mag = new THREE.Mesh(magGeo, (i % 2 === 0) ? matN : matS);
        mag.rotation.y = angle;
        rotorTemplate.add(mag);
    }

    const topRotor = rotorTemplate.clone();
    topRotor.position.y = yOffset;
    rotorSystem.add(topRotor);

    const botRotor = rotorTemplate.clone();
    botRotor.rotation.x = Math.PI;
    botRotor.position.y = -yOffset;
    rotorSystem.add(botRotor);
}

// ==========================================
// 3. UTILITIES & EVENTS
// ==========================================

function clearGroup(group) {
    while (group.children.length > 0) {
        const child = group.children[0];
        if (child.children.length > 0) clearGroup(child);
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
            if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
            else child.material.dispose();
        }
        group.remove(child);
    }
}

function updateStats() {
    const triangles = renderer.info.render.triangles;
    const el = document.getElementById('poly-counter');
    if (el) el.innerText = `Tris: ${triangles.toLocaleString()}`;
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
        // Auto dismiss after 5s
        setTimeout(() => { el.style.display = 'none'; }, 5000);
    }
}

function hideError() {
    const el = document.getElementById('error-msg');
    if (el) el.style.display = 'none';
}

function onWindowResize() {
    updateRendererSize();
}

/**
 * New Mobile Drawer & Logic
 */
function setupMobileInterface() {
    const toggleBtn = document.getElementById('mobile-toggle-btn');
    const panel = document.getElementById('controls-panel');
    const backdrop = document.getElementById('drawer-backdrop');
    
    // Toggle Function
    function toggleDrawer() {
        const isOpen = panel.classList.contains('open');
        if (isOpen) {
            panel.classList.remove('open');
            backdrop.classList.remove('active');
        } else {
            panel.classList.add('open');
            backdrop.classList.add('active');
        }
    }

    // Event Listeners
    if(toggleBtn) toggleBtn.addEventListener('click', toggleDrawer);
    if(backdrop) backdrop.addEventListener('click', toggleDrawer);
    
    // Close on Drag Down (Basic Swipe)
    let startY;
    const handle = document.querySelector('.drawer-handle');
    
    if(handle && panel) {
        handle.addEventListener('touchstart', e => { startY = e.touches[0].clientY; });
        handle.addEventListener('touchmove', e => {
            const currentY = e.touches[0].clientY;
            if (currentY - startY > 50) { // Dragged down
                toggleDrawer(); 
            }
        });
    }
}

function setupUIListeners() {
    document.getElementById('syncBtn').addEventListener('click', () => {
        loadDataFromStorage();
        buildModel();
    });

    // Debounced Input Handler
    let timeout;
    document.querySelectorAll('#controls-panel input[type="number"]').forEach(input => {
        input.addEventListener('input', (e) => {
            const key = e.target.id.replace('v_', '');
            const val = parseFloat(e.target.value);
            
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (!isNaN(val)) {
                    motorData[key] = val;
                    buildModel();
                }
            }, 100);
        });
    });

    const slider = document.getElementById('explodeSlider');
    const sliderVal = document.getElementById('explodeValDisplay');
    if (slider) {
        slider.addEventListener('input', (e) => {
            if(sliderVal) sliderVal.innerText = e.target.value + "mm";
            buildModel();
        });
    }

    const toggle = (id, obj) => {
        const el = document.getElementById(id);
        if (el && obj) el.addEventListener('change', e => obj.visible = e.target.checked);
    };

    toggle('showStator', statorGroup);
    toggle('showTraces', coilGroup);
    toggle('showRotor', rotorSystem);
    toggle('showAxes', helperGroup);

    document.getElementById('animateRotor').addEventListener('change', e => isAnimating = e.target.checked);

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
    if (isAnimating && rotorSystem) {
        rotorSystem.rotation.y += 2 * clock.getDelta();
    }
    controls.update();
    renderer.render(scene, camera);
}

// Start
init();