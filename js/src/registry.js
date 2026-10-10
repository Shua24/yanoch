import { schema } from "./schema.js";

// The live block editors of this page, keyed by editor id, plus the debounce timers that batch
// a burst of typing into one change notification. Every other module reads the registry through
// getEntry so there is exactly one Map.

export const registry = new Map();

const changeTimers = new Map();

export function getEntry(id) {
  return registry.get(id);
}

export function buildDocumentFromContent(contentJson) {
  if (!contentJson) {
    return schema.node("doc", null, [schema.node("paragraph")]);
  }
  let parsed;
  try {
    parsed = JSON.parse(contentJson);
  } catch (error) {
    return schema.node("doc", null, [schema.node("paragraph")]);
  }
  try {
    return schema.nodeFromJSON(parsed);
  } catch (error) {
    return schema.node("doc", null, [schema.node("paragraph")]);
  }
}

export function notifyChange(id, view) {
  const entry = registry.get(id);
  if (!entry) {
    return;
  }
  const json = JSON.stringify(view.state.doc.toJSON());
  entry.dotnet.invokeMethodAsync("OnEditorChanged", json);
}

export function scheduleChangeNotify(id, view) {
  const existingTimer = changeTimers.get(id);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }
  const timer = setTimeout(() => {
    changeTimers.delete(id);
    notifyChange(id, view);
  }, 300);
  changeTimers.set(id, timer);
}

export function clearChangeTimer(id) {
  const existingTimer = changeTimers.get(id);
  if (existingTimer) {
    clearTimeout(existingTimer);
    changeTimers.delete(id);
  }
}
