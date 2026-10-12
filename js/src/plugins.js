import { keymap } from "prosemirror-keymap";
import { history, redo, undo } from "prosemirror-history";
import { baseKeymap } from "prosemirror-commands";
import { inputRules, smartQuotes, emDash, ellipsis } from "prosemirror-inputrules";
import { toggleMark } from "prosemirror-commands";
import { schema } from "./schema.js";
import { createHighlightPlugin } from "./highlight.js";
import { buildMarkdownShorthandRules } from "./markdowninput.js";

// Builds the ProseMirror plugin list for one block editor: undo history, the inline mark
// shortcuts, the base keymap, smart typography input rules, the markdown block shorthand and code
// highlighting.

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
  // The block shorthand is listed AFTER the typography rules, and that order is LOAD BEARING, not
  // cosmetic. Typing the divider is the proof: the em dash rule rewrites the second hyphen the
  // moment it is typed, so by the third keystroke the text standing before the caret is an em dash
  // followed by a hyphen. The divider pattern therefore accepts that form as well as three plain
  // hyphens, and it only works because the typography rules are tried first.
  const inputRulePlugin = inputRules({
    rules: [...smartQuotes, emDash, ellipsis, ...buildMarkdownShorthandRules()],
  });
  const highlightPlugin = createHighlightPlugin();
  return [keymapPlugin, historyPlugin, inputRulePlugin, highlightPlugin];
}
