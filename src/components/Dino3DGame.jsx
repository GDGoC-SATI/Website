import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ============================================================================
// MODULE 1: PROCEDURAL PBR TEXTURE & BUMP MAP GENERATOR (100% OFFLINE)
// ============================================================================
class ProceduralTextureFactory {
  static createReptileSkinTextures() {
    const size = 256;
    const diffCanvas = document.createElement('canvas');
    const bumpCanvas = document.createElement('canvas');
    diffCanvas.width = bumpCanvas.width = size;
    diffCanvas.height = bumpCanvas.height = size;

    const dCtx = diffCanvas.getContext('2d');
    const bCtx = bumpCanvas.getContext('2d');

    // Base reptile olive-moss tone
    dCtx.fillStyle = '#3f5a36';
    dCtx.fillRect(0, 0, size, size);
    bCtx.fillStyle = '#404040';
    bCtx.fillRect(0, 0, size, size);

    // Cellular Voronoi-like pebbly scales
    for (let y = 0; y < size; y += 8) {
      for (let x = 0; x < size; x += 8) {
        const jitterX = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
        const jitterY = (Math.cos(x * 39.346 + y * 11.135) * 23421.631) % 1;
        const cx = x + 4 + jitterX * 2.5;
        const cy = y + 4 + jitterY * 2.5;
        const r = 3.1 + Math.abs(jitterX) * 1.4;

        // Scale diffuse variation
        const shade = Math.floor(52 + Math.abs(jitterY) * 26);
        dCtx.fillStyle = `rgb(${shade + 6}, ${shade + 28}, ${shade - 8})`;
        dCtx.beginPath();
        dCtx.arc(cx, cy, r, 0, Math.PI * 2);
        dCtx.fill();

        // Scale bump elevation
        const bGrad = bCtx.createRadialGradient(cx - 0.8, cy - 0.8, 0.4, cx, cy, r);
        bGrad.addColorStop(0, '#ffffff');
        bGrad.addColorStop(0.75, '#909090');
        bGrad.addColorStop(1, '#1a1a1a');
        bCtx.fillStyle = bGrad;
        bCtx.beginPath();
        bCtx.arc(cx, cy, r, 0, Math.PI * 2);
        bCtx.fill();
      }
    }

    const diffuseMap = new THREE.CanvasTexture(diffCanvas);
    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    diffuseMap.wrapS = diffuseMap.wrapT = THREE.RepeatWrapping;
    bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
    diffuseMap.repeat.set(3, 3);
    bumpMap.repeat.set(3, 3);

    return { diffuseMap, bumpMap };
  }

  static createDesertSandTextures() {
    const size = 256;
    const diffCanvas = document.createElement('canvas');
    const bumpCanvas = document.createElement('canvas');
    diffCanvas.width = bumpCanvas.width = size;
    diffCanvas.height = bumpCanvas.height = size;

    const dCtx = diffCanvas.getContext('2d');
    const bCtx = bumpCanvas.getContext('2d');

    const dImg = dCtx.createImageData(size, size);
    const bImg = bCtx.createImageData(size, size);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        const wave = Math.sin((x * 0.12) + Math.sin(y * 0.05) * 3.0) * 0.5 + 0.5;
        const grain = (Math.random() - 0.5) * 22;

        const r = Math.min(255, Math.max(0, 214 + wave * 18 + grain));
        const g = Math.min(255, Math.max(0, 162 + wave * 15 + grain * 0.8));
        const b = Math.min(255, Math.max(0, 102 + wave * 10 + grain * 0.6));

        dImg.data[idx] = r;
        dImg.data[idx + 1] = g;
        dImg.data[idx + 2] = b;
        dImg.data[idx + 3] = 255;

        const bumpVal = Math.min(255, Math.max(0, Math.floor(wave * 180 + 50 + grain * 1.5)));
        bImg.data[idx] = bumpVal;
        bImg.data[idx + 1] = bumpVal;
        bImg.data[idx + 2] = bumpVal;
        bImg.data[idx + 3] = 255;
      }
    }

    dCtx.putImageData(dImg, 0, 0);
    bCtx.putImageData(bImg, 0, 0);

    const diffuseMap = new THREE.CanvasTexture(diffCanvas);
    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    diffuseMap.wrapS = diffuseMap.wrapT = THREE.RepeatWrapping;
    bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
    diffuseMap.repeat.set(8, 16);
    bumpMap.repeat.set(8, 16);

    return { diffuseMap, bumpMap };
  }

  static createCactusRibTextures() {
    const size = 128;
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = bumpCanvas.height = size;
    const bCtx = bumpCanvas.getContext('2d');

    for (let x = 0; x < size; x++) {
      const rib = Math.cos((x / size) * Math.PI * 2 * 14) * 0.5 + 0.5;
      const val = Math.floor(40 + rib * 210);
      bCtx.fillStyle = `rgb(${val},${val},${val})`;
      bCtx.fillRect(x, 0, 1, size);
    }

    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
    return { bumpMap };
  }

  static createSandstoneStrataTexture() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');

    const palette = ['#9a3412', '#b45309', '#7c2d12', '#c2410c', '#78350f', '#a16207'];
    for (let y = 0; y < size; y++) {
      const band = Math.floor((y + Math.sin(y * 0.15) * 6) / 14) % palette.length;
      ctx.fillStyle = palette[Math.abs(band)];
      ctx.fillRect(0, y, size, 1);
    }
    const img = ctx.getImageData(0, 0, size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 24;
      img.data[i] = Math.min(255, Math.max(0, img.data[i] + n));
      img.data[i + 1] = Math.min(255, Math.max(0, img.data[i + 1] + n));
      img.data[i + 2] = Math.min(255, Math.max(0, img.data[i + 2] + n));
    }
    ctx.putImageData(img, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  static createPyramidStoneTextures() {
    const size = 512;
    const diffCanvas = document.createElement('canvas');
    const bumpCanvas = document.createElement('canvas');
    diffCanvas.width = bumpCanvas.width = size;
    diffCanvas.height = bumpCanvas.height = size;
    const dCtx = diffCanvas.getContext('2d');
    const bCtx = bumpCanvas.getContext('2d');

    // Ancient desert limestone / sandstone warm palette
    dCtx.fillStyle = '#deb887';
    dCtx.fillRect(0, 0, size, size);
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, size, size);

    // Realistic horizontal ashlar masonry block coursing
    const rowHeight = 20;
    const numRows = size / rowHeight;
    for (let r = 0; r < numRows; r++) {
      const y = r * rowHeight;
      const blockWidth = 34 + ((r * 19) % 28);
      const rowTone = Math.sin(r * 0.45) * 14;

      // Dark mortar bed line
      bCtx.fillStyle = '#222222';
      bCtx.fillRect(0, y, size, 2);

      for (let x = -(r * 18 % blockWidth); x < size + blockWidth; x += blockWidth) {
        const rand = ((Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1);
        const warmVar = rand * 18;
        const red = Math.min(255, Math.max(0, 222 + warmVar + rowTone));
        const green = Math.min(255, Math.max(0, 184 + warmVar * 0.8 + rowTone * 0.7));
        const blue = Math.min(255, Math.max(0, 134 + warmVar * 0.5 + rowTone * 0.5));

        dCtx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        dCtx.fillRect(x + 1, y + 2, blockWidth - 2, rowHeight - 2);

        // Stone block surface bump with chiseled edges
        const bumpVal = Math.floor(136 + rand * 38);
        bCtx.fillStyle = `rgb(${bumpVal}, ${bumpVal}, ${bumpVal})`;
        bCtx.fillRect(x + 1, y + 2, blockWidth - 2, rowHeight - 2);

        // Vertical mortar seam
        bCtx.fillStyle = '#262626';
        bCtx.fillRect(x, y, 2, rowHeight);
      }
    }

    // Weathering grain, desert dust & wind erosion
    const dImg = dCtx.getImageData(0, 0, size, size);
    const bImg = bCtx.getImageData(0, 0, size, size);
    for (let i = 0; i < dImg.data.length; i += 4) {
      const grain = (Math.random() - 0.5) * 22;
      dImg.data[i] = Math.min(255, Math.max(0, dImg.data[i] + grain));
      dImg.data[i + 1] = Math.min(255, Math.max(0, dImg.data[i + 1] + grain * 0.85));
      dImg.data[i + 2] = Math.min(255, Math.max(0, dImg.data[i + 2] + grain * 0.65));

      bImg.data[i] = Math.min(255, Math.max(0, bImg.data[i] + grain * 1.6));
      bImg.data[i + 1] = bImg.data[i];
      bImg.data[i + 2] = bImg.data[i];
    }
    dCtx.putImageData(dImg, 0, 0);
    bCtx.putImageData(bImg, 0, 0);

    const diffuseMap = new THREE.CanvasTexture(diffCanvas);
    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    diffuseMap.wrapS = diffuseMap.wrapT = THREE.RepeatWrapping;
    bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
    diffuseMap.repeat.set(4, 3);
    bumpMap.repeat.set(4, 3);

    return { diffuseMap, bumpMap };
  }
}

// ============================================================================
// MODULE 2: SYNTHESIZED WEB AUDIO API SOUND ENGINE (OFFLINE)
// ============================================================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (!this.muted) {
      this.init();
      this.playBlip(520, 0.05);
    }
    return this.muted;
  }

  playFootstep() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(78, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.055);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  playJump() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(165, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.14);

      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.155);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  playDuck() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(290, now);
      osc.frequency.exponentialRampToValueAtTime(105, now + 0.085);

      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.095);
    } catch {}
  }

  playMilestone() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [
        { freq: 987.77, start: 0, dur: 0.09 },
        { freq: 1318.51, start: 0.09, dur: 0.24 }
      ];
      notes.forEach((n) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(n.freq, now + n.start);

        gain.gain.setValueAtTime(0.12, now + n.start);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + n.start);
        osc.stop(now + n.start + n.dur);
      });
    } catch {}
  }

  playCrash() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(165, now);
      osc.frequency.linearRampToValueAtTime(38, now + 0.38);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.41);

      const bufferSize = Math.floor(this.ctx.sampleRate * 0.28);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(720, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      whiteNoise.start(now);
      whiteNoise.stop(now + 0.28);
    } catch {}
  }

  playBlip(freq = 440, dur = 0.06) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + dur);
    } catch {}
  }

  playThunder() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(58, now);
      osc.frequency.exponentialRampToValueAtTime(18, now + 1.4);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.5);
    } catch {}
  }

  destroy() {
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {}
      this.ctx = null;
    }
  }
}

const POV_MODES = [
  { name: 'Classic 2.5D', badge: '[POV: Classic 2.5D]' },
  { name: '3rd Person', badge: '[POV: 3rd Person]' },
  { name: '1st Person Dino', badge: '[POV: 1st Person Dino]' },
  { name: 'Free Orbit 360°', badge: '[POV: Free Orbit 360°]' }
];

