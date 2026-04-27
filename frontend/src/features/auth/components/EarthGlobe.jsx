import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const GLOBE_RADIUS = 1;
const NUM_CONNS = 42;
const TOTAL_ARC_PTS = 100;
const ROTATION_SPD = 0.0007;
const TEX = 'https://unpkg.com/three-globe/example/img';

function latLonToVec3(lat, lon, r = GLOBE_RADIUS) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(-Math.sin(phi) * Math.cos(theta) * r, Math.cos(phi) * r, Math.sin(phi) * Math.sin(theta) * r);
}

function randomSurfacePoint(r = GLOBE_RADIUS + 0.012) {
  return latLonToVec3((Math.random() - 0.5) * 150, (Math.random() - 0.5) * 360, r);
}

function buildStars(scene) {
  const count = 7000, positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 120 + Math.random() * 80, phi = Math.acos(2 * Math.random() - 1), theta = Math.random() * Math.PI * 2;
    positions[i*3] = r*Math.sin(phi)*Math.cos(theta); positions[i*3+1] = r*Math.sin(phi)*Math.sin(theta); positions[i*3+2] = r*Math.cos(phi);
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.22, transparent: true, opacity: 0.9, sizeAttenuation: true });
  scene.add(new THREE.Points(geo, mat)); return [geo, mat];
}

function buildGlobe() {
  const group = new THREE.Group(), loader = new THREE.TextureLoader();
  const earthMat = new THREE.MeshPhongMaterial({
    map: loader.load(`${TEX}/earth-blue-marble.jpg`),
    bumpMap: loader.load(`${TEX}/earth-topology.png`), bumpScale: 0.006,
    specularMap: loader.load(`${TEX}/earth-water.png`), specular: new THREE.Color(0x2a5a7a), shininess: 18,
  });
  group.add(new THREE.Mesh(new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64), earthMat));

  const cloudMat = new THREE.MeshPhongMaterial({ map: loader.load(`${TEX}/earth-clouds.png`), transparent: true, opacity: 0.38, depthWrite: false });
  const cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_RADIUS * 1.006, 64, 64), cloudMat);
  group.add(cloudMesh);

  group.add(new THREE.Mesh(new THREE.SphereGeometry(GLOBE_RADIUS * 1.015, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0x3399ff, transparent: true, opacity: 0.055, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false })));

  const gridMat = new THREE.LineBasicMaterial({ color: 0x4499bb, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false });
  for (let lat = -80; lat <= 80; lat += 20) {
    const pts = []; for (let i = 0; i <= 80; i++) pts.push(latLonToVec3(lat, (i/80)*360-180, GLOBE_RADIUS+0.014));
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
  }
  for (let lon = 0; lon < 360; lon += 20) {
    const pts = []; for (let i = 0; i <= 80; i++) pts.push(latLonToVec3((i/80)*180-90, lon, GLOBE_RADIUS+0.014));
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
  }
  return { group, cloudMesh };
}

function buildArcs(earthGroup) {
  const dotGeo = new THREE.SphereGeometry(0.013, 8, 8), haloGeo = new THREE.SphereGeometry(0.026, 8, 8);
  const palette = [0x00ffff, 0x00ffff, 0x00ffff, 0x22ddff, 0x00ffff, 0x44aaff, 0xffffff];
  const arcs = [];
  for (let i = 0; i < NUM_CONNS; i++) {
    const start = randomSurfacePoint(), end = randomSurfacePoint();
    const apex = start.clone().lerp(end, 0.5).multiplyScalar(1.25 + Math.random() * 0.35);
    const curve = new THREE.QuadraticBezierCurve3(start, apex, end);
    const positions = new Float32Array(TOTAL_ARC_PTS * 3);
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); geometry.setDrawRange(0, 0);
    const color = palette[Math.floor(Math.random() * palette.length)];
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    earthGroup.add(new THREE.Line(geometry, material));
    const dotMats = [], haloMats = [], dots = [], halos = [];
    [start, end].forEach(pos => {
      const dm = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
      const hm = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false });
      const dot = new THREE.Mesh(dotGeo, dm), halo = new THREE.Mesh(haloGeo, hm);
      dot.position.copy(pos); halo.position.copy(pos); earthGroup.add(dot, halo);
      dotMats.push(dm); haloMats.push(hm); dots.push(dot); halos.push(halo);
    });
    arcs.push({ allPoints: curve.getPoints(TOTAL_ARC_PTS), geometry, material, progress: Math.random(), speed: 0.002+Math.random()*0.007, trailLen: 12+Math.floor(Math.random()*22), dotMats, haloMats, dots, halos });
  }
  return arcs;
}

