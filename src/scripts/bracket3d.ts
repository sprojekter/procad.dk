// 3D-model af et bukket stålbeslag (L-profil med to huller i bunden og ét i flangen).
// Bukket kan animeres fra 90° til fladt (udfoldning) med konstant neutralakse-længde,
// så udfoldningen er fysisk korrekt: buelængde = (R + K·t) · θ.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const T = 3; // pladetykkelse (mm)
const R0 = 3; // indvendig bukkeradius ved 90°
const K = 0.33; // K-faktor
const W = 90; // bredde
const LB = 120; // bundplade
const LF = 80; // flange
const BA = (R0 + K * T) * (Math.PI / 2); // bukketillæg (neutralaksens længde)

type Hole = [x: number, z: number, r: number];

/** Plade i XZ-planet: x fra x0 til x1, z fra 0 til W, tykkelse y fra 0 til T. */
function plate(x0: number, x1: number, holes: Hole[] = []) {
  const s = new THREE.Shape();
  s.moveTo(x0, -W);
  s.lineTo(x1, -W);
  s.lineTo(x1, 0);
  s.lineTo(x0, 0);
  s.closePath();
  for (const [hx, hz, r] of holes) {
    const h = new THREE.Path();
    h.absarc(hx, -hz, r, 0, Math.PI * 2, false);
    s.holes.push(h);
  }
  const g = new THREE.ExtrudeGeometry(s, { depth: T, bevelEnabled: false, curveSegments: 32 });
  g.rotateX(-Math.PI / 2);
  return g;
}

/** Bukket zone som ringsektor ekstruderet langs z. theta i radianer. */
function bend(theta: number) {
  if (theta < 0.002) return { geo: plate(-BA, 0), ox: -BA, oy: 0 };
  const R = BA / theta - K * T;
  const cy = T + R;
  const a0 = -Math.PI / 2;
  const a1 = a0 - theta;
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.absarc(0, cy, R + T, a0, a1, true);
  s.lineTo(R * Math.cos(a1), cy + R * Math.sin(a1));
  s.absarc(0, cy, R, a1, a0, false);
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: W, bevelEnabled: false, curveSegments: 24 });
  return { geo, ox: (R + T) * Math.cos(a1), oy: cy + (R + T) * Math.sin(a1) };
}

function cssColor(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(v || fallback);
}

