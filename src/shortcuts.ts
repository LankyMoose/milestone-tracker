import {
  register,
  ShortcutHandler,
  unregister,
  unregisterAll,
} from "@tauri-apps/plugin-global-shortcut"
import { watch } from "kaioken"
import {
  currentMilestone,
  handleMilestoneCompleted,
  isRunning,
  pauseRun,
  startOrResumeRun,
  selectedMilestoneSetId,
} from "./state"

const changeListeners: Set<() => void> = new Set()

export const onShortcutChanged = (callback: () => void) => {
  changeListeners.add(callback)
  return () => changeListeners.delete(callback)
}

export const keybindModifiers = ["Alt", "Shift", "CommandOrControl"] as const

export type KeybindModifier = (typeof keybindModifiers)[number]

export const keybindModifierText = (modifier: KeybindModifier) => {
  switch (modifier) {
    case "Alt":
    case "Shift":
      return modifier
    case "CommandOrControl":
      return "Cmd/Ctrl"
  }
}

export type ShortcutInstance = {
  name: string
  modifier: KeybindModifier
  character: string
  handler: ShortcutHandler
  disabled: boolean
  register: () => void
  unregister: () => void
}

type ShortcutConfig = {
  modifier: KeybindModifier
  character: string
  disabled: boolean
}

function defineShortcut({
  name,
  modifier,
  character,
  handler,
}: {
  name: string
  modifier: KeybindModifier
  character: string
  handler: () => void
}): ShortcutInstance {
  let registered = false
  let acted = false
  const storageKey = `shortcut:${name}`

  const configuration: ShortcutConfig = {
    modifier,
    character,
    disabled: false,
  }

  const fromStorage = localStorage.getItem(storageKey)
  if (fromStorage) {
    const parsed = JSON.parse(fromStorage) as ShortcutConfig
    Object.assign(configuration, parsed)
  }

  const saveToStorage = () => {
    localStorage.setItem(storageKey, JSON.stringify(configuration))
    changeListeners.forEach((cb) => cb())
  }

  return {
    name,
    get modifier() {
      return configuration.modifier
    },
    set modifier(value) {
      configuration.modifier = value
      saveToStorage()
    },
    get character() {
      return configuration.character
    },
    set character(value) {
      configuration.character = value
      saveToStorage()
    },
    get disabled() {
      return configuration.disabled
    },
    set disabled(value) {
      configuration.disabled = value
      saveToStorage()
    },
    handler(e) {
      if (configuration.disabled) return
      switch (e.state) {
        case "Pressed":
          if (acted) return
          acted = true
          handler()
          break
        case "Released":
          acted = false
          break
      }
    },
    register() {
      if (!registered) {
        registered = true
        register(
          `${configuration.modifier}+${configuration.character}`,
          this.handler
        )
      }
    },
    unregister() {
      if (registered) {
        registered = false
        unregister(`${configuration.modifier}+${configuration.character}`)
      }
    },
  }
}

export const shortcuts = {
  completeMilestone: defineShortcut({
    name: "Complete milestone",
    modifier: "Alt",
    character: "C",
    handler: () =>
      currentMilestone.value &&
      handleMilestoneCompleted(currentMilestone.value),
  }),
  togglePause: defineShortcut({
    name: "Toggle Pause",
    modifier: "Alt",
    character: "P",
    handler: () => (isRunning.value ? pauseRun() : startOrResumeRun()),
  }),
}

unregisterAll().then(() => {
  watch(() => {
    if (selectedMilestoneSetId.value) {
      shortcuts.togglePause.register()
    } else {
      shortcuts.togglePause.unregister()
    }
  })

  watch(() => {
    if (isRunning.value) {
      shortcuts.completeMilestone.register()
    } else {
      shortcuts.completeMilestone.unregister()
    }
  })
})
