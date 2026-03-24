<script setup>
import * as THREE from "three";
import { onBeforeUnmount, onMounted, ref } from "vue";

const rootRef = ref(null);

let renderer = null;
let scene = null;
let camera = null;
let resizeObserver = null;
let frameId = 0;
let cleanupEvents = null;

const particleLayers = [];
const pointer = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  targetX: 0,
  targetY: 0,
  strength: 0,
  targetStrength: 0,
  inside: false
};

function createParticleTexture(color) {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(32, 32, 3, 32, 32, 32);

  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.24, color);
  gradient.addColorStop(0.7, "rgba(255,255,255,0.18)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createLayer(config) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(config.count * 3);
  const basePositions = new Float32Array(config.count * 3);
  const velocities = new Float32Array(config.count * 3);
  const seeds = new Float32Array(config.count * 4);

  for (let index = 0; index < config.count; index += 1) {
    const i3 = index * 3;
    const i4 = index * 4;
    const x = (Math.random() - 0.5) * config.width;
    const y = (Math.random() - 0.5) * config.height;
    const z = (Math.random() - 0.5) * config.depth;

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    basePositions[i3] = x;
    basePositions[i3 + 1] = y;
    basePositions[i3 + 2] = z;

    seeds[i4] = Math.random() * Math.PI * 2;
    seeds[i4 + 1] = 0.3 + Math.random() * 1.4;
    seeds[i4 + 2] = 0.4 + Math.random() * 0.8;
    seeds[i4 + 3] = 0.6 + Math.random() * 1.2;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    map: createParticleTexture(config.color),
    color: config.tint,
    transparent: true,
    opacity: config.opacity,
    size: config.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const points = new THREE.Points(geometry, material);
  return {
    ...config,
    points,
    geometry,
    material,
    positions,
    basePositions,
    velocities,
    seeds
  };
}

function updateLayer(layer, elapsed, easedPointerX, easedPointerY, reducedMotion) {
  const positions = layer.positions;
  const basePositions = layer.basePositions;
  const velocities = layer.velocities;
  const seeds = layer.seeds;
  const amplitude = reducedMotion ? 0 : layer.amplitude;
  const influenceRadius = layer.influenceRadius;
  const pointerStrength = layer.pointerStrength * pointer.strength;

  for (let index = 0; index < layer.count; index += 1) {
    const i3 = index * 3;
    const i4 = index * 4;

    const baseX = basePositions[i3];
    const baseY = basePositions[i3 + 1];
    const baseZ = basePositions[i3 + 2];

    const waveX = Math.sin(elapsed * seeds[i4 + 1] + seeds[i4]) * amplitude;
    const waveY = Math.cos(elapsed * seeds[i4 + 2] + seeds[i4]) * amplitude * 0.8;
    const waveZ = Math.sin(elapsed * seeds[i4 + 3] + seeds[i4]) * amplitude * 1.3;

    let targetX = baseX + waveX;
    let targetY = baseY + waveY;
    let targetZ = baseZ + waveZ;

    const dx = targetX - easedPointerX;
    const dy = targetY - easedPointerY;
    const distanceSq = dx * dx + dy * dy;

    if (distanceSq < influenceRadius * influenceRadius) {
      const distance = Math.sqrt(distanceSq) || 0.0001;
      const force = (1 - distance / influenceRadius) * pointerStrength;
      targetX += (dx / distance) * force;
      targetY += (dy / distance) * force * 0.68;
      targetZ += force * 0.12;
    }

    velocities[i3] =
      (velocities[i3] + (targetX - positions[i3]) * layer.spring * pointer.strength) * layer.friction;
    velocities[i3 + 1] =
      (velocities[i3 + 1] + (targetY - positions[i3 + 1]) * layer.spring * pointer.strength) * layer.friction;
    velocities[i3 + 2] =
      (velocities[i3 + 2] + (targetZ - positions[i3 + 2]) * layer.spring * pointer.strength) * layer.friction;

    velocities[i3] += (baseX + waveX - positions[i3]) * layer.spring * (1 - pointer.strength) * 0.35;
    velocities[i3 + 1] +=
      (baseY + waveY - positions[i3 + 1]) * layer.spring * (1 - pointer.strength) * 0.35;
    velocities[i3 + 2] +=
      (baseZ + waveZ - positions[i3 + 2]) * layer.spring * (1 - pointer.strength) * 0.25;

    positions[i3] += velocities[i3];
    positions[i3 + 1] += velocities[i3 + 1];
    positions[i3 + 2] += velocities[i3 + 2];
  }

  layer.geometry.attributes.position.needsUpdate = true;
  layer.points.rotation.z = Math.sin(elapsed * layer.rotationSpeed) * layer.rotationAmount;
  layer.points.rotation.x = Math.cos(elapsed * layer.rotationSpeed * 0.72) * layer.rotationAmount * 0.45;
}

function initScene() {
  const rootElement = rootRef.value;
  if (!rootElement) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clock = new THREE.Clock();

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.domElement.className = "login-cloth-scene__canvas";
  renderer.domElement.style.touchAction = "none";
  rootElement.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf6efe3, 12, 26);

  camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  const ambientLight = new THREE.HemisphereLight(0xf7f2ea, 0xaec6d8, 1.85);
  scene.add(ambientLight);

  const layerConfigs = [
    {
      count: 240,
      width: 10.5,
      height: 7.2,
      depth: 3.2,
      size: 0.16,
      opacity: 0.66,
      amplitude: 0.036,
      influenceRadius: 2.6,
      pointerStrength: 0.14,
      spring: 0.022,
      friction: 0.945,
      rotationSpeed: 0.14,
      rotationAmount: 0.024,
      color: "rgba(255, 228, 188, 0.85)",
      tint: 0xfff0d3
    },
    {
      count: 180,
      width: 8.8,
      height: 6.4,
      depth: 2.2,
      size: 0.1,
      opacity: 0.5,
      amplitude: 0.024,
      influenceRadius: 2.15,
      pointerStrength: 0.11,
      spring: 0.025,
      friction: 0.95,
      rotationSpeed: 0.19,
      rotationAmount: 0.022,
      color: "rgba(190, 231, 255, 0.9)",
      tint: 0xd6f1ff
    },
    {
      count: 120,
      width: 7.4,
      height: 5.2,
      depth: 1.5,
      size: 0.07,
      opacity: 0.34,
      amplitude: 0.016,
      influenceRadius: 1.8,
      pointerStrength: 0.08,
      spring: 0.028,
      friction: 0.952,
      rotationSpeed: 0.24,
      rotationAmount: 0.018,
      color: "rgba(255, 255, 255, 0.92)",
      tint: 0xffffff
    }
  ];

  layerConfigs.forEach((config, index) => {
    const layer = createLayer(config);
    layer.points.position.z = -index * 0.65;
    particleLayers.push(layer);
    scene.add(layer.points);
  });

  function syncSize() {
    if (!rootRef.value || !renderer || !camera) {
      return;
    }

    const { clientWidth, clientHeight } = rootRef.value;
    if (!clientWidth || !clientHeight) {
      return;
    }

    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  }

  function updatePointerPosition(event) {
    const bounds = renderer.domElement.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    const y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

    pointer.targetX = x * 4.2;
    pointer.targetY = y * 2.8;
    pointer.inside = true;
    pointer.targetStrength = 1;
  }

  function onPointerMove(event) {
    updatePointerPosition(event);
  }

  function onPointerEnter(event) {
    updatePointerPosition(event);
  }

  function onPointerLeave() {
    pointer.inside = false;
    pointer.targetX = 0;
    pointer.targetY = 0;
    pointer.targetStrength = 0;
  }

  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("pointerenter", onPointerEnter);
  renderer.domElement.addEventListener("pointerleave", onPointerLeave);

  cleanupEvents = () => {
    renderer?.domElement?.removeEventListener("pointermove", onPointerMove);
    renderer?.domElement?.removeEventListener("pointerenter", onPointerEnter);
    renderer?.domElement?.removeEventListener("pointerleave", onPointerLeave);
  };

  resizeObserver = new ResizeObserver(syncSize);
  resizeObserver.observe(rootElement);
  syncSize();

  function animate() {
    frameId = window.requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 1 / 24);
    const elapsed = clock.elapsedTime;
    const reducedMotion = prefersReducedMotion.matches;
    const pointerSpring = 1 - Math.exp(-delta * 4.2);
    const pointerDamping = Math.exp(-delta * 7.2);
    const pointerStrengthFollow = 1 - Math.exp(-delta * 4.8);
    const cameraFollow = 1 - Math.exp(-delta * 3.1);

    pointer.vx += (pointer.targetX - pointer.x) * pointerSpring;
    pointer.vy += (pointer.targetY - pointer.y) * pointerSpring;
    pointer.vx *= pointerDamping;
    pointer.vy *= pointerDamping;
    pointer.x += pointer.vx * delta * 60;
    pointer.y += pointer.vy * delta * 60;
    pointer.strength += (pointer.targetStrength - pointer.strength) * pointerStrengthFollow;

    particleLayers.forEach((layer) => updateLayer(layer, elapsed, pointer.x, pointer.y, reducedMotion));

    camera.position.x += ((pointer.x * 0.038) - camera.position.x) * cameraFollow;
    camera.position.y += ((pointer.y * 0.024) - camera.position.y) * cameraFollow;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();
}

