import { Node, createBlockMarkdownSpec } from '@tiptap/core'
import { typeById } from './callout-config.js'

// Markdown bridge — ::callout {type:"info" icon:"💡"} ::: fenced syntax
const calloutMd = createBlockMarkdownSpec({
  nodeName: 'callout',
  name: 'callout',
  content: 'block',
  defaultAttributes: { type: 'info' },
  allowedAttributes: ['type', 'icon'],
})

export const Callout = Node.create({
  name: 'callout',
  content: 'block+',
  group: 'block',
  defining: true,
  addAttributes() {
    return {
      type: { default: 'info' },
      icon: { default: '' },
    }
  },
  parseHTML() {
    return [{
      tag: 'div[data-callout]',
      getAttrs: el => ({
        type: (el.getAttribute('data-type') || 'info').toLowerCase(),
        icon: el.getAttribute('data-icon') || '',
      }),
    }]
  },
  renderHTML({ HTMLAttributes }) {
    const type = HTMLAttributes.type || 'info'
    const defaultIcon = (typeById[type] || typeById.info).icon
    const icon = HTMLAttributes.icon || defaultIcon
    return ['div', { 'data-callout': '', 'data-type': type, 'data-icon': icon, class: 'callout callout--' + type },
      ['div', { class: 'callout-side', contenteditable: 'false' },
        ['button', { class: 'callout-icon-btn', 'data-callout-icon': '', type: 'button' }, icon],
        ['button', { class: 'callout-color-btn', 'data-callout-color': '', type: 'button' },
          ['span', { class: 'callout-color-dot' }, ''],
        ],
      ],
      ['div', { class: 'callout-content' }, 0],
    ]
  },
  addCommands() {
    return {
      setCallout: (attrs = {}) => ({ commands }) => {
        return commands.wrapIn(this.name, attrs)
      },
    }
  },
  ...calloutMd,
})
