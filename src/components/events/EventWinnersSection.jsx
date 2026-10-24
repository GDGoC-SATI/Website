import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FaTrophy, FaCrown, FaMedal, FaAward } from 'react-icons/fa';
import { isWinnersEligibleEventType } from '../../utils/formHelpers';

// Trophy SVG paths from public/assets/trophies
const TROPHY_PATHS = {
  gold: '/assets/trophies/gold_trophy.svg',
  silver: '/assets/trophies/silver_trophy.svg',
  bronze: '/assets/trophies/bronze_trophy.svg',
};

// Color styles and configs for ranks (neutralize SVG internal angle so gold stands 100% straight/upright at 0°)
const RANK_CONFIGS = {
  gold: {
    label: 'Grand Winner',
    icon: FaCrown,
    badgeBg: 'bg-amber-500/15 dark:bg-amber-500/20',
    badgeBorder: 'border-amber-500/40 dark:border-amber-500/50',
    badgeText: 'text-amber-700 dark:text-amber-300',
    auraGlow: 'from-amber-400/25 via-yellow-500/15 to-transparent',
    tilt: -17.78, // Neutralizes the SVG's built-in 17.78° rotation so trophy stands completely straight (0° tilt)
    delay: 0,
    trophyScale: 'scale-105 sm:scale-110 md:scale-120',
    rankNum: '1',
  },
  silver: {
    label: '1st Runner Up',
    icon: FaMedal,
    badgeBg: 'bg-slate-200/80 dark:bg-slate-700/80',
    badgeBorder: 'border-slate-300 dark:border-slate-600',
    badgeText: 'text-slate-700 dark:text-slate-200',
    auraGlow: 'from-slate-300/25 via-slate-400/15 to-transparent',
    tilt: 0,
    delay: 0.8,
    trophyScale: 'scale-95 sm:scale-100 md:scale-105',
    rankNum: '2',
  },
  bronze: {
    label: '2nd Runner Up',
    icon: FaAward,
    badgeBg: 'bg-amber-900/15 dark:bg-amber-950/60',
    badgeBorder: 'border-amber-700/30 dark:border-amber-700/50',
    badgeText: 'text-amber-800 dark:text-amber-400',
    auraGlow: 'from-amber-700/20 via-orange-600/10 to-transparent',
    tilt: 0,
    delay: 1.6,
    trophyScale: 'scale-95 sm:scale-100 md:scale-105',
    rankNum: '3',
  },
};

/**
 * Fires a 3-second celebratory confetti animation shooting upwards and inwards
 * from the bottom-left and bottom-right corners of the winner's podium section (flower pot / anar cracker style).
 */
