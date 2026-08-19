import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { selectUser } from '../../features/auth/authSlice';
import { fetchMyEnrollments, selectMyEnrollments } from '../../features/enrollments/enrollmentSlice';
import { fetchModulesByCourseId, selectModules, selectModulesLoading } from '../../features/modules/moduleSlice';
import { fetchLessonsByModuleId, selectLessonsByModuleId } from '../../features/lessons/lessonSlice';
import {
  fetchProgressByEnrollment,
  fetchProgressSummary,
  markLessonComplete,
  selectIsLessonComplete,
  selectProgressSummaryFor,
} from '../../features/lessonProgress/lessonProgressSlice';

function ModuleLessons({ moduleId, currentLessonId, onSelectLesson }) {
  const dispatch = useDispatch();
  const lessons = useSelector(selectLessonsByModuleId(moduleId));

  useEffect(() => {
    dispatch(fetchLessonsByModuleId(moduleId));
  }, [dispatch, moduleId]);

  if (lessons.length === 0) {
    return <p className="p-3 pl-8 text-xs text-gray-400">No lessons yet.</p>;
  }

  return (
    <div className="bg-white dark:bg-transparent">
      {lessons.map((lesson) => (
        <LessonRow
          key={lesson.id}
          lesson={lesson}
          isActive={currentLessonId === lesson.id}
          onSelect={() => onSelectLesson(lesson)}
        />
      ))}
    </div>
  );
}

function LessonRow({ lesson, isActive, onSelect }) {
  const isComplete = useSelector(selectIsLessonComplete(lesson.id));
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center justify-between p-3 pl-8 text-sm transition-all border-l-2 ${isActive
        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-medium'
        : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
    >
      <span className="flex items-center gap-2 truncate pr-4">
        {isComplete && <span className="text-emerald-500 text-xs">✓</span>}
        {lesson.title}
      </span>
      <span className="text-xs shrink-0 opacity-60">{lesson.duration || ''}</span>
    </button>
  );
}

