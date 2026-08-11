import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import InputField from '../../components/common/InputField';
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

  // Extract the array directly from backend response
  const currentCourses = useMemo(() => {
    if (Array.isArray(rawCourses)) return rawCourses;
    if (rawCourses && Array.isArray(rawCourses.courses)) return rawCourses.courses; 
    return [];
  }, [rawCourses]);

  // 1. Debounce Search: Wait 500ms after user stops typing before setting the search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // 2. Fetch from Backend whenever page, limit, or debounced search changes
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
      
      // Refresh current page from backend
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
      
      // Refresh from backend
      dispatch(fetchCourses({ page: currentPage, limit: ITEMS_PER_PAGE, search: debouncedSearch }));
      
      if (currentCourses.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } else {
      toast.error(result.payload || 'Failed to delete course', { theme: "dark" });
    }
  };

  // Determine if there is a next page based on if the backend returned a full list
  const hasNextPage = currentCourses.length === ITEMS_PER_PAGE;

  return (
    <div className="relative min-h-screen px-6 pb-6 pt-2 sm:px-8 sm:pb-8 sm:pt-2 -mt-2 sm:-mt-4 space-y-8 bg-gradient-to-br from-[#0c0914] via-[#151025] to-[#1a1438] rounded-3xl border border-purple-500/10 shadow-2xl overflow-hidden">
      
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-fuchsia-400 tracking-wide drop-shadow-[0_0_15px_rgba(232,121,249,0.3)]">
              Courses
            </h1>
            <p className="text-sm text-purple-300/60 mt-1 font-light tracking-wider">
              Manage and deploy learning modules.
            </p>
          </div>
          <div className="shadow-[0_0_20px_rgba(168,85,247,0.3)] rounded-xl">
            <button 
              onClick={() => handleOpenModal()} 
              className="px-8 py-3 text-lg font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-400 hover:to-cyan-300 text-white border-0 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
            >
              + New Course
            </button>
          </div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-2xl p-6 md:p-8 border border-purple-500/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-6">
          
          <div className="max-w-md">
            <InputField
              label="Search"
              id="course-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by course name..."
              className="bg-black/20 border-purple-500/30 text-purple-100 placeholder-purple-300/30 focus:border-purple-400 focus:ring-purple-400/50 transition-all"
            />
          </div>

          {loading && <LoadingSpinner label="Decrypting courses..." className="text-purple-400" />}

          {!loading && error && (
            <ErrorState message={error} onRetry={() => dispatch(fetchCourses({ page: currentPage, limit: ITEMS_PER_PAGE, search: debouncedSearch }))} />
          )}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentCourses.map((c) => (
                  <div key={c.id} className="group bg-gradient-to-b from-white/[0.05] to-transparent backdrop-blur-lg rounded-xl p-5 flex flex-col gap-3 border border-purple-500/20 hover:border-purple-400/60 hover:bg-white/[0.08] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(168,85,247,0.2)] transition-all duration-300 ease-out">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-purple-50 text-lg leading-tight group-hover:text-purple-200 transition-colors">{c.title}</h3>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border whitespace-nowrap transition-all ${STATUS_STYLES[c.status] || DEFAULT_STATUS_STYLE}`}>
                        {c.status || 'UNKNOWN'}
                      </span>
                    </div>
                    <p className="text-sm text-purple-200/50 line-clamp-2 leading-relaxed">{c.description}</p>
                    <div className="flex flex-wrap gap-2 text-[11px] font-medium text-purple-300/70 mt-auto pt-2">
                      {c.category && <span className="bg-purple-900/40 px-2 py-1 rounded border border-purple-500/20">{c.category}</span>}
                      {c.level && <span className="bg-purple-900/40 px-2 py-1 rounded border border-purple-500/20">{c.level}</span>}
                      {c.duration && <span className="bg-purple-900/40 px-2 py-1 rounded border border-purple-500/20">{c.duration}</span>}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-purple-500/10">
                      <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-fuchsia-300">
                        {typeof c.price === 'number' ? `\u20b9${c.price}` : (c.price || 'Free')}
                      </p>
                      <div className="flex gap-4 text-xs font-semibold tracking-wide">
                        <button onClick={() => handleOpenModal(c)} className="text-purple-400 hover:text-purple-200 hover:drop-shadow-[0_0_8px_rgba(192,132,252,0.8)] transition-all uppercase">Edit</button>
                        <button onClick={() => handleDeleteCourse(c.id)} className="text-rose-400/80 hover:text-rose-400 hover:drop-shadow-[0_0_8px_rgba(251,113,133,0.8)] transition-all uppercase">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {currentCourses.length === 0 && (
                  <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-purple-500/20 rounded-xl bg-black/10">
                    <p className="text-purple-300/60 text-sm tracking-widest uppercase">NO MODULES DETECTED.</p>
                  </div>
                )}
              </div>

              {/* Server-Side Pagination Controls */}
              {(currentPage > 1 || hasNextPage) && (
                <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-purple-500/20">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-purple-500/30 text-purple-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-600/30 hover:border-purple-400 transition-all text-sm font-medium shadow-[0_0_10px_rgba(168,85,247,0.1)]"
                  >
                    &larr; Prev
                  </button>
                  <span className="text-purple-300/70 text-sm font-medium tracking-wide">
                    Page <strong className="text-purple-100">{currentPage}</strong>
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={!hasNextPage}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-purple-500/30 text-purple-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-600/30 hover:border-purple-400 transition-all text-sm font-medium shadow-[0_0_10px_rgba(168,85,247,0.1)]"
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
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