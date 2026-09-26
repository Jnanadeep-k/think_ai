import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaUsers,
  FaUserGraduate,
} from "react-icons/fa";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FaHome />,
    },
    {
      name: "Courses",
      path: "/admin/courses",
      icon: <FaBook />,
    },
    {
      name: "Batches",
      path: "/admin/batches",
      icon: <FaUsers />,
    },
    {
      name: "Enrollments",
      path: "/admin/enrollments",
      icon: <FaUserGraduate />,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#0B0F19] border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Thinkz AI
        </h1>
        <p className="text-xs text-gray-500 mt-1">Learning Management System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6 px-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
                isActive
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                  : "text-gray-400 hover:bg-gray-800/60 hover:text-white"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 p-4 text-xs text-gray-500">
        Thinkz AI LMS v1.0
      </div>
    </aside>
  );
}

export default Sidebar;