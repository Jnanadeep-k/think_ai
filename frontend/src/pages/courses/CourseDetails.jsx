import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { notificationReceived } from '../../features/notifications/notificationSlice';
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getCourseById } from "../../api/courseApi";
import { DetailsSkeleton } from "../../components/common/LoadingSkeleton";

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

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const response = await getCourseById(id);
      setCourse(response.data.data || response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load course details");
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };



  const handleAddToCart = () => {
    dispatch(notificationReceived({
      id: `cart_${Date.now()}`,
      title: 'Added to cart',
      message: `${course.title} was added to your cart.`,
      type: 'cart',
      read: false,
      createdAt: new Date().toISOString(),
    }));
    toast.success(`${course.title} added to cart`, { theme: "dark" });
  };

  const handleBuyNow = () => {
    const courseId = course.id || course._id;
    navigate(`/learner/courses/${courseId}/checkout`);
  };

  const handleViewVideos = () => {
    const courseId = course.id || course._id;
    navigate(`/learner/courses/${courseId}/videos`);
  };

  // Restored loading & null checks to prevent crashes
  if (loading) {
    return <DetailsSkeleton />;
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-cyan-400 text-xl font-semibold animate-pulse">
          Course not found or failed to load.
        </div>
      </div>
    );
  }

  const imageSrc = course.thumbnail || getFallbackImage(course.title, course.category);

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold dark:text-purple-400">Course: {course.title}</h1>
          <p className="text-sm text-gray-400 mt-1">Comprehensive curriculum and program details</p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="relative bg-[#112435] border border-gray-800 rounded-2xl shadow-lg overflow-hidden min-h-[420px]">

        {imageSrc && (
          <img
            src={imageSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#112435] via-[#112435]/40 to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start p-8 pt-40">

          <div className="flex-1 w-full space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-300 mb-1 drop-shadow">Course Title</p>
                <p className="text-lg font-medium text-white drop-shadow">{course.title}</p>
              </div>
              <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium tracking-wide border whitespace-nowrap backdrop-blur-sm ${(!course.status || course.status === "ACTIVE")
                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                  : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                }`}>
                Status: {course.status || "ACTIVE"}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-300 mb-1">Description</p>
              <p className="text-sm text-gray-200 leading-relaxed">{course.description || "No description provided."}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700/60">
              <div>
                <p className="text-sm text-gray-300 mb-1">Category & Level</p>
                <p className="text-white text-sm font-medium">
                  {course.category || "General"} • {course.level || "All Levels"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300 mb-1">Duration</p>
                <p className="text-white text-sm font-medium">
                  {course.duration || "Self-paced"} Days
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-sm text-gray-300 mb-1">Price</p>
                <p className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-fuchsia-300">
                  {typeof course.price === 'number' ? `₹${course.price}` : (course.price || 'Free')}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700/60">
              <button
                onClick={handleAddToCart}
                className="flex-1 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white rounded-lg font-semibold text-sm transition-colors cursor-pointer"
              >
                Buy Now
              </button>
              <button
                onClick={handleViewVideos}
                className="flex-1 px-5 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
              >
                Course Videos
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}