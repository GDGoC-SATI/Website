import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  FaDownload,
  FaCopy,
  FaCheck,
  FaCheckCircle,
  FaTimesCircle,
  FaUpload,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaFont,
  FaChevronDown,
  FaLayerGroup,
} from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import usePageSEO, { BASE_URL } from '../hooks/usePageSEO';
import { api } from '../services/api';
import ViewToggle from '../components/common/ViewToggle';

// Initial Brand Assets
const INITIAL_LOGOS = [
  {
    id: 'gdgoc_sati_logo_black_font_horizontal',
    name: 'GDGoC SATI Logo Horizontal (Black)',
    category: 'Logos',
    description: 'Full horizontal chapter logo lockup for light surfaces.',
    pngUrl: '/assets/brand_kit/logos/gdgoc_sati_logo_black_font_horizontal.png',
    svgUrl: '/assets/brand_kit/logos/gdgoc_sati_logo_black_font_horizontal.svg',
  },
  {
    id: 'gdgoc_sati_logo_white_font_horizontal',
    name: 'GDGoC SATI Logo Horizontal (White)',
    category: 'Logos',
    description: 'Full horizontal chapter logo lockup for dark surfaces.',
    pngUrl: '/assets/brand_kit/logos/gdgoc_sati_logo_white_font_horizontal.png',
    svgUrl: '/assets/brand_kit/logos/gdgoc_sati_logo_white_font_horizontal.svg',
  },
];

const INITIAL_ICONS = [
  {
    id: 'gdgoc_sati_icon',
    name: 'GDGoC SATI Icon',
    category: 'Icons',
    description: 'The iconic Google Developer Groups code brackets symbol in signature Google quad-colors.',
    pngUrl: '/assets/brand_kit/icon/gdgoc_sati_icon.png',
    svgUrl: '/assets/brand_kit/icon/gdgoc_sati_icon.svg',
  },
];

const INITIAL_COLOR_PALETTES = [
  {
    id: 'core-google',
    title: 'Core Google Colors',
    description: 'The fundamental primary palette of Google Developer Groups on Campus.',
    colors: [
      { id: 'c-blue', name: 'Blue', hex: '#4285F4', rgb: 'rgb(66, 133, 244)' },
      { id: 'c-red', name: 'Red', hex: '#EA4335', rgb: 'rgb(234, 67, 53)' },
      { id: 'c-yellow', name: 'Yellow', hex: '#FBBC04', rgb: 'rgb(251, 188, 4)' },
      { id: 'c-green', name: 'Green', hex: '#34A853', rgb: 'rgb(52, 168, 83)' },
    ],
  },
  {
    id: 'halftones',
    title: 'Halftone Accent Tones',
    description: 'Vibrant secondary halftones used for illustrations, highlights, and cards.',
    colors: [
      { id: 'h-blue', name: 'Halftone Blue', hex: '#57CAFF', rgb: 'rgb(87, 202, 255)' },
      { id: 'h-red', name: 'Halftone Red', hex: '#FF7DAF', rgb: 'rgb(255, 125, 175)' },
      { id: 'h-yellow', name: 'Halftone Yellow', hex: '#FFD427', rgb: 'rgb(255, 212, 39)' },
      { id: 'h-green', name: 'Halftone Green', hex: '#5CDB6D', rgb: 'rgb(92, 219, 109)' },
    ],
  },
  {
    id: 'pastels',
    title: 'Pastel Background Shades',
    description: 'Gentle pastel washes designed for badges, container fills, and soft tints.',
    colors: [
      { id: 'p-blue', name: 'Pastel Blue', hex: '#C3ECF6', rgb: 'rgb(195, 236, 246)' },
      { id: 'p-red', name: 'Pastel Red', hex: '#F8D8D8', rgb: 'rgb(248, 216, 216)' },
      { id: 'p-yellow', name: 'Pastel Yellow', hex: '#FFE7A5', rgb: 'rgb(255, 231, 165)' },
      { id: 'p-green', name: 'Pastel Green', hex: '#CCF6C5', rgb: 'rgb(204, 246, 197)' },
    ],
  },
  {
    id: 'neutrals',
    title: 'Neutrals & Grayscale',
    description: 'High-contrast backgrounds, typography baselines, and surface borders.',
    colors: [
      { id: 'n-white', name: 'Off-White', hex: '#F8F9FA', rgb: 'rgb(248, 249, 250)' },
      { id: 'n-slate', name: 'Google Slate', hex: '#5F6368', rgb: 'rgb(95, 99, 104)' },
      { id: 'n-charcoal', name: 'Dark Charcoal', hex: '#202124', rgb: 'rgb(32, 33, 36)' },
      { id: 'n-midnight', name: 'Midnight Dark', hex: '#0F172A', rgb: 'rgb(15, 23, 42)' },
    ],
  },
];

const INITIAL_AVATAR_FRAMES = [
  { id: 'blue', name: 'Blue', color: '#4285F4', src: '/assets/brand_kit/profile_avatar/profile_avatar_blue.png' },
  { id: 'green', name: 'Green', color: '#34A853', src: '/assets/brand_kit/profile_avatar/profile_avatar_green.png' },
  { id: 'red', name: 'Red', color: '#EA4335', src: '/assets/brand_kit/profile_avatar/profile_avatar_red.png' },
  { id: 'yellow', name: 'Yellow', color: '#FBBC04', src: '/assets/brand_kit/profile_avatar/profile_avatar_yellow.png' },
];

const INITIAL_FONTS = [
  {
    id: 'google-sans',
    label: 'Google Sans / Plus Jakarta Sans',
    family: "'Plus Jakarta Sans', 'Google Sans', sans-serif",
    cdnLink: '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">',
    cssImport: "@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');",
    cssRule: "font-family: 'Plus Jakarta Sans', 'Google Sans', sans-serif;",
  },
  {
    id: 'inter',
    label: 'Inter (UI & Body)',
    family: "'Inter', sans-serif",
    cdnLink: '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">',
    cssImport: "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');",
    cssRule: "font-family: 'Inter', sans-serif;",
  },
  {
    id: 'roboto-mono',
    label: 'Roboto Mono (Code & Badges)',
    family: "'Roboto Mono', monospace",
    cdnLink: '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">',
    cssImport: "@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600;700&display=swap');",
    cssRule: "font-family: 'Roboto Mono', monospace;",
  },
];

const FONT_WEIGHTS = [
  { label: 'Light (300)', value: 300 },
  { label: 'Regular (400)', value: 400 },
  { label: 'Medium (500)', value: 500 },
  { label: 'Semi-Bold (600)', value: 600 },
  { label: 'Bold (700)', value: 700 },
  { label: 'Extra-Bold (800)', value: 800 },
  { label: 'Black (900)', value: 900 },
];

const T_SHIRT_IMAGES = {
  black: {
    front: '/assets/brand_kit/t_shirts/gdgoc_sati_t_shirt_black_front_2025.png',
    back: '/assets/brand_kit/t_shirts/gdgoc_sati_t_shirt_black_back_2025.png',
  },
  white: {
    front: '/assets/brand_kit/t_shirts/gdgoc_sati_t_shirt_white_front_2025.png',
    back: '/assets/brand_kit/t_shirts/gdgoc_sati_t_shirt_white_back_2025.png',
  },
};

const INITIAL_GUIDELINES = {
  namingApproved: [
    'Google Developer Groups on Campus SATI - Vidisha',
    'GDG on Campus SATI Vidisha',
    'GDGoC SATI',
  ],
  namingDeprecated: [
    'GDSC SATI (Deprecated in 2024 by Google)',
    'Google Developers Club SATI',
    'Google Developer Student Clubs SATI',
  ],
  visualDos: [
    'Maintain clear space equal to bracket symbol height.',
    'Use white logo on dark surfaces and black on light surfaces.',
    'Scale proportionally without stretching or skewing.',
  ],
  visualDonts: [
    'Do not rotate or skew the logo at unapproved angles.',
    'Do not recolor or reorder the bracket pill sequence.',
    'Do not place on busy backgrounds with insufficient contrast.',
  ],
  customGuidelines: [],
};

