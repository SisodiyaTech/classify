import React, { useState } from 'react';
import { useStore } from '../../context/AppContext';
import { Users, Shield, GraduationCap, Sparkles } from 'lucide-react';
import Badge from '../../components/common/Badge';

export const AdminUsersPage = () => {
  const { users } = useStore();
  const [filterRole, setFilterRole] = useState('all');

  const filteredUsers = users.filter((u) => {
    if (filterRole === 'all') return true;
    return u.role === filterRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">User Directory</h1>
          <p className="text-xs text-content-muted mt-1">
            Browse and manage all registered students, instructors, and platform admins.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-edge text-xs">
          {['all', 'student', 'instructor', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition ${
                filterRole === r
                  ? 'bg-brand-500 text-white shadow-subtle'
                  : 'text-content-muted hover:text-brand-900'
              }`}
            >
              {r === 'all' ? 'All Roles' : `${r}s`}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-edge shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-edge bg-surface-subtle text-content-muted uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-surface-subtle transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-edge shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-brand-900">{u.name}</p>
                        <p className="text-[11px] text-content-muted">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={u.role === 'admin' ? 'dark' : u.role === 'instructor' ? 'brand' : 'accent'} size="sm" className="capitalize">
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-content-muted">{u.joinedDate}</td>
                  <td className="py-3.5 px-4 text-content-body">{u.location || 'India'}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-emerald-700 font-semibold text-[11px]">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
