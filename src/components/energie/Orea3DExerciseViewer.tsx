import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Compass
} from 'lucide-react';

interface Orea3DExerciseViewerProps {
  exerciseType: 'squat' | 'pompes' | 'fentes' | 'planche' | 'crunch' | 'jumping-jacks' | 'mountain-climbers' | 'dips' | 'superman' | 'mollets';
  exerciseName: string;
  className?: string;
  autoPlay?: boolean;
}

interface CameraPreset {
  pos: [number, number, number];
  target: [number, number, number];
  fov: number;
}

// Exercise-specific intelligent cameras
// Designed so the full body is centered, large, clearly framed, and never cut off
const EXERCISE_CAMERAS: Record<string, CameraPreset> = {
  'pompes': { pos: [1.35, 0.12, 1.45], target: [0, -0.3, 0], fov: 42 },
  'squat': { pos: [1.15, 0.15, 2.1], target: [0, -0.05, 0], fov: 40 },
  'fentes': { pos: [1.65, 0.15, 1.7], target: [0, -0.1, 0], fov: 40 },
  'planche': { pos: [1.3, -0.05, 1.35], target: [0, -0.28, 0], fov: 42 },
  'crunch': { pos: [1.2, 0.12, 1.45], target: [0, -0.15, 0], fov: 42 },
  'dips': { pos: [1.3, 0.1, 1.7], target: [0, -0.1, 0], fov: 40 },
  'superman': { pos: [1.3, -0.05, 1.35], target: [0, -0.25, 0], fov: 42 },
  'jumping-jacks': { pos: [0, 0.1, 2.25], target: [0, 0.05, 0], fov: 42 },
  'mountain-climbers': { pos: [1.4, 0.05, 1.45], target: [0, -0.25, 0], fov: 42 },
  'mollets': { pos: [0.75, -0.2, 1.8], target: [0, -0.35, 0], fov: 38 },
};

