import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

function isDemo(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("thinkmate-demo-mode") === "true";
}

function getSessionToken(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("thinkmate-session-token") || "";
}

// Authentication server functions
const signUpFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string(),
      password: z.string(),
      displayName: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const { signUpUserServer } = await import("./db.server");
    return signUpUserServer(data.email, data.password, data.displayName);
  });

const signInFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string(),
      password: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const { signInUserServer } = await import("./db.server");
    return signInUserServer(data.email, data.password);
  });

const signOutFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    const { signOutUserServer } = await import("./db.server");
    await signOutUserServer(data.token);
  });

const getCurrentUserFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    const { getUserFromServer } = await import("./db.server");
    return getUserFromServer(data.token);
  });

// Database queries server functions
const saveSessionFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string(), sessionData: z.any() }))
  .handler(async ({ data }) => {
    const { saveSessionServer } = await import("./db.server");
    return saveSessionServer(data.token, data.sessionData);
  });

const getLatestSessionFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    const { getLatestSessionServer } = await import("./db.server");
    return getLatestSessionServer(data.token);
  });

const saveTasksFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string(), tasks: z.array(z.any()) }))
  .handler(async ({ data }) => {
    const { saveTasksServer } = await import("./db.server");
    await saveTasksServer(data.token, data.tasks);
  });

const updateTaskFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string(), id: z.string(), patch: z.any() }))
  .handler(async ({ data }) => {
    const { updateTaskServer } = await import("./db.server");
    await updateTaskServer(data.token, data.id, data.patch);
  });

const getUserTasksFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string(), options: z.any().optional() }))
  .handler(async ({ data }) => {
    const { getUserTasksServer } = await import("./db.server");
    return getUserTasksServer(data.token, data.options);
  });

const appendLoadHistoryFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string(), entry: z.any() }))
  .handler(async ({ data }) => {
    const { appendLoadHistoryServer } = await import("./db.server");
    await appendLoadHistoryServer(data.token, data.entry);
  });

const getLoadHistoryFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string(), limit: z.number().optional() }))
  .handler(async ({ data }) => {
    const { getLoadHistoryServer } = await import("./db.server");
    return getLoadHistoryServer(data.token, data.limit ?? 30);
  });

const saveReflectionFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string(), reflection: z.any() }))
  .handler(async ({ data }) => {
    const { saveReflectionServer } = await import("./db.server");
    await saveReflectionServer(data.token, data.reflection);
  });

const getReflectionsFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string(), limit: z.number().optional() }))
  .handler(async ({ data }) => {
    const { getReflectionsServer } = await import("./db.server");
    return getReflectionsServer(data.token, data.limit ?? 30);
  });

const saveGoalFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string(), goal: z.any() }))
  .handler(async ({ data }) => {
    const { saveGoalServer } = await import("./db.server");
    await saveGoalServer(data.token, data.goal);
  });

const getGoalsFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    const { getGoalsServer } = await import("./db.server");
    return getGoalsServer(data.token);
  });

const saveDecisionFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string(), decision: z.any() }))
  .handler(async ({ data }) => {
    const { saveDecisionServer } = await import("./db.server");
    await saveDecisionServer(data.token, data.decision);
  });

const getDecisionsFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    const { getDecisionsServer } = await import("./db.server");
    return getDecisionsServer(data.token);
  });

const getStreakFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    const { getStreakServer } = await import("./db.server");
    return getStreakServer(data.token);
  });

const updateStreakFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string(), completedTimeStr: z.string(), completedDateStr: z.string() }))
  .handler(async ({ data }) => {
    const { updateStreakServer } = await import("./db.server");
    return updateStreakServer(data.token, data.completedTimeStr, data.completedDateStr);
  });

const saveCommitmentFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string(), commitment: z.string() }))
  .handler(async ({ data }) => {
    const { saveCommitmentServer } = await import("./db.server");
    return saveCommitmentServer(data.token, data.commitment);
  });

const getActiveCommitmentFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    const { getActiveCommitmentServer } = await import("./db.server");
    return getActiveCommitmentServer(data.token);
  });

const fulfillCommitmentFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string(), commitmentId: z.string() }))
  .handler(async ({ data }) => {
    const { fulfillCommitmentServer } = await import("./db.server");
    await fulfillCommitmentServer(data.token, data.commitmentId);
  });

const detectProcrastinationTriggersFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string(), newTaskTitles: z.array(z.string()) }))
  .handler(async ({ data }) => {
    const { detectProcrastinationTriggersServer } = await import("./db.server");
    return detectProcrastinationTriggersServer(data.token, data.newTaskTitles);
  });

// Auth Client API wrapper exports
export async function localSignUp(email: string, password_plain: string, displayName: string) {
  return signUpFn({ data: { email, password: password_plain, displayName } });
}

export async function localSignIn(email: string, password_plain: string) {
  return signInFn({ data: { email, password: password_plain } });
}

export async function localSignOut() {
  const token = getSessionToken();
  if (token) {
    await signOutFn({ data: { token } });
  }
}

export async function localGetCurrentUser() {
  const token = getSessionToken();
  if (!token) return null;
  return getCurrentUserFn({ data: { token } });
}

// Database Client API wrapper exports
export async function saveSession(sessionData: {
  brain_dump_text: string;
  conversation_history: any[];
  analysis: any;
  session_summary: string;
  classification_explanations: any[];
}): Promise<string | null> {
  if (isDemo()) return "demo-session-id";
  try {
    const token = getSessionToken();
    if (!token) return null;
    return await saveSessionFn({ data: { token, sessionData } });
  } catch (err) {
    console.error("Error saving session to local DB:", err);
    return null;
  }
}

export async function getLatestSession(): Promise<any | null> {
  if (isDemo()) return null;
  try {
    const token = getSessionToken();
    if (!token) return null;
    return await getLatestSessionFn({ data: { token } });
  } catch (err) {
    console.error("Error getting latest session from local DB:", err);
    return null;
  }
}

export async function saveTasks(tasks: any[]): Promise<void> {
  if (isDemo()) return;
  try {
    const token = getSessionToken();
    if (!token) return;
    await saveTasksFn({ data: { token, tasks } });
  } catch (err) {
    console.error("Error saving tasks to local DB:", err);
  }
}

export async function updateTask(id: string, patch: any): Promise<void> {
  if (isDemo()) return;
  try {
    const token = getSessionToken();
    if (!token) return;
    await updateTaskFn({ data: { token, id, patch } });
  } catch (err) {
    console.error("Error updating task in local DB:", err);
  }
}

export async function getUserTasks(options?: { activeOnly?: boolean; date?: string }): Promise<any[]> {
  if (isDemo()) return [];
  try {
    const token = getSessionToken();
    if (!token) return [];
    return await getUserTasksFn({ data: { token, options } });
  } catch (err) {
    console.error("Error getting user tasks from local DB:", err);
    return [];
  }
}

export async function appendLoadHistory(entry: { score: number; risk_level: string }): Promise<void> {
  if (isDemo()) return;
  try {
    const token = getSessionToken();
    if (!token) return;
    await appendLoadHistoryFn({ data: { token, entry } });
  } catch (err) {
    console.error("Error appending load history to local DB:", err);
  }
}

export async function getLoadHistory(limit: number = 30): Promise<any[]> {
  if (isDemo()) return [];
  try {
    const token = getSessionToken();
    if (!token) return [];
    return await getLoadHistoryFn({ data: { token, limit } });
  } catch (err) {
    console.error("Error getting load history from local DB:", err);
    return [];
  }
}

