import { schema } from "./schema.js";

// Pure helpers over one block editor's state. Each block editor holds exactly one top level
// block node, so "the current block" is always the document's first child.

export function currentBlockNode(state) {
  return state.doc.firstChild;
}

export function currentBlockTypeName(state) {
  const block = currentBlockNode(state);
  return block ? block.type.name : "paragraph";
}

export function isCaretAtStart(state) {
  const selection = state.selection;
  if (!selection.empty) {
    return false;
  }
  return selection.from <= 1;
}

export function isCaretAtEnd(state) {
  const selection = state.selection;
  if (!selection.empty) {
    return false;
  }
  return selection.to >= state.doc.content.size - 1;
}

// Splits the single block at the caret and returns the two documents the host app has to
// persist. Inline marks are carried by the fragments, so a split inside a bolded run keeps the
// bold on both halves; the node's attrs (heading level, todo checked, code language) are
// re-applied to both halves.
//
// Returns null when the block cannot be split (a divider has no text to divide), which tells
// the caller to fall back to appending an empty block instead.
export function splitBlockAtCaret(state) {
  const block = currentBlockNode(state);
  if (!block || !block.isTextblock) {
    return null;
  }

  const selection = state.selection;
  const contentSize = block.content.size;
  // Content positions start at 1 inside a textblock, so the text offset is (position - 1).
  const fromOffset = Math.max(0, Math.min(contentSize, selection.from - 1));
  const toOffset = Math.max(fromOffset, Math.min(contentSize, selection.to - 1));

  const beforeNode = block.type.create(block.attrs, block.content.cut(0, fromOffset));
  const afterNode = block.type.create(block.attrs, block.content.cut(toOffset));

  return {
    beforeNode,
    afterNode,
    beforeJson: JSON.stringify(schema.node("doc", null, [beforeNode]).toJSON()),
    afterJson: JSON.stringify(schema.node("doc", null, [afterNode]).toJSON()),
    isAtStart: fromOffset === 0 && toOffset === 0,
    isEmpty: contentSize === 0,
  };
}
