// ─── Main Tiptap Editor Entry Point ─────────────────────────────
// This file imports all modular components and exports the public API

import './tiptap/tiptap-editor.js'

// Re-export the public API for window globals
export { 
  createEditor as initTipTap,
  destroyEditor as destroyTipTap,
  getMarkdown as getTipTapMarkdown,
  setContent as setTipTapContent,
  setEditable as setTipTapEditable,
  focusEditor as focusTipTap,
  blurEditor as blurTipTap
} from './tiptap/tiptap-editor.js'