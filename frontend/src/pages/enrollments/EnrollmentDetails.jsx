import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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

  if (loading) {
    return <DetailsSkeleton />;
  }

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
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Enrollment Overview</h1>
          <p className="text-sm text-gray-400 mt-1">View complete student enrollment information.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/admin/enrollments/edit/${enrollment.id}`}
            className="px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm font-medium hover:bg-cyan-500/20 transition-colors"
          >
            Edit Enrollment
          </Link>
        </div>
      </div>

      <div className="bg-[#112435] border border-gray-800 rounded-2xl p-8 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-cyan-500/20 border-2 border-teal-600 flex items-center justify-center text-3xl font-bold text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] text-center p-4">
              {(enrollment.studentName || 'S').charAt(0).toUpperCase()}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide border ${
              enrollment.enrollmentStatus === "ACTIVE"
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            }`}>
              {enrollment.enrollmentStatus}
            </span>
          </div>

          <div className="flex-1 w-full space-y-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Student Name</p>
              <p className="text-lg font-medium text-white">{enrollment.studentName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">Student Email</p>
              <p className="text-lg text-white">{enrollment.studentEmail}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">Assigned Batch</p>
              <p className="text-lg text-cyan-400 font-medium">{enrollment.batch?.name || "N/A"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800/60">
              <div>
                <p className="text-sm text-gray-400 mb-1">Associated Course</p>
                <p className="text-white text-sm">{enrollment.batch?.course?.title || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Enrolled On</p>
                <p className="text-white text-sm">
                  {enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString() : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnrollmentDetails;