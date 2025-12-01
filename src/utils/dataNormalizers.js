const FALLBACK_KEYS = {
  roll: ['roll', 'Roll', 'Roll No', 'Roll Number', 'rollNo', 'studentId', 'Student Id', 'Student ID', 'student_id'],
  name: ['name', 'Name', 'studentName', 'Student Name'],
  email: ['email', 'Email', 'studentEmail', 'Email ID'],
  phone: ['phone', 'Phone', 'studentPhone', 'Student Phone Number', 'Student Phone'],
  department: ['deptId.name', 'department', 'Department', 'deptName'],
  semester: ['semester', 'Semester', 'sem', 'Sem', 'Year'],
  cgpa: ['cgpa', 'CGPA', 'GPA'],
  attendance: ['attendance', 'Attendance', 'Attendance (%)'],
  section: ['section', 'Section']
};

const getNestedValue = (record, path) => {
  if (!record || !path) return undefined;
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), record);
};

const pickValue = (record, keys) => {
  for (const key of keys) {
    const value = getNestedValue(record, key);
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }
  return undefined;
};

export const normalizeStudentRecords = (records = []) =>
  records.map((record) => {
    const normalized = {
      id: record?._id?.toString() || record?.id || Math.random().toString(36).slice(2),
      roll: pickValue(record, FALLBACK_KEYS.roll) || 'N/A',
      name: pickValue(record, FALLBACK_KEYS.name) || 'N/A',
      email: pickValue(record, FALLBACK_KEYS.email) || 'N/A',
      phone: pickValue(record, FALLBACK_KEYS.phone) || 'N/A',
      department: pickValue(record, FALLBACK_KEYS.department) || 'N/A',
      semester: pickValue(record, FALLBACK_KEYS.semester) || 'N/A',
      cgpa: pickValue(record, FALLBACK_KEYS.cgpa) || 'N/A',
      attendance: pickValue(record, FALLBACK_KEYS.attendance) ?? 'N/A',
      section: pickValue(record, FALLBACK_KEYS.section)
    };

    if (normalized.section && normalized.semester === 'N/A') {
      normalized.semester = normalized.section;
    }

    if (normalized.semester !== 'N/A' && typeof normalized.semester === 'number') {
      normalized.semester = `Year ${normalized.semester}`;
    }

    return normalized;
  });

export const countLegacyStudentRecords = (records = []) =>
  records.filter((record) => !record?.roll && (record['Student Id'] || record['Roll No'] || record['Name'])).length;
