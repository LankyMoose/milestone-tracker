import { Portal, Transition, useEffect, useRequestUpdate } from "kaioken"
import { className as cls } from "kaioken/utils"
import { settingsOpen } from "../state"
import { DialogHeader } from "./dialog/DialogHeader"
import { Modal } from "./dialog/Modal"
import {
  KeybindModifier,
  keybindModifiers,
  keybindModifierText,
  onShortcutChanged,
  shortcuts,
} from "../shortcuts"

export function Settings() {
  const requestUpdate = useRequestUpdate()
  useEffect(() => onShortcutChanged(requestUpdate), [])
  return (
    <Portal container={document.getElementById("portal-root")!}>
      <Transition
        in={settingsOpen.value}
        element={(state) => {
          return (
            <Modal close={() => (settingsOpen.value = false)} state={state}>
              <DialogHeader>Settings</DialogHeader>
              <div className="flex flex-col gap-1 p-1 bg-black/30 rounded-md overflow-y-auto max-h-[60vh]">
                <div className="p-2">
                  <h1 className="font-bold">Keybinds</h1>
                  <ul className="flex flex-col gap-1 p-1 bg-black/30">
                    {Object.entries(shortcuts).map(([name, shortcut]) => (
                      <li
                        key={name}
                        className="p-2 flex justify-between gap-2 bg-white/5"
                      >
                        <span
                          className={cls(
                            "grow text-neutral-400 text-sm",
                            shortcut.disabled && "opacity-50"
                          )}
                        >
                          {shortcut.name}
                        </span>
                        <div className="flex gap-2">
                          <select
                            className={cls(
                              "px-2 text-center bg-[#0f0f0f] text-sm rounded",
                              shortcut.disabled && "opacity-50"
                            )}
                            disabled={shortcut.disabled}
                            value={shortcut.modifier}
                            onchange={(e) =>
                              (shortcut.modifier = e.target
                                .value as KeybindModifier)
                            }
                          >
                            {keybindModifiers.map((modifier) => (
                              <option key={modifier} value={modifier}>
                                {keybindModifierText(modifier)}
                              </option>
                            ))}
                          </select>
                          <span
                            className={cls(
                              "text-sm",
                              shortcut.disabled && "opacity-50"
                            )}
                          >
                            +
                          </span>
                          <input
                            type="text"
                            className={cls(
                              "px-2 w-14 text-center bg-[#0f0f0f] text-sm rounded",
                              shortcut.disabled && "opacity-50"
                            )}
                            disabled={shortcut.disabled}
                            value={shortcut.character}
                            onfocus={(e) =>
                              (e.target as HTMLInputElement)?.select()
                            }
                            onpaste={(e) => e.preventDefault()}
                            onkeydown={(e) => {
                              if (
                                e.target instanceof HTMLInputElement ===
                                  false ||
                                e.key === "Tab"
                              ) {
                                return
                              }
                              e.preventDefault()
                              if (e.key.length > 1) return

                              let value = e.key.toUpperCase()
                              if (value === " ") value = "Space"
                              e.target.value = shortcut.character = value
                              e.target.select()
                            }}
                            oninput={(e) => e.preventDefault()}
                          />
                        </div>
                        <input
                          type={"checkbox"}
                          checked={!shortcut.disabled}
                          onchange={(e) =>
                            (shortcut.disabled = !e.target.checked)
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Modal>
          )
        }}
      />
    </Portal>
  )
}
