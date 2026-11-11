import { useCallback, useEffect, useState } from "react";
import { lmsApi } from "@/lms/api";
import { useLms } from "@/lms/LmsProvider";
import { useLmsResource } from "@/lms/useLmsResource";
const terminal = (status: string) => ["GRADED", "FAILED"].includes(status);
export function useAssessmentResults(attemptId: number) {
  const { session } = useLms();
  const [attempts, setAttempts] = useState(0);
  const fetcher = useCallback(() => lmsApi.result(attemptId), [attemptId, session.token]);
  const resource = useLmsResource(fetcher);
  useEffect(() => { setAttempts(0); }, [attemptId, session.token]);
  const polling = !!resource.data && resource.data.attemptId === attemptId &&
    !terminal(resource.data.status) && !resource.error && attempts < 12;
  useEffect(() => {
    if (!polling || resource.loading) return;
    const timer = setTimeout(() => {
      setAttempts(value => value + 1);
      void resource.refresh();
    }, Math.min(2000 * 2 ** attempts, 30000));
    return () => clearTimeout(timer);
  }, [polling, resource.loading, resource.refresh, attempts, attemptId, session.token]);
  const checkNow = useCallback(async () => {
    setAttempts(0);
    await resource.refresh();
  }, [resource.refresh]);
  return { ...resource, polling, checkNow };
}