// Helper to sanitize avatar frame paths
const sanitizeAvatarFrames = (frames) => {
  if (!Array.isArray(frames) || frames.length === 0) return INITIAL_AVATAR_FRAMES;
  return frames.map((f) => {
    let src = f.src || '';
    if (src.includes('/blue.png')) src = src.replace('/blue.png', '/profile_avatar_blue.png');
    if (src.includes('/green.png')) src = src.replace('/green.png', '/profile_avatar_green.png');
    if (src.includes('/red.png')) src = src.replace('/red.png', '/profile_avatar_red.png');
    if (src.includes('/yellow.png')) src = src.replace('/yellow.png', '/profile_avatar_yellow.png');
    src = src.replace(/brand kit/g, 'brand_kit');
    return { ...f, src };
  });
};

// --- Reusable Unified Asset Card (Transparent Card with Mosaic Pattern Preview) ---
const AssetCard = ({
  asset,
  view = 'grid',
  isAdmin,
  onEdit,
  onDelete,
  onDownload,
  onCopy,
  copiedKey,
}) => {
  const isList = view === 'list';

  if (isList) {
    return (
      <div className="p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-transparent hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Mosaic transparent preview box */}
          <div className="mosaic-bg w-24 h-20 sm:w-28 sm:h-20 rounded-xl flex items-center justify-center p-2.5 border border-slate-200/60 dark:border-slate-800/80 shrink-0">
            <img
              src={asset.pngUrl}
              alt={asset.name}
              className="max-h-full max-w-full object-contain filter drop-shadow-sm"
              loading="lazy"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 ">
                {asset.name}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
              {asset.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={() => onDownload(asset.pngUrl, `${asset.id}.png`)}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-google-blue hover:text-white text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <FaDownload size={10} /> PNG
          </button>
          {asset.svgUrl && (
            <button
              onClick={() => onDownload(asset.svgUrl, `${asset.id}.svg`)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-google-green hover:text-white text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
            >
              <FaDownload size={10} /> SVG
            </button>
          )}
          <button
            onClick={() => onCopy(`${window.location.origin}${asset.pngUrl}`, asset.name)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors text-xs"
            title="Copy URL"
          >
            {copiedKey === `${window.location.origin}${asset.pngUrl}` ? (
              <FaCheck className="text-google-green" size={11} />
            ) : (
              <FaCopy size={11} />
            )}
          </button>

          {isAdmin && (
            <div className="flex items-center gap-1 ml-1 pl-1 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={() => onEdit(asset)}
                className="p-1.5 rounded text-slate-400 hover:text-google-blue transition-colors"
                title="Edit Asset"
              >
                <FaEdit size={12} />
              </button>
              <button
                onClick={() => onDelete(asset.id)}
                className="p-1.5 rounded text-slate-400 hover:text-red-500 transition-colors"
                title="Delete Asset"
              >
                <FaTrash size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Grid Layout
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-transparent hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between overflow-hidden group">
      <div className="p-4">
        <div className="flex items-center justify-end mb-1">
          
          {isAdmin && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(asset)}
                className="p-1 text-slate-400 hover:text-google-blue"
                title="Edit"
              >
                <FaEdit size={11} />
              </button>
              <button
                onClick={() => onDelete(asset.id)}
                className="p-1 text-slate-400 hover:text-red-500"
                title="Delete"
              >
                <FaTrash size={11} />
              </button>
            </div>
          )}
        </div>

        {/* Transparent Mosaic Pattern Box */}
        <div className="mosaic-bg h-36 rounded-xl flex items-center justify-center p-4 border border-slate-200/60 dark:border-slate-800/80 relative">
          <img
            src={asset.pngUrl}
            alt={asset.name}
            className="max-h-full max-w-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        <div className="mt-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
            {asset.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {asset.description}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="grid grid-cols-3 gap-1.5 p-3 pt-0 border-t border-slate-100 dark:border-slate-800/60">
        <button
          onClick={() => onDownload(asset.pngUrl, `${asset.id}.png`)}
          className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-google-blue hover:text-white text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
        >
          <FaDownload className="text-[9px]" /> PNG
        </button>
        <button
          onClick={() => onDownload(asset.svgUrl || asset.pngUrl, `${asset.id}.svg`)}
          className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-google-green hover:text-white text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
        >
          <FaDownload className="text-[9px]" /> SVG
        </button>
        <button
          onClick={() => onCopy(`${window.location.origin}${asset.pngUrl}`, asset.name)}
          className="flex items-center justify-center gap-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          title="Copy URL"
        >
          {copiedKey === `${window.location.origin}${asset.pngUrl}` ? (
            <FaCheck className="text-google-green text-[9px]" />
          ) : (
            <FaCopy className="text-[9px]" />
          )}
          <span>URL</span>
        </button>
      </div>
    </div>
  );
};

export default function Brand() {
  usePageSEO({
    title: 'Brand Kit & Design System',
    description:
      'Official Google Developer Groups on Campus SATI Vidisha brand assets, vectors, logos, color palettes, typography, merchandise designs, and community avatar generator.',
    path: '/brand',
  });

  const { isAdmin } = useAuth();
  const toast = useToast();

  // Assets State with LocalStorage & DB persistence
  const [logos, setLogos] = useState(() => {
    try {
      const cached = localStorage.getItem('gdg_brand_logos');
      return cached ? JSON.parse(cached) : INITIAL_LOGOS;
    } catch {
      return INITIAL_LOGOS;
    }
  });

  const [icons, setIcons] = useState(() => {
    try {
      const cached = localStorage.getItem('gdg_brand_icons');
      return cached ? JSON.parse(cached) : INITIAL_ICONS;
    } catch {
      return INITIAL_ICONS;
    }
  });

  const [colorPalettes, setColorPalettes] = useState(() => {
    try {
      const cached = localStorage.getItem('gdg_brand_colors');
      return cached ? JSON.parse(cached) : INITIAL_COLOR_PALETTES;
    } catch {
      return INITIAL_COLOR_PALETTES;
    }
  });

  const [avatarFrames, setAvatarFrames] = useState(() => {
    try {
      const cached = localStorage.getItem('gdg_brand_frames');
      return cached ? sanitizeAvatarFrames(JSON.parse(cached)) : INITIAL_AVATAR_FRAMES;
    } catch {
      return INITIAL_AVATAR_FRAMES;
    }
  });

  const [guidelines, setGuidelines] = useState(() => {
    try {
      const cached = localStorage.getItem('gdg_brand_guidelines');
      return cached ? JSON.parse(cached) : INITIAL_GUIDELINES;
    } catch {
      return INITIAL_GUIDELINES;
    }
  });

  const [brandFonts, setBrandFonts] = useState(() => {
    try {
      const cached = localStorage.getItem('gdg_brand_fonts');
      return cached ? JSON.parse(cached) : INITIAL_FONTS;
    } catch {
      return INITIAL_FONTS;
    }
  });

  // Dynamic Google Font Injection in DOM
  useEffect(() => {
    brandFonts.forEach((font) => {
      if (font.family && !document.getElementById(`font-${font.id}`)) {
        const cleanName = font.family.split(',')[0].replace(/['"]/g, '').trim();
        const link = document.createElement('link');
        link.id = `font-${font.id}`;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${cleanName.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900&display=swap`;
        document.head.appendChild(link);
      }
    });
  }, [brandFonts]);

  // Search, Filter & View Mode with URL Persistence
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSection = searchParams.get('section') || searchParams.get('tab') || 'all';
  const initialQuery = searchParams.get('q') || '';
  const initialView = searchParams.get('view') || (typeof window !== 'undefined' && window.innerWidth < 768 ? 'list' : 'grid');

const BRAND_SECTIONS = [
  { value: 'all', label: 'All Sections' },
  { value: 'logos', label: 'Logos & Lockups' },
  { value: 'icons', label: 'GDGoC SATI Icon' },
  { value: 'colors', label: 'Color System' },
  { value: 'typography', label: 'Typography' },
  { value: 'merch', label: 'Merchandise' },
  { value: 'avatar', label: 'Profile Avatar Studio' },
  { value: 'guidelines', label: 'Brand Guidelines' },
];

  const [view, setViewState] = useState(initialView);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSection, setSelectedSectionState] = useState(urlSection);
  const [isSectionDropdownOpen, setIsSectionDropdownOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  // Sync section state changes to URL query params
  const handleSectionChange = useCallback((val) => {
    setSelectedSectionState(val);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val === 'all') {
        next.delete('section');
        next.delete('tab');
      } else {
        next.set('section', val);
        next.delete('tab');
      }
      return next;
    }, { replace: true });

    setTimeout(() => {
      const targetY = val === 'all' ? 0 : 340;
      if (window.lenis) {
        window.lenis.scrollTo(targetY, { duration: 0.6 });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }, 40);
  }, [setSearchParams]);

  // Sync view state changes to URL query params
  const handleViewChange = useCallback((v) => {
    setViewState(v);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (v === 'grid') next.delete('view');
      else next.set('view', v);
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  // Debounced search query sync to URL params
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (!searchQuery.trim()) {
          next.delete('q');
        } else {
          next.set('q', searchQuery);
        }
        return next;
      }, { replace: true });
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, setSearchParams]);

  // Sync state if URL changes externally (e.g. browser back/forward)
  useEffect(() => {
    const s = searchParams.get('section') || searchParams.get('tab') || 'all';
    if (s !== selectedSection) {
      setSelectedSectionState(s);
    }
  }, [searchParams]);

  // Scroll to section on initial mount if loaded with section query in URL
  useEffect(() => {
    const s = searchParams.get('section') || searchParams.get('tab');
    if (s && s !== 'all') {
      const timer = setTimeout(() => {
        const el = document.getElementById(s);
        if (el) {
          if (window.lenis) {
            window.lenis.scrollTo(el, { offset: -120, duration: 0.8 });
          } else {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Typography Playground State
  const [selectedFont, setSelectedFont] = useState(brandFonts[0]?.id || 'google-sans');
  const [selectedWeight, setSelectedWeight] = useState(700);
  const [fontSize, setFontSize] = useState(36);
  const [sampleText, setSampleText] = useState('Google Developer Groups on Campus • SATI Vidisha');
  const [fontSnippetTab, setFontSnippetTab] = useState('cdn');

  // Merchandise Stage State
  const [merchColor, setMerchColor] = useState('black');
  const [merchView, setMerchView] = useState('front');

  // Avatar Studio State
  const [selectedFrame, setSelectedFrame] = useState(avatarFrames[0] || INITIAL_AVATAR_FRAMES[0]);
  const [userImage, setUserImage] = useState(null);
  const [avatarScale, setAvatarScale] = useState(1);
  const [avatarOffsetX, setAvatarOffsetX] = useState(0);
  const [avatarOffsetY, setAvatarOffsetY] = useState(0);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Admin Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingItem, setEditingItem] = useState(null);
  const [modalForm, setModalForm] = useState({
    section: 'logos',
    name: '',
    description: '',
    pngUrl: '',
    svgUrl: '',
    hex: '',
    rgb: '',
    paletteId: '',
  });

  // Typography Font Management Modal State
  const [isFontModalOpen, setIsFontModalOpen] = useState(false);
  const [newFont, setNewFont] = useState({
    name: '',
    family: '',
    cdnLink: '',
    cssImport: '',
    cssRule: '',
  });

  // Fetch sections data from DB on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await api.sections.get('brand_kit', true);
        const kitData = res?.data?.data || res?.data || res;
        if (kitData) {
          if (Array.isArray(kitData.logos) && kitData.logos.length > 0) {
            setLogos(kitData.logos);
            localStorage.setItem('gdg_brand_logos', JSON.stringify(kitData.logos));
          }
          if (Array.isArray(kitData.icons) && kitData.icons.length > 0) {
            setIcons(kitData.icons);
            localStorage.setItem('gdg_brand_icons', JSON.stringify(kitData.icons));
          }
          if (Array.isArray(kitData.colorPalettes) && kitData.colorPalettes.length > 0) {
            setColorPalettes(kitData.colorPalettes);
            localStorage.setItem('gdg_brand_colors', JSON.stringify(kitData.colorPalettes));
          }
          if (Array.isArray(kitData.avatarFrames) && kitData.avatarFrames.length > 0) {
            const cleanFrames = sanitizeAvatarFrames(kitData.avatarFrames);
            setAvatarFrames(cleanFrames);
            localStorage.setItem('gdg_brand_frames', JSON.stringify(cleanFrames));
          }
          if (Array.isArray(kitData.fonts) && kitData.fonts.length > 0) {
            setBrandFonts(kitData.fonts);
            localStorage.setItem('gdg_brand_fonts', JSON.stringify(kitData.fonts));
          }
          if (kitData.guidelines) {
            setGuidelines(kitData.guidelines);
            localStorage.setItem('gdg_brand_guidelines', JSON.stringify(kitData.guidelines));
          }
        }
      } catch {
        // Fallback to local
      }
    })();
  }, []);

  // Save changes to DB & localStorage
  const persistChanges = async (
    newLogos = logos,
    newIcons = icons,
    newColors = colorPalettes,
    newFrames = avatarFrames,
    newGuidelines = guidelines,
    newFonts = brandFonts
  ) => {
    const payload = {
      logos: newLogos,
      icons: newIcons,
      colorPalettes: newColors,
      avatarFrames: newFrames,
      guidelines: newGuidelines,
      fonts: newFonts,
    };
    try {
      localStorage.setItem('gdg_brand_logos', JSON.stringify(payload.logos));
      localStorage.setItem('gdg_brand_icons', JSON.stringify(payload.icons));
      localStorage.setItem('gdg_brand_colors', JSON.stringify(payload.colorPalettes));
      localStorage.setItem('gdg_brand_frames', JSON.stringify(payload.avatarFrames));
      localStorage.setItem('gdg_brand_guidelines', JSON.stringify(payload.guidelines));
      localStorage.setItem('gdg_brand_fonts', JSON.stringify(payload.fonts));
      await api.sections.update('brand_kit', payload);
    } catch {
      // Offline fallback
    }
  };

  const handleCopy = (text, label = 'Copied') => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    toast.success(`${label} copied to clipboard!`, 'Copied');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || url.split('/').pop().replace(/%20/g, ' ');
    link.style.position = 'fixed';
    link.style.top = '-9999px';
    link.style.left = '-9999px';
    link.style.opacity = '0';
    link.tabIndex = -1;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloading ${filename || 'asset'}...`, 'Download Started');
  };

  // Avatar Canvas Drawing
  const drawAvatarCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 1080;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    const frameRadius = size * (584 / 1200);

    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, frameRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, size, size);

    if (userImage) {
      const aspect = userImage.width / userImage.height;
      let drawW, drawH;
      if (aspect > 1) {
        drawH = size * avatarScale;
        drawW = drawH * aspect;
      } else {
        drawW = size * avatarScale;
        drawH = drawW / aspect;
      }
      const drawX = size / 2 - drawW / 2 + avatarOffsetX * 3;
      const drawY = size / 2 - drawH / 2 + avatarOffsetY * 3;
      ctx.drawImage(userImage, drawX, drawY, drawW, drawH);
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(size / 2, size * 0.4, size * 0.16, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(size / 2, size * 0.88, size * 0.34, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 40px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Upload Photo', size / 2, size * 0.42);
    }
    ctx.restore();
  }, [userImage, avatarScale, avatarOffsetX, avatarOffsetY]);

  useEffect(() => {
    drawAvatarCanvas();
  }, [drawAvatarCanvas]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setUserImage(img);
          setAvatarScale(1);
          setAvatarOffsetX(0);
          setAvatarOffsetY(0);
          toast.success('Photo loaded! Use controls to adjust.', 'Photo Ready');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadAvatar = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsGeneratingAvatar(true);

    try {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 1080;
      exportCanvas.height = 1080;
      const exportCtx = exportCanvas.getContext('2d');
      exportCtx.drawImage(canvas, 0, 0, 1080, 1080);

      const frameImg = new Image();
      frameImg.onload = () => {
        exportCtx.drawImage(frameImg, 0, 0, 1080, 1080);
        exportCanvas.toBlob((blob) => {
          if (!blob) return setIsGeneratingAvatar(false);
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `gdgoc-sati-avatar-${selectedFrame.id}.png`;
          a.style.position = 'fixed';
          a.style.top = '-9999px';
          a.style.left = '-9999px';
          a.style.opacity = '0';
          a.tabIndex = -1;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success('Your avatar has been downloaded!', 'Avatar Ready');
          setIsGeneratingAvatar(false);
        }, 'image/png');
      };
      frameImg.onerror = () => {
        setIsGeneratingAvatar(false);
      };
      frameImg.src = selectedFrame.src;
    } catch {
      setIsGeneratingAvatar(false);
    }
  };

  // Typography: Manage Fonts (Add / Remove)
  const handleAddFont = async (e) => {
    e.preventDefault();
    if (!newFont.name.trim()) {
      toast.error('Please enter a font name', 'Missing Name');
      return;
    }

    const fontName = newFont.name.trim();
    const family = newFont.family.trim() || `'${fontName}', sans-serif`;
    const fontId = fontName.toLowerCase().replace(/\s+/g, '-');

    const createdFont = {
      id: fontId,
      label: fontName,
      family,
      cdnLink:
        newFont.cdnLink.trim() ||
        `<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">`,
      cssImport:
        newFont.cssImport.trim() ||
        `@import url('https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900&display=swap');`,
      cssRule: newFont.cssRule.trim() || `font-family: ${family};`,
    };

    const updatedFonts = [...brandFonts, createdFont];
    setBrandFonts(updatedFonts);
    setSelectedFont(fontId);
    setNewFont({ name: '', family: '', cdnLink: '', cssImport: '', cssRule: '' });

    await persistChanges(logos, icons, colorPalettes, avatarFrames, guidelines, updatedFonts);
    toast.success(`Font "${fontName}" added successfully!`, 'Font Added');
  };

  const handleRemoveFont = async (fontId) => {
    if (brandFonts.length <= 1) {
      toast.error('You must keep at least one typography font.', 'Cannot Remove');
      return;
    }
    const fontToRemove = brandFonts.find((f) => f.id === fontId);
    if (!window.confirm(`Are you sure you want to remove font "${fontToRemove?.label || fontId}"?`)) return;

    const updatedFonts = brandFonts.filter((f) => f.id !== fontId);
    setBrandFonts(updatedFonts);
    if (selectedFont === fontId) {
      setSelectedFont(updatedFonts[0].id);
    }

    await persistChanges(logos, icons, colorPalettes, avatarFrames, guidelines, updatedFonts);
    toast.success('Font removed from list.', 'Font Removed');
  };

  // Admin Asset Management (Logos, Icons, Colors, Frames)
  const handleOpenAdd = (targetSection = 'logos') => {
    setModalMode('add');
    setEditingItem(null);
    setModalForm({
      section: targetSection,
      name: '',
      description: '',
      pngUrl: '',
      svgUrl: '',
      hex: '#4285F4',
      rgb: 'rgb(66, 133, 244)',
      paletteId: colorPalettes[0]?.id || 'core-google',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item, section = 'logos') => {
    setModalMode('edit');
    setEditingItem(item);
    setModalForm({
      section,
      name: item.name || item.title || '',
      description: item.description || '',
      pngUrl: item.pngUrl || item.src || '',
      svgUrl: item.svgUrl || '',
      hex: item.hex || item.color || '',
      rgb: item.rgb || '',
      paletteId: item.paletteId || (colorPalettes[0]?.id || 'core-google'),
    });
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (id, section = 'logos', extraId = null) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;
    if (section === 'logos') {
      const updated = logos.filter((l) => l.id !== id);
      setLogos(updated);
      await persistChanges(updated, icons, colorPalettes, avatarFrames, guidelines, brandFonts);
    } else if (section === 'icons') {
      const updated = icons.filter((i) => i.id !== id);
      setIcons(updated);
      await persistChanges(logos, updated, colorPalettes, avatarFrames, guidelines, brandFonts);
    } else if (section === 'colors' && extraId) {
      const updatedPalettes = colorPalettes.map((p) =>
        p.id === extraId ? { ...p, colors: p.colors.filter((c) => (c.id || c.name) !== id) } : p
      );
      setColorPalettes(updatedPalettes);
      await persistChanges(logos, icons, updatedPalettes, avatarFrames, guidelines, brandFonts);
    } else if (section === 'palette') {
      const updatedPalettes = colorPalettes.filter((p) => p.id !== id);
      setColorPalettes(updatedPalettes);
      await persistChanges(logos, icons, updatedPalettes, avatarFrames, guidelines, brandFonts);
    } else if (section === 'frames') {
      const updated = avatarFrames.filter((f) => f.id !== id);
      setAvatarFrames(updated);
      if (selectedFrame?.id === id) setSelectedFrame(updated[0] || INITIAL_AVATAR_FRAMES[0]);
      await persistChanges(logos, icons, colorPalettes, updated, guidelines, brandFonts);
    }
    toast.success('Item removed successfully', 'Removed');
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!modalForm.name.trim()) return;

    if (modalForm.section === 'logos') {
      let updated;
      if (modalMode === 'edit' && editingItem) {
        updated = logos.map((l) => (l.id === editingItem.id ? { ...l, ...modalForm } : l));
      } else {
        updated = [{ id: `logo-${Date.now()}`, ...modalForm, category: 'Logos' }, ...logos];
      }
      setLogos(updated);
      await persistChanges(updated, icons, colorPalettes, avatarFrames, guidelines, brandFonts);
    } else if (modalForm.section === 'icons') {
      let updated;
      if (modalMode === 'edit' && editingItem) {
        updated = icons.map((i) => (i.id === editingItem.id ? { ...i, ...modalForm } : i));
      } else {
        updated = [{ id: `icon-${Date.now()}`, ...modalForm, category: 'Icons' }, ...icons];
      }
      setIcons(updated);
      await persistChanges(logos, updated, colorPalettes, avatarFrames, guidelines, brandFonts);
    } else if (modalForm.section === 'colors') {
      const updatedPalettes = colorPalettes.map((p) => {
        if (p.id === modalForm.paletteId || (!modalForm.paletteId && p.id === 'core-google')) {
          if (modalMode === 'edit' && editingItem) {
            return {
              ...p,
              colors: p.colors.map((c) =>
                c.id === editingItem.id || c.name === editingItem.name
                  ? { ...c, name: modalForm.name, hex: modalForm.hex, rgb: modalForm.rgb }
                  : c
              ),
            };
          }
          return {
            ...p,
            colors: [
              ...p.colors,
              { id: `c-${Date.now()}`, name: modalForm.name, hex: modalForm.hex, rgb: modalForm.rgb },
            ],
          };
        }
        return p;
      });
      setColorPalettes(updatedPalettes);
      await persistChanges(logos, icons, updatedPalettes, avatarFrames, guidelines, brandFonts);
    } else if (modalForm.section === 'palette') {
      let updated;
      if (modalMode === 'edit' && editingItem) {
        updated = colorPalettes.map((p) =>
          p.id === editingItem.id ? { ...p, title: modalForm.name, description: modalForm.description } : p
        );
      } else {
        updated = [
          ...colorPalettes,
          { id: `pal-${Date.now()}`, title: modalForm.name, description: modalForm.description, colors: [] },
        ];
      }
      setColorPalettes(updated);
      await persistChanges(logos, icons, updated, avatarFrames, guidelines, brandFonts);
    } else if (modalForm.section === 'frames') {
      let updated;
      if (modalMode === 'edit' && editingItem) {
        updated = avatarFrames.map((f) =>
          f.id === editingItem.id
            ? { ...f, name: modalForm.name, color: modalForm.hex || f.color, src: modalForm.pngUrl || f.src }
            : f
        );
      } else {
        updated = [
          ...avatarFrames,
          {
            id: modalForm.name.toLowerCase().replace(/\s+/g, '-'),
            name: modalForm.name,
            color: modalForm.hex || '#4285F4',
            src: modalForm.pngUrl || '/assets/brand_kit/profile_avatar/profile_avatar_blue.png',
          },
        ];
      }
      setAvatarFrames(updated);
      await persistChanges(logos, icons, colorPalettes, updated, guidelines, brandFonts);
    }

    toast.success(modalMode === 'edit' ? 'Item updated!' : 'New item added!', 'Success');
    setIsModalOpen(false);
  };

  // Guidelines inline editing
  const handleEditRule = async (cat, index, current) => {
    const val = window.prompt('Edit rule:', current);
    if (val && val.trim()) {
      const updated = {
        ...guidelines,
        [cat]: guidelines[cat].map((r, i) => (i === index ? val.trim() : r)),
      };
      setGuidelines(updated);
      await persistChanges(logos, icons, colorPalettes, avatarFrames, updated, brandFonts);
      toast.success('Guideline updated', 'Saved');
    }
  };

  const handleDeleteRule = async (cat, index) => {
    if (!window.confirm('Delete this rule?')) return;
    const updated = {
      ...guidelines,
      [cat]: guidelines[cat].filter((_, i) => i !== index),
    };
    setGuidelines(updated);
    await persistChanges(logos, icons, colorPalettes, avatarFrames, updated, brandFonts);
    toast.success('Rule removed', 'Removed');
  };

  const handleAddRule = async (cat) => {
    const val = window.prompt('Add new rule:');
    if (val && val.trim()) {
      const updated = {
        ...guidelines,
        [cat]: [...(guidelines[cat] || []), val.trim()],
      };
      setGuidelines(updated);
      await persistChanges(logos, icons, colorPalettes, avatarFrames, updated, brandFonts);
      toast.success('Rule added', 'Added');
    }
  };

  // Filtering based on Search
  const query = searchQuery.trim().toLowerCase();
  const filteredLogos = logos.filter(
    (l) => !query || l.name.toLowerCase().includes(query) || (l.description && l.description.toLowerCase().includes(query))
  );
  const filteredIcons = icons.filter(
    (i) => !query || i.name.toLowerCase().includes(query) || (i.description && i.description.toLowerCase().includes(query))
  );
  const filteredPalettes = colorPalettes
    .map((p) => {
      if (!query) return p;
      const matchP = p.title.toLowerCase().includes(query) || (p.description && p.description.toLowerCase().includes(query));
      const matchC = p.colors.filter((c) => c.name.toLowerCase().includes(query) || c.hex.toLowerCase().includes(query));
      if (matchP) return p;
      if (matchC.length > 0) return { ...p, colors: matchC };
      return null;
    })
    .filter(Boolean);

  const activeFontObj = brandFonts.find((f) => f.id === selectedFont) || brandFonts[0] || INITIAL_FONTS[0];

  return (
    <div className="min-h-screen pb-24 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* 1. Standardized Header Banner */}
      <div className="relative bg-slate-50/70 dark:bg-slate-900/40 pt-8 pb-10 border-b border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-google-blue/10 text-google-blue border border-google-blue/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4">
            Brand Kit
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Brand <span className="text-google-blue">Kit</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Official Google Developer Groups on Campus brand assets, guidelines, and visual identity.
          </p>

          {isAdmin && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => handleOpenAdd('logos')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center gap-2"
              >
                <FaPlus size={11} />
                <span>Add Brand Asset</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Sticky Control Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
        <div className="sticky top-[80px] md:top-[80px] z-30 flex flex-col md:flex-row items-center justify-between gap-2 py-1 px-3 sm:py-1.5 sm:px-4 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-md mb-6">
          <div className="relative w-full md:w-80">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search assets, logos, colors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:border-google-blue text-xs text-slate-900 dark:text-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <FaTimes size={11} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-2.5 w-full md:w-auto">
            {/* Section Selection Dropdown */}
            <div className="relative flex-1 md:flex-initial">
              <button
                type="button"
                onClick={() => setIsSectionDropdownOpen(!isSectionDropdownOpen)}
                className="w-full md:w-52 flex items-center justify-between px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-google-blue transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <FaLayerGroup className="text-google-blue text-xs shrink-0" />
                  <span className="truncate">
                    {BRAND_SECTIONS.find((s) => s.value === selectedSection)?.label || 'All Sections'}
                  </span>
                </div>
                <FaChevronDown
                  className={`text-slate-400 transition-transform duration-200 text-xs shrink-0 ${
                    isSectionDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isSectionDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[90]"
                    onClick={() => setIsSectionDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-full md:w-52 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700/60 py-1.5 z-[100] max-h-64 overflow-y-auto">
                    {BRAND_SECTIONS.map((sec) => (
                      <button
                        key={sec.value}
                        type="button"
                        onClick={() => {
                          handleSectionChange(sec.value);
                          setIsSectionDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-1.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between ${
                          selectedSection === sec.value
                            ? 'text-google-blue font-bold bg-google-blue/5'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <span>{sec.label}</span>
                        {selectedSection === sec.value && (
                          <span className="w-1.5 h-1.5 rounded-full bg-google-blue shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <ViewToggle view={view} onViewChange={handleViewChange} />
          </div>
        </div>

        <div className="space-y-16">
          {/* SECTION 1: LOGOS & LOCKUPS (Transparent Cards with Mosaic Pattern) */}
          {(selectedSection === 'all' || selectedSection === 'logos') && (
            <section id="logos" className="scroll-mt-36">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Logos &amp; Lockups</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Official primary marks and horizontal titles on transparent mosaic background.
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleOpenAdd('logos')}
                    className="p-2 rounded-lg bg-google-blue/10 text-google-blue hover:bg-google-blue/20 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <FaPlus size={11} /> <span>Add Logo</span>
                  </button>
                )}
              </div>

              {filteredLogos.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 rounded-2xl border border-slate-200 dark:border-slate-800">
                  No logos match your search.
                </div>
              ) : (
                <div className={view === 'list' ? 'space-y-3' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'}>
                  {filteredLogos.map((asset) => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      view={view}
                      isAdmin={isAdmin}
                      onEdit={(a) => handleOpenEdit(a, 'logos')}
                      onDelete={(id) => handleDeleteItem(id, 'logos')}
                      onDownload={handleDownload}
                      onCopy={handleCopy}
                      copiedKey={copiedKey}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* SECTION 2: GDGoC SATI ICON (Transparent Cards with Mosaic Pattern) */}
          {(selectedSection === 'all' || selectedSection === 'icons') && (
            <section id="icons" className="scroll-mt-36">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">GDGoC SATI Icon</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Official Google Developer Groups brackets symbol &lt; &gt; in signature quad-colors.
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleOpenAdd('icons')}
                    className="p-2 rounded-lg bg-google-red/10 text-google-red hover:bg-google-red/20 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <FaPlus size={11} /> <span>Add Icon</span>
                  </button>
                )}
              </div>

              {filteredIcons.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 rounded-2xl border border-slate-200 dark:border-slate-800">
                  No icons match your search.
                </div>
              ) : (
                <div className={view === 'list' ? 'space-y-3' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'}>
                  {filteredIcons.map((asset) => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      view={view}
                      isAdmin={isAdmin}
                      onEdit={(a) => handleOpenEdit(a, 'icons')}
                      onDelete={(id) => handleDeleteItem(id, 'icons')}
                      onDownload={handleDownload}
                      onCopy={handleCopy}
                      copiedKey={copiedKey}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* SECTION 3: COLOR SYSTEM */}
          {(selectedSection === 'all' || selectedSection === 'colors') && (
            <section id="colors" className="scroll-mt-36">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Official Color System</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Click any circle to copy HEX / RGB.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 grid sm:grid-cols-3 sm:grid-cols-3">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleOpenAdd('colors')}
                        className="px-3 py-1.5 rounded-lg bg-google-yellow/20 text-yellow-600 dark:text-yellow-400 hover:bg-google-yellow/30 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <FaPlus size={10} /> <span>Add Color</span>
                      </button>
                      <button
                        onClick={() => handleOpenAdd('palette')}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <FaPlus size={10} /> <span>Add Palette</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDownload('/assets/brand_kit/colors.png', 'gdgoc_sati_colors.png')}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                  >
                    <FaDownload size={10} /> <span>Chart</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredPalettes.map((palette) => (
                  <div
                    key={palette.id}
                    className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-transparent p-4 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{palette.title}</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{palette.description}</p>
                      </div>
                      {isAdmin && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setModalForm({
                                section: 'colors',
                                name: '',
                                hex: '#4285F4',
                                rgb: 'rgb(66, 133, 244)',
                                paletteId: palette.id,
                              });
                              setModalMode('add');
                              setIsModalOpen(true);
                            }}
                            className="p-1 text-slate-400 hover:text-google-blue"
                            title="Add Swatch"
                          >
                            <FaPlus size={10} />
                          </button>
                          <button
                            onClick={() => handleOpenEdit({ id: palette.id, name: palette.title, description: palette.description }, 'palette')}
                            className="p-1 text-slate-400 hover:text-google-blue"
                            title="Edit Palette"
                          >
                            <FaEdit size={10} />
                          </button>
                          {colorPalettes.length > 1 && (
                            <button
                              onClick={() => handleDeleteItem(palette.id, 'palette')}
                              className="p-1 text-slate-400 hover:text-red-500"
                              title="Delete Palette"
                            >
                              <FaTrash size={10} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2 px-1">
                      {palette.colors.map((color) => (
                        <div
                          key={color.id || color.name}
                          onClick={() => handleCopy(color.hex, `${color.name} (${color.hex})`)}
                          className="flex flex-col items-center text-center cursor-pointer group shrink-0 relative"
                        >
                          <div
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-sm hover:scale-110 transition-transform ring-2 ring-slate-200/80 dark:ring-slate-700 flex items-center justify-center relative"
                            style={{ backgroundColor: color.hex }}
                          >
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white rounded-full p-1 text-[10px]">
                              <FaCopy />
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 mt-2 truncate max-w-[90px]">
                            {color.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 group-hover:text-google-blue">
                            {color.hex}
                          </span>

                          {isAdmin && (
                            <div className="absolute -top-1 -right-1 flex items-center gap-0.5 z-10 bg-slate-900/90 dark:bg-slate-800 rounded-full p-0.5 shadow-sm border border-slate-700">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEdit({ ...color, paletteId: palette.id }, 'colors');
                                }}
                                className="text-white hover:text-google-blue p-0.5"
                                title="Edit Swatch"
                              >
                                <FaEdit size={9} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteItem(color.id || color.name, 'colors', palette.id);
                                }}
                                className="text-white hover:text-red-400 p-0.5"
                                title="Delete Swatch"
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 4: TYPOGRAPHY (With Edit Button for Adding / Removing Fonts) */}
          {(selectedSection === 'all' || selectedSection === 'typography') && (
            <section id="typography" className="scroll-mt-36">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Typography</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Official GDGoC SATI brand typography scale. Test exact weights and font families.
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => setIsFontModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-google-blue/10 text-google-blue hover:bg-google-blue/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Manage Typography Fonts (Add / Remove Fonts)"
                  >
                    <FaEdit size={11} /> <span>Manage Fonts</span>
                  </button>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-transparent p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    {/* Font Dropdown */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-500 font-semibold">Font:</span>
                      <select
                        value={selectedFont}
                        onChange={(e) => setSelectedFont(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-google-blue cursor-pointer"
                      >
                        {brandFonts.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Weight Dropdown */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-500 font-semibold">Weight:</span>
                      <select
                        value={selectedWeight}
                        onChange={(e) => setSelectedWeight(Number(e.target.value))}
                        className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-google-blue cursor-pointer"
                      >
                        {FONT_WEIGHTS.map((w) => (
                          <option key={w.value} value={w.value}>
                            {w.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Size Slider */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Size: {fontSize}px</span>
                    <input
                      type="range"
                      min="16"
                      max="60"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-24 accent-google-blue cursor-pointer"
                    />
                  </div>
                </div>

                {/* Specimen Live Preview */}
                <div className="mt-4">
                  <input
                    type="text"
                    value={sampleText}
                    onChange={(e) => setSampleText(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 mb-4 focus:outline-google-blue"
                    placeholder="Type custom text to preview..."
                  />

                  <div
                    className="min-h-[120px] flex items-center text-slate-900 dark:text-white transition-all leading-tight break-words py-2"
                    style={{
                      fontSize: `${fontSize}px`,
                      fontWeight: selectedWeight,
                      fontFamily: activeFontObj.family,
                    }}
                  >
                    {sampleText || 'Google Developer Groups on Campus'}
                  </div>
                </div>

                {/* Code Snippets */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-lg">
                      {['cdn', 'import', 'css'].map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setFontSnippetTab(tab)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all uppercase ${fontSnippetTab === tab
                            ? 'bg-white dark:bg-slate-900 text-google-blue shadow-xs'
                            : 'text-slate-600 dark:text-slate-400'
                            }`}
                        >
                          {tab === 'cdn' ? 'HTML <link>' : tab === 'import' ? 'CSS @import' : 'CSS Rule'}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const snippet =
                          fontSnippetTab === 'cdn'
                            ? activeFontObj.cdnLink
                            : fontSnippetTab === 'import'
                              ? activeFontObj.cssImport
                              : activeFontObj.cssRule;
                        handleCopy(snippet, `${activeFontObj.label} Code`);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-google-blue/10 hover:bg-google-blue/20 text-google-blue text-xs font-semibold transition-colors"
                    >
                      {copiedKey === `${activeFontObj.label} Code` ? (
                        <>
                          <FaCheck className="text-google-green text-xs" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <FaCopy size={11} />
                          <span>Copy Snippet</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-3">
                    <pre className="text-[11px] sm:text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
                      {fontSnippetTab === 'cdn' && activeFontObj.cdnLink}
                      {fontSnippetTab === 'import' && activeFontObj.cssImport}
                      {fontSnippetTab === 'css' && activeFontObj.cssRule}
                    </pre>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 5: T-SHIRT & APPAREL DESIGNS */}
          {(selectedSection === 'all' || selectedSection === 'merch') && (
            <section id="merch" className="scroll-mt-36">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">T-Shirt &amp; Apparel Designs</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Official GDGoC SATI chapter drop-shoulder t-shirt with chest badge and statement back artwork.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleDownload(
                        T_SHIRT_IMAGES[merchColor]?.[merchView],
                        `gdgoc_sati_tshirt_${merchColor}_${merchView}_2025.png`
                      )
                    }
                    className="px-3.5 py-1.5 rounded-lg bg-google-blue text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-google-blue/90 transition-colors shadow-xs"
                  >
                    <FaDownload size={11} /> Download Mockup (.png)
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-transparent p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[460px]">
                {/* Header Controls: Color picker on Left (Black & White), Front/Back switch on Right */}
                <div className="w-full flex items-center justify-between mb-4 z-10">
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-950 p-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-xs">
                    {[
                      { id: 'black', label: 'Black (Official)', hex: '#111827' },
                      { id: 'white', label: 'White', hex: '#F9FAFB' },
                    ].map((color) => (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => setMerchColor(color.id)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          merchColor === color.id
                            ? ' border-blue-500 scale-110 shadow-sm ring-2 ring-blue-500/30'
                            : 'border-slate-300 dark:border-slate-700 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={`Color: ${color.label}`}
                      />
                    ))}
                  </div>

                  <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setMerchView('front')}
                      className={`px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                        merchView === 'front'
                          ? 'bg-google-blue text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Front
                    </button>
                    <button
                      type="button"
                      onClick={() => setMerchView('back')}
                      className={`px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                        merchView === 'back'
                          ? 'bg-google-blue text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Back
                    </button>
                  </div>
                </div>

                {/* Drop-Shoulder Realistic T-Shirt Mockup with Smooth Crossfade */}
                <div className="relative w-full max-w-[320px] sm:max-w-[360px] aspect-[1080/1350] flex items-center justify-center select-none my-2 drop-shadow-2xl">
                  {/* Black Mockup */}
                  <img
                    src={T_SHIRT_IMAGES.black[merchView]}
                    alt={`GDGoC SATI T-Shirt Black ${merchView}`}
                    draggable={false}
                    className={`absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-opacity duration-500 ease-in-out ${
                      merchColor === 'black' ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  />
                  {/* White Mockup */}
                  <img
                    src={T_SHIRT_IMAGES.white[merchView]}
                    alt={`GDGoC SATI T-Shirt White ${merchView}`}
                    draggable={false}
                    className={`absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-opacity duration-500 ease-in-out ${
                      merchColor === 'white' ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  />
                </div>
              </div>
            </section>
          )}

          {/* SECTION 6: PROFILE AVATAR STUDIO */}
          {(selectedSection === 'all' || selectedSection === 'avatar') && (
            <section id="avatar" className="scroll-mt-36">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Profile Avatar Studio</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Generate your official GDGoC community display picture framed in signature Google colors.
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleOpenAdd('frames')}
                    className="p-1.5 rounded-lg bg-google-blue/10 text-google-blue text-xs font-semibold flex items-center gap-1.5"
                  >
                    <FaPlus size={11} /> <span>Add Frame</span>
                  </button>
                )}
              </div>

              <div className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-transparent p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[480px]">
                <div className="w-full flex items-center justify-center md:justify-between mb-6 z-10">
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-950 p-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-xs">
                    {avatarFrames.map((frame) => {
                      const isSelected = (selectedFrame?.id || 'blue') === frame.id;
                      return (
                        <button
                          key={frame.id}
                          type="button"
                          onClick={() => setSelectedFrame(frame)}
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 transition-transform ${isSelected ? ' scale-115 shadow-sm' : 'border-transparent'
                            }`}
                          style={{ backgroundColor: frame.color }}
                          title={`Select ${frame.name}`}
                        />
                      );
                    })}
                  </div>

                  <div className="hidden md:flex items-center gap-2 bg-white dark:bg-slate-950 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-xs text-xs font-mono text-slate-600 dark:text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedFrame.color }} />
                    <span className="font-semibold">{selectedFrame.name}</span>
                  </div>
                </div>

                {/* Center Workspace: Avatar on Left, Controls & Buttons on Right for Desktop */}
                <div className="w-full flex flex-col md:flex-row items-center justify-center md:gap-10 lg:gap-16 my-2 mb-6">
                  {/* Left: Avatar Circle Preview */}
                  <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl flex items-center justify-center select-none shrink-0 mb-6 md:mb-0">
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-0" />
                    <img
                      key={selectedFrame?.id || 'blue'}
                      src={selectedFrame?.src || '/assets/brand_kit/profile_avatar/profile_avatar_blue.png'}
                      alt={selectedFrame?.name || 'Google Frame'}
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/brand_kit/profile_avatar/profile_avatar_blue.png';
                      }}
                    />
                  </div>

                  {/* Right: Controls & Action Buttons */}
                  <div className="w-full max-w-sm flex flex-col items-center md:items-stretch">
                    {userImage && (
                      <div className="mb-4 w-full p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-left shadow-xs">
                        <div className="flex items-center justify-between text-slate-500">
                          <span>Zoom: {avatarScale.toFixed(1)}x</span>
                          <input
                            type="range"
                            min="0.5"
                            max="2.5"
                            step="0.1"
                            value={avatarScale}
                            onChange={(e) => setAvatarScale(Number(e.target.value))}
                            className="w-32 accent-google-blue cursor-pointer"
                          />
                        </div>
                        <div className="flex items-center justify-between text-slate-500">
                          <span>Pan X</span>
                          <input
                            type="range"
                            min="-50"
                            max="50"
                            value={avatarOffsetX}
                            onChange={(e) => setAvatarOffsetX(Number(e.target.value))}
                            className="w-32 accent-google-blue cursor-pointer"
                          />
                        </div>
                        <div className="flex items-center justify-between text-slate-500">
                          <span>Pan Y</span>
                          <input
                            type="range"
                            min="-50"
                            max="50"
                            value={avatarOffsetY}
                            onChange={(e) => setAvatarOffsetY(Number(e.target.value))}
                            className="w-32 accent-google-blue cursor-pointer"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setUserImage(null);
                            drawAvatarCanvas();
                          }}
                          className="w-full text-center text-red-500 hover:underline pt-1 text-[11px] font-medium"
                        >
                          Remove Photo
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-3 w-full">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 h-11 inline-flex items-center justify-center gap-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold"
                      >
                        <FaUpload size={12} />
                        <span>{userImage ? 'Change Photo' : 'Upload Photo'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadAvatar}
                        disabled={isGeneratingAvatar}
                        className="flex-1 h-11 inline-flex items-center justify-center gap-2 px-4 rounded-xl bg-google-blue text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-90 disabled:opacity-50"
                      >
                        <FaDownload size={13} />
                        <span>{isGeneratingAvatar ? 'Exporting...' : 'Download DP (.png)'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="w-full pt-5 border-t border-slate-200/80 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono block mb-3">
                    Raw Transparent Frames (PNG)
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
                    {avatarFrames.map((frame) => (
                      <button
                        key={`raw-${frame.id}`}
                        type="button"
                        onClick={() => handleDownload(frame.src, `gdgoc_sati_frame-${frame.id}.png`)}
                        className="w-full h-11 flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        <span className="flex items-center gap-2 truncate pr-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: frame.color }} />
                          <span className="truncate">{frame.name}</span>
                        </span>
                        <FaDownload className="text-slate-400 text-xs shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 7: BRAND GUIDELINES */}
          {(selectedSection === 'all' || selectedSection === 'guidelines') && (
            <section id="guidelines" className="scroll-mt-36">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Brand Guidelines &amp; Naming Rules</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Follow official chapter naming and visual integrity standards.
                  </p>
                </div>
              </div>

              {/* Chapter Naming Conventions */}
              <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2 mb-6">
                <div className="p-4 rounded-xl border border-google-green/40 dark:border-google-green/30 bg-transparent min-w-[280px] sm:min-w-[340px] md:min-w-[420px] flex-1 shrink-0">
                  <div className="flex items-center justify-between text-google-green font-bold text-xs sm:text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <FaCheckCircle /> <span>Approved Official Names</span>
                    </div>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleAddRule('namingApproved')}
                        className="text-[11px] font-semibold text-google-green hover:underline flex items-center gap-1"
                      >
                        <FaPlus size={9} /> Add
                      </button>
                    )}
                  </div>
                  <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                    {guidelines.namingApproved?.map((rule, idx) => (
                      <li key={idx} className="flex items-center justify-between group">
                        <span>• {rule}</span>
                        {isAdmin && (
                          <div className="flex items-center gap-1.5 ml-2">
                            <button
                              type="button"
                              onClick={() => handleEditRule('namingApproved', idx, rule)}
                              className="text-slate-400 hover:text-google-blue text-[10px]"
                            >
                              <FaEdit size={10} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRule('namingApproved', idx)}
                              className="text-slate-400 hover:text-red-500 text-[10px]"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-google-red/40 dark:border-google-red/30 bg-transparent min-w-[280px] sm:min-w-[340px] md:min-w-[420px] flex-1 shrink-0">
                  <div className="flex items-center justify-between text-google-red font-bold text-xs sm:text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <FaTimesCircle /> <span>Deprecated / Unapproved Names</span>
                    </div>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleAddRule('namingDeprecated')}
                        className="text-[11px] font-semibold text-google-red hover:underline flex items-center gap-1"
                      >
                        <FaPlus size={9} /> Add
                      </button>
                    )}
                  </div>
                  <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                    {guidelines.namingDeprecated?.map((rule, idx) => (
                      <li key={idx} className="flex items-center justify-between group">
                        <span>• {rule}</span>
                        {isAdmin && (
                          <div className="flex items-center gap-1.5 ml-2">
                            <button
                              type="button"
                              onClick={() => handleEditRule('namingDeprecated', idx, rule)}
                              className="text-slate-400 hover:text-google-blue text-[10px]"
                            >
                              <FaEdit size={10} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRule('namingDeprecated', idx)}
                              className="text-slate-400 hover:text-red-500 text-[10px]"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Visual Standards */}
              <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent min-w-[280px] sm:min-w-[340px] md:min-w-[420px] flex-1 shrink-0">
                  <div className="flex items-center justify-between text-google-green font-bold text-xs sm:text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <FaCheckCircle /> <span>Visual Do&apos;s</span>
                    </div>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleAddRule('visualDos')}
                        className="text-[11px] font-semibold text-google-green hover:underline flex items-center gap-1"
                      >
                        <FaPlus size={9} /> Add
                      </button>
                    )}
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {guidelines.visualDos?.map((rule, idx) => (
                      <li key={idx} className="flex items-start justify-between gap-2">
                        <span className="flex items-start gap-1.5">
                          <FaCheck className="text-google-green text-xs shrink-0 mt-0.5" />
                          <span>{rule}</span>
                        </span>
                        {isAdmin && (
                          <div className="flex items-center gap-1.5 shrink-0 ml-1">
                            <button
                              type="button"
                              onClick={() => handleEditRule('visualDos', idx, rule)}
                              className="text-slate-400 hover:text-google-blue text-[10px]"
                            >
                              <FaEdit size={10} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRule('visualDos', idx)}
                              className="text-slate-400 hover:text-red-500 text-[10px]"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent min-w-[280px] sm:min-w-[340px] md:min-w-[420px] flex-1 shrink-0">
                  <div className="flex items-center justify-between text-google-red font-bold text-xs sm:text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <FaTimesCircle /> <span>Visual Don&apos;ts</span>
                    </div>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleAddRule('visualDonts')}
                        className="text-[11px] font-semibold text-google-red hover:underline flex items-center gap-1"
                      >
                        <FaPlus size={9} /> Add
                      </button>
                    )}
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {guidelines.visualDonts?.map((rule, idx) => (
                      <li key={idx} className="flex items-start justify-between gap-2">
                        <span className="flex items-start gap-1.5">
                          <span className="text-google-red font-bold text-xs shrink-0">✕</span>
                          <span>{rule}</span>
                        </span>
                        {isAdmin && (
                          <div className="flex items-center gap-1.5 shrink-0 ml-1">
                            <button
                              type="button"
                              onClick={() => handleEditRule('visualDonts', idx, rule)}
                              className="text-slate-400 hover:text-google-blue text-[10px]"
                            >
                              <FaEdit size={10} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRule('visualDonts', idx)}
                              className="text-slate-400 hover:text-red-500 text-[10px]"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* 3. Typography Font Management Modal */}
      <AnimatePresence>
        {isFontModalOpen && (
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
                <div className="flex items-center gap-2">
                  <FaFont className="text-google-blue" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Manage Typography Fonts
                  </h3>
                </div>
                <button
                  onClick={() => setIsFontModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <FaTimes size={14} />
                </button>
              </div>

              <div className="p-5 space-y-6 overflow-y-auto">
                {/* Current Fonts List */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Current Active Fonts ({brandFonts.length})
                  </h4>
                  <div className="space-y-2">
                    {brandFonts.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{f.label}</p>
                          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{f.family}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFont(f.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Remove this font"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add New Font Form */}
                <form onSubmit={handleAddFont} className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Add New Font
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Font Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Outfit, Poppins"
                        value={newFont.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewFont({
                            ...newFont,
                            name: val,
                            family: val ? `'${val}', sans-serif` : '',
                          });
                        }}
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-google-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Font Family (CSS)
                      </label>
                      <input
                        type="text"
                        placeholder="'Outfit', sans-serif"
                        value={newFont.family}
                        onChange={(e) => setNewFont({ ...newFont, family: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-google-blue font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      HTML &lt;link&gt; CDN Tag (Optional)
                    </label>
                    <textarea
                      rows="2"
                      placeholder="Auto-generated if left empty..."
                      value={newFont.cdnLink}
                      onChange={(e) => setNewFont({ ...newFont, cdnLink: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono focus:outline-google-blue"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-google-blue hover:bg-google-blue/90 text-white text-xs font-semibold flex items-center gap-2 shadow-sm"
                    >
                      <FaPlus size={11} /> <span>Add Font</span>
                    </button>
                  </div>
                </form>
              </div>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Universal Admin Modal for Logos, Icons, Colors, Frames */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {modalMode === 'edit' ? 'Edit Asset' : 'Add Brand Asset'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <FaTimes size={14} />
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="p-5 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Section
                  </label>
                  <select
                    value={modalForm.section}
                    onChange={(e) => setModalForm({ ...modalForm, section: e.target.value })}
                    disabled={modalMode === 'edit'}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-google-blue"
                  >
                    <option value="logos">Logos &amp; Lockups</option>
                    <option value="icons">GDGoC SATI Icon</option>
                    <option value="colors">Color Swatch</option>
                    <option value="palette">Color Palette Group</option>
                    <option value="frames">Profile Avatar Frame</option>
                  </select>
                </div>

                {modalForm.section === 'colors' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Target Palette Group
                    </label>
                    <select
                      value={modalForm.paletteId}
                      onChange={(e) => setModalForm({ ...modalForm, paletteId: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-google-blue"
                    >
                      {colorPalettes.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {modalForm.section === 'colors' ? 'Color Name' : 'Asset Name / Title'}
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.name}
                    onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                    placeholder={modalForm.section === 'colors' ? 'e.g. Electric Blue' : 'e.g. GDGoC SATI Stacked Mark'}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-google-blue"
                  />
                </div>

                {modalForm.section === 'colors' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        HEX Code
                      </label>
                      <input
                        type="text"
                        required
                        value={modalForm.hex}
                        onChange={(e) => setModalForm({ ...modalForm, hex: e.target.value })}
                        placeholder="#4285F4"
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-google-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        RGB Code
                      </label>
                      <input
                        type="text"
                        value={modalForm.rgb}
                        onChange={(e) => setModalForm({ ...modalForm, rgb: e.target.value })}
                        placeholder="rgb(66, 133, 244)"
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-google-blue"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Description
                      </label>
                      <textarea
                        rows="2"
                        value={modalForm.description}
                        onChange={(e) => setModalForm({ ...modalForm, description: e.target.value })}
                        placeholder="Brief usage description..."
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-google-blue"
                      />
                    </div>

                    {modalForm.section === 'frames' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Frame Theme Color (Hex)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={modalForm.hex || '#4285F4'}
                            onChange={(e) => setModalForm({ ...modalForm, hex: e.target.value })}
                            className="w-10 h-10 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent shrink-0"
                          />
                          <input
                            type="text"
                            required
                            value={modalForm.hex || '#4285F4'}
                            onChange={(e) => setModalForm({ ...modalForm, hex: e.target.value })}
                            className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-google-blue font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {modalForm.section !== 'palette' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {modalForm.section === 'frames' ? 'Raw Frame PNG URL' : 'PNG Image URL'}
                        </label>
                        <input
                          type="text"
                          required
                          value={modalForm.pngUrl}
                          onChange={(e) => setModalForm({ ...modalForm, pngUrl: e.target.value })}
                          placeholder="/assets/brand_kit/gdgoc_sati_logo.png or https://..."
                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-google-blue"
                        />
                      </div>
                    )}

                    {modalForm.section !== 'frames' && modalForm.section !== 'palette' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Vector SVG URL (Optional)
                        </label>
                        <input
                          type="text"
                          value={modalForm.svgUrl}
                          onChange={(e) => setModalForm({ ...modalForm, svgUrl: e.target.value })}
                          placeholder="/assets/brand_kit/gdgoc_sati_logo.svg or https://..."
                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-google-blue"
                        />
                      </div>
                    )}
                  </>
                )}

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-google-blue hover:bg-google-blue/90 text-white text-xs font-semibold shadow-sm"
                  >
                    {modalMode === 'edit' ? 'Update Item' : 'Save Item'}
                  </button>
                </div>
              </form>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
