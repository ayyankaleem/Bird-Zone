import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, User, Mail, Key, CheckCircle, AlertCircle, X } from 'lucide-react';
import { api } from '../../services/api';

export const TeamManagement: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'staff' | 'owner'>('staff');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const data = await api.getTeam();
      setMembers(data);
    } catch (err) {
      console.error('Failed to load team:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setSubmitting(true);
    setError('');
    try {
      await api.addTeamMember({ name, email, password, role });
      setModalOpen(false);
      setName('');
      setEmail('');
      setPassword('');
      fetchTeam();
    } catch (err: any) {
      setError(err.message || 'Failed to add team member.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-['Montserrat']">
            Admin Staff & Access Control
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage authenticated store personnel with Owner or Staff operational permissions.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#153D2C] hover:bg-[#3C8053] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Team Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m) => (
          <div key={m.id} className="p-5 bg-white rounded-xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-[#153D2C] text-[#E9BE69] font-bold text-sm flex items-center justify-center">
                {m.name.charAt(0)}
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  m.role === 'owner' ? 'bg-[#153D2C] text-white' : 'bg-[#3C8053]/15 text-[#235841]'
                }`}
              >
                {m.role === 'owner' ? 'Owner / Full Admin' : 'Staff (Orders & Stock)'}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-stone-900 text-sm font-['Montserrat']">{m.name}</h3>
              <p className="text-xs text-stone-500 font-mono mt-0.5">{m.email}</p>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <span>Status: <strong className="text-emerald-700 capitalize">{m.status}</strong></span>
              <span>Joined: {new Date(m.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-sm font-['Montserrat']">
                Add Team Member
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="mt-4 space-y-3.5 text-xs">
              {error && (
                <div className="p-2.5 rounded bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Qureshi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="staff@birdzone.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Temporary Password (min 8 chars)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Role & Permissions</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full p-2 border border-stone-300 rounded bg-white text-stone-800"
                >
                  <option value="staff">Staff (Manage Orders, Inventory, View Products)</option>
                  <option value="owner">Owner (Full System Access & Settings)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#153D2C] hover:bg-[#3C8053] text-white font-semibold rounded shadow-xs"
                >
                  {submitting ? 'Adding...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
