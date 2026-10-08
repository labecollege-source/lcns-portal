import React, { useMemo, useState } from 'react';
import { useCollege } from '../../context/CollegeContext';
import { Course, UserProfile } from '../../types/college';
import { BookOpen, Edit2, Plus, Trash2, UserRoundCheck, X, Save } from 'lucide-react';

interface CourseManagementProps {
  officerLabel: string;
}

const emptyCourse = (lecturer?: UserProfile): Course => ({
  id: `course-${Date.now()}`,
  code: '',
  title: '',
  department: 'Department of Nursing Sciences',
  level: 100,
  semester: 'First',
  creditUnits: 3,
  durationHours: 45,
  assignedLecturerId: lecturer?.uid,
  assignedLecturerName: lecturer?.displayName,
  type: 'compulsory',
  approved: true,
  description: '',
});

export const CourseManagement: React.FC<CourseManagementProps> = ({ officerLabel }) => {
  const { courses, saveCourse, deleteCourse, userAccounts } = useCollege();
  const lecturers = useMemo(
    () => userAccounts.filter((u) => u.role === 'lecturer' && u.status === 'active'),
    [userAccounts]
  );

  const [editing, setEditing] = useState<Course | null>(null);
  const [search, setSearch] = useState('');

  const filteredCourses = courses.filter((c) =>
    `${c.code} ${c.title} ${c.department} ${c.assignedLecturerName || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const startNew = () => setEditing(emptyCourse(lecturers[0]));

  const updateField = <K extends keyof Course>(key: K, value: Course[K]) => {
    setEditing((current) => (current ? { ...current, [key]: value } : current));
  };

  const handleLecturerChange = (uid: string) => {
    const lecturer = lecturers.find((l) => l.uid === uid);
    setEditing((current) =>
      current
        ? {
            ...current,
            assignedLecturerId: lecturer?.uid || undefined,
            assignedLecturerName: lecturer?.displayName || undefined,
          }
        : current
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.code.trim() || !editing.title.trim()) {
      alert('Course code and course title are required.');
      return;
    }
    await saveCourse({
      ...editing,
      code: editing.code.trim().toUpperCase(),
      title: editing.title.trim(),
      description: editing.description?.trim() || '',
    });
    setEditing(null);
  };

  const handleDelete = async (course: Course) => {
    if (!window.confirm(`Delete ${course.code} - ${course.title}? This will remove the course from the course registry.`)) {
      return;
    }
    await deleteCourse(course.id);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
              Academic Course Registry
            </span>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-700" />
              Course Creation & Lecturer Assignment
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {officerLabel} can manually create, edit, approve, delete and assign courses. The lecturer selector is populated directly from active Lecturer user accounts.
            </p>
          </div>
          <button
            type="button"
            onClick={startNew}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            Add New Course
          </button>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search course code, title, department or lecturer..."
            className="flex-1 px-3 py-2.5 border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
          />
          <div className="px-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900">
            {filteredCourses.length} course{filteredCourses.length === 1 ? '' : 's'} in registry
          </div>
        </div>

        {editing && (
          <form onSubmit={handleSave} className="mt-5 p-5 bg-slate-50 border border-slate-300 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-emerald-950">
                {courses.some((c) => c.id === editing.id) ? 'Edit Course' : 'Create New Course'}
              </h3>
              <button type="button" onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-slate-200 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Code *</label>
                <input value={editing.code} onChange={(e) => updateField('code', e.target.value)} placeholder="NUR 201" required className="w-full p-2.5 border rounded-xl" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Course Title *</label>
                <input value={editing.title} onChange={(e) => updateField('title', e.target.value)} placeholder="Medical-Surgical Nursing" required className="w-full p-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Credit Units</label>
                <input type="number" min={1} max={10} value={editing.creditUnits} onChange={(e) => updateField('creditUnits', Number(e.target.value))} className="w-full p-2.5 border rounded-xl" />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Department</label>
                <input value={editing.department} onChange={(e) => updateField('department', e.target.value)} className="w-full p-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Level</label>
                <select value={editing.level} onChange={(e) => updateField('level', Number(e.target.value) as Course['level'])} className="w-full p-2.5 border rounded-xl">
                  <option value={100}>ND 1</option>
                  <option value={200}>ND 2</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Semester</label>
                <select value={editing.semester} onChange={(e) => updateField('semester', e.target.value as Course['semester'])} className="w-full p-2.5 border rounded-xl">
                  <option value="First">First</option>
                  <option value="Second">Second</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Type</label>
                <select value={editing.type} onChange={(e) => updateField('type', e.target.value as Course['type'])} className="w-full p-2.5 border rounded-xl">
                  <option value="compulsory">Compulsory</option>
                  <option value="elective">Elective</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block font-bold text-slate-700 mb-1">
                  Assign Lecturer <span className="font-normal text-slate-500">(from User Accounts)</span>
                </label>
                <select
                  value={editing.assignedLecturerId || ''}
                  onChange={(e) => handleLecturerChange(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                >
                  <option value="">-- Unassigned --</option>
                  {lecturers.map((lecturer) => (
                    <option key={lecturer.uid} value={lecturer.uid}>
                      {lecturer.displayName} — {lecturer.identifierNumber || lecturer.email}
                    </option>
                  ))}
                </select>
                {lecturers.length === 0 && (
                  <p className="text-[10px] text-amber-700 mt-1">
                    No active Lecturer account exists yet. Create a Lecturer account first.
                  </p>
                )}
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 p-2.5 bg-white border rounded-xl w-full cursor-pointer">
                  <input type="checkbox" checked={editing.approved} onChange={(e) => updateField('approved', e.target.checked)} />
                  <span className="font-bold text-slate-700">Approved / Active</span>
                </label>
              </div>

              <div className="md:col-span-4">
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea rows={2} value={editing.description || ''} onChange={(e) => updateField('description', e.target.value)} className="w-full p-2.5 border rounded-xl" placeholder="Course description..." />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer">
                <Save className="w-4 h-4 text-amber-300" />
                Save Course
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <th className="py-3 px-3">Code</th>
                <th className="py-3 px-3">Course</th>
                <th className="py-3 px-3">Level / Sem.</th>
                <th className="py-3 px-3">Lecturer</th>
                <th className="py-3 px-3 text-center">CU</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-black text-emerald-950">{course.code}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {course.title}
                    <span className="block text-[10px] text-slate-400">{course.department}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{course.level === 100 ? 'ND 1' : 'ND 2'} • {course.semester}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
                      <UserRoundCheck className="w-3.5 h-3.5 text-emerald-700" />
                      {course.assignedLecturerName || 'Unassigned'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold">{course.creditUnits}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${course.approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {course.approved ? 'Approved' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button type="button" onClick={() => setEditing(course)} className="p-2 text-slate-600 hover:text-emerald-800 cursor-pointer" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => handleDelete(course)} className="p-2 text-slate-500 hover:text-rose-700 cursor-pointer" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCourses.length === 0 && (
                <tr><td colSpan={7} className="py-10 text-center text-slate-500">No courses match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