export function initBracket(root: HTMLElement) {
  const canvas = root.querySelector('canvas') as HTMLCanvasElement;
  const stage = root.querySelector('.m3d__stage') as HTMLElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Render-tilstand skal findes, før resize() kalder kick() første gang.
  let visible = true;
  let raf = 0;
  let prev = performance.now();
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return; // stregtegningen bliver stående
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(28, 1, 1, 3000);
  camera.position.set(330, 250, 380);

  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(120, 300, 160);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  const sc = key.shadow.camera as THREE.OrthographicCamera;
  sc.left = -220; sc.right = 220; sc.top = 220; sc.bottom = -220; sc.near = 10; sc.far = 800;
  key.shadow.radius = 6;
  scene.add(key, new THREE.AmbientLight(0xffffff, 0.25));

  const steel = new THREE.MeshStandardMaterial({ color: 0xb9bdc3, metalness: 0.88, roughness: 0.36 });
  const edgeMat = new THREE.LineBasicMaterial({ color: cssColor('--c-ink', '#0e0e10'), transparent: true, opacity: 0.32 });
  const bendLineMat = new THREE.LineDashedMaterial({ color: 0xff7621, dashSize: 6, gapSize: 4, transparent: true, opacity: 0 });

  const model = new THREE.Group();
  const part = new THREE.Group();
  model.add(part);
  scene.add(model);

  // "Tegning"-visning: hvid flade med sorte kanter, som en isometrisk arbejdstegning
  const paperMat = new THREE.MeshBasicMaterial({ color: cssColor('--c-white', '#ffffff'), polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
  const meshes: THREE.Mesh[] = [];
  const addMesh = (geo: THREE.BufferGeometry, parent: THREE.Object3D) => {
    const m = new THREE.Mesh(geo, steel);
    meshes.push(m);
    m.castShadow = true;
    m.receiveShadow = true;
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), edgeMat);
    parent.add(m, e);
    return [m, e] as const;
  };

  // Bundplade (fast)
  addMesh(plate(0, LB, [[85, 25, 4.5], [85, 65, 4.5]]), part);

  // Flange (roteres om bukket)
  const flange = new THREE.Group();
  addMesh(plate(-LF, 0, [[-LF * 0.55, W / 2, 6.5]]), flange);
  part.add(flange);

  // Bukket zone (genopbygges ved hver vinkel)
  const bendGroup = new THREE.Group();
  part.add(bendGroup);

  // Bukkelinje (synlig når emnet er udfoldet)
  const bendLineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-BA / 2, T + 0.3, -4), new THREE.Vector3(-BA / 2, T + 0.3, W + 4)]);
  const bendLine = new THREE.Line(bendLineGeo, bendLineMat);
  bendLine.computeLineDistances();
  part.add(bendLine);

  // Jord med blød skygge
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1200, 1200), new THREE.ShadowMaterial({ opacity: 0.14 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Forudberegn bukket i STEPS trin (0 = fladt, STEPS = 90°), så intet bygges om under animationen.
  const STEPS = 36;
  const box = new THREE.Box3();
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();
  type Frame = { mesh: THREE.Mesh; edges: THREE.LineSegments; ox: number; oy: number; cx: number; cz: number; minY: number; h: number };
  const frames: Frame[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const theta = (i / STEPS) * (Math.PI / 2);
    const b = bend(theta);
    const [mesh, edges] = addMesh(b.geo, bendGroup);
    flange.position.set(b.ox, b.oy, 0);
    flange.rotation.z = -theta;
    part.position.set(0, 0, 0);
    bendGroup.children.forEach((c) => (c.visible = c === mesh || c === edges));
    box.setFromObject(part);
    box.getCenter(center);
    box.getSize(size);
    frames.push({ mesh, edges, ox: b.ox, oy: b.oy, cx: center.x, cz: center.z, minY: box.min.y, h: size.y });
  }

  let shown = -1;
  function setFold(t: number) {
    // t: 0 (fladt) … 1 (bukket)
    const i = Math.round(t * STEPS);
    if (i === shown) return;
    shown = i;
    const f = frames[i];
    bendGroup.children.forEach((c) => (c.visible = c === f.mesh || c === f.edges));
    flange.position.set(f.ox, f.oy, 0);
    flange.rotation.z = -(i / STEPS) * (Math.PI / 2);
    bendLineMat.opacity = Math.max(0, 1 - (i / STEPS) * 2) * 0.9;
    part.position.set(-f.cx, -f.minY, -f.cz);
    ground.position.y = -0.01;
    controls.target.set(0, f.h * 0.4, 0);
    const deg = Math.round((i / STEPS) * 90);
    if (angleOut) angleOut.textContent = `${deg}°`;
    if (range && document.activeElement !== range && !intro.length) range.value = String(deg);
  }

  // Kamera og kontrol
  const controls = new OrbitControls(camera, canvas);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = !reduce;
  controls.autoRotateSpeed = 0.7;
  controls.minPolarAngle = 0.01; // tillader "ovenfra"
  controls.maxPolarAngle = Math.PI / 2 - 0.02; // aldrig under gulvet
  controls.target.set(0, 20, 0);
  canvas.style.touchAction = 'pan-y'; // lodret swipe scroller siden på mobil

  const resize = () => {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    kick();
  };
  new ResizeObserver(resize).observe(stage);
  resize();

  // Fold-animation: én intro (fold ud og tilbage), derefter kun når brugeren vælger.
  let fold = 1; // 1 = bukket, 0 = udfoldet
  let target = 1;
  const intro = reduce ? [] : [0, 1];
  let introAt = performance.now() + 1200;
  const buttons = root.querySelectorAll<HTMLButtonElement>('[data-fold]');
  const setTarget = (t: number, fromRange = false) => {
    target = t;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.fold) === t)));
    if (!fromRange && range) range.value = String(Math.round(t * 90));
    kick();
  };
  buttons.forEach((b) => b.addEventListener('click', () => { intro.length = 0; setTarget(Number(b.dataset.fold)); }));
  canvas.addEventListener('pointerdown', () => { intro.length = 0; controls.autoRotate = false; root.classList.add('is-touched'); }, { once: true });
  window.setTimeout(() => { controls.autoRotate = false; }, 9000); // drej kun i starten

  // Kantfarve følger temaet
  new MutationObserver(() => { edgeMat.color.copy(cssColor('--c-ink', '#0e0e10')); if (drawing) applyDrawing(); kick(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // ---------- Mål (HTML-etiketter, der følger modellen) ----------
  const fmt = (n: number) => n.toLocaleString('da-DK', { maximumFractionDigits: 1 });
  const FLAT = LB + LF + BA; // udfoldet længde målt på neutralaksen (forenklet: flanger målt fra bukkestart)
  const dimsEl = root.querySelector<HTMLElement>('[data-dims]');
  type Dim = { el: HTMLElement; obj: THREE.Object3D; p: THREE.Vector3; when: (t: number) => boolean };
  const dims: Dim[] = [];
  const mkDim = (text: string, obj: THREE.Object3D, p: THREE.Vector3, when: (t: number) => boolean, accent = false) => {
    if (!dimsEl) return;
    const el = document.createElement('span');
    el.className = 'm3d__dim' + (accent ? ' m3d__dim--accent' : '');
    el.textContent = text;
    dimsEl.append(el);
    dims.push({ el, obj, p, when });
  };
  mkDim(`${LB}`, part, new THREE.Vector3(LB / 2, 0, W + 6), (t) => t > 0.5);
  mkDim(`${W}`, part, new THREE.Vector3(LB + 6, 0, W / 2), () => true);
  mkDim(`${LF}`, flange, new THREE.Vector3(-LF / 2, T, W + 6), (t) => t > 0.5);
  mkDim(`${fmt(FLAT)} udfoldet`, part, new THREE.Vector3(-BA / 2, 0, W + 10), (t) => t <= 0.5, true);
  mkDim(`R${R0}`, part, new THREE.Vector3(-BA / 2, T, -6), (t) => t > 0.05);
  let showDims = false;
  const v3 = new THREE.Vector3();
  function placeDims() {
    if (!dimsEl) return;
    dimsEl.hidden = !showDims;
    if (!showDims) return;
    const w = stage.clientWidth, h = stage.clientHeight;
    part.updateMatrixWorld(true);
    for (const d of dims) {
      const on = d.when(fold);
      d.el.style.opacity = on ? '1' : '0';
      if (!on) continue;
      v3.copy(d.p);
      d.obj.localToWorld(v3);
      v3.project(camera);
      d.el.style.transform = `translate(${((v3.x + 1) / 2) * w}px, ${((1 - v3.y) / 2) * h}px) translate(-50%, -50%)`;
    }
  }

  // ---------- Visninger (kamera-forudindstillinger) ----------
  const VIEWS: Record<string, [number, number, number]> = {
    iso: [330, 250, 380],
    front: [0, 95, 560],
    side: [560, 95, 0.01],
    top: [0.01, 560, 30],
  };
  let camFrom: THREE.Vector3 | null = null;
  let camTo: THREE.Vector3 | null = null;
  let camT = 1;
  const viewBtns = root.querySelectorAll<HTMLButtonElement>('[data-view]');
  const setView = (name: string) => {
    const v = VIEWS[name];
    if (!v) return;
    controls.autoRotate = false;
    camFrom = camera.position.clone().sub(controls.target);
    camTo = new THREE.Vector3(...v).setLength(camFrom.length());
    camT = reduce ? 1 : 0;
    if (reduce) camera.position.copy(controls.target).add(camTo);
    viewBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === name)));
    kick();
  };
  viewBtns.forEach((b) => b.addEventListener('click', () => setView(b.dataset.view!)));
  canvas.addEventListener('pointerdown', () => viewBtns.forEach((b) => b.setAttribute('aria-pressed', 'false')));
  function stepCamera(dt: number) {
    if (!camFrom || !camTo || camT >= 1) return false;
    camT = Math.min(1, camT + dt / 0.7);
    const e = 1 - Math.pow(1 - camT, 3);
    const r = camFrom.length();
    v3.copy(camFrom).lerp(camTo, e).setLength(r); // bevæg langs kuglen, ikke gennem modellen
    camera.position.copy(controls.target).add(v3);
    return true;
  }

  // ---------- Værktøjer: mål og tegning ----------
  const toolBtns = root.querySelectorAll<HTMLButtonElement>('[data-tool]');
  let drawing = false;
  const applyDrawing = () => {
    paperMat.color.copy(cssColor('--c-white', '#ffffff'));
    meshes.forEach((m) => (m.material = drawing ? paperMat : steel));
    edgeMat.opacity = drawing ? 0.9 : 0.32;
    ground.visible = !drawing;
    renderer.toneMapping = drawing ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
    root.classList.toggle('is-drawing', drawing);
  };
  toolBtns.forEach((b) =>
    b.addEventListener('click', () => {
      const on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
      if (b.dataset.tool === 'dims') showDims = on;
      if (b.dataset.tool === 'draw') { drawing = on; applyDrawing(); }
      kick();
    }),
  );

  // ---------- Bukkevinkel (skyder) ----------
  const range = root.querySelector<HTMLInputElement>('[data-angle]');
  const angleOut = root.querySelector<HTMLElement>('[data-angle-out]');
  range?.addEventListener('input', () => {
    intro.length = 0;
    controls.autoRotate = false;
    setTarget(Number(range.value) / 90, true);
  });

  setFold(1);

  // Tegn kun når noget ændrer sig (sparer CPU/batteri)
  new IntersectionObserver((es) => { visible = es.some((e) => e.isIntersecting); if (visible) kick(); }).observe(root);
  controls.addEventListener('change', () => kick());
  function kick() { if (!raf) { prev = performance.now(); raf = requestAnimationFrame(frame); } }
  function frame(now: number) {
    raf = 0;
    const dt = Math.min(0.05, (now - prev) / 1000);
    prev = now;
    if (intro.length && now > introAt && Math.abs(fold - target) < 0.001) { setTarget(intro.shift()!); introAt = now + 2200; }
    let moving = false;
    if (Math.abs(fold - target) > 0.001) {
      fold += (target - fold) * (reduce ? 1 : 1 - Math.pow(0.004, dt));
      if (Math.abs(fold - target) < 0.004) fold = target;
      setFold(fold);
      moving = true;
    }
    const camMoving = stepCamera(dt);
    const changed = controls.update();
    renderer.render(scene, camera);
    placeDims();
    if (visible && !document.hidden && (moving || camMoving || changed || controls.autoRotate || intro.length)) kick();
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });

  renderer.render(scene, camera);
  pmrem.dispose();
  requestAnimationFrame(() => root.classList.add('is-ready'));
  kick();
}
