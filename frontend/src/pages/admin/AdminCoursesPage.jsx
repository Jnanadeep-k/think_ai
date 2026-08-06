import React, { useState, useMemo } from 'react';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import CourseModal from '../../components/admin/CourseModal'; // <-- Import the new modal

const INITIAL_COURSES = [
  { id: 1, title: 'React Fundamentals', instructor: 'Priya Sharma', students: 412, status: 'published' },
  { id: 2, title: 'DSA in Python', instructor: 'Rahul Verma', students: 298, status: 'published' },
  { id: 3, title: 'DevOps Essentials', instructor: 'Arjun Nair', students: 0, status: 'draft' },
  { id: 4, title: 'System Design Basics', instructor: 'Sneha Rao', students: 156, status: 'under_review' },
];

const STATUS_STYLES = {
  published: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  draft: 'bg-gray-500/10 text-gray-400 border-gray-600/30',
  under_review: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState(INITIAL_COURSES); // <-- Convert to state
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, courses]);

  // Open modal for Add (null) or Edit (course object)
  const handleOpenModal = (course = null) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  // Handle saving data from the modal
  const handleSaveCourse = (courseData) => {
    if (courseData.id) {
      // Edit existing course
      setCourses(courses.map(c => c.id === courseData.id ? courseData : c));
    } else {
      // Add new course (generate fake ID)
      const newCourse = { ...courseData, id: Date.now() };
      setCourses([...courses, newCourse]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Courses</h1>
          <p className="text-sm text-gray-400 mt-1">Manage published, draft and under-review courses.</p>
        </div>
        <Button label="+ New Course" onClick={() => handleOpenModal()} />
      </div>

      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="max-w-sm">
          <InputField
            label="Search"
            id="course-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((c) => (
            <div key={c.id} className="glass-panel rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-gray-100">{c.title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] border whitespace-nowrap capitalize ${STATUS_STYLES[c.status]}`}>
                  {c.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-gray-500">by {c.instructor}</p>
              <p className="text-sm text-gray-400">{c.students} students enrolled</p>
              <div className="flex gap-3 mt-2 text-xs">
                <button 
                  onClick={() => handleOpenModal(c)}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Edit
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  View
                </button>
              </div>
            </div>
          ))}
          {filteredCourses.length === 0 && (
            <p className="text-gray-600 text-sm col-span-full text-center py-8">
              No courses match your search.
            </p>
          )}
        </div>
      </div>

      {/* Render the Modal here */}
      <CourseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={selectedCourse}
        onSave={handleSaveCourse}
      />
    </div>
  );
}
