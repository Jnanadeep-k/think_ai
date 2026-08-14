import React from 'react';

const STATUS_STYLES = {
  ACTIVE: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
};
const DEFAULT_STATUS_STYLE = 'bg-white/5 text-purple-200 border-purple-500/20';

// Mock tech images (CDN logos) — used only as a fallback until backend
// returns a real course.thumbnail URL. Matched against title + category
// using keyword search, since category is often generic (e.g. "backend").
const TECH_IMAGES = [
  { keywords: ['typescript', 'type script', 'ts'], img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { keywords: ['javascript', 'java script'], img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { keywords: ['node'], img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { keywords: ['react'], img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { keywords: ['python'], img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { keywords: ['java'], img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { keywords: ['c++', 'cpp'], img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
  { keywords: ['c#', 'csharp'], img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
  { keywords: [' c ', 'c programming'], img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
  { keywords: ['angular'], img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg' },
  { keywords: ['vue'], img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
  { keywords: ['mongodb', 'mongo'], img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { keywords: ['sql'], img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
];

function getFallbackImage(title, category) {
  const haystack = ` ${(title || '')} ${(category || '')} `.toLowerCase();
  for (const entry of TECH_IMAGES) {
    if (entry.keywords.some((kw) => haystack.includes(kw))) {
      return entry.img;
    }
  }
  return null;
}

export default function CourseCard({ course, isAdmin, onEdit, onDelete, onView }) {
  // Priority: real backend thumbnail -> mock tech logo (matched from title/category) -> none
  const imageSrc = course.thumbnail || getFallbackImage(course.title, course.category);

  return (
    <div
      onClick={() => onView && onView(course)}
      className="group relative flex flex-col rounded-xl overflow-hidden border border-red-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer min-h-[260px] bg-white"
    >
      {/* Full-fit background image, full color/brightness */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}

      {/* Readability overlay — only fades in near the bottom, image stays bright up top */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />

      {/* Status badge */}
      <span className={`absolute top-3 left-3 z-10 px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase border bg-purple-950/90 text-green-100 border-purple-200/10 shadow-sm backdrop-blur-md`}>
        {course.status || 'ACTIVE'}
      </span>

      {/* Body */}
      <div className="relative z-10 flex flex-col flex-1 justify-end p-4 pt-10 space-y-2">
        <h3 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-cyan-700 transition-colors drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
          {course.title}
        </h3>

        <div className="flex flex-wrap gap-1.5 text-[10px] font-medium text-gray-600">
          {course.category && <span>{course.category}</span>}
          {course.category && course.level && <span>·</span>}
          {course.level && <span>{course.level}</span>}
          {course.duration && (
            <>
              <span>·</span>
              <span>{course.duration}</span> Days
            </>
          )}
        </div>

        {course.language && (
          <p className="text-[11px] text-gray-500">{course.language}</p>
        )}

        <div className="pt-1">
          <p className="text-xl font-bold text-gray-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
            {typeof course.price === 'number' ? `₹${course.price.toLocaleString('en-IN')}` : (course.price || 'Free')}
          </p>
        </div>

        {/* Actions */}
        <div className="pt-3" onClick={(e) => e.stopPropagation()}>
          {isAdmin ? (
            <div className="flex gap-3 text-[11px] font-bold tracking-wide uppercase">
              <button onClick={() => onView(course)} className="text-cyan-600 hover:text-cyan-700 cursor-pointer">View</button>
              <button onClick={() => onEdit(course)} className="text-purple-600 hover:text-purple-700 cursor-pointer">Edit</button>
              <button onClick={() => onDelete(course.id || course._id)} className="text-rose-500 hover:text-rose-600 cursor-pointer">Delete</button>
            </div>
          ) : (
            <button
              onClick={() => onView(course)}
              className="w-full py-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-full font-semibold text-sm transition-colors cursor-pointer"
            >
              View Course
            </button>
          )}
        </div>
      </div>
    </div>
  );
}