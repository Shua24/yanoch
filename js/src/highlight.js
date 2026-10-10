import hljs from "highlight.js/lib/common";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

// GitHub style highlighting for code blocks. The language attribute on the code_block node
// selects the grammar; an unknown or empty language falls back to auto detection. The
// highlight.js HTML is parsed with the browser DOM parser so token offsets are exact even when
// spans nest.

export const highlightPluginKey = new PluginKey("yanoch-highlight");

const parser = new DOMParser();

function collectTokenRanges(html) {
  const ranges = [];
  if (html.length === 0) {
    return ranges;
  }
  const documentFragment = parser.parseFromString(`<pre>${html}</pre>`, "text/html");
  const root = documentFragment.querySelector("pre");
  if (root === null) {
    return ranges;
  }

  let offset = 0;
  const walker = documentFragment.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let textNode = walker.nextNode();
  while (textNode !== null) {
    const text = textNode.textContent ?? "";
    const classNames = collectClassNames(textNode.parentElement);
    if (text.length > 0 && classNames.length > 0) {
      ranges.push({ from: offset, to: offset + text.length, className: classNames.join(" ") });
    }
    offset += text.length;
    textNode = walker.nextNode();
  }
  return ranges;
}

function collectClassNames(element) {
  const classNames = [];
  let current = element;
  while (current !== null && current.tagName !== "PRE") {
    if (current.classList && current.classList.length > 0) {
      for (const name of current.classList) {
        classNames.push(name);
      }
    }
    current = current.parentElement;
  }
  return classNames;
}

function highlightCodeBlock(node, position, decorations) {
  const language = node.attrs.language;
  const text = node.textContent;
  if (text.length === 0) {
    return;
  }

  let result;
  if (language && hljs.getLanguage(language)) {
    result = hljs.highlight(text, { language, ignoreIllegals: true });
  } else {
    result = hljs.highlightAuto(text);
  }

  const tokenRanges = collectTokenRanges(result.value);
  const contentStart = position + 1;
  for (const range of tokenRanges) {
    decorations.push(
      Decoration.inline(contentStart + range.from, contentStart + range.to, { class: range.className })
    );
  }
}

function buildDecorations(doc) {
  const decorations = [];
  doc.descendants((node, position) => {
    if (node.type.name === "code_block") {
      highlightCodeBlock(node, position, decorations);
      return false;
    }
    return true;
  });
  return DecorationSet.create(doc, decorations);
}

export function createHighlightPlugin() {
  return new Plugin({
    key: highlightPluginKey,
    state: {
      init(_configuration, state) {
        return buildDecorations(state.doc);
      },
      apply(transaction, decorationSet, _oldState, newState) {
        if (transaction.docChanged) {
          return buildDecorations(newState.doc);
        }
        return decorationSet.map(transaction.mapping, transaction.doc);
      },
    },
    props: {
      decorations(state) {
        return highlightPluginKey.getState(state);
      },
    },
  });
}
