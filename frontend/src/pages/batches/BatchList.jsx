import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getBatches, deleteBatch } from "../../api/batchApi";

function BatchList() {
  const [batches, setBatches] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBatches(search);
  }, [search]);

  const fetchBatches = async (searchText = "") => {
    setLoading(true);

    try {
      const response = await getBatches(searchText);
      setBatches(response.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load batches");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this batch?"
    );

    if (!confirmDelete) return;

    try {
      await deleteBatch(id);
      toast.success("Batch deleted successfully");
      fetchBatches(search);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete batch");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-cyan-400 text-xl font-semibold animate-pulse">
          Loading Batches...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Batch Management
          </h1>

          <p className="text-gray-400 mt-1">
            Manage all training batches.
          </p>
        </div>

        <Link
          to="/admin/batches/add"
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-3 rounded-xl transition"
        >
          + Add Batch
        </Link>

      </div>

      <div>
        <input
          type="text"
          placeholder="Search Batch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 bg-[#0B0F19] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      <div className="bg-[#1A1F2B] rounded-2xl border border-gray-800 shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-[#0B0F19] border-b border-gray-800">

            <tr className="text-cyan-400">

              <th className="p-4 text-left">ID</th>
              <th className="text-left">Name</th>
              <th className="text-left">Course</th>
              <th className="text-left">Instructor</th>
              <th className="text-left">Capacity</th>
              <th className="text-left">Status</th>
              <th className="text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

                        {batches.length > 0 ? (
              batches.map((batch) => (
                <tr
                  key={batch.id}
                  className="border-b border-gray-800 hover:bg-[#22283A] transition"
                >
                  <td className="p-4 text-gray-300">
                    {batch.id}
                  </td>

                  <td className="text-white font-medium">
                    {batch.name}
                  </td>

                  <td className="text-gray-300">
                    {batch.course?.title || "-"}
                  </td>

                  <td className="text-gray-300">
                    {batch.instructorName}
                  </td>

                  <td className="text-gray-300">
                    {batch.capacity}
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        batch.status === "ACTIVE"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {batch.status}
                    </span>
                  </td>

                  <td>
                    <div className="flex justify-center gap-2">

                      <Link
                        to={`/admin/batches/${batch.id}`}
                        className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition"
                      >
                        View
                      </Link>

                      <Link
                        to={`/admin/batches/edit/${batch.id}`}
                        className="px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(batch.id)}
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
                      No Batches Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Click "Add Batch" to create your first batch.
                    </p>

                    <Link
                      to="/admin/batches/add"
                      className="inline-block mt-6 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-3 rounded-xl transition"
                    >
                      + Add Batch
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

export default BatchList;