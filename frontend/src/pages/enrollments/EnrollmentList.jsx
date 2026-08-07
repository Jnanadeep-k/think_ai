import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getEnrollments,
  deleteEnrollment,
} from "../../api/enrollmentApi";

function EnrollmentList() {
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    setLoading(true);

    try {
      const response = await getEnrollments();
      setEnrollments(response.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this enrollment?"
    );

    if (!confirmDelete) return;

    try {
      await deleteEnrollment(id);

      toast.success("Enrollment deleted successfully");

      fetchEnrollments();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete enrollment");
    }
  };

  const filteredEnrollments = enrollments.filter(
    (enrollment) =>
      enrollment.studentName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      enrollment.studentEmail
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-cyan-400 text-xl font-semibold animate-pulse">
          Loading Enrollments...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Enrollment Management
          </h1>

          <p className="text-gray-400 mt-1">
            Manage all student enrollments.
          </p>
        </div>

        <div className="flex gap-3">

          <input
            type="text"
            placeholder="Search Student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 bg-[#0B0F19] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />

          <Link
            to="/admin/enrollments/add"
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-3 rounded-xl transition"
          >
            + Add Enrollment
          </Link>

        </div>

      </div>

      <div className="bg-[#1A1F2B] rounded-2xl border border-gray-800 shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-[#0B0F19] border-b border-gray-800">

            <tr className="text-cyan-400">

              <th className="p-4 text-left">ID</th>
              <th className="text-left">Student</th>
              <th className="text-left">Email</th>
              <th className="text-left">Batch</th>
              <th className="text-left">Status</th>
              <th className="text-left">Enrolled On</th>
              <th className="text-center">Actions</th>

            </tr>

          </thead>

          <tbody>
                        {filteredEnrollments.length > 0 ? (
              filteredEnrollments.map((enrollment) => (
                <tr
                  key={enrollment.id}
                  className="border-b border-gray-800 hover:bg-[#22283A] transition"
                >
                  <td className="p-4 text-gray-300">
                    {enrollment.id}
                  </td>

                  <td className="text-white font-medium">
                    {enrollment.studentName}
                  </td>

                  <td className="text-gray-300">
                    {enrollment.studentEmail}
                  </td>

                  <td className="text-gray-300">
                    {enrollment.batch?.name || "-"}
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        enrollment.enrollmentStatus === "ACTIVE"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {enrollment.enrollmentStatus}
                    </span>
                  </td>

                  <td className="text-gray-300">
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </td>

                  <td>
                    <div className="flex justify-center gap-2">

                      <Link
                        to={`/admin/enrollments/${enrollment.id}`}
                        className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition"
                      >
                        View
                      </Link>

                      <Link
                        to={`/admin/enrollments/edit/${enrollment.id}`}
                        className="px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(enrollment.id)}
                        className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                      >
                        Delete
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="py-16 text-center"
                >
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-300">
                      No Enrollments Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Click "Add Enrollment" to create your first enrollment.
                    </p>

                    <Link
                      to="/admin/enrollments/add"
                      className="inline-block mt-6 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-3 rounded-xl transition"
                    >
                      + Add Enrollment
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default EnrollmentList;