import { EditorState, TextSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "./schema.js";
import { createPlugins } from "./plugins.js";
import { currentBlockNode, isCaretAtStart } from "./blocks.js";
import { handleKeyDown } from "./keyboard.js";
import { armSplitZones, setDraggingClass } from "./splitzones.js";
import {
  buildDocumentFromContent,
  clearChangeTimer,
  getEntry,
  notifyChange,
  registry,
  scheduleChangeNotify,
} from "./registry.js";

// One EditorView instance per block. The dotnet reference is the Blazor component that owns
// this block; the editor calls back into it for block level behaviour (enter, backspace, slash,
// arrow navigation) and pushes its document JSON on every change. The registry, the key handler
// and the split helpers live in their own modules to keep each file small.

// Arming the split-zone highlight once at module load is enough: it uses document-level
// delegation, so it survives the zones being re-rendered by Blazor.
armSplitZones();

export function create(id, element, contentJson, dotnetReference, options) {
  const existingEntry = registry.get(id);
  if (existingEntry) {
    // Re-creating an id that is already mounted would leak the old view and orphan its DOM.
    existingEntry.view.destroy();
    registry.delete(id);
  }

  // Clear the mount point: Blazor may hand us an element that no longer holds the old view.
  if (element && element.replaceChildren) {
    element.replaceChildren();
  }

  const document = buildDocumentFromContent(contentJson);
  const plugins = createPlugins();
  const state = EditorState.create({ doc: document, plugins });

  const view = new EditorView(element, {
    state,
    attributes: {
      class: "yanoch-block-editor",
      spellcheck: "true",
    },
    handleDOMEvents: {
      focus() {
        dotnetReference.invokeMethodAsync("OnEditorFocused");
        return false;
      },
    },
    handleKeyDown(viewInstance, event) {
      return handleKeyDown(id, viewInstance, event, dotnetReference);
    },
    dispatchTransaction(transaction) {
      const newState = view.state.apply(transaction);
      view.updateState(newState);
      if (transaction.docChanged) {
        scheduleChangeNotify(id, view);
      }
    },
  });

  const entry = { view, dotnet: dotnetReference, options: options || {} };
  registry.set(id, entry);

  if (options && options.autoFocus) {
    view.focus();
  }

  return {
    focus() {
      view.focus();
    },
  };
}

export function setContent(id, contentJson) {
  const entry = getEntry(id);
  if (!entry) {
    return;
  }
  const document = buildDocumentFromContent(contentJson);
  const transaction = entry.view.state.tr.replaceWith(0, entry.view.state.doc.content.size, document.content);
  entry.view.dispatch(transaction);
}

export function isMounted(id) {
  const entry = getEntry(id);
  if (!entry) {
    return false;
  }
  // An entry can survive a Blazor re-render whose diff discarded the editor's DOM, so the entry
  // only means "mounted" if its own nodes are still live in the document.
  const viewDom = entry.view.dom;
  return Boolean(viewDom && viewDom.isConnected && document.body.contains(viewDom));
}

// True when the block holds no text, which makes Enter an outdent or a type reset.
export function isEmptyBlock(id) {
  const entry = getEntry(id);
  if (!entry) {
    return true;
  }
  return entry.view.state.doc.textContent.length === 0;
}

// True when the caret sits at the very start of the block, which makes Backspace merge with the
// block above.
export function isCaretAtBlockStart(id) {
  const entry = getEntry(id);
  if (!entry) {
    return false;
  }
  return isCaretAtStart(entry.view.state);
}

export function getContent(id) {
  const entry = getEntry(id);
  if (!entry) {
    return "";
  }
  return JSON.stringify(entry.view.state.doc.toJSON());
}

export function getPlainText(id) {
  const entry = getEntry(id);
  if (!entry) {
    return "";
  }
  return entry.view.state.doc.textContent;
}

export function focus(id) {
  const entry = getEntry(id);
  if (!entry) {
    return;
  }
  entry.view.focus();
}

export function placeCaretAtStart(id) {
  const entry = getEntry(id);
  if (!entry) {
    return;
  }
  const position = 1;
  const selection = TextSelection.create(entry.view.state.doc, position);
  const transaction = entry.view.state.tr.setSelection(selection);
  entry.view.dispatch(transaction);
  entry.view.focus();
}

export function placeCaretAtEnd(id) {
  const entry = getEntry(id);
  if (!entry) {
    return;
  }
  const position = Math.max(1, entry.view.state.doc.content.size - 1);
  const selection = TextSelection.create(entry.view.state.doc, position);
  const transaction = entry.view.state.tr.setSelection(selection);
  entry.view.dispatch(transaction);
  entry.view.focus();
}

export function replaceBlockType(id, nodeName, attributes) {
  const entry = getEntry(id);
  if (!entry) {
    return;
  }
  const state = entry.view.state;
  const block = currentBlockNode(state);
  if (!block) {
    return;
  }
  let newNode;
  if (nodeName === "horizontal_rule") {
    newNode = schema.node(nodeName, attributes || null);
  } else {
    newNode = schema.node(nodeName, attributes || null, block.content);
  }
  const transaction = state.tr.replaceWith(0, state.doc.content.size, newNode);
  entry.view.dispatch(transaction);
  notifyChange(id, entry.view);
}

export function clearContent(id) {
  const entry = getEntry(id);
  if (!entry) {
    return;
  }
  const paragraph = schema.node("paragraph");
  const transaction = entry.view.state.tr.replaceWith(0, entry.view.state.doc.content.size, paragraph);
  entry.view.dispatch(transaction);
  notifyChange(id, entry.view);
}

export function destroy(id) {
  const entry = getEntry(id);
  if (!entry) {
    return;
  }
  clearChangeTimer(id);
  entry.view.destroy();
  registry.delete(id);
}

export function setReadOnly(id, isReadOnly) {
  const entry = getEntry(id);
  if (!entry) {
    return;
  }
  entry.view.setProps({ editable: () => !isReadOnly });
}

// Re-exported so Blazor can call it through the module. Importing alone would let esbuild
// tree-shake it away, since nothing inside the JS graph uses it.
export { setDraggingClass };
