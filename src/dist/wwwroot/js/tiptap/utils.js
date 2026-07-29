import { instances } from './instances.js'

// Update any block node attribute from a DOM element
export function updateBlockAttr(editor, el, nodeName, attr, value) {
  const { state, view } = editor
  const pos = view.posAtDOM(el, 0)
  if (pos == null) return
  const $pos = state.doc.resolve(pos)
  let depth = $pos.depth
  while (depth >= 0 && $pos.node(depth).type.name !== nodeName) depth--
  if (depth < 0) return
  const node = $pos.node(depth)
  view.dispatch(state.tr.setNodeMarkup($pos.before(depth), null, { ...node.attrs, [attr]: value }).scrollIntoView())
}

// Update a callout node attribute from a mounted DOM element
export function updateCalloutAttr(editor, calloutEl, attr, value) {
  updateBlockAttr(editor, calloutEl, 'callout', attr, value)
}

// Find which editor instance owns a given DOM element
export function findEditorForElement(el) {
  return Array.from(instances.values()).find(i => i.editor?.view?.dom?.contains(el))?.editor || null
}

// Safe Blazor invoke — swallows errors when the circuit is gone
export function invokeCb(dotNetRef, method, ...args) {
  if (!dotNetRef) return
  try {
    dotNetRef.invokeMethodAsync(method, ...args).catch(() => { /* circuit gone */ })
  } catch {
    /* noop */
  }
}
