import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaImages,
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaCamera,
  FaCalendarAlt,
  FaChevronDown,
  FaArrowRight,
} from 'react-icons/fa';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ItemEditorModal, DeleteConfirmModal } from '../components/admin/AdminModals';
import { CardSkeleton } from '../components/common/Skeleton';
import ViewToggle from '../components/common/ViewToggle';

const GalleryListItem = ({
  album,
  onClick,
  isAdmin,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  const { title, year, type, coverImage, images = [] } = album;
  const count = images.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onClick(album)}
      className="relative bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group cursor-pointer overflow-hidden"
    >
      <div className={`flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1 ${isAdmin ? 'pr-20 sm:pr-0' : ''}`}>
        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative">
          <img
            src={coverImage || images[0] || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1">
            {type && (
              <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-google-red/10 text-google-red border border-google-red/20 shrink-0">
                {type}
              </span>
            )}
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-400 min-w-0">
              <FaCalendarAlt size={10} className="text-google-yellow shrink-0" />
              <span>{year || '2026'}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-400 min-w-0">
              <FaImages size={10} className="text-google-blue shrink-0" />
              <span>{count} photos</span>
            </div>
          </div>

          <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-google-red transition-colors truncate max-w-[220px] sm:max-w-[1020px]">
            {title}
          </h3>
        </div>
      </div>

      {/* Admin Controls Top-Right Inside Card */}
      {isAdmin && (
        <div className="absolute top-3.5 right-3.5 sm:static flex items-center gap-1 z-10 sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onMoveUp(album)}
            disabled={isFirst}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30"
            title="Move Up"
          >
            <FaArrowUp size={11} />
          </button>
          <button
            onClick={() => onMoveDown(album)}
            disabled={isLast}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30"
            title="Move Down"
          >
            <FaArrowDown size={11} />
          </button>
          <button
            onClick={() => onEdit(album)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-google-blue"
            title="Edit Album"
          >
            <FaEdit size={11} />
          </button>
          <button
            onClick={() => onDelete(album)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-google-red"
            title="Delete Album"
          >
            <FaTrash size={11} />
          </button>
        </div>
      )}

      <div className="w-full sm:w-auto flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onClick(album)}
          className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-google-red hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
        >
          <span>View Album</span>
          <FaArrowRight size={10} />
        </button>
      </div>
    </motion.div>
  );
};

const GalleryCard = ({
  album,
  onClick,
  isAdmin,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  return (
    <div className="relative group/card">
      {/* Admin Quick Action Controls */}
      {isAdmin && (
        <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-lg border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity">
          {!isFirst && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp(album);
              }}
              className="p-1 hover:text-google-blue text-slate-500 transition-colors"
              title="Move Up"
            >
              <FaArrowUp size={11} />
            </button>
          )}
          {!isLast && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown(album);
              }}
              className="p-1 hover:text-google-blue text-slate-500 transition-colors"
              title="Move Down"
            >
              <FaArrowDown size={11} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(album);
            }}
            className="p-1 hover:text-google-blue text-slate-500 transition-colors"
            title="Edit Album"
          >
            <FaEdit size={12} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(album);
            }}
            className="p-1 hover:text-red-600 text-red-500 transition-colors"
            title="Delete Album"
          >
            <FaTrash size={12} />
          </button>
        </div>
      )}

      <motion.div
        whileHover={{ y: -6 }}
        onClick={() => onClick(album)}
        className="group relative h-72 md:h-80 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 bg-slate-100 dark:bg-slate-800"
      >
        {album.coverImage ? (
          <img
            src={album.coverImage}
            alt={album.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}

        <div
          className={`w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600 ${
            album.coverImage ? 'hidden' : 'flex'
          }`}
        >
          <FaImages className="text-6xl opacity-30" />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
              {album.type || 'Event'}
            </span>
            <span className="text-xs text-white/70 font-semibold">{album.year || '2026'}</span>
          </div>

          <h3 className="text-xl font-bold leading-tight drop-shadow-md group-hover:text-google-blue transition-colors">
            {album.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-white/80 mt-2">
            <FaCamera size={11} />
            <span>{album.images?.length || 0} Photos</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Fullscreen Album Viewer & Image Manager
const AlbumModal = ({ album, onClose, isAdmin, onAddImage, onRemoveImage }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const images = album?.images || [];

  if (!album) return null;

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddImageClick = () => {
    const url = prompt('Enter image URL to add to this album:');
    if (url && url.trim()) {
      onAddImage(album._id, url.trim());
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[260] bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 md:p-8"
        onClick={onClose}
      >
        {/* Top Bar */}
        <div
          className="flex justify-between items-center text-white z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <h3 className="text-xl font-bold">{album.title}</h3>
            <p className="text-xs text-white/60">
              Photo {images.length > 0 ? currentIdx + 1 : 0} of {images.length}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={handleAddImageClick}
                className="px-3.5 py-1.5 bg-google-blue hover:bg-blue-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg"
              >
                <FaPlus size={11} /> Add Photo
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* Main Photo View */}
        <div
          className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {images.length > 0 ? (
            <div className="relative max-h-full max-w-full flex items-center justify-center group">
              <img
                src={images[currentIdx]}
                alt={`Photo ${currentIdx + 1}`}
                className="max-h-[75vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
              />

              {/* Delete Current Photo (Admin) */}
              {isAdmin && (
                <button
                  onClick={() => {
                    if (window.confirm('Delete this photo from the album?')) {
                      onRemoveImage(album._id, images[currentIdx]);
                    }
                  }}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-red-600/80 hover:bg-red-600 text-white shadow-lg backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                  title="Delete this photo"
                >
                  <FaTrash size={14} />
                </button>
              )}
            </div>
          ) : (
            <div className="text-center text-white/50">
              <FaImages className="text-6xl mx-auto mb-2 opacity-40" />
              <p className="text-sm">No photos in this album yet.</p>
            </div>
          )}

          {/* Nav Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 md:left-6 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all"
              >
                <FaChevronLeft size={18} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 md:right-6 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all"
              >
                <FaChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Filmstrip */}
        {images.length > 1 && (
          <div
            className="flex justify-center gap-2 overflow-x-auto py-2 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  currentIdx === idx ? 'border-google-blue scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};

const Gallery = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  // Admin Controls
  const { isAdmin } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [albumToEdit, setAlbumToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState(null);

  // Search, Filter & View Mode
  const [searchParams, setSearchParams] = useSearchParams();
  const initialYear = searchParams.get('year') || 'All';
  const initialQuery = searchParams.get('q') || '';
  const initialView = searchParams.get('view') || (typeof window !== 'undefined' && window.innerWidth < 768 ? 'list' : 'grid');

  const [searchQuery, setSearchQueryState] = useState(initialQuery);
  const [selectedYear, setSelectedYearState] = useState(initialYear);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [view, setViewState] = useState(initialView);

  const setSearchQuery = (q) => {
    setSearchQueryState(q);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!q.trim()) next.delete('q');
      else next.set('q', q);
      return next;
    }, { replace: true });
  };

  const setSelectedYear = (yr) => {
    setSelectedYearState(yr);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (yr === 'All') next.delete('year');
      else next.set('year', yr);
      return next;
    }, { replace: true });
  };

  const setView = (v) => {
    setViewState(v);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('view', v);
      return next;
    }, { replace: true });
  };

  const availableYears = ['All', ...Array.from(new Set(albums.map((a) => a.year).filter(Boolean)))];
  if (!availableYears.includes('2026')) availableYears.push('2026');
  if (!availableYears.includes('2025')) availableYears.push('2025');

  const filteredAlbums = albums.filter((a) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      a.title?.toLowerCase().includes(q) ||
      (a.type && a.type.toLowerCase().includes(q));
    const matchesYear = selectedYear === 'All' || a.year === selectedYear;
    return matchesSearch && matchesYear;
  });

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const res = await api.gallery.getAll();
      if (res.success && res.data.length > 0) {
        setAlbums(res.data);
      } else {
        // Fallback demo album
        setAlbums([
          
        ]);
      }
    } catch (err) {
      console.warn('Fallback gallery data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleOpenAdd = () => {
    setAlbumToEdit(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (album) => {
    setAlbumToEdit(album);
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (album) => {
    setAlbumToDelete(album);
    setIsDeleteModalOpen(true);
  };

  const handleSaveAlbum = async (formData) => {
    if (albumToEdit?._id && albumToEdit._id !== 'sample_1') {
      await api.gallery.update(albumToEdit._id, formData);
    } else {
      await api.gallery.create(formData);
    }
    await fetchAlbums();
  };

  const handleDeleteAlbum = async () => {
    if (albumToDelete?._id && albumToDelete._id !== 'sample_1') {
      await api.gallery.delete(albumToDelete._id);
      await fetchAlbums();
    } else {
      setAlbums((prev) => prev.filter((a) => a._id !== albumToDelete._id));
    }
  };

  const handleMove = async (index, direction) => {
    const newAlbums = [...albums];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newAlbums.length) return;

    const temp = newAlbums[index];
    newAlbums[index] = newAlbums[targetIndex];
    newAlbums[targetIndex] = temp;

    setAlbums(newAlbums);

    const orderedIds = newAlbums.map((a) => a._id).filter((id) => id && id !== 'sample_1');
    if (orderedIds.length > 0) {
      await api.gallery.reorder(orderedIds);
    }
  };

  const handleAddImage = async (albumId, imageUrl) => {
    if (albumId && albumId !== 'sample_1') {
      const res = await api.gallery.addImage(albumId, imageUrl);
      if (res.success && res.data) {
        setSelectedAlbum(res.data);
        setAlbums((prev) => prev.map((a) => (a._id === albumId ? res.data : a)));
      }
    }
  };

  const handleRemoveImage = async (albumId, imageUrl) => {
    if (albumId && albumId !== 'sample_1') {
      const res = await api.gallery.removeImage(albumId, imageUrl);
      if (res.success && res.data) {
        setSelectedAlbum(res.data);
        setAlbums((prev) => prev.map((a) => (a._id === albumId ? res.data : a)));
      }
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-20">
      {/* Header Banner */}
      <div className="bg-slate-50/50 dark:bg-slate-900/40 py-20 border-b border-slate-100 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-google-red/10 text-google-red border border-google-red/20 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <span>Moments & Memories</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4"
          >
            Community <span className="text-google-red">Gallery</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8"
          >
            Visual highlights from our workshops, hackathons, speaker meetups, and developer gatherings.
          </motion.p>

          {/* Admin Add Album Button */}
          {isAdmin && (
            <div className="flex justify-center">
              <button
                onClick={handleOpenAdd}
                className="px-6 py-3 rounded-2xl bg-google-red hover:bg-red-600 text-white font-bold text-sm shadow-lg shadow-google-red/25 transition-all flex items-center gap-2"
              >
                <FaPlus size={13} />
                <span>Create New Album</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Container with Sticky Controls Bar and Albums Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="sticky top-[88px] md:top-[96px] z-30 flex flex-col md:flex-row items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-md mb-8">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search albums by title or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:border-google-red text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Year Dropdown */}
            <div className="relative flex-1 md:flex-initial">
              <button
                type="button"
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                className="w-full md:w-40 flex items-center justify-between px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-google-red transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-google-red" />
                  <span>{selectedYear === 'All' ? 'All Years' : selectedYear}</span>
                </div>
                <FaChevronDown
                  className={`text-slate-400 transition-transform duration-200 ${
                    isYearDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isYearDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[90]"
                    onClick={() => setIsYearDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-full md:w-40 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700/60 py-2 z-[100]">
                    {availableYears.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => {
                          setSelectedYear(year);
                          setIsYearDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                          selectedYear === year
                            ? 'text-google-red font-bold'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {year === 'All' ? 'All Years' : year}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* List / Grid Switcher */}
            <ViewToggle view={view} onViewChange={setView} />
          </div>
        </div>

        {/* Albums Content (List or Grid) */}
        <div className="mt-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <CardSkeleton key={n} />
            ))}
          </div>
        ) : filteredAlbums.length > 0 ? (
          view === 'list' ? (
            <div className="space-y-3">
              {filteredAlbums.map((album, idx) => (
                <GalleryListItem
                  key={album._id || idx}
                  album={album}
                  onClick={(a) => setSelectedAlbum(a)}
                  isAdmin={isAdmin}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                  onMoveUp={() => handleMove(idx, -1)}
                  onMoveDown={() => handleMove(idx, 1)}
                  isFirst={idx === 0}
                  isLast={idx === filteredAlbums.length - 1}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAlbums.map((album, idx) => (
                <GalleryCard
                  key={album._id || idx}
                  album={album}
                  onClick={(a) => setSelectedAlbum(a)}
                  isAdmin={isAdmin}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                  onMoveUp={() => handleMove(idx, -1)}
                  onMoveDown={() => handleMove(idx, 1)}
                  isFirst={idx === 0}
                  isLast={idx === filteredAlbums.length - 1}
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8">
            <FaImages className="text-4xl text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No albums found matching your filter.</p>
          </div>
        )}
      </div>
      </div>

      {/* Fullscreen Album Viewer & Photo Manager */}
      <AlbumModal
        album={selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
        isAdmin={isAdmin}
        onAddImage={handleAddImage}
        onRemoveImage={handleRemoveImage}
      />

      {/* Admin Modals */}
      <ItemEditorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveAlbum}
        item={albumToEdit}
        type="album"
        title={albumToEdit ? 'Edit Event Album' : 'Create New Event Album'}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAlbum}
        title="Delete Album"
        message={`Are you sure you want to delete "${albumToDelete?.title}"?`}
      />
    </div>
  );
};

export default Gallery;
