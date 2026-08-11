import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import UserModal from '../../components/admin/UserModal';
import { usePermission } from '../../hooks/usePermission';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import RBACMatrix from '../../components/RBACMatrix';
import useSessionTimeout from '../../hooks/useSessionTimeout';
import {
  fetchUsers,
  createUser,
  updateUserRole,
  selectAdminUsers,
  selectAdminUsersLoading,
  selectAdminUsersError,
} from '../../features/adminUsers/adminUserSlice';
import { 
  getUsersApi, 
  toggleUserStatusApi, 
  triggerPasswordResetApi, 
  bulkAssignRolesApi 
} from '../../features/adminUsers/adminUserService';

const ROLE_STYLES = {
  Learner: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  Instructor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  TA: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Admin: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8; // Adjust this number to show more/less users per page

  const dispatch = useDispatch();
  const users = useSelector(selectAdminUsers) ?? [];
  const loading = useSelector(selectAdminUsersLoading);
  const error = useSelector(selectAdminUsersError);
  useSessionTimeout();

  // State for bulk selection and role assignment
const [selectedUserIds, setSelectedUserIds] = useState([]);
const [selectedRole, setSelectedRole] = useState('');
const [confirmState, setConfirmState] = useState({ open: false, action: null, payload: null });

// RBAC permission check using your imported hook
const canManageUsers = usePermission('USER_MANAGEMENT');
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // 1. Filter Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [search, roleFilter, users]);

  // 2. Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter]);

  // 3. Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handleOpenModal = (user = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (userData) => {
    const isEdit = Boolean(userData.id);
    const thunk = isEdit
      ? updateUserRole({ userId: userData.id, role: userData.role })
      : createUser(userData);

    const result = await dispatch(thunk);

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(isEdit ? 'User role updated' : 'User created successfully', { theme: "dark" });
      setIsModalOpen(false);
    } else {
      toast.error(result.payload || (isEdit ? 'Failed to update role' : 'Failed to create user'), { theme: "dark" });
    }
  };

  // Toggle User Status handler
const handleStatusToggle = async (userId, currentStatus) => {
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
  try {
    await toggleUserStatusApi(userId, newStatus);
    dispatch(fetchUsers()); // Re-fetch or update local state
  } catch (err) {
    console.error('Error toggling status:', err);
  }
};

// Password Reset Handler
const handlePasswordReset = async (userId) => {
  try {
    await triggerPasswordResetApi(userId);
    alert('Password reset email sent successfully.');
  } catch (err) {
    console.error('Error resetting password:', err);
  }
};

// Bulk Role Assignment Handler
const handleBulkRoleAssign = async () => {
  if (!selectedUserIds.length || !selectedRole) return;
  try {
    await bulkAssignRolesApi(selectedUserIds, selectedRole);
    setSelectedUserIds([]);
    dispatch(fetchUsers());
  } catch (err) {
    console.error('Error with bulk role assignment:', err);
  }
};

