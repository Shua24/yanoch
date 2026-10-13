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

    // An image is a LEAF block with no text content, so it models exactly like horizontal_rule.
    // The caption is an attribute rather than a child block, which keeps the one-node-per-block
    // invariant: a block editor still holds exactly one top-level node.
    //
    // The source URL is rendered through an <img> and the caption below it. A failed load must be
    // VISIBLE (a bordered box naming the URL), never a silently broken image, so the error state is
    // part of the node view rather than left to the browser.
    image: {
      group: "block",
      draggable: true,
      attrs: {
        src: { default: "" },
        alt: { default: "" },
        caption: { default: "" },
      },
      parseDOM: [
        {
          tag: "figure[data-image]",
          getAttrs(dom) {
            return {
              src: dom.getAttribute("data-src") || "",
              alt: dom.getAttribute("data-alt") || "",
              caption: dom.getAttribute("data-caption") || "",
            };
          },
        },
      ],
      toDOM(node) {
        const { src, alt, caption } = node.attrs;
        const children = [["img", { src, alt, class: "yanoch-image" }]];
        if (caption) {
          children.push(["figcaption", { class: "yanoch-image-caption" }, caption]);
        }
        return [
          "figure",
          {
            "data-image": "true",
            "data-src": src,
            "data-alt": alt,
            "data-caption": caption,
            class: "yanoch-image-block",
          },
          ...children,
        ];
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

    // A toggle is a TEXT block that also owns child blocks. The open/closed state is NOT an
    // attribute: Notion keeps it client-side (a keyed store plus a per-user preference), so storing
    // it in the document would make it travel with the content instead of with the viewer.
    //
    // The disclosure control is rendered by the host (BlockRow), not by this node, because the
    // children are separate blocks in the block list rather than nodes inside this editor.
    toggle: {
      group: "block",
      content: "inline*",
      parseDOM: [{ tag: "div[data-toggle]" }],
      toDOM() {
        return ["div", { "data-toggle": "true", class: "yanoch-toggle-text" }, 0];
      },
    },

    // A callout is a TEXT block carrying an icon and a colour, modelled like a paragraph plus two
    // attributes. Notion keeps the colour in the block's FORMAT under `block_color` (default
    // "default") and the icon in a store; both are node attributes here, which keeps the
    // one-node-per-block invariant.
    callout: {
      group: "block",
      content: "inline*",
      attrs: {
        icon: { default: "💡" },
        color: { default: "default" },
      },
      parseDOM: [
        {
          tag: "div[data-callout]",
          getAttrs(dom) {
            return {
              icon: dom.getAttribute("data-icon") || "💡",
              color: dom.getAttribute("data-color") || "default",
            };
          },
        },
      ],
      toDOM(node) {
        return [
          "div",
          {
            "data-callout": "true",
            "data-icon": node.attrs.icon,
            "data-color": node.attrs.color,
            class: "yanoch-callout-text",
          },
          0,
        ];
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
  Heading4: "heading",
  BulletedListItem: "bulleted_list_item",
  NumberedListItem: "ordered_list_item",
  ToDo: "todo_item",
  Quote: "blockquote",
  Code: "code_block",
  Divider: "horizontal_rule",
  Image: "image",
  Toggle: "toggle",
  Callout: "callout",
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
  if (blockType === "Heading4") {
    return 4;
  }
  return 1;
}
