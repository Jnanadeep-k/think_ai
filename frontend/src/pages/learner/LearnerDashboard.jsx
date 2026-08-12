import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/stories/Button';

function CodeBracketIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M7 4.5 3 10l4 5.5M13 4.5 17 10l-4 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3" aria-hidden="true">
      <path d="M3 8.5 6.2 12 13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LearnerDashboard() {
  const navigate = useNavigate();

  const enrolledCourses = [
    {
      id: 1,
      title: 'Advanced AI & Machine Learning Architectures',
      instructor: 'Dr. Sarah Jenkins',
      progress: 65,
      totalModules: 8,
      completedModules: 5,
    },
    {
      id: 2,
      title: 'Full-Stack React & Redux Mastery',
      instructor: 'Alex Rivera',
      progress: 30,
      totalModules: 10,
      completedModules: 3,
    },
  ];

  const overallCompletion = Math.round(
    enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length
  );

  return (
    <div className="relative min-h-screen bg-[#0B0E14] text-slate-100">
      {/* ambient background: soft grid + glow, evokes an IDE canvas */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600/20 to-cyan-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl space-y-10 p-6 md:p-10">
        {/* header — file-tab style */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <CodeBracketIcon />
            <span className="text-cyan-400">learner</span>
            <span>/</span>
            <span className="text-slate-300">dashboard.jsx</span>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-cyan-400/80">
                Learner Portal
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Dashboard &amp; Curriculum
              </h1>
            </div>

            <div
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-sm
                         text-slate-300 backdrop-blur-xl"
            >
              <span className="text-slate-500">completion</span>
              <span className="text-slate-500">:</span>{' '}
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
                {overallCompletion}%
              </span>
            </div>
          </div>
        </div>

        {/* enrolled courses */}
        <div className="space-y-5">
          <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
            <span className="text-cyan-400/70">#</span>
            Enrolled Programs
            <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[11px] text-slate-400">
              {enrolledCourses.length}
            </span>
          </h2>

          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="group relative overflow-hidden rounded-xl border border-white/10
                           bg-white/5 p-6 backdrop-blur-xl transition-all duration-300
                           hover:border-cyan-400/30 hover:bg-white/[0.07]
                           hover:shadow-[0_0_30px_rgba(34,211,238,0.10)]"
              >
                {/* left accent bar, like a diff/gutter marker */}
                <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-indigo-500 to-cyan-400 opacity-70" />

                <div className="flex flex-col items-start justify-between gap-6 pl-3 md:flex-row md:items-center">
                  <div className="max-w-xl space-y-1.5">
                    <span className="font-mono text-xs text-cyan-400/80">
                      // instructor: {course.instructor}
                    </span>
                    <h3 className="text-xl font-semibold leading-snug text-white">
                      {course.title}
                    </h3>
                    <p className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
                      <CheckIcon />
                      module {course.completedModules} / {course.totalModules} complete
                    </p>
                  </div>

                  <div className="flex w-full items-center gap-6 md:w-auto">
                    <div className="hidden flex-1 sm:block md:w-32 md:flex-none">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400
                                     shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-slate-300">
                      {course.progress}%
                    </span>

                    <div className="w-32">
                      <Button
                        label="Continue →"
                        onClick={() => navigate(`/learner/courses/${course.id}`)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}