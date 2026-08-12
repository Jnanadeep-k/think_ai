import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import CourseModal from '../../components/admin/CourseModal';
import {
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  selectCourses,
  selectCoursesLoading,
  selectCoursesError,
} from '../../features/courses/courseSlice';

const STATUS_STYLES = {
  ACTIVE: 'bg-purple-500/20 text-purple-300 border-purple-400/50 shadow-[0_0_10px_rgba(168,85,247,0.4)]',
};
const DEFAULT_STATUS_STYLE = 'bg-white/5 text-purple-200 border-purple-500/20';

export default function AdminCoursesPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const dispatch = useDispatch();
  
  const rawCourses = useSelector(selectCourses);
  const loading = useSelector(selectCoursesLoading);
  const error = useSelector(selectCoursesError);

  const currentCourses = useMemo(() => {
    if (Array.isArray(rawCourses)) return rawCourses;
    if (rawCourses && Array.isArray(rawCourses.courses)) return rawCourses.courses; 
    return [];
  }, [rawCourses]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    dispatch(fetchCourses({ 
      page: currentPage, 
      limit: ITEMS_PER_PAGE, 
      search: debouncedSearch 
    }));
  }, [dispatch, currentPage, debouncedSearch]);

  const handleOpenModal = (course = null) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleSaveCourse = async (courseData) => {
    const isEdit = Boolean(courseData.id);
    const { level, language, createdAt, updatedAt, id, ...cleanData } = courseData;

    if (cleanData.price !== undefined && cleanData.price !== null) {
      cleanData.price = parseFloat(cleanData.price);
    }

    const thunk = isEdit
      ? updateCourse({ id: courseData.id, updates: cleanData })
      : createCourse(cleanData);

    const result = await dispatch(thunk);

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(isEdit ? 'Course updated successfully' : 'Course created successfully', { theme: "dark" });
      setIsModalOpen(false);
      dispatch(fetchCourses({ page: currentPage, limit: ITEMS_PER_PAGE, search: debouncedSearch }));
    } else {
      toast.error(result.payload || (isEdit ? 'Failed to update course' : 'Failed to create course'), { theme: "dark" });
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    const result = await dispatch(deleteCourse(id));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Course deleted', { theme: "dark" });
      dispatch(fetchCourses({ page: currentPage, limit: ITEMS_PER_PAGE, search: debouncedSearch }));
      
      if (currentCourses.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } else {
      toast.error(result.payload || 'Failed to delete course', { theme: "dark" });
    }
  };

  const hasNextPage = currentCourses.length === ITEMS_PER_PAGE;

  return (
    // Master wrapper heavily condensed to prevent scrolling
    <div className="relative flex flex-col h-full px-4 sm:px-6 py-2 -mt-2 space-y-4 bg-gradient-to-br from-[#0c0914] via-[#151025] to-[#1a1438] rounded-3xl border border-purple-500/10 shadow-2xl overflow-hidden">
      
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Header */}
      <div className="relative z-10 flex flex-row items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-fuchsia-400 tracking-wide">
            Courses
          </h1>
        </div>
        <div className="shadow-[0_0_20px_rgba(168,85,247,0.3)] rounded-xl">
          <button 
            onClick={() => handleOpenModal()} 
            className="px-6 py-2 text-sm font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-400 hover:to-cyan-300 text-white border-0 rounded-xl transition-all duration-300 shadow-lg"
          >
            + New Course
          </button>
        </div>
      </div>

      {/* Glass Panel */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0 bg-white/[0.03] backdrop-blur-2xl rounded-2xl p-4 border border-purple-500/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-3">
        
        {/* Compact Search Input (No Label) */}
        <div className="max-w-sm shrink-0 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by course name..."
            className="w-full bg-black/20 border border-purple-500/30 text-purple-100 placeholder-purple-300/30 focus:border-purple-400 focus:ring-purple-400/50 rounded-lg px-4 py-2 text-sm outline-none transition-all shadow-inner"
          />
          <svg className="absolute right-3 top-2.5 h-4 w-4 text-purple-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        {loading && <div className="flex-1 flex items-center justify-center"><LoadingSpinner label="Decrypting courses..." className="text-purple-400" /></div>}

        {!loading && error && (
          <div className="flex-1 flex items-center justify-center">
            <ErrorState message={error} onRetry={() => dispatch(fetchCourses({ page: currentPage, limit: ITEMS_PER_PAGE, search: debouncedSearch }))} />
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Grid stretched to fill space evenly without scrolling */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 content-start">
              {currentCourses.map((c) => (
                <div key={c.id} className="group flex flex-col justify-between bg-gradient-to-b from-white/[0.05] to-transparent backdrop-blur-lg rounded-xl p-4 border border-purple-500/20 hover:border-purple-400/60 hover:bg-white/[0.08] hover:-translate-y-1 transition-all duration-300">
                  
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-purple-50 text-base leading-tight group-hover:text-purple-200 transition-colors line-clamp-1">{c.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase border whitespace-nowrap ${STATUS_STYLES[c.status] || DEFAULT_STATUS_STYLE}`}>
                        {c.status || 'UNKNOWN'}
                      </span>
                    </div>
                    <p className="text-xs text-purple-200/50 line-clamp-2 leading-relaxed">{c.description}</p>
                  </div>

                  <div className="mt-3 space-y-3">
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-medium text-purple-300/70">
                      {c.category && <span className="bg-purple-900/40 px-1.5 py-0.5 rounded border border-purple-500/20">{c.category}</span>}
                      {c.level && <span className="bg-purple-900/40 px-1.5 py-0.5 rounded border border-purple-500/20">{c.level}</span>}
                      {c.duration && <span className="bg-purple-900/40 px-1.5 py-0.5 rounded border border-purple-500/20">{c.duration}</span>}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-purple-500/10">
                      <p className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-fuchsia-300">
                        {typeof c.price === 'number' ? `\u20b9${c.price}` : (c.price || 'Free')}
                      </p>
                      <div className="flex gap-3 text-[10px] font-bold tracking-widest uppercase">
                        <button onClick={() => handleOpenModal(c)} className="text-purple-400 hover:text-purple-200 transition-all">Edit</button>
                        <button onClick={() => handleDeleteCourse(c.id)} className="text-rose-400/80 hover:text-rose-400 transition-all">Delete</button>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
              
              {currentCourses.length === 0 && (
                <div className="col-span-full py-8 flex flex-col items-center justify-center border-2 border-dashed border-purple-500/20 rounded-xl bg-black/10">
                  <p className="text-purple-300/60 text-xs tracking-widest uppercase">NO MODULES DETECTED.</p>
                </div>
              )}
            </div>

            {/* Minimized Pagination Controls */}
            {(currentPage > 1 || hasNextPage) && (
              <div className="shrink-0 flex justify-center items-center gap-3 pt-2 border-t border-purple-500/20">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-white/5 border border-purple-500/30 text-purple-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-600/30 hover:border-purple-400 transition-all text-xs font-semibold"
                >
                  &larr; Prev
                </button>
                <span className="text-purple-300/70 text-[11px] font-medium tracking-wider uppercase">
                  Page <strong className="text-purple-100">{currentPage}</strong>
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={!hasNextPage}
                  className="px-3 py-1 rounded-md bg-white/5 border border-purple-500/30 text-purple-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-600/30 hover:border-purple-400 transition-all text-xs font-semibold"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={selectedCourse}
        onSave={handleSaveCourse}
      />
    </div>
  );
}