export async function saveReflection(reflection: {
  completed_tasks: string[];
  incomplete_tasks: string[];
  free_text: string;
  summary: string;
  carried_over: string[];
  tomorrow_focus: string;
  encouragement: string;
}): Promise<void> {
  if (isDemo()) return;
  try {
    const token = getSessionToken();
    if (!token) return;
    await saveReflectionFn({ data: { token, reflection } });
  } catch (err) {
    console.error("Error saving reflection to local DB:", err);
  }
}

export async function getReflections(limit: number = 30): Promise<any[]> {
  if (isDemo()) return [];
  try {
    const token = getSessionToken();
    if (!token) return [];
    return await getReflectionsFn({ data: { token, limit } });
  } catch (err) {
    console.error("Error getting reflections from local DB:", err);
    return [];
  }
}

export async function saveGoal(goal: { goal_text: string; timeline?: string; result: any }): Promise<void> {
  if (isDemo()) return;
  try {
    const token = getSessionToken();
    if (!token) return;
    await saveGoalFn({ data: { token, goal } });
  } catch (err) {
    console.error("Error saving goal to local DB:", err);
  }
}

export async function getGoals(): Promise<any[]> {
  if (isDemo()) return [];
  try {
    const token = getSessionToken();
    if (!token) return [];
    return await getGoalsFn({ data: { token } });
  } catch (err) {
    console.error("Error getting goals from local DB:", err);
    return [];
  }
}

export async function saveDecision(decision: { decision_prompt: string; result: any }): Promise<void> {
  if (isDemo()) return;
  try {
    const token = getSessionToken();
    if (!token) return;
    await saveDecisionFn({ data: { token, decision } });
  } catch (err) {
    console.error("Error saving decision to local DB:", err);
  }
}

export async function getDecisions(): Promise<any[]> {
  if (isDemo()) return [];
  try {
    const token = getSessionToken();
    if (!token) return [];
    return await getDecisionsFn({ data: { token } });
  } catch (err) {
    console.error("Error getting decisions from local DB:", err);
    return [];
  }
}

export async function getStreak(): Promise<any | null> {
  if (isDemo()) return null;
  try {
    const token = getSessionToken();
    if (!token) return null;
    return await getStreakFn({ data: { token } });
  } catch (err) {
    console.error("Error getting streak:", err);
    return null;
  }
}

export async function updateStreak(completedTimeStr: string, completedDateStr: string): Promise<any | null> {
  if (isDemo()) return null;
  try {
    const token = getSessionToken();
    if (!token) return null;
    return await updateStreakFn({ data: { token, completedTimeStr, completedDateStr } });
  } catch (err) {
    console.error("Error updating streak:", err);
    return null;
  }
}

export async function saveCommitment(commitment: string): Promise<any | null> {
  if (isDemo()) return null;
  try {
    const token = getSessionToken();
    if (!token) return null;
    return await saveCommitmentFn({ data: { token, commitment } });
  } catch (err) {
    console.error("Error saving commitment:", err);
    return null;
  }
}

export async function getActiveCommitment(): Promise<any | null> {
  if (isDemo()) return null;
  try {
    const token = getSessionToken();
    if (!token) return null;
    return await getActiveCommitmentFn({ data: { token } });
  } catch (err) {
    console.error("Error getting active commitment:", err);
    return null;
  }
}

export async function fulfillCommitment(commitmentId: string): Promise<void> {
  if (isDemo()) return;
  try {
    const token = getSessionToken();
    if (!token) return;
    await fulfillCommitmentFn({ data: { token, commitmentId } });
  } catch (err) {
    console.error("Error fulfilling commitment:", err);
  }
}

export async function detectProcrastinationTriggers(newTaskTitles: string[]): Promise<any[]> {
  if (isDemo()) return [];
  try {
    const token = getSessionToken();
    if (!token) return [];
    return await detectProcrastinationTriggersFn({ data: { token, newTaskTitles } });
  } catch (err) {
    console.error("Error detecting procrastination triggers:", err);
    return [];
  }
}
