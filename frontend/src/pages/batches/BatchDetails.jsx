import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBatchById } from "../../api/batchApi";
import { DetailsSkeleton } from "../../components/common/LoadingSkeleton";

function BatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBatch();
  }, [id]);

  const loadBatch = async () => {
    try {
      setLoading(true);

      const response = await getBatchById(id);

      setBatch(response.data.data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load batch");

      setBatch(null);
    } finally {
      setLoading(false);
    }
  };

  // LOADING SKELETON
  if (loading) {
    return <DetailsSkeleton />;
  }

  // NOT FOUND
  if (!batch) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-cyan-400 text-xl font-semibold animate-pulse">
          Loading Batch...
        </div>
      </div>
    );
  }

  // ENROLLED STUDENTS
  const enrolledCount =
    batch.enrollments?.filter(
      (enrollment) =>
        enrollment.enrollmentStatus === "ACTIVE" ||
        enrollment.enrollmentStatus === "ENROLLED"
    ).length || 0;

  const isFull =
    enrolledCount >= batch.capacity;

  return (
    <div className="max-w-6xl mx-auto">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Batch Details
          </h1>

          <p className="text-gray-400 mt-1">
            View complete batch information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/batches")}
          className="px-5 py-3 rounded-xl bg-[#1A1F2B] border border-gray-700 text-cyan-400 hover:bg-[#22283A] transition"
        >
          ← Back
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Batch Name</p>
          <h2 className="text-white text-xl font-semibold mt-2">
            {batch.name}
          </h2>
        </div>

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Course</p>
          <h2 className="text-white text-xl font-semibold mt-2">
            {batch.course?.title || "N/A"}
          </h2>
        </div>

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Instructor</p>
          <h2 className="text-white text-xl font-semibold mt-2">
            {batch.instructorName}
          </h2>
        </div>

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Capacity</p>
          <h2 className="text-white text-xl font-semibold mt-2">
            {batch.capacity}
          </h2>
        </div>

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Start Date</p>
          <h2 className="text-white text-xl font-semibold mt-2">
            {new Date(batch.startDate).toLocaleDateString()}
          </h2>
        </div>

        <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">End Date</p>
          <h2 className="text-white text-xl font-semibold mt-2">
            {new Date(batch.endDate).toLocaleDateString()}
          </h2>
        </div>

        <div className="md:col-span-2 bg-[#1A1F2B] border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm">Status</p>

          <span
            className={`inline-block mt-2 px-4 py-2 rounded-full text-sm font-semibold ${
              batch.status === "ACTIVE"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {batch.status}
          </span>
        </div>

      </div>

    </div>
  );
}

export default BatchDetails;