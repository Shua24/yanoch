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

// Set on the transaction that converts a block into an image, so the host knows to add the empty
// block the caret moves into. An image is a leaf, exactly like a divider: it cannot hold text.
export const imageShortcutMeta = "yanochImageShortcut";

// Undoes the typography input rules' substitutions inside a URL.
//
// The em-dash, ellipsis and smart-quote rules run BEFORE the markdown shorthand rules, so by the
// time a typed URL reaches the image rule its text may already be rewritten: "--" has become an em
// dash, "..." an ellipsis, and a straight quote a curly one. This is the same problem the divider
// rule solves by accepting both "---" and "—-", but a URL cannot enumerate its variants, so the
// text is normalised back instead.
//
// This is a deliberate DIVERGENCE from Notion, which has no typed image rule at all: its
// markdown-on-typing table holds 11 block shortcuts and none is an image, so it never has to
// normalise a URL. Recovered from its decoded bundle: the shortcut table at @2859497, and the
// em-dash rule {regex:/--$/,replace:"—"} at @2862456.
function normaliseUrlText(text) {
  return text
    .replace(/\u2014/g, "--")
    .replace(/\u2026/g, "...")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"');
}

// Typed markdown image reference: `![alt](url)` as the ENTIRE text of a block converts it into an
// image block, the same convention every other shortcut follows.
//
// The alt text becomes the CAPTION. Notion keeps caption and alt_text as separate stores, but this
// app has one field, and the import path already writes the alt text into the caption, so the two
// ways of getting an image in agree on where the text lands.
function buildImageRule() {
  const rule = new InputRule(/^!\[([^\]]*)\]\(([^)]+)\)$/, (state, match, start, end) => {
    const currentBlock = state.doc.firstChild;
    if (!currentBlock || currentBlock.type.name === "image") {
      return null;
    }

    const altText = match[1] || "";
    const source = normaliseUrlText(match[2] || "");
    if (!source) {
      return null;
    }

    // The alt text fills BOTH alt and caption, matching what the markdown IMPORT path does
    // (MarkdownInlineReader calls CreateImage(source, altText, altText)). Keeping the two entry
    // points identical matters more than matching Notion here: Notion keeps caption and alt_text as
    // separate stores, but this app has one visible field, and an image that arrives by import and
    // one that arrives by typing should not end up with different attributes. alt also carries the
    // screen-reader text, so leaving it empty would quietly degrade accessibility.
    const image = schema.nodes.image.create({ src: source, alt: altText, caption: altText });
    const transaction = state.tr.replaceWith(0, state.doc.content.size, image);
    transaction.setMeta(imageShortcutMeta, true);
    return transaction;
  });
  return rule;
}


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
    // The typed image reference, registered LAST so it is tried after the block-type shortcuts.
    // That order matters: no other pattern can match a string starting with "![", so there is no
    // conflict, but keeping it last means a future rule can be slotted in without renumbering.
    buildImageRule(),
  ];
}
