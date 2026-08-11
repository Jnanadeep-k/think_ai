import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getEnrollmentById } from "../../api/enrollmentApi";
import { DetailsSkeleton } from "../../components/common/LoadingSkeleton";

function EnrollmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnrollment();
  }, [id]);

  const loadEnrollment = async () => {
    try {
      setLoading(true);

      const response = await getEnrollmentById(id);

      setEnrollment(response.data.data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load enrollment");

      setEnrollment(null);
    } finally {
      setLoading(false);
    }
  };

  // LOADING SKELETON
  if (loading) {
    return <DetailsSkeleton />;
  }

  // NOT FOUND
  if (!enrollment) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-cyan-400 text-xl font-semibold animate-pulse">
          Loading Enrollment...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Enrollment Details
          </h1>

          <p className="text-gray-400 mt-1">
            View complete enrollment information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/enrollments")}
          className="px-5 py-3 rounded-xl bg-[#1A1F2B] border border-gray-700 text-cyan-400 hover:bg-[#22283A] transition"
        >
          ← Back
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Student Name</p>
          <h2 className="text-white text-xl font-semibold mt-2">
            {enrollment.studentName}
          </h2>
        </div>

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Student Email</p>
          <h2 className="text-white text-xl font-semibold mt-2">
            {enrollment.studentEmail}
          </h2>
        </div>

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Batch</p>
          <h2 className="text-white text-xl font-semibold mt-2">
            {enrollment.batch?.name || "N/A"}
          </h2>
        </div>

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Status</p>

          <span
            className={`inline-block mt-2 px-4 py-2 rounded-full text-sm font-semibold ${
              enrollment.enrollmentStatus === "ACTIVE"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {enrollment.enrollmentStatus}
          </span>

        </div>

        <div className="md:col-span-2 bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Enrolled On</p>

          <h2 className="text-white text-xl font-semibold mt-2">
            {new Date(enrollment.enrolledAt).toLocaleDateString()}
          </h2>
        </div>

      </div>

    </div>
  );
}

export default EnrollmentDetails;