function rerandomiseArc(arc) {
  const start = randomSurfacePoint(), end = randomSurfacePoint();
  const apex = start.clone().lerp(end, 0.5).multiplyScalar(1.25 + Math.random() * 0.35);
  arc.allPoints = new THREE.QuadraticBezierCurve3(start, apex, end).getPoints(TOTAL_ARC_PTS);
  arc.speed = 0.002+Math.random()*0.007; arc.trailLen = 12+Math.floor(Math.random()*22);
  arc.dots[0].position.copy(start); arc.dots[1].position.copy(end);
  arc.halos[0].position.copy(start); arc.halos[1].position.copy(end);
}

function tickArcs(arcs, time) {
  arcs.forEach((arc, i) => {
    arc.progress += arc.speed;
    if (arc.progress > 1.25) { arc.progress = 0; rerandomiseArc(arc); }
    const raw = arc.progress, clamped = Math.min(raw, 1);
    const endIdx = Math.floor(clamped * arc.allPoints.length), startIdx = Math.max(0, endIdx - arc.trailLen), count = endIdx - startIdx;
    if (count > 1) {
      const attr = arc.geometry.attributes.position;
      for (let j = 0; j < count; j++) { const p = arc.allPoints[startIdx+j]; attr.setXYZ(j, p.x, p.y, p.z); }
      attr.needsUpdate = true; arc.geometry.setDrawRange(0, count);
    } else arc.geometry.setDrawRange(0, 0);
    const fadeIn = Math.min(clamped/0.08, 1), fadeOut = raw > 1 ? Math.max(0, 1-(raw-1)/0.25) : 1;
    arc.material.opacity = fadeIn * fadeOut * 0.9;
    const pulse = (Math.sin(time*1.8+i*0.73)+1)*0.5;
    arc.dotMats.forEach(m => { m.opacity = 0.5+pulse*0.5; });
    arc.haloMats.forEach(m => { m.opacity = 0.25*(1-pulse); });
    arc.halos.forEach(h => { h.scale.setScalar(1+pulse*1.8); });
  });
}

export function EarthGlobe() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current; if (!mount) return;
    const w = mount.clientWidth || window.innerWidth, h = mount.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x010b16, 1);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x010b16);
    const camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 500); camera.position.set(0, 0.4, 3.2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false; controls.minDistance = 1.9; controls.maxDistance = 7;
    controls.enableDamping = true; controls.dampingFactor = 0.06;

    const sunLight = new THREE.DirectionalLight(0xfff4e0, 2.2); sunLight.position.set(5, 3, 5); scene.add(sunLight);
    scene.add(new THREE.AmbientLight(0x112244, 0.55));

    const [starGeo, starMat] = buildStars(scene);
    const outerAtmosMat = new THREE.MeshBasicMaterial({ color: 0x1166cc, transparent: true, opacity: 0.06, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false });
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(GLOBE_RADIUS * 1.18, 64, 64), outerAtmosMat));

    const { group: earthGroup, cloudMesh } = buildGlobe();
    scene.add(earthGroup);
    const arcs = buildArcs(earthGroup);

    let animId; const t0 = performance.now();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = (performance.now() - t0) / 1000;
      earthGroup.rotation.y += ROTATION_SPD;
      cloudMesh.rotation.y += ROTATION_SPD * 0.13;
      tickArcs(arcs, time); controls.update(); renderer.render(scene, camera);
    };
    animate();

    const onResize = () => { const nw=mount.clientWidth,nh=mount.clientHeight; if(!nw||!nh)return; camera.aspect=nw/nh; camera.updateProjectionMatrix(); renderer.setSize(nw,nh); };
    const ro = new ResizeObserver(onResize); ro.observe(mount);

    return () => {
      cancelAnimationFrame(animId); ro.disconnect(); controls.dispose();
      arcs.forEach(a => { a.geometry.dispose(); a.material.dispose(); a.dotMats.forEach(m=>m.dispose()); a.haloMats.forEach(m=>m.dispose()); });
      starGeo.dispose(); starMat.dispose(); outerAtmosMat.dispose(); renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}
