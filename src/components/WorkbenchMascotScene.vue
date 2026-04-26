<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import * as THREE from "three";

const props = defineProps({
  progress: {
    type: Number,
    default: 0
  }
});

const canvasRef = ref(null);
let renderer = null;
let scene = null;
let camera = null;
let animationFrame = 0;
let resizeObserver = null;
let mascotGroup = null;
let orbitGroup = null;
let clock = null;

const palette = [
  { body: "#f6b6c8", accent: "#f7dc7c", gem: "#84b7d3" },
  { body: "#b9d7ef", accent: "#f0b8a8", gem: "#d7c4f2" },
  { body: "#e5be9a", accent: "#a8c59d", gem: "#f3d37a" },
  { body: "#c6dac0", accent: "#e8b7c3", gem: "#9fc7d1" },
  { body: "#d3d5df", accent: "#f0bf85", gem: "#aab7cc" }
];

function makeMaterial(color, options = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.62,
    metalness: 0,
    transmission: 0,
    clearcoat: 0.34,
    clearcoatRoughness: 0.48,
    transparent: true,
    opacity: options.opacity ?? 0.9
  });
}

function createStarShape() {
  const shape = new THREE.Shape();
  const outer = 0.55;
  const inner = 0.24;

  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }

  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelSegments: 4,
    bevelSize: 0.04,
    bevelThickness: 0.04
  });
}

function createMascot() {
  const group = new THREE.Group();
  const bodyMaterial = makeMaterial(palette[0].body, { opacity: 0.88 });
  const accentMaterial = makeMaterial(palette[0].accent, { opacity: 0.92 });
  const blushMaterial = makeMaterial("#f19aae", { opacity: 0.58 });
  const darkMaterial = makeMaterial("#2e3134", { opacity: 0.72 });
  const sparkleMaterial = makeMaterial("#ffffff", { opacity: 0.86 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), bodyMaterial);
  body.scale.set(1.22, 1, 1.05);
  body.name = "body";
  group.add(body);

  const face = new THREE.Group();
  face.position.set(0, 0.1, 0.96);

  const eyeGeometry = new THREE.SphereGeometry(0.075, 18, 12);
  const leftEye = new THREE.Mesh(eyeGeometry, darkMaterial);
  leftEye.position.set(-0.28, 0.18, 0);
  leftEye.scale.set(0.8, 1.25, 0.34);
  face.add(leftEye);

  const rightEye = leftEye.clone();
  rightEye.position.x = 0.28;
  face.add(rightEye);

  const shine = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), sparkleMaterial);
  shine.position.set(-0.3, 0.22, 0.035);
  face.add(shine);

  const shineRight = shine.clone();
  shineRight.position.x = 0.26;
  face.add(shineRight);

  const blushGeometry = new THREE.SphereGeometry(0.12, 18, 12);
  const leftBlush = new THREE.Mesh(blushGeometry, blushMaterial);
  leftBlush.position.set(-0.47, -0.03, -0.01);
  leftBlush.scale.set(1.18, 0.52, 0.2);
  face.add(leftBlush);

  const rightBlush = leftBlush.clone();
  rightBlush.position.x = 0.47;
  face.add(rightBlush);

  group.add(face);

  const footGeometry = new THREE.SphereGeometry(0.32, 24, 16);
  const leftFoot = new THREE.Mesh(footGeometry, accentMaterial);
  leftFoot.position.set(-0.52, -0.78, 0.25);
  leftFoot.scale.set(1.22, 0.5, 0.72);
  leftFoot.rotation.z = 0.24;
  group.add(leftFoot);

  const rightFoot = leftFoot.clone();
  rightFoot.position.x = 0.52;
  rightFoot.rotation.z = -0.24;
  group.add(rightFoot);

  const handGeometry = new THREE.SphereGeometry(0.23, 24, 16);
  const leftHand = new THREE.Mesh(handGeometry, bodyMaterial);
  leftHand.position.set(-1.05, -0.04, 0.18);
  leftHand.scale.set(0.66, 1, 0.7);
  leftHand.rotation.z = -0.2;
  group.add(leftHand);

  const rightHand = leftHand.clone();
  rightHand.position.x = 1.05;
  rightHand.rotation.z = 0.2;
  group.add(rightHand);

  group.scale.setScalar(1.24);
  group.position.set(-3.6, -0.05, -1.6);
  group.rotation.set(0.05, 0.5, -0.06);

  return group;
}