export const Orea3DExerciseViewer: React.FC<Orea3DExerciseViewerProps> = ({
  exerciseType,
  exerciseName,
  className = '',
  autoPlay = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [cameraView, setCameraView] = useState<'3/4' | 'front' | 'side'>('3/4');
  const [speed, setSpeed] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);

  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);
  isPlayingRef.current = isPlaying;
  speedRef.current = speed;

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const benchRef = useRef<THREE.Group | null>(null);

  // Mannequin anatomical joint hierarchy
  const mannequinRef = useRef<{
    root: THREE.Group;
    pelvis: THREE.Group;
    torso: THREE.Mesh;
    chest: THREE.Mesh;
    headGroup: THREE.Group;
    leftUpperArm: THREE.Group;
    leftForearm: THREE.Group;
    rightUpperArm: THREE.Group;
    rightForearm: THREE.Group;
    leftThigh: THREE.Group;
    leftShin: THREE.Group;
    rightThigh: THREE.Group;
    rightShin: THREE.Group;
    leftFoot: THREE.Mesh;
    rightFoot: THREE.Mesh;
  } | null>(null);

  // Setup Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 420;

    // 1. Scene setup with deep athletic studio gradient
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a101d);

    // 2. Camera setup with tailored exercise defaults
    const preset = EXERCISE_CAMERAS[exerciseType] || { pos: [1.2, 0.2, 2.0], target: [0, 0, 0], fov: 40 };
    const camera = new THREE.PerspectiveCamera(preset.fov, width / height, 0.1, 50);
    cameraRef.current = camera;
    camera.position.set(...preset.pos);
    camera.lookAt(new THREE.Vector3(...preset.target));

    // 3. Renderer with antialiasing and soft shadow map
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting - Athletic Studio Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Main key light
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 1.8);
    keyLight.position.set(2.5, 4.5, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 10;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Cyan athletic rim light
    const rimLight = new THREE.DirectionalLight(0x00d2ff, 1.4);
    rimLight.position.set(-3.0, 2.5, -2.5);
    scene.add(rimLight);

    // Warm amber fill light
    const fillLight = new THREE.PointLight(0xf97316, 1.2, 8);
    fillLight.position.set(0, -0.2, 2.2);
    scene.add(fillLight);

    // 5. Studio Floor: Soft dark disc with subtle ring & contact shadow instead of giant grid
    const floorGeo = new THREE.CircleGeometry(2.4, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.8,
      metalness: 0.1,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -0.78;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Subtle amber ring perimeter
    const ringGeo = new THREE.RingGeometry(2.35, 2.39, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -0.77;
    scene.add(ringMesh);

    // Contact shadow disc under mannequin
    const shadowGeo = new THREE.CircleGeometry(0.9, 32);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x020617, transparent: true, opacity: 0.6 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.775;
    scene.add(shadowMesh);

    // Optional bench for dips exercise
    const benchGroup = new THREE.Group();
    const benchTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.08, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
    );
    benchTop.position.set(0, -0.3, -0.32);
    benchGroup.add(benchTop);
    const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4), new THREE.MeshStandardMaterial({ color: 0x475569 }));
    leg1.position.set(-0.3, -0.54, -0.32);
    const leg2 = leg1.clone();
    leg2.position.set(0.3, -0.54, -0.32);
    benchGroup.add(leg1);
    benchGroup.add(leg2);
    benchGroup.visible = exerciseType === 'dips';
    benchRef.current = benchGroup;
    scene.add(benchGroup);

    // 6. Build High Quality Anatomical Athletic Mannequin
    const jointMaterial = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      metalness: 0.5,
      roughness: 0.25,
      emissive: 0xe05600,
      emissiveIntensity: 0.2,
    });

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.35,
      roughness: 0.4,
    });

    const chestMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.45,
      roughness: 0.35,
    });

    const skinAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.2,
      roughness: 0.3,
    });

    const root = new THREE.Group();
    root.position.y = 0;
    scene.add(root);

    // Pelvis & Abdomen
    const pelvis = new THREE.Group();
    pelvis.position.y = 0;
    root.add(pelvis);

    const pelvisMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.18, 0.18, 16), jointMaterial);
    pelvisMesh.castShadow = true;
    pelvis.add(pelvisMesh);

    // Torso / Core
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.2, 0.38, 16), bodyMaterial);
    torso.position.y = 0.26;
    torso.castShadow = true;
    pelvis.add(torso);

    // Muscular Chest / Pectorals
    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.26, 0.25), chestMaterial);
    chest.position.y = 0.48;
    chest.castShadow = true;
    pelvis.add(chest);

    // Neck & Head
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.1, 14), skinAccentMaterial);
    neck.position.y = 0.65;
    pelvis.add(neck);

    const headGroup = new THREE.Group();
    headGroup.position.y = 0.8;
    pelvis.add(headGroup);

    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.145, 20, 20), bodyMaterial);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Sleek Cyan Visor
    const visorGeo = new THREE.BoxGeometry(0.2, 0.065, 0.1);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00e1ff,
      emissiveIntensity: 0.6,
      roughness: 0.1,
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.02, 0.11);
    headGroup.add(visor);

    // --- LEFT ARM ---
    const leftUpperArm = new THREE.Group();
    leftUpperArm.position.set(0.31, 0.54, 0);
    pelvis.add(leftUpperArm);

    const leftShoulderJoint = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 14), jointMaterial);
    leftUpperArm.add(leftShoulderJoint);

    const leftUpperArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.3, 14), bodyMaterial);
    leftUpperArmMesh.position.y = -0.15;
    leftUpperArmMesh.castShadow = true;
    leftUpperArm.add(leftUpperArmMesh);

    const leftForearm = new THREE.Group();
    leftForearm.position.y = -0.3;
    leftUpperArm.add(leftForearm);

    const leftElbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 14), jointMaterial);
    leftForearm.add(leftElbowJoint);

    const leftForearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.048, 0.28, 14), skinAccentMaterial);
    leftForearmMesh.position.y = -0.14;
    leftForearmMesh.castShadow = true;
    leftForearm.add(leftForearmMesh);

    // Left hand
    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), jointMaterial);
    leftHand.position.y = -0.29;
    leftForearm.add(leftHand);

    // --- RIGHT ARM ---
    const rightUpperArm = new THREE.Group();
    rightUpperArm.position.set(-0.31, 0.54, 0);
    pelvis.add(rightUpperArm);

    const rightShoulderJoint = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 14), jointMaterial);
    rightUpperArm.add(rightShoulderJoint);

    const rightUpperArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.3, 14), bodyMaterial);
    rightUpperArmMesh.position.y = -0.15;
    rightUpperArmMesh.castShadow = true;
    rightUpperArm.add(rightUpperArmMesh);

    const rightForearm = new THREE.Group();
    rightForearm.position.y = -0.3;
    rightUpperArm.add(rightForearm);

    const rightElbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 14), jointMaterial);
    rightForearm.add(rightElbowJoint);

    const rightForearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.048, 0.28, 14), skinAccentMaterial);
    rightForearmMesh.position.y = -0.14;
    rightForearmMesh.castShadow = true;
    rightForearm.add(rightForearmMesh);

    // Right hand
    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), jointMaterial);
    rightHand.position.y = -0.29;
    rightForearm.add(rightHand);

    // --- LEFT LEG ---
    const leftThigh = new THREE.Group();
    leftThigh.position.set(0.14, -0.09, 0);
    pelvis.add(leftThigh);

    const leftHipJoint = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 14), jointMaterial);
    leftThigh.add(leftHipJoint);

    const leftThighMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.4, 14), bodyMaterial);
    leftThighMesh.position.y = -0.2;
    leftThighMesh.castShadow = true;
    leftThigh.add(leftThighMesh);

    const leftShin = new THREE.Group();
    leftShin.position.y = -0.4;
    leftThigh.add(leftShin);

    const leftKneeJoint = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 14), jointMaterial);
    leftShin.add(leftKneeJoint);

    const leftShinMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.38, 14), skinAccentMaterial);
    leftShinMesh.position.y = -0.19;
    leftShinMesh.castShadow = true;
    leftShin.add(leftShinMesh);

    const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.2), jointMaterial);
    leftFoot.position.set(0, -0.4, 0.05);
    leftFoot.castShadow = true;
    leftShin.add(leftFoot);

    // --- RIGHT LEG ---
    const rightThigh = new THREE.Group();
    rightThigh.position.set(-0.14, -0.09, 0);
    pelvis.add(rightThigh);

    const rightHipJoint = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 14), jointMaterial);
    rightThigh.add(rightHipJoint);

    const rightThighMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.4, 14), bodyMaterial);
    rightThighMesh.position.y = -0.2;
    rightThighMesh.castShadow = true;
    rightThigh.add(rightThighMesh);

    const rightShin = new THREE.Group();
    rightShin.position.y = -0.4;
    rightThigh.add(rightShin);

    const rightKneeJoint = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 14), jointMaterial);
    rightShin.add(rightKneeJoint);

    const rightShinMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.38, 14), skinAccentMaterial);
    rightShinMesh.position.y = -0.19;
    rightShinMesh.castShadow = true;
    rightShin.add(rightShinMesh);

    const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.2), jointMaterial);
    rightFoot.position.set(0, -0.4, 0.05);
    rightFoot.castShadow = true;
    rightShin.add(rightFoot);

    mannequinRef.current = {
      root,
      pelvis,
      torso,
      chest,
      headGroup,
      leftUpperArm,
      leftForearm,
      rightUpperArm,
      rightForearm,
      leftThigh,
      leftShin,
      rightThigh,
      rightShin,
      leftFoot,
      rightFoot,
    };

    // 7. Fluid Interaction: Mouse / Touch Orbit Drag (Smooth rotation around mannequin)
    let isDragging = false;
    let previousPos = { x: 0, y: 0 };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousPos = { x, y };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !mannequinRef.current) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = x - previousPos.x;
      const dy = y - previousPos.y;

      mannequinRef.current.root.rotation.y += dx * 0.012;
      mannequinRef.current.root.rotation.x = Math.max(-0.4, Math.min(0.4, mannequinRef.current.root.rotation.x + dy * 0.008));
      previousPos = { x, y };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    dom.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // Zoom on wheel (clamped so mannequin never clips or gets lost)
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.z = Math.max(1.4, Math.min(3.6, cameraRef.current.position.z + e.deltaY * 0.002));
    };
    dom.addEventListener('wheel', handleWheel, { passive: false });

    // 8. Animation Loop with Exact Articulation for Each Movement
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlayingRef.current) {
        timeRef.current += dt * speedRef.current * 2.4;
      }

      const t = timeRef.current;
      const cycle = (Math.sin(t) + 1) / 2; // 0 (start) to 1 (peak contraction)
      setProgress(Math.round(cycle * 100));

      const m = mannequinRef.current;
      if (m) {
        switch (exerciseType) {
          case 'squat': {
            m.root.position.set(0, 0, 0);
            m.pelvis.position.y = -cycle * 0.48;
            m.leftThigh.rotation.x = -cycle * 1.55;
            m.rightThigh.rotation.x = -cycle * 1.55;
            m.leftShin.rotation.x = cycle * 1.6;
            m.rightShin.rotation.x = cycle * 1.6;
            m.pelvis.rotation.x = cycle * 0.35;
            m.leftUpperArm.rotation.x = -cycle * 1.45;
            m.rightUpperArm.rotation.x = -cycle * 1.45;
            m.leftForearm.rotation.x = -cycle * 0.2;
            m.rightForearm.rotation.x = -cycle * 0.2;
            break;
          }

          case 'pompes': {
            // Pushups: full horizontal position
            m.root.position.set(0, -0.32, 0);
            m.root.rotation.x = Math.PI / 2 - 0.1;
            m.pelvis.position.y = 0;
            m.pelvis.rotation.x = 0;

            // Chest dips towards floor
            const pushupDip = cycle * 0.26;
            m.root.position.y = -0.32 - pushupDip;

            // Elbows bend back at 45 degrees
            m.leftUpperArm.rotation.z = Math.PI / 3 - cycle * 0.45;
            m.rightUpperArm.rotation.z = -Math.PI / 3 + cycle * 0.45;
            m.leftForearm.rotation.x = cycle * 1.3;
            m.rightForearm.rotation.x = cycle * 1.3;

            m.leftThigh.rotation.x = 0.05;
            m.rightThigh.rotation.x = 0.05;
            m.leftShin.rotation.x = 0;
            m.rightShin.rotation.x = 0;
            break;
          }

          case 'fentes': {
            m.root.position.set(0, 0, 0);
            m.pelvis.position.y = -cycle * 0.38;
            m.leftThigh.position.z = cycle * 0.32;
            m.leftThigh.rotation.x = -cycle * 1.45;
            m.leftShin.rotation.x = cycle * 1.5;

            m.rightThigh.position.z = -cycle * 0.25;
            m.rightThigh.rotation.x = cycle * 0.6;
            m.rightShin.rotation.x = cycle * 1.45;

            m.leftUpperArm.rotation.x = cycle * 0.5;
            m.rightUpperArm.rotation.x = -cycle * 0.5;
            break;
          }

          case 'planche': {
            // Isometric horizontal hold with subtle rhythmic breathing
            m.root.position.set(0, -0.34, 0);
            m.root.rotation.x = Math.PI / 2 - 0.08;
            const corePulse = Math.sin(t * 1.2) * 0.015;
            m.root.position.y = -0.34 + corePulse;
            m.leftUpperArm.rotation.x = -Math.PI / 2;
            m.rightUpperArm.rotation.x = -Math.PI / 2;
            m.leftForearm.rotation.x = 0;
            m.rightForearm.rotation.x = 0;
            m.leftThigh.rotation.x = 0;
            m.rightThigh.rotation.x = 0;
            break;
          }

          case 'crunch': {
            // Supine position on back
            m.root.position.set(0, -0.36, 0);
            m.root.rotation.x = -Math.PI / 2;
            // Knees bent up
            m.leftThigh.rotation.x = 1.35;
            m.rightThigh.rotation.x = 1.35;
            m.leftShin.rotation.x = -1.45;
            m.rightShin.rotation.x = -1.45;

            // Torso flexes towards knees
            m.pelvis.rotation.x = -cycle * 0.45;
            m.headGroup.rotation.x = cycle * 0.35;
            m.leftUpperArm.rotation.x = -1.2;
            m.rightUpperArm.rotation.x = -1.2;
            m.leftForearm.rotation.x = -1.2;
            m.rightForearm.rotation.x = -1.2;
            break;
          }

          case 'jumping-jacks': {
            m.root.position.set(0, 0, 0);
            const hop = Math.sin(t) * 0.1;
            m.root.position.y = Math.max(0, hop);
            // Arms open overhead
            m.leftUpperArm.rotation.z = cycle * 2.5;
            m.rightUpperArm.rotation.z = -cycle * 2.5;
            // Legs jump wide
            m.leftThigh.rotation.z = cycle * 0.55;
            m.rightThigh.rotation.z = -cycle * 0.55;
            break;
          }

          case 'dips': {
            // Triceps dips
            m.root.position.set(0, -0.15, -0.05);
            m.pelvis.position.y = -cycle * 0.32;
            m.leftUpperArm.rotation.x = 0.5 + cycle * 0.7;
            m.rightUpperArm.rotation.x = 0.5 + cycle * 0.7;
            m.leftForearm.rotation.x = -cycle * 1.2;
            m.rightForearm.rotation.x = -cycle * 1.2;
            m.leftThigh.rotation.x = -1.1;
            m.rightThigh.rotation.x = -1.1;
            m.leftShin.rotation.x = 1.1;
            m.rightShin.rotation.x = 1.1;
            break;
          }

          case 'mountain-climbers': {
            m.root.position.set(0, -0.32, 0);
            m.root.rotation.x = Math.PI / 2 - 0.2;
            const legPhase = Math.sin(t * 1.8);
            if (legPhase > 0) {
              m.leftThigh.rotation.x = -legPhase * 1.4;
              m.leftShin.rotation.x = legPhase * 1.2;
              m.rightThigh.rotation.x = 0;
              m.rightShin.rotation.x = 0;
            } else {
              m.rightThigh.rotation.x = legPhase * 1.4;
              m.rightShin.rotation.x = -legPhase * 1.2;
              m.leftThigh.rotation.x = 0;
              m.leftShin.rotation.x = 0;
            }
            break;
          }

          case 'superman': {
            m.root.position.set(0, -0.38, 0);
            m.root.rotation.x = Math.PI / 2;
            m.pelvis.rotation.x = -cycle * 0.28;
            m.leftUpperArm.rotation.x = -Math.PI + cycle * 0.35;
            m.rightUpperArm.rotation.x = -Math.PI + cycle * 0.35;
            m.leftThigh.rotation.x = cycle * 0.35;
            m.rightThigh.rotation.x = cycle * 0.35;
            break;
          }

          case 'mollets': {
            m.root.position.set(0, 0, 0);
            const heelRise = cycle * 0.18;
            m.root.position.y = heelRise;
            m.leftFoot.rotation.x = -cycle * 0.65;
            m.rightFoot.rotation.x = -cycle * 0.65;
            m.leftThigh.rotation.x = 0;
            m.rightThigh.rotation.x = 0;
            m.leftShin.rotation.x = 0;
            m.rightShin.rotation.x = 0;
            break;
          }
        }
      }

      renderer.render(scene, camera);
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    // Responsive resize handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      dom.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      dom.removeEventListener('wheel', handleWheel);
      renderer.dispose();
      scene.clear();
    };
  }, [exerciseType]);

  // Camera presets switcher
  const applyPresetView = (view: '3/4' | 'front' | 'side') => {
    setCameraView(view);
    const camera = cameraRef.current;
    if (!camera) return;

    const base = EXERCISE_CAMERAS[exerciseType] || { pos: [1.2, 0.2, 2.0], target: [0, 0, 0], fov: 40 };

    if (view === 'front') {
      camera.position.set(0, base.pos[1], base.pos[2] + 0.3);
    } else if (view === 'side') {
      camera.position.set(base.pos[0] + 0.9, base.pos[1], 0.2);
    } else {
      camera.position.set(...base.pos);
    }
    camera.lookAt(new THREE.Vector3(...base.target));
  };

  const resetAnimation = () => {
    timeRef.current = 0;
    if (mannequinRef.current) {
      mannequinRef.current.root.rotation.set(0, 0, 0);
    }
    applyPresetView('3/4');
  };

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col ${className}`}>
      {/* 3D Canvas Viewport */}
      <div
        ref={containerRef}
        className="w-full h-80 sm:h-96 md:h-[460px] cursor-grab active:cursor-grabbing relative select-none"
        title="Glissez avec la souris ou le doigt pour faire pivoter le mannequin"
      />

      {/* Discrete Top Badge & Angles Header */}
      <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-orange-400 font-extrabold text-[11px] border border-orange-500/30 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Démonstration 3D</span>
          </span>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-slate-900/75 backdrop-blur-md text-slate-300 font-semibold text-[11px] border border-slate-700/80">
            {exerciseName}
          </span>
        </div>

        {/* View Angle Presets */}
        <div className="flex items-center gap-1 bg-slate-900/85 backdrop-blur-md p-1 rounded-2xl border border-slate-700/80 pointer-events-auto shadow-md">
          {(['3/4', 'front', 'side'] as const).map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => applyPresetView(view)}
              className={`px-2.5 py-0.5 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
                cameraView === view
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {view === '3/4' ? '3/4' : view === 'front' ? 'Face' : 'Profil'}
            </button>
          ))}
        </div>
      </div>

      {/* Movement Phase Progress Bar */}
      <div className="w-full h-1 bg-slate-900">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Discrete Bottom Control Toolbar */}
      <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {/* Play / Pause */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            title={isPlaying ? 'Mettre en pause' : 'Lancer le mouvement'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span className="text-[11px]">{isPlaying ? 'Pause' : 'Jouer'}</span>
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={resetAnimation}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Recommencer l'animation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed & Rotation Hint */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-xl border border-slate-700/80">
            {[0.5, 1, 1.5].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setSpeed(spd)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                  speed === spd ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-slate-400 pl-1">
            <Compass className="w-3 h-3 text-orange-400" />
            <span>Pivoter</span>
          </span>
        </div>
      </div>
    </div>
  );
};