const Dino3DGame = () => {
  const rootRef = useRef(null);
  const canvasContainerRef = useRef(null);

  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const root = rootRef.current;
    const sound = new SoundEngine();

    const STORAGE_KEY = 'chrome_dino_3d_high_score_v1';
    let savedHighScore = 0;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) savedHighScore = parseInt(raw, 10) || 0;
    } catch {
      savedHighScore = 0;
    }

    const state = {
      mode: 'START',
      score: 0,
      highScore: savedHighScore,
      lastMilestone: 0,
      baseSpeed: 25,
      speed: 25,
      maxSpeedReached: 1.0,
      distance: 0,
      isNight: false,
      dayNightMix: 0,
      povIndex: 1, // Default 3rd Person View (Back View)
      showHitboxes: false,

      // Dynamic Weather & Rain
      weather: 'CLEAR', // 'CLEAR' | 'RAIN'
      weatherTimer: 18.0,
      rainIntensity: 0.0,
      lightningIntensity: 0.0,
      lightningTimer: 6.0,

      // Biomechanical Dino Physics
      dinoY: 0,
      dinoVy: 0,
      gravity: -74,
      jumpInitialVy: 24.0,
      isJumping: false,
      jumpHoldTimer: 0,
      isHoldingJump: false,
      isDucking: false,
      runPhase: 0,
      lastStepHalfCycle: 0,
      crashTimer: 0,
      cameraShake: 0,

      // Interactive Camera Orbit / Drag State
      orbitAzimuth: 0,
      orbitPolar: 0,
      velAzimuth: 0,
      velPolar: 0,
      zoomDistanceOffset: 0,
      isDragging: false,
      dragMovedDistance: 0,
      lastPointerX: 0,
      lastPointerY: 0,
      pointerDownTime: 0,
      pointerStartX: 0,
      pointerStartY: 0,
      freeOrbitAutoAngle: 0.62
    };

    // DOM Elements within the component
    const scoreEl = root.querySelector('#dino-score-display');
    const highScoreEl = root.querySelector('#dino-high-score-display');
    const speedEl = root.querySelector('#dino-speed-display');
    const povLabelEl = root.querySelector('#dino-pov-label');
    const cycleIconEl = root.querySelector('#dino-cycle-icon');
    const cycleLabelEl = root.querySelector('#dino-cycle-label');
    const btnResetOrbit = root.querySelector('#dino-btn-reset-orbit');
    const btnHitbox = root.querySelector('#dino-btn-hitbox');
    const btnPause = root.querySelector('#dino-btn-pause');
    const btnMute = root.querySelector('#dino-btn-mute');
    const btnFullscreen = root.querySelector('#dino-btn-fullscreen');
    const overlayStart = root.querySelector('#dino-overlay-start');
    const overlayPause = root.querySelector('#dino-overlay-pause');
    const overlayGameover = root.querySelector('#dino-overlay-gameover');
    const finalScoreEl = root.querySelector('#dino-final-score');
    const finalHighScoreEl = root.querySelector('#dino-final-high-score');
    const finalSpeedEl = root.querySelector('#dino-final-speed');
    const newRecordBadge = root.querySelector('#dino-new-record-badge');
    const crashReasonEl = root.querySelector('#dino-crash-reason');
    const povPills = root.querySelectorAll('.dino-pov-pill');

    function formatScore(val) {
      return Math.floor(val).toString().padStart(5, '0');
    }
    if (highScoreEl) highScoreEl.textContent = formatScore(state.highScore);

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const dayFogColor = new THREE.Color(0xe6be9a);
    const nightFogColor = new THREE.Color(0x0b132b);
    const currentFogColor = dayFogColor.clone();

    scene.background = currentFogColor;
    scene.fog = new THREE.FogExp2(currentFogColor, 0.0072);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.15,
      320
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.appendChild(renderer.domElement);

    // Atmospheric Gradient Sky Dome Shader
    const skyDomeGeo = new THREE.SphereGeometry(240, 32, 20);
    const skyDomeMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        topColorDay: { value: new THREE.Color(0x38bdf8) },
        horizonColorDay: { value: new THREE.Color(0xfde68a) },
        topColorNight: { value: new THREE.Color(0x020617) },
        horizonColorNight: { value: new THREE.Color(0x1e293b) },
        mixNight: { value: 0.0 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 topColorDay;
        uniform vec3 horizonColorDay;
        uniform vec3 topColorNight;
        uniform vec3 horizonColorNight;
        uniform float mixNight;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition).y;
          float factor = pow(max(h, 0.0), 0.55);
          vec3 dayCol = mix(horizonColorDay, topColorDay, factor);
          vec3 nightCol = mix(horizonColorNight, topColorNight, factor);
          gl_FragColor = vec4(mix(dayCol, nightCol, mixNight), 1.0);
        }
      `
    });
    const skyDome = new THREE.Mesh(skyDomeGeo, skyDomeMat);
    scene.add(skyDome);

    // 3-Point Outdoor Lighting
    const hemiLight = new THREE.HemisphereLight(0xfffbeb, 0xc27838, 0.68);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff5e4, 1.35);
    dirLight.position.set(28, 44, 26);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 6;
    dirLight.shadow.camera.far = 140;
    const shadowBounds = 38;
    dirLight.shadow.camera.left = -shadowBounds;
    dirLight.shadow.camera.right = shadowBounds;
    dirLight.shadow.camera.top = shadowBounds;
    dirLight.shadow.camera.bottom = -shadowBounds;
    dirLight.shadow.bias = -0.0004;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0xfde68a, 0.48);
    rimLight.position.set(-25, 18, -22);
    scene.add(rimLight);

    // Celestial Bodies
    const celestialGroup = new THREE.Group();
    scene.add(celestialGroup);

    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(6.2, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xfef08a, fog: false })
    );
    sunMesh.position.set(68, 46, -85);
    celestialGroup.add(sunMesh);

    const sunHalo = new THREE.Mesh(
      new THREE.SphereGeometry(9.5, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.25, fog: false })
    );
    sunMesh.add(sunHalo);

    const moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(4.8, 24, 24),
      new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.85,
        emissive: 0x64748b,
        emissiveIntensity: 0.45,
        fog: false
      })
    );
    moonMesh.position.set(68, -46, -85);
    celestialGroup.add(moonMesh);

    // Starfield
    const starCount = 420;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const y = 16 + Math.random() * 85;
      const radius = 95 + Math.random() * 80;
      starPositions[i * 3] = Math.cos(theta) * radius;
      starPositions[i * 3 + 1] = y;
      starPositions[i * 3 + 2] = Math.sin(theta) * radius;
    }
    const starsGeo = new THREE.BufferGeometry();
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0xf8fafc,
      size: 1.05,
      transparent: true,
      opacity: 0,
      fog: false
    });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // Textures & Materials
    const reptileTex = ProceduralTextureFactory.createReptileSkinTextures();
    const sandTex = ProceduralTextureFactory.createDesertSandTextures();
    const cactusTex = ProceduralTextureFactory.createCactusRibTextures();
    const mesaStrataTex = ProceduralTextureFactory.createSandstoneStrataTexture();
    const pyramidTex = ProceduralTextureFactory.createPyramidStoneTextures();

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    [reptileTex.diffuseMap, reptileTex.bumpMap, sandTex.diffuseMap, sandTex.bumpMap, mesaStrataTex, pyramidTex.diffuseMap, pyramidTex.bumpMap].forEach((t) => {
      t.anisotropy = maxAniso;
    });

    const mats = {
      dinoSkin: new THREE.MeshStandardMaterial({
        map: reptileTex.diffuseMap,
        bumpMap: reptileTex.bumpMap,
        bumpScale: 0.065,
        roughness: 0.62,
        metalness: 0.05
      }),
      dinoBelly: new THREE.MeshStandardMaterial({
        color: 0xd6d3be,
        bumpMap: reptileTex.bumpMap,
        bumpScale: 0.025,
        roughness: 0.72
      }),
      dinoOsteoderm: new THREE.MeshStandardMaterial({
        color: 0x293822,
        roughness: 0.5,
        metalness: 0.08
      }),
      dinoMouthInner: new THREE.MeshStandardMaterial({
        color: 0x9f3e45,
        roughness: 0.42
      }),
      dinoTooth: new THREE.MeshStandardMaterial({
        color: 0xfefce8,
        roughness: 0.25,
        metalness: 0.05
      }),
      dinoClaw: new THREE.MeshStandardMaterial({
        color: 0x1c1917,
        roughness: 0.35,
        metalness: 0.15
      }),
      eyeSclera: new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.12,
        metalness: 0.1
      }),
      eyePupil: new THREE.MeshBasicMaterial({ color: 0x09090b }),
      eyeDead: new THREE.MeshBasicMaterial({ color: 0xef4444 }),
      cactus: new THREE.MeshStandardMaterial({
        color: 0x2e6f40,
        bumpMap: cactusTex.bumpMap,
        bumpScale: 0.09,
        roughness: 0.68
      }),
      cactusDark: new THREE.MeshStandardMaterial({
        color: 0x22543d,
        bumpMap: cactusTex.bumpMap,
        bumpScale: 0.09,
        roughness: 0.72
      }),
      cactusFlower: new THREE.MeshStandardMaterial({
        color: 0xfb7185,
        roughness: 0.5
      }),
      spike: new THREE.MeshStandardMaterial({
        color: 0xfef9c3,
        roughness: 0.4
      }),
      pteroBody: new THREE.MeshStandardMaterial({
        color: 0x7c3f2c,
        bumpMap: reptileTex.bumpMap,
        bumpScale: 0.03,
        roughness: 0.58
      }),
      pteroWing: new THREE.MeshStandardMaterial({
        color: 0x9a4e36,
        roughness: 0.65,
        side: THREE.DoubleSide
      }),
      pteroBeak: new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.38
      }),
      sandGround: new THREE.MeshStandardMaterial({
        map: sandTex.diffuseMap,
        bumpMap: sandTex.bumpMap,
        bumpScale: 0.16,
        roughness: 0.88,
        metalness: 0.02
      }),
      sandTrack: new THREE.MeshStandardMaterial({
        color: 0xb88655,
        bumpMap: sandTex.bumpMap,
        bumpScale: 0.07,
        roughness: 0.92
      }),
      mesaRock: new THREE.MeshStandardMaterial({
        map: mesaStrataTex,
        bumpMap: sandTex.bumpMap,
        bumpScale: 0.12,
        roughness: 0.86
      }),
      pyramidStone: new THREE.MeshStandardMaterial({
        map: pyramidTex.diffuseMap,
        bumpMap: pyramidTex.bumpMap,
        bumpScale: 0.15,
        roughness: 0.85,
        metalness: 0.04,
        flatShading: true
      }),
      pyramidionGold: new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.76,
        roughness: 0.28
      }),
      rock: new THREE.MeshStandardMaterial({
        color: 0x786252,
        bumpMap: sandTex.bumpMap,
        bumpScale: 0.1,
        roughness: 0.84
      }),
      scrubBush: new THREE.MeshStandardMaterial({
        color: 0x5c6b3c,
        roughness: 0.9,
        flatShading: true
      }),
      tumbleweed: new THREE.MeshStandardMaterial({
        color: 0x92623a,
        roughness: 0.85,
        wireframe: true
      }),
      cloud: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.95,
        transparent: true,
        opacity: 0.88
      }),
      dust: new THREE.MeshStandardMaterial({
        color: 0xd6b08a,
        roughness: 0.95,
        transparent: true,
        opacity: 0.65
      })
    };

    // T-Rex Rigging
    function createProceduralTRex() {
      const dinoRoot = new THREE.Group();

      const bodyPivot = new THREE.Group();
      bodyPivot.position.set(0, 1.42, 0);
      dinoRoot.add(bodyPivot);

      const torsoGroup = new THREE.Group();
      torsoGroup.rotation.z = 0.14;
      bodyPivot.add(torsoGroup);

      const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.68, 16, 14), mats.dinoSkin);
      pelvis.scale.set(1.25, 0.95, 0.88);
      pelvis.position.set(-0.28, 0.04, 0);
      pelvis.castShadow = true;
      pelvis.receiveShadow = true;
      torsoGroup.add(pelvis);

      const ribcage = new THREE.Mesh(new THREE.SphereGeometry(0.66, 16, 14), mats.dinoSkin);
      ribcage.scale.set(1.38, 0.92, 0.82);
      ribcage.position.set(0.32, 0.1, 0);
      ribcage.castShadow = true;
      ribcage.receiveShadow = true;
      torsoGroup.add(ribcage);

      const underbelly = new THREE.Mesh(new THREE.SphereGeometry(0.58, 14, 12), mats.dinoBelly);
      underbelly.scale.set(1.48, 0.72, 0.76);
      underbelly.position.set(0.08, -0.18, 0);
      torsoGroup.add(underbelly);

      for (let i = 0; i < 6; i++) {
        const osteo = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.24, 5), mats.dinoOsteoderm);
        osteo.position.set(-0.68 + i * 0.27, 0.58 + i * 0.02, 0);
        osteo.rotation.z = -0.25;
        osteo.castShadow = true;
        torsoGroup.add(osteo);
      }

      const headGroup = new THREE.Group();
      headGroup.position.set(0.84, 0.58, 0);
      bodyPivot.add(headGroup);

      const neckBase = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.44, 0.72, 12), mats.dinoSkin);
      neckBase.position.set(-0.14, 0.06, 0);
      neckBase.rotation.z = -0.32;
      neckBase.castShadow = true;
      headGroup.add(neckBase);

      const neckThroat = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.34, 0.66, 10), mats.dinoBelly);
      neckThroat.position.set(-0.04, 0.02, 0);
      neckThroat.rotation.z = -0.32;
      headGroup.add(neckThroat);

      const cranium = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.58, 0.74), mats.dinoSkin);
      cranium.position.set(0.14, 0.48, 0);
      cranium.castShadow = true;
      headGroup.add(cranium);

      const snout = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.46, 0.58), mats.dinoSkin);
      snout.position.set(0.72, 0.44, 0);
      snout.castShadow = true;
      headGroup.add(snout);

      const nasalBridge = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.16, 0.42), mats.dinoOsteoderm);
      nasalBridge.position.set(0.68, 0.68, 0);
      nasalBridge.rotation.z = -0.06;
      headGroup.add(nasalBridge);

      [-1, 1].forEach((side) => {
        const brow = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.11, 0.14), mats.dinoOsteoderm);
        brow.position.set(0.24, 0.69, side * 0.36);
        brow.rotation.z = -0.18;
        brow.rotation.y = side * 0.15;
        headGroup.add(brow);

        const nostril = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), mats.dinoOsteoderm);
        nostril.position.set(1.02, 0.56, side * 0.22);
        headGroup.add(nostril);
      });

      const upperPalate = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.06, 0.48), mats.dinoMouthInner);
      upperPalate.position.set(0.68, 0.22, 0);
      headGroup.add(upperPalate);

      for (let t = 0; t < 5; t++) {
        [-1, 1].forEach((side) => {
          const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.036, 0.15, 6), mats.dinoTooth);
          tooth.position.set(0.36 + t * 0.16, 0.16, side * 0.24);
          tooth.rotation.x = Math.PI;
          tooth.rotation.z = -0.1;
          headGroup.add(tooth);
        });
      }

      const jawPivot = new THREE.Group();
      jawPivot.position.set(0.04, 0.22, 0);
      headGroup.add(jawPivot);

      const mandible = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.22, 0.52), mats.dinoSkin);
      mandible.position.set(0.48, -0.08, 0);
      mandible.castShadow = true;
      jawPivot.add(mandible);

      const chinBelly = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.1, 0.46), mats.dinoBelly);
      chinBelly.position.set(0.48, -0.16, 0);
      jawPivot.add(chinBelly);

      const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.08, 0.34), mats.dinoMouthInner);
      tongue.position.set(0.5, 0.02, 0);
      jawPivot.add(tongue);

      for (let t = 0; t < 4; t++) {
        [-1, 1].forEach((side) => {
          const lTooth = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.12, 6), mats.dinoTooth);
          lTooth.position.set(0.34 + t * 0.16, 0.06, side * 0.21);
          jawPivot.add(lTooth);
        });
      }

      const aliveEyes = new THREE.Group();
      headGroup.add(aliveEyes);

      [-1, 1].forEach((side) => {
        const eyeball = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), mats.eyeSclera);
        eyeball.position.set(0.24, 0.54, side * 0.36);
        aliveEyes.add(eyeball);

        const slitPupil = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.05), mats.eyePupil);
        slitPupil.position.set(0.27, 0.54, side * 0.44);
        aliveEyes.add(slitPupil);
      });

      const deadEyes = new THREE.Group();
      deadEyes.visible = false;
      headGroup.add(deadEyes);

      [-1, 1].forEach((side) => {
        const barGeo = new THREE.BoxGeometry(0.26, 0.06, 0.06);
        const bar1 = new THREE.Mesh(barGeo, mats.eyeDead);
        bar1.position.set(0.24, 0.54, side * 0.42);
        bar1.rotation.z = Math.PI / 4;
        deadEyes.add(bar1);

        const bar2 = new THREE.Mesh(barGeo, mats.eyeDead);
        bar2.position.set(0.24, 0.54, side * 0.42);
        bar2.rotation.z = -Math.PI / 4;
        deadEyes.add(bar2);
      });

      const fpCameraMount = new THREE.Group();
      fpCameraMount.position.set(0.45, 0.62, 0);
      headGroup.add(fpCameraMount);

      function createForelimb(side) {
        const shoulder = new THREE.Group();
        shoulder.position.set(0.68, -0.05, side * 0.46);

        const humerus = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.34, 8), mats.dinoSkin);
        humerus.position.set(0.1, -0.12, 0);
        humerus.rotation.z = 0.65;
        humerus.castShadow = true;
        shoulder.add(humerus);

        const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.05, 0.28, 8), mats.dinoSkin);
        forearm.position.set(0.25, -0.18, 0);
        forearm.rotation.z = 1.25;
        shoulder.add(forearm);

        [-0.03, 0.03].forEach((zOff) => {
          const claw = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.12, 5), mats.dinoClaw);
          claw.position.set(0.38, -0.22, zOff);
          claw.rotation.z = -Math.PI * 0.65;
          shoulder.add(claw);
        });

        return shoulder;
      }

      const armL = createForelimb(1);
      const armR = createForelimb(-1);
      bodyPivot.add(armL);
      bodyPivot.add(armR);

      const tailPivot = new THREE.Group();
      tailPivot.position.set(-0.78, 0.08, 0);
      bodyPivot.add(tailPivot);

      const tailSeg1 = new THREE.Group();
      const tMesh1 = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.44, 0.85, 12), mats.dinoSkin);
      tMesh1.rotation.z = -Math.PI / 2 - 0.08;
      tMesh1.position.set(-0.38, 0.04, 0);
      tMesh1.castShadow = true;
      tailSeg1.add(tMesh1);
      tailPivot.add(tailSeg1);

      const tailSeg2 = new THREE.Group();
      tailSeg2.position.set(-0.75, 0.06, 0);
      const tMesh2 = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.32, 0.85, 10), mats.dinoSkin);
      tMesh2.rotation.z = -Math.PI / 2 - 0.06;
      tMesh2.position.set(-0.38, 0.03, 0);
      tMesh2.castShadow = true;
      tailSeg2.add(tMesh2);
      tailSeg1.add(tailSeg2);

      const tailSeg3 = new THREE.Group();
      tailSeg3.position.set(-0.75, 0.04, 0);
      const tMesh3 = new THREE.Mesh(new THREE.ConeGeometry(0.21, 1.05, 10), mats.dinoSkin);
      tMesh3.rotation.z = Math.PI / 2 - 0.04;
      tMesh3.position.set(-0.48, 0.02, 0);
      tMesh3.castShadow = true;
      tailSeg3.add(tMesh3);
      tailSeg2.add(tailSeg3);

      function createHindLeg(side) {
        const hipPivot = new THREE.Group();
        hipPivot.position.set(-0.18, 1.28, side * 0.46);

        const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 0.68, 12), mats.dinoSkin);
        thigh.position.set(0.06, -0.26, 0);
        thigh.rotation.z = 0.22;
        thigh.castShadow = true;
        hipPivot.add(thigh);

        const kneePivot = new THREE.Group();
        kneePivot.position.set(0.14, -0.54, 0);
        hipPivot.add(kneePivot);

        const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.19, 0.56, 10), mats.dinoSkin);
        shin.position.set(-0.08, -0.24, 0);
        shin.rotation.z = -0.28;
        shin.castShadow = true;
        kneePivot.add(shin);

        const footGroup = new THREE.Group();
        footGroup.position.set(0.02, -0.58, 0);
        kneePivot.add(footGroup);

        const instep = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 0.34), mats.dinoSkin);
        instep.position.set(0.08, -0.04, 0);
        instep.castShadow = true;
        footGroup.add(instep);

        [-0.12, 0, 0.12].forEach((zOff, idx) => {
          const toeLen = idx === 1 ? 0.34 : 0.26;
          const toe = new THREE.Mesh(new THREE.BoxGeometry(toeLen, 0.1, 0.09), mats.dinoSkin);
          toe.position.set(0.24, -0.06, zOff);
          footGroup.add(toe);

          const talon = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.16, 6), mats.dinoClaw);
          talon.position.set(0.24 + toeLen * 0.55, -0.06, zOff);
          talon.rotation.z = -Math.PI / 2;
          footGroup.add(talon);
        });

        hipPivot.userData = { kneePivot, footGroup };
        return hipPivot;
      }

      const legL = createHindLeg(1);
      const legR = createHindLeg(-1);
      dinoRoot.add(legL);
      dinoRoot.add(legR);

      const hitboxGeo = new THREE.BoxGeometry(1, 1, 1);
      const hitboxMat = new THREE.MeshBasicMaterial({ color: 0x22c55e, wireframe: true });
      const hitboxMesh = new THREE.Mesh(hitboxGeo, hitboxMat);
      hitboxMesh.visible = false;
      scene.add(hitboxMesh);

      return {
        root: dinoRoot,
        bodyPivot,
        headGroup,
        jawPivot,
        aliveEyes,
        deadEyes,
        fpCameraMount,
        armL,
        armR,
        tailPivot,
        tailSeg2,
        tailSeg3,
        legL,
        legR,
        hitboxMesh,
        boundingBox: new THREE.Box3()
      };
    }

    const dino = createProceduralTRex();
    scene.add(dino.root);

    // Desert Biome Pools
    const worldPool = {
      groundTiles: [],
      mesas: [],
      dunes: [],
      rocks: [],
      scrubs: [],
      animals: [],
      birds: [],
      clouds: [],
      dustPuffs: []
    };

    const TILE_LENGTH = 44;
    const NUM_TILES = 6;

    function createSculptedTerrainGeometry() {
      const geo = new THREE.PlaneGeometry(TILE_LENGTH, 130, 28, 42);
      geo.rotateX(-Math.PI / 2);
      const pos = geo.attributes.position;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const absZ = Math.abs(z);

        let y = 0;
        if (absZ > 3.5) {
          const distFactor = Math.min(1, (absZ - 3.5) / 28);
          const wave1 = Math.sin(x * (Math.PI * 2 / TILE_LENGTH) * 2 + z * 0.08);
          const wave2 = Math.cos(x * (Math.PI * 2 / TILE_LENGTH) - z * 0.14);
          y = Math.pow(distFactor, 1.4) * (2.6 + wave1 * 1.4 + wave2 * 0.9);
        } else {
          y = -0.04 * Math.cos((z / 3.5) * (Math.PI / 2));
        }
        pos.setY(i, y);
      }
      geo.computeVertexNormals();
      return geo;
    }

    const sharedTerrainGeo = createSculptedTerrainGeometry();

    for (let i = 0; i < NUM_TILES; i++) {
      const tileGroup = new THREE.Group();

      const terrainMesh = new THREE.Mesh(sharedTerrainGeo, mats.sandGround);
      terrainMesh.receiveShadow = true;
      tileGroup.add(terrainMesh);

      const pathGeo = new THREE.PlaneGeometry(TILE_LENGTH, 4.6);
      pathGeo.rotateX(-Math.PI / 2);
      const pathMesh = new THREE.Mesh(pathGeo, mats.sandTrack);
      pathMesh.position.y = 0.015;
      pathMesh.receiveShadow = true;
      tileGroup.add(pathMesh);

      for (let p = 0; p < 22; p++) {
        const pebble = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.14 + Math.random() * 0.22, 0),
          mats.rock
        );
        pebble.scale.set(1.2, 0.45, 0.9);
        pebble.position.set(
          (Math.random() - 0.5) * TILE_LENGTH,
          0.04,
          (Math.random() - 0.5) * 9.5
        );
        pebble.receiveShadow = true;
        tileGroup.add(pebble);
      }

      tileGroup.position.x = (i - 1) * TILE_LENGTH;
      scene.add(tileGroup);
      worldPool.groundTiles.push(tileGroup);
    }

    // Realistic Ancient Desert Pyramid Mountains (Clean 4-Sided Pyramids, No Boxes)
    function createRealisticPyramidMountain(scale = 1, isTwin = false) {
      const group = new THREE.Group();

      // Main 4-sided pyramid
      const baseRadius = 16.0 * scale;
      const pyrHeight = 19.5 * scale;
      const mainGeo = new THREE.ConeGeometry(baseRadius, pyrHeight, 4);
      mainGeo.rotateY(Math.PI / 4); // Align 4 flat faces with axes
      const mainMesh = new THREE.Mesh(mainGeo, mats.pyramidStone);
      mainMesh.position.y = pyrHeight * 0.5;
      mainMesh.castShadow = true;
      mainMesh.receiveShadow = true;
      group.add(mainMesh);

      // Golden Pyramidion (Apex capstone reflecting desert sun)
      const capH = 2.4 * scale;
      const capR = 2.1 * scale;
      const capGeo = new THREE.ConeGeometry(capR, capH, 4);
      capGeo.rotateY(Math.PI / 4);
      const capMesh = new THREE.Mesh(capGeo, mats.pyramidionGold);
      capMesh.position.y = pyrHeight - (capH * 0.48);
      group.add(capMesh);

      if (isTwin) {
        // Companion secondary 4-sided pyramid (no boxes)
        const p2R = 10.5 * scale;
        const p2H = 13.0 * scale;
        const p2Geo = new THREE.ConeGeometry(p2R, p2H, 4);
        p2Geo.rotateY(Math.PI / 4);
        const p2 = new THREE.Mesh(p2Geo, mats.pyramidStone);
        p2.position.set(12.0 * scale, p2H * 0.5, 7.0 * scale);
        p2.castShadow = true;
        p2.receiveShadow = true;
        group.add(p2);
      }

      return group;
    }

    // Fixed Horizon Pyramids (Mountains remain stationary at their positions)
    for (let i = 0; i < 10; i++) {
      const isTwin = i % 3 === 0;
      const scale = 1.05 + Math.random() * 1.3;
      const pyramid = createRealisticPyramidMountain(scale, isTwin);
      const side = i % 2 === 0 ? -1 : 1;
      const zPos = side < 0 ? -(42 + Math.random() * 36) : (44 + Math.random() * 36);
      pyramid.position.set(-50 + i * 26 + Math.random() * 10, -0.2, zPos);
      pyramid.rotation.y = (Math.PI / 4) + (Math.random() - 0.5) * 0.22;
      scene.add(pyramid);
      worldPool.mesas.push(pyramid);
    }

    // Midground Sand Dunes
    for (let i = 0; i < 16; i++) {
      const radius = 5.5 + Math.random() * 7;
      const height = 2.2 + Math.random() * 3.8;
      const duneGeo = new THREE.ConeGeometry(radius, height, 12);
      const duneMesh = new THREE.Mesh(duneGeo, mats.sandGround);
      duneMesh.scale.set(1.6, 0.65, 1.0);
      duneMesh.receiveShadow = true;

      const side = i % 2 === 0 ? 1 : -1;
      duneMesh.position.set(
        -40 + i * 14 + Math.random() * 6,
        height * 0.25 - 0.2,
        side * (14 + Math.random() * 22)
      );
      duneMesh.rotation.y = Math.random() * Math.PI;
      scene.add(duneMesh);
      worldPool.dunes.push(duneMesh);
    }

    // Rocks & Boulders
    for (let i = 0; i < 24; i++) {
      const scale = 0.45 + Math.random() * 1.15;
      const rockGeo = new THREE.DodecahedronGeometry(scale, 1);
      const rockMesh = new THREE.Mesh(rockGeo, mats.rock);
      rockMesh.scale.set(1.3, 0.72, 1.0);
      rockMesh.castShadow = true;
      rockMesh.receiveShadow = true;

      const side = Math.random() > 0.5 ? 1 : -1;
      rockMesh.position.set(
        -35 + i * 8.5 + Math.random() * 4,
        scale * 0.32,
        side * (4.2 + Math.random() * 20)
      );
      rockMesh.rotation.set(0, Math.random() * 3, 0);
      scene.add(rockMesh);
      worldPool.rocks.push(rockMesh);
    }

    // Desert Scrubs
    for (let i = 0; i < 18; i++) {
      const bushGroup = new THREE.Group();
      for (let b = 0; b < 3; b++) {
        const clump = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.32 + Math.random() * 0.25, 0),
          mats.scrubBush
        );
        clump.position.set((Math.random() - 0.5) * 0.4, 0.2, (Math.random() - 0.5) * 0.4);
        clump.castShadow = true;
        bushGroup.add(clump);
      }
      const side = i % 2 === 0 ? 1 : -1;
      bushGroup.position.set(
        -30 + i * 11 + Math.random() * 5,
        0,
        side * (3.6 + Math.random() * 14)
      );
      scene.add(bushGroup);
      worldPool.scrubs.push(bushGroup);
    }

    // Procedural Desert Wildlife (Lizards & Desert Foxes with In-Place Realistic Behaviors)
    function createDesertLizard() {
      const creatureRoot = new THREE.Group();
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 8), mats.dinoSkin);
      body.scale.set(1.5, 0.48, 0.75);
      body.position.y = 0.2;
      body.castShadow = true;
      creatureRoot.add(body);

      // Articulated Head Pivot (enables looking around, sniffing ground)
      const headPivot = new THREE.Group();
      headPivot.position.set(0.46, 0.22, 0);
      const headGeo = new THREE.ConeGeometry(0.18, 0.42, 6);
      headGeo.rotateZ(-Math.PI / 2);
      const head = new THREE.Mesh(headGeo, mats.dinoSkin);
      head.position.set(0.14, 0, 0);
      head.castShadow = true;
      headPivot.add(head);
      creatureRoot.add(headPivot);

      // Articulated Tail Pivot
      const tailPivot = new THREE.Group();
      tailPivot.position.set(-0.46, 0.2, 0);
      const tailMesh = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.75, 6), mats.dinoSkin);
      tailMesh.rotation.z = Math.PI / 2;
      tailMesh.position.set(-0.35, 0, 0);
      tailPivot.add(tailMesh);
      creatureRoot.add(tailPivot);

      const legs = [];
      [
        { x: 0.26, z: 0.28 },
        { x: 0.26, z: -0.28 },
        { x: -0.26, z: 0.28 },
        { x: -0.26, z: -0.28 }
      ].forEach((cfg) => {
        const legGroup = new THREE.Group();
        legGroup.position.set(cfg.x, 0.18, cfg.z);
        const legMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.2, 6), mats.dinoSkin);
        legMesh.position.set(0, -0.08, 0);
        legMesh.rotation.z = cfg.z > 0 ? 0.25 : -0.25;
        legMesh.castShadow = true;
        legGroup.add(legMesh);
        creatureRoot.add(legGroup);
        legs.push(legGroup);
      });

      return { root: creatureRoot, body, head: headPivot, legs, tail: tailPivot, type: 'LIZARD' };
    }

    function createDesertFox() {
      const creatureRoot = new THREE.Group();
      const foxMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.72 });
      const chestMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.75 });

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.38, 0.42), foxMat);
      body.position.y = 0.46;
      body.castShadow = true;
      creatureRoot.add(body);

      const chest = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.28, 0.38), chestMat);
      chest.position.set(0.24, 0.42, 0);
      creatureRoot.add(chest);

      // Articulated Head Pivot
      const headGroup = new THREE.Group();
      headGroup.position.set(0.48, 0.62, 0);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.28, 0.3), foxMat);
      head.castShadow = true;
      headGroup.add(head);

      const snout = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.28, 5), foxMat);
      snout.rotation.z = -Math.PI / 2;
      snout.position.set(0.24, -0.05, 0);
      headGroup.add(snout);

      [-1, 1].forEach((side) => {
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 4), foxMat);
        ear.position.set(-0.04, 0.22, side * 0.12);
        headGroup.add(ear);
      });
      creatureRoot.add(headGroup);

      // Articulated Tail Pivot
      const tailPivot = new THREE.Group();
      tailPivot.position.set(-0.38, 0.52, 0);
      const tailMesh = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.65, 6), foxMat);
      tailMesh.rotation.z = Math.PI / 2.2;
      tailMesh.position.set(-0.28, 0.1, 0);
      tailPivot.add(tailMesh);
      creatureRoot.add(tailPivot);

      const legs = [];
      [
        { x: 0.22, z: 0.16 },
        { x: 0.22, z: -0.16 },
        { x: -0.22, z: 0.16 },
        { x: -0.22, z: -0.16 }
      ].forEach((cfg) => {
        const legGroup = new THREE.Group();
        legGroup.position.set(cfg.x, 0.32, cfg.z);
        const legMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.34, 6), foxMat);
        legMesh.position.set(0, -0.16, 0);
        legMesh.castShadow = true;
        legGroup.add(legMesh);
        creatureRoot.add(legGroup);
        legs.push(legGroup);
      });

      return { root: creatureRoot, body, head: headGroup, legs, tail: tailPivot, type: 'FOX' };
    }

    for (let i = 0; i < 10; i++) {
      const isLizard = i % 2 === 0;
      const creature = isLizard ? createDesertLizard() : createDesertFox();
      const side = i % 2 === 0 ? 1 : -1;
      const zPos = side * (5.8 + Math.random() * 16.0);
      creature.root.position.set(-20 + i * 16 + Math.random() * 6, 0, zPos);

      const initialAngle = Math.random() * Math.PI * 2;
      creature.root.rotation.y = initialAngle;

      const animalData = {
        ...creature,
        currentAngle: initialAngle,
        targetAngle: initialAngle,
        behavior: 'SNIFF',
        behaviorTimer: 1.5 + Math.random() * 3.0,
        animTime: Math.random() * 10
      };
      scene.add(creature.root);
      worldPool.animals.push(animalData);
    }

    // Dynamic 3D Rain Streaks Particle System
    const RAIN_COUNT = 1400;
    const rainPositions = new Float32Array(RAIN_COUNT * 3);
    const rainVelocities = new Float32Array(RAIN_COUNT);

    for (let i = 0; i < RAIN_COUNT; i++) {
      rainPositions[i * 3] = (Math.random() - 0.5) * 85;
      rainPositions[i * 3 + 1] = Math.random() * 32;
      rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 48;
      rainVelocities[i] = 46 + Math.random() * 22;
    }

    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
    const rainMat = new THREE.PointsMaterial({
      color: 0xbae6fd,
      size: 0.32,
      transparent: true,
      opacity: 0.0,
      fog: true
    });
    const rainPoints = new THREE.Points(rainGeo, rainMat);
    rainPoints.visible = false;
    scene.add(rainPoints);

    for (let i = 0; i < 12; i++) {
      const cloudGroup = new THREE.Group();
      const puffs = 4 + Math.floor(Math.random() * 3);
      for (let p = 0; p < puffs; p++) {
        const puffGeo = new THREE.SphereGeometry(1.4 + Math.random() * 1.1, 12, 10);
        const puff = new THREE.Mesh(puffGeo, mats.cloud);
        puff.scale.set(1.4, 0.68, 1.0);
        puff.position.set(
          (p - 1.5) * 1.6,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 1.2
        );
        cloudGroup.add(puff);
      }
      cloudGroup.position.set(
        -45 + i * 19 + Math.random() * 8,
        14 + Math.random() * 11,
        (Math.random() - 0.5) * 65
      );
      if (Math.abs(cloudGroup.position.z) < 9) {
        cloudGroup.position.z = cloudGroup.position.z >= 0 ? 13 : -13;
      }
      cloudGroup.userData = { speedFactor: 0.16 + Math.random() * 0.14 };
      scene.add(cloudGroup);
      worldPool.clouds.push(cloudGroup);
    }

    const dustGeo = new THREE.SphereGeometry(0.24, 8, 8);
    for (let i = 0; i < 28; i++) {
      const puff = new THREE.Mesh(dustGeo, mats.dust.clone());
      puff.visible = false;
      scene.add(puff);
      worldPool.dustPuffs.push({
        mesh: puff,
        vel: new THREE.Vector3(),
        age: 0,
        maxAge: 0.45,
        active: false
      });
    }

    // Ambient Desert Birds (Hawks / Falcons soaring in visible air)
    const birdMat = new THREE.MeshStandardMaterial({
      color: 0x1f1915,
      roughness: 0.6
    });

    function createAmbientBird() {
      const birdRoot = new THREE.Group();

      const body = new THREE.Mesh(new THREE.ConeGeometry(0.24, 1.4, 5), birdMat);
      body.rotation.z = Math.PI / 2;
      body.castShadow = true;
      birdRoot.add(body);

      const head = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.45, 5), birdMat);
      head.rotation.z = -Math.PI / 2;
      head.position.set(0.85, 0, 0);
      birdRoot.add(head);

      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 0.6), birdMat);
      tail.position.set(-0.75, 0.02, 0);
      birdRoot.add(tail);

      const wingGeo = new THREE.BoxGeometry(0.5, 0.03, 1.1);

      const pivotL = new THREE.Group();
      pivotL.position.set(0.1, 0.05, 0.15);
      const wingL = new THREE.Mesh(wingGeo, birdMat);
      wingL.position.set(0, 0, 0.55);
      wingL.castShadow = true;
      pivotL.add(wingL);
      birdRoot.add(pivotL);

      const pivotR = new THREE.Group();
      pivotR.position.set(0.1, 0.05, -0.15);
      const wingR = new THREE.Mesh(wingGeo, birdMat);
      wingR.position.set(0, 0, -0.55);
      wingR.castShadow = true;
      pivotR.add(wingR);
      birdRoot.add(pivotR);

      return { root: birdRoot, wingL: pivotL, wingR: pivotR };
    }

    for (let i = 0; i < 6; i++) {
      const bird = createAmbientBird();
      const x = 12 + i * 8 + Math.random() * 4;
      const y = 5.8 + Math.random() * 3.0; // In visible sky view band
      const z = (Math.random() - 0.5) * 24;
      bird.root.position.set(x, y, z);
      scene.add(bird.root);

      worldPool.birds.push({
        ...bird,
        baseY: y,
        speed: 5.5 + Math.random() * 3.5,
        heading: Math.random() * Math.PI * 2,
        turnRate: (Math.random() - 0.5) * 1.1,
        flapPhase: Math.random() * Math.PI * 2,
        flapSpeed: 7.5 + Math.random() * 4.5,
        isGliding: false,
        glideTimer: 2.0 + Math.random() * 2.5,
        sinOffset: Math.random() * Math.PI * 2
      });
    }

    function spawnFootstepDust(x, z, count = 2) {
      let spawned = 0;
      for (let i = 0; i < worldPool.dustPuffs.length && spawned < count; i++) {
        const p = worldPool.dustPuffs[i];
        if (!p.active) {
          p.active = true;
          p.age = 0;
          p.maxAge = 0.38 + Math.random() * 0.22;
          p.mesh.visible = true;
          p.mesh.position.set(x + (Math.random() - 0.5) * 0.3, 0.15, z + (Math.random() - 0.5) * 0.3);
          p.mesh.scale.setScalar(0.5 + Math.random() * 0.4);
          p.mesh.material.opacity = 0.58;
          p.vel.set(-state.speed * 0.35 - Math.random() * 3, 1.4 + Math.random() * 2.2, (Math.random() - 0.5) * 2.2);
          spawned++;
        }
      }
    }

    // Obstacle Pool
    const obstaclePool = [];
    const activeObstacles = [];

    function buildRealisticSaguaro(scale = 1, mat = mats.cactus) {
      const group = new THREE.Group();

      const trunkH = 2.15 * scale;
      const trunkR = 0.29 * scale;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(trunkR * 0.92, trunkR, trunkH, 14), mat);
      trunk.position.y = trunkH / 2;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      group.add(trunk);

      const dome = new THREE.Mesh(new THREE.SphereGeometry(trunkR * 0.92, 14, 10), mat);
      dome.position.y = trunkH;
      group.add(dome);

      const flower = new THREE.Mesh(new THREE.ConeGeometry(0.11 * scale, 0.14 * scale, 7), mats.cactusFlower);
      flower.position.y = trunkH + trunkR * 0.85;
      flower.rotation.x = Math.PI;
      group.add(flower);

      const armL = new THREE.Group();
      armL.position.set(0, trunkH * 0.54, trunkR * 0.75);
      const hBarL = new THREE.Mesh(new THREE.CylinderGeometry(trunkR * 0.62, trunkR * 0.65, 0.48 * scale, 10), mat);
      hBarL.rotation.x = Math.PI / 2;
      hBarL.position.z = 0.22 * scale;
      armL.add(hBarL);

      const elbowL = new THREE.Mesh(new THREE.SphereGeometry(trunkR * 0.62, 10, 10), mat);
      elbowL.position.set(0, 0, 0.44 * scale);
      armL.add(elbowL);

      const vBarL = new THREE.Mesh(new THREE.CylinderGeometry(trunkR * 0.56, trunkR * 0.62, 0.78 * scale, 10), mat);
      vBarL.position.set(0, 0.39 * scale, 0.44 * scale);
      vBarL.castShadow = true;
      armL.add(vBarL);

      const capL = new THREE.Mesh(new THREE.SphereGeometry(trunkR * 0.56, 10, 8), mat);
      capL.position.set(0, 0.78 * scale, 0.44 * scale);
      armL.add(capL);
      group.add(armL);

      const armR = new THREE.Group();
      armR.position.set(0, trunkH * 0.40, -trunkR * 0.75);
      const hBarR = new THREE.Mesh(new THREE.CylinderGeometry(trunkR * 0.60, trunkR * 0.64, 0.44 * scale, 10), mat);
      hBarR.rotation.x = Math.PI / 2;
      hBarR.position.z = -0.20 * scale;
      armR.add(hBarR);

      const elbowR = new THREE.Mesh(new THREE.SphereGeometry(trunkR * 0.60, 10, 10), mat);
      elbowR.position.set(0, 0, -0.40 * scale);
      armR.add(elbowR);

      const vBarR = new THREE.Mesh(new THREE.CylinderGeometry(trunkR * 0.54, trunkR * 0.60, 0.68 * scale, 10), mat);
      vBarR.position.set(0, 0.34 * scale, -0.40 * scale);
      vBarR.castShadow = true;
      armR.add(vBarR);

      const capR = new THREE.Mesh(new THREE.SphereGeometry(trunkR * 0.54, 10, 8), mat);
      capR.position.set(0, 0.68 * scale, -0.40 * scale);
      armR.add(capR);
      group.add(armR);

      for (let s = 0; s < 8; s++) {
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.032 * scale, 0.19 * scale, 4), mats.spike);
        const angle = (s / 8) * Math.PI * 2;
        spike.position.set(
          Math.cos(angle) * trunkR,
          (0.25 + (s % 4) * 0.2) * trunkH,
          Math.sin(angle) * trunkR
        );
        spike.rotation.z = -Math.cos(angle) * (Math.PI / 2);
        spike.rotation.x = Math.sin(angle) * (Math.PI / 2);
        group.add(spike);
      }

      return group;
    }

    function createObstacleItem(type) {
      const oRoot = new THREE.Group();
      oRoot.visible = false;
      const hitSize = new THREE.Vector3(1, 2, 1);
      const hitOffset = new THREE.Vector3(0, 1, 0);
      let wingL = null;
      let wingR = null;

      if (type === 'CACTUS_SMALL') {
        oRoot.add(buildRealisticSaguaro(0.82, mats.cactus));
        hitSize.set(0.75, 1.65, 1.1);
        hitOffset.set(0, 0.82, 0);
      } else if (type === 'CACTUS_TALL') {
        oRoot.add(buildRealisticSaguaro(1.22, mats.cactusDark));
        hitSize.set(0.85, 2.45, 1.3);
        hitOffset.set(0, 1.22, 0);
      } else if (type === 'CACTUS_CLUSTER') {
        const c1 = buildRealisticSaguaro(1.05, mats.cactus);
        c1.position.set(-0.55, 0, 0);
        oRoot.add(c1);

        const c2 = buildRealisticSaguaro(0.85, mats.cactusDark);
        c2.position.set(0.15, 0, 0.24);
        c2.rotation.y = 0.6;
        oRoot.add(c2);

        const c3 = buildRealisticSaguaro(0.95, mats.cactus);
        c3.position.set(0.72, 0, -0.2);
        c3.rotation.y = -0.4;
        oRoot.add(c3);

        hitSize.set(1.85, 2.1, 1.45);
        hitOffset.set(0.1, 1.05, 0);
      } else if (type === 'PTERODACTYL') {
        const torso = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 10), mats.pteroBody);
        torso.scale.set(1.9, 0.82, 0.85);
        torso.castShadow = true;
        oRoot.add(torso);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), mats.pteroBody);
        head.position.set(-0.62, 0.14, 0);
        oRoot.add(head);

        const crest = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.78, 8), mats.pteroBeak);
        crest.rotation.z = -Math.PI / 2 - 0.28;
        crest.position.set(-0.28, 0.34, 0);
        oRoot.add(crest);

        const beak = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.92, 8), mats.pteroBeak);
        beak.rotation.z = Math.PI / 2;
        beak.position.set(-1.16, 0.1, 0);
        oRoot.add(beak);

        [-1, 1].forEach((s) => {
          const eye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), mats.eyeSclera);
          eye.position.set(-0.68, 0.18, s * 0.16);
          oRoot.add(eye);
        });

        function createPteroWing(side) {
          const wGroup = new THREE.Group();
          wGroup.position.set(-0.08, 0.06, side * 0.22);

          const spar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.06, 1.65, 8), mats.pteroBody);
          spar.rotation.x = side * (Math.PI / 2);
          spar.position.set(-0.18, 0, side * 0.82);
          wGroup.add(spar);

          const membrane = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.04, 1.65), mats.pteroWing);
          membrane.position.set(0.12, 0, side * 0.82);
          membrane.castShadow = true;
          wGroup.add(membrane);

          return wGroup;
        }

        wingL = createPteroWing(1);
        wingR = createPteroWing(-1);
        oRoot.add(wingL);
        oRoot.add(wingR);

        hitSize.set(1.75, 0.72, 2.2);
        hitOffset.set(-0.2, 0.08, 0);
      }

      const hbMesh = new THREE.Mesh(
        new THREE.BoxGeometry(hitSize.x, hitSize.y, hitSize.z),
        new THREE.MeshBasicMaterial({ color: 0xf43f5e, wireframe: true })
      );
      hbMesh.position.copy(hitOffset);
      hbMesh.visible = false;
      oRoot.add(hbMesh);

      scene.add(oRoot);

      return {
        type,
        root: oRoot,
        wingL,
        wingR,
        hitSize,
        hitOffset,
        hbMesh,
        boundingBox: new THREE.Box3(),
        active: false,
        flapPhase: Math.random() * Math.PI * 2,
        altitudeLabel: ''
      };
    }

    const poolConfig = [
      { type: 'CACTUS_SMALL', count: 5 },
      { type: 'CACTUS_TALL', count: 5 },
      { type: 'CACTUS_CLUSTER', count: 4 },
      { type: 'PTERODACTYL', count: 5 }
    ];
    poolConfig.forEach((cfg) => {
      for (let i = 0; i < cfg.count; i++) {
        obstaclePool.push(createObstacleItem(cfg.type));
      }
    });

    let spawnTimer = 1.05;

    function spawnObstacle() {
      const allowPtero = state.score >= 120;
      let desiredType = 'CACTUS_SMALL';
      const r = Math.random();

      if (allowPtero && r < 0.35) {
        desiredType = 'PTERODACTYL';
      } else if (r < 0.58) {
        desiredType = 'CACTUS_SMALL';
      } else if (r < 0.82) {
        desiredType = 'CACTUS_TALL';
      } else {
        desiredType = 'CACTUS_CLUSTER';
      }

      const candidate = obstaclePool.find((o) => !o.active && o.type === desiredType) ||
                        obstaclePool.find((o) => !o.active);
      if (!candidate) return;

      candidate.active = true;
      candidate.root.visible = true;
      candidate.hbMesh.visible = state.showHitboxes;

      const spawnX = 94 + Math.random() * 14;
      if (candidate.type === 'PTERODACTYL') {
        const altRoll = Math.random();
        if (altRoll < 0.38) {
          candidate.root.position.set(spawnX, 0.88, 0);
          candidate.altitudeLabel = 'Low-Flying Pteranodon';
        } else if (altRoll < 0.82) {
          candidate.root.position.set(spawnX, 2.18, 0);
          candidate.altitudeLabel = 'Head-Height Pteranodon (Duck!)';
        } else {
          candidate.root.position.set(spawnX, 3.85, 0);
          candidate.altitudeLabel = 'High-Altitude Pteranodon';
        }
      } else {
        candidate.root.position.set(spawnX, 0, 0);
        candidate.altitudeLabel = candidate.type === 'CACTUS_CLUSTER' ? 'Saguaro Cactus Cluster' : 'Saguaro Cactus';
      }

      activeObstacles.push(candidate);
    }

    // Crash Particles
    const crashParticles = [];
    const particleGeo = new THREE.DodecahedronGeometry(0.18, 0);
    const particleColors = [0xd97706, 0xef4444, 0xfacc15, 0x786252, 0x4d7c0f];

    for (let i = 0; i < 40; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: particleColors[i % particleColors.length],
        roughness: 0.65,
        flatShading: true
      });
      const mesh = new THREE.Mesh(particleGeo, mat);
      mesh.visible = false;
      mesh.castShadow = true;
      scene.add(mesh);
      crashParticles.push({
        mesh,
        vel: new THREE.Vector3(),
        rotVel: new THREE.Vector3(),
        active: false
      });
    }

    function triggerCrashExplosion(originPos) {
      crashParticles.forEach((p) => {
        p.active = true;
        p.mesh.visible = true;
        p.mesh.position.copy(originPos);
        p.mesh.position.y += 1.0 + Math.random() * 0.9;
        p.mesh.scale.setScalar(0.55 + Math.random() * 0.95);
        p.vel.set(
          (Math.random() - 0.5) * 18,
          6.5 + Math.random() * 14,
          (Math.random() - 0.5) * 18
        );
        p.rotVel.set(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 14
        );
      });
    }

    // Camera POV & Orbit (Initial: 3rd Person Back View)
    const currentCamPos = new THREE.Vector3(-8.8, 4.2, 0);
    const currentLookAt = new THREE.Vector3(16, 1.7, 0);
    const targetCamPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3();

    function setPovMode(index) {
      state.povIndex = ((index % POV_MODES.length) + POV_MODES.length) % POV_MODES.length;
      const mode = POV_MODES[state.povIndex];
      if (povLabelEl) povLabelEl.textContent = mode.badge;
      if (btnPov) btnPov.title = `Camera Mode: ${mode.name} (Key: C)`;
      sound.playBlip(640, 0.06);

      if (povPills && povPills.length > 0) {
        povPills.forEach((pill, idx) => {
          if (idx === state.povIndex) {
            pill.className = 'dino-pov-pill px-2.5 py-1.5 rounded-lg text-xs font-bold transition bg-amber-500 text-slate-950';
          } else {
            pill.className = 'dino-pov-pill px-2.5 py-1.5 rounded-lg text-xs font-bold transition text-slate-300 hover:text-white';
          }
        });
      }
    }

    function resetOrbitOffsets() {
      state.orbitAzimuth = 0;
      state.orbitPolar = 0;
      state.velAzimuth = 0;
      state.velPolar = 0;
      state.zoomDistanceOffset = 0;
      // Switch view to 3rd person (back view)
      setPovMode(1);
      sound.playBlip(480, 0.05);
    }

    function updateCamera(dt) {
      if (!state.isDragging) {
        state.orbitAzimuth += state.velAzimuth * dt;
        state.orbitPolar += state.velPolar * dt;
        const damping = Math.exp(-6.5 * dt);
        state.velAzimuth *= damping;
        state.velPolar *= damping;
      }
      state.orbitPolar = Math.max(-0.55, Math.min(0.85, state.orbitPolar));

      if (state.cameraShake > 0) {
        state.cameraShake = Math.max(0, state.cameraShake - dt * 3.2);
      }
      const shakeX = (Math.random() - 0.5) * state.cameraShake;
      const shakeY = (Math.random() - 0.5) * state.cameraShake;

      if (state.povIndex === 0) {
        dino.headGroup.visible = true;
        const baseOffset = new THREE.Vector3(0, 4.4, 18.5 + state.zoomDistanceOffset);
        const spherical = new THREE.Spherical().setFromVector3(baseOffset);
        spherical.theta += state.orbitAzimuth;
        spherical.phi = Math.max(0.25, Math.min(Math.PI * 0.48, spherical.phi - state.orbitPolar));
        baseOffset.setFromSpherical(spherical);

        targetLookAt.set(8.5 + shakeX, 1.8 + shakeY, 0);
        targetCamPos.copy(targetLookAt).add(baseOffset);

        currentCamPos.lerp(targetCamPos, Math.min(1, dt * 8));
        currentLookAt.lerp(targetLookAt, Math.min(1, dt * 10));
        camera.position.copy(currentCamPos);
        camera.lookAt(currentLookAt);

      } else if (state.povIndex === 1) {
        dino.headGroup.visible = true;
        const baseOffset = new THREE.Vector3(-8.8 - state.zoomDistanceOffset * 0.6, 4.2, 0);
        const spherical = new THREE.Spherical().setFromVector3(baseOffset);
        spherical.theta += state.orbitAzimuth;
        spherical.phi = Math.max(0.25, Math.min(Math.PI * 0.47, spherical.phi - state.orbitPolar));
        baseOffset.setFromSpherical(spherical);

        const focusPoint = new THREE.Vector3(6.5, 1.9 + state.dinoY * 0.35, 0);
        targetLookAt.set(16 + shakeX, 1.7 + state.dinoY * 0.2 + shakeY, 0);
        targetCamPos.copy(focusPoint).add(baseOffset);

        currentCamPos.lerp(targetCamPos, Math.min(1, dt * 8.5));
        currentLookAt.lerp(targetLookAt, Math.min(1, dt * 10));
        camera.position.copy(currentCamPos);
        camera.lookAt(currentLookAt);

      } else if (state.povIndex === 2) {
        dino.headGroup.visible = true;
        const eyeWorldPos = new THREE.Vector3();
        dino.fpCameraMount.getWorldPosition(eyeWorldPos);

        const bobY = state.mode === 'PLAYING' && !state.isJumping
          ? Math.sin(state.runPhase * 2) * 0.08
          : 0;
        targetCamPos.set(eyeWorldPos.x + 0.14, eyeWorldPos.y + 0.16 + bobY, eyeWorldPos.z);

        const lookDist = 22;
        const yaw = state.orbitAzimuth * 0.75;
        const pitch = state.orbitPolar * 0.6 - (state.isDucking ? 0.14 : 0.04);
        targetLookAt.set(
          targetCamPos.x + Math.cos(yaw) * lookDist + shakeX,
          targetCamPos.y + Math.sin(pitch) * lookDist + bobY * 1.5 + shakeY,
          targetCamPos.z + Math.sin(yaw) * lookDist
        );

        currentCamPos.lerp(targetCamPos, Math.min(1, dt * 18));
        currentLookAt.lerp(targetLookAt, Math.min(1, dt * 18));
        camera.position.copy(currentCamPos);
        camera.lookAt(currentLookAt);

      } else {
        dino.headGroup.visible = true;
        if (!state.isDragging && Math.abs(state.velAzimuth) < 0.02) {
          state.freeOrbitAutoAngle += dt * 0.22;
        }
        const radius = Math.max(7, Math.min(34, 15.5 + state.zoomDistanceOffset));
        const azimuth = state.freeOrbitAutoAngle + state.orbitAzimuth;
        const polar = Math.max(0.22, Math.min(Math.PI * 0.46, 1.15 - state.orbitPolar));

        targetLookAt.set(2.5 + shakeX, 1.6 + state.dinoY * 0.4 + shakeY, 0);
        targetCamPos.set(
          targetLookAt.x + radius * Math.sin(polar) * Math.sin(azimuth),
          targetLookAt.y + radius * Math.cos(polar),
          targetLookAt.z + radius * Math.sin(polar) * Math.cos(azimuth)
        );

        currentCamPos.lerp(targetCamPos, Math.min(1, dt * 9));
        currentLookAt.lerp(targetLookAt, Math.min(1, dt * 10));
        camera.position.copy(currentCamPos);
        camera.lookAt(currentLookAt);
      }

      skyDome.position.copy(camera.position);
    }

    // Day & Night Cycle
    const dayHemiSky = new THREE.Color(0xfffbeb);
    const dayHemiGround = new THREE.Color(0xc27838);
    const nightHemiSky = new THREE.Color(0x38bdf8);
    const nightHemiGround = new THREE.Color(0x0f172a);
    const dayDirColor = new THREE.Color(0xfff5e4);
    const nightDirColor = new THREE.Color(0x93c5fd);

    const stormFogDay = new THREE.Color(0x334155);
    const stormFogNight = new THREE.Color(0x050b14);

    function updateDayNightCycle(dt) {
      // 1. Day / Night Orbital Cycle
      const cyclePeriod = Math.floor(state.score / 700);
      state.isNight = (cyclePeriod % 2) === 1;

      const targetMix = state.isNight ? 1 : 0;
      state.dayNightMix += (targetMix - state.dayNightMix) * Math.min(1, dt * 1.5);

      // 2. Random Weather Transitions (Rain occurs randomly in day or night)
      state.weatherTimer -= dt;
      if (state.weatherTimer <= 0) {
        if (state.weather === 'CLEAR') {
          // 45% chance of precipitation
          if (Math.random() < 0.45) {
            state.weather = 'RAIN';
            state.weatherTimer = 22 + Math.random() * 20; // Rain lasts 22-42s
          } else {
            state.weatherTimer = 24 + Math.random() * 20;
          }
        } else {
          state.weather = 'CLEAR';
          state.weatherTimer = 28 + Math.random() * 25; // Clear lasts 28-53s
        }
      }

      const targetRain = state.weather === 'RAIN' ? 1.0 : 0.0;
      state.rainIntensity = THREE.MathUtils.lerp(state.rainIntensity, targetRain, dt * 0.9);

      // Rain particles update
      if (rainPoints) {
        rainMat.opacity = state.rainIntensity * 0.68;
        rainPoints.visible = state.rainIntensity > 0.02;

        if (rainPoints.visible) {
          const pos = rainGeo.attributes.position;
          const pArr = pos.array;
          const camX = camera.position.x;
          const camZ = camera.position.z;

          for (let i = 0; i < RAIN_COUNT; i++) {
            const idx = i * 3;
            pArr[idx + 1] -= rainVelocities[i] * dt;
            pArr[idx] -= (state.speed * 0.35 + 14) * dt; // Slant with wind

            if (pArr[idx + 1] <= 0.05) {
              pArr[idx + 1] = 26 + Math.random() * 8;
              pArr[idx] = camX - 25 + Math.random() * 70;
              pArr[idx + 2] = camZ - 20 + Math.random() * 40;
            }
          }
          pos.needsUpdate = true;
        }
      }

      // Wet desert sand sheen during rain
      mats.sandGround.roughness = 0.88 - state.rainIntensity * 0.42;
      mats.sandGround.metalness = state.rainIntensity * 0.16;

      // Occasional lightning flash during rain
      if (state.weather === 'RAIN' && state.rainIntensity > 0.55) {
        state.lightningTimer -= dt;
        if (state.lightningTimer <= 0) {
          state.lightningIntensity = 1.0;
          state.lightningTimer = 7 + Math.random() * 12;
          sound.playThunder();
        }
      }
      if (state.lightningIntensity > 0) {
        state.lightningIntensity = Math.max(0, state.lightningIntensity - dt * 5.0);
      }

      // Sky & Atmospheric Fog Shading
      skyDomeMat.uniforms.mixNight.value = state.dayNightMix;
      currentFogColor.copy(dayFogColor).lerp(nightFogColor, state.dayNightMix);
      const stormFog = state.isNight ? stormFogNight : stormFogDay;
      currentFogColor.lerp(stormFog, state.rainIntensity * 0.85);

      if (state.lightningIntensity > 0.1) {
        currentFogColor.lerp(new THREE.Color(0xc7d2fe), state.lightningIntensity * 0.7);
      }
      scene.fog.color.copy(currentFogColor);
      scene.fog.density = 0.0072 + state.rainIntensity * 0.005;

      // Lights
      hemiLight.color.copy(dayHemiSky).lerp(nightHemiSky, state.dayNightMix);
      hemiLight.groundColor.copy(dayHemiGround).lerp(nightHemiGround, state.dayNightMix);
      hemiLight.intensity = (0.68 - state.dayNightMix * 0.25) * (1 - state.rainIntensity * 0.35);

      const baseDirColor = state.isNight ? nightDirColor : dayDirColor;
      dirLight.color.copy(state.lightningIntensity > 0.1 ? new THREE.Color(0xe0e7ff) : baseDirColor);
      dirLight.intensity = ((1.35 - state.dayNightMix * 0.48) * (1 - state.rainIntensity * 0.45)) + (state.lightningIntensity * 2.8);
      rimLight.intensity = (0.48 - state.dayNightMix * 0.22) * (1 - state.rainIntensity * 0.4);

      // Celestial Bodies
      const angle = state.dayNightMix * Math.PI;
      sunMesh.position.y = Math.cos(angle) * 46;
      sunMesh.position.z = -85 + Math.sin(angle) * 18;
      moonMesh.position.y = -Math.cos(angle) * 46;
      moonMesh.position.z = -85 - Math.sin(angle) * 18;

      starsMat.opacity = Math.max(0, (state.dayNightMix - 0.2) / 0.8) * (1 - state.rainIntensity * 0.9);
      starField.rotation.y += dt * 0.012;

      // HUD Status Display
      if (cycleIconEl && cycleLabelEl) {
        if (state.isNight) {
          if (state.weather === 'RAIN' && state.rainIntensity > 0.3) {
            cycleIconEl.textContent = '⛈️';
            cycleLabelEl.textContent = 'Stormy Night';
          } else {
            cycleIconEl.textContent = '🌙';
            cycleLabelEl.textContent = 'Starry Night';
          }
        } else {
          if (state.weather === 'RAIN' && state.rainIntensity > 0.3) {
            cycleIconEl.textContent = '🌧️';
            cycleLabelEl.textContent = 'Rainy Day';
          } else {
            cycleIconEl.textContent = '☀️';
            cycleLabelEl.textContent = 'Sonoran Day';
          }
        }
      }
    }

    // Kinematics & Physics
    function triggerJump() {
      if (state.mode === 'START') {
        startGame();
        return;
      }
      if (state.mode === 'GAMEOVER') {
        if (state.crashTimer > 0.35) startGame();
        return;
      }
      if (state.mode === 'PAUSED') {
        togglePause();
        return;
      }
      if (state.mode === 'PLAYING' && !state.isJumping) {
        state.isJumping = true;
        state.isHoldingJump = true;
        state.jumpHoldTimer = 0;
        state.dinoVy = state.jumpInitialVy;
        state.isDucking = false;
        spawnFootstepDust(0, 0, 5);
        sound.playJump();
      }
    }

    function setDucking(active) {
      if (state.mode !== 'PLAYING') return;
      if (active && !state.isDucking) {
        sound.playDuck();
      }
      state.isDucking = active;
      if (active && state.isJumping && state.dinoVy > -12) {
        state.dinoVy = -27;
      }
    }

    function updateDino(dt) {
      if (state.mode === 'PLAYING') {
        if (state.isJumping) {
          if (state.isHoldingJump && state.jumpHoldTimer < 0.17 && state.dinoVy > 0) {
            state.dinoVy += 35 * dt;
            state.jumpHoldTimer += dt;
          }
          const gravMultiplier = state.isDucking ? 2.45 : 1.0;
          state.dinoVy += state.gravity * gravMultiplier * dt;
          state.dinoY += state.dinoVy * dt;

          if (state.dinoY <= 0) {
            state.dinoY = 0;
            state.dinoVy = 0;
            state.isJumping = false;
            state.isHoldingJump = false;
            spawnFootstepDust(0.1, 0.4, 4);
            spawnFootstepDust(0.1, -0.4, 4);
            sound.playFootstep();
          }
        }

        const cadence = state.isDucking ? 22 : 17;
        state.runPhase += dt * cadence * (state.speed / state.baseSpeed);

        if (!state.isJumping) {
          const currentHalfCycle = Math.floor(state.runPhase / Math.PI);
          if (currentHalfCycle > state.lastStepHalfCycle) {
            state.lastStepHalfCycle = currentHalfCycle;
            const isLeftFoot = currentHalfCycle % 2 === 0;
            spawnFootstepDust(-0.1, isLeftFoot ? 0.45 : -0.45, 2);
            sound.playFootstep();
          }
        }
      } else if (state.mode === 'START') {
        state.runPhase += dt * 2.4;
      }

      dino.root.position.y = state.dinoY;

      const legLKnee = dino.legL.userData.kneePivot;
      const legRKnee = dino.legR.userData.kneePivot;

      if (state.mode === 'GAMEOVER') {
        state.crashTimer += dt;
        dino.aliveEyes.visible = false;
        dino.deadEyes.visible = true;
        dino.bodyPivot.rotation.z = THREE.MathUtils.lerp(dino.bodyPivot.rotation.z, -0.68, dt * 10);
        dino.bodyPivot.rotation.x = THREE.MathUtils.lerp(dino.bodyPivot.rotation.x, 0.58, dt * 10);
        dino.bodyPivot.position.y = THREE.MathUtils.lerp(dino.bodyPivot.position.y, 0.92, dt * 10);
        dino.jawPivot.rotation.z = THREE.MathUtils.lerp(dino.jawPivot.rotation.z, -0.52, dt * 12);
        dino.legL.rotation.z = 0.55;
        dino.legR.rotation.z = -0.45;
      } else {
        dino.aliveEyes.visible = true;
        dino.deadEyes.visible = false;
        dino.bodyPivot.rotation.x = THREE.MathUtils.lerp(dino.bodyPivot.rotation.x, 0, dt * 12);

        if (state.isJumping) {
          dino.bodyPivot.position.y = THREE.MathUtils.lerp(dino.bodyPivot.position.y, 1.46, dt * 14);
          dino.bodyPivot.rotation.z = THREE.MathUtils.lerp(dino.bodyPivot.rotation.z, 0.14, dt * 12);
          dino.headGroup.position.set(0.84, 0.58, 0);
          dino.jawPivot.rotation.z = THREE.MathUtils.lerp(dino.jawPivot.rotation.z, -0.26, dt * 12);

          dino.legL.rotation.z = THREE.MathUtils.lerp(dino.legL.rotation.z, 0.62, dt * 15);
          dino.legR.rotation.z = THREE.MathUtils.lerp(dino.legR.rotation.z, 0.44, dt * 15);
          legLKnee.rotation.z = THREE.MathUtils.lerp(legLKnee.rotation.z, -0.65, dt * 15);
          legRKnee.rotation.z = THREE.MathUtils.lerp(legRKnee.rotation.z, -0.55, dt * 15);

          dino.tailPivot.rotation.y = Math.sin(state.runPhase * 0.5) * 0.12;
        } else if (state.isDucking && state.mode === 'PLAYING') {
          const bounce = Math.abs(Math.cos(state.runPhase)) * 0.08;
          dino.bodyPivot.position.y = THREE.MathUtils.lerp(dino.bodyPivot.position.y, 0.90 + bounce, dt * 18);
          dino.bodyPivot.rotation.z = THREE.MathUtils.lerp(dino.bodyPivot.rotation.z, -0.48, dt * 18);
          dino.headGroup.position.set(0.95, 0.34, 0);
          dino.headGroup.rotation.z = THREE.MathUtils.lerp(dino.headGroup.rotation.z, 0.38, dt * 18);
          dino.jawPivot.rotation.z = THREE.MathUtils.lerp(dino.jawPivot.rotation.z, -0.06, dt * 15);

          const sL = Math.sin(state.runPhase);
          const sR = Math.sin(state.runPhase + Math.PI);
          dino.legL.rotation.z = sL * 0.78;
          dino.legR.rotation.z = sR * 0.78;
          legLKnee.rotation.z = Math.min(0, -Math.cos(state.runPhase) * 0.55);
          legRKnee.rotation.z = Math.min(0, -Math.cos(state.runPhase + Math.PI) * 0.55);

          dino.tailPivot.rotation.y = Math.sin(state.runPhase * 0.6) * 0.22;
          dino.tailSeg2.rotation.y = Math.sin(state.runPhase * 0.6 - 0.6) * 0.25;
          dino.tailSeg3.rotation.y = Math.sin(state.runPhase * 0.6 - 1.2) * 0.28;
        } else if (state.mode === 'PLAYING') {
          const bounce = Math.abs(Math.cos(state.runPhase)) * 0.14;
          dino.bodyPivot.position.y = THREE.MathUtils.lerp(dino.bodyPivot.position.y, 1.42 + bounce, dt * 16);
          dino.bodyPivot.rotation.z = THREE.MathUtils.lerp(dino.bodyPivot.rotation.z, 0.02 * Math.sin(state.runPhase * 2), dt * 16);
          dino.headGroup.position.set(0.84, 0.58 + bounce * 0.28, 0);
          dino.headGroup.rotation.z = THREE.MathUtils.lerp(dino.headGroup.rotation.z, 0, dt * 16);
          dino.jawPivot.rotation.z = THREE.MathUtils.lerp(dino.jawPivot.rotation.z, -0.07 - Math.abs(Math.sin(state.runPhase * 0.5)) * 0.07, dt * 12);

          const sL = Math.sin(state.runPhase);
          const sR = Math.sin(state.runPhase + Math.PI);
          dino.legL.rotation.z = sL * 0.84;
          dino.legR.rotation.z = sR * 0.84;
          legLKnee.rotation.z = Math.min(0.1, -Math.cos(state.runPhase) * 0.62 - 0.15);
          legRKnee.rotation.z = Math.min(0.1, -Math.cos(state.runPhase + Math.PI) * 0.62 - 0.15);

          dino.armL.rotation.z = Math.cos(state.runPhase) * 0.22;
          dino.armR.rotation.z = -Math.cos(state.runPhase) * 0.22;

          dino.tailPivot.rotation.y = Math.sin(state.runPhase * 0.5) * 0.18;
          dino.tailSeg2.rotation.y = Math.sin(state.runPhase * 0.5 - 0.65) * 0.22;
          dino.tailSeg3.rotation.y = Math.sin(state.runPhase * 0.5 - 1.3) * 0.26;
        } else {
          const breath = Math.sin(state.runPhase) * 0.05;
          dino.bodyPivot.position.y = 1.42 + breath;
          dino.bodyPivot.rotation.z = 0;
          dino.headGroup.position.set(0.84, 0.58 + breath * 0.5, 0);
          dino.headGroup.rotation.z = 0;
          dino.jawPivot.rotation.z = -0.06 + breath * 0.45;
          dino.legL.rotation.z = 0;
          dino.legR.rotation.z = 0;
          legLKnee.rotation.z = 0;
          legRKnee.rotation.z = 0;
          dino.tailPivot.rotation.y = Math.cos(state.runPhase * 0.7) * 0.12;
          dino.tailSeg2.rotation.y = Math.cos(state.runPhase * 0.7 - 0.5) * 0.14;
          dino.tailSeg3.rotation.y = Math.cos(state.runPhase * 0.7 - 1.0) * 0.16;
        }
      }

      const hbHeight = (state.isDucking && !state.isJumping) ? 1.35 : 2.35;
      const hbWidth = (state.isDucking && !state.isJumping) ? 1.85 : 1.35;
      const hbCenterY = state.dinoY + hbHeight * 0.5 + 0.12;
      const hbCenterX = (state.isDucking && !state.isJumping) ? 0.38 : 0.22;

      dino.hitboxMesh.scale.set(hbWidth, hbHeight, 0.85);
      dino.hitboxMesh.position.set(hbCenterX, hbCenterY, 0);
      dino.hitboxMesh.visible = state.showHitboxes;

      dino.boundingBox.setFromCenterAndSize(
        dino.hitboxMesh.position,
        dino.hitboxMesh.scale
      );
    }

    // World & Obstacles Simulation
    function updateWorldAndObstacles(dt) {
      crashParticles.forEach((p) => {
        if (!p.active) return;
        p.vel.y -= 36 * dt;
        p.mesh.position.addScaledVector(p.vel, dt);
        p.mesh.rotation.x += p.rotVel.x * dt;
        p.mesh.rotation.y += p.rotVel.y * dt;
        p.mesh.rotation.z += p.rotVel.z * dt;
        if (p.mesh.position.y < 0.12) {
          p.mesh.position.y = 0.12;
          p.vel.y *= -0.45;
          p.vel.x *= 0.75;
          p.vel.z *= 0.75;
        }
      });

      worldPool.dustPuffs.forEach((p) => {
        if (!p.active) return;
        p.age += dt;
        if (p.age >= p.maxAge) {
          p.active = false;
          p.mesh.visible = false;
          return;
        }
        p.mesh.position.addScaledVector(p.vel, dt);
        const progress = p.age / p.maxAge;
        p.mesh.scale.setScalar(0.55 + progress * 1.35);
        p.mesh.material.opacity = (1 - progress) * 0.55;
      });

      worldPool.clouds.forEach((cloud) => {
        const moveSpeed = state.mode === 'PLAYING' ? state.speed * cloud.userData.speedFactor : 2.0;
        cloud.position.x -= moveSpeed * dt;
        if (cloud.position.x < -80) {
          cloud.position.x = 135 + Math.random() * 25;
        }
      });

      if (state.mode !== 'PLAYING') return;

      state.speed = Math.min(55, state.baseSpeed + (state.score * 0.0115));
      const mult = state.speed / state.baseSpeed;
      state.maxSpeedReached = Math.max(state.maxSpeedReached, mult);
      if (speedEl) speedEl.textContent = mult.toFixed(1) + 'x';

      state.distance += state.speed * dt;
      state.score += dt * 11.5 * Math.pow(mult, 0.65);

      const intScore = Math.floor(state.score);
      if (scoreEl) scoreEl.textContent = formatScore(intScore);

      const currentHundred = Math.floor(intScore / 100);
      if (currentHundred > state.lastMilestone && intScore >= 100) {
        state.lastMilestone = currentHundred;
        sound.playMilestone();
        if (scoreEl) {
          scoreEl.classList.remove('milestone-flash');
          void scoreEl.offsetWidth;
          scoreEl.classList.add('milestone-flash');
        }
      }

      worldPool.groundTiles.forEach((tile) => {
        tile.position.x -= state.speed * dt;
        if (tile.position.x < -TILE_LENGTH * 1.5) {
          tile.position.x += TILE_LENGTH * NUM_TILES;
        }
      });

      // Mountains pass away naturally as runner moves forward (locked to ground, zero sand sliding)
      worldPool.mesas.forEach((pyramid) => {
        pyramid.position.x -= state.speed * dt;
        if (pyramid.position.x < -90) {
          pyramid.position.x = 220 + Math.random() * 40;
          const side = Math.random() > 0.5 ? 1 : -1;
          pyramid.position.z = side * (44 + Math.random() * 36);
        }
      });

      worldPool.dunes.forEach((dune) => {
        dune.position.x -= state.speed * dt * 0.82;
        if (dune.position.x < -60) {
          dune.position.x = 155 + Math.random() * 25;
        }
      });

      worldPool.rocks.forEach((rock) => {
        rock.position.x -= state.speed * dt;
        if (rock.position.x < -45) {
          rock.position.x = 145 + Math.random() * 20;
        }
      });

      worldPool.scrubs.forEach((bush) => {
        bush.position.x -= state.speed * dt;
        if (bush.position.x < -45) {
          bush.position.x = 140 + Math.random() * 25;
        }
      });

      // Desert Wildlife: Anchored strictly to ground (no sliding!), performing rich random in-place movements
      worldPool.animals.forEach((animal) => {
        // Move strictly with the ground tiles speed: zero drift, zero sliding across sand!
        animal.root.position.x -= state.speed * dt;

        animal.animTime += dt;
        animal.behaviorTimer -= dt;

        if (animal.behaviorTimer <= 0) {
          const behaviors = ['SNIFF', 'LOOK', 'ALERT', 'FIDGET', 'REST'];
          animal.behavior = behaviors[Math.floor(Math.random() * behaviors.length)];
          animal.behaviorTimer = 2.0 + Math.random() * 3.5;
          animal.targetAngle = Math.random() * Math.PI * 2;
        }

        // Smoothly rotate body in place to random target heading
        animal.currentAngle = THREE.MathUtils.lerp(animal.currentAngle, animal.targetAngle, dt * 2.4);
        animal.root.rotation.y = animal.currentAngle;

        // Perform random lifelike behavioral motions in place
        const t = animal.animTime;
        if (animal.behavior === 'SNIFF') {
          if (animal.head) {
            animal.head.rotation.z = -0.22 + Math.sin(t * 3.5) * 0.08;
            animal.head.rotation.y = Math.sin(t * 4.2) * 0.25;
          }
          if (animal.tail) animal.tail.rotation.y = Math.sin(t * 5.0) * 0.35;
          animal.legs.forEach((leg, idx) => {
            leg.rotation.x = Math.sin(t * 1.5 + idx) * 0.04;
          });
        } else if (animal.behavior === 'LOOK') {
          if (animal.head) {
            animal.head.rotation.z = 0.08 + Math.sin(t * 1.5) * 0.06;
            animal.head.rotation.y = Math.sin(t * 1.8) * 0.45;
          }
          if (animal.tail) animal.tail.rotation.y = Math.sin(t * 2.0) * 0.2;
          animal.legs.forEach((leg) => { leg.rotation.x = 0; });
        } else if (animal.behavior === 'ALERT') {
          if (animal.head) {
            animal.head.rotation.z = 0.28 + Math.sin(t * 6.0) * 0.04;
            animal.head.rotation.y = Math.sin(t * 2.5) * 0.15;
          }
          if (animal.tail) animal.tail.rotation.y = Math.sin(t * 8.0) * 0.4;
          animal.legs.forEach((leg) => { leg.rotation.x = 0; });
        } else if (animal.behavior === 'FIDGET') {
          // Stepping in place gently on hot sand (in-place footwork without coordinate translation)
          const stepSpeed = 7.0;
          const s1 = Math.sin(t * stepSpeed) * 0.22;
          const s2 = Math.sin(t * stepSpeed + Math.PI) * 0.22;
          if (animal.legs[0]) animal.legs[0].rotation.x = s1;
          if (animal.legs[1]) animal.legs[1].rotation.x = s2;
          if (animal.legs[2]) animal.legs[2].rotation.x = s2;
          if (animal.legs[3]) animal.legs[3].rotation.x = s1;
          if (animal.tail) animal.tail.rotation.y = Math.sin(t * 4.0) * 0.3;
          if (animal.head) {
            animal.head.rotation.z = Math.sin(t * 3.5) * 0.12;
            animal.head.rotation.y = Math.cos(t * 2.0) * 0.2;
          }
        } else {
          // REST: calm breathing and subtle tail motion
          if (animal.head) {
            animal.head.rotation.z = Math.sin(t * 1.2) * 0.05;
            animal.head.rotation.y = Math.sin(t * 0.8) * 0.1;
          }
          if (animal.tail) animal.tail.rotation.y = Math.sin(t * 1.5) * 0.18;
          animal.legs.forEach((leg) => { leg.rotation.x = 0; });
        }

        // When scrolled past behind the camera, respawn ahead at a fresh spot on the desert sand
        if (animal.root.position.x < -55) {
          animal.root.position.x = 135 + Math.random() * 40;
          const side = Math.random() > 0.5 ? 1 : -1;
          animal.root.position.z = side * (5.8 + Math.random() * 16.0);
          animal.targetAngle = Math.random() * Math.PI * 2;
          animal.currentAngle = animal.targetAngle;
          animal.root.rotation.y = animal.currentAngle;
        }
      });

      // Ambient Sky Birds (Random 3D Soaring, Banking & Gliding in camera view)
      worldPool.birds.forEach((bird) => {
        bird.glideTimer -= dt;
        if (bird.glideTimer <= 0) {
          bird.isGliding = !bird.isGliding;
          bird.glideTimer = bird.isGliding ? 2.5 + Math.random() * 3.0 : 1.5 + Math.random() * 2.0;
          bird.turnRate = (Math.random() - 0.5) * 1.3;
        }

        bird.heading += bird.turnRate * dt;
        // Keep them soaring in visible view ahead of the runner
        const vx = Math.cos(bird.heading) * bird.speed - (state.speed * 0.4);
        const vz = Math.sin(bird.heading) * bird.speed;

        bird.root.position.x += vx * dt;
        bird.root.position.z += vz * dt;
        bird.root.position.y = bird.baseY + Math.sin(state.time * 2.0 + bird.sinOffset) * 0.7;

        bird.root.rotation.y = -bird.heading + Math.PI / 2;
        bird.root.rotation.z = -bird.turnRate * 0.4;

        if (bird.isGliding) {
          bird.wingL.rotation.x = Math.sin(state.time * 2.0) * 0.04;
          bird.wingR.rotation.x = -Math.sin(state.time * 2.0) * 0.04;
        } else {
          bird.flapPhase += dt * bird.flapSpeed;
          const wingAngle = Math.sin(bird.flapPhase) * 0.48;
          bird.wingL.rotation.x = wingAngle;
          bird.wingR.rotation.x = -wingAngle;
        }

        // Keep birds circling in front of the camera in clear visible range
        if (bird.root.position.x < -8) {
          bird.root.position.x = 42 + Math.random() * 25;
          bird.root.position.z = (Math.random() - 0.5) * 22;
          bird.heading = Math.random() * Math.PI * 2;
        }
        if (bird.root.position.x > 68) bird.heading = Math.PI;
        if (bird.root.position.z > 20) bird.heading = Math.PI * 0.75;
        if (bird.root.position.z < -20) bird.heading = -Math.PI * 0.25;
      });

      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        spawnObstacle();
        const minGap = Math.max(0.58, 1.32 - (mult - 1) * 0.36);
        const maxGap = Math.max(1.05, 2.05 - (mult - 1) * 0.45);
        spawnTimer = minGap + Math.random() * (maxGap - minGap);
      }

      for (let i = activeObstacles.length - 1; i >= 0; i--) {
        const obs = activeObstacles[i];
        const obsSpeed = obs.type === 'PTERODACTYL' ? state.speed * 1.15 : state.speed;
        obs.root.position.x -= obsSpeed * dt;

        if (obs.type === 'PTERODACTYL') {
          obs.flapPhase += dt * 13.5;
          const wingAngle = Math.sin(obs.flapPhase) * 0.64;
          obs.wingL.rotation.x = wingAngle;
          obs.wingR.rotation.x = -wingAngle;
          obs.root.position.y += Math.cos(obs.flapPhase) * 0.015;
        }

        const center = new THREE.Vector3().copy(obs.root.position).add(obs.hitOffset);
        obs.boundingBox.setFromCenterAndSize(center, obs.hitSize);

        if (dino.boundingBox.intersectsBox(obs.boundingBox)) {
          handleGameOver(obs.altitudeLabel);
          return;
        }

        if (obs.root.position.x < -32) {
          obs.active = false;
          obs.root.visible = false;
          activeObstacles.splice(i, 1);
        }
      }
    }

    // Game Lifecycle
    function startGame() {
      sound.init();
      sound.playBlip(580, 0.08);

      activeObstacles.forEach((o) => {
        o.active = false;
        o.root.visible = false;
      });
      activeObstacles.length = 0;

      crashParticles.forEach((p) => {
        p.active = false;
        p.mesh.visible = false;
      });

      // Ensure ambient birds are immediately visible in forward sky
      worldPool.birds.forEach((bird, i) => {
        bird.root.position.set(
          14 + i * 8 + Math.random() * 4,
          bird.baseY,
          (Math.random() - 0.5) * 22
        );
        bird.heading = Math.random() * Math.PI * 2;
      });

      state.mode = 'PLAYING';
      state.score = 0;
      state.lastMilestone = 0;
      state.speed = state.baseSpeed;
      state.maxSpeedReached = 1.0;
      state.distance = 0;
      state.dinoY = 0;
      state.dinoVy = 0;
      state.isJumping = false;
      state.isHoldingJump = false;
      state.isDucking = false;
      state.lastStepHalfCycle = 0;
      state.crashTimer = 0;
      state.cameraShake = 0;
      spawnTimer = 0.9;

      if (scoreEl) scoreEl.textContent = '00000';
      if (speedEl) speedEl.textContent = '1.0x';
      if (btnPause) btnPause.textContent = '⏸️';

      if (overlayStart) overlayStart.classList.add('hidden');
      if (overlayPause) overlayPause.classList.add('hidden');
      if (overlayGameover) overlayGameover.classList.add('hidden');
    }

    function togglePause() {
      if (state.mode === 'PLAYING') {
        state.mode = 'PAUSED';
        if (btnPause) btnPause.textContent = '▶️';
        if (overlayPause) overlayPause.classList.remove('hidden');
        sound.playBlip(340, 0.06);
      } else if (state.mode === 'PAUSED') {
        state.mode = 'PLAYING';
        if (btnPause) btnPause.textContent = '⏸️';
        if (overlayPause) overlayPause.classList.add('hidden');
        sound.playBlip(520, 0.06);
      }
    }

    function handleGameOver(obstacleName) {
      state.mode = 'GAMEOVER';
      state.crashTimer = 0;
      state.cameraShake = 0.85;
      state.isHoldingJump = false;
      state.isDucking = false;
      sound.playCrash();

      triggerCrashExplosion(dino.root.position);

      const finalScoreInt = Math.floor(state.score);
      const isNewRecord = finalScoreInt > state.highScore;
      if (isNewRecord) {
        state.highScore = finalScoreInt;
        try {
          localStorage.setItem(STORAGE_KEY, String(state.highScore));
        } catch {}
      }

      if (highScoreEl) highScoreEl.textContent = formatScore(state.highScore);
      if (finalScoreEl) finalScoreEl.textContent = formatScore(finalScoreInt);
      if (finalHighScoreEl) finalHighScoreEl.textContent = formatScore(state.highScore);
      if (finalSpeedEl) finalSpeedEl.textContent = state.maxSpeedReached.toFixed(1) + 'x';
      if (crashReasonEl) {
        crashReasonEl.textContent = `Crashed into ${obstacleName}! Drag anywhere to orbit the 3D scene.`;
      }

      if (newRecordBadge) {
        if (isNewRecord && finalScoreInt > 0) {
          newRecordBadge.classList.remove('hidden');
        } else {
          newRecordBadge.classList.add('hidden');
        }
      }

      if (overlayGameover) overlayGameover.classList.remove('hidden');
    }

    function toggleHitboxes() {
      state.showHitboxes = !state.showHitboxes;
      dino.hitboxMesh.visible = state.showHitboxes;
      obstaclePool.forEach((o) => {
        o.hbMesh.visible = state.showHitboxes && o.active;
      });
      if (btnHitbox) {
        btnHitbox.classList.toggle('border-emerald-400', state.showHitboxes);
        btnHitbox.classList.toggle('text-emerald-300', state.showHitboxes);
      }
      sound.playBlip(state.showHitboxes ? 700 : 420, 0.05);
    }

    // Keyboard controls
    const onKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        if (!e.repeat) {
          triggerJump();
        }
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        setDucking(true);
      } else if (e.code === 'KeyC') {
        e.preventDefault();
        setPovMode(state.povIndex + 1);
      } else if (e.code === 'KeyP') {
        e.preventDefault();
        togglePause();
      } else if (e.code === 'KeyH') {
        e.preventDefault();
        toggleHitboxes();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        const isMuted = sound.toggleMute();
        if (btnMute) btnMute.textContent = isMuted ? '🔇' : '🔊';
      } else if (e.code === 'KeyR') {
        if (state.mode === 'GAMEOVER' || state.mode === 'PAUSED') {
          startGame();
        }
      }
    };

    const onKeyUp = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        state.isHoldingJump = false;
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        setDucking(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Pointer Drag Orbit & Tap/Swipe Detection
    const onPointerDown = (e) => {
      sound.init();
      state.isDragging = true;
      state.dragMovedDistance = 0;
      state.lastPointerX = e.clientX;
      state.lastPointerY = e.clientY;
      state.pointerStartX = e.clientX;
      state.pointerStartY = e.clientY;
      state.pointerDownTime = performance.now();
      state.velAzimuth = 0;
      state.velPolar = 0;
    };

    const onPointerMove = (e) => {
      if (!state.isDragging) return;
      const dx = e.clientX - state.lastPointerX;
      const dy = e.clientY - state.lastPointerY;
      state.lastPointerX = e.clientX;
      state.lastPointerY = e.clientY;

      const stepDist = Math.hypot(dx, dy);
      state.dragMovedDistance += stepDist;

      const sensitivity = 0.0055;
      state.orbitAzimuth -= dx * sensitivity;
      state.orbitPolar += dy * sensitivity;
      state.velAzimuth = (-dx * sensitivity) * 32;
      state.velPolar = (dy * sensitivity) * 32;
    };

    const onPointerUp = (e) => {
      if (!state.isDragging) return;
      state.isDragging = false;

      const elapsed = performance.now() - state.pointerDownTime;
      const totalDx = e.clientX - state.pointerStartX;
      const totalDy = e.clientY - state.pointerStartY;

      if (state.dragMovedDistance < 10 && elapsed < 260) {
        triggerJump();
      } else if (elapsed < 280 && Math.abs(totalDy) > 42 && Math.abs(totalDy) > Math.abs(totalDx) * 1.5) {
        if (totalDy < 0) {
          triggerJump();
        } else {
          setDucking(true);
          setTimeout(() => setDucking(false), 420);
        }
      }
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const onWheel = (e) => {
      e.preventDefault();
      state.zoomDistanceOffset = Math.max(-6, Math.min(14, state.zoomDistanceOffset + e.deltaY * 0.01));
    };
    container.addEventListener('wheel', onWheel, { passive: false });

    // HUD and Button Listeners
    const btnPov = root.querySelector('#dino-btn-pov');
    const onBtnPovClick = () => setPovMode(state.povIndex + 1);
    if (btnPov) btnPov.addEventListener('click', onBtnPovClick);

    const onPillClickHandlers = [];
    povPills.forEach((pill) => {
      const handler = () => {
        const idx = parseInt(pill.getAttribute('data-pov-index'), 10);
        setPovMode(idx);
      };
      pill.addEventListener('click', handler);
      onPillClickHandlers.push({ pill, handler });
    });

    if (btnResetOrbit) btnResetOrbit.addEventListener('click', resetOrbitOffsets);
    if (btnHitbox) btnHitbox.addEventListener('click', toggleHitboxes);
    if (btnPause) btnPause.addEventListener('click', togglePause);

    const onMuteClick = () => {
      const isMuted = sound.toggleMute();
      if (btnMute) btnMute.textContent = isMuted ? '🔇' : '🔊';
    };
    if (btnMute) btnMute.addEventListener('click', onMuteClick);

    const onFullscreenClick = () => {
      const elem = rootRef.current;
      if (!elem) return;

      const isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );

      if (!isFullscreen) {
        if (elem.requestFullscreen) {
          elem.requestFullscreen().catch(() => {});
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    };

    const onFullscreenChange = () => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      if (btnFullscreen) {
        btnFullscreen.textContent = isFullscreen ? '🗗' : '⛶';
        btnFullscreen.title = isFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen';
      }
      setTimeout(handleResize, 100);
    };

    if (btnFullscreen) btnFullscreen.addEventListener('click', onFullscreenClick);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);

    const btnStartGame = root.querySelector('#dino-btn-start-game');
    const btnResumeGame = root.querySelector('#dino-btn-resume-game');
    const btnRestartFromPause = root.querySelector('#dino-btn-restart-from-pause');
    const btnRestartGame = root.querySelector('#dino-btn-restart-game');

    if (btnStartGame) btnStartGame.addEventListener('click', startGame);
    if (btnResumeGame) btnResumeGame.addEventListener('click', togglePause);
    if (btnRestartFromPause) btnRestartFromPause.addEventListener('click', startGame);
    if (btnRestartGame) btnRestartGame.addEventListener('click', startGame);

    // Touch Action Pedals
    const btnTouchJump = root.querySelector('#dino-btn-touch-jump');
    const btnTouchDuck = root.querySelector('#dino-btn-touch-duck');

    const onTouchJumpDown = (e) => {
      e.stopPropagation();
      triggerJump();
    };
    const onTouchJumpUp = (e) => {
      e.stopPropagation();
      state.isHoldingJump = false;
    };
    const onTouchJumpLeave = () => {
      state.isHoldingJump = false;
    };

    if (btnTouchJump) {
      btnTouchJump.addEventListener('pointerdown', onTouchJumpDown);
      btnTouchJump.addEventListener('pointerup', onTouchJumpUp);
      btnTouchJump.addEventListener('pointerleave', onTouchJumpLeave);
    }

    const onTouchDuckDown = (e) => {
      e.stopPropagation();
      setDucking(true);
    };
    const onTouchDuckUp = (e) => {
      e.stopPropagation();
      setDucking(false);
    };
    const onTouchDuckLeave = () => {
      setDucking(false);
    };

    if (btnTouchDuck) {
      btnTouchDuck.addEventListener('pointerdown', onTouchDuckDown);
      btnTouchDuck.addEventListener('pointerup', onTouchDuckUp);
      btnTouchDuck.addEventListener('pointerleave', onTouchDuckLeave);
    }

    // Resize Handler
    function handleResize() {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 500;
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);
    }
    window.addEventListener('resize', handleResize);
    handleResize();

    // Main 60 FPS Render Loop
    let animId = null;
    let lastTime = performance.now();

    function animate(now) {
      animId = requestAnimationFrame(animate);

      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      updateDayNightCycle(dt);
      updateDino(dt);
      updateWorldAndObstacles(dt);
      updateCamera(dt);

      renderer.render(scene, camera);
    }

    animId = requestAnimationFrame(animate);

    // Cleanup on component unmount
    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();

      if (btnPov) btnPov.removeEventListener('click', onBtnPovClick);
      onPillClickHandlers.forEach(({ pill, handler }) => pill.removeEventListener('click', handler));
      if (btnMute) btnMute.removeEventListener('click', onMuteClick);
      if (btnFullscreen) btnFullscreen.removeEventListener('click', onFullscreenClick);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);

      if (btnTouchJump) {
        btnTouchJump.removeEventListener('pointerdown', onTouchJumpDown);
        btnTouchJump.removeEventListener('pointerup', onTouchJumpUp);
        btnTouchJump.removeEventListener('pointerleave', onTouchJumpLeave);
      }
      if (btnTouchDuck) {
        btnTouchDuck.removeEventListener('pointerdown', onTouchDuckDown);
        btnTouchDuck.removeEventListener('pointerup', onTouchDuckUp);
        btnTouchDuck.removeEventListener('pointerleave', onTouchDuckLeave);
      }

      sound.destroy();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative w-full h-[520px] sm:h-[580px] md:h-[640px] rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60 select-none bg-slate-950 text-white font-sans touch-none"
    >
      <style>{`
        .dino-glass-panel {
          background: rgba(15, 23, 42, 0.72);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 12px 32px -6px rgba(0, 0, 0, 0.45);
        }
        .dino-glass-btn {
          background: rgba(30, 41, 59, 0.78);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .dino-glass-btn:hover {
          background: rgba(51, 65, 85, 0.9);
          border-color: rgba(255, 255, 255, 0.32);
          transform: translateY(-1px);
        }
        .dino-glass-btn:active {
          transform: translateY(1px) scale(0.97);
        }
        @keyframes dinoMilestoneBlink {
          0%, 100% { opacity: 1; transform: scale(1); }
          25%, 75% { opacity: 0.25; transform: scale(1.08); color: #fbbf24; }
          50% { opacity: 1; transform: scale(1.14); color: #fbbf24; }
        }
        .milestone-flash {
          animation: dinoMilestoneBlink 0.8s ease-in-out 2;
        }
        @keyframes dinoPulseSubtle {
          0%, 100% { transform: scale(1); opacity: 0.94; }
          50% { transform: scale(1.03); opacity: 1; }
        }
        .dino-pulse-subtle {
          animation: dinoPulseSubtle 2.2s infinite ease-in-out;
        }
        :fullscreen {
          width: 100vw !important;
          height: 100vh !important;
          max-width: 100vw !important;
          max-height: 100vh !important;
          border-radius: 0 !important;
          border: none !important;
        }
        :-webkit-full-screen {
          width: 100vw !important;
          height: 100vh !important;
          max-width: 100vw !important;
          max-height: 100vh !important;
          border-radius: 0 !important;
          border: none !important;
        }
      `}</style>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={canvasContainerRef}
        id="dino-canvas-container"
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        aria-label="3D Chrome Dinosaur Game Canvas"
      />

      {/* Subtle Cinematic Vignette Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: 'radial-gradient(circle at center, transparent 60%, rgba(2, 6, 23, 0.38) 100%)'
        }}
      />

      {/* Top HUD Bar - Responsive Single Line */}
      <header className="pointer-events-none absolute top-0 left-0 right-0 z-30 p-1.5 sm:p-4 flex items-center justify-between gap-1 sm:gap-2 flex-nowrap">
        {/* Left: Day/Speed, Camera Mode, Reset (Back View), Pause */}
        <div className="flex items-center gap-1 sm:gap-2 pointer-events-auto shrink-0">
          {/* Day / Speed Element */}
          <div className="dino-glass-panel rounded-xl px-1.5 py-1 sm:px-3 sm:py-2 flex items-center gap-1 sm:gap-2 shrink-0">
            <span id="dino-cycle-icon" className="text-sm sm:text-lg leading-none" title="Day/Night Cycle">
              ☀️
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1.5">
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" id="dino-status-dot" />
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-300" id="dino-cycle-label">
                  Sonoran Day
                </span>
              </div>
              <div className="text-[10px] sm:text-xs font-semibold text-white/90 flex items-center gap-0.5">
                <span className="hidden sm:inline text-slate-400">Pace</span>
                <span id="dino-speed-display" className="font-mono text-amber-300 text-[10px] sm:text-xs">1.0x</span>
              </div>
            </div>
          </div>

          {/* Camera POV Switch Button */}
          <button
            id="dino-btn-pov"
            type="button"
            className="dino-glass-btn rounded-xl w-9 h-9 sm:w-auto p-1 sm:px-3.5 sm:py-2 flex items-center justify-center sm:justify-start gap-1.5 group cursor-pointer shrink-0"
            title="Switch Camera Perspective (Key: C)"
          >
            <div className="w-5 h-5 sm:w-5 sm:h-5 rounded-lg flex items-center justify-center text-amber-300 font-bold text-xl group-hover:bg-amber-500/30">
              🎥
            </div>
            <div className="hidden md:block text-left">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold leading-tight">Camera Mode (C)</div>
              <div id="dino-pov-label" className="text-xs sm:text-xs font-bold text-amber-300 tracking-tight leading-tight">
                [POV: 3rd Person]
              </div>
            </div>
          </button>

          {/* Reset Orbit Angle to 3rd Person Back View Button */}
          <button
            id="dino-btn-reset-orbit"
            type="button"
            className="dino-glass-btn rounded-xl w-7 h-7 sm:w-auto p-1 sm:px-3 sm:py-2 text-xs font-semibold text-sky-300 flex items-center justify-center gap-1 cursor-pointer shrink-0"
            title="Reset to 3rd Person Back View"
          >
            <span className="text-xs sm:text-sm">↺</span>
            <span className="hidden sm:inline">Back View</span>
          </button>

          {/* Pause / Resume Button (Beside Reset View) */}
          <button
            id="dino-btn-pause"
            type="button"
            className="dino-glass-btn rounded-xl w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-base cursor-pointer shrink-0"
            title="Pause / Resume (Key: P)"
            aria-label="Pause Game"
          >
            ⏸️
          </button>
        </div>

        {/* Right: Scoreboard, Fullscreen */}
        <div className="flex items-center gap-1 sm:gap-2 pointer-events-auto ml-auto shrink-0">
          {/* Score & High Score Panel */}
          <div className="dino-glass-panel rounded-xl px-1.5 py-1 sm:px-3 sm:py-1.5 flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <div className="text-right">
              <div className="hidden sm:block text-[8px] uppercase tracking-wider text-slate-400 font-bold leading-none">High</div>
              <div className="font-mono text-[9px] sm:text-xs font-bold text-slate-300 leading-tight">
                HI <span id="dino-high-score-display">00000</span>
              </div>
            </div>
            <div className="h-3.5 sm:h-5 w-px bg-white/20" />
            <div className="text-right">
              <div className="hidden sm:block text-[8px] uppercase tracking-wider text-amber-400/90 font-bold leading-none">Dist</div>
              <div id="dino-score-display" className="font-mono text-[10px] sm:text-base font-extrabold text-white tracking-wider leading-tight">
                00000
              </div>
            </div>
          </div>

          {/* Fullscreen Toggle Button - Guaranteed 100% visible on Mobile & Desktop */}
          <button
            id="dino-btn-fullscreen"
            type="button"
            className="dino-glass-btn rounded-xl w-7 h-7 sm:w-10 sm:h-10 bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center cursor-pointer shrink-0 shadow-md active:scale-95 transition"
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </button>
        </div>
      </header>

   

      {/* Start / Ready Overlay */}
      <div id="dino-overlay-start" className="absolute inset-0 z-30 flex items-center justify-center p-4 pointer-events-none">
        <div className="dino-glass-panel rounded-2xl p-6 sm:p-7 max-w-md w-full text-center pointer-events-auto border border-white/20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-3">
            <span>🦖 3D CHROME T-REX</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            No Internet Runner 3D
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
            Procedural 3D desert runner with articulated kinematics, 360° free orbit camera drag, 4 perspective POVs, and dynamic day/night cycles!
          </p>

          <div className="grid grid-cols-2 gap-2.5 text-left mb-6 text-xs">
            <div className="rounded-xl bg-slate-800/70 p-2.5 border border-white/10">
              <div className="font-bold text-amber-300 mb-0.5">⬆️ Jump / Higher</div>
              <div className="text-slate-300">Space, ↑, or Tap Canvas</div>
            </div>
            <div className="rounded-xl bg-slate-800/70 p-2.5 border border-white/10">
              <div className="font-bold text-amber-300 mb-0.5">⬇️ Crouch / Dive</div>
              <div className="text-slate-300">Down Arrow or Duck button</div>
            </div>
            <div className="rounded-xl bg-slate-800/70 p-2.5 border border-white/10">
              <div className="font-bold text-sky-300 mb-0.5">🎥 4 Camera POVs</div>
              <div className="text-slate-300">Press <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-white font-mono">C</kbd> or tap POV</div>
            </div>
            <div className="rounded-xl bg-slate-800/70 p-2.5 border border-white/10">
              <div className="font-bold text-emerald-300 mb-0.5">🌐 360° Free Orbit</div>
              <div className="text-slate-300">Click &amp; drag canvas anytime</div>
            </div>
          </div>

          <button
            id="dino-btn-start-game"
            type="button"
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-base shadow-lg shadow-amber-500/25 transition transform active:scale-95 dino-pulse-subtle cursor-pointer"
          >
            PRESS SPACE OR TAP TO RUN
          </button>
        </div>
      </div>

      {/* Pause Overlay */}
      <div id="dino-overlay-pause" className="hidden absolute inset-0 z-30 flex items-center justify-center p-4 pointer-events-none">
        <div className="dino-glass-panel rounded-2xl p-6 sm:p-7 max-w-sm w-full text-center pointer-events-auto border border-white/20">
          <div className="text-3xl mb-2">⏸️</div>
          <h2 className="text-xl font-extrabold text-white mb-1">Simulation Paused</h2>
          <p className="text-xs text-slate-300 mb-5">
            Tip: Drag the canvas or scroll your mouse wheel to inspect the T-Rex anatomy and canyon lighting in freeze-frame!
          </p>
          <div className="flex flex-col gap-2.5">
            <button
              id="dino-btn-resume-game"
              type="button"
              className="w-full py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition cursor-pointer"
            >
              Resume Game (P / Space)
            </button>
            <button
              id="dino-btn-restart-from-pause"
              type="button"
              className="w-full py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-white/10 transition cursor-pointer"
            >
              Restart Run (R)
            </button>
          </div>
        </div>
      </div>

      {/* Game Over Overlay */}
      <div id="dino-overlay-gameover" className="hidden absolute inset-0 z-30 flex items-center justify-center p-4 pointer-events-none">
        <div className="dino-glass-panel rounded-2xl p-6 sm:p-8 max-w-md w-full text-center pointer-events-auto border border-rose-500/30">
          <div
            id="dino-new-record-badge"
            className="hidden inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold uppercase tracking-wider mb-2"
          >
            🏆 New High Score!
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">
            GAME OVER
          </h2>
          <p id="dino-crash-reason" className="text-xs text-rose-300 font-medium mb-5">
            Collided with a desert obstacle! Drag the scene to inspect the crash.
          </p>

          <div className="grid grid-cols-3 gap-2.5 mb-6">
            <div className="rounded-xl bg-slate-800/80 p-3 border border-white/10">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Score</div>
              <div id="dino-final-score" className="font-mono text-lg sm:text-xl font-extrabold text-white mt-0.5">
                00000
              </div>
            </div>
            <div className="rounded-xl bg-slate-800/80 p-3 border border-white/10">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Best</div>
              <div id="dino-final-high-score" className="font-mono text-lg sm:text-xl font-extrabold text-amber-300 mt-0.5">
                00000
              </div>
            </div>
            <div className="rounded-xl bg-slate-800/80 p-3 border border-white/10">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Top Speed</div>
              <div id="dino-final-speed" className="font-mono text-lg sm:text-xl font-extrabold text-emerald-300 mt-0.5">
                1.0x
              </div>
            </div>
          </div>

          <button
            id="dino-btn-restart-game"
            type="button"
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-extrabold text-base shadow-lg shadow-rose-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>↻</span>
            <span>PLAY AGAIN (SPACE / TAP)</span>
          </button>
        </div>
      </div>

      {/* Bottom On-Screen Touch / Quick Action Controls */}
      <div className="pointer-events-none absolute bottom-3 sm:bottom-4 left-3 right-3 sm:left-4 sm:right-4 z-20 flex items-end justify-between gap-3">
        {/* Duck Button */}
        <button
          id="dino-btn-touch-duck"
          type="button"
          className="pointer-events-auto dino-glass-btn rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 flex items-center gap-2 active:bg-amber-500/30 border border-white/20 shadow-lg select-none cursor-pointer"
          aria-label="Duck or Fast Drop"
        >
          <span className="text-xl leading-none">⬇️</span>
          <div className="text-left">
            <div className="text-xs sm:text-sm font-extrabold text-white tracking-wide">DUCK</div>
            <div className="text-[10px] text-slate-300 hidden sm:block">Hold ↓ / Drop</div>
          </div>
        </button>


        {/* Jump Button */}
        <button
          id="dino-btn-touch-jump"
          type="button"
          className="pointer-events-auto dino-glass-btn rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 flex items-center gap-2 active:bg-emerald-500/30 border border-white/20 shadow-lg select-none cursor-pointer"
          aria-label="Jump"
        >
          <div className="text-right">
            <div className="text-xs sm:text-sm font-extrabold text-white tracking-wide">JUMP</div>
            <div className="text-[10px] text-slate-300 hidden sm:block">Space / ↑</div>
          </div>
          <span className="text-xl leading-none">⬆️</span>
        </button>
      </div>
    </div>
  );
};

export default Dino3DGame;
