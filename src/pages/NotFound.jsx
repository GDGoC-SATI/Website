import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaHome,
  FaCalendarAlt,
  FaCode,
  FaRedo,
  FaTrophy,
  FaVolumeUp,
  FaVolumeMute,
  FaGamepad,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import usePageSEO from '../hooks/usePageSEO';

// Sound effects synthesizer using Web Audio API (zero external assets needed)
class SoundFX {
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
      this.ctx.resume();
    }
  }

  jump() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Audio fallback silent
    }
  }

  milestone() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [0, 0.08].forEach((delay, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(i === 0 ? 587.33 : 880, now + delay);
        gain.gain.setValueAtTime(0.15, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.07);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.07);
      });
    } catch {}
  }

  hit() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.22);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch {}
  }
}

const sfx = new SoundFX();

const NotFound = () => {
  usePageSEO({
    title: '404 - Page Not Found',
    description: 'The requested page does not exist on GDG on Campus SATI Vidisha. Play the classic Dino game or head back to camp!',
    path: '/404',
  });

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('gdg_dino_highscore'), 10) || 0;
    } catch {
      return 0;
    }
  });
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'playing' | 'gameover'
  const [isMuted, setIsMuted] = useState(false);
  const [isDucking, setIsDucking] = useState(false);

  // Sync mute state with audio synthesizer
  const toggleMute = () => {
    setIsMuted((prev) => {
      sfx.muted = !prev;
      return !prev;
    });
  };

  // Dino Game Physics & Loop Engine
  const engineRef = useRef({
    animId: null,
    lastTime: 0,
    speed: 6.5,
    distance: 0,
    groundY: 155,
    width: 800,
    height: 200,
    dino: {
      x: 50,
      y: 115,
      width: 44,
      height: 47,
      vy: 0,
      gravity: 0.65,
      jumpVelocity: -12,
      grounded: true,
      ducking: false,
      legFrame: 0,
      legTimer: 0,
    },
    obstacles: [],
    clouds: [],
    groundDots: [],
    nextObstacleDist: 90,
    nextCloudDist: 40,
    milestoneCounter: 0,
  });

  const resetGame = useCallback(() => {
    const e = engineRef.current;
    e.speed = 6.5;
    e.distance = 0;
    e.milestoneCounter = 0;
    e.dino.y = e.groundY - e.dino.height;
    e.dino.vy = 0;
    e.dino.grounded = true;
    e.dino.ducking = false;
    e.obstacles = [];
    e.nextObstacleDist = 80;
    setScore(0);
    setGameState('playing');
  }, []);

  const jump = useCallback(() => {
    const e = engineRef.current;
    if (gameState === 'idle' || gameState === 'gameover') {
      resetGame();
      sfx.jump();
      return;
    }
    if (e.dino.grounded) {
      e.dino.vy = e.dino.jumpVelocity;
      e.dino.grounded = false;
      sfx.jump();
    }
  }, [gameState, resetGame]);

  const setDuck = useCallback((ducking) => {
    const e = engineRef.current;
    e.dino.ducking = ducking;
    setIsDucking(ducking);
    if (ducking && !e.dino.grounded) {
      // Fast fall when ducking in air
      e.dino.vy += 4;
    }
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (evt) => {
      if (evt.code === 'Space' || evt.code === 'ArrowUp') {
        evt.preventDefault();
        jump();
      } else if (evt.code === 'ArrowDown') {
        evt.preventDefault();
        setDuck(true);
      }
    };

    const handleKeyUp = (evt) => {
      if (evt.code === 'ArrowDown') {
        evt.preventDefault();
        setDuck(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [jump, setDuck]);

  // Main Canvas Render & Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const e = engineRef.current;

    // Initialize ground dots & initial clouds
    if (e.groundDots.length === 0) {
      for (let x = 0; x < e.width; x += 15) {
        e.groundDots.push({ x, y: e.groundY + 3 + (Math.sin(x * 12) * 2) });
      }
    }
    if (e.clouds.length === 0) {
      e.clouds.push({ x: 120, y: 35, speed: 0.8 }, { x: 380, y: 55, speed: 0.6 }, { x: 620, y: 25, speed: 0.7 });
    }

    let lastTimestamp = performance.now();

    const loop = (timestamp) => {
      const dt = Math.min((timestamp - lastTimestamp) / 16.666, 2.5);
      lastTimestamp = timestamp;

      // Detect dark mode strictly based on website's root dark class
      const isDarkMode = document.documentElement.classList.contains('dark');

      // Color Palette adhering to GDG Brand Kit with ultra-crisp contrast in both modes
      const colors = {
        bg: isDarkMode ? '#0F172A' : '#F8FAFC',
        ground: isDarkMode ? '#64748B' : '#334155',
        groundDots: isDarkMode ? '#475569' : '#94A3B8',
        dino: isDarkMode ? '#F8FAFC' : '#0F172A',
        dinoEye: isDarkMode ? '#0F172A' : '#FFFFFF',
        cactus: '#16A34A', // Vibrant Google Green
        bird: '#DC2626',   // Vibrant Google Red
        cloud: isDarkMode ? '#334155' : '#CBD5E1',
        text: isDarkMode ? '#E2E8F0' : '#0F172A',
        accentBlue: '#4285F4',
        accentYellow: '#FBBC05',
      };

      // Fill canvas background explicitly for crystal clear contrast in light and dark modes
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, e.width, e.height);

      // 1. Draw Clouds
      ctx.fillStyle = colors.cloud;
      e.clouds.forEach((cloud) => {
        if (gameState === 'playing') {
          cloud.x -= cloud.speed * dt;
          if (cloud.x < -60) {
            cloud.x = e.width + Math.random() * 80;
            cloud.y = 20 + Math.random() * 50;
          }
        }
        // Pixel cloud shape
        ctx.fillRect(cloud.x, cloud.y, 46, 12);
        ctx.fillRect(cloud.x + 10, cloud.y - 7, 26, 7);
        ctx.fillRect(cloud.x + 18, cloud.y - 12, 14, 5);
      });

      // 2. Draw Ground Line & Scrolling Texture
      ctx.fillStyle = colors.ground;
      ctx.fillRect(0, e.groundY, e.width, 2);

      ctx.fillStyle = colors.groundDots;
      e.groundDots.forEach((dot) => {
        if (gameState === 'playing') {
          dot.x -= e.speed * dt;
          if (dot.x < 0) {
            dot.x = e.width + (Math.random() * 20);
            dot.y = e.groundY + 3 + (Math.random() * 6);
          }
        }
        ctx.fillRect(dot.x, dot.y, 2, 2);
      });

      // 3. Update & Spawn Obstacles (Cacti & Pterodactyls)
      if (gameState === 'playing') {
        e.distance += (e.speed * dt) * 0.15;
        const currentDist = Math.floor(e.distance);
        setScore(currentDist);

        // Gradually increase speed
        if (e.speed < 13.5) {
          e.speed += 0.0012 * dt;
        }

        // Milestone beep every 100 points
        const curMilestone = Math.floor(currentDist / 100);
        if (curMilestone > e.milestoneCounter) {
          e.milestoneCounter = curMilestone;
          sfx.milestone();
        }

        e.nextObstacleDist -= e.speed * dt;
        if (e.nextObstacleDist <= 0) {
          // Choose obstacle type: Cactus (single, double, triple) or Bird (at score > 120)
          const allowBirds = currentDist > 120;
          const isBird = allowBirds && Math.random() < 0.32;

          if (isBird) {
            const birdHeights = [e.groundY - 55, e.groundY - 35, e.groundY - 18];
            const chosenY = birdHeights[Math.floor(Math.random() * birdHeights.length)];
            e.obstacles.push({
              type: 'bird',
              x: e.width + 10,
              y: chosenY,
              width: 38,
              height: 28,
              wingState: 0,
              wingTimer: 0,
            });
          } else {
            // Cactus
            const cactusTypes = [
              { width: 16, height: 35, variant: 'single' },
              { width: 28, height: 38, variant: 'double' },
              { width: 42, height: 40, variant: 'triple' },
              { width: 24, height: 46, variant: 'tall' },
            ];
            const chosen = cactusTypes[Math.floor(Math.random() * cactusTypes.length)];
            e.obstacles.push({
              type: 'cactus',
              x: e.width + 10,
              y: e.groundY - chosen.height,
              width: chosen.width,
              height: chosen.height,
              variant: chosen.variant,
            });
          }
          // Dynamic obstacle gap based on current speed
          e.nextObstacleDist = 180 + Math.random() * 220 + (e.speed * 8);
        }
      }

      // 4. Draw Obstacles
      for (let i = e.obstacles.length - 1; i >= 0; i--) {
        const obs = e.obstacles[i];
        if (gameState === 'playing') {
          obs.x -= e.speed * dt;
        }

        if (obs.type === 'cactus') {
          ctx.fillStyle = colors.cactus;
          // Stylized Google-Green Pixel Cactus
          if (obs.variant === 'single') {
            ctx.fillRect(obs.x + 5, obs.y, 6, obs.height);
            ctx.fillRect(obs.x, obs.y + 10, 5, 12);
            ctx.fillRect(obs.x, obs.y + 10, 11, 4);
            ctx.fillRect(obs.x + 11, obs.y + 14, 5, 12);
            ctx.fillRect(obs.x + 5, obs.y + 14, 11, 4);
          } else if (obs.variant === 'double') {
            ctx.fillRect(obs.x + 4, obs.y + 4, 6, obs.height - 4);
            ctx.fillRect(obs.x + 16, obs.y, 6, obs.height);
            ctx.fillRect(obs.x, obs.y + 12, 10, 4);
            ctx.fillRect(obs.x + 22, obs.y + 14, 6, 4);
          } else if (obs.variant === 'triple') {
            ctx.fillRect(obs.x + 4, obs.y + 6, 6, obs.height - 6);
            ctx.fillRect(obs.x + 16, obs.y, 6, obs.height);
            ctx.fillRect(obs.x + 28, obs.y + 4, 6, obs.height - 4);
            ctx.fillRect(obs.x, obs.y + 14, 10, 4);
            ctx.fillRect(obs.x + 34, obs.y + 14, 8, 4);
          } else {
            // Tall cactus
            ctx.fillRect(obs.x + 8, obs.y, 8, obs.height);
            ctx.fillRect(obs.x, obs.y + 12, 8, 14);
            ctx.fillRect(obs.x, obs.y + 12, 16, 4);
            ctx.fillRect(obs.x + 16, obs.y + 18, 8, 14);
            ctx.fillRect(obs.x + 8, obs.y + 18, 16, 4);
          }
        } else if (obs.type === 'bird') {
          // Animated Pterodactyl
          obs.wingTimer += dt;
          if (obs.wingTimer > 8) {
            obs.wingTimer = 0;
            obs.wingState = obs.wingState === 0 ? 1 : 0;
          }
          ctx.fillStyle = colors.bird;
          // Body & beak
          ctx.fillRect(obs.x + 12, obs.y + 10, 18, 8);
          ctx.fillRect(obs.x + 4, obs.y + 8, 8, 5); // Head
          ctx.fillRect(obs.x, obs.y + 10, 4, 3); // Beak
          // Eye
          ctx.fillStyle = colors.dinoEye;
          ctx.fillRect(obs.x + 6, obs.y + 9, 2, 2);
          ctx.fillStyle = colors.bird;

          // Wings up or down
          if (obs.wingState === 0) {
            ctx.fillRect(obs.x + 14, obs.y, 8, 10);
            ctx.fillRect(obs.x + 18, obs.y - 4, 4, 4);
          } else {
            ctx.fillRect(obs.x + 14, obs.y + 18, 8, 10);
            ctx.fillRect(obs.x + 18, obs.y + 28, 4, 4);
          }
        }

        // Remove off-screen obstacles
        if (obs.x + obs.width < -20) {
          e.obstacles.splice(i, 1);
        }
      }

      // 5. Update Dino Position & Physics
      const d = e.dino;
      d.ducking = isDucking;

      // Adjust collision box for ducking vs running
      const currentDinoWidth = d.ducking ? 56 : 44;
      const currentDinoHeight = d.ducking ? 28 : 47;
      d.width = currentDinoWidth;
      d.height = currentDinoHeight;

      if (!d.grounded) {
        d.vy += d.gravity * dt;
        d.y += d.vy * dt;

        if (d.y >= e.groundY - currentDinoHeight) {
          d.y = e.groundY - currentDinoHeight;
          d.vy = 0;
          d.grounded = true;
        }
      } else {
        d.y = e.groundY - currentDinoHeight;
      }

      // Leg running animation
      if (gameState === 'playing' && d.grounded) {
        d.legTimer += dt;
        if (d.legTimer > 5) {
          d.legTimer = 0;
          d.legFrame = d.legFrame === 0 ? 1 : 0;
        }
      }

      // 6. Draw Dino
      ctx.fillStyle = colors.dino;
      if (d.ducking && d.grounded) {
        // Ducking Dino Sprite
        ctx.fillRect(d.x, d.y + 8, 46, 16);
        ctx.fillRect(d.x + 36, d.y, 18, 16); // Head lowered
        // Eye
        ctx.fillStyle = colors.dinoEye;
        ctx.fillRect(d.x + 46, d.y + 4, 3, 3);
        ctx.fillStyle = colors.dino;
        // Legs
        if (d.legFrame === 0) {
          ctx.fillRect(d.x + 14, d.y + 24, 6, 4);
          ctx.fillRect(d.x + 28, d.y + 24, 6, 2);
        } else {
          ctx.fillRect(d.x + 14, d.y + 24, 6, 2);
          ctx.fillRect(d.x + 28, d.y + 24, 6, 4);
        }
      } else {
        // Standing / Running / Jumping Dino Sprite
        // Head & Snout
        ctx.fillRect(d.x + 20, d.y, 22, 16);
        ctx.fillRect(d.x + 32, d.y + 6, 12, 10);
        // Eye
        ctx.fillStyle = colors.dinoEye;
        ctx.fillRect(d.x + 26, d.y + 4, 4, 4);
        ctx.fillStyle = colors.dino;
        // Body
        ctx.fillRect(d.x + 8, d.y + 14, 24, 22);
        ctx.fillRect(d.x, d.y + 18, 8, 14); // Tail
        ctx.fillRect(d.x + 28, d.y + 20, 6, 4); // Arms
        // Legs
        if (!d.grounded) {
          // Jumping posture
          ctx.fillRect(d.x + 10, d.y + 36, 4, 8);
          ctx.fillRect(d.x + 20, d.y + 36, 4, 8);
        } else {
          // Running legs alternating
          if (d.legFrame === 0) {
            ctx.fillRect(d.x + 10, d.y + 36, 4, 11);
            ctx.fillRect(d.x + 10, d.y + 45, 7, 2); // Foot
            ctx.fillRect(d.x + 20, d.y + 36, 4, 6);
          } else {
            ctx.fillRect(d.x + 10, d.y + 36, 4, 6);
            ctx.fillRect(d.x + 20, d.y + 36, 4, 11);
            ctx.fillRect(d.x + 20, d.y + 45, 7, 2); // Foot
          }
        }
      }

      // 7. Collision Detection
      if (gameState === 'playing') {
        const padding = 5; // small grace margin for pixel-perfect feel
        const dinoBox = {
          left: d.x + padding,
          right: d.x + d.width - padding,
          top: d.y + padding,
          bottom: d.y + d.height,
        };

        for (let i = 0; i < e.obstacles.length; i++) {
          const obs = e.obstacles[i];
          const obsBox = {
            left: obs.x + 4,
            right: obs.x + obs.width - 4,
            top: obs.y + 4,
            bottom: obs.y + obs.height,
          };

          const isColliding =
            dinoBox.left < obsBox.right &&
            dinoBox.right > obsBox.left &&
            dinoBox.top < obsBox.bottom &&
            dinoBox.bottom > obsBox.top;

          if (isColliding) {
            // Collision trigger!
            sfx.hit();
            setGameState('gameover');
            const finalScore = Math.floor(e.distance);
            setHighScore((prev) => {
              const updated = Math.max(prev, finalScore);
              try {
                localStorage.setItem('gdg_dino_highscore', updated.toString());
              } catch {}
              return updated;
            });
            break;
          }
        }
      }

      // 8. Overlays & HUD on Canvas
      // Score in top-right corner
      ctx.fillStyle = colors.text;
      ctx.font = '14px "Courier New", Courier, monospace';
      ctx.textAlign = 'right';
      const scoreStr = Math.floor(e.distance).toString().padStart(5, '0');
      const highStr = highScore.toString().padStart(5, '0');
      ctx.fillText(`HI ${highStr}  ${scoreStr}`, e.width - 20, 26);

      // Start screen / Idle message
      if (gameState === 'idle') {
        ctx.fillStyle = colors.text;
        ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PRESS SPACE OR TAP CANVAS TO JUMP & PLAY', e.width / 2, e.groundY - 45);
        ctx.font = '12px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = colors.accentBlue;
        ctx.fillText('DODGE CACTI • DUCK UNDER PTERODACTYLS • SURVIVE 404', e.width / 2, e.groundY - 25);
      }

      // Game Over Screen
      if (gameState === 'gameover') {
        ctx.fillStyle = '#EA4335'; // Google Red
        ctx.font = 'bold 22px "Courier New", Courier, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('G A M E   O V E R', e.width / 2, 70);

        ctx.fillStyle = colors.text;
        ctx.font = '13px system-ui, -apple-system, sans-serif';
        ctx.fillText('Press SPACE, ENTER or TAP to restart', e.width / 2, 100);

        // Circular restart icon
        ctx.beginPath();
        ctx.arc(e.width / 2, 130, 16, 0, Math.PI * 2);
        ctx.fillStyle = colors.accentBlue;
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
        ctx.fillText('↺', e.width / 2, 135);
      }

      e.animId = requestAnimationFrame(loop);
    };

    e.animId = requestAnimationFrame(loop);

    return () => {
      if (e.animId) cancelAnimationFrame(e.animId);
    };
  }, [gameState, highScore, isDucking]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-15 pb-20 transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">

        {/* 404 Header & Brand Kit Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-google-red/10 dark:bg-google-red/20 border border-google-red/30 text-google-red text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-google-red animate-ping" />
            404 • Page Not Found
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Lost in the <span className="bg-gradient-to-r from-google-blue via-google-red to-google-yellow bg-clip-text text-transparent">Extinction Zone</span>?
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            The page you requested may have been moved, renamed, or vanished like the prehistoric era.
            While our campus developers track down the lost coordinates, challenge our mascot Dino!
          </p>
        </motion.div>

        {/* Dinosaur Arcade Canvas Container */}
        <div
          ref={containerRef}
          className="w-full max-w-4xl bg-white dark:bg-slate-900/90 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl relative overflow-hidden"
        >
          {/* Top Bar: Title, Controls Legend, Sound Toggle, High Score */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
              <FaGamepad className="text-google-blue text-lg" />
              <span>Chrome T-Rex Arcade</span>
              <span className="text-xs font-normal text-slate-400 hidden sm:inline">
                • SATI Edition
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* High Score Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
                <FaTrophy size={11} />
                <span>HI: {highScore}</span>
              </div>

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={toggleMute}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-google-blue transition-colors text-xs font-medium flex items-center gap-1.5"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
              >
                {isMuted ? <FaVolumeMute size={14} className="text-slate-400" /> : <FaVolumeUp size={14} className="text-google-green" />}
                <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Sound On'}</span>
              </button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div
            className="w-full overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 cursor-pointer select-none relative shadow-inner"
            onClick={jump}
            onTouchStart={(e) => {
              e.preventDefault();
              jump();
            }}
          >
            <canvas
              ref={canvasRef}
              width={800}
              height={200}
              className="w-full h-auto block"
            />
          </div>

          {/* Mobile On-Screen Action Controls & Legend */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            {/* Keyboard Shortcuts Chips */}
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Controls:</span>
              <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                Space / ↑
              </kbd>
              <span>Jump</span>
              <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-800 dark:text-slate-200 ml-1">
                ↓
              </kbd>
              <span>Duck</span>
              <span className="hidden md:inline">• Tap anywhere on mobile</span>
            </div>

            {/* Mobile Touch Jump & Duck Buttons */}
            <div className="flex sm:hidden items-center gap-2 w-full justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  jump();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-google-blue text-white font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all text-xs"
              >
                <FaArrowUp /> TAP TO JUMP
              </button>
              <button
                type="button"
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setDuck(true);
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  setDuck(false);
                }}
                onMouseDown={() => setDuck(true)}
                onMouseUp={() => setDuck(false)}
                className={`py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-1.5 border border-slate-300 dark:border-slate-700 transition-all text-xs ${
                  isDucking ? 'bg-google-yellow text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <FaArrowDown /> DUCK
              </button>
            </div>

            {/* Reset Game Button */}
            {gameState !== 'idle' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  resetGame();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-google-blue hover:underline"
              >
                <FaRedo size={10} /> Restart Run
              </button>
            )}
          </div>
        </div>

        {/* Useful Navigation Hub (Google Colors Palette) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-google-blue hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-google-blue/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <FaHome size={15} />
            Back to Home
          </Link>
        </motion.div>

        {/* Help footer footnote */}
        <p className="mt-8 text-xs text-slate-400 text-center">
          Think this is a broken link on our end?{' '}
          <Link to="/contact" className="text-google-blue hover:underline font-semibold">
            Report it to the GDGoC SATI tech team
          </Link>
          .
        </p>

      </div>
    </div>
  );
};

export default NotFound;