export default function CoursePlayer() {
  const { id: courseId } = useParams();
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);

  const user = useSelector(selectUser);
  const enrollments = useSelector(selectMyEnrollments);
  const modules = useSelector(selectModules);
  const modulesLoading = useSelector(selectModulesLoading);

  const [activeModule, setActiveModule] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (enrollments.length === 0 && user?.email) {
      dispatch(fetchMyEnrollments(user.email));
    }
  }, [dispatch, enrollments.length, user?.email]);

  const enrollment = useMemo(() => {
    return enrollments.find((e) => {
      const c = e.batch?.course;
      const cId = c?.id || c?._id;
      return String(cId) === String(courseId);
    }) || null;
  }, [enrollments, courseId]);

  const enrollmentId = enrollment?.id ?? null;
  const course = enrollment?.batch?.course;
  const summary = useSelector(selectProgressSummaryFor(enrollmentId));

  useEffect(() => {
    if (courseId) dispatch(fetchModulesByCourseId(courseId));
  }, [dispatch, courseId]);

  useEffect(() => {
    if (enrollmentId) {
      dispatch(fetchProgressByEnrollment(enrollmentId));
      dispatch(fetchProgressSummary(enrollmentId));
    }
  }, [dispatch, enrollmentId]);

  useEffect(() => {
    if (modules.length > 0 && !activeModule) {
      setActiveModule(modules[0].id);
    }
  }, [modules, activeModule]);

  const showFeedback = (text) => {
    setFeedback(text);
    setTimeout(() => setFeedback(null), 800);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const video = videoRef.current;
      if (!video) return;

      if (e.code === 'Space') {
        e.preventDefault();
        video.paused ? video.play() : video.pause();
      }
      if (e.code === 'ArrowRight') {
        e.preventDefault();
        video.currentTime = Math.min(video.duration, video.currentTime + 5);
        showFeedback('+5s ⏩');
      }
      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        video.currentTime = Math.max(0, video.currentTime - 5);
        showFeedback('⏪ -5s');
      }
      if (e.code === 'ArrowUp') {
        e.preventDefault();
        const v = Math.min(1, video.volume + 0.05);
        video.volume = v;
        showFeedback(`Volume: ${Math.round(v * 100)}% 🔊`);
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        const v = Math.max(0, video.volume - 0.05);
        video.volume = v;
        showFeedback(`Volume: ${Math.round(v * 100)}% 🔉`);
      }
      if (e.code === 'KeyF' || e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        const container = videoContainerRef.current;
        if (!document.fullscreenElement) {
          container?.requestFullscreen?.();
          showFeedback('Fullscreen ON ⛶');
        } else {
          document.exitFullscreen?.();
          showFeedback('Fullscreen OFF ⛶');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleVideoEnded = () => {
    if (currentLesson && enrollmentId) {
      dispatch(markLessonComplete({ lessonId: currentLesson.id, enrollmentId }));
    }
  };

  if (!user?.email) {
    return <div className="p-6 text-sm text-neutral-400">Loading your account…</div>;
  }
  if (enrollments.length > 0 && !enrollment) {
    return <div className="p-6 text-sm text-red-600">You're not enrolled in this course.</div>;
  }
  if (!enrollment || modulesLoading) {
    return <div className="p-6 text-sm text-neutral-400">Loading course…</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-8rem)] overflow-y-auto lg:overflow-visible">
      <div className="flex-1 flex flex-col gap-4 min-w-0 order-2 lg:order-1">
        {/* LEFT: video player */}
        <div
          ref={videoContainerRef}
          className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-center"
        >
          {currentLesson ? (
            <video
              ref={videoRef}
              src={currentLesson.videoUrl}
              className="w-full h-full object-cover"
              controls
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              autoPlay
              onEnded={handleVideoEnded}
            />
          ) : (
            <p className="text-gray-400 text-sm">Select a lesson to begin</p>
          )}

          {feedback && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="bg-black/70 backdrop-blur-md text-white px-6 py-3 rounded-2xl text-lg font-semibold shadow-2xl border border-white/10">
                {feedback}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-[#151025]/50 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-purple-500/20 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-purple-100 mb-2">
            {currentLesson?.title || 'No lesson selected'}
          </h1>
          <p className="text-gray-600 dark:text-purple-300/70 text-sm">
            {course?.title}
            {summary && ` • ${summary.completionPercentage}% complete`}
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <span><kbd className="px-2 py-1 bg-gray-100 dark:bg-white/10 rounded mr-1">Space</kbd> Play/Pause</span>
            <span><kbd className="px-2 py-1 bg-gray-100 dark:bg-white/10 rounded mr-1">← / →</kbd> ±5s Seek</span>
            <span><kbd className="px-2 py-1 bg-gray-100 dark:bg-white/10 rounded mr-1">↑ / ↓</kbd> Vol ±5%</span>
            <span><kbd className="px-2 py-1 bg-gray-100 dark:bg-white/10 rounded mr-1">F</kbd> Fullscreen</span>
          </div>
        </div>
      </div>

      {/* RIGHT: modules + lessons */}
        <div className="w-full lg:w-96 flex flex-col bg-white dark:bg-[#151025]/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-purple-500/20 shadow-sm overflow-hidden order-1 lg:order-2">   
        <div className="p-5 border-b border-gray-200 dark:border-purple-500/20 shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-purple-100">Course Content</h2>
          {summary && (
            <p className="text-sm text-gray-500 dark:text-purple-300/60 mt-1">
              {summary.completedLessons} of {summary.totalLessons} lessons completed
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {modules.length === 0 && (
            <p className="p-3 text-sm text-gray-400">No modules yet for this course.</p>
          )}
          {modules.map((module) => (
            <div key={module.id} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-left"
              >
                <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{module.title}</span>
                <span className="text-gray-400 dark:text-gray-500 text-xl leading-none">
                  {activeModule === module.id ? '−' : '+'}
                </span>
              </button>

              {activeModule === module.id && (
                <ModuleLessons
                  moduleId={module.id}
                  currentLessonId={currentLesson?.id}
                  onSelectLesson={setCurrentLesson}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}