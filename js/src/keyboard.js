import { schema } from "./schema.js";
import {
  currentBlockTypeName,
  isCaretAtEnd,
  isCaretAtStart,
  splitBlockAtCaret,
} from "./blocks.js";

// The key handling for one block editor. Keys that cross block boundaries (Enter, Backspace at
// the start, arrows at the edges, Tab) are handed to the Blazor side, which owns the block list;
// keys that stay inside the block (typing, marks, Shift+Enter) are handled here.

export function handleKeyDown(id, view, event, dotnetReference) {
  const state = view.state;

  if (event.key === "/" && state.doc.textContent.length === 0) {
    event.preventDefault();
    dotnetReference.invokeMethodAsync("OnSlashPressed");
    return true;
  }

  if (event.key === "Enter") {
    if (currentBlockTypeName(state) === "code_block") {
      // Inside a code block Enter is a newline, which the base keymap already inserts.
      return false;
    }
    event.preventDefault();

    if (event.shiftKey) {
      // Soft break: a hard_break inline node inside the same block. Letting this fall through
      // to the base keymap would split the document into two top level nodes, which the one
      // block per editor model cannot represent.
      const softBreakTransaction = state.tr.replaceSelectionWith(schema.nodes.hard_break.create());
      view.dispatch(softBreakTransaction);
      return true;
    }

    const split = splitBlockAtCaret(state);
    if (!split) {
      // Nothing to divide (a divider, for example); add an empty block after this one.
      dotnetReference.invokeMethodAsync("OnEnterPressed");
      return true;
    }

    // Apply the split to this editor's own document before telling Blazor. Blazor persists the
    // two halves and mounts the new block, but the debounced change notification would otherwise
    // re-send this block's ORIGINAL text and overwrite the left half on the server.
    view.dispatch(state.tr.replaceWith(0, state.doc.content.size, split.beforeNode));

    dotnetReference.invokeMethodAsync(
      "OnSplitRequested",
      split.beforeJson,
      split.afterJson,
      split.isAtStart,
      split.isEmpty
    );
    return true;
  }

  if (event.key === "Backspace" && isCaretAtStart(state)) {
    event.preventDefault();
    dotnetReference.invokeMethodAsync("OnBackspaceAtStart");
    return true;
  }

  if (event.key === "ArrowUp" && isCaretAtStart(state)) {
    event.preventDefault();
    dotnetReference.invokeMethodAsync("OnArrowUp");
    return true;
  }

  if (event.key === "ArrowDown" && isCaretAtEnd(state)) {
    event.preventDefault();
    dotnetReference.invokeMethodAsync("OnArrowDown");
    return true;
  }

  if (event.key === "Tab") {
    event.preventDefault();
    dotnetReference.invokeMethodAsync("OnIndentOutdent", !event.shiftKey);
    return true;
  }

  return false;
}
