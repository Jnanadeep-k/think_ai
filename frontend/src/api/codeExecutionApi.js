const EXECUTE_ENDPOINT = "/api/code/execute";

export async function runCode({ language, code, timeoutMs = 10000 }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(EXECUTE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },  
      body: JSON.stringify({ language, code }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.message || `Execution failed (${res.status})`);
    }

    // Expected shape: { stdout, stderr, exitCode, timedOut }
    return await res.json();
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Execution timed out.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}