// Checkbox Selection Toggle Handler
const toggleUserSelection = (userId) => {
  setSelectedUserIds((prev) =>
    prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
  );
};
const askConfirm = (action, payload) => setConfirmState({ open: true, action, payload });

  const handleConfirmed = async () => {
    const { action, payload } = confirmState;
    if (action === 'toggleStatus') await handleStatusToggle(payload.id, payload.status);
    if (action === 'resetPassword') await handlePasswordReset(payload.id);
    if (action === 'bulkRole') await handleBulkRoleAssign();
    setConfirmState({ open: false, action: null, payload: null });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-gray-400 mt-1">Manage learners, instructors, TAs and admins.</p>
        </div>
        {canManageUsers && (
          <div className="shadow-[0_0_20px_rgba(168,85,247,0.3)] rounded-xl">
            <button 
              onClick={() => handleOpenModal()} 
              className="px-8 py-3 text-lg font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-400 hover:to-cyan-300 text-white border-0 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
            >
              + New User
            </button>
          </div>
        )}
      </div>

      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="flex-1">
            <InputField
              label="Search"
              id="user-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'Learner', 'Instructor', 'TA', 'Admin'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  roleFilter === role
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'text-gray-400 border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
                }`}
              >
                {role === 'all' ? 'All' : role}
              </button>
            ))}
          </div>
        </div>

        {loading && <LoadingSpinner label="Loading users..." />}

        {!loading && error && (
          <ErrorState
            message={`${error} (expected until /admin/users is mounted on the backend)`}
            onRetry={() => dispatch(fetchUsers())}
          />
        )}

        {!loading && !error && (
         <>
            {canManageUsers && selectedUserIds.length > 0 && (
  <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg mb-4">
    <span className="text-sm text-gray-300">
      {selectedUserIds.length} user(s) selected
    </span>
    <select
      value={selectedRole}
      onChange={(e) => setSelectedRole(e.target.value)}
      className="bg-slate-700 text-white text-sm p-2 rounded border border-slate-600"
    >
      <option value="">Select Target Role</option>
      <option value="Admin">Admin</option>
      <option value="Instructor">Instructor</option>
      <option value="TA">TA</option>
      <option value="Learner">Learner</option>
    </select>
    <Button onClick={() => askConfirm('bulkRole', null)}>Apply Bulk Role</Button>
  </div>
     
     )}
<div className="overflow-x-auto">
            <table className="w-full text-sm">
                 <thead>
  <tr className="border-b border-slate-700 text-left text-xs text-slate-400">
    {/* FIRST TH IN THE TR */}
    <th className="p-3">
      <input
        type="checkbox"
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedUserIds(filteredUsers.map((u) => u.id));
          } else {
            setSelectedUserIds([]);
          }
        }}
        checked={filteredUsers?.length > 0 && selectedUserIds.length === filteredUsers.length}
      />
    </th>
    <th className="p-3">User</th>
    <th className="p-3">Role</th>
    <th className="p-3">Status</th>
    <th className="p-3">Actions</th>
  </tr>
</thead>
                  
             <tbody>
  {users.map((user) => (
    <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/50">
      {/* FIRST TD IN THE ROW */}
      <td className="p-3">
        <input
          type="checkbox"
          checked={selectedUserIds.includes(user.id)}
          onChange={() => toggleUserSelection(user.id)}
        />
      </td>
      <td className="p-3">{user.name}</td>
    
                    <td className="p-3 text-right">
  {canManageUsers ? (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() => askConfirm('toggleStatus', { id: user.id, status:user.status})}
        className="text-xs px-2 py-1 rounded bg-slate-800 text-cyan-400 hover:bg-slate-700"
      >
        Toggle ({user.status || 'active'})
      </button>

      <button
        onClick={() => askConfirm('resetPassword', {id: user.id})}
        className="text-xs px-2 py-1 rounded bg-slate-800 text-amber-400 hover:bg-slate-700"
      >
        Reset Password
      </button>

      <button
        onClick={() => handleOpenModal(user)}
        className="text-xs px-2 py-1 rounded bg-slate-800 text-gray-400 hover:text-cyan-400"
      >
        Edit
      </button>
    </div>
  ) : (
    <span className="text-xs text-slate-500">View Only</span>
  )}
</td>
                  </tr>
                ))}
                
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      No users match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* 5. Pagination UI Controls */}
            {totalPages > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-gray-800/60">
                <span className="text-xs text-gray-500 font-medium tracking-wide">
                  Showing <strong className="text-gray-300">{indexOfFirstItem + 1}</strong> to <strong className="text-gray-300">{Math.min(indexOfLastItem, filteredUsers.length)}</strong> of <strong className="text-gray-300">{filteredUsers.length}</strong> users
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-white/[0.02] border border-gray-700 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.05] hover:border-gray-500 transition-all text-xs font-bold uppercase tracking-wider"
                  >
                    Prev
                  </button>
                  <div className="flex items-center px-4 py-2 rounded-lg bg-black/20 border border-gray-800 text-xs font-bold text-gray-400">
                    {currentPage} / {totalPages}
                  </div>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-white/[0.02] border border-gray-700 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.05] hover:border-gray-500 transition-all text-xs font-bold uppercase tracking-wider"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
          </>
        )}
      </div>
<RBACMatrix />

        <ConfirmDialog
          open={confirmState.open}
          title="Confirm action"
          message={
            confirmState.action === 'bulkRole'
              ? `Apply role "${selectedRole}" to ${selectedUserIds.length} selected user(s)?`
              : `Are you sure you want to proceed for this user?`
          }
          danger={confirmState.action === 'toggleStatus'}
          onConfirm={handleConfirmed}
          onCancel={() => setConfirmState({ open: false, action: null, payload: null })}
        />
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
}