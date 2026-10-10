import { Schema } from "prosemirror-model";

// The ProseMirror schema mirrors the block kinds the C# side stores. One block editor instance
// holds exactly one top level block node, which keeps block level operations (type changes,
// indent, reorder, merge) on the Blazor side where the block list lives.

export const schema = new Schema({
  nodes: {
    doc: { content: "block" },

    paragraph: {
      group: "block",
      content: "inline*",
      parseDOM: [{ tag: "p" }],
      toDOM() {
        return ["p", 0];
      },
    },

    heading: {
      group: "block",
      content: "inline*",
      attrs: { level: { default: 1 } },
      defining: true,
      parseDOM: [
        { tag: "h1", attrs: { level: 1 } },
        { tag: "h2", attrs: { level: 2 } },
        { tag: "h3", attrs: { level: 3 } },
      ],
      toDOM(node) {
        return ["h" + node.attrs.level, 0];
      },
    },

    bulleted_list_item: {
      group: "block",
      content: "inline*",
      parseDOM: [{ tag: "li[data-list=bullet]" }],
      toDOM() {
        return ["li", { "data-list": "bullet" }, 0];
      },
    },

    ordered_list_item: {
      group: "block",
      content: "inline*",
      parseDOM: [{ tag: "li[data-list=ordered]" }],
      toDOM() {
        return ["li", { "data-list": "ordered" }, 0];
      },
    },

    todo_item: {
      group: "block",
      content: "inline*",
      attrs: { checked: { default: false } },
      parseDOM: [{ tag: "li[data-list=todo]" }],
      toDOM(node) {
        return ["li", { "data-list": "todo", "data-checked": String(node.attrs.checked) }, 0];
      },
    },

    blockquote: {
      group: "block",
      content: "inline*",
      parseDOM: [{ tag: "blockquote" }],
      toDOM() {
        return ["blockquote", 0];
      },
    },

    code_block: {
      group: "block",
      content: "text*",
      marks: "",
      attrs: { language: { default: "" } },
      code: true,
      defining: true,
      parseDOM: [{ tag: "pre", preserveWhitespace: "full" }],
      toDOM(node) {
        return ["pre", { "data-language": node.attrs.language }, ["code", 0]];
      },
    },

    horizontal_rule: {
      group: "block",
      parseDOM: [{ tag: "hr" }],
      toDOM() {
        return ["hr"];
      },
    },

    hard_break: {
      group: "inline",
      inline: true,
      selectable: false,
      parseDOM: [{ tag: "br" }],
      toDOM() {
        return ["br"];
      },
    },

    text: { group: "inline" },
  },

  marks: {
    strong: {
      parseDOM: [{ tag: "strong" }, { tag: "b" }],
      toDOM() {
        return ["strong", 0];
      },
    },
    em: {
      parseDOM: [{ tag: "em" }, { tag: "i" }],
      toDOM() {
        return ["em", 0];
      },
    },
    code: {
      parseDOM: [{ tag: "code" }],
      toDOM() {
        return ["code", 0];
      },
    },
    strike: {
      parseDOM: [{ tag: "s" }, { tag: "del" }],
      toDOM() {
        return ["s", 0];
      },
    },
    link: {
      attrs: { href: { default: "" } },
      inclusive: false,
      parseDOM: [{ tag: "a[href]", getAttrs: (dom) => ({ href: dom.getAttribute("href") }) }],
      toDOM(mark) {
        return ["a", { href: mark.attrs.href, rel: "noopener noreferrer", target: "_blank" }, 0];
      },
    },
  },
});

// Maps the C# BlockType enum name to the ProseMirror node name used inside a block editor.
export const blockTypeToNodeName = {
  Paragraph: "paragraph",
  Heading1: "heading",
  Heading2: "heading",
  Heading3: "heading",
  BulletedListItem: "bulleted_list_item",
  NumberedListItem: "ordered_list_item",
  ToDo: "todo_item",
  Quote: "blockquote",
  Code: "code_block",
  Divider: "horizontal_rule",
};

export function headingLevelFromBlockType(blockType) {
  if (blockType === "Heading1") {
    return 1;
  }
  if (blockType === "Heading2") {
    return 2;
  }
  if (blockType === "Heading3") {
    return 3;
  }
  return 1;
}