const fireFlowerPotConfetti = (confettiInstance) => {
  if (!confettiInstance) return;

  const duration = 3000;
  const animationEnd = Date.now() + duration;

  // Rich multi-colored palette (Google colors, jewel tones, festive brights)
  const crackerColors = [
    '#4285F4', // Google Blue
    '#EA4335', // Google Red
    '#FBBC05', // Google Yellow
    '#34A853', // Google Green
    '#A855F7', // Royal Purple
    '#EC4899', // Hot Pink
    '#00E5FF', // Electric Cyan
    '#FF6D00', // Vivid Orange
    '#FFD700', // Sparkling Gold
    '#FFFFFF', // White Glitter
  ];

  // Helper to shuffle colors so every frame receives a diverse spectrum across all particles
  const getRandomizedColors = () => [...crackerColors].sort(() => Math.random() - 0.5);

  // Initial energetic launch bursts strictly inside the winner's card
  confettiInstance({
    particleCount: 26,
    angle: 60,
    spread: 48,
    startVelocity: 44,
    gravity: 1.15,
    origin: { x: 0.06, y: 0.95 },
    colors: getRandomizedColors(),
    ticks: 190,
    scalar: 0.85,
  });
  confettiInstance({
    particleCount: 26,
    angle: 120,
    spread: 48,
    startVelocity: 44,
    gravity: 1.15,
    origin: { x: 0.94, y: 0.95 },
    colors: getRandomizedColors(),
    ticks: 190,
    scalar: 0.85,
  });

  // Continuous fountain frame loop for 3 seconds
  const frame = () => {
    // Left bottom flower pot cracker inside the winner's section
    confettiInstance({
      particleCount: 4,
      angle: 62,
      spread: 44,
      startVelocity: 40,
      gravity: 1.15,
      origin: { x: 0.06, y: 0.95 },
      colors: getRandomizedColors(),
      ticks: 170,
      scalar: 0.85,
    });

    // Right bottom flower pot cracker inside the winner's section
    confettiInstance({
      particleCount: 4,
      angle: 118,
      spread: 44,
      startVelocity: 40,
      gravity: 1.15,
      origin: { x: 0.94, y: 0.95 },
      colors: getRandomizedColors(),
      ticks: 170,
      scalar: 0.85,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  requestAnimationFrame(frame);
};

/**
 * Single Winner Card Component:
 * - Position label above trophy
 * - Smooth quiet realistic up & down floating motion (completely straight, 0° tilt)
 * - Elevated center card position (Gold trophy shifted significantly higher than other two)
 * - Winner name, subtitle, and prize note below trophy
 * - Completely responsive in a single row across all screen sizes
 */
const WinnerCard = ({ winner, config, isCenter = false }) => {
  const trophySrc = TROPHY_PATHS[winner.trophy] || TROPHY_PATHS.gold;
  const Icon = config.icon;

  return (
    <div
      className={`flex flex-col items-center justify-end text-center w-full px-0.5 sm:px-1.5 md:px-2 transition-transform duration-500 ${
        isCenter
          ? 'z-20 -translate-y-6 sm:-translate-y-12 md:-translate-y-16'
          : 'z-10 translate-y-1 sm:translate-y-2'
      }`}
    >
      {/* 1. Above Trophy: Position / Rank Pill */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: config.delay * 0.4 }}
        className="mb-1.5 sm:mb-2.5 w-full flex justify-center"
      >
        <span
          className={`inline-flex items-center justify-center gap-1 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] min-[360px]:text-[9px] sm:text-xs font-black uppercase tracking-tight sm:tracking-wider shadow-xs border max-w-full ${config.badgeBg} ${config.badgeBorder} ${config.badgeText}`}
        >
          <Icon className="text-[8px] sm:text-xs shrink-0" />
          <span className="truncate max-w-[68px] min-[360px]:max-w-[85px] sm:max-w-none">
            {winner.position || config.label}
          </span>
        </span>
      </motion.div>

      {/* 2. Floating Trophy with Ambient Aura & Ground Shadow (Straight / 0° Tilt) */}
      <div className="relative flex flex-col items-center justify-center my-0.5 sm:my-1 w-full">
        {/* Soft radial background glow aura */}
        <div
          className={`absolute w-16 h-16 min-[360px]:w-20 min-[360px]:h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full pointer-events-none opacity-60 dark:opacity-80`}
        />

        {/* Realistic smooth, quiet vertical float motion */}
        <motion.div
          animate={{
            y: [-5, 5, -5],
          }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: config.delay,
          }}
          className="relative flex items-center justify-center select-none"
        >
          <motion.img
            src={trophySrc}
            alt={`${winner.name || 'Winner'} Trophy`}
            // whileHover={{ scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            style={{ transform: `rotate(${config.tilt || 0}deg)` }}
            className={`w-14 h-14 min-[360px]:w-16 min-[360px]:h-16 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 object-contain filter drop-shadow-md sm:drop-shadow-xl ${config.trophyScale}`}
          />
        </motion.div>

        {/* Ground shadow breathing smoothly opposite to float height */}
        <motion.div
          animate={{
            scale: [1, 0.82, 1],
            opacity: [0.35, 0.16, 0.35],
          }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: config.delay,
          }}
          className="w-12 min-[360px]:w-14 sm:w-24 md:w-30 h-1.5 sm:h-2.5 bg-slate-900/35 dark:bg-black/60 rounded-full blur-xs sm:blur-sm -mt-0.5 sm:-mt-1 pointer-events-none"
        />
      </div>

      {/* 3. Below Trophy: Winner Name, Subtitle, and Optional Extra Text */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: config.delay * 0.4 + 0.1 }}
        className="mt-1.5 sm:mt-2.5 space-y-0.5 sm:space-y-1 w-full max-w-full px-0.5"
      >
        {/* Winner Name */}
        <h3 className="text-[11px] min-[360px]:text-xs sm:text-base md:text-xl lg:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight break-words line-clamp-2 leading-tight">
          {winner.name}
        </h3>

        {/* Subtitle / Rank details */}
        {winner.subtitle && (
          <p className="text-[8px] min-[360px]:text-[9px] sm:text-xs md:text-sm font-bold uppercase tracking-tight sm:tracking-wider text-slate-500 dark:text-slate-400 break-words line-clamp-1">
            {winner.subtitle}
          </p>
        )}

        {/* Extra Text / Custom Prize Note */}
        {winner.extraText && (
          <p className="text-[8px] min-[360px]:text-[9px] sm:text-xs md:text-sm font-black uppercase tracking-tight sm:tracking-wider text-purple-600 dark:text-purple-400 break-words line-clamp-1 pt-0.5">
            {winner.extraText}
          </p>
        )}
      </motion.div>
    </div>
  );
};

