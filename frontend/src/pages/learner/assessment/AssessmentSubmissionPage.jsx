import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AssessmentSubmission from './AssessmentSubmission';
import { fetchAssessment, autosaveAnswers, submitAssessment } from '../../../api/assessmentApi';

export default function AssessmentSubmissionPage() {
  const { assessmentId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssessment(assessmentId).then(setData).catch((e) => setError(e.message));
  }, [assessmentId]);

  const handleAutosave = useCallback(
    (answers) => autosaveAnswers(assessmentId, answers),
    [assessmentId]
  );
  const handleSubmit = useCallback(
    (answers) => submitAssessment(assessmentId, answers),
    [assessmentId]
  );

  if (error) return <div className="p-6 text-sm text-red-600">{error}</div>;
  if (!data) return <div className="p-6 text-sm text-neutral-400">Loading assessment…</div>;

  return (
    <AssessmentSubmission
      questions={data.questions}
      durationSeconds={data.durationSeconds}
      onAutosave={handleAutosave}
      onSubmit={handleSubmit}
    />
  );
}