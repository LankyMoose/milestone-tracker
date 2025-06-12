import { For, useComputed } from "kaioken"
import {
  createMilestoneSet,
  milestoneData,
  milestoneSetEditing,
  selectedMilestoneSetId,
} from "../state"
import { Button } from "./Button"
import { EditIcon } from "./icons/EditIcon"
import { PlayIcon } from "./icons/PlayIcon"

export function MilestoneSets() {
  const sets = useComputed(() => Object.entries(milestoneData.value))
  console.log(sets.value)
  return (
    <div className="flex flex-col gap-4 p-4 bg-white/5 rounded">
      <div className="flex gap-4 justify-between items-center">
        <h1 className="text-2xl font-bold">Milestone Sets</h1>
        <Button
          className="flex items-center justify-center w-8"
          onclick={() => createMilestoneSet()}
        >
          +
        </Button>
      </div>
      <ul className="flex flex-col gap-1 bg-black/25 p-1 text-xs rounded-md">
        <For each={sets}>
          {([id, set]) => (
            <li className="w-full text-left rounded p-4 flex items-center gap-2 justify-between bg-white/5">
              <div className="font-bold">{set.name}</div>
              <div className="flex gap-4">
                <button
                  className="cursor-pointer opacity-75 hover:opacity-100"
                  onclick={() => (milestoneSetEditing.value = id)}
                >
                  <EditIcon />
                </button>

                <button
                  className="cursor-pointer opacity-75 hover:opacity-100"
                  onclick={() => (selectedMilestoneSetId.value = id)}
                >
                  <PlayIcon />
                </button>
              </div>
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}
