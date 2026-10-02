import React, { useState, useEffect } from 'react';
import { History, ShieldAlert, Search } from 'lucide-react';
import { api, AuditLogData } from '../../services/api';

export const AuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await api.getAuditLogs();
        setLogs(data);
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-stone-900 font-['Montserrat']">
          System Security & Audit Activity Logs
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Tamper-evident chronological log of all administrator actions, price adjustments, and orders.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs max-w-md">
        <input
          type="text"
          placeholder="Filter by action, user, or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg"
        />
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Activity Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-400 font-sans">
                    Loading audit trail...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-400 font-sans">
                    No matching activity records.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50">
                    <td className="p-3.5 text-stone-500">
                      {new Date(log.timestamp).toLocaleString('en-PK')}
                    </td>
                    <td className="p-3.5 font-bold font-sans text-stone-900">{log.userName}</td>
                    <td className="p-3.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#3C8053] font-bold">{log.action}</td>
                    <td className="p-3.5 font-sans text-stone-700">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