function disposeScene() {
  window.cancelAnimationFrame(frameId);
  cleanupEvents?.();
  resizeObserver?.disconnect();

  particleLayers.forEach((layer) => {
    layer.geometry.dispose();
    layer.material.map?.dispose?.();
    layer.material.dispose();
  });
  particleLayers.length = 0;

  scene?.traverse((item) => {
    item.geometry?.dispose?.();
    if (item.material && !Array.isArray(item.material)) {
      item.material.dispose?.();
    }
  });

  renderer?.dispose();
  renderer?.domElement?.remove();

  renderer = null;
  scene = null;
  camera = null;
  resizeObserver = null;
  cleanupEvents = null;
  pointer.x = 0;
  pointer.y = 0;
  pointer.vx = 0;
  pointer.vy = 0;
  pointer.targetX = 0;
  pointer.targetY = 0;
  pointer.strength = 0;
  pointer.targetStrength = 0;
  pointer.inside = false;
}

onMounted(() => {
  try {
    initScene();
  } catch (error) {
    console.error("[LoginClothScene]", error);
  }
});

onBeforeUnmount(() => {
  disposeScene();
});
</script>

<template>
  <div ref="rootRef" class="login-cloth-scene" aria-hidden="true" />
</template>

<style scoped>
.login-cloth-scene {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: transparent;
}

:deep(.login-cloth-scene__canvas) {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
