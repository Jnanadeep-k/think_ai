import React from 'react';

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

// Helper to cycle through theme gradients matching the LandingPage
const THUMB_GRADIENTS = ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'];
function getThumbGradientClass(id = 0) {
  const index = typeof id === 'number' ? id : String(id).charCodeAt(0) || 0;
  return THUMB_GRADIENTS[index % THUMB_GRADIENTS.length];
}

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
  const imageSrc = course.thumbnail || getFallbackImage(course.title, course.category);
  const gradientClass = getThumbGradientClass(course.id || course._id || 0);

  return (
    <div
      onClick={() => onView && onView(course)}
      className="landing-page cursor-pointer"
      style={{ display: 'inline-block', width: '100%' }}
    >
      <div className="course-card">
        {/* Top Thumbnail Section matching LandingPage exact look */}
        <div className={`course-thumb ${gradientClass}`}>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt=""
              aria-hidden="true"
              style={{ width: '42px', height: '42px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <span style={{ fontSize: '15px', fontFamily: 'JetBrains Mono, monospace' }}>&lt;/&gt;</span>
          )}

          {course.duration && <span>{course.duration}</span>}

          {/* Status Badge */}
          <span style={{ 
            position: 'absolute', 
            top: '10px', 
            right: '10px', 
            left: 'auto', 
            bottom: 'auto', 
            background: 'rgba(0,0,0,0.4)', 
            color: '#fff',
            padding: '2px 6px', 
            fontSize: '9px', 
            borderRadius: '4px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.04em',
            fontWeight: 700
          }}>
            {course.status || 'ACTIVE'}
          </span>
        </div>

        {/* Card Body matching LandingPage course-body */}
        <div className="course-body">
          {course.category && <div className="course-cat">{course.category}</div>}
          <div className="course-title">{course.title}</div>
          
          <div className="course-meta">
            {course.instructorName || course.language ? `${course.instructorName || ''} ${course.language ? '· ' + course.language : ''}` : ''}
          </div>
          
          {course.rating && (
            <div className="course-rating">
              {course.rating} <span>({course.ratingsCount || 0} ratings)</span>
            </div>
          )}

          <div className="course-foot">
            <div className="price">
              {course.originalPrice && (
                <span className="old">
                  {typeof course.originalPrice === 'number' ? `₹${course.originalPrice.toLocaleString('en-IN')}` : course.originalPrice}
                </span>
              )}
              {typeof course.price === 'number' ? `₹${course.price.toLocaleString('en-IN')}` : (course.price || 'Free')}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ marginTop: '14px' }} onClick={(e) => e.stopPropagation()}>
            {isAdmin ? (
              <div style={{ display: 'flex', gap: '12px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>
                <button onClick={() => onView(course)} style={{ background: 'none', border: 'none', color: 'var(--violet)', cursor: 'pointer', padding: 0 }}>View</button>
                <button onClick={() => onEdit(course)} style={{ background: 'none', border: 'none', color: 'var(--amber-dim)', cursor: 'pointer', padding: 0 }}>Edit</button>
                <button onClick={() => onDelete(course.id || course._id)} style={{ background: 'none', border: 'none', color: '#EF6FAA', cursor: 'pointer', padding: 0 }}>Delete</button>
              </div>
            ) : (
              <button
                onClick={() => onView(course)}
                className="btn btn-amber"
                style={{ width: '100%', padding: '9px 16px', fontSize: '13px', borderRadius: '8px', cursor: 'pointer' }}
              >
                View Course
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}