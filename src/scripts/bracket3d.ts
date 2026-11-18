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

  const addMesh = (geo: THREE.BufferGeometry, parent: THREE.Object3D) => {
    const m = new THREE.Mesh(geo, steel);
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
  }

  // Kamera og kontrol
  const controls = new OrbitControls(camera, canvas);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = !reduce;
  controls.autoRotateSpeed = 0.7;
  controls.minPolarAngle = 0.35;
  controls.maxPolarAngle = 1.35;
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
  const setTarget = (t: number) => {
    target = t;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.fold) === t)));
    kick();
  };
  buttons.forEach((b) => b.addEventListener('click', () => { intro.length = 0; setTarget(Number(b.dataset.fold)); }));
  canvas.addEventListener('pointerdown', () => { intro.length = 0; controls.autoRotate = false; root.classList.add('is-touched'); }, { once: true });
  window.setTimeout(() => { controls.autoRotate = false; }, 9000); // drej kun i starten

  // Kantfarve følger temaet
  new MutationObserver(() => { edgeMat.color.copy(cssColor('--c-ink', '#0e0e10')); kick(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  setFold(1);

  // Tegn kun når noget ændrer sig (sparer CPU/batteri)
  let visible = true;
  let raf = 0;
  let prev = performance.now();
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
    const changed = controls.update();
    renderer.render(scene, camera);
    if (visible && !document.hidden && (moving || changed || controls.autoRotate || intro.length)) kick();
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });

  renderer.render(scene, camera);
  pmrem.dispose();
  requestAnimationFrame(() => root.classList.add('is-ready'));
  kick();
}
