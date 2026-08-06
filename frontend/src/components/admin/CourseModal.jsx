import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import InputField from '../common/InputField';
import Button from '../common/Button';

export default function CourseModal({ isOpen, onClose, course, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    status: 'draft',
    students: 0,
  });

  // Populate form if editing, reset if adding new
  useEffect(() => {
    if (course) {
      setFormData(course);
    } else {
      setFormData({
        title: '',
        instructor: '',
        status: 'draft',
        students: 0,
      });
    }
  }, [course, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={course ? 'Edit Course' : 'Add New Course'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField
          label="Course Title"
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Advanced System Design"
          required
        />

        <InputField
          label="Instructor Name"
          id="instructor"
          name="instructor"
          type="text"
          value={formData.instructor}
          onChange={handleChange}
          placeholder="e.g. Priya Sharma"
          required
        />

        {/* Status Dropdown */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1.5">
            Course Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-[#0D1220] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors cursor-pointer appearance-none"
          >
            <option value="draft">Draft</option>
            <option value="under_review">Under Review</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="pt-4 mt-2 flex items-center justify-end gap-3 border-t border-gray-800/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <Button
            type="submit"
            label={course ? 'Save Changes' : 'Create Course'}
          />
        </div>
      </form>
    </Modal>
  );
}