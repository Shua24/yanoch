// Instant, round-trip-free feedback for the drag-to-split gesture.
//
// The side drop zones must light up the moment the pointer is over them. Routing that through
// Blazor costs a SignalR round trip per dragover event, which is both laggy and (observed) does
// not land reliably during a drag. So the HIGHLIGHT is done here, in the browser, with plain DOM
// classes. The DECISION about what to do on drop stays in Blazor, which already receives the
// drop with the side and the target id.
//
// The zones are plain elements rendered by BlockRow.razor; this module only adds and removes the
// `yanoch-split-active` class on them.

const ACTIVE_CLASS = "yanoch-split-active";
const ZONE_SELECTOR = ".yanoch-split-zone";

function clearActiveZones() {
  for (const zone of document.querySelectorAll(`${ZONE_SELECTOR}.${ACTIVE_CLASS}`)) {
    zone.classList.remove(ACTIVE_CLASS);
  }
}

function markZone(zone) {
  clearActiveZones();
  if (zone) {
    zone.classList.add(ACTIVE_CLASS);
  }
}

// Wires the delegated listeners once. Uses capture-phase delegation on the document so the
// handlers survive Blazor re-renders: the zone elements are created and destroyed as the drag
// state changes, and per-element listeners would be lost with them.
let isArmed = false;

export function armSplitZones() {
  if (isArmed) {
    return;
  }
  isArmed = true;

  document.addEventListener(
    "dragover",
    (event) => {
      const zone = event.target && event.target.closest ? event.target.closest(ZONE_SELECTOR) : null;
      markZone(zone);
    },
    true
  );

  document.addEventListener(
    "dragleave",
    (event) => {
      const zone = event.target && event.target.closest ? event.target.closest(ZONE_SELECTOR) : null;
      if (zone) {
        zone.classList.remove(ACTIVE_CLASS);
      }
    },
    true
  );

  // A drag that ends anywhere (drop, cancel, escape) must not leave a zone stuck lit, nor the
  // shell class stuck on.
  document.addEventListener("dragend", () => { clearActiveZones(); clearDraggingClass(); }, true);
  document.addEventListener("drop", () => { clearActiveZones(); clearDraggingClass(); }, true);
}

// Toggles the shell class that reveals every row's split bars while a drag is in flight. The
// per-bar highlight is pure CSS/JS; this only says "a drag is happening at all".
const SHELL_SELECTOR = ".yanoch-editor-shell";
const DRAGGING_CLASS = "yanoch-is-dragging";

export function setDraggingClass(isDragging) {
  const shell = document.querySelector(SHELL_SELECTOR);
  if (!shell) {
    return;
  }
  if (isDragging) {
    shell.classList.add(DRAGGING_CLASS);
  } else {
    shell.classList.remove(DRAGGING_CLASS);
  }
}

// The Blazor side also clears this class, but its call is async and races with the drop
// handler's database work: a late "true" can land after the "false" and leave the bars stuck
// visible. Clearing it here, synchronously with the event, makes the end of a drag reliable.
function clearDraggingClass() {
  const shell = document.querySelector(SHELL_SELECTOR);
  if (shell) {
    shell.classList.remove(DRAGGING_CLASS);
  }
}

export function clearSplitZones() {
  clearActiveZones();
  clearDraggingClass();
}
