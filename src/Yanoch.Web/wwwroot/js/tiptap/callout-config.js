// ─── Callout type definitions ──────────────────────────────────
export const calloutTypes = [
  { id: 'info',    icon: '💡',  label: 'Info',    color: '#2383e2' },
  { id: 'warning', icon: '⚠️', label: 'Warning', color: '#e5484d' },
  { id: 'success', icon: '✅', label: 'Success', color: '#2ea043' },
  { id: 'error',   icon: '❌', label: 'Error',   color: '#e5484d' },
  { id: 'gray',    icon: '⚪', label: 'Gray',    color: '#9b9b9b' },
  { id: 'brown',   icon: '🟤', label: 'Brown',   color: '#a07850' },
  { id: 'orange',  icon: '🟠', label: 'Orange',  color: '#ffa500' },
  { id: 'yellow',  icon: '🟡', label: 'Yellow',  color: '#ffd200' },
  { id: 'green',   icon: '🟢', label: 'Green',   color: '#00c864' },
  { id: 'blue',    icon: '🔵', label: 'Blue',    color: '#2383e2' },
  { id: 'purple',  icon: '🟣', label: 'Purple',  color: '#a050c8' },
  { id: 'pink',    icon: '🩷', label: 'Pink',    color: '#dc50a0' },
  { id: 'red',     icon: '🔴', label: 'Red',     color: '#e5484d' },
]

export const typeById = Object.fromEntries(calloutTypes.map(t => [t.id, t]))

// ─── Callout emoji palette ─────────────────────────────────────
export const calloutEmojis = [
  '💡','ℹ️','❓','🔥','⭐','🎯','📌','📎','✏️','📖',
  '❤️','💚','💙','💜','🧡','🖤','🤍','💛','💗','🤎',
  '✅','❌','⚠️','🚀','📝','🔒','🔓','👀','💪','🧠',
  '🎨','🎵','📷','🔧','⚙️','🔗','📊','📁','🏠','🌍',
  '☀️','🌙','☁️','🌈','💧','🌱','🌸','🍀','🎉','🔴',
]
