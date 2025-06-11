import { ElementProps, For, signal } from "kaioken"
import {
  createMilestone,
  currentMilestone,
  currentMilestoneIndex,
  currentTime,
  interval,
  isActive,
  Milestone,
  milestones,
  Time,
} from "../state"
import { Button } from "./Button"
import { formatTime } from "../utils"

const editing = signal(false)

const tempState = signal<Milestone[]>([])

const save = () => {
  milestones.value = tempState.value
  editing.value = false
}

const cancel = () => {
  editing.value = false
  tempState.value = []
}

const beginEdit = () => {
  editing.value = true
  tempState.value = structuredClone(milestones.value)
}

const addMilestone = () => {
  const newMilestone = structuredClone(createMilestone())
  tempState.value.push(newMilestone)
}

const clearPBs = () => {
  tempState.value = tempState.value.map((m) => ({
    ...m,
    personalBest: null,
  }))
}

export function Milestones() {
  const current = currentMilestone.value
  return (
    <div className="flex flex-col gap-4 justify-center items-center p-4 bg-white/5 rounded">
      <h1 className="text-2xl font-bold">Milestones</h1>
      {isActive.value ? (
        <>
          <div className="flex flex-col gap-2 bg-black/50 p-1 rounded text-neutral-300">
            <div className="flex items-center gap-2 bg-white/5 py-1 px-4 rounded">
              <div className="font-bold">{current.name}</div>
              <div className="font-mono px-2">
                Target: <SimpleTimeDisplay time={current.time} />
              </div>
              <div className="font-mono px-2">
                PB: <SimpleTimeDisplay time={current.personalBest} />
              </div>
              <Button
                onclick={() => {
                  const totalMs =
                    current.personalBest === null
                      ? Infinity
                      : current.personalBest.hours * 60 * 60 * 1000 +
                        current.personalBest.minutes * 60 * 1000 +
                        current.personalBest.seconds * 1000 +
                        current.personalBest.hundredths * 10
                  if (currentTime.value < totalMs) {
                    const time = formatTime(currentTime.value)
                    milestones.value = milestones.value.map((m) => ({
                      ...m,
                      personalBest: m.id === current.id ? time : m.personalBest,
                    }))
                  }
                  if (
                    currentMilestoneIndex.value ===
                    milestones.value.length - 1
                  ) {
                    currentMilestoneIndex.value = 0
                    currentTime.value = 0
                    clearInterval(interval.value)
                    interval.value = -1
                    alert("All milestones completed!")
                  } else {
                    currentMilestoneIndex.value = Math.min(
                      milestones.value.length - 1,
                      currentMilestoneIndex.value + 1
                    )
                  }
                }}
              >
                Complete
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
            }}
            // @ts-ignore (not present in kaioken types)
            cellSpacing="0"
            className="gap-1 p-1 bg-black/50 rounded text-neutral-300"
          >
            {editing.value ? (
              <>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Hours</th>
                    <th>Minutes</th>
                    <th>Seconds</th>
                    <th>PB</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <For each={tempState}>
                    {(milestone) => (
                      <tr key={milestone.id} className="even:bg-white/5">
                        <MilestoneEditor milestone={milestone} />
                      </tr>
                    )}
                  </For>
                </tbody>
              </>
            ) : (
              <>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Target</th>
                    <th>PB</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={milestones}>
                    {(milestone) => (
                      <tr key={milestone.id} className="even:bg-white/5">
                        <MilestoneItem milestone={milestone} />
                      </tr>
                    )}
                  </For>
                </tbody>
              </>
            )}
          </table>
          {editing.value ? (
            <div className="flex gap-2 justify-end w-full">
              <Button onclick={clearPBs}>Clear PBs</Button>
              <Button onclick={addMilestone}>New Milestone</Button>
              <Button onclick={save}>Save</Button>
              <Button onclick={cancel}>Cancel</Button>
            </div>
          ) : (
            <div className="flex justify-end w-full">
              <Button onclick={beginEdit}>Edit</Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function MilestoneEditor({ milestone }: { milestone: Milestone }) {
  const tempItem = tempState.value.find((m) => m.id === milestone.id)!

  return (
    <>
      <td>
        <input
          type="text"
          value={tempItem.name}
          oninput={(e) => (tempItem.name = e.target.value)}
          className={"bg-black/30 px-2 grow"}
        />
      </td>
      <td>
        <NumberInput
          value={tempItem.time.hours}
          oninput={(e) => (tempItem.time.hours = Number(e.target.value))}
          min={0}
          max={23}
        />
      </td>
      <td>
        <NumberInput
          id={`${milestone.id}_minutes`}
          value={tempItem.time.minutes}
          oninput={(e) => (tempItem.time.minutes = Number(e.target.value))}
          min={0}
          max={59}
        />
      </td>
      <td>
        <NumberInput
          id={`${milestone.id}_seconds`}
          value={tempItem.time.seconds}
          oninput={(e) => (tempItem.time.seconds = Number(e.target.value))}
          min={0}
          max={59}
        />
      </td>
      <td>
        <SimpleTimeDisplay time={tempItem.personalBest} />
      </td>
      <td>
        <Button
          onclick={() =>
            (tempState.value = tempState.value.filter(
              (m) => m.id !== milestone.id
            ))
          }
        >
          Delete
        </Button>
        <Button
          onclick={() =>
            (tempState.value = tempState.value.map((m) => {
              if (m.id === milestone.id) {
                return { ...m, personalBest: null }
              }
              return m
            }))
          }
        >
          Reset PB
        </Button>
      </td>
    </>
  )
}

function MilestoneItem({ milestone }: { milestone: Milestone }) {
  return (
    <>
      <td className="font-bold">{milestone.name || "New Milestone"}</td>
      <td className="font-mono bg-black/40 px-2">
        {String(milestone.time.hours).padStart(2, "0")}:
        {String(milestone.time.minutes).padStart(2, "0")}:
        {String(milestone.time.seconds).padStart(2, "0")}
      </td>
      <td>
        <SimpleTimeDisplay time={milestone.personalBest} />
      </td>
    </>
  )
}

const NumberInput = (props: ElementProps<"input">) => {
  return (
    <input type="number" className={"w-auto bg-black/30 pl-2"} {...props} />
  )
}

function SimpleTimeDisplay(props: {
  time: Omit<Time, "hundredths"> | Time | null
}) {
  if (props.time === null) {
    return <span className="font-mono bg-black/40 px-2 grow">N/A</span>
  }
  const { hours, minutes, seconds } = props.time
  let str = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`
  if ("hundredths" in props.time) {
    str += `.${String(props.time.hundredths).padStart(2, "0")}`
  }
  return <span className="font-mono bg-black/40 px-2">{str}</span>
}
