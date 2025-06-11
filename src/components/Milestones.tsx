import { ElementProps, For, signal } from "kaioken"
import { createMilestone, Milestone, milestones } from "../state"
import { Button } from "./Button"

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

export function Milestones() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center p-4 bg-white/5 rounded">
      <h1 className="text-2xl font-bold">Milestones</h1>
      <ul className="flex flex-col gap-1 bg-black/50 p-1 rounded text-neutral-300">
        {editing.value ? (
          <For each={tempState}>
            {(milestone) => (
              <li
                key={milestone.id}
                className="flex items-center gap-2 bg-white/5 py-1 px-4 rounded"
              >
                <MilestoneEditor milestone={milestone} />
              </li>
            )}
          </For>
        ) : (
          <For each={milestones}>
            {(milestone) => (
              <li
                key={milestone.id}
                className="flex items-center gap-2 bg-white/5 py-1 px-4 rounded"
              >
                <MilestoneItem milestone={milestone} />
              </li>
            )}
          </For>
        )}
      </ul>
      {editing.value ? (
        <div className="flex gap-2 justify-end w-full">
          <Button onclick={addMilestone}>New Milestone</Button>
          <Button onclick={save}>Save</Button>
          <Button onclick={cancel}>Cancel</Button>
        </div>
      ) : (
        <div className="flex justify-end w-full">
          <Button onclick={beginEdit}>Edit</Button>
        </div>
      )}
    </div>
  )
}

function MilestoneEditor({ milestone }: { milestone: Milestone }) {
  const tempItem = tempState.value.find((m) => m.id === milestone.id)!

  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={tempItem.name}
            oninput={(e) => (tempItem.name = e.target.value)}
            className={"bg-black/30 px-2 grow"}
          />
        </div>
        <div className="flex gap-2">
          <NumberInput
            value={tempItem.time.hours}
            oninput={(e) => (tempItem.time.hours = Number(e.target.value))}
            min={0}
            max={23}
          />
          :
          <NumberInput
            id={`${milestone.id}_minutes`}
            value={tempItem.time.minutes}
            oninput={(e) => (tempItem.time.minutes = Number(e.target.value))}
            min={0}
            max={59}
          />
          :
          <NumberInput
            id={`${milestone.id}_seconds`}
            value={tempItem.time.seconds}
            oninput={(e) => (tempItem.time.seconds = Number(e.target.value))}
            min={0}
            max={59}
          />
        </div>
      </div>
      <Button
        onclick={() =>
          (tempState.value = tempState.value.filter(
            (m) => m.id !== milestone.id
          ))
        }
      >
        Delete
      </Button>
    </div>
  )
}

function MilestoneItem({ milestone }: { milestone: Milestone }) {
  return (
    <>
      <span className="font-bold grow">
        {milestone.name || "New Milestone"}
      </span>
      <span className="font-mono bg-black/40 px-2">
        {String(milestone.time.hours).padStart(2, "0")}:
        {String(milestone.time.minutes).padStart(2, "0")}:
        {String(milestone.time.seconds).padStart(2, "0")}
      </span>
    </>
  )
}

const NumberInput = (props: ElementProps<"input">) => {
  return (
    <input type="number" className={"w-auto bg-black/30 pl-2"} {...props} />
  )
}
