import { InputRule } from "prosemirror-inputrules";
import { schema } from "./schema.js";

// Notion's markdown shorthand: the shortcuts that convert a block's TYPE while it is being typed.
// The table below is Notion's own, recovered from its on-disk web-app cache (the
// notion-desktop-recon skill covers how that is done). Three behaviours in it are load bearing and
// are easy to get wrong when re-implementing:
//
//   1. A shortcut fires only when it is the ENTIRE text of the block. Typing "#" then a space
//      converts, but "## heading" never does; the space is what commits it. Every pattern is
//      therefore anchored at both ends.
//   2. The divider is the one shortcut that has to keep typing possible. Notion converts the block
//      and leaves a fresh text block below the rule. One editor here holds exactly one block, so
//      the host has to create that extra block; the transaction carries a meta flag that the
//      editor module forwards as the OnDividerShortcut callback.
//   3. A committing space is matched as EITHER a normal space or a non-breaking space. A browser
//      may hand the editor a non-breaking space where the user typed a space (Chrome's DOM
//      insertion does this), and the editor reads typed text back out of the DOM, so matching only
//      U+0020 would silently drop every space-terminated shortcut. Notion's own patterns accept
//      whole families of variants for the same reason.
//
// Notion also converts "1. " / "a. " / "i. " into a numbered list and renumbers its siblings.
// Renumbering is meaningless here because each list item is its own block with no list wrapper,
// so only the plain numeric markers are honoured.

export const dividerShortcutMeta = "yanochDividerShortcut";

function buildTextblockTypeRule(regularExpression, nodeType, attributes) {
  const rule = new InputRule(regularExpression, (state, match, start, end) => {
    const resolvedStart = state.doc.resolve(start);
    const canReplace = resolvedStart
      .node(-1)
      .canReplaceWith(resolvedStart.index(-1), resolvedStart.indexAfter(-1), nodeType);
    if (!canReplace) {
      return null;
    }
    const transaction = state.tr.delete(start, end);
    transaction.setBlockType(start, start, nodeType, attributes || null);
    return transaction;
  });
  return rule;
}

// The divider consumes its own text and becomes a leaf node. The host inserts the text block that
// follows it, so the caret is never stranded on a node that cannot hold text.
//
// The pattern accepts BOTH "---" and "—-" on purpose. Typing two hyphens is turned into an em dash
// by the em-dash input rule before a third hyphen can be typed, so the sequence a user actually
// produces is hyphen, em dash, hyphen: the text standing before the caret is "—-", not "---".
// Notion's own divider pattern carries the same alternative for the same reason.
function buildDividerRule() {
  const rule = new InputRule(/^(---|\u2014-)$/, (state, match, start, end) => {
    const currentBlock = state.doc.firstChild;
    if (!currentBlock || currentBlock.type.name === "horizontal_rule") {
      return null;
    }
    const divider = schema.nodes.horizontal_rule.create();
    const transaction = state.tr.replaceWith(0, state.doc.content.size, divider);
    transaction.setMeta(dividerShortcutMeta, true);
    return transaction;
  });
  return rule;
}

export function buildMarkdownShorthandRules() {
  return [
    // To-do. "[x] " arrives already checked, which is what Notion's own rule does.
    buildTextblockTypeRule(/^\[x\][ \u00a0]$/, schema.nodes.todo_item, { checked: true }),
    buildTextblockTypeRule(/^\[X\][ \u00a0]$/, schema.nodes.todo_item, { checked: true }),
    buildTextblockTypeRule(/^\[\][ \u00a0]$/, schema.nodes.todo_item, { checked: false }),
    buildTextblockTypeRule(/^\[ \][ \u00a0]$/, schema.nodes.todo_item, { checked: false }),

    // Headings. Longest first so the three-hash rule is never shadowed by the one-hash rule.
    buildTextblockTypeRule(/^###[ \u00a0]$/, schema.nodes.heading, { level: 3 }),
    buildTextblockTypeRule(/^##[ \u00a0]$/, schema.nodes.heading, { level: 2 }),
    buildTextblockTypeRule(/^#[ \u00a0]$/, schema.nodes.heading, { level: 1 }),

    // Quote. Notion accepts the pipe and all three double-quote spellings; "> " is its toggle,
    // which has no equivalent node here, so it maps to the quote instead of doing nothing.
    buildTextblockTypeRule(/^>[ \u00a0]$/, schema.nodes.blockquote, null),
    buildTextblockTypeRule(/^\|[ \u00a0]$/, schema.nodes.blockquote, null),
    buildTextblockTypeRule(/^"[ \u00a0]$/, schema.nodes.blockquote, null),
    buildTextblockTypeRule(/^\u201c[ \u00a0]$/, schema.nodes.blockquote, null),
    buildTextblockTypeRule(/^\u201d[ \u00a0]$/, schema.nodes.blockquote, null),

    // Bulleted list.
    buildTextblockTypeRule(/^\*[ \u00a0]$/, schema.nodes.bulleted_list_item, null),
    buildTextblockTypeRule(/^-[ \u00a0]$/, schema.nodes.bulleted_list_item, null),
    buildTextblockTypeRule(/^\+[ \u00a0]$/, schema.nodes.bulleted_list_item, null),

    // Numbered list.
    buildTextblockTypeRule(/^\d+\.[ \u00a0]$/, schema.nodes.ordered_list_item, null),
    buildTextblockTypeRule(/^\d+\)[ \u00a0]$/, schema.nodes.ordered_list_item, null),

    // Code block. A fence is the whole shortcut, so there is no trailing space to type.
    buildTextblockTypeRule(/^```$/, schema.nodes.code_block, { language: "" }),

    buildDividerRule(),
  ];
}
