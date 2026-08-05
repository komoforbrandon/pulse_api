export async function checkSingleMonitor(monitor) {
  const startTime = performance.now();

  try {
    const response = await fetch(monitor.url, {
      signal: AbortSignal.timeout(5000),
      headers: { "User-Agent": "PulseStatusMonitor/1.0" },
    });

    const endTime = performance.now();
    const latencyMs = Math.round(endTime - startTime);

    const matchesExpected = response.status === monitor.expected_status;

    return {
      monitor_id: monitor.id,
      ok: matchesExpected,
      status_code: response.status,
      latency_ms: latencyMs,
      error: matchesExpected
        ? null
        : `Expected status ${monitor.expected_status}, received ${response.status}`,
    };
  } catch (err) {
    const endTime = performance.now();
    const latencyMs = Math.round(endTime - startTime);

    if (err.name === "TimeoutError" || err.message?.includes("timeout")) {
      return {
        monitor_id: monitor.id,
        ok: false,
        status_code: null,
        latency_ms: latencyMs,
        error: "TimeoutError: Server took longer than 5000ms to respond",
      };
    }
    return {
      monitor_id: monitor.id,
      ok: false,
      status_code: null,
      latency_ms: latencyMs,
      error: `NetworkError: ${err.message || "Connection failed"}`,
    };
  }
}
