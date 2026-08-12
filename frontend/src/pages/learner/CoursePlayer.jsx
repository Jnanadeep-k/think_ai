import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Mock Curriculum Data
const MOCK_COURSE = {
  title: "Advanced React & Redux Mastery",
  modules: [
    {
      id: 'm1',
      title: '1. Getting Started',
      lessons: [
        { id: 'l1', title: 'Course Introduction', duration: '2:30', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        { id: 'l2', title: 'Environment Setup', duration: '5:45', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      ]
    },
    {
      id: 'm2',
      title: '2. State Management Deep Dive',
      lessons: [
        { id: 'l3', title: 'Understanding Redux Toolkit', duration: '12:20', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        { id: 'l4', title: 'Async Thunks in Action', duration: '15:10', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      ]
    }
  ]
};

export default function CoursePlayer() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  // State
  const [activeModule, setActiveModule] = useState(MOCK_COURSE.modules[0].id);
  const [currentLesson, setCurrentLesson] = useState(MOCK_COURSE.modules[0].lessons[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  // Flatten lessons for easy next/prev navigation
  const allLessons = MOCK_COURSE.modules.flatMap(m => m.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);

  // Keyboard Shortcuts (Space, Left, Right)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent scrolling when pressing space
      if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        if (videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
        }
      }
      // Right Arrow: Next Lesson
      if (e.code === 'ArrowRight') {
        if (currentIndex < allLessons.length - 1) {
          setCurrentLesson(allLessons[currentIndex + 1]);
        }
      }
      // Left Arrow: Previous Lesson
      if (e.code === 'ArrowLeft') {
        if (currentIndex > 0) {
          setCurrentLesson(allLessons[currentIndex - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allLessons]);

  // Sync video playing state
  const handlePlayPause = () => setIsPlaying(!videoRef.current?.paused);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      
      {/* LEFT SIDE: Video Player & Info */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 transition-colors">
          <video
            ref={videoRef}
            src={currentLesson.videoUrl}
            className="w-full h-full object-cover"
            controls
            autoPlay
            onPlay={handlePlayPause}
            onPause={handlePlayPause}
          />
        </div>
        
        <div className="bg-white dark:bg-[#151025]/50 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-purple-500/20 shadow-sm transition-colors">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-purple-100 mb-2">
            {currentLesson.title}
          </h1>
          <p className="text-gray-600 dark:text-purple-300/70 text-sm">
            {MOCK_COURSE.title} • Module {activeModule.replace('m', '')}
          </p>
          <div className="mt-4 flex gap-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <span><kbd className="px-2 py-1 bg-gray-100 dark:bg-white/10 rounded mr-1">Space</kbd> Play/Pause</span>
            <span><kbd className="px-2 py-1 bg-gray-100 dark:bg-white/10 rounded mr-1">←</kbd> Prev</span>
            <span><kbd className="px-2 py-1 bg-gray-100 dark:bg-white/10 rounded mr-1">→</kbd> Next</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Lesson Tree (Curriculum) */}
      <div className="w-full lg:w-96 flex flex-col bg-white dark:bg-[#151025]/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-purple-500/20 shadow-sm overflow-hidden transition-colors">
        <div className="p-5 border-b border-gray-200 dark:border-purple-500/20 shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-purple-100">Course Content</h2>
          <p className="text-sm text-gray-500 dark:text-purple-300/60 mt-1">
            {currentIndex + 1} of {allLessons.length} lessons completed
          </p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {MOCK_COURSE.modules.map((module) => (
            <div key={module.id} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden transition-colors">
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
                <div className="bg-white dark:bg-transparent">
                  {module.lessons.map((lesson) => {
                    const isActive = currentLesson.id === lesson.id;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setCurrentLesson(lesson)}
                        className={`w-full flex items-center justify-between p-3 pl-8 text-sm transition-all border-l-2 ${
                          isActive 
                            ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-medium' 
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        <span className="truncate pr-4">{lesson.title}</span>
                        <span className="text-xs shrink-0 opacity-60">{lesson.duration}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}