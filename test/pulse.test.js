import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { db } from "../src/db.js";
import { create as createOperator, findByEmail } from "../src/models/operator.js";
import { create as createMonitor, listById as findMonitorById, updateById as updateMonitor } from "../src/models/monitor.js";
import { check as getPaginatedChecks } from "../src/models/check.js";
import { addCheck } from "../src/models/schedulerModel.js";
import { listUpMonitor, listActiveIncidents } from "../src/models/status.js";
import { checkSingleMonitor } from "../src/controllers/schedulerController.js";
import { operatorSchema } from "../src/lib/schemas.js";

let mockServerResponseStatus = 200;
let mockServerDelayMs = 0;

const mockServer = http.createServer((req, res) => {
  if (mockServerDelayMs > 0) {
    setTimeout(() => {
      res.writeHead(mockServerResponseStatus);
      res.end("delayed");
    }, mockServerDelayMs);
  } else {
    res.writeHead(mockServerResponseStatus, { "Content-Type": "text/plain" });
    res.end("response");
  }
});

test.before(async () => {
  await db.query("TRUNCATE TABLE operators, monitors, checks, incidents RESTART IDENTITY CASCADE;");
  await new Promise((resolve) => mockServer.listen(4005, resolve));
});

test.after(async () => {
  mockServer.close();
  await db.end();
});

test("boundary validation parsing test", () => {
  const badEmail = operatorSchema.safeParse({ email: "invalid-email", password: "password123" });
  assert.equal(badEmail.success, false);

  const longPassword = operatorSchema.safeParse({ email: "valid@gmail.com", password: "a".repeat(121) });
  assert.equal(longPassword.success, false);
});

test("operator data layer integration lifecycle", async () => {
  const email = `test-${Date.now()}@pulse.io`;
  const passHash = "$2b$10$mellpYbgMi76ecNPDYwojeiRJfw.zg6.PsVY4MNc/eNObzb0U3zBG";

  const operator = await createOperator({ email, password_hash: passHash });
  assert.ok(operator.id);
  assert.equal(operator.email, email);

  const found = await findByEmail(email);
  assert.ok(found);
  assert.equal(found.password_hash, passHash);
});

test("operator uniqueness violations management", async () => {
  const email = `duplicate-${Date.now()}@pulse.io`;
  const passHash = "hash";

  await createOperator({ email, password_hash: passHash });
  
  await assert.rejects(
    async () => {
      await createOperator({ email, password_hash: passHash });
    },
    (err) => err.message === "Operator already exists" || err.message === "duplicate"
  );
});

test("monitor management setup validation routines", async () => {
  const newMonitor = await createMonitor({
    operator_id: 1,
    name: "Test Gateway Target",
    url: "http://, list as listMonitorslocalhost:4005/health",
    interval_seconds: 15,
    expected_status: 200,
    is_active: true
  });

  assert.ok(newMonitor.id);
  assert.equal(newMonitor.interval_seconds, 15);

  const lookup = await findMonitorById(newMonitor.id);
  assert.equal(lookup.name, "Test Gateway Target");
});

test("monitor coalesced columns targeted update steps", async () => {
  const alteredRow = await updateMonitor(1, { interval_seconds: 45 });
  assert.equal(alteredRow.interval_seconds, 45);
  assert.equal(alteredRow.is_active, true);
});

test("outbound scheduler call successful metrics processing", async () => {
  mockServerResponseStatus = 200;
  mockServerDelayMs = 0;

  const evaluationObj = await checkSingleMonitor({ id: 1, url: "http://localhost:4005", expected_status: 200 });
  assert.equal(evaluationObj.ok, true);
  assert.equal(evaluationObj.status_code, 200);
  assert.equal(evaluationObj.error, null);
  assert.equal(typeof evaluationObj.latency_ms, "number");
});

test("outbound scheduler call server exception classification", async () => {
  mockServerResponseStatus = 500;

  const evaluationObj = await checkSingleMonitor({ id: 1, url: "http://localhost:4005", expected_status: 200 });
  assert.equal(evaluationObj.ok, false);
  assert.equal(evaluationObj.status_code, 500);
  assert.ok(evaluationObj.error.includes("received 500"));
});

test("outbound scheduler call execution timeout boundary safety", async () => {
  mockServerResponseStatus = 200;
  mockServerDelayMs = 6000;

  const evaluationObj = await checkSingleMonitor({ id: 1, url: "http://localhost:4005", expected_status: 200 });
  assert.equal(evaluationObj.ok, false);
  assert.equal(evaluationObj.status_code, null);
  assert.ok(evaluationObj.error.includes("TimeoutError"));
});

test("incident state loop down tracking instantiation", async () => {
  await db.query("TRUNCATE TABLE checks, incidents RESTART IDENTITY CASCADE;");

  const failingResultPayload = {
    monitor_id: 1,
    ok: false,
    status_code: 503,
    latency_ms: 120,
    error: "Service Unavailable (503 Outage)"
  };

  await addCheck(failingResultPayload);

  const openProblemsRows = await listActiveIncidents();
  assert.equal(openProblemsRows.length, 1);
  assert.equal(openProblemsRows[0].monitor_id, 1);
  assert.equal(openProblemsRows[0].cause, "Service Unavailable (503 Outage)");

  await addCheck(failingResultPayload);
  const consecutiveProblemsRows = await listActiveIncidents();
  assert.equal(consecutiveProblemsRows.length, 1);
});

test("incident state loop resolution execution metrics updating", async () => {
  const healthyRecoveryResultPayload = {
    monitor_id: 1,
    ok: true,
    status_code: 200,
    latency_ms: 32,
    error: null
  };

  await addCheck(healthyRecoveryResultPayload);

  const remainingOpenProblemsRows = await listActiveIncidents();
  assert.equal(remainingOpenProblemsRows.length, 0);

  const historicalLogCheck = await db.query("SELECT resolved_at FROM incidents WHERE monitor_id = 1");
  assert.ok(historicalLogCheck.rows[0].resolved_at !== null);
});

test("time series checks collection pagination limitations bounds", async () => {
  const logsHistoryList = await getPaginatedChecks({ monitor_id: 1, after: 0, limit: 2 });
  assert.ok(Array.isArray(logsHistoryList));
  assert.ok(logsHistoryList.length <= 2);
});

test("public aggregation state layout collection operations overview", async () => {
  const monitorsList = await listUpMonitor();
  const incidentsList = await listActiveIncidents();

  assert.ok(Array.isArray(monitorsList));
  assert.ok(Array.isArray(incidentsList));
});

test("security dynamic parameterized string literal injection handling safety", async () => {
  const attackPayloadString = "'; DROP TABLE monitors CASCADE; --";
  
  const injectionTargetPayload = {
    monitor_id: 1,
    ok: false,
    status_code: 400,
    latency_ms: 5,
    error: attackPayloadString
  };

  await addCheck(injectionTargetPayload);

  const safetyVerificationLookup = await db.query("SELECT COUNT(*) FROM monitors;");
  assert.ok(parseInt(safetyVerificationLookup.rows[0].count, 10) > 0);
});
