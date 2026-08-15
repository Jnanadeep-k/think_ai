import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

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

  const navItems = [
    { label: 'My Courses', active: true },
    { label: 'Browse Catalog' },
    { label: 'Certificates' },
    { label: 'Settings' },
  ];

  return (
   
    <div>
      <div className="space-y-8">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-[var(--border)] pb-6 md:flex-row md:items-end">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent-to)]/80">
              Learner Portal
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              Dashboard &amp; Curriculum
            </h1>
          </div>

          <div
            className="rounded-lg border border-[var(--border)] bg-[var(--surface-glass)] px-4 py-2.5 font-mono text-sm
                       text-[var(--text-secondary)] backdrop-blur-xl"
          >
            <span className="text-[var(--text-muted)]">completion</span>
            <span className="text-[var(--text-muted)]">:</span>{' '}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]">
              {overallCompletion}%
            </span>
          </div>
        </div>

        {/* enrolled courses */}
        <div className="space-y-5">
          <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            <span className="text-[var(--accent-to)]/70">#</span>
            Enrolled Programs
            <span className="rounded-full bg-[var(--surface-glass)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-secondary)]">
              {enrolledCourses.length}
            </span>
          </h2>

          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="group relative overflow-hidden rounded-xl border border-[var(--border)]
                           bg-[var(--surface-glass)] p-6 backdrop-blur-xl transition-all duration-300
                           hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]
                           hover:shadow-[0_0_30px_var(--accent-glow)]"
              >
                {/* left accent bar, like a diff/gutter marker */}
                <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[var(--accent-from)] to-[var(--accent-to)] opacity-70" />

                <div className="flex flex-col items-start justify-between gap-6 pl-3 md:flex-row md:items-center">
                  <div className="max-w-xl space-y-1.5">
                    <span className="font-mono text-xs text-[var(--accent-to)]/80">
                      // instructor: {course.instructor}
                    </span>
                    <h3 className="text-xl font-semibold leading-snug text-[var(--text-primary)]">
                      {course.title}
                    </h3>
                    <p className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-secondary)]">
                      <CheckIcon />
                      module {course.completedModules} / {course.totalModules} complete
                    </p>
                  </div>

                  <div className="flex w-full items-center gap-6 md:w-auto">
                    <div className="hidden flex-1 sm:block md:w-32 md:flex-none">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]
                                     shadow-[0_0_8px_var(--accent-glow)]"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-[var(--text-secondary)]">
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