function createOrbitPieces() {
  const group = new THREE.Group();
  const starGeometry = createStarShape();
  const smallSphere = new THREE.SphereGeometry(0.18, 24, 16);
  const ringGeometry = new THREE.TorusGeometry(0.62, 0.025, 12, 64);

  const positions = [
    [-2.2, 1.35, -1.9, 0.72],
    [-4.7, -1.4, -2.7, 0.45],
    [3.9, 1.1, -2.9, 0.5],
    [4.7, -1.55, -2.3, 0.62],
    [-0.8, -2.25, -3.2, 0.38]
  ];

  positions.forEach(([x, y, z, scale], index) => {
    const material = makeMaterial(index % 2 ? palette[0].accent : palette[0].gem, {
      opacity: index === 1 ? 0.5 : 0.72
    });
    const geometry = index === 3 ? ringGeometry : index % 2 ? smallSphere : starGeometry;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.scale.setScalar(scale);
    mesh.rotation.set(index * 0.45, index * 0.34, index * 0.2);
    mesh.userData = {
      baseY: y,
      speed: 0.45 + index * 0.12,
      drift: 0.1 + index * 0.025
    };
    group.add(mesh);
  });

  return group;
}

function resize() {
  if (!renderer || !camera || !canvasRef.value) return;

  const rect = canvasRef.value.getBoundingClientRect();
  const width = Math.max(rect.width, 1);
  const height = Math.max(rect.height, 1);

  renderer.setSize(width, height, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function applyProgress(value) {
  if (!mascotGroup || !orbitGroup) return;

  const clamped = THREE.MathUtils.clamp(value, 0, 1);
  const section = Math.min(palette.length - 1, Math.round(clamped * (palette.length - 1)));
  const colors = palette[section];
  const x = THREE.MathUtils.lerp(-3.45, 3.25, clamped);
  const y = Math.sin(clamped * Math.PI * 2) * 0.28 - 0.04;

  mascotGroup.position.x = x;
  mascotGroup.position.y = y;
  mascotGroup.rotation.y = THREE.MathUtils.lerp(0.55, -0.55, clamped);
  mascotGroup.rotation.z = Math.sin(clamped * Math.PI * 3) * 0.08;

  mascotGroup.traverse((child) => {
    if (!child.isMesh || !child.material?.color) return;

    if (child.name === "body") {
      child.material.color.set(colors.body);
    }
  });

  orbitGroup.children.forEach((mesh, index) => {
    const color = index % 2 ? colors.accent : colors.gem;
    mesh.material.color.set(color);
    mesh.position.x += Math.sin(clamped * Math.PI * 2 + index) * 0.002;
  });
}

function render() {
  const elapsed = clock.getElapsedTime();

  if (mascotGroup) {
    mascotGroup.position.y += Math.sin(elapsed * 1.4) * 0.0012;
    mascotGroup.rotation.x = Math.sin(elapsed * 0.7) * 0.035;
  }

  if (orbitGroup) {
    orbitGroup.rotation.z = Math.sin(elapsed * 0.22) * 0.04;
    orbitGroup.children.forEach((mesh, index) => {
      mesh.position.y = mesh.userData.baseY + Math.sin(elapsed * mesh.userData.speed + index) * mesh.userData.drift;
      mesh.rotation.x += 0.003 + index * 0.0008;
      mesh.rotation.y += 0.004 + index * 0.0006;
    });
  }

  renderer.render(scene, camera);
  animationFrame = window.requestAnimationFrame(render);
}

onMounted(() => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0, 8.4);

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const ambient = new THREE.HemisphereLight("#ffffff", "#d6d4c8", 2.2);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight("#fff7ed", 2.7);
  keyLight.position.set(2.6, 3.1, 4.5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight("#b8d4f0", 1.2);
  fillLight.position.set(-3, 1.2, 3);
  scene.add(fillLight);

  mascotGroup = createMascot();
  orbitGroup = createOrbitPieces();
  scene.add(mascotGroup);
  scene.add(orbitGroup);

  clock = new THREE.Clock();
  resize();
  applyProgress(props.progress);
  render();

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvasRef.value);
  window.addEventListener("resize", resize);
});

watch(
  () => props.progress,
  (value) => applyProgress(value)
);

onBeforeUnmount(() => {
  window.cancelAnimationFrame(animationFrame);
  window.removeEventListener("resize", resize);
  resizeObserver?.disconnect();

  scene?.traverse((child) => {
    if (!child.isMesh) return;
    child.geometry?.dispose();

    if (Array.isArray(child.material)) {
      child.material.forEach((material) => material.dispose());
    } else {
      child.material?.dispose();
    }
  });

  renderer?.dispose();
});
</script>

<template>
  <canvas ref="canvasRef" class="mascot-scene" aria-hidden="true" />
</template>

<style scoped>
.mascot-scene {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
