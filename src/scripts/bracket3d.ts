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

  const box = new THREE.Box3();
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();

  function setFold(theta: number) {
    bendGroup.children.forEach((c) => {
      const o = c as THREE.Mesh;
      o.geometry.dispose();
    });
    bendGroup.clear();
    const b = bend(theta);
    addMesh(b.geo, bendGroup);
    flange.position.set(b.ox, b.oy, 0);
    flange.rotation.z = -theta;
    bendLineMat.opacity = Math.max(0, 1 - theta / (Math.PI / 4)) * 0.9;

    // Centrér emnet over jorden
    part.position.set(0, 0, 0);
    box.setFromObject(part);
    box.getCenter(center);
    box.getSize(size);
    part.position.set(-center.x, -box.min.y, -center.z);
    ground.position.y = -0.01;
    controls.target.set(0, size.y * 0.4, 0);
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
  };
  new ResizeObserver(resize).observe(stage);
  resize();

  // Fold-animation
  let fold = 1; // 1 = bukket, 0 = udfoldet
  let target = 1;
  let auto = !reduce;
  let lastSwitch = performance.now();
  const buttons = root.querySelectorAll<HTMLButtonElement>('[data-fold]');
  const setTarget = (t: number) => {
    target = t;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.fold) === t)));
  };
  buttons.forEach((b) => b.addEventListener('click', () => { auto = false; setTarget(Number(b.dataset.fold)); }));
  const stopAuto = () => { auto = false; controls.autoRotate = false; root.classList.add('is-touched'); };
  canvas.addEventListener('pointerdown', stopAuto, { once: true });

  // Kantfarve følger temaet
  new MutationObserver(() => edgeMat.color.copy(cssColor('--c-ink', '#0e0e10')))
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  setFold(Math.PI / 2);

  // Render kun når modellen er synlig og fanen er aktiv
  let visible = true;
  new IntersectionObserver((es) => { visible = es.some((e) => e.isIntersecting); if (visible) loop(); }).observe(root);
  let raf = 0;
  let prev = performance.now();
  function loop() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame((now) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      if (auto && now - lastSwitch > 3800) { setTarget(target ? 0 : 1); lastSwitch = now; }
      if (Math.abs(fold - target) > 0.001) {
        const k = reduce ? 1 : 1 - Math.pow(0.002, dt); // blød easing
        fold += (target - fold) * k;
        if (Math.abs(fold - target) < 0.002) fold = target;
        setFold(fold * (Math.PI / 2));
      }
      controls.update();
      renderer.render(scene, camera);
      if (visible && !document.hidden) loop();
    });
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && visible) loop(); });

  renderer.render(scene, camera);
  requestAnimationFrame(() => root.classList.add('is-ready'));
  loop();
}
