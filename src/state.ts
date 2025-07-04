import { computed, signal, watch } from "kaioken"
import { formatTime } from "./utils"

const VERSION = 0.1

export const settingsOpen = signal(false)

export const currentTime = signal(0) // Accumulated time in ms
export const isActive = computed(() => currentTime.value > 0)
export const isInactive = computed(() => currentTime.value === 0)
export const interval = signal(-1) // Interval ID or -1 if stopped
export const isRunning = computed(() => interval.value !== -1)

export type Time = {
  hours: number
  minutes: number
  seconds: number
  hundredths: number
}

export type Milestone = {
  id: string
  name: string
  time: Omit<Time, "hundredths">
  personalBest: Time | null
  note: string
}

export type MilestoneSet = {
  version: number
  name: string
  milestones: Milestone[]
}

export type MilestoneSetsData = {
  [key: string]: MilestoneSet
}

export const MILESTONES_STORAGE_KEY = "milestones"

const stored = localStorage.getItem(MILESTONES_STORAGE_KEY)
const defaultMilestoneSetsData: MilestoneSetsData = {}

const initialMilestones = stored
  ? (() => {
      const parsed = JSON.parse(stored)
      if (typeof parsed !== "object") return defaultMilestoneSetsData
      return parsed
    })()
  : defaultMilestoneSetsData

export const milestoneData = signal<MilestoneSetsData>(initialMilestones)
milestoneData.subscribe((m) =>
  localStorage.setItem(MILESTONES_STORAGE_KEY, JSON.stringify(m))
)

export const milestoneSetEditing = signal<string | null>(null)
export const currentMilestoneIndex = signal(0)
export const selectedMilestoneSetId = signal<string | null>(null)
export const currentMilestone = computed(() => {
  const sets = milestoneData.value,
    selected = selectedMilestoneSetId.value,
    idx = currentMilestoneIndex.value
  if (selected === null) {
    return null
  }
  return sets[selected].milestones[idx] || null
})

watch(() => {
  const editing = milestoneSetEditing.value !== null,
    selected = selectedMilestoneSetId.value !== null
  if (editing || selected) {
    document.body.style.overflow = "hidden"
  } else {
    document.body.style.overflow = ""
  }
})

export const createMilestoneSet = () => {
  const id = crypto.randomUUID()
  const sets = milestoneData.value
  milestoneData.value = {
    ...sets,
    [id]: {
      version: VERSION,
      name: "New Set",
      milestones: [],
    },
  }
  milestoneSetEditing.value = id
}

export const fileUtils = {
  exportSet: (set: MilestoneSet) => {
    const json = JSON.stringify(set, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${set.name}.json`
    a.click()
    URL.revokeObjectURL(url)
  },
  importSet: () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = () => {
          let parsed: MilestoneSet
          try {
            parsed = JSON.parse(reader.result as string)
            if (
              !parsed.version ||
              typeof parsed.version !== "number" ||
              parsed.version < 0 ||
              parsed.version > VERSION
            ) {
              throw "Incompatible file data"
            }

            // migrate
            // let currentVersion = parsed.version
            // let maxIters = 1_000
            // let i = 0
            // while (currentVersion < VERSION && ++i < maxIters) {
            //   switch (currentVersion) {
            //     case 0.1:
            //       break
            //   }
            // }
          } catch (error) {
            alert(error)
            return
          }

          milestoneData.value = {
            ...milestoneData.value,
            [crypto.randomUUID()]: parsed,
          }
        }
      }
    }
    input.click()
  },
}

export const handleMilestoneCompleted = (milestone: Milestone) => {
  const sets = milestoneData.value
  const selected = selectedMilestoneSetId.value
  if (selected === null) {
    return
  }

  const totalMs =
    milestone.personalBest === null
      ? Infinity
      : milestone.personalBest.hours * 60 * 60 * 1000 +
        milestone.personalBest.minutes * 60 * 1000 +
        milestone.personalBest.seconds * 1000 +
        milestone.personalBest.hundredths * 10

  const currentSet = sets[selected]
  if (currentTime.value < totalMs) {
    const time = formatTime(currentTime.value)
    milestoneData.value = {
      ...sets,
      [selected]: {
        ...currentSet,
        milestones: currentSet.milestones.map((m) => {
          if (m.id === milestone.id) {
            return {
              ...m,
              personalBest: time,
            }
          }
          return m
        }),
      },
    }
  }
  if (currentMilestoneIndex.value === currentSet.milestones.length - 1) {
    finishRun()
    alert("All milestones completed!")
  } else {
    currentMilestoneIndex.value++
  }
}

export function pauseRun() {
  clearInterval(interval.value)
  interval.value = -1
}

export function finishRun() {
  currentMilestoneIndex.value = 0
  currentTime.value = 0
  clearInterval(interval.value)
  interval.value = -1
}

const offset = {
  current: 0,
}

export function startOrResumeRun() {
  if (interval.value === -1) {
    offset.current = performance.now()
    interval.value = window.setInterval(() => {
      const now = performance.now()
      const delta = now - offset.current
      offset.current = now
      currentTime.value += delta
    }, 1000 / 60)
  }
}
