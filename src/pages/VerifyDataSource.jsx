import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { normalizeStudentRecords, countLegacyStudentRecords } from '../utils/dataNormalizers';

const ENABLE_DATA_CHECK = process.env.REACT_APP_ENABLE_DATA_CHECK === 'true';
const ADMIN_PROBE_EMAIL = process.env.REACT_APP_ADMIN_PROBE_EMAIL || 'admin@dropshield.com';
const ADMIN_PROBE_PASSWORD = process.env.REACT_APP_ADMIN_PROBE_PASSWORD || 'Admin@123';
const DB_LABEL = process.env.REACT_APP_DB_LABEL || 'MongoDB Atlas (masked)';

export default function VerifyDataSource() {
  const [status, setStatus] = useState('Idle');
  const [dbInfo, setDbInfo] = useState(null);
  const [rawStudents, setRawStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkDataSource = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setStatus('📡 Connecting to backend...');

      const loginRes = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: ADMIN_PROBE_EMAIL,
        password: ADMIN_PROBE_PASSWORD
      });

      const token = loginRes.data.token;
      setStatus('🔐 Logged in as admin, fetching students...');

      const studentsRes = await axios.get(`${API_BASE_URL}/admin/data/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRawStudents(studentsRes.data);
      setStudents(normalizeStudentRecords(studentsRes.data));
      setDbInfo({
        connection: DB_LABEL,
        collection: 'students',
        endpoint: `${API_BASE_URL}/admin/data/students`,
        recordCount: studentsRes.data.length,
        legacyCount: countLegacyStudentRecords(studentsRes.data)
      });

      setStatus('✅ Data verified from MongoDB Atlas Cloud!');
    } catch (err) {
      console.error('Verification error:', err);
      setStatus('❌ Verification failed');
      setError(err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ENABLE_DATA_CHECK) {
      checkDataSource();
    }
  }, [checkDataSource]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🔍 Data Source Verification</h1>
            <p className="text-gray-600">Confirms that the frontend can talk to the live MongoDB dataset.</p>
          </div>
          {!ENABLE_DATA_CHECK && (
            <button
              onClick={checkDataSource}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-500"
              disabled={loading}
            >
              {loading ? 'Running...' : 'Run verification'}
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="text-lg font-semibold text-gray-800">{status}</p>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        {dbInfo && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Database Connection Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">Database:</span>
                <span className="text-gray-600 font-mono">{dbInfo.connection}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">Collection:</span>
                <span className="text-gray-600 font-mono">{dbInfo.collection}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">API Endpoint:</span>
                <span className="text-gray-600 font-mono break-all">{dbInfo.endpoint}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">Total Records:</span>
                <span className="text-indigo-600 font-bold text-lg">{dbInfo.recordCount}</span>
              </div>
              {dbInfo.legacyCount > 0 && (
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Legacy rows normalized:</span>
                  <span className="text-yellow-600 font-semibold">{dbInfo.legacyCount}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Talking to the backend...</p>
          </div>
        )}

        {!loading && students.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Students from MongoDB</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Roll</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                    <th className="px-4 py-2 text-left">Department</th>
                    <th className="px-4 py-2 text-left">DB ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono text-sm">{s.roll}</td>
                      <td className="px-4 py-2">{s.name}</td>
                      <td className="px-4 py-2 text-sm">{s.email}</td>
                      <td className="px-4 py-2 text-sm">{s.phone}</td>
                      <td className="px-4 py-2 text-sm">{s.department}</td>
                      <td className="px-4 py-2 font-mono text-xs text-gray-500">{s.id?.substring(0, 8)}...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Raw MongoDB JSON:</h3>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                {JSON.stringify(rawStudents, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
