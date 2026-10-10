import { keymap } from "prosemirror-keymap";
import { history, redo, undo } from "prosemirror-history";
import { baseKeymap } from "prosemirror-commands";
import { inputRules, smartQuotes, emDash, ellipsis } from "prosemirror-inputrules";
import { toggleMark } from "prosemirror-commands";
import { schema } from "./schema.js";
import { createHighlightPlugin } from "./highlight.js";

// Builds the ProseMirror plugin list for one block editor: undo history, the inline mark
// shortcuts, the base keymap, smart typography input rules and code highlighting.

function buildMarkKeymap() {
  return {
    "Mod-b": toggleMark(schema.marks.strong),
    "Mod-i": toggleMark(schema.marks.em),
    "Mod-`": toggleMark(schema.marks.code),
    "Mod-Shift-s": toggleMark(schema.marks.strike),
    "Mod-z": undo,
    "Mod-y": redo,
    "Mod-Shift-z": redo,
  };
}

export function createPlugins() {
  const markKeymap = buildMarkKeymap();
  const keymapPlugin = keymap({ ...markKeymap, ...baseKeymap });
  const historyPlugin = history();
  const inputRulePlugin = inputRules({ rules: [...smartQuotes, emDash, ellipsis] });
  const highlightPlugin = createHighlightPlugin();
  return [keymapPlugin, historyPlugin, inputRulePlugin, highlightPlugin];
}
