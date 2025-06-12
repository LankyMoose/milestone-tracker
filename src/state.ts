import { computed, signal } from "kaioken"

export const currentTime = signal(0) // Accumulated time in ms
export const isActive = computed(() => currentTime.value > 0)
export const isInactive = computed(() => currentTime.value === 0)
export const interval = signal(-1) // Interval ID or -1 if stopped
export const isRunning = computed(() => interval.value !== -1)
export const notRunning = computed(() => interval.value === -1)

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

export const MILESTONES_STORAGE_KEY = "milestones"

const stored = localStorage.getItem(MILESTONES_STORAGE_KEY)
const initialMilestones = stored ? JSON.parse(stored) : []
export const milestones = signal<Milestone[]>(initialMilestones)

export const currentMilestoneIndex = signal(0)
export const currentMilestone = computed(
  () => milestones.value[currentMilestoneIndex.value]
)

milestones.subscribe((m) =>
  localStorage.setItem(MILESTONES_STORAGE_KEY, JSON.stringify(m))
)

export const createMilestone = () => {
  const newMilestone: Milestone = {
    id: crypto.randomUUID(),
    name: "",
    time: { hours: 0, minutes: 0, seconds: 0 },
    personalBest: null,
    note: "",
  }
  milestones.value.push(newMilestone)
  milestones.notify()
  return newMilestone
}
