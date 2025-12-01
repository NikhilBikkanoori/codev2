import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { adminFetchStudents } from '../utils/api';
import { normalizeStudentRecords, countLegacyStudentRecords } from '../utils/dataNormalizers';

export default function StudentsData() {
  const [students, setStudents] = useState([]);
  const [rawStudents, setRawStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await adminFetchStudents();
      setRawStudents(data);
      setStudents(normalizeStudentRecords(data));
      setError(null);
    } catch (err) {
      console.error('Error with auth endpoint:', err);
      setError(err.response?.data?.msg || 'Please login first as admin to view student data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const legacyCount = useMemo(() => countLegacyStudentRecords(rawStudents), [rawStudents]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Student Database</h1>
          <p className="text-gray-600">All students retrieved from MongoDB</p>
        </div>

        {legacyCount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
            {legacyCount} legacy student records were normalized from CSV column names. Consider running the
            backend cleanup script to permanently align the data model.
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">⚠️ {error}</p>
            <p className="mt-2 text-sm">Please login as admin first to view student data.</p>
            <a href="/admin-login" className="mt-2 inline-block text-red-700 underline font-semibold">
              Go to Admin Login
            </a>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading student data from database...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
            No students found in the database.
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <p className="text-lg font-semibold text-gray-800">
                Total Students: <span className="text-indigo-600">{students.length}</span>
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Roll No.</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Semester / Year</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">CGPA</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student, index) => (
                    <tr key={student.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.roll}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{student.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{student.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{student.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{student.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 text-center">{student.semester}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 text-center">{student.cgpa}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 text-center">{student.attendance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Raw JSON Data</h2>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-xs text-gray-800">
                {JSON.stringify(rawStudents.length ? rawStudents : students, null, 2)}
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
