import { ShortcutInstance, keybindModifierText } from "../shortcuts"

export function ShortcutBadge({
  shortcut,
  replacer = <span innerHTML="&nbsp;" />,
}: {
  shortcut: ShortcutInstance | null
  replacer?: JSX.Element
}) {
  if (shortcut === null || shortcut.disabled) {
    return replacer
  }
  return (
    <span
      className="bg-white opacity-40 px-1 rounded text-neutral-800 font-bold text-[12px]"
      innerHTML={`${keybindModifierText(shortcut.modifier)}+${
        shortcut.character
      }`}
    />
  )
}
