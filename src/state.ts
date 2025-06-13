import { computed, signal, watch } from "kaioken"
import { formatTime } from "./utils"

const VERSION = 0.2

export const settingsOpen = signal(false)

export const currentTime = signal(0) // Accumulated time in ms
export const isActive = computed(() => currentTime.value > 0)
export const isInactive = computed(() => currentTime.value === 0)
export const interval = signal(-1) // Interval ID or -1 if stopped
export const isRunning = computed(() => interval.value !== -1)
export const currentRunData = signal<RunData | null>(null)

export type RunData = {
  date: string
  times: number[]
}

export type Time = {
  raw: number
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
  runHistory?: RunData[]
}

export type MilestoneSetsData = {
  [key: string]: MilestoneSet
}

export const MILESTONES_STORAGE_KEY = "milestones"

const upgradeSet = (data: MilestoneSet) => {
  let didPerformUpgrade = false
  let maxIters = 1_000
  let i = 0

  while (data.version < VERSION && ++i < maxIters) {
    switch (data.version) {
      case 0.1:
        data.milestones.forEach((milestone) => {
          const { time, personalBest } = milestone
          time.raw =
            time.hours * 3600000 + time.minutes * 60000 + time.seconds * 1000
          if (personalBest) {
            personalBest.raw =
              personalBest.hours * 3600000 +
              personalBest.minutes * 60000 +
              personalBest.seconds * 1000
          }
        })
        data.version = 0.2
        didPerformUpgrade = true
        break
    }
  }
  return didPerformUpgrade
}

const stored = localStorage.getItem(MILESTONES_STORAGE_KEY)
const defaultMilestoneSetsData: MilestoneSetsData = {}

const initialMilestones = stored
  ? (() => {
      const parsed = JSON.parse(stored)
      if (typeof parsed !== "object") return defaultMilestoneSetsData
      let needsReSave = false
      for (const id in parsed) {
        if (upgradeSet(parsed[id])) {
          needsReSave = true
        }
      }
      if (needsReSave) {
        localStorage.setItem(MILESTONES_STORAGE_KEY, JSON.stringify(parsed))
      }
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

watch(() => {
  if (selectedMilestoneSetId.value !== null) {
    currentRunData.value = {
      date: new Date().toISOString(),
      times: [],
    }
  }
})

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
            upgradeSet(parsed)
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

export const handleMilestoneCompleted = () => {
  const sets = milestoneData.value
  const selected = selectedMilestoneSetId.value
  if (selected === null) {
    return
  }
  const currentSet = sets[selected]
  currentRunData.value!.times.push(currentTime.value)
  currentRunData.notify()

  if (currentMilestoneIndex.value === currentSet.milestones.length - 1) {
    finishRun()
    // TODO: replace with native dialog
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
  const setId = selectedMilestoneSetId.value
  if (!setId) return
  const set = milestoneData.value[setId]

  currentMilestoneIndex.value = 0
  currentTime.value = 0
  clearInterval(interval.value)
  interval.value = -1
  milestoneData.value = {
    ...milestoneData.value,
    [setId]: {
      ...set,
      milestones: set.milestones.map((milestone, i) => {
        const time = (currentRunData.value?.times ?? [])[i]
        if (time === undefined) return milestone

        const formattedTime = formatTime(time)
        const bestMs = milestone.personalBest?.raw ?? Infinity

        if (time < bestMs) {
          return {
            ...milestone,
            personalBest: formattedTime,
          }
        }
        return milestone
      }),
      runHistory: set.runHistory
        ? [...set.runHistory, currentRunData.value!]
        : [currentRunData.value!],
    },
  }
  currentRunData.value = null
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