const EventWinnersSection = ({ winners = [], eventType = '' }) => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const confettiInstanceRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const hasFiredRef = useRef(false);

  // Check eligibility and valid winners
  const isEligible = isWinnersEligibleEventType(eventType);
  const validWinners = (winners || []).filter((w) => w && (w.name || w.position));

  // Initialize custom confetti bounded strictly to the winner's section canvas
  useEffect(() => {
    if (canvasRef.current && !confettiInstanceRef.current) {
      confettiInstanceRef.current = confetti.create(canvasRef.current, {
        resize: true,
        useWorker: true,
      });
    }

    if (isEligible && isInView && !hasFiredRef.current && validWinners.length > 0) {
      hasFiredRef.current = true;
      const timeoutId = setTimeout(() => {
        if (confettiInstanceRef.current) {
          fireFlowerPotConfetti(confettiInstanceRef.current);
        }
      }, 120);

      return () => clearTimeout(timeoutId);
    }

    return () => {
      if (confettiInstanceRef.current) {
        confettiInstanceRef.current.reset();
      }
    };
  }, [isEligible, isInView, validWinners.length]);

  // Only for hackathons, workshops, study jams, and when winners exist
  if (!isEligible || validWinners.length === 0) {
    return null;
  }

  // Organize podium arrangement:
  // If 3 winners, display in Olympic/Hackathon podium order in a single row: [Silver (2nd), Gold (1st), Bronze (3rd)]
  let podiumSlots = [];
  let additionalWinners = [];

  if (validWinners.length === 1) {
    podiumSlots = [
      {
        winner: validWinners[0],
        config: RANK_CONFIGS[validWinners[0].trophy] || RANK_CONFIGS.gold,
        isCenter: true,
      },
    ];
  } else if (validWinners.length === 2) {
    const first = validWinners.find((w) => w.trophy === 'gold' || w.rank === 1) || validWinners[0];
    const second = validWinners.find((w) => w !== first) || validWinners[1];
    podiumSlots = [
      {
        winner: second,
        config: RANK_CONFIGS[second.trophy] || RANK_CONFIGS.silver,
        isCenter: false,
      },
      {
        winner: first,
        config: RANK_CONFIGS[first.trophy] || RANK_CONFIGS.gold,
        isCenter: true,
      },
    ];
  } else {
    // 3 or more winners:
    const sorted = [...validWinners].sort((a, b) => (Number(a.rank) || 99) - (Number(b.rank) || 99));
    const first = sorted.find((w) => w.trophy === 'gold' || w.rank === 1) || sorted[0];
    const rest1 = sorted.filter((w) => w !== first);
    const second = rest1.find((w) => w.trophy === 'silver' || w.rank === 2) || rest1[0];
    const rest2 = rest1.filter((w) => w !== second);
    const third = rest2.find((w) => w.trophy === 'bronze' || w.rank === 3) || rest2[0];

    podiumSlots = [
      {
        winner: second,
        config: RANK_CONFIGS.silver,
        isCenter: false,
      },
      {
        winner: first,
        config: RANK_CONFIGS.gold,
        isCenter: true,
      },
      {
        winner: third,
        config: RANK_CONFIGS.bronze,
        isCenter: false,
      },
    ];

    additionalWinners = rest2.filter((w) => w !== third);
  }

  return (
    <div
      ref={sectionRef}
      className="pt-3 sm:pt-6 border-t border-slate-200/80 dark:border-slate-800 space-y-3 sm:space-y-5"
    >
      {/* Section Header */}
      <div className="flex items-center gap-2.5 sm:gap-3 pb-1">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-base sm:text-xl shrink-0 shadow-sm">
          <FaTrophy />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Event Winners & Honorees
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Hall of Fame
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Celebrating exceptional creativity, leadership, and technical excellence
          </p>
        </div>
      </div>

      {/* Main Winners Podium Card (Shifted upward center card, straight 0° trophies, single row) */}
      <div className="relative rounded-2xl sm:rounded-3xl pt-9 min-[360px]:pt-11 sm:pt-16 md:pt-20 pb-3 sm:pb-6 px-1.5 min-[360px]:px-2.5 sm:px-6 md:px-8 border border-slate-200/80 dark:border-slate-800/80 shadow-md overflow-hidden bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xs">
        {/* Dedicated Confetti Canvas confined strictly inside the winner's section */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-30"
        />

        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent blur-2xl pointer-events-none" />

        {/* Single Row Across All Screen Sizes (Mobile through Desktop) */}
        <div
          className={`grid items-end relative z-10 mx-auto ${
            podiumSlots.length === 1
              ? 'grid-cols-1 max-w-xs'
              : podiumSlots.length === 2
              ? 'grid-cols-2 gap-2 sm:gap-6 max-w-xl'
              : 'grid-cols-3 gap-1 min-[360px]:gap-2 sm:gap-6 md:gap-8 max-w-4xl'
          }`}
        >
          {podiumSlots.map((slot, idx) => (
            <WinnerCard
              key={slot.winner.id || idx}
              winner={slot.winner}
              config={slot.config}
              isCenter={slot.isCenter}
            />
          ))}
        </div>
      </div>

      {/* Additional Honorees / Winners (if more than 3) */}
      {additionalWinners.length > 0 && (
        <div className="pt-2 space-y-2.5">
          <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Special Mentions & Runner Ups
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
            {additionalWinners.map((winner, idx) => (
              <div
                key={winner.id || idx}
                className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg sm:rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-xs shrink-0 border border-purple-500/20">
                  #{idx + 4}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    {winner.position || 'Honorable Mention'}
                  </span>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {winner.name}
                  </h5>
                  {winner.subtitle && (
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                      {winner.subtitle}
                    </p>
                  )}
                  {winner.extraText && (
                    <p className="text-[11px] sm:text-xs font-semibold text-purple-600 dark:text-purple-400 truncate">
                      {winner.extraText}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventWinnersSection;
