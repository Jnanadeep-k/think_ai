import React, { useState, useMemo, useEffect } from 'react';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import UserModal from '../../components/admin/UserModal'; // <-- Imported Modal
import { usePermission } from '../../hooks/usePermission';
import apiClient from '../../services/apiClient';
// Move to state inside component, but keep initial data here
const INITIAL_USERS = [
  { id: 1, name: 'Test Learner', email: 'learner@test.com', role: 'learner', status: 'active' },
  { id: 2, name: 'Test Instructor', email: 'instructor@test.com', role: 'instructor', status: 'active' },
  { id: 3, name: 'Test TA', email: 'ta@test.com', role: 'ta', status: 'active' },
  { id: 4, name: 'Test Admin', email: 'admin@test.com', role: 'admin', status: 'active' },
  { id: 5, name: 'Arun Kumar', email: 'arun@test.com', role: 'learner', status: 'suspended' },
];

const ROLE_STYLES = {
  learner: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  instructor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  ta: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  admin: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

useEffect(() => {
  apiClient.get('/admin/users').then((res) => {
    setUsers(res.data.data);
  });
}, []); 
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const canManageUsers = usePermission('USER_MANAGEMENT');

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [search, roleFilter, users]);

  // Handle opening modal for Add or Edit
  const handleOpenModal = (user = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Handle saving data from modal
  const handleSaveUser = (userData) => {
  if (userData.id) {
    apiClient.put(`/admin/users/${userData.id}/role`, { role: userData.role })
      .then((res) => {
        setUsers(users.map(u => u.id === userData.id ? res.data.data : u));
      });
  } else {
    // No backend support yet for creating new users — stays local for now
    const newUser = { ...userData, id: Date.now() };
    setUsers([...users, newUser]);
  }
  setIsModalOpen(false);
};
  // Quick toggle for status column
  const handleToggleStatus = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
      }
      return u;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-gray-400 mt-1">Manage learners, instructors, TAs and admins.</p>
        </div>
        {canManageUsers && (
          <Button label="+ Add User" onClick={() => handleOpenModal()} />
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
          <div className="flex gap-2">
            {['all', 'learner', 'instructor', 'ta', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  roleFilter === role
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    : 'text-gray-400 border-gray-800 hover:border-gray-700'
                }`}
              >
                {role === 'all' ? 'All' : role.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-800">
                <th className="py-3 font-medium">Name</th>
                <th className="py-3 font-medium">Email</th>
                <th className="py-3 font-medium">Role</th>
                <th className="py-3 font-medium">Status</th>
                <th className="py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-gray-900 hover:bg-gray-900/40">
                  <td className="py-3 text-gray-200">{u.name}</td>
                  <td className="py-3 text-gray-400">{u.email}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${ROLE_STYLES[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={u.status === 'active' ? 'text-cyan-400' : 'text-red-400'}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 text-right space-x-3">
                    {canManageUsers ? (
                      <>
                        <button 
                          onClick={() => handleOpenModal(u)}
                          className="text-gray-400 hover:text-cyan-400 text-xs transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(u.id)}
                          className="text-gray-400 hover:text-red-400 text-xs transition-colors"
                        >
                          {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-700 text-xs">View only</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-600">
                    No users match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render the Modal here */}
      <UserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
}
