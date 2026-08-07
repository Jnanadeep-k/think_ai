import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseById } from "../../api/courseApi";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);

  useEffect(() => {
    loadCourse();
  }, []);

  const loadCourse = async () => {
    try {
      const response = await getCourseById(id);
      setCourse(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!course) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-cyan-400 text-xl font-semibold animate-pulse">
          Loading Course...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Course Details
          </h1>

          <p className="text-gray-400 mt-1">
            View complete course information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/courses")}
          className="px-5 py-3 rounded-xl bg-[#1A1F2B] border border-gray-700 text-cyan-400 hover:bg-[#22283A] transition"
        >
          ← Back
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Title</p>
          <h2 className="text-white text-xl font-semibold mt-2">
            {course.title}
          </h2>
        </div>

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Category</p>
          <h2 className="text-white text-xl font-semibold mt-2">
            {course.category}
          </h2>
        </div>

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Price</p>
          <h2 className="text-white text-xl font-semibold mt-2">
            ₹ {course.price}
          </h2>
        </div>

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Duration</p>
          <h2 className="text-white text-xl font-semibold mt-2">
            {course.duration}
          </h2>
        </div>

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Status</p>

          <span
            className={`inline-block mt-2 px-4 py-2 rounded-full text-sm font-semibold ${
              course.status === "ACTIVE"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {course.status}
          </span>
        </div>

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Thumbnail</p>
          <p className="text-white mt-2 break-all">
            {course.thumbnail || "No Thumbnail"}
          </p>
        </div>

        <div className="md:col-span-2 bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-3">
            Description
          </p>

          <p className="text-gray-300 leading-7">
            {course.description}
          </p>
        </div>

      </div>

    </div>
  );
}

export default CourseDetails;