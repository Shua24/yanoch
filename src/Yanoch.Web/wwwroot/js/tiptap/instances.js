// Per-instance state — shared across all editor modules.
// Each entry: { dotNetRef, blockId, editor, tableMenuEl, listeners, _dirty, _pendingMarkdown, _lastSubpageOrder, firstUpdate }
export const instances = new Map()
