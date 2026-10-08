import React from 'react';
import { useCollege } from '../../context/CollegeContext';
import { CheckCircle2, XCircle, FileText } from 'lucide-react';

type Stage = 'hon' | 'exam' | 'registrar';

export const CourseRegistrationApprovalQueue: React.FC<{ stage: Stage; title: string }> = ({ stage, title }) => {
  const { courseRegistrations, approveCourseRegistration, rejectCourseRegistration } = useCollege();
  const expected = stage === 'hon' ? 'submitted' : stage === 'exam' ? 'hon_approved' : 'exam_approved';
  const pending = courseRegistrations.filter((r) => r.status === expected);
  const approve = async (id: string) => { await approveCourseRegistration(id, stage); alert(`${title} approval completed.`); };
  const reject = async (id: string) => { const reason = window.prompt('Enter rejection reason:'); if (reason?.trim()) await rejectCourseRegistration(id, reason.trim()); };
  return <section className="bg-white p-6 rounded-3xl shadow-md border border-slate-200 space-y-4">
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
      <div><h2 className="font-black text-emerald-950 uppercase text-sm">{title} — Course Registration Approval</h2><p className="text-xs text-slate-500">Only registrations at the correct workflow stage are shown.</p></div>
      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">{pending.length} pending</span>
    </div>
    {pending.length === 0 ? <div className="p-5 rounded-2xl bg-slate-50 text-xs text-slate-500">No course registrations are awaiting your approval.</div> : <div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="bg-slate-50 text-left"><th className="p-3">Student</th><th className="p-3">Admission No.</th><th className="p-3">Level</th><th className="p-3">Session</th><th className="p-3">Courses</th><th className="p-3">Action</th></tr></thead><tbody>{pending.map(r => <tr key={r.id} className="border-t border-slate-100"><td className="p-3 font-bold">{r.studentName}</td><td className="p-3 font-mono">{r.admissionNumber}</td><td className="p-3">{r.level === 100 ? 'ND 1' : 'ND 2'}</td><td className="p-3">{r.session} / {r.semester}</td><td className="p-3"><div className="flex flex-wrap gap-1">{r.courses.map(c => <span key={c.courseId} className="px-2 py-1 rounded bg-emerald-50 text-emerald-800">{c.courseCode}</span>)}</div></td><td className="p-3"><div className="flex gap-2"><button onClick={() => approve(r.id)} className="px-3 py-2 bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/>Approve</button><button onClick={() => reject(r.id)} className="px-3 py-2 bg-rose-50 text-rose-700 rounded-lg font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5"/>Reject</button></div></td></tr>)}</tbody></table></div>}
  </section>